// =============================================
// models/User.model.js - User Schema
// =============================================
// Defines the shape of a User document in MongoDB.
// Passwords are hashed before saving (see pre-save hook).

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // User's display name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Unique email used for login
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password (never store plain text!)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  {
    timestamps: true, // Auto-adds createdAt & updatedAt
  }
);

// ── Hash password before saving ─────────────
// This runs automatically whenever a user is saved
userSchema.pre("save", async function (next) {
  // Only hash if password was changed (not on other updates)
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method to compare passwords ─────────────
// Used during login to check if entered password matches stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
