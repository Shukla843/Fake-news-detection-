// =============================================
// controllers/news.controller.js
// =============================================
// Handles news analysis, fetching history,
// and processing user feedback on results.

import News from "../models/News.model.js";
import { analyzeNews } from "../services/ai.service.js";

// ── POST /api/news/analyze ──────────────────
// Accepts news text, sends it to AI, saves result
export const analyze = async (req, res) => {
  const { inputText } = req.body;

  try {
    // Validate input
    if (!inputText || inputText.trim().length < 20) {
      return res.status(400).json({
        message: "Please provide at least 20 characters of news text.",
      });
    }

    // Send text to AI service for analysis
    const aiResult = await analyzeNews(inputText.trim());

    // Save the analysis result to MongoDB
    const newsRecord = await News.create({
      userId: req.user._id, // From auth middleware
      inputText: inputText.trim(),
      label: aiResult.label,
      confidence: aiResult.confidence,
      explanation: aiResult.explanation,
    });

    // Return the saved record with AI results
    res.status(201).json({
      message: "Analysis complete!",
      result: {
        _id: newsRecord._id,
        inputText: newsRecord.inputText,
        label: newsRecord.label,
        confidence: newsRecord.confidence,
        explanation: newsRecord.explanation,
        feedback: newsRecord.feedback,
        createdAt: newsRecord.createdAt,
      },
    });
  } catch (error) {
    console.error("Analyze Error:", error.message);
    res.status(500).json({ message: "Failed to analyze news. Try again." });
  }
};

// ── GET /api/news/history ───────────────────
// Returns all past analyses for the logged-in user
export const getHistory = async (req, res) => {
  try {
    // Fetch news sorted by newest first
    const newsHistory = await News.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Limit to last 50 results

    // Calculate stats for the dashboard
    const stats = {
      total: newsHistory.length,
      fake: newsHistory.filter((n) => n.label === "Fake").length,
      real: newsHistory.filter((n) => n.label === "Real").length,
      suspicious: newsHistory.filter((n) => n.label === "Suspicious").length,
    };

    res.status(200).json({ newsHistory, stats });
  } catch (error) {
    console.error("History Error:", error.message);
    res.status(500).json({ message: "Failed to fetch history." });
  }
};

// ── PATCH /api/news/feedback/:id ────────────
// User marks a result as correct or incorrect
export const submitFeedback = async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body; // "correct" or "incorrect"

  try {
    // Validate feedback value
    if (!["correct", "incorrect"].includes(feedback)) {
      return res
        .status(400)
        .json({ message: "Feedback must be 'correct' or 'incorrect'." });
    }

    // Find the news record and make sure it belongs to this user
    const newsRecord = await News.findOne({ _id: id, userId: req.user._id });

    if (!newsRecord) {
      return res
        .status(404)
        .json({ message: "Analysis not found or not authorized." });
    }

    // Update feedback
    newsRecord.feedback = feedback;
    await newsRecord.save();

    res.status(200).json({
      message: "Feedback submitted. Thank you!",
      feedback: newsRecord.feedback,
    });
  } catch (error) {
    console.error("Feedback Error:", error.message);
    res.status(500).json({ message: "Failed to submit feedback." });
  }
};
