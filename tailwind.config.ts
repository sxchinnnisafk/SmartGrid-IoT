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
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        parchment: {
          DEFAULT: "var(--color-paper-bg)",
          light: "var(--color-paper-light)",
          bright: "var(--color-paper-bright)",
          card: "var(--color-paper-card)",
          dark: "var(--color-paper-dark)",
          border: "var(--color-paper-border)",
          borderStrong: "var(--color-paper-border-strong)",
          text: "var(--color-paper-text)",
          secondary: "var(--color-paper-secondary)",
          muted: "var(--color-paper-muted)",
          subtle: "var(--color-paper-subtle)",
        },
        ink: {
          DEFAULT: "var(--color-ink-bg)",
          deep: "var(--color-ink-deep)",
          elevated: "var(--color-ink-surface)",
          surface: "var(--color-ink-surface)",
          card: "var(--color-ink-card)",
          hover: "var(--color-ink-hover)",
          border: "var(--color-ink-border)",
          borderStrong: "var(--color-ink-border-strong)",
          text: "var(--color-ink-text)",
          secondary: "var(--color-ink-secondary)",
          muted: "var(--color-ink-muted)",
          onAccent: "var(--color-ink-on-accent)",
        },
        cobalt: {
          DEFAULT: "var(--color-cobalt)",
          hover: "var(--color-cobalt-hover)",
          soft: "var(--color-cobalt-soft)",
          tint: "var(--color-cobalt-tint)",
          tintStrong: "var(--color-cobalt-tint-strong)",
          border: "var(--color-cobalt-border)",
        },
        control: {
          DEFAULT: "var(--color-control-accent)",
          bg: "var(--color-control-bg)",
          text: "var(--color-control-text)",
        },
        signal: {
          normal: "var(--color-signal-normal)",
          normalBright: "var(--color-signal-normal-bright)",
          normalBg: "var(--color-signal-normal-bg)",
          normalText: "var(--color-signal-normal-text)",
          normalBorder: "var(--color-signal-normal-border)",
          warning: "var(--color-signal-warning)",
          warningBright: "var(--color-signal-warning-bright)",
          warningBg: "var(--color-signal-warning-bg)",
          warningText: "var(--color-signal-warning-text)",
          warningBorder: "var(--color-signal-warning-border)",
          critical: "var(--color-signal-critical)",
          criticalBright: "var(--color-signal-critical-bright)",
          criticalBg: "var(--color-signal-critical-bg)",
          criticalText: "var(--color-signal-critical-text)",
          criticalBorder: "var(--color-signal-critical-border)",
        },
      },
      boxShadow: {
        cobalt: "var(--color-cobalt-shadow)",
        parchment: "var(--color-paper-shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
