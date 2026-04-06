// =============================================
// src/pages/DashboardPage.jsx
// =============================================
// Shows user's analysis history + stats.
// Cards can be filtered by label.

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import StatsBar from "../components/StatsBar";
import NewsCard from "../components/NewsCard";

const DashboardPage = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, fake: 0, real: 0, suspicious: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All"); // Filter by label
  const headerRef = useRef(null);
  const { user } = useAuth();

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Animate header in
  useEffect(() => {
    if (!isLoading && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isLoading]);

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get("/news/history");
      setHistory(res.data.newsHistory);
      setStats(res.data.stats);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  // Update feedback in state without re-fetching
  const handleFeedbackUpdate = (newsId, feedbackValue) => {
    setHistory((prev) =>
      prev.map((item) =>
        item._id === newsId ? { ...item, feedback: feedbackValue } : item
      )
    );
  };

  // Filter news by label
  const filteredHistory =
    filter === "All"
      ? history
      : history.filter((item) => item.label === filter);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-accent mb-3" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <div ref={headerRef} className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back,{" "}
            <span className="text-accent-light font-medium">{user?.name}</span>{" "}
            — here's your analysis overview.
          </p>
        </div>
        <Link
          to="/analyze"
          className="bg-accent hover:bg-accent/90 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 hover:-translate-y-0.5 text-sm flex items-center gap-2"
        >
          🧠 New Analysis
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <StatsBar stats={stats} />

      {/* ── History Section ── */}
      <div>
        {/* Filter tabs */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-white">
            Analysis History
          </h2>
          <div className="flex gap-1 bg-panel border border-border rounded-xl p-1">
            {["All", "Real", "Fake", "Suspicious"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                  filter === tab
                    ? "bg-accent text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredHistory.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">
              {history.length === 0 ? "📭" : "🔍"}
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">
              {history.length === 0
                ? "No analyses yet"
                : `No ${filter} news found`}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {history.length === 0
                ? "Start by analyzing your first news article!"
                : "Try a different filter to see your results."}
            </p>
            {history.length === 0 && (
              <Link
                to="/analyze"
                className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-all text-sm"
              >
                Analyze First Article →
              </Link>
            )}
          </div>
        ) : (
          // News cards grid
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredHistory.map((news) => (
              <NewsCard
                key={news._id}
                news={news}
                onFeedbackUpdate={handleFeedbackUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
