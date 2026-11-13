"use client";

import React from "react";
import LandingHero from "./components/LandingHero";
import LandingStoryChapters from "./components/LandingStoryChapters";
import HardwareEvidenceModal from "./components/HardwareEvidenceModal";
import EndToEndDemoModal from "./components/EndToEndDemoModal";
import { useGrid } from "./context/GridContext";

export default function LandingPage() {
  const { isEvidenceModalOpen, isDemoModalOpen } = useGrid();

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
