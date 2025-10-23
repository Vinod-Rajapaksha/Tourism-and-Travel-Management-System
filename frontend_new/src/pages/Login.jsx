import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/admin/login", { email, password });
      const { token, role } = res.data;

      if (token) {
        login(token, role);
        navigate("/");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400">
      {/* Centered Login Card */}
      <div className="flex flex-1 justify-center items-center">
        <div className="bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Customer Service Login
          </h2>

          {error && (
            <p className="text-red-600 text-center bg-red-100 py-2 rounded mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field bg-white/70 border border-gray-300 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input-field bg-white/70 border border-gray-300 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-800 py-4 text-sm bg-white/20 backdrop-blur-sm">
        © {new Date().getFullYear()} Travel & Tour Management System — All
        rights reserved.
      </footer>
    </div>
  );
}





