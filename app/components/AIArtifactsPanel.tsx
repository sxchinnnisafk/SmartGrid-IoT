"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import { FileText, Compass, X } from "lucide-react";

export default function AIArtifactsPanel() {
  const { checkpoints, rover, isObstacleAlertActive } = useGrid();
  const [activeModalArtifact, setActiveModalArtifact] = useState<string | null>(null);

  const cpA = checkpoints.find((c) => c.id === "cp-a") || checkpoints[0];
  const cpB = checkpoints.find((c) => c.id === "cp-b") || checkpoints[1];
  const cpC = checkpoints.find((c) => c.id === "cp-c") || checkpoints[2];

  return (
    <>
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 rounded-3xl bg-ink-surface border border-ink-border text-ink-text p-5 flex flex-col justify-between select-none">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-normal text-ink-text">
              Live telemetry
            </h2>
          </div>

          <div className="space-y-3.5">
            {/* ARTIFACT 1: Live Patrol Path Snapshot */}
            <div className="rounded-2xl bg-ink-card border border-ink-border p-3.5 text-xs font-sans">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink-text text-xs truncate">
                    Patrol path snapshot
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-signal-normalBright font-mono mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-normalBright animate-pulse" />
                    <span>{rover.patrolMode}</span>
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
                      isObstacleAlertActive
                        ? "var(--color-signal-critical-bright)"
                        : "var(--color-signal-normal-bright)"
                    }
                    className={isObstacleAlertActive ? "animate-pulse" : ""}
                  />
                  <circle cx="210" cy="42" r="6.5" fill="var(--color-signal-warning-bright)" />
                </svg>

                <div className="grid grid-cols-3 text-[10px] font-mono mt-1">
                  <div className="text-left">
                    <div className="text-ink-text font-semibold">CP A</div>
                    <div className="text-ink-muted">{cpA.statusLabel}</div>
                  </div>
                  <div
                    className={`text-center font-semibold ${
                      isObstacleAlertActive ? "text-signal-criticalBright" : "text-signal-normalBright"
                    }`}
                  >
                    <div>CP C</div>
                    <div>IR {cpC.irSensor}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-ink-text font-semibold">CP B</div>
                    <div className="text-ink-muted">{cpB.statusLabel}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ARTIFACT 2: Rover Diagnostics Report */}
            <div className="rounded-2xl bg-ink-card border border-ink-border p-3.5 text-xs font-sans">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cobalt-tint border border-cobalt-border flex items-center justify-center text-cobalt-soft shrink-0">
                    <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink-text text-xs truncate">
                      Rover status report
                    </h3>
                    <div className="text-[11px] text-signal-normalBright font-mono">
                      Batt {rover.batteryLevel}% · {rover.wifiRssi} dBm
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
                Live ESP32-S3 patrol mode, IR obstacle sensor state, Wi-Fi signal strength, and operator checks.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-ink-border mt-4 text-center text-[11px] font-sans text-ink-muted">
          Celestia Rover · Patrolling &amp; Monitoring
        </div>
      </aside>

      {/* Detailed Modal */}
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
                    ? "Live Patrol Path Snapshot"
                    : "ESP32-S3 Rover Status Report"}
                </h3>
                <p className="text-xs font-sans text-cobalt-soft mt-0.5">
                  {rover.roverId} · Wi-Fi Telemetry &amp; IR Obstacle Monitor
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalArtifact(null)}
                aria-label="Close telemetry modal"
                className="p-1.5 rounded-full hover:bg-ink-hover text-ink-muted hover:text-ink-text transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-ink-secondary font-sans">
              <div className="p-3.5 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-ink-text font-semibold mb-1">Rover Hardware Telemetry</div>
                <p>
                  Mode: <strong className="text-ink-text">{rover.patrolMode}</strong> · Battery:{" "}
                  <strong className="text-ink-text">{rover.batteryLevel}%</strong> · Speed:{" "}
                  <strong className="text-ink-text">{rover.speedMps.toFixed(1)} m/s</strong> · Wi-Fi RSSI:{" "}
                  <strong className="text-ink-text">{rover.wifiRssi} dBm</strong> · SPI TFT Eyes:{" "}
                  <strong className="text-ink-text">{rover.tftEyeState}</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-ink-text font-semibold mb-1">Checkpoint IR Path Summary</div>
                <p>
                  • Checkpoint A ({cpA.name}): {cpA.statusLabel} · IR {cpA.irSensor} · {cpA.patrolPasses} passes<br />
                  • Checkpoint B ({cpB.name}): {cpB.statusLabel} · IR {cpB.irSensor} · {cpB.patrolPasses} passes<br />
                  • Checkpoint C ({cpC.name}): {cpC.statusLabel} · IR {cpC.irSensor} · {cpC.patrolPasses} passes
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-ink-text font-semibold mb-1">Suggested Operator Checks</div>
                <p>
                  1. Verify Checkpoint C visually whenever the IR obstacle sensor reports OBSTACLE.<br />
                  2. Route the rover to clear checkpoints (A or B) if the rear bay path is obstructed.<br />
                  3. Confirm the corridor is unobstructed before clearing the obstacle alert and resuming full-loop patrol.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalArtifact(null)}
                className="pill-button-cobalt text-xs py-2 px-5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
