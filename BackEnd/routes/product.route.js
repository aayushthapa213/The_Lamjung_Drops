import express from "express";
import productController from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized: Admin access required!" });
  }
  next();
};

// Create Product (Admin only)
router.post("/", verifyToken, isAdmin, productController.createProduct);

// Get All Products (Public)
router.get("/", productController.getProducts);

// Get Single Product (Public)
router.get("/:id", productController.getProductById);

// Update Product (Admin only)
router.put("/:id", verifyToken, isAdmin, productController.updateProduct);

// Delete Product (Admin only)
router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

export default router;