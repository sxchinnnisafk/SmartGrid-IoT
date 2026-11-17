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
    <div className="min-h-screen bg-ink text-ink-text flex flex-col justify-between selection:bg-cobalt selection:text-ink-onAccent">
      <BrandHeader currentViewTitle="Workflow Canvas" variant="assistant" />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 lg:px-6 py-5 flex flex-col lg:flex-row gap-5 items-stretch">
        <div className="flex lg:flex-none min-w-0">
          <AIHistorySidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <WorkflowCanvas />
        </div>

        <div className="flex lg:flex-none min-w-0">
          <AIArtifactsPanel />
        </div>
      </main>

      {isEvidenceModalOpen && <HardwareEvidenceModal />}
      {isDemoModalOpen && <EndToEndDemoModal />}
    </div>
  );
}
