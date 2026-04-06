// =============================================
// src/pages/LoginPage.jsx
// =============================================
// Login form with validation and GSAP entrance animation.

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      login(res.data.user); // Store user in context
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-12">
      {/* Background orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

      <div ref={formRef} className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-2xl mx-auto mb-4">
            🔐
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to your TruthScan account
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent transition-colors text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent transition-colors text-sm"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 hover:-translate-y-0.5 disabled:translate-y-0 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-slate-600">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Signup link */}
          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent-light hover:text-white transition-colors font-medium"
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
