import { create } from "zustand";
import axios from "axios";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const useProductStore = create((set) => ({
  products: [],
  product: null,
  isLoading: false,
  error: null,

  fetchProducts: debounce(async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await retry(() =>
        axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        })
      );
      set({
        products: Array.isArray(response.data.products)
          ? response.data.products
          : [],
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch products. Please check your connection.";
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching products:", error);
      throw new Error(errorMessage);
    }
  }, 300),

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, product: null });
    try {
      const response = await retry(() =>
        axios.get(`http://localhost:5000/api/products/${id}`, {
          withCredentials: true,
        })
      );
      set({ product: response.data.product || null, isLoading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch product";
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching product:", error);
      throw new Error(errorMessage);
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await retry(() =>
        axios.post("http://localhost:5000/api/products", productData, {
          withCredentials: true,
        })
      );
      set((state) => ({
        products: [...state.products, response.data.product],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add product";
      set({ error: errorMessage, isLoading: false });
      console.error("Error adding product:", error);
      throw new Error(errorMessage);
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await retry(() =>
        axios.put(`http://localhost:5000/api/products/${id}`, productData, {
          withCredentials: true,
        })
      );
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? response.data.product : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update product";
      set({ error: errorMessage, isLoading: false });
      console.error("Error updating product:", error);
      throw new Error(errorMessage);
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await retry(() =>
        axios.delete(`http://localhost:5000/api/products/${id}`, {
          withCredentials: true,
        })
      );
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete product";
      set({ error: errorMessage, isLoading: false });
      console.error("Error deleting product:", error);
      throw new Error(errorMessage);
    }
  },
}));

export default useProductStore;
