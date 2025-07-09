import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext"; // Import Auth Context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login function from context

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://backend-resideease.onrender.com/auth/login", { email, password }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Login successful!");

        // Store user info using AuthContext
        login({ username: response.data.username, token: response.data.token, email: response.data.email });
        response.data.username !== "admin" ? navigate("/") : navigate("/admin"); // Redirect based on username
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
      <div className="bg-white shadow-xl rounded-lg p-8 w-96 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">Accommodation Finder</h2>
        <p className="text-gray-600 text-center text-sm mb-6">Welcome back! Please log in to continue.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-md"
          >
             Log In
          </button>
        </form>

        <p className="text-center text-gray-700 text-sm mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
