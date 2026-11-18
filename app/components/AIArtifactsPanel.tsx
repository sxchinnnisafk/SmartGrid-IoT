"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import {
  FileText,
  X,
} from "lucide-react";

export default function AIArtifactsPanel() {
  const {
    nodes,
    isFaultActive,
  } = useGrid();

  const [activeModalArtifact, setActiveModalArtifact] = useState<string | null>(null);

  const nodeA = nodes.find((n) => n.id === "node-a") || nodes[0];
  const nodeB = nodes.find((n) => n.id === "node-b") || nodes[1];
  const nodeC = nodes.find((n) => n.id === "node-c") || nodes[2];

  return (
    <>
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 rounded-3xl bg-ink-surface border border-ink-border text-ink-text p-5 flex flex-col justify-between select-none">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-normal text-ink-text">
              Current artifacts
            </h2>
          </div>

          <div className="space-y-3.5">
            {/* ARTIFACT 1: Live Grid Snapshot */}
            <div className="rounded-2xl bg-ink-card border border-ink-border p-3.5 text-xs font-sans">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink-text text-xs truncate">
                    Grid snapshot
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-signal-normalBright font-mono mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-normalBright animate-pulse" />
                    <span>Live data</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalArtifact("snapshot")}
                  className="px-3 py-1 rounded-full bg-cobalt hover:bg-cobalt-hover text-ink-onAccent text-[11px] font-semibold transition-colors shrink-0"
                >
                  Open
                </button>
              </div>

              <div className="rounded-xl bg-ink-deep border border-ink-border p-3 relative overflow-hidden">
                <svg aria-hidden="true" className="w-full h-14" viewBox="0 0 240 56" fill="none">
                  <path
                    d="M 30,42 Q 120,12 210,42"
                    stroke="var(--color-cobalt)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="30" cy="42" r="6.5" fill="var(--color-signal-normal-bright)" />
                  <circle
                    cx="120"
                    cy="20"
                    r="7.5"
                    fill={
                      isFaultActive
                        ? "var(--color-signal-critical-bright)"
                        : "var(--color-signal-normal-bright)"
                    }
                    className={isFaultActive ? "animate-pulse" : ""}
                  />
                  <circle cx="210" cy="42" r="6.5" fill="var(--color-signal-warning-bright)" />
                </svg>

                <div className="grid grid-cols-3 text-[10px] font-mono mt-1">
                  <div className="text-left">
                    <div className="text-ink-text font-semibold">Node A</div>
                    <div className="text-ink-muted">{nodeA.powerLoad} MW</div>
                  </div>
                  <div
                    className={`text-center font-semibold ${
                      isFaultActive ? "text-signal-criticalBright" : "text-signal-normalBright"
                    }`}
                  >
                    <div>Node C</div>
                    <div>{nodeC.voltage}V</div>
                  </div>
                  <div className="text-right">
                    <div className="text-ink-text font-semibold">Node B</div>
                    <div className="text-ink-muted">{nodeB.powerLoad} MW</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ARTIFACT 2: AI Maintenance Report */}
            <div className="rounded-2xl bg-ink-card border border-ink-border p-3.5 text-xs font-sans">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cobalt-tint border border-cobalt-border flex items-center justify-center text-cobalt-soft shrink-0">
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink-text text-xs truncate">
                      AI maintenance report
                    </h3>
                    <div className="text-[11px] text-signal-normalBright font-mono">
                      Ready · 10:18 AM
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalArtifact("report")}
                  className="px-3 py-1 rounded-full bg-cobalt hover:bg-cobalt-hover text-ink-onAccent text-[11px] font-semibold transition-colors shrink-0"
                >
                  Open
                </button>
              </div>

              <p className="text-[11px] text-ink-muted leading-relaxed">
                AI monitoring summary of Node C overload readings and suggested operator checks.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-ink-border mt-4 text-center text-[11px] font-sans text-ink-muted">
          People, infrastructure, cleaner tomorrow
        </div>
      </aside>

      {/* Artifact Modal for Detailed Report Inspection */}
      {activeModalArtifact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-deep/80 backdrop-blur-md"
          onClick={() => setActiveModalArtifact(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-ink-surface border border-ink-borderStrong p-6 text-ink-text shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-ink-border mb-4">
              <div>
                <h3 className="font-serif text-2xl text-ink-text">
                  {activeModalArtifact === "snapshot"
                    ? "Live Grid Topology Snapshot"
                    : "AI Maintenance Diagnostic Report"}
                </h3>
                <p className="text-xs font-sans text-cobalt-soft mt-0.5">
                  IEEE 1547 & BESCOM O&M Framework Reference
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalArtifact(null)}
                aria-label="Close artifact modal"
                className="p-1.5 rounded-full hover:bg-ink-hover text-ink-muted hover:text-ink-text transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans">
              <div className="p-3.5 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-ink-text font-semibold mb-1">Incident Summary</div>
                <p>
                  Node C (Industrial Transformer) reported phase voltage at {nodeC.voltage}V with {nodeC.current}A current draw and {nodeC.powerLoad}{nodeC.powerLoadUnit} load.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-ink-text font-semibold mb-1">Suggested Operator Checks</div>
                <p>
                  1. Verify Node C voltage sag ({nodeC.voltage}V) and current load ({nodeC.current}A) on the live digital twin.<br />
                  2. Review available headroom on Residential Feeder A (98MW / 120MW limit) and EV Hub B before any manual load changes.<br />
                  3. Coordinate manual on-site inspection if abnormal readings persist (no automated dispatch is performed by the web app).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-ink-text font-semibold mb-1">Evidence & Data Sources</div>
                <p>
                  Historical benchmark: KERC Combined Tariff Order 2025 records BESCOM repair expenditure of ₹134.44 Cr for 36,035 faulty distribution transformers in FY 2023 to 2024.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
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
