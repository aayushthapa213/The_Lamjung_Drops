import { Product } from "../models/Product.js";

const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    imageUrl,
    dealerDiscountRate,
    isCarton,
  } = req.body;
  try {
    const product = new Product({
      name,
      description,
      price,
      stock,
      imageUrl,
      dealerDiscountRate: dealerDiscountRate || 0,
      isCarton: isCarton || false,
    });
    await product.save();
    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product,
    });
  } catch (error) {
    console.log("Error in createProduct:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error in getProducts:", error);
    return res.status(500).json({ success: false, message: "Server Error!" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error in getProductById:", error);
    return res.status(500).json({ success: false, message: "Server Error!" });
  }
};

const updateProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    imageUrl,
    dealerDiscountRate,
    isCarton,
  } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    product.imageUrl = imageUrl || product.imageUrl;
    product.dealerDiscountRate =
      dealerDiscountRate !== undefined
        ? dealerDiscountRate
        : product.dealerDiscountRate;
    product.isCarton = isCarton !== undefined ? isCarton : product.isCarton;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  } catch (error) {
    console.log("Error in updateProduct:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteProduct:", error);
    return res.status(500).json({ success: false, message: "Server Error!" });
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
