import { motion } from "framer-motion";
import Navbar from "../Components/NavBar";
import Footer from "../Components/Footer";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-[#F2F7FA]">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white text-4xl md:text-5xl font-bold text-center"
          >
            About The Lamjung Drops
          </motion.h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#008DDA]">
            Who We Are
          </h2>
          <p className="text-[#333] mb-4 leading-relaxed">
            The Lamjung Drops is your trusted provider of premium bottled water,
            jars, and dispensers. We deliver pure, fresh water sourced from the
            pristine springs of Lamjung, Nepal — ensuring safety, purity, and
            satisfaction for every sip.
          </p>
          <p className="text-[#333] leading-relaxed">
            With an unwavering commitment to quality, sustainability, and
            customer service, we proudly serve homes, businesses, and dealers
            across the region.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12"
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-[#008DDA] mb-2">
              Our Mission
            </h3>
            <p className="text-[#333]">
              To ensure access to safe, clean, and healthy drinking water while
              promoting environmental responsibility and delivering with care.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-[#008DDA] mb-2">
              Our Vision
            </h3>
            <p className="text-[#333]">
              To become the most reliable and eco-friendly water supplier in
              Nepal by consistently exceeding expectations.
            </p>
          </div>
        </motion.div>

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <h4 className="text-lg font-bold text-[#008DDA] mb-2">
              Premium Quality
            </h4>
            <p className="text-[#555] text-sm">
              Water sourced from natural springs, triple-filtered and tested.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <h4 className="text-lg font-bold text-[#008DDA] mb-2">
              Fast Delivery
            </h4>
            <p className="text-[#555] text-sm">
              Same-day delivery across Lamjung and nearby areas.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow text-center">
            <h4 className="text-lg font-bold text-[#008DDA] mb-2">
              Eco-Friendly
            </h4>
            <p className="text-[#555] text-sm">
              Reusable jars and recyclable bottles to protect the planet.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
