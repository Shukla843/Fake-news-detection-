import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to backend during development
    // This avoids CORS issues when running locally
    proxy: {
      "/api": {
        target: "https://fake-news-detection-hpoh.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
