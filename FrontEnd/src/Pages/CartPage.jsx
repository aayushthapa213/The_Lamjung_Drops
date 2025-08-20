import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import useCartStore from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";

const CartPage = () => {
  const { cart, fetchCart, removeFromCart, isLoading, error } = useCartStore();
  const { user } = useAuthStore();

  const stableFetchCart = useCallback(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  useEffect(() => {
    stableFetchCart();
  }, [stableFetchCart]);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Removed from cart!");
    } catch (error) {
      toast.error(error.message || "Error removing from cart");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#F0F4C3]">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <p className="text-lg text-gray-700 font-medium">
            Please log in to view your cart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#FFEBEE]">
      <Navbar />
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-transparent bg-clip-text">
          Your Cart
        </h1>

        {isLoading && !cart ? (
          <div className="text-center text-gray-600">Loading cart...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">Error: {error}</div>
        ) : !cart || cart.items.length === 0 ? (
          <p className="text-center text-gray-700 text-lg font-medium">Your cart is currently empty.</p>
        ) : (
          <div className="grid gap-6">
            {cart.items.map((item) => (
              <motion.div
                key={item.productId._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-5 flex flex-col md:flex-row items-center gap-4 md:gap-6"
              >
                <img
                  src={item.productId.imageUrl || "https://via.placeholder.com/150"}
                  alt={item.productId.name}
                  className="w-24 h-24 object-cover rounded-xl shadow"
                />

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-[#0D47A1] mb-1">{item.productId.name}</h3>
                  <p className="text-gray-700 mb-1">
                    Rs.{" "}
                    {user?.role === "dealer"
                      ? (
                          item.productId.price *
                          (1 - (item.productId.dealerDiscountRate || 0) / 100)
                        ).toFixed(2)
                      : item.productId.price}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Quantity:{" "}
                    {item.productId.isCarton
                      ? `${item.quantity} Carton${item.quantity > 1 ? "s" : ""} (${item.quantity * 12} pieces)`
                      : item.quantity}
                  </p>
                </div>

                <motion.button
                  onClick={() => handleRemove(item.productId._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 md:mt-0 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-xl transition"
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
