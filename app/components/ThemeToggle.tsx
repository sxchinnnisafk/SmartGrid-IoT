"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-[var(--color-bg-subtle)] p-1 rounded-xl border border-[var(--color-border)]">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-lg transition-all flex items-center justify-center ${
          theme === "light"
            ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)] shadow-md"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]"
        }`}
        aria-label="Light mode"
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-lg transition-all flex items-center justify-center ${
          theme === "dark"
            ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)] shadow-md"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]"
        }`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
            const stored = localStorage.getItem("smartgrid-theme");
            if (stored) {
              localStorage.removeItem("smartgrid-theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              setTheme(prefersDark ? "dark" : "light");
            } else {
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              setTheme(prefersDark ? "dark" : "light");
            }
          } else {
            setTheme("light");
          }
        }}
        className={`p-2 rounded-lg transition-all flex items-center justify-center ${
          theme !== "light" && theme !== "dark"
            ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)] shadow-md"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]"
        }`}
        aria-label="System preference"
        title="System preference"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}