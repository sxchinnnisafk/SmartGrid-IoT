"use client";

import React from "react";
import { useGrid } from "../context/GridContext";
import { ChevronRight, Layers } from "lucide-react";

export default function ControlRoomSidebar() {
  const { nodes, selectedNodeId, setSelectedNodeId } = useGrid();
  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <aside className="w-full lg:w-80 xl:w-[340px] rounded-3xl bg-parchment border border-parchment-border text-parchment-text shadow-parchment p-5 flex flex-col justify-between select-none shrink-0">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-parchment-text tracking-tight">
            Grid status
          </h2>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cobalt-tint text-cobalt text-xs font-sans font-semibold">
            <span className="w-2 h-2 rounded-full bg-cobalt animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        <p className="text-xs font-sans text-parchment-muted mb-5">
          3 corridor assets under real-time monitoring
        </p>

        {/* Asset Cards List (Semantic buttons for keyboard access) */}
        <div className="space-y-2.5">
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            let badgeBg = "bg-signal-normalBg text-signal-normalText border-signal-normalBorder";
            let dotColor = "bg-signal-normalBright";

            if (node.status === "warning") {
              badgeBg = "bg-signal-warningBg text-signal-warningText border-signal-warningBorder";
              dotColor = "bg-signal-warningBright";
            } else if (node.status === "critical") {
              badgeBg = "bg-signal-criticalBg text-signal-criticalText border-signal-criticalBorder";
              dotColor = "bg-signal-criticalBright";
            }

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNodeId(node.id)}
                className={`w-full p-3 rounded-2xl border transition-colors text-left flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? "bg-parchment-bright border-cobalt shadow-sm ring-2 ring-cobalt/20"
                    : "bg-parchment-light border-parchment-border hover:bg-parchment-bright hover:border-cobalt"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-ink-onAccent shrink-0 ${
                      node.status === "critical" ? "bg-signal-critical" : "bg-control"
                    }`}
                  >
                    {node.badge}
                  </span>

                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm text-parchment-text leading-snug truncate">
                      {node.name}
                    </div>
                    <p className="text-[11px] text-parchment-muted truncate leading-tight">
                      {node.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold border ${badgeBg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span>{node.statusLabel}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-parchment-subtle" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Real-Time Telemetry Readout */}
      <div className="my-4 p-4 rounded-2xl bg-parchment-light border border-parchment-borderStrong text-xs">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-parchment-border">
          <span className="font-sans font-medium text-parchment-muted">Live telemetry</span>
          <span className="font-mono text-cobalt font-semibold">{activeNode.id.toUpperCase()}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="bg-parchment p-2 rounded-xl">
            <div className="text-[11px] font-sans text-parchment-muted">Temp</div>
            <div className="text-xs font-bold text-parchment-text mt-0.5">
              {activeNode.temperature}°C
            </div>
          </div>
          <div className="bg-parchment p-2 rounded-xl">
            <div className="text-[11px] font-sans text-parchment-muted">Volt</div>
            <div className="text-xs font-bold text-cobalt mt-0.5">
              {activeNode.voltage}V
            </div>
          </div>
          <div className="bg-parchment p-2 rounded-xl">
            <div className="text-[11px] font-sans text-parchment-muted">Load</div>
            <div className="text-xs font-bold text-parchment-text mt-0.5">
              {activeNode.powerLoad}MW
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Principles Footer */}
      <div className="pt-3 border-t border-parchment-border flex flex-col gap-2">
        <div className="flex items-center justify-between text-parchment-secondary text-xs font-sans">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-cobalt" aria-hidden="true" />
            People and infrastructure
          </span>
          <span className="text-parchment-muted">Human-centered</span>
        </div>

        <div className="h-6 w-full overflow-hidden opacity-35">
          <svg aria-hidden="true" className="w-full h-full" viewBox="0 0 300 32">
            <path d="M 0,8 Q 75,20 150,8 T 300,12" stroke="var(--color-paper-muted)" fill="none" strokeWidth="1" />
            <path d="M 0,18 Q 75,30 150,18 T 300,22" stroke="var(--color-paper-muted)" fill="none" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
