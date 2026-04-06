// =============================================
// routes/news.routes.js - News Analysis Routes
// =============================================
// All routes here are protected — user must be logged in.

import express from "express";
import {
  analyze,
  getHistory,
  submitFeedback,
} from "../controllers/news.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes below require authentication
router.post("/analyze", protectRoute, analyze);
router.get("/history", protectRoute, getHistory);
router.patch("/feedback/:id", protectRoute, submitFeedback);

export default router;
