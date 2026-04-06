// =============================================
// controllers/auth.controller.js
// =============================================
// Handles user signup and login.
// Creates JWT and stores it in an HTTP-only cookie.

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// ── Helper: Generate JWT and set it as cookie ──
const generateTokenAndSetCookie = (userId, res) => {
  // Create a JWT that expires in 7 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set token in HTTP-only cookie (can't be accessed by JS = safer)
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // Prevents XSS attacks
    sameSite: "strict", // Prevents CSRF attacks
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  });
};

// ── POST /api/auth/signup ───────────────────
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create new user (password gets hashed in model's pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT and set cookie
    generateTokenAndSetCookie(user._id, res);

    // Return user info (never return the password!)
    res.status(201).json({
      message: "Account created successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── POST /api/auth/login ────────────────────
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare entered password with hashed password in DB
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT and set cookie
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Logged in successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// ── POST /api/auth/logout ───────────────────
export const logout = async (req, res) => {
  // Clear the JWT cookie by setting it to expire immediately
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully." });
};

// ── GET /api/auth/me ────────────────────────
// Returns the currently logged-in user's info
export const getMe = async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};
