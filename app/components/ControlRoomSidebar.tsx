"use client";

import React from "react";
import { useGrid } from "../context/GridContext";
import { ChevronRight, Layers, Activity, Zap } from "lucide-react";

export default function ControlRoomSidebar() {
  const { nodes, selectedNodeId, setSelectedNodeId } = useGrid();

  return (
    <aside className="w-full lg:w-80 xl:w-96 rounded-3xl bg-[#ede4d8] border border-[#d8cdbd] text-[#1c1f28] shadow-parchment p-6 flex flex-col justify-between select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-3xl font-normal text-[#181a24] tracking-tight">
            Grid status
          </h2>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3b59f8]/10 text-[#3b59f8] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#3b59f8] animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-[10px] font-mono tracking-widest text-[#717888] uppercase mb-6">
          3 ASSETS • REAL-TIME MONITORING
        </p>

        {/* Asset Cards List */}
        <div className="space-y-3">
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            let badgeBg = "bg-[#dcfce7] text-[#166534] border-[#bbf7d0]";
            let dotColor = "bg-[#22c55e]";
            let badgeText = "Normal";

            if (node.status === "warning") {
              badgeBg = "bg-[#fef3c7] text-[#92400e] border-[#fde68a]";
              dotColor = "bg-[#f59e0b]";
              badgeText = "Warning";
            } else if (node.status === "critical") {
              badgeBg = "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]";
              dotColor = "bg-[#ef4444]";
              badgeText = "Critical";
            }

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-[#fdfaf5] border-[#3b59f8] shadow-md ring-2 ring-[#3b59f8]/20"
                    : "bg-[#f6efe6] border-[#d8cdbd] hover:bg-white hover:border-[#3b59f8]"
                }`}
              >
                {/* Left Badge + Title */}
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm ${
                      node.badge === "C" ? "bg-[#dc2626]" : "bg-[#4f46e5]"
                    }`}
                  >
                    {node.badge}
                  </span>

                  <div className="text-left font-sans">
                    <h3 className="font-semibold text-xs sm:text-sm text-[#181a24] leading-snug">
                      {node.name}
                    </h3>
                    <p className="text-[11px] text-[#636a7b] line-clamp-1 leading-tight">
                      {node.description}
                    </p>
                  </div>
                </div>

                {/* Right Status Badge + Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${badgeBg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span>{badgeText}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8a91a2]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Real-Time Telemetry Expanded Drawer */}
      <div className="my-6 p-4 rounded-2xl bg-[#f7f1e7] border border-[#d6c7b3] font-mono text-xs">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#ded2c1]">
          <span className="text-[10px] text-[#636a7b] uppercase">Live Telemetry</span>
          <span className="text-[#3b59f8] font-bold">{selectedNodeId.toUpperCase()}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#ede4d8] p-2 rounded-xl">
            <div className="text-[9px] text-[#636a7b]">TEMP</div>
            <div className="text-xs font-bold text-[#181a24]">
              {nodes.find((n) => n.id === selectedNodeId)?.temperature}°C
            </div>
          </div>
          <div className="bg-[#ede4d8] p-2 rounded-xl">
            <div className="text-[9px] text-[#636a7b]">VOLT</div>
            <div className="text-xs font-bold text-[#3b59f8]">
              {nodes.find((n) => n.id === selectedNodeId)?.voltage}V
            </div>
          </div>
          <div className="bg-[#ede4d8] p-2 rounded-xl">
            <div className="text-[9px] text-[#636a7b]">LOAD</div>
            <div className="text-xs font-bold text-[#181a24]">
              {nodes.find((n) => n.id === selectedNodeId)?.powerLoad}MW
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Values & Topography Section matching concept photo */}
      <div className="pt-4 border-t border-[#d8cdbd] flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#4f5667] text-xs font-mono">
          <Layers className="w-4 h-4 text-[#3b59f8]" />
          <span className="tracking-wider uppercase text-[10px]">
            PEOPLE • INFRASTRUCTURE
          </span>
        </div>

        <div className="text-[10px] tracking-widest uppercase text-[#717888] font-mono">
          A CLEANER TOMORROW
        </div>

        {/* Contour lines decoration */}
        <div className="h-10 w-full overflow-hidden opacity-30">
          <svg className="w-full h-full" viewBox="0 0 300 40">
            <path d="M 0,10 Q 75,25 150,10 T 300,15" stroke="#717888" fill="none" strokeWidth="1" />
            <path d="M 0,20 Q 75,35 150,20 T 300,25" stroke="#717888" fill="none" strokeWidth="1" />
            <path d="M 0,30 Q 75,45 150,30 T 300,35" stroke="#717888" fill="none" strokeWidth="1" />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[#636a7b] uppercase">
          <span>SMART</span>
          <span>•</span>
          <span>RESILIENT</span>
          <span>•</span>
          <span>HUMAN-CENTERED</span>
        </div>
      </div>
    </aside>
  );
}
