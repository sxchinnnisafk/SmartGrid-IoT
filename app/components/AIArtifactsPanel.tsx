"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGrid } from "../context/GridContext";
import {
  FileText,
  GitBranch,
  Volume2,
  Play,
  Pause,
  ExternalLink,
  Layers,
  Sparkles,
  AlertTriangle,
  X,
} from "lucide-react";

export default function AIArtifactsPanel() {
  const router = useRouter();
  const {
    isPlayingVoice,
    toggleVoicePlayback,
    voiceProgress,
    isThermalFaultActive,
    setActiveTab,
  } = useGrid();

  const [activeModalArtifact, setActiveModalArtifact] = useState<string | null>(null);

  return (
    <>
      <aside className="w-full lg:w-80 xl:w-96 rounded-3xl bg-[#141822] border border-[#242c3e] text-[#f4f5f8] p-5 xl:p-6 flex flex-col justify-between select-none">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-4 h-4 text-[#818cf8]" />
            <h2 className="font-serif text-2xl font-normal text-white">
              Current artifacts
            </h2>
          </div>

          <div className="space-y-4">
            {/* ARTIFACT 1: Grid Snapshot */}
            <div className="rounded-2xl bg-[#1b2230] border border-[#29354a] p-4 text-xs font-sans">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white text-xs">
                    Grid snapshot
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#22c55e] font-mono mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                    <span>Live data • 10:24 AM</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalArtifact("snapshot")}
                  className="px-3 py-1 rounded-full bg-[#3b59f8] hover:bg-[#2f4bd8] text-white text-[11px] font-semibold transition-colors"
                >
                  Open
                </button>
              </div>

              {/* Mini Topology Map matching photo */}
              <div className="rounded-xl bg-[#121620] border border-[#232d3f] p-3 relative overflow-hidden">
                <svg className="w-full h-16" viewBox="0 0 240 60" fill="none">
                  {/* Energy Line */}
                  <path
                    d="M 30,45 Q 120,15 210,45"
                    stroke="#3b59f8"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Node A (98 MW, Green) */}
                  <circle cx="30" cy="45" r="7" fill="#22c55e" />
                  {/* Node C (102°C, Red Alert) */}
                  <circle cx="120" cy="22" r="8" fill="#ef4444" className="animate-pulse" />
                  {/* Node B (76 MW, Green) */}
                  <circle cx="210" cy="45" r="7" fill="#22c55e" />
                </svg>

                {/* Node labels */}
                <div className="flex items-center justify-between text-[9px] font-mono mt-1">
                  <div className="text-left">
                    <div className="text-white font-bold">Node A</div>
                    <div className="text-[#9ca3af]">98 MW</div>
                  </div>
                  <div className="text-center text-[#ef4444] font-bold">
                    <div>Node C</div>
                    <div>102 °C</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">Node B</div>
                    <div className="text-[#9ca3af]">76 MW</div>
                  </div>
                </div>

                {/* Mini Legend */}
                <div className="mt-2 pt-2 border-t border-[#1e2738] flex items-center justify-end gap-3 text-[8px] font-mono text-[#9ca3af]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Normal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> Warning
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" /> Critical
                  </span>
                </div>
              </div>
            </div>

            {/* ARTIFACT 2: AI Maintenance Report */}
            <div className="rounded-2xl bg-[#1b2230] border border-[#29354a] p-4 text-xs font-sans">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#818cf8]">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs">
                      AI maintenance report
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#22c55e] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                      <span>Ready • 10:18 AM</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalArtifact("report")}
                  className="px-3 py-1 rounded-full bg-[#3b59f8] hover:bg-[#2f4bd8] text-white text-[11px] font-semibold transition-colors"
                >
                  Open
                </button>
              </div>

              <p className="text-[11px] text-[#9ca3af] leading-relaxed pl-9">
                Automated analysis of Node C thermal event and risk assessment.
              </p>
            </div>

            {/* ARTIFACT 3: Fault Response Workflow */}
            <div className="rounded-2xl bg-[#1b2230] border border-[#29354a] p-4 text-xs font-sans">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#818cf8]">
                    <GitBranch className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs">
                      Fault response workflow
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#f59e0b] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                      <span>Ready • 10:20 AM</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/workflow")}
                  className="px-3 py-1 rounded-full bg-[#3b59f8] hover:bg-[#2f4bd8] text-white text-[11px] font-semibold transition-colors"
                >
                  Open
                </button>
              </div>

              <p className="text-[11px] text-[#9ca3af] leading-relaxed pl-9">
                Isolate, reroute, dispatch — recommended steps included.
              </p>
            </div>

            {/* ARTIFACT 4: Voice Dispatch Preview */}
            <div className="rounded-2xl bg-[#1b2230] border border-[#29354a] p-4 text-xs font-sans">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#818cf8]">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-xs">
                      Voice dispatch preview
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#9ca3af] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]" />
                      <span>Generated • 10:22 AM</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={toggleVoicePlayback}
                  className="px-3 py-1 rounded-full bg-[#3b59f8] hover:bg-[#2f4bd8] text-white text-[11px] font-semibold transition-colors"
                >
                  Open
                </button>
              </div>

              {/* Working Audio Waveform Player */}
              <div className="mt-3 p-3 rounded-xl bg-[#121620] border border-[#232d3f] flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="italic text-[11px] text-[#cbd5e1] leading-tight font-serif mb-1">
                    &ldquo;Dispatching field crew to Node C. Thermal fault detected. Bring standard repair kit.&rdquo;
                  </p>
                  <div className="flex items-center gap-1 h-3 mt-1.5">
                    {[3, 6, 9, 12, 8, 14, 10, 6, 12, 16, 9, 5, 8, 11, 6].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-200 ${
                          isPlayingVoice ? "bg-[#3b59f8] animate-pulse" : "bg-[#374151]"
                        }`}
                        style={{ height: `${isPlayingVoice ? Math.min(16, h + (i % 3) * 2) : h}px` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Play Button & Timer */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={toggleVoicePlayback}
                    className="w-8 h-8 rounded-full bg-[#3b59f8] hover:bg-[#2f4bd8] text-white flex items-center justify-center shadow-cobalt"
                    title={isPlayingVoice ? "Pause Spoken Alert" : "Play Spoken Alert"}
                  >
                    {isPlayingVoice ? (
                      <Pause className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    )}
                  </button>
                  <span className="text-[11px] font-mono text-[#9ca3af]">
                    0:{voiceProgress < 10 ? `0${voiceProgress}` : voiceProgress} / 0:18
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Values Footer matching screenshot */}
        <div className="pt-6 border-t border-[#222a3d] mt-6 text-center">
          <div className="flex items-center justify-center gap-6 text-[10px] font-mono tracking-widest text-[#717a8c] uppercase">
            <span>PEOPLE</span>
            <span>INFRASTRUCTURE</span>
            <span>A CLEANER TOMORROW</span>
          </div>
        </div>
      </aside>

      {/* Artifact Modal for Detailed Report Inspection */}
      {activeModalArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl bg-[#141824] border border-[#273247] p-6 text-[#f4f5f8] shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-[#222a3d] mb-4">
              <div>
                <h3 className="font-serif text-2xl text-white">
                  {activeModalArtifact === "snapshot"
                    ? "Live Grid Topology Snapshot"
                    : "AI Maintenance Diagnostic Report"}
                </h3>
                <p className="text-xs font-mono text-[#818cf8]">
                  IEEE 1547 & BESCOM O&M FRAMEWORK REFERENCE
                </p>
              </div>
              <button
                onClick={() => setActiveModalArtifact(null)}
                className="p-1.5 rounded-full hover:bg-[#1e2536] text-[#9ca3af] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#cbd5e1] font-mono">
              <div className="p-3 rounded-xl bg-[#1a2130] border border-[#273247]">
                <div className="text-white font-bold mb-1">INCIDENT SUMMARY</div>
                <p>
                  Node C (Industrial Transformer) reported thermal spike to 102.0°C exceeding the 85.0°C critical threshold. Phase voltage sag observed at 194.5V with 285A current draw.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1a2130] border border-[#273247]">
                <div className="text-white font-bold mb-1">RECOMMENDED OPERATOR MITIGATION</div>
                <p>
                  1. Execute remote breaker isolation command for Node C bay.<br />
                  2. Reroute 26MW industrial surplus to Residential Feeder A (headroom available: 98MW / 120MW limit).<br />
                  3. Dispatch field crew with standard transformer inspection toolkit.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1a2130] border border-[#273247]">
                <div className="text-white font-bold mb-1">EVIDENCE & DATA SOURCES</div>
                <p>
                  Historical benchmark: KERC Combined Tariff Order 2025 records BESCOM repair expenditure of ₹134.44 Cr for 36,035 faulty distribution transformers in FY 2023-24.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalArtifact(null)}
                className="pill-button-cobalt text-xs py-2 px-5"
              >
                Close Artifact
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
