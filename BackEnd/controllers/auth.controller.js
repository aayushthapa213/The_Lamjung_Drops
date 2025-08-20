import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

const signup = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    console.log("Signup attempt for email:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      companyName: role === "dealer" ? companyName : undefined,
      isPending: role === "dealer",
    });

    await user.save();
    console.log("User created:", user._id);

    if (user.role !== "dealer") {
      await generateTokenAndSetCookie(res, user._id, user.role);
    }

    return res.status(201).json({
      success: true,
      message:
        user.role === "dealer"
          ? "Dealer signup request sent for approval!"
          : "Signup successful!",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.isPending ? "pending" : "approved",
      },
    });
  } catch (error) {
    console.log("Error in signup:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email });
    console.log("Finding user for email:", email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    console.log("Validating password for user:", user._id);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });
    }

    console.log("Generating token for user:", user._id);
    const token = await generateTokenAndSetCookie(res, user._id, user.role);
    console.log("Updating last login for user:", user._id);
    user.lastLogin = new Date();
    await user.save();

    console.log("Login successful for user:", user._id);
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.isPending ? "pending" : "approved",
      },
      token,
    });
  } catch (error) {
    console.log("Error in login:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "Logout successful!" });
  } catch (error) {
    console.log("Error in logout:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        companyName: user.companyName,  
        status: user.isPending ? "pending" : "approved",
      },
    });
  } catch (error) {
    console.log("Error in checkAuth:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPendingDealers = async (req, res) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Admin access required!",
    });
  }
  try {
    const pendingDealers = await User.find({
      role: "dealer",
      isPending: true,
    }).select("-password");
    return res.status(200).json({ success: true, pendingDealers });
  } catch (error) {
    console.log("Error in getPendingDealers:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const approveDealer = async (req, res) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Admin access required!",
    });
  }
  try {
    const { userId, bulkDiscountRate } = req.body;
    const user = await User.findById(userId);
    if (!user || user.role !== "dealer" || user.isPending !== true) {
      return res.status(400).json({
        success: false,
        message: "Invalid dealer or already approved!",
      });
    }
    user.isPending = false;
    user.bulkDiscountRate = bulkDiscountRate || 0;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Dealer approved successfully!" });
  } catch (error) {
    console.log("Error in approveDealer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const rejectDealer = async (req, res) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized: Admin access required!",
    });
  }
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndDelete(userId);
    if (!user || user.role !== "dealer" || user.isPending !== true) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid dealer!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Dealer request rejected!" });
  } catch (error) {
    console.log("Error in rejectDealer:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  signup,
  login,
  logout,
  checkAuth,
  getPendingDealers,
  approveDealer,
  rejectDealer,
};
