import { motion } from "framer-motion";
import Input from "../Components/Input";
import { Loader, Lock, Mail, Building } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../Components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const DealerSignUpPage = () => {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { signup, error: serverError, isLoading } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required!";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format!";

    if (!companyName) newErrors.companyName = "Company Name is required!";
    else if (companyName.length < 2 || companyName.length > 100)
      newErrors.companyName = "Company Name must be 2-100 characters long!";
    else if (!/^[a-zA-Z0-9\s&-.]+$/.test(companyName))
      newErrors.companyName = "Company Name must contain only letters, numbers, spaces, &, -, or .!";

    if (!password) newErrors.password = "Password is required!";
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/.test(password)
    )
      newErrors.password =
        "Password must be 6-12 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await signup(email, password, undefined, "dealer", companyName);
      toast.success("Dealer signup request submitted. Awaiting admin approval.");
      navigate("/");
    } catch (error) {
      toast.error(serverError || "Error signing up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#005BAA] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#005BAA]">
            Dealer Sign Up
          </h2>

          <form onSubmit={handleSignUp}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

            <Input
              icon={Building}
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            {serverError && <p className="text-red-500 font-semibold mt-2">{serverError}</p>}

            <PasswordStrengthMeter password={password} />

            <motion.button
              className="mt-5 w-full py-3 px-4 bg-[#FF3C3C] text-white font-bold rounded-lg shadow-lg hover:bg-[#e13232] focus:outline-none focus:ring-2 focus:ring-[#FF3C3C] focus:ring-offset-2 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Sign Up as Dealer"}
            </motion.button>
          </form>
        </div>

        <div className="px-8 py-4 bg-[#003F7D] flex justify-between text-sm text-[#79C9FF]">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="underline hover:text-[#FF3C3C]">
              Login
            </Link>
          </p>
          <p>
            <Link to="/signup" className="underline hover:text-[#FF3C3C]">
              Sign up as a user
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DealerSignUpPage;
