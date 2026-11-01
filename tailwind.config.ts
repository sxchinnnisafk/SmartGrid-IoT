import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        grid: {
          dark: "#0a0d14",
          card: "#111622",
          border: "#1e293b",
          normal: "#10b981",
          warning: "#f59e0b",
          critical: "#ef4444",
          accent: "#06b6d4",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "sweep 4s linear infinite",
        "dash-flow": "dash 20s linear infinite",
      },
      keyframes: {
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        dash: {
          to: {
            strokeDashoffset: "-100",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
