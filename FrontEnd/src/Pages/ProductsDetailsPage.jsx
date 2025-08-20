import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useProductStore from "../store/productStore";
import useCartStore from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";


const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { product, fetchProductById, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to cart!");
      return;
    }
    try {
      await addToCart(productId, product?.isCarton ? 1 : quantity);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.message || "Error adding to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#F0F4C3] to-[#FFEBEE] pt-20 px-4 sm:px-6 lg:px-8">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12">
        {isLoading ? (
          <div className="text-center text-gray-600 font-medium">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">Error: {error}</div>
        ) : product ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl p-6 md:p-8 border border-white/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img
                src={product.imageUrl || "https://via.placeholder.com/400"}
                alt={product.name}
                className="w-full h-64 md:h-full object-cover rounded-xl shadow-md"
              />

              <div className="flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0D47A1] mb-3">{product.name}</h1>
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
                    {product.description || "No description provided."}
                  </p>

                  <p className="text-xl font-bold text-[#0D47A1] mb-2">
                    Rs.{" "}
                    {user?.role === "dealer"
                      ? (product.price * (1 - (product.dealerDiscountRate || 0) / 100)).toFixed(2)
                      : product.price}
                  </p>

                  <p className="text-sm text-gray-600 mb-1">Stock: {product.stock}</p>

                  {user?.role === "dealer" && (
                    <p className="text-sm text-gray-600 mb-4">
                      Dealer Discount: {product.dealerDiscountRate || 0}%
                    </p>
                  )}

                  {!product.isCarton && (
                    <div className="mb-4">
                      <label className="text-sm text-gray-700 font-medium">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="ml-3 w-20 px-3 py-1 border rounded-lg bg-gray-100 focus:outline-none"
                        disabled={product.stock < 1}
                      />
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  disabled={product.stock < 1}
                  whileHover={{ scale: product.stock < 1 ? 1 : 1.05 }}
                  whileTap={{ scale: product.stock < 1 ? 1 : 0.95 }}
                  className={`mt-6 py-2 px-6 rounded-xl text-white font-semibold text-sm transition 
                    ${
                      product.stock < 1
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0D47A1] to-[#1976D2] hover:from-[#1565C0] hover:to-[#0D47A1]"
                    }`}
                >
                  {product.isCarton ? "Add Carton to Cart" : "Add to Cart"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-gray-600">Product not found.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
