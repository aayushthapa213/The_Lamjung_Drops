import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required!",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock!",
      });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // ✅ Now allow increasing quantity for cartons too
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    cart.updatedAt = new Date();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    return res.status(200).json({
      success: true,
      message: "Added to cart!",
      cart: populatedCart,
    });
  } catch (error) {
    console.log("Error in addToCart:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    // Filter out cart items where productId is null (product was deleted)
    const validItems = cart.items.filter((item) => item.productId !== null);

    // If any items were invalid, update the cart in DB
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log("Error in getCart:", error);
    return res.status(500).json({ success: false, message: "Server Error!" });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }
    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
    cart.updatedAt = new Date();
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.productId");
    return res.status(200).json({ success: true, message: "Removed from cart!", cart: populatedCart });
  } catch (error) {
    console.log("Error in removeFromCart:", error);
    return res.status(500).json({ success: false, message: "Server Error!" });
  }
};

export default { addToCart, getCart, removeFromCart };