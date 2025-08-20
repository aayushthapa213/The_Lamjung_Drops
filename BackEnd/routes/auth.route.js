import express from "express";
import authController from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, authController.checkAuth);
router.get("/pending-dealers", verifyToken, authController.getPendingDealers);
router.post("/approve-dealer", verifyToken, authController.approveDealer);
router.post("/reject-dealer", verifyToken, authController.rejectDealer);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;