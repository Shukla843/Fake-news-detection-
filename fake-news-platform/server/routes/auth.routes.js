// =============================================
// routes/auth.routes.js - Authentication Routes
// =============================================

import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no auth needed)
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected route (must be logged in)
router.get("/me", protectRoute, getMe);

export default router;
