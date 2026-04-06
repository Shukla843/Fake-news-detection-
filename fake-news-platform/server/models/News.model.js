// =============================================
// models/News.model.js - News Analysis Schema
// =============================================
// Stores each news analysis result in MongoDB.
// Linked to the user who submitted it.

import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    // The user who submitted this analysis
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The raw news text or URL the user pasted
    inputText: {
      type: String,
      required: [true, "News text is required"],
    },

    // AI-determined label: Fake, Real, or Suspicious
    label: {
      type: String,
      enum: ["Fake", "Real", "Suspicious"],
      required: true,
    },

    // Confidence percentage from AI (0-100)
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // AI's explanation for why it gave this label
    explanation: {
      type: String,
      required: true,
    },

    // User feedback: did the AI get it right?
    // null = no feedback yet
    feedback: {
      type: String,
      enum: ["correct", "incorrect", null],
      default: null,
    },
  },
  {
    timestamps: true, // Auto-adds createdAt & updatedAt
  }
);

const News = mongoose.model("News", newsSchema);
export default News;
