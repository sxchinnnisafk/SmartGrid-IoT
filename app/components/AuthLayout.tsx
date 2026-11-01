"use client";

import React from "react";
import { Zap, Cpu, Navigation } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Auth Navigation Bar */}
      <header className="px-6 py-4 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 glow-cyan">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-wider text-zinc-100 uppercase hidden sm:block">
              SmartGrid <span className="text-cyan-400">AIoT</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow glow-cyan"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Auth Footer */}
      <footer className="border-t border-zinc-900/80 bg-zinc-950/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
          <p>SmartGrid AIoT Digital Twin • Built by Team Celestia</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Cpu className="w-4 h-4" />
              ESP32 Edge Layer
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Navigation className="w-4 h-4" />
              Cloud Digital Twin
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}