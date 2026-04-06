// =============================================
// src/App.jsx - Root Component with Routing
// =============================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyzePage from "./pages/AnalyzePage";

// Layout
import Navbar from "./components/Navbar";

// ── Protected Route Wrapper ─────────────────
// Redirects to login if user is not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show nothing while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-accent"></span>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

// ── Public Route Wrapper ─────────────────────
// Redirects to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-accent"></span>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

// ── App Routes ──────────────────────────────
const AppRoutes = () => {
  return (
    <div className="noise-bg min-h-screen">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <AnalyzePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

// ── Root App ────────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications (top-right corner) */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a24",
              color: "#e2e8f0",
              border: "1px solid #2a2a3a",
              fontFamily: "DM Sans, sans-serif",
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
