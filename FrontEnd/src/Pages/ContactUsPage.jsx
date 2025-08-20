import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";

const ContactUsPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setEmail("");
        setMessage("");
      } else {
        setStatus(data.message || "❌ Something went wrong.");
      }
    } catch (error) {
      setStatus("❌ Failed to send message.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#F0F4C3] to-[#FFEBEE]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-[250px] md:h-[320px] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg.png')" }}
      >
        <div className="absolute inset-0 bg-[#000000] bg-opacity-80 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg tracking-wide"
          >
            Contact Us
          </motion.h1>
        </div>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl mx-auto border border-[#0D47A1]/20"
        >
          <h2 className="text-3xl font-bold text-[#0D47A1] mb-6 tracking-tight">
            We’d love to hear from you!
          </h2>
          <p className="text-[#1976D2] mb-8 text-lg font-medium">
            Whether you have a question about products, delivery, or just want to say hello — we’re here for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-[#0D47A1] font-semibold mb-2"
              >
                Your Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-3 border-2 border-[#1976D2] rounded-lg shadow-sm placeholder-[#90caf9] focus:outline-none focus:ring-4 focus:ring-[#1976D2]/50 transition"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-[#0D47A1] font-semibold mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full px-5 py-3 border-2 border-[#1976D2] rounded-lg shadow-sm placeholder-[#90caf9] focus:outline-none focus:ring-4 focus:ring-[#1976D2]/50 transition"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#FF3C3C] to-[#E53935] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:from-[#E53935] hover:to-[#B71C1C] transition"
            >
              Send Message
            </button>
            {status && (
              <p className="mt-4 text-center text-lg font-semibold text-[#0D47A1]">
                {status}
              </p>
            )}
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
