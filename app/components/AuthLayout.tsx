"use client";

import React from "react";
import { Zap, Cpu, Navigation } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      {/* Auth Navigation Bar */}
      <header className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 rounded-lg text-[var(--color-accent)] glow-accent">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-wider text-[var(--color-text)] uppercase hidden sm:block">
              SmartGrid <span className="text-[var(--color-accent)]">AIoT</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text-inverse)] font-bold text-sm rounded-xl transition-all shadow glow-accent"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Auth Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--color-text-muted)]">
          <p>SmartGrid AIoT Digital Twin • Built by Team Celestia</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <Cpu className="w-4 h-4" />
              ESP32 Edge Layer
            </span>
            <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <Navigation className="w-4 h-4" />
              Cloud Digital Twin
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}