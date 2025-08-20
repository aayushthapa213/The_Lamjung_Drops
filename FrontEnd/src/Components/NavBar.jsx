import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import useCartStore from "../store/cartStore";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, logout, checkAuth } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    if (user) {
      fetchCart();
    }
  }, [checkAuth, user, fetchCart]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const cartItemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Helper: Get display name
  const getDisplayName = () => {
    if (!user) return "";
    if (user.role === "admin") return "Admin";
    if (user.role === "dealer") return user.companyName;
    return user.name;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition duration-300 ${
        isHome
          ? "bg-transparent text-white"
          : "bg-gray-900 text-white shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#79C9FF] to-white text-transparent bg-clip-text"
        >
          The Lamjung Drops
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/about" className="hover:text-[#FF3C3C] transition">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-[#FF3C3C] transition">
            Contact
          </Link>
          <Link to="/products" className="hover:text-[#FF3C3C] transition">
            Products
          </Link>
          <Link
            to="/cart"
            className="relative hover:text-[#FF3C3C] flex items-center transition"
          >
            <ShoppingCart size={20} className="mr-1" />
            Cart ({cartItemCount})
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 hover:text-[#FF3C3C] transition"
              >
                {getDisplayName()}
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md py-2 w-40 z-10">
                  {user.role === "admin" && (
                    <Link
                      to="/admin-dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-[#FF3C3C] transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
