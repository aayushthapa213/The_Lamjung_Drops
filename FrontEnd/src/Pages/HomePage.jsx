import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useProductStore from "../store/productStore";
import Navbar from "../Components/NavBar";
import Testimonials from "../Components/Testimonial";
import Footer from "../Components/Footer";

const HomePage = () => {
  const { products, fetchProducts, isLoading, error } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = Array.isArray(products) ? products.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-[#E6F4FF]">
      {" "}
      {/* Light background to contrast cards */}
      <Navbar />
      {/* === Hero Section === */}
      <div
        className="relative h-[80vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>{" "}
        {/* Overlay */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Pure. Fresh. Reliable.
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Delivering bottled water and hydration solutions across Lamjung.
          </p>
          <Link
            to="/about"
            className="bg-[#FF3C3C] hover:bg-[#e13232] text-white py-3 px-6 rounded-lg text-lg font-medium shadow-md transition"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
      {/* Featured Section */}
      <div className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-[#005BAA] tracking-wide">
          Featured Products
        </h2>

        {isLoading ? (
          <div className="text-center text-[#333333] font-medium">
            Loading products...
          </div>
        ) : error ? (
          <div className="text-center text-[#FF3C3C] font-semibold">{`Error: ${error}`}</div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="bg-[#FFFFFF] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col"
              >
                <img
                  src={
                    product.imageUrl || "https://via.placeholder.com/300x200"
                  }
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-xl mb-6"
                />
                <h3 className="text-2xl font-semibold text-[#005BAA] mb-2">
                  {product.name}
                </h3>
                <p className="text-[#333333] text-base mb-5 flex-grow">
                  {product.description?.substring(0, 120) ||
                    "No description available"}
                  ...
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-[#FF3C3C] font-bold text-xl">
                    Rs. {product.price}
                  </p>
                  <Link
                    to={`/products/${product._id}`}
                    className="bg-[#FF3C3C] hover:bg-[#e13232] text-white py-2 px-5 rounded-lg font-semibold transition"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#333333] font-medium">
            No products available.
          </div>
        )}
      </div>
      {/* Why Choose Us */}
      <section className="bg-[#79C9FF] py-12 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-extrabold text-[#005BAA] mb-8">
            Why Choose The Lamjung Drops?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-[#333333]">
            <div className="flex flex-col items-center">
              <img src="/icons/badge.png" alt="Quality" className="h-16 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p>Purified water sourced from the best springs.</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/icons/fast-delivery.png"
                alt="Delivery"
                className="h-16 mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p>Reliable local delivery throughout Lamjung district.</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/icons/biodegradable.png"
                alt="Eco Friendly"
                className="h-16 mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">Eco-Friendly</h3>
              <p>Environmentally conscious packaging & practices.</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/icons/customer-service.png"
                alt="Support"
                className="h-16 mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">Customer Support</h3>
              <p>Dedicated support to answer your queries.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;
