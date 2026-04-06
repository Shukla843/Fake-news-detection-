// =============================================
// middleware/auth.middleware.js - JWT Guard
// =============================================
// This middleware protects private routes.
// It checks the JWT token from the cookie,
// verifies it, and attaches the user to req.user.

import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protectRoute = async (req, res, next) => {
  try {
    // 1. Get token from cookie (set during login)
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized. Please login first." });
    }

    // 2. Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user in DB using ID from token payload
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // 4. Attach user to request so controllers can access it
    req.user = user;

    next(); // Proceed to the actual route handler
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default protectRoute;
