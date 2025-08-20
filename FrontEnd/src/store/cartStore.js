import { create } from "zustand";
import axios from "axios";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const useCartStore = create((set) => ({
  cart: { items: [] },
  isLoading: false,
  error: null,

  fetchCart: debounce(async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("http://localhost:5000/api/cart", { withCredentials: true });
      set({ cart: response.data.cart || { items: [] }, isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch cart";
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching cart:", error);
      throw new Error(errorMessage);
    }
  }, 300),

  addToCart: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity },
        { withCredentials: true }
      );
      set({ cart: response.data.cart || { items: [] }, isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add to cart";
      set({ error: errorMessage, isLoading: false });
      console.error("Error adding to cart:", error);
      throw new Error(errorMessage);
    }
  },

  removeFromCart: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        withCredentials: true,
      });
      set({ cart: response.data.cart || { items: [] }, isLoading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to remove from cart";
      set({ error: errorMessage, isLoading: false });
      console.error("Error removing from cart:", error);
      throw new Error(errorMessage);
    }
  },
}));

export default useCartStore;