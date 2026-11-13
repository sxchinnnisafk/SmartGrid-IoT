"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#11141b] text-[#f4f5f8] flex flex-col justify-between selection:bg-[#3b59f8] selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 border-b border-[#222a3d] bg-[#141822]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-[#1a1f2c] border border-[#2b3347]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-wider text-white uppercase">
              SmartGrid <span className="text-[#3b59f8]">AIoT</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-mono text-[#9ca3af] hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#222a3d] bg-[#141822]/90 px-6 py-4 text-center text-xs font-mono text-[#6b7280]">
        SmartGrid AIoT • Team Celestia (Akash, Sachin, Obed, Rayyan) • KLE Technological University
      </footer>
    </div>
  );
}
