"use client";

import React from "react";
import { useGrid } from "../context/GridContext";
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Navigation,
  Activity,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export default function EndToEndDemoModal() {
  const {
    isDemoModalOpen,
    setIsDemoModalOpen,
    currentDemoStep,
    runDemoStep,
    resetDemo,
    rover,
    isThermalFaultActive,
    isPlayingVoice,
    toggleVoicePlayback,
  } = useGrid();

  if (!isDemoModalOpen) return null;

  const steps = [
    {
      num: 1,
      title: "START PATROL",
      badge: "Operator Command",
      desc: "The operator starts the rover from the control room. The ESP32-S3 rover receives command via Wi-Fi and begins its patrol route from Node A.",
      icon: Play,
      statusLabel: rover.isPatrolling ? "Rover Dispatched" : "Ready to Start",
    },
    {
      num: 2,
      title: "PATROL + SENSE",
      badge: "Real-Time Telemetry",
      desc: "The rover moves from Node A through Node B toward Node C, streaming live telemetry (temperature, voltage, current) to the digital twin.",
      icon: Navigation,
      statusLabel: "Streaming Wi-Fi Telemetry",
    },
    {
      num: 3,
      title: "TRIGGER THE EVENT",
      badge: "Thermal Anomaly",
      desc: "A controlled thermal or load anomaly is introduced at Node C (102°C detected exceeding 85°C critical threshold) using a low-voltage demo input.",
      icon: AlertTriangle,
      statusLabel: isThermalFaultActive ? "102°C Critical Fault Injected" : "Nominal",
    },
    {
      num: 4,
      title: "EDGE RESPONSE",
      badge: "Local Safety Interlock",
      desc: "The rover halts its patrol in the Node C perimeter, its TFT display switches to a critical alert expression, and a relay simulates breaker isolation.",
      icon: Activity,
      statusLabel: "Rover Halted • TFT Alert",
    },
    {
      num: 5,
      title: "TWIN + AI RESPONSE",
      badge: "Operator Support & Voice",
      desc: "The digital twin marks Node C critical and animates a simulated reroute; AI summarizes the event and prepares a dispatch brief, with spoken voice alert.",
      icon: Volume2,
      statusLabel: isPlayingVoice ? "Spoken Alert Playing" : "Dispatch Brief Ready",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#141824] border border-[#273247] shadow-2xl p-6 sm:p-8 text-[#f4f5f8] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#222a3d] mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#818cf8] uppercase tracking-wider mb-1">
              <span>05 / END-TO-END DEMONSTRATION • POWER HACK 2026</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              One Fault. A Synchronized Response.
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] mt-1">
              The 5-stage tabletop sequence linking edge sensing, physical rover action, digital twin visibility, and AI-assisted operator mitigation.
            </p>
          </div>
          <button
            onClick={() => setIsDemoModalOpen(false)}
            className="p-2 rounded-full bg-[#1b2232] hover:bg-[#28334b] text-[#9ca3af] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Step Tracker Cards */}
        <div className="space-y-4 mb-6">
          {steps.map((st) => {
            const isCurrent = currentDemoStep === st.num;
            const isCompleted = currentDemoStep > st.num;
            const Icon = st.icon;

            return (
              <div
                key={st.num}
                onClick={() => runDemoStep(st.num)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isCurrent
                    ? "bg-[#1f283c] border-[#3b59f8] shadow-cobalt"
                    : isCompleted
                    ? "bg-[#141a27] border-[#22c55e]/40 text-[#cbd5e1]"
                    : "bg-[#10141e] border-[#1e2636] text-[#6b7280]"
                }`}
              >
                {/* Step Number Circle */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 font-mono ${
                    isCompleted
                      ? "bg-[#22c55e] text-black"
                      : isCurrent
                      ? "bg-[#3b59f8] text-white shadow"
                      : "bg-[#1f2638] text-[#9ca3af]"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `0${st.num}`}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base text-white font-semibold">
                        {st.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2a344d] text-[#93c5fd]">
                        {st.badge}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isCurrent
                          ? "text-[#3b59f8] animate-pulse"
                          : isCompleted
                          ? "text-[#22c55e]"
                          : "text-[#6b7280]"
                      }`}
                    >
                      {st.statusLabel}
                    </span>
                  </div>

                  <p className="text-xs text-[#9ca3af] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Boundary Notice */}
        <div className="p-4 rounded-2xl bg-[#1b2334] border border-[#2d3a52] text-xs font-mono text-[#cbd5e1] mb-6 flex items-center justify-between gap-4">
          <div>
            <span className="text-[#38bdf8] font-bold">DEMO BOUNDARY:</span> Breaker isolation and power rerouting are simulated on a safe, isolated low-voltage tabletop setup.
          </div>
          <button
            onClick={resetDemo}
            className="px-3 py-1.5 rounded-lg bg-[#253046] hover:bg-[#32405d] text-xs font-mono text-[#e2e8f0] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#222a3d]">
          <span className="text-xs font-mono text-[#9ca3af]">
            Click any step to jump, or advance sequentially:
          </span>

          <div className="flex items-center gap-3">
            {currentDemoStep < 5 ? (
              <button
                onClick={() => runDemoStep(currentDemoStep + 1)}
                className="pill-button-cobalt text-xs py-2.5 px-6"
              >
                <span>Advance to Step 0{currentDemoStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  toggleVoicePlayback();
                  setIsDemoModalOpen(false);
                }}
                className="pill-button-cobalt text-xs py-2.5 px-6"
              >
                <span>Complete & View AI Dispatch</span>
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
