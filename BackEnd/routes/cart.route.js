import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import cartController from "../controllers/cart.controller.js";

const router = express.Router();

// Middleware to restrict to user or dealer roles
const restrictToUserOrDealer = (req, res, next) => {
  if (req.userRole !== "user" && req.userRole !== "dealer") {
    return res.status(403).json({ success: false, message: "Unauthorized: Only users or dealers can access the cart!" });
  }
  next();
};

// Add to Cart (Authenticated users/dealers)
router.post("/add", verifyToken, restrictToUserOrDealer, cartController.addToCart);

// Get Cart (Authenticated users/dealers)
router.get("/", verifyToken, restrictToUserOrDealer, cartController.getCart);

// Remove from Cart (Authenticated users/dealers)
router.delete("/remove/:productId", verifyToken, restrictToUserOrDealer, cartController.removeFromCart);

export default router;