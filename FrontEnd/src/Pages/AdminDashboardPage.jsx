import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import useProductStore from "../store/productStore";
import { Loader, User } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../Components/NavBar";

const AdminDashboardPage = () => {
  const {
    user,
    getPendingDealers,
    approveDealer,
    rejectDealer,
    pendingDealers,
    isLoading: authLoading,
    error: authError,
  } = useAuthStore();
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    isLoading: productLoading,
    error: productError,
  } = useProductStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    dealerDiscountRate: "",
    isCarton: false,
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [discountRates, setDiscountRates] = useState({});

  const fetchData = useCallback(async () => {
    if (user?.role === "admin") {
      try {
        if (typeof getPendingDealers === "function") await getPendingDealers();
        if (typeof fetchProducts === "function") await fetchProducts();
      } catch (e) {
        console.error("Error in fetchData:", e);
      }
    }
  }, [user, getPendingDealers, fetchProducts]);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  const validateDiscountRate = (value) => {
    if (value === "") return true;
    const num = Number(value);
    return num >= 0 && num <= 100;
  };

  const handleApprove = async (userId) => {
    const bulkDiscountRate = discountRates[userId] || "";
    if (!validateDiscountRate(bulkDiscountRate)) {
      toast.error("Discount rate must be between 0 and 100!");
      return;
    }
    try {
      await approveDealer(
        userId,
        bulkDiscountRate ? Number(bulkDiscountRate) : 0
      );
      toast.success("Dealer approved successfully!");
      getPendingDealers();
    } catch (error) {
      toast.error(error.message || "Error approving dealer");
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectDealer(userId);
      toast.success("Dealer request rejected!");
      getPendingDealers();
    } catch (error) {
      toast.error(error.message || "Error rejecting dealer");
    }
  };

  const handleDiscountChange = (userId, value) => {
    setDiscountRates((prev) => ({ ...prev, [userId]: value }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, formData);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully!");
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        dealerDiscountRate: "",
        isCarton: false,
      });
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || "Error saving product");
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      dealerDiscountRate: product.dealerDiscountRate || "",
      isCarton: product.isCarton,
    });
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      toast.error(error.message || "Error deleting product");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h2 className="text-4xl font-extrabold mb-6 text-red-600">
            Access Denied
          </h2>
          <p className="text-lg text-gray-700">
            This page is only accessible to admins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <Navbar />
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text tracking-tight">
          Admin Dashboard
        </h1>

        {(authLoading || productLoading) ? (
          <div className="text-center py-20">
            <Loader className="mx-auto h-10 w-10 animate-spin text-green-500" />
            <p className="mt-4 text-lg text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        ) : (authError || productError) ? (
          <div className="text-center text-red-600 py-16">
            <p className="mb-4 font-semibold text-xl">Error loading dashboard:</p>
            {authError && <p className="mb-2">Auth Error: {authError}</p>}
            {productError && <p className="mb-2">Product Error: {productError}</p>}
            <button
              onClick={fetchData}
              className="mt-6 inline-block py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Manage Products Section */}
            <section className="mb-14">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                Manage Products
              </h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-200"
              >
                <h3 className="text-2xl font-bold mb-6 text-emerald-600 tracking-wide">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h3>
                <form onSubmit={handleProductSubmit} className="space-y-5">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full py-3 px-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full py-3 px-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full py-3 px-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                      required
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full py-3 px-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                      required
                      min="0"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full py-3 px-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Dealer Discount Rate (%)"
                    value={formData.dealerDiscountRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dealerDiscountRate: e.target.value,
                      })
                    }
                    className="w-full py-3 px-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    min="0"
                    max="100"
                  />
                  <label className="flex items-center space-x-3 mt-3 mb-6">
                    <input
                      type="checkbox"
                      checked={formData.isCarton}
                      onChange={(e) =>
                        setFormData({ ...formData, isCarton: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-emerald-400"
                    />
                    <span className="text-gray-700 font-medium">
                      Is Carton (Water Bottles, 12 pieces)
                    </span>
                  </label>
                  <motion.button
                    type="submit"
                    className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-semibold rounded-lg shadow-md transition"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {editingProductId ? "Update Product" : "Add Product"}
                  </motion.button>
                </form>
              </motion.div>
            </section>

            {/* Product List Section */}
            <section className="mb-14">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                Product List
              </h2>
              {Array.isArray(products) && products.length === 0 ? (
                <p className="text-center text-gray-600 italic">
                  No products available. Add a product above.
                </p>
              ) : Array.isArray(products) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-md p-5 flex flex-col"
                    >
                      <img
                        src={product.imageUrl || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-gray-700 mb-1">Price: Rs. {product.price}</p>
                        <p className="text-gray-700 mb-1">Stock: {product.stock}</p>
                        <p className="text-gray-700">
                          Dealer Discount: {product.dealerDiscountRate || 0}%
                        </p>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <motion.button
                          onClick={() => handleEdit(product)}
                          className="flex-grow py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(product._id)}
                          className="flex-grow py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-red-600 font-semibold">
                  Error: Invalid product data
                </p>
              )}
            </section>

            {/* Pending Dealer Requests Section */}
            <section>
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                Pending Dealer Requests
              </h2>
              {Array.isArray(pendingDealers) && pendingDealers.length === 0 ? (
                <p className="text-center text-gray-600 italic">
                  No pending dealer requests.
                </p>
              ) : Array.isArray(pendingDealers) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingDealers.map((dealer) => (
                    <motion.div
                      key={dealer._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-5 bg-white rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-center"
                    >
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <User className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-gray-800 font-medium">{dealer.email}</p>
                          <p className="text-gray-600 text-sm">{dealer.companyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          placeholder="Discount Rate (%)"
                          value={discountRates[dealer._id] || ""}
                          onChange={(e) =>
                            handleDiscountChange(dealer._id, e.target.value)
                          }
                          className="w-28 py-2 px-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition text-gray-800 font-semibold"
                          min="0"
                          max="100"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(dealer._id)}
                          className="py-2 px-5 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition"
                        >
                          Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(dealer._id)}
                          className="py-2 px-5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
                        >
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-red-600 font-semibold">
                  Error: Invalid dealer data
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
