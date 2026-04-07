// =============================================
// index.js - Main Server Entry Point
// =============================================
// This file sets up Express, connects to MongoDB,
// registers all routes, and starts the server.

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import newsRoutes from "./routes/news.routes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ──────────────────────
connectDB();

// ── Middleware ──────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL , // Allow frontend
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies from request headers

// ── Routes ──────────────────────────────────
app.use("/api/auth", authRoutes); // Auth: signup, login, logout
app.use("/api/news", newsRoutes); // News: analyze, history, feedback

// ── Health Check ────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "🚀 Fake News Detection API is running!" });
});

// ── Start Server ─────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
