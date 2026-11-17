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
    <div className="min-h-screen bg-ink text-ink-text flex flex-col justify-between selection:bg-cobalt selection:text-ink-onAccent">
      <BrandHeader currentViewTitle="Control Room" variant="control-room" />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 lg:px-6 py-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col lg:flex-row gap-5 flex-1 items-stretch min-w-0">
          <div className="flex-1 flex flex-col min-w-0">
            <ControlRoomCanvas />
          </div>

          <div className="flex lg:flex-none min-w-0">
            <ControlRoomSidebar />
          </div>
        </div>

        <div className="w-full">
          <ControlRoomActionDock />
        </div>
      </main>

      {isEvidenceModalOpen && <HardwareEvidenceModal />}
      {isDemoModalOpen && <EndToEndDemoModal />}
    </div>
  );
}
