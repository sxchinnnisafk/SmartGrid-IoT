"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGrid } from "../context/GridContext";
import { ArrowLeft, Zap, ArrowRight } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { skipAuth } = useGrid();

  const handleSkip = () => {
    skipAuth();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#11141b] text-[#f4f5f8] flex flex-col justify-between selection:bg-[#3b59f8] selection:text-white relative overflow-hidden">
      {/* Background Chalk & Mountain Silhouette Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,89,248,0.18),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-96 mountain-silhouette opacity-80" />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 sm:px-12 py-5 border-b border-[#222a3d] bg-[#141822]/90 backdrop-blur-md">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-[#1a1f2c] border border-[#2b3347]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-wider text-white uppercase font-sans">
              SmartGrid <span className="text-[#3b59f8]">AIoT</span>
            </span>
          </Link>

          {/* Right Header Navigation & Skip Shortcut */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSkip}
              className="px-4 py-2 rounded-full bg-[#1e2536] hover:bg-[#28324a] text-xs font-mono text-[#a5b4fc] border border-[#374151] flex items-center gap-2 transition-all shadow-sm"
              title="Skip authentication and enter site directly as guest"
            >
              <span>Skip Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-[#222a3d] bg-[#141822]/90 px-6 py-4 text-center text-xs font-mono text-[#6b7280]">
        SmartGrid AIoT • Team Celestia (Akash, Sachin, Obed, Rayyan) • KLE Technological University
      </footer>
    </div>
  );
}
