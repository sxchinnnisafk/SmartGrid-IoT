"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BrandHeader from "../components/BrandHeader";
import AIHistorySidebar from "../components/AIHistorySidebar";
import AIAssistantChat from "../components/AIAssistantChat";
import AIArtifactsPanel from "../components/AIArtifactsPanel";
import HardwareEvidenceModal from "../components/HardwareEvidenceModal";
import EndToEndDemoModal from "../components/EndToEndDemoModal";
import { useGrid } from "../context/GridContext";

export default function AIAssistantPage() {
  const router = useRouter();
  const { isEvidenceModalOpen, isDemoModalOpen } = useGrid();

  const handleSwitchToWorkflow = () => {
    router.push("/workflow");
  };

  return (
    <div className="min-h-screen bg-[#11141b] text-[#f4f5f8] flex flex-col justify-between selection:bg-[#3b59f8] selection:text-white">
      {/* 1. Header */}
      <BrandHeader currentViewTitle="AI Assistant" variant="assistant" />

      {/* 2. Main 3-Column Stage matching ai_assistant_chat_design_concept.png */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left: History Sidebar */}
        <div className="flex lg:flex-none">
          <AIHistorySidebar />
        </div>

        {/* Center: AI Assistant Conversation Stream */}
        <div className="flex-1 flex flex-col">
          <AIAssistantChat onSwitchToWorkflow={handleSwitchToWorkflow} />
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
