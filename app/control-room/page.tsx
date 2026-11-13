"use client";

import React from "react";
import BrandHeader from "../components/BrandHeader";
import ControlRoomCanvas from "../components/ControlRoomCanvas";
import ControlRoomSidebar from "../components/ControlRoomSidebar";
import ControlRoomActionDock from "../components/ControlRoomActionDock";
import HardwareEvidenceModal from "../components/HardwareEvidenceModal";
import EndToEndDemoModal from "../components/EndToEndDemoModal";
import { useGrid } from "../context/GridContext";

export default function ControlRoomPage() {
  const { isEvidenceModalOpen, isDemoModalOpen } = useGrid();

  return (
    <div className="min-h-screen bg-[#11141b] text-[#f4f5f8] flex flex-col justify-between selection:bg-[#3b59f8] selection:text-white">
      {/* 1. Brand Header */}
      <BrandHeader currentViewTitle="Control Room" variant="control-room" />

      {/* 2. Main Stage */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 lg:px-8 py-6 flex flex-col justify-between gap-6">
        {/* Upper Grid: Left Canvas + Right Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 items-stretch">
          {/* Main Isometric Interactive Stage */}
          <div className="flex-1 flex flex-col">
            <ControlRoomCanvas />
          </div>

          {/* Right Status Sidebar */}
          <div className="flex lg:flex-none">
            <ControlRoomSidebar />
          </div>
        </div>

        {/* Lower Action Dock (Start Patrol, Test Scenario, Publish Changes) */}
        <div className="w-full">
          <ControlRoomActionDock />
        </div>
      </main>

      {/* Modals */}
      {isEvidenceModalOpen && <HardwareEvidenceModal />}
      {isDemoModalOpen && <EndToEndDemoModal />}
    </div>
  );
}
