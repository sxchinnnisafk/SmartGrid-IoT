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
      fontFamily: {
        serif: ["Newsreader", "Playfair Display", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "Inter", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "SFMono-Regular", "monospace"],
      },
      colors: {
        parchment: {
          DEFAULT: "#ede4d8",
          light: "#f5eee5",
          dark: "#e2d5c3",
          border: "#ded4c5",
          text: "#1c1f28",
          muted: "#666b7a",
        },
        ink: {
          DEFAULT: "#12151c",
          elevated: "#181c25",
          card: "#1e222e",
          border: "#292f3d",
          muted: "#949ba8",
        },
        cobalt: {
          DEFAULT: "#3b59f8",
          hover: "#2f4bd8",
          muted: "#e8ecff",
        },
        signal: {
          normal: "#22c55e",
          normalBg: "#dcfce7",
          normalText: "#166534",
          warning: "#f59e0b",
          warningBg: "#fef3c7",
          warningText: "#92400e",
          critical: "#ef4444",
          criticalBg: "#fee2e2",
          criticalText: "#991b1b",
        },
      },
      boxShadow: {
        cobalt: "0 4px 20px rgba(59, 89, 248, 0.35)",
        parchment: "0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
