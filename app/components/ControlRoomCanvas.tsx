"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import {
  Plus,
  Compass,
  Wifi,
  Flame,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

export default function ControlRoomCanvas() {
  const {
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    rover,
    isFaultActive,
    triggerFault,
    addLog,
  } = useGrid();

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isAssetPaletteOpen, setIsAssetPaletteOpen] = useState<boolean>(false);

  const nodeA = nodes.find((n) => n.id === "node-a") || nodes[0];
  const nodeB = nodes.find((n) => n.id === "node-b") || nodes[1];
  const nodeC = nodes.find((n) => n.id === "node-c") || nodes[2];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(140, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(70, z - 10));
  const handleResetZoom = () => setZoomLevel(100);

  const handleSelectAssetFromPalette = (nodeId: string, label: string) => {
    setSelectedNodeId(nodeId);
    addLog("SYSTEM", `Focused corridor asset: ${label} (${nodeId.toUpperCase()}).`, "info");
    setIsAssetPaletteOpen(false);
  };

  return (
    <div className="relative w-full min-h-[420px] sm:h-[470px] xl:h-[520px] rounded-3xl bg-parchment border border-parchment-border text-parchment-text shadow-parchment overflow-hidden flex flex-col justify-between select-none">
      {/* Top Banner on Canvas */}
      <div className="relative z-20 px-5 pt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsAssetPaletteOpen(!isAssetPaletteOpen)}
            className="w-9 h-9 rounded-full bg-parchment-light hover:bg-parchment-bright text-parchment-text border border-parchment-borderStrong flex items-center justify-center shadow-sm transition-transform hover:scale-105 shrink-0"
            title="Inspect corridor assets"
            aria-label="Toggle micro-grid asset palette"
            aria-expanded={isAssetPaletteOpen}
          >
            <Plus className="w-5 h-5 text-cobalt" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <h2 className="font-serif text-lg sm:text-xl font-normal text-parchment-text leading-tight truncate">
              Interactive Three-Node Corridor
            </h2>
            <p className="text-xs font-sans text-parchment-muted truncate">
              Select a node to inspect live telemetry or simulate a fault event
            </p>
          </div>
        </div>

        {/* Live Fault Quick Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => triggerFault(!isFaultActive)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-semibold border transition-colors ${
              isFaultActive
                ? "bg-signal-criticalBg text-signal-criticalText border-signal-criticalBorder hover:bg-parchment-bright"
                : "bg-parchment-light text-parchment-text border-parchment-borderStrong hover:border-cobalt"
            }`}
          >
            {isFaultActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear Fault</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 text-signal-critical" aria-hidden="true" />
                <span>Trigger Fault</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Asset Palette Dropdown */}
      {isAssetPaletteOpen && (
        <div className="absolute top-16 left-5 z-30 bg-parchment-bright border border-parchment-borderStrong rounded-2xl p-4 shadow-xl text-xs font-sans w-72">
          <div className="text-xs font-semibold text-parchment-text mb-2.5">
            Corridor Micro-Grid Assets
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSelectAssetFromPalette("node-a", "Solar Micro-Inverter Feeder")}
              className="w-full p-2.5 bg-parchment-light rounded-xl border border-parchment-border flex items-center gap-2.5 hover:border-cobalt text-left transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-signal-normalBright shrink-0" />
              <span className="font-medium text-parchment-text">Solar Micro-Inverter Feeder (Node A)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectAssetFromPalette("node-b", "EV DC Fast Charger Bank")}
              className="w-full p-2.5 bg-parchment-light rounded-xl border border-parchment-border flex items-center gap-2.5 hover:border-cobalt text-left transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-signal-warningBright shrink-0" />
              <span className="font-medium text-parchment-text">EV DC Fast Charger Bank (Node B)</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectAssetFromPalette("node-c", "Distribution Step-Down Transformer")}
              className="w-full p-2.5 bg-parchment-light rounded-xl border border-parchment-border flex items-center gap-2.5 hover:border-signal-critical text-left transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-signal-criticalBright shrink-0" />
              <span className="font-medium text-parchment-text">Industrial Transformer (Node C)</span>
            </button>
          </div>
          <p className="mt-3 text-[11px] text-parchment-muted">
            Click an asset to focus its live telemetry readout.
          </p>
        </div>
      )}

      {/* Mobile Dedicated Corridor Stack (Zero Overlap on < 640px) */}
      <div className="flex sm:hidden flex-col gap-2.5 px-4 py-4">
        {[nodeA, nodeB, nodeC].map((node) => {
          const isSelected = selectedNodeId === node.id;
          const statusClasses =
            node.status === "critical"
              ? "bg-signal-criticalBg text-signal-criticalText"
              : node.status === "warning"
              ? "bg-signal-warningBg text-signal-warningText"
              : "bg-signal-normalBg text-signal-normalText";

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedNodeId(node.id)}
              className={`w-full p-3 rounded-2xl bg-parchment-bright border text-left flex items-center justify-between gap-2.5 transition-colors ${
                isSelected ? "border-cobalt ring-2 ring-cobalt/20" : "border-parchment-borderStrong"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full text-ink-onAccent flex items-center justify-center text-xs font-bold shrink-0 ${
                    node.status === "critical" ? "bg-signal-critical" : "bg-control"
                  }`}
                >
                  {node.badge}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-parchment-text truncate">{node.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-parchment-muted">
                    <span>{node.voltage} V</span>
                    <span>{node.current} A</span>
                    <span>{node.powerLoad} MW</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${statusClasses}`}>
                {node.statusLabel}
              </span>
            </button>
          );
        })}

        <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-ink-card border border-cobalt text-ink-text">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-cobalt-soft shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold">ESP32-S3 Rover</span>
          </div>
          <span className="text-[11px] text-ink-muted">
            {rover.isPatrolling ? `Patrolling (${rover.batteryLevel}%)` : "Paused"}
          </span>
        </div>
      </div>

      {/* Desktop Main Isometric Interactive Stage */}
      <div
        className="hidden sm:block relative flex-1 w-full h-full overflow-hidden transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
      >
        {/* Stylized Landscape Background, Road Corridor & Aligned Transmission Arcs */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle contour lines */}
          <path
            d="M 40,140 Q 260,95 480,160 T 960,130"
            stroke="var(--color-paper-border-strong)"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            opacity="0.65"
          />
          <path
            d="M 80,270 Q 320,230 620,290 T 980,260"
            stroke="var(--color-paper-border-strong)"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            opacity="0.55"
          />
          <path
            d="M 0,400 Q 400,360 820,410"
            stroke="var(--color-paper-border-strong)"
            strokeWidth="1.2"
            strokeDasharray="4 8"
            opacity="0.5"
          />

          {/* Isometric Road Corridor */}
          <path
            d="M 90,380 Q 340,340 500,270 T 880,180"
            stroke="var(--color-paper-dark)"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Energy Transmission Line: Node A (185, 165) -> Node B (445, 315) */}
          <path
            d="M 185,165 C 260,210 340,280 445,315"
            stroke="var(--color-cobalt)"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M 185,165 C 260,210 340,280 445,315"
            stroke="var(--color-paper-bright)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            className="animate-dash-flow"
            fill="none"
          />

          {/* Energy Transmission Line: Node B (500, 315) -> Node C (795, 165) */}
          <path
            d="M 500,315 C 620,305 700,235 795,165"
            stroke={isFaultActive ? "var(--color-signal-critical)" : "var(--color-cobalt)"}
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M 500,315 C 620,305 700,235 795,165"
            stroke="var(--color-paper-bright)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            className="animate-dash-flow"
            fill="none"
          />

          {/* Junction Anchor Dots */}
          <circle cx="185" cy="165" r="5" fill="var(--color-cobalt)" />
          <circle cx="445" cy="315" r="5" fill="var(--color-signal-warning)" />
          <circle
            cx="795"
            cy="165"
            r="5.5"
            fill={isFaultActive ? "var(--color-signal-critical)" : "var(--color-signal-normal)"}
          />

          {/* Rover Dashed Telemetry Trail */}
          <path
            d="M 190,415 Q 480,440 810,365"
            stroke="var(--color-cobalt)"
            strokeWidth="2"
            strokeDasharray="5 7"
            opacity="0.65"
            fill="none"
          />
        </svg>

        {/* NODE A: Residential Feeder (Top Left — Zero Overlap) */}
        <button
          type="button"
          onClick={() => setSelectedNodeId("node-a")}
          className={`absolute top-[6%] left-[3%] sm:left-[5%] z-20 text-left transition-transform duration-200 ${
            selectedNodeId === "node-a" ? "scale-[1.03]" : "hover:scale-[1.02]"
          }`}
        >
          <div className="w-36 rounded-2xl bg-parchment-light border border-parchment-borderStrong shadow-sm p-2 mb-1.5">
            <div className="py-1 rounded-lg bg-cobalt-tint border border-cobalt-border text-center text-[10px] font-mono text-cobalt font-bold">
              Solar Roof
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-parchment-secondary mt-1.5 text-center">
              <div className="py-0.5 px-1 rounded bg-parchment">{nodeA.householdCount ?? 1420} homes</div>
              <div className="py-0.5 px-1 rounded bg-parchment">{nodeA.phaseBalance}%</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-parchment-bright border transition-colors shadow-sm ${
              selectedNodeId === "node-a"
                ? "border-cobalt ring-2 ring-cobalt/20"
                : "border-parchment-borderStrong hover:border-cobalt"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-control text-ink-onAccent flex items-center justify-center text-[11px] font-bold shrink-0">
              A
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-parchment-text leading-tight">
                {nodeA.name}
              </div>
              <div className="text-[10px] text-parchment-muted">
                {nodeA.powerLoad} MW · {nodeA.voltage} V
              </div>
            </div>
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-signal-normalBg text-signal-normalText text-[10px] font-sans font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-normalBright" />
              {nodeA.statusLabel}
            </span>
          </div>
        </button>

        {/* NODE B: EV Charging Hub (Lower Center — Cleanly Separated from C) */}
        <button
          type="button"
          onClick={() => setSelectedNodeId("node-b")}
          className={`absolute top-[46%] left-[28%] sm:left-[31%] z-20 text-left transition-transform duration-200 ${
            selectedNodeId === "node-b" ? "scale-[1.03]" : "hover:scale-[1.02]"
          }`}
        >
          <div className="w-36 rounded-2xl bg-parchment-light border border-parchment-borderStrong shadow-sm p-2 mb-1.5">
            <div className="py-1 rounded-lg bg-signal-warningBg border border-signal-warningBorder text-center text-[10px] font-mono text-signal-warningText font-bold">
              EV Canopy
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-parchment-secondary mt-1.5 text-center">
              <div className="py-0.5 px-1 rounded bg-parchment">{nodeB.activeEVs ?? 24} EVs</div>
              <div className="py-0.5 px-1 rounded bg-parchment">{nodeB.powerLoad} MW</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-parchment-bright border transition-colors shadow-sm ${
              selectedNodeId === "node-b"
                ? "border-signal-warning ring-2 ring-signal-warning/25"
                : "border-parchment-borderStrong hover:border-signal-warning"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-control text-ink-onAccent flex items-center justify-center text-[11px] font-bold shrink-0">
              B
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-parchment-text leading-tight">
                {nodeB.name}
              </div>
              <div className="text-[10px] text-parchment-muted">
                {nodeB.powerLoad} MW · {nodeB.voltage} V
              </div>
            </div>
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-signal-warningBg text-signal-warningText text-[10px] font-sans font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-warningBright" />
              {nodeB.statusLabel}
            </span>
          </div>
        </button>

        {/* NODE C: Industrial Transformer (Top Right — Zero Overlap) */}
        <button
          type="button"
          onClick={() => setSelectedNodeId("node-c")}
          className={`absolute top-[6%] right-[3%] sm:right-[5%] z-20 text-left transition-transform duration-200 ${
            selectedNodeId === "node-c" ? "scale-[1.03]" : "hover:scale-[1.02]"
          }`}
        >
          <div className="w-40 rounded-2xl bg-parchment-light border border-parchment-borderStrong shadow-sm p-2 mb-1.5 ml-auto">
            <div
              className={`py-1 rounded-lg border text-center text-[10px] font-mono font-bold ${
                isFaultActive
                  ? "bg-signal-criticalBg text-signal-critical border-signal-criticalBorder animate-pulse"
                  : "bg-signal-normalBg text-signal-normalText border-signal-normalBorder"
              }`}
            >
              Substation T-3
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-parchment-secondary mt-1.5 text-center">
              <div
                className={`py-0.5 px-1 rounded font-semibold ${
                  isFaultActive ? "bg-signal-criticalBg text-signal-critical" : "bg-parchment"
                }`}
              >
                {nodeC.powerLoad} MW
              </div>
              <div className="py-0.5 px-1 rounded bg-parchment">{nodeC.voltage} V</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-parchment-bright border transition-colors shadow-sm ${
              selectedNodeId === "node-c"
                ? isFaultActive
                  ? "border-signal-critical ring-2 ring-signal-critical/25"
                  : "border-cobalt ring-2 ring-cobalt/20"
                : "border-parchment-borderStrong hover:border-signal-critical"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-ink-onAccent flex items-center justify-center text-[11px] font-bold shrink-0 ${
                isFaultActive ? "bg-signal-critical" : "bg-signal-normal"
              }`}
            >
              C
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-parchment-text leading-tight">
                {nodeC.name}
              </div>
              <div className="text-[10px] text-parchment-muted">
                {isFaultActive ? "High load detected" : "Nominal operating state"}
              </div>
            </div>
            <span
              className={`ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                isFaultActive
                  ? "bg-signal-criticalBg text-signal-criticalText"
                  : "bg-signal-normalBg text-signal-normalText"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isFaultActive ? "bg-signal-criticalBright animate-ping" : "bg-signal-normalBright"
                }`}
              />
              {nodeC.statusLabel}
            </span>
          </div>
        </button>

        {/* ESP32-S3 ROVER PATROL ON CANVAS */}
        <div
          className="absolute z-20 transition-transform duration-700"
          style={{
            bottom: "10%",
            left: `${Math.min(76, Math.max(12, rover.xPercent))}%`,
          }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-ink-card border border-cobalt text-ink-text shadow-cobalt rover-pulse">
            <Wifi className="w-4 h-4 text-cobalt-soft shrink-0" aria-hidden="true" />
            <div className="text-left">
              <div className="text-[11px] font-mono font-bold leading-tight">ESP32-S3 Rover</div>
              <div className="text-[10px] font-sans text-ink-muted leading-tight">
                {rover.isPatrolling ? `Patrolling (${rover.batteryLevel}%)` : "Paused"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Bottom Controls */}
      <div className="relative z-20 px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-parchment-light border border-parchment-borderStrong shadow-sm text-xs font-mono font-semibold text-parchment-text">
          <Compass className="w-4 h-4 text-cobalt" aria-hidden="true" />
          <span>N</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-parchment-light border border-parchment-borderStrong shadow-sm text-xs font-mono text-parchment-text">
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-6 h-6 rounded-full hover:bg-parchment-bright flex items-center justify-center transition-colors font-bold"
            title="Zoom out"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="px-1 text-[11px] font-semibold">{zoomLevel}%</span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-6 h-6 rounded-full hover:bg-parchment-bright flex items-center justify-center transition-colors font-bold"
            title="Zoom in"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="w-6 h-6 rounded-full hover:bg-parchment-bright flex items-center justify-center transition-colors text-parchment-muted"
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
