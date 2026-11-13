"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGrid } from "../context/GridContext";
import {
  MessageSquare,
  GitBranch,
  Plus,
  Sliders,
  Settings,
  AlertTriangle,
  Users,
  MoreVertical,
  Maximize2,
  Play,
  Upload,
  Info,
  CheckCircle2,
  Paperclip,
  Mic,
} from "lucide-react";

export default function WorkflowCanvas() {
  const router = useRouter();
  const {
    isBreakerIsolated,
    toggleBreakerIsolation,
    isWorkflowExecuting,
    testWorkflow,
    publishWorkflow,
    activeTab,
    setActiveTab,
  } = useGrid();

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeStepMenu, setActiveStepMenu] = useState<string | null>(null);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(140, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(70, z - 10));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="flex-1 rounded-3xl bg-[#ede4d8] border border-[#d8cdbd] text-[#1c1f28] shadow-parchment p-6 xl:p-8 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#ded2c1]">
          <div>
            <h1 className="font-serif text-3xl xl:text-4xl font-normal text-[#181a24] tracking-tight">
              SmartGrid AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-[#5d6475] font-sans mt-0.5">
              Your AI partner for a more resilient grid.
            </p>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-[#717888] uppercase text-right">
            REAL-TIME DATA • SECURE • BUILT FOR A CLEANER TOMORROW
          </div>
        </div>

        {/* Mode Switcher Pills: Chat vs Workflow */}
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex p-1 rounded-full bg-[#dfd4c3] border border-[#cfc3b0]">
            <Link
              href="/ai-assistant"
              className="flex items-center gap-2 px-6 py-2 rounded-full text-[#525968] hover:text-[#181a24] text-xs font-semibold transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </Link>
            <button
              onClick={() => setActiveTab("workflow")}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#3b59f8] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Workflow</span>
            </button>
          </div>
        </div>

        {/* Free-Form Workflow Canvas Surface matching screenshot */}
        <div className="relative w-full h-[480px] xl:h-[520px] rounded-2xl bg-[#ede4d8] border border-[#d6c7b3] p-6 shadow-inner overflow-hidden select-none bg-parchment-canvas">
          {/* Top Right Info Notice */}
          <div className="absolute top-4 right-5 z-20 flex items-center gap-1.5 text-xs text-[#62697b] font-sans">
            <Info className="w-4 h-4 text-[#7b8395]" />
            <span>Drag items freely to arrange the flow</span>
          </div>

          {/* Floating Left Palette */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 p-1.5 rounded-2xl bg-[#f5eee5] border border-[#d8ccbb] shadow-md text-xs font-mono">
            <button
              onClick={() => alert("Add custom workflow trigger, threshold gate, or contactor step.")}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white hover:bg-[#ede4d8] text-[#3b59f8] border border-[#d8ccbb] transition-all"
              title="Add step"
            >
              <Plus className="w-5 h-5 text-[#3b59f8]" />
              <span className="text-[10px] font-bold">Add step</span>
            </button>

            <button
              onClick={() => alert("Condition node: Threshold comparative logic")}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-[#ede4d8] text-[#555c6d] transition-colors"
              title="Condition"
            >
              <GitBranch className="w-4 h-4" />
              <span className="text-[10px]">Condition</span>
            </button>

            <button
              onClick={() => alert("Action node: Contactor trip, telemetry alarm, dispatch call")}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-[#ede4d8] text-[#555c6d] transition-colors"
              title="Action"
            >
              <Settings className="w-4 h-4" />
              <span className="text-[10px]">Action</span>
            </button>
          </div>

          {/* Scalable Canvas Content */}
          <div
            className="relative w-full h-full transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
          >
            {/* SVG Curved Connecting Arrows matching concept photo */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 900 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="workflowArrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#3b59f8" />
                </marker>
              </defs>

              {/* Arrow 1: From Step 1 Output to Step 2 Input */}
              <path
                d="M 370,120 C 420,120 400,230 460,230"
                stroke="#3b59f8"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#workflowArrow)"
                className={isWorkflowExecuting ? "animate-pulse" : ""}
              />

              {/* Arrow 2: From Step 2 Output to Step 3 Input */}
              <path
                d="M 640,250 C 690,250 660,350 710,350"
                stroke="#3b59f8"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#workflowArrow)"
                className={isWorkflowExecuting ? "animate-pulse" : ""}
              />
            </svg>

            {/* STEP 1: Detect thermal fault (Orange warning triangle) */}
            <div
              className={`absolute top-[18%] left-[16%] z-20 w-64 rounded-2xl bg-[#f7f1e7] border p-3.5 shadow-md transition-all cursor-move ${
                isWorkflowExecuting
                  ? "border-[#ef4444] ring-2 ring-[#ef4444]/30"
                  : "border-[#d8ccbb] hover:border-[#3b59f8]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#fee2e2] text-[#dc2626] border border-[#fecaca] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-[#181a24]">
                      Detect thermal fault
                    </h3>
                    <p className="text-[11px] text-[#555d6e] font-sans">
                      Node C
                    </p>
                    <p className="text-[10px] text-[#dc2626] font-mono font-bold">
                      Threshold exceeded
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStepMenu(activeStepMenu === "step-1" ? null : "step-1")}
                  className="text-[#8c94a5] hover:text-[#181a24] p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Output connector dot */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#3b59f8] border-2 border-[#ede4d8] shadow" />
            </div>

            {/* STEP 2: Isolate breaker (Gear icon & Toggle switch) */}
            <div
              className={`absolute top-[42%] left-[45%] z-20 w-72 rounded-2xl bg-[#f7f1e7] border p-3.5 shadow-md transition-all cursor-move ${
                isWorkflowExecuting
                  ? "border-[#3b59f8] ring-2 ring-[#3b59f8]/30"
                  : "border-[#d8ccbb] hover:border-[#3b59f8]"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#e0e7ff] text-[#4f46e5] border border-[#c7d2fe] flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-[#181a24]">
                      Isolate breaker
                    </h3>
                    <p className="text-[11px] text-[#555d6e] font-sans">
                      Node C
                    </p>
                    <p className="text-[10px] text-[#717888] font-sans">
                      Open breaker to prevent damage
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStepMenu(activeStepMenu === "step-2" ? null : "step-2")}
                  className="text-[#8c94a5] hover:text-[#181a24] p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Switch matching concept photo */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#ded2c1]">
                <button
                  onClick={toggleBreakerIsolation}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isBreakerIsolated ? "bg-[#3b59f8]" : "bg-[#c5b8a6]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isBreakerIsolated ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-[11px] font-mono text-[#181a24] font-medium">
                  {isBreakerIsolated ? "Enabled" : "Disabled"}
                </span>
              </div>

              {/* Input & Output connector dots */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#3b59f8] border-2 border-[#ede4d8] shadow" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#3b59f8] border-2 border-[#ede4d8] shadow" />
            </div>

            {/* STEP 3: Dispatch field crew (Group icon & Ready status) */}
            <div
              className={`absolute top-[65%] left-[70%] z-20 w-64 rounded-2xl bg-[#f7f1e7] border p-3.5 shadow-md transition-all cursor-move ${
                isWorkflowExecuting
                  ? "border-[#22c55e] ring-2 ring-[#22c55e]/30"
                  : "border-[#d8ccbb] hover:border-[#3b59f8]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-[#181a24]">
                      Dispatch field crew
                    </h3>
                    <p className="text-[11px] text-[#555d6e] font-sans">
                      Node C
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#166534] font-mono font-bold mt-1">
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                      <span>Ready</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStepMenu(activeStepMenu === "step-3" ? null : "step-3")}
                  className="text-[#8c94a5] hover:text-[#181a24] p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Input connector dot */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#3b59f8] border-2 border-[#ede4d8] shadow" />
            </div>
          </div>

          {/* Canvas Bottom Left Zoom Controls matching screenshot */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5eee5] border border-[#d8ccbb] shadow-sm text-xs font-mono text-[#181a24]">
            <button
              onClick={handleZoomOut}
              className="w-5 h-5 rounded hover:bg-white flex items-center justify-center font-bold"
              title="Zoom out"
            >
              -
            </button>
            <span className="text-[11px] font-semibold">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="w-5 h-5 rounded hover:bg-white flex items-center justify-center font-bold"
              title="Zoom in"
            >
              +
            </button>
            <button
              onClick={handleResetZoom}
              className="w-5 h-5 rounded hover:bg-white flex items-center justify-center text-[#717888]"
              title="Fit to view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar below Canvas matching screenshot */}
      <div className="pt-4 border-t border-[#ded2c1] mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left input bar snippet */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md bg-[#f7f2ea] border border-[#d6c7b3] rounded-2xl px-3 py-2 text-xs text-[#788092]">
          <Paperclip className="w-4 h-4 text-[#788092]" />
          <span className="flex-1 truncate">Ask about the grid...</span>
          <Mic className="w-4 h-4 text-[#788092]" />
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={testWorkflow}
            disabled={isWorkflowExecuting}
            className="pill-button-parchment text-xs py-2.5 px-5 flex items-center gap-2"
          >
            <Play className={`w-3.5 h-3.5 text-[#3b59f8] ${isWorkflowExecuting ? "animate-spin" : ""}`} />
            <span>{isWorkflowExecuting ? "Testing..." : "Test workflow"}</span>
          </button>

          <button
            onClick={publishWorkflow}
            className="pill-button-cobalt text-xs py-2.5 px-6 flex items-center gap-2 shadow-cobalt"
          >
            <Upload className="w-4 h-4" />
            <span>Publish workflow</span>
          </button>
        </div>
      </div>
    </div>
  );
}
