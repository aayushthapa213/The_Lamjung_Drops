import { Message } from "../models/Message.js";

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email and message content are required.",
        });
    }

    const newMessage = new Message({
      email,
      message,
      user: req.userId || null, // If user is logged in
    });

    await newMessage.save(); // ✅ fix this line too
    res
      .status(201)
      .json({
        success: true,
        message: "Message sent successfully.",
        data: newMessage,
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Get all messages (admin only)
const getAllMessages = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized: Admin access required.",
        });
    }

    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Get messages by logged-in user
const getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

// Delete message (admin only)
const deleteMessage = async (req, res) => {
  try {
    if (req.userRole !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized: Admin access required.",
        });
    }

    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export default {
  sendMessage,
  getAllMessages,
  getUserMessages,
  deleteMessage,
};
