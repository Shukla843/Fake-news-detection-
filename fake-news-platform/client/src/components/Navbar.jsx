// =============================================
// src/components/Navbar.jsx
// =============================================
// Top navigation bar. Shows different links
// based on whether the user is logged in or not.

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-ink/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
            TS
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">
            Truth<span className="text-accent-light">Scan</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            // Logged in: show nav links + user menu
            <>
              <Link
                to="/analyze"
                className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors"
              >
                Analyze
              </Link>
              <Link
                to="/dashboard"
                className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>

              {/* User dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex items-center gap-2 cursor-pointer bg-panel border border-border rounded-lg px-3 py-1.5 hover:border-accent transition-colors"
                >
                  {/* Avatar with first letter */}
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 hidden sm:block">
                    {user.name}
                  </span>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-50 menu mt-2 p-2 shadow-xl bg-panel border border-border rounded-xl w-48"
                >
                  <li>
                    <Link to="/dashboard" className="text-slate-300 hover:text-white">
                      📊 Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/analyze" className="text-slate-300 hover:text-white">
                      🔍 Analyze News
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-danger hover:text-red-400"
                    >
                      🚪 Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            // Not logged in: show login/signup buttons
            <>
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-accent hover:bg-accent/90 text-white px-4 py-1.5 rounded-lg transition-all font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
