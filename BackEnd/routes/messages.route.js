import express from "express";
import messageController from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Public route to send message (no auth required)
router.post("/", messageController.sendMessage);

// Authenticated routes
router.get("/", verifyToken, messageController.getAllMessages);
router.get("/my", verifyToken, messageController.getUserMessages);
router.delete("/:id", verifyToken, messageController.deleteMessage);

export default router;
