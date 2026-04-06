// =============================================
// src/components/NewsCard.jsx
// =============================================
// Card displayed in the dashboard for each
// past news analysis. Shows result + feedback buttons.

import { useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import ResultBadge from "./ResultBadge";

const NewsCard = ({ news, onFeedbackUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format the date nicely
  const formattedDate = new Date(news.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Truncate long news text for display
  const previewText =
    news.inputText.length > 150
      ? news.inputText.slice(0, 150) + "..."
      : news.inputText;

  // ── Submit feedback ─────────────────────────
  const handleFeedback = async (feedbackValue) => {
    if (news.feedback) return; // Already submitted

    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/news/feedback/${news._id}`, {
        feedback: feedbackValue,
      });

      // Tell parent to update the card
      onFeedbackUpdate(news._id, feedbackValue);
      toast.success("Thanks for your feedback!");
    } catch (err) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 hover:border-accent/30 transition-all duration-300 animate-slide-up">
      {/* Top row: badge + date */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <ResultBadge label={news.label} size="sm" />
        <span className="text-xs text-slate-500">{formattedDate}</span>
      </div>

      {/* News preview text */}
      <p className="text-sm text-slate-300 leading-relaxed mb-3 line-clamp-3">
        {previewText}
      </p>

      {/* Confidence bar (simple static version for cards) */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 bg-panel rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${news.confidence}%`,
              backgroundColor:
                news.label === "Fake"
                  ? "#ef4444"
                  : news.label === "Real"
                  ? "#22c55e"
                  : "#f59e0b",
            }}
          />
        </div>
        <span className="text-xs text-slate-400 font-medium w-10 text-right">
          {news.confidence}%
        </span>
      </div>

      {/* Explanation snippet */}
      <p className="text-xs text-slate-500 leading-relaxed mb-4 border-l-2 border-border pl-3 italic">
        {news.explanation.slice(0, 100)}...
      </p>

      {/* Feedback section */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <span className="text-xs text-slate-500">Was this correct?</span>

        {news.feedback ? (
          // Already gave feedback
          <span className="text-xs text-slate-400 ml-auto">
            {news.feedback === "correct" ? "👍 Marked correct" : "👎 Marked incorrect"}
          </span>
        ) : (
          // Feedback buttons
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleFeedback("correct")}
              disabled={isSubmitting}
              className="text-xs px-2.5 py-1 rounded-lg bg-success/10 text-green-400 border border-success/20 hover:bg-success/20 transition-colors disabled:opacity-50"
            >
              👍 Yes
            </button>
            <button
              onClick={() => handleFeedback("incorrect")}
              disabled={isSubmitting}
              className="text-xs px-2.5 py-1 rounded-lg bg-danger/10 text-red-400 border border-danger/20 hover:bg-danger/20 transition-colors disabled:opacity-50"
            >
              👎 No
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
