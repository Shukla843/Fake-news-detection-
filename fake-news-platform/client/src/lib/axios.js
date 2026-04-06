// =============================================
// src/lib/axios.js - Axios Instance
// =============================================
// Pre-configured axios instance that:
// - Points to our backend API
// - Sends cookies with every request (withCredentials)
// - We import THIS instead of raw axios everywhere

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Vite proxy forwards this to http://localhost:5000/api
  withCredentials: true, // IMPORTANT: sends JWT cookie with every request
});

export default axiosInstance;
