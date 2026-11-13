"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import { Play, Pause, FlaskConical, Upload, CheckCircle2 } from "lucide-react";

export default function ControlRoomActionDock() {
  const {
    rover,
    startPatrol,
    stopPatrol,
    startEndToEndDemo,
    publishWorkflow,
    isThermalFaultActive,
    triggerThermalFault,
  } = useGrid();

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const handlePatrolToggle = () => {
    if (rover.isPatrolling) {
      stopPatrol();
    } else {
      startPatrol();
    }
  };

  const handlePublishConfirm = () => {
    publishWorkflow();
    setIsPublishModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full select-none">
        {/* ACTION 1: Start Patrol (Primary Royal Cobalt) */}
        <button
          onClick={handlePatrolToggle}
          className="group relative rounded-2xl bg-[#3b59f8] hover:bg-[#2f4bd8] text-white p-5 lg:p-6 shadow-cobalt transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-4 text-left border border-white/10"
        >
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {rover.isPatrolling ? (
              <Pause className="w-6 h-6 fill-white text-white" />
            ) : (
              <Play className="w-6 h-6 fill-white text-white ml-0.5" />
            )}
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-white leading-tight">
              {rover.isPatrolling ? "Pause patrol" : "Start patrol"}
            </h3>
            <p className="text-[11px] font-mono tracking-widest text-white/80 uppercase mt-0.5">
              DEPLOY ESP32-S3 ROVER
            </p>
          </div>
        </button>

        {/* ACTION 2: Test Scenario (Parchment Card) */}
        <button
          onClick={startEndToEndDemo}
          className="group relative rounded-2xl bg-[#ede4d8] hover:bg-[#f6eee3] text-[#1c1f28] p-5 lg:p-6 border border-[#d8cdbd] shadow-parchment transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-4 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[#e0d3c0] flex items-center justify-center shrink-0 text-[#3b59f8] group-hover:scale-105 transition-transform">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#181a24] leading-tight">
              Test scenario
            </h3>
            <p className="text-[11px] font-mono tracking-widest text-[#717888] uppercase mt-0.5">
              SIMULATE GRID EVENTS
            </p>
          </div>
        </button>

        {/* ACTION 3: Publish Changes (Parchment Card) */}
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="group relative rounded-2xl bg-[#ede4d8] hover:bg-[#f6eee3] text-[#1c1f28] p-5 lg:p-6 border border-[#d8cdbd] shadow-parchment transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-4 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-[#e0d3c0] flex items-center justify-center shrink-0 text-[#3b59f8] group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#181a24] leading-tight">
              Publish changes
            </h3>
            <p className="text-[11px] font-mono tracking-widest text-[#717888] uppercase mt-0.5">
              APPLY TO LIVE SYSTEM
            </p>
          </div>
        </button>
      </div>

      {/* Operator Publish Confirmation Dialog */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#ede4d8] border border-[#d8cdbd] p-6 text-[#1c1f28] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#3b59f8] text-white flex items-center justify-center shadow">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#181a24] font-normal">
                  Publish Changes to Edge
                </h3>
                <p className="text-xs font-mono text-[#717888]">
                  OPERATOR RETURN PATH TRANSMISSION
                </p>
              </div>
            </div>

            <p className="text-xs text-[#525968] leading-relaxed mb-4">
              This action transmits operator-approved threshold parameters and circuit breaker isolation commands back through the Supabase Realtime telemetry loop to the ESP32-S3 Rover and edge nodes.
            </p>

            <div className="p-3 rounded-xl bg-[#f5eee5] border border-[#d8ccbb] font-mono text-xs mb-6 space-y-1">
              <div className="flex justify-between">
                <span className="text-[#717888]">Target Edge:</span>
                <span className="font-bold text-[#181a24]">ESP32-S3 / Node A, B, C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717888]">Breaker SC-12:</span>
                <span className="font-bold text-[#ef4444]">Simulated Isolation Armed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717888]">Operator ID:</span>
                <span className="font-bold text-[#3b59f8]">Jordan Diaz (JD)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#ded2c2] hover:bg-[#d0c2b0] text-xs font-mono text-[#181a24] font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishConfirm}
                className="pill-button-cobalt text-xs py-2 px-5"
              >
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
