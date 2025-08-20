import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#005BAA] text-white py-10 px-6 w-full m-0">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About / Brand */}
        <div>
          <h3 className="text-2xl font-bold mb-4">The Lamjung Drops</h3>
          <p className="text-[#79C9FF] max-w-sm">
            Delivering pure, fresh, and reliable bottled water to Lamjung. Your hydration, our priority.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 border-b border-[#79C9FF] pb-2">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-[#FF3C3C] transition">Home</a></li>
            <li><a href="/about" className="hover:text-[#FF3C3C] transition">About Us</a></li>
            <li><a href="/products" className="hover:text-[#FF3C3C] transition">Products</a></li>
            <li><a href="/contact" className="hover:text-[#FF3C3C] transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="font-semibold text-lg mb-4 border-b border-[#79C9FF] pb-2">Contact Us</h4>
          <p>Email: <a href="mailto:info@thelamjungdrops.com" className="hover:text-[#FF3C3C] transition">info@thelamjungdrops.com</a></p>
          <p>Phone: <a href="tel:+977123456789" className="hover:text-[#FF3C3C] transition">+977 1234 56789</a></p>

          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#FF3C3C] transition">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#FF3C3C] transition">
              <Twitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#FF3C3C] transition">
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-[#79C9FF] mt-10 text-sm">
        &copy; {new Date().getFullYear()} The Lamjung Drops. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
