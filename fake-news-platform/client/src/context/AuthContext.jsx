// =============================================
// src/context/AuthContext.jsx - Global Auth State
// =============================================
// React Context that holds the logged-in user state.
// Wrap the app in this so any component can access
// the current user and auth functions.

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios";

// Create the context
const AuthContext = createContext(null);

// ── Provider Component ──────────────────────
// Wrap your app with this to provide auth state globally
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = not logged in
  const [isLoading, setIsLoading] = useState(true); // Loading on first check

  // ── Check if user is already logged in (on page load) ──
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call /api/auth/me — if cookie is valid, returns user data
        const res = await axiosInstance.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null); // Not logged in or token expired
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ── Login: store user in state ──────────────
  const login = (userData) => {
    setUser(userData);
  };

  // ── Logout: clear user from state ───────────
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom hook for easy access ──────────────
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
