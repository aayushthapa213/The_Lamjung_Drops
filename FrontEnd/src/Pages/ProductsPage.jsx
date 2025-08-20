import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useProductStore from "../store/productStore";
import useCartStore from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";

const ProductsPage = () => {
  const { products, fetchProducts, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId, isCarton) => {
    if (!user) {
      toast.error("Please log in to add items to cart!");
      return;
    }
    try {
      await addToCart(productId, isCarton ? 1 : 1);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.message || "Error adding to cart");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br pt-20 from-[#E3F2FD] via-[#F0F4C3] to-[#FFEBEE] p-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Navbar transparent={false} />

      {/* ✅ Padding added here to give space before Footer */}
      <div className="max-w-6xl mx-auto pb-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-[#0D47A1] drop-shadow-md tracking-wide">
          Explore Our Products
        </h1>

        {isLoading ? (
          <p className="text-center text-gray-600 font-semibold">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-semibold">{`Error: ${error}`}</p>
        ) : Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const dealerPrice = (
                product.price *
                (1 - (product.dealerDiscountRate || 0) / 100)
              ).toFixed(2);
              const showDealerPrice =
                user?.role === "dealer" && product.dealerDiscountRate > 0;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 20px rgba(13,71,161,0.25)",
                  }}
                  className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-md p-4 flex flex-col border border-white/30"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 shadow-sm">
                    <img
                      src={
                        product.imageUrl ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                    {showDealerPrice && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#FF3C3C] text-white font-semibold text-xs shadow select-none">
                        {product.dealerDiscountRate}% OFF
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-xl font-bold text-[#0D47A1] mb-1 truncate"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <p
                    className="text-gray-700 flex-grow mb-4 line-clamp-2"
                    style={{ letterSpacing: "0.01em", fontSize: "0.875rem" }}
                  >
                    {product.description || "No description available."}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    {showDealerPrice ? (
                      <div>
                        <p className="line-through text-gray-400 text-xs">
                          Rs. {product.price}
                        </p>
                        <p className="text-[#FF3C3C] font-extrabold text-2xl tracking-tight">
                          Rs. {dealerPrice}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[#0D47A1] font-extrabold text-2xl tracking-tight">
                        Rs. {product.price}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/products/${product._id}`}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white font-semibold text-center shadow hover:from-[#1565C0] hover:to-[#0D47A1] transition text-sm"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() =>
                        handleAddToCart(product._id, product.isCarton)
                      }
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#FF3C3C] to-[#E53935] text-white font-semibold shadow hover:from-[#D32F2F] hover:to-[#B71C1C] transition text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600 font-semibold">
            No products available.
          </p>
        )}
      </div>

      {/* ✅ Footer stays below with clean spacing above */}
      <Footer />
    </div>
  );
};

export default ProductsPage;
