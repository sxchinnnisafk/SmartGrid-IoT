"use client";

import React from "react";
import LandingHero from "./components/LandingHero";
import LandingStoryChapters from "./components/LandingStoryChapters";
import HardwareEvidenceModal from "./components/HardwareEvidenceModal";
import EndToEndDemoModal from "./components/EndToEndDemoModal";
import AuthPortalCard from "./components/AuthPortalCard";
import { useGrid } from "./context/GridContext";

export default function LandingPage() {
  const {
    isEvidenceModalOpen,
    isDemoModalOpen,
    isAuthenticated,
    hasSkippedAuth,
    isAuthLoaded,
  } = useGrid();

  // If auth state has loaded and user is neither signed in nor has skipped auth,
  // display the branded Sign In & Sign Up gate before revealing the main page.
  const showAuthGate = isAuthLoaded && !isAuthenticated && !hasSkippedAuth;

  if (showAuthGate) {
    return (
      <div className="min-h-screen bg-[#11141b] text-[#f4f5f8] flex flex-col justify-between selection:bg-[#3b59f8] selection:text-white relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,89,248,0.2),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-96 mountain-silhouette opacity-80" />
        </div>

        {/* Minimal Gate Header */}
        <header className="relative z-20 px-6 sm:px-12 py-5 border-b border-[#222a3d] bg-[#141822]/90 backdrop-blur-md">
          <div className="max-w-[1700px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            </div>

            <div className="text-xs font-mono text-[#8a92a3]">
              Operator Gateway
            </div>
          </div>
        </header>

        {/* Auth Gate Card with Sign In, Sign Up, and Skip Sign In */}
        <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
          <AuthPortalCard initialMode="signin" />
        </main>

        {/* Gate Footer */}
        <footer className="relative z-20 border-t border-[#222a3d] bg-[#141822]/90 px-6 py-4 text-center text-xs font-mono text-[#6b7280]">
          SmartGrid AIoT • Team Celestia (Akash, Sachin, Obed, Rayyan) • KLE Technological University
        </footer>
      </div>
    );
  }

  // Once authenticated or skipped, present the main landing page and 6-chapter editorial story
  return (
    <div className="min-h-screen bg-[#11141b] text-[#f4f5f8] flex flex-col">
      {/* 1. Pixel-Perfect Landing Hero matching landing_page_design_concept.png */}
      <LandingHero />

      {/* 2. Six-Chapter Visual Editorial Story from PDF Page 7 */}
      <LandingStoryChapters />

      {/* Modals */}
      {isEvidenceModalOpen && <HardwareEvidenceModal />}
      {isDemoModalOpen && <EndToEndDemoModal />}
    </div>
  );
}
