// =============================================
// config/db.js - MongoDB Connection
// =============================================
// Connects to MongoDB using Mongoose.
// Called once when the server starts.

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the server if DB fails
  }
};

export default connectDB;
