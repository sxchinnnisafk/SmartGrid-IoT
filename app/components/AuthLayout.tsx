"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGrid } from "../context/GridContext";
import { ArrowRight } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { skipAuth } = useGrid();

  const handleSkip = () => {
    skipAuth();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-ink text-ink-text flex flex-col justify-between selection:bg-cobalt selection:text-ink-onAccent relative overflow-x-clip">
      {/* Background Atmosphere & Horizon Silhouette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-ink-backdrop" />
        <div className="absolute bottom-0 left-0 right-0 h-80 mountain-silhouette opacity-80" />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 sm:px-10 py-4 border-b border-ink-border bg-ink-surface/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 whitespace-nowrap">
            <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-ink-card border border-ink-border">
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
              <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
            </div>
            <span className="text-base sm:text-lg font-bold text-ink-text font-sans">
              Celestia <span className="text-cobalt">Rover</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 rounded-full bg-ink-card hover:bg-ink-hover text-xs font-sans font-medium text-cobalt-soft border border-ink-border flex items-center gap-2 transition-colors whitespace-nowrap"
              title="Skip authentication and enter site directly as guest"
            >
              <span>Skip Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-ink-border bg-ink-surface/90 px-6 py-4 text-center text-xs font-sans text-ink-muted">
        Celestia Rover — Autonomous Surveillance &amp; Patrol Interface · Team Celestia, KLE Technological University
      </footer>
    </div>
  );
}
