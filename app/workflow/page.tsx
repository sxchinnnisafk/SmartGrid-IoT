"use client";

import React from "react";
import BrandHeader from "../components/BrandHeader";
import AIHistorySidebar from "../components/AIHistorySidebar";
import WorkflowCanvas from "../components/WorkflowCanvas";
import AIArtifactsPanel from "../components/AIArtifactsPanel";
import HardwareEvidenceModal from "../components/HardwareEvidenceModal";
import EndToEndDemoModal from "../components/EndToEndDemoModal";
import { useGrid } from "../context/GridContext";

export default function WorkflowPage() {
  const { isEvidenceModalOpen, isDemoModalOpen } = useGrid();

  return (
    <div className="min-h-screen bg-[#11141b] text-[#f4f5f8] flex flex-col justify-between selection:bg-[#3b59f8] selection:text-white">
      {/* 1. Header */}
      <BrandHeader currentViewTitle="Workflow Canvas" variant="assistant" />

      {/* 2. Main 3-Column Stage matching ai_workflow_design_concept.png */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left: History Sidebar */}
        <div className="flex lg:flex-none">
          <AIHistorySidebar />
        </div>

        {/* Center: Interactive Free-Form Workflow Canvas */}
        <div className="flex-1 flex flex-col">
          <WorkflowCanvas />
        </div>

        {/* Right: Current Artifacts Sidebar */}
        <div className="flex lg:flex-none">
          <AIArtifactsPanel />
        </div>
      </main>

      {/* Modals */}
      {isEvidenceModalOpen && <HardwareEvidenceModal />}
      {isDemoModalOpen && <EndToEndDemoModal />}
    </div>
  );
}
