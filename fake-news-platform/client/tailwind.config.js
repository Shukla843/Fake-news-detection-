/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Sharp, editorial headline font
        display: ["'Syne'", "sans-serif"],
        // Clean readable body font
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        ink: "#0a0a0f",
        surface: "#111118",
        panel: "#1a1a24",
        border: "#2a2a3a",
        accent: "#6366f1",
        "accent-light": "#818cf8",
        danger: "#ef4444",
        success: "#22c55e",
        warning: "#f59e0b",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        // Custom dark theme
        truthscan: {
          primary: "#6366f1",
          secondary: "#818cf8",
          accent: "#f59e0b",
          neutral: "#1a1a24",
          "base-100": "#0a0a0f",
          "base-200": "#111118",
          "base-300": "#1a1a24",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
};
