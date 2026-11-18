"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import RoverRobotMarker from "./RoverRobotMarker";
import {
  CONTROL_ROOM_ANCHORS,
  CONTROL_ROOM_SEGMENTS,
  segmentToSvgPath,
} from "../lib/patrolPath";
import {
  Plus,
  Compass,
  Wifi,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

export default function ControlRoomCanvas() {
  const {
    checkpoints,
    selectedCheckpointId,
    setSelectedCheckpointId,
    rover,
    isHardwareLive,
    isObstacleAlertActive,
    triggerObstacleAlert,
    addLog,
  } = useGrid();

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);

  const cpA = checkpoints.find((c) => c.id === "cp-a") || checkpoints[0];
  const cpB = checkpoints.find((c) => c.id === "cp-b") || checkpoints[1];
  const cpC = checkpoints.find((c) => c.id === "cp-c") || checkpoints[2];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(140, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(70, z - 10));
  const handleResetZoom = () => setZoomLevel(100);

  const handleSelectCheckpoint = (checkpointId: string, label: string) => {
    setSelectedCheckpointId(checkpointId);
    addLog("PATH", `Focused patrol checkpoint: ${label} (${checkpointId.toUpperCase()}).`, "info");
    setIsPaletteOpen(false);
  };

  return (
    <div className="relative w-full min-h-[420px] sm:h-[470px] xl:h-[520px] rounded-3xl bg-parchment border border-parchment-border text-parchment-text shadow-parchment overflow-hidden flex flex-col justify-between select-none">
      {/* Top Banner on Canvas */}
      <div className="relative z-20 px-5 pt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="w-9 h-9 rounded-full bg-parchment-light hover:bg-parchment-bright text-parchment-text border border-parchment-borderStrong flex items-center justify-center shadow-sm transition-transform hover:scale-105 shrink-0"
            title="Select patrol checkpoint"
            aria-label="Toggle patrol checkpoint list"
            aria-expanded={isPaletteOpen}
          >
            <Plus className="w-5 h-5 text-cobalt" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <h2 className="font-serif text-lg sm:text-xl font-normal text-parchment-text leading-tight truncate">
              Live Patrol Path &amp; Rover Map
            </h2>
            <p className="text-xs font-sans text-parchment-muted truncate">
              Select a checkpoint to inspect IR status, route the rover, or test an obstacle halt
            </p>
          </div>
        </div>

        {/* Live IR Obstacle Quick Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => triggerObstacleAlert(!isObstacleAlertActive)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-semibold border transition-colors ${
              isObstacleAlertActive
                ? "bg-signal-criticalBg text-signal-criticalText border-signal-criticalBorder hover:bg-parchment-bright"
                : "bg-parchment-light text-parchment-text border-parchment-borderStrong hover:border-cobalt"
            }`}
          >
            {isObstacleAlertActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear Obstacle</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-signal-critical" aria-hidden="true" />
                <span>Simulate Obstacle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Checkpoint Quick Palette Dropdown */}
      {isPaletteOpen && (
        <div className="absolute top-16 left-5 z-30 bg-parchment-bright border border-parchment-borderStrong rounded-2xl p-4 shadow-xl text-xs font-sans w-72">
          <div className="text-xs font-semibold text-parchment-text mb-2.5">
            Monitored Patrol Checkpoints
          </div>
          <div className="space-y-2">
            {checkpoints.map((cp) => (
              <button
                key={cp.id}
                type="button"
                onClick={() => handleSelectCheckpoint(cp.id, cp.name)}
                className="w-full p-2.5 bg-parchment-light rounded-xl border border-parchment-border flex items-center gap-2.5 hover:border-cobalt text-left transition-colors"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    cp.status === "alert"
                      ? "bg-signal-criticalBright"
                      : cp.status === "watch"
                      ? "bg-signal-warningBright"
                      : "bg-signal-normalBright"
                  }`}
                />
                <span className="font-medium text-parchment-text">
                  {cp.name} (Checkpoint {cp.badge})
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-parchment-muted">
            Click a checkpoint to focus its live IR &amp; patrol status.
          </p>
        </div>
      )}

      {/* Mobile Dedicated Patrol Stack */}
      <div className="flex sm:hidden flex-col gap-2.5 px-4 py-4">
        {[cpA, cpB, cpC].map((cp) => {
          const isSelected = selectedCheckpointId === cp.id;
          const statusClasses =
            cp.status === "alert"
              ? "bg-signal-criticalBg text-signal-criticalText"
              : cp.status === "watch"
              ? "bg-signal-warningBg text-signal-warningText"
              : "bg-signal-normalBg text-signal-normalText";

          return (
            <button
              key={cp.id}
              type="button"
              onClick={() => setSelectedCheckpointId(cp.id)}
              className={`w-full p-3 rounded-2xl bg-parchment-bright border text-left flex items-center justify-between gap-2.5 transition-colors ${
                isSelected ? "border-cobalt ring-2 ring-cobalt/20" : "border-parchment-borderStrong"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full text-ink-onAccent flex items-center justify-center text-xs font-bold shrink-0 ${
                    cp.status === "alert" ? "bg-signal-critical" : "bg-control"
                  }`}
                >
                  {cp.badge}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-parchment-text truncate">{cp.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-parchment-muted">
                    <span>IR {cp.irSensor}</span>
                    <span>{cp.signalRssi} dBm</span>
                    <span>{cp.patrolPasses} passes</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${statusClasses}`}>
                {cp.statusLabel}
              </span>
            </button>
          );
        })}

        <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-ink-card border border-cobalt text-ink-text">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-cobalt-soft shrink-0" aria-hidden="true" />
            <span className="text-xs font-semibold">{rover.roverId}</span>
          </div>
          <span className="text-[11px] text-ink-muted">
            {rover.patrolMode} ({rover.batteryLevel}%)
          </span>
        </div>
      </div>

      {/* Desktop Main Isometric Interactive Patrol Map */}
      <div
        className="hidden sm:block relative flex-1 w-full h-full overflow-hidden transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle terrain contours */}
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

          {/* Patrol Segment A -> B */}
          <path
            d={segmentToSvgPath(CONTROL_ROOM_SEGMENTS.ab)}
            stroke="var(--color-cobalt)"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d={segmentToSvgPath(CONTROL_ROOM_SEGMENTS.ab)}
            stroke="var(--color-paper-bright)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            className="animate-dash-flow"
            fill="none"
          />

          {/* Patrol Segment B -> C */}
          <path
            d={segmentToSvgPath(CONTROL_ROOM_SEGMENTS.bc)}
            stroke={isObstacleAlertActive ? "var(--color-signal-critical)" : "var(--color-cobalt)"}
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d={segmentToSvgPath(CONTROL_ROOM_SEGMENTS.bc)}
            stroke="var(--color-paper-bright)"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            className="animate-dash-flow"
            fill="none"
          />

          {/* Return Patrol Loop C -> A */}
          <path
            d={segmentToSvgPath(CONTROL_ROOM_SEGMENTS.ca)}
            stroke={isObstacleAlertActive ? "var(--color-paper-border-strong)" : "var(--color-cobalt)"}
            strokeWidth="2.5"
            strokeDasharray="6 8"
            opacity={isObstacleAlertActive ? "0.45" : "0.75"}
            className={isObstacleAlertActive ? "" : "animate-dash-flow"}
            fill="none"
          />

          {/* Waypoint Anchor Dots */}
          <circle
            cx={CONTROL_ROOM_ANCHORS["cp-a"].x}
            cy={CONTROL_ROOM_ANCHORS["cp-a"].y}
            r="6"
            fill="var(--color-cobalt)"
          />
          <circle
            cx={CONTROL_ROOM_ANCHORS["cp-b"].x}
            cy={CONTROL_ROOM_ANCHORS["cp-b"].y}
            r="6"
            fill="var(--color-signal-warning)"
          />
          <circle
            cx={CONTROL_ROOM_ANCHORS["cp-c"].x}
            cy={CONTROL_ROOM_ANCHORS["cp-c"].y}
            r="6"
            fill={isObstacleAlertActive ? "var(--color-signal-critical)" : "var(--color-signal-normal)"}
          />
        </svg>

        {/* CHECKPOINT A: North Gate Entry */}
        <button
          type="button"
          onClick={() => setSelectedCheckpointId("cp-a")}
          className={`absolute top-[6%] left-[3%] sm:left-[5%] z-20 text-left transition-transform duration-200 ${
            selectedCheckpointId === "cp-a" ? "scale-[1.03]" : "hover:scale-[1.02]"
          }`}
        >
          <div className="w-40 rounded-2xl bg-parchment-light border border-parchment-borderStrong shadow-sm p-2 mb-1.5">
            <div className="py-1 rounded-lg bg-cobalt-tint border border-cobalt-border text-center text-[10px] font-mono text-cobalt font-bold">
              {cpA.zone}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-parchment-secondary mt-1.5 text-center">
              <div className="py-0.5 px-1 rounded bg-parchment">IR {cpA.irSensor}</div>
              <div className="py-0.5 px-1 rounded bg-parchment">{cpA.patrolPasses} passes</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-parchment-bright border transition-colors shadow-sm ${
              selectedCheckpointId === "cp-a"
                ? "border-cobalt ring-2 ring-cobalt/20"
                : "border-parchment-borderStrong hover:border-cobalt"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-control text-ink-onAccent flex items-center justify-center text-[11px] font-bold shrink-0">
              A
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-parchment-text leading-tight">
                {cpA.name}
              </div>
              <div className="text-[10px] text-parchment-muted">
                Wi-Fi {cpA.signalRssi} dBm · {cpA.lastVisited}
              </div>
            </div>
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-signal-normalBg text-signal-normalText text-[10px] font-sans font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-normalBright" />
              {cpA.statusLabel}
            </span>
          </div>
        </button>

        {/* CHECKPOINT B: Central Corridor */}
        <button
          type="button"
          onClick={() => setSelectedCheckpointId("cp-b")}
          className={`absolute top-[46%] left-[28%] sm:left-[31%] z-20 text-left transition-transform duration-200 ${
            selectedCheckpointId === "cp-b" ? "scale-[1.03]" : "hover:scale-[1.02]"
          }`}
        >
          <div className="w-40 rounded-2xl bg-parchment-light border border-parchment-borderStrong shadow-sm p-2 mb-1.5">
            <div className="py-1 rounded-lg bg-signal-warningBg border border-signal-warningBorder text-center text-[10px] font-mono text-signal-warningText font-bold">
              {cpB.zone}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-parchment-secondary mt-1.5 text-center">
              <div className="py-0.5 px-1 rounded bg-parchment">IR {cpB.irSensor}</div>
              <div className="py-0.5 px-1 rounded bg-parchment">{cpB.patrolPasses} passes</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-parchment-bright border transition-colors shadow-sm ${
              selectedCheckpointId === "cp-b"
                ? "border-signal-warning ring-2 ring-signal-warning/25"
                : "border-parchment-borderStrong hover:border-signal-warning"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-control text-ink-onAccent flex items-center justify-center text-[11px] font-bold shrink-0">
              B
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-parchment-text leading-tight">
                {cpB.name}
              </div>
              <div className="text-[10px] text-parchment-muted">
                Wi-Fi {cpB.signalRssi} dBm · {cpB.lastVisited}
              </div>
            </div>
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-signal-warningBg text-signal-warningText text-[10px] font-sans font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-warningBright" />
              {cpB.statusLabel}
            </span>
          </div>
        </button>

        {/* CHECKPOINT C: Perimeter Bay */}
        <button
          type="button"
          onClick={() => setSelectedCheckpointId("cp-c")}
          className={`absolute top-[6%] right-[3%] sm:right-[5%] z-20 text-left transition-transform duration-200 ${
            selectedCheckpointId === "cp-c" ? "scale-[1.03]" : "hover:scale-[1.02]"
          }`}
        >
          <div className="w-40 rounded-2xl bg-parchment-light border border-parchment-borderStrong shadow-sm p-2 mb-1.5 ml-auto">
            <div
              className={`py-1 rounded-lg border text-center text-[10px] font-mono font-bold ${
                isObstacleAlertActive
                  ? "bg-signal-criticalBg text-signal-critical border-signal-criticalBorder animate-pulse"
                  : "bg-signal-normalBg text-signal-normalText border-signal-normalBorder"
              }`}
            >
              {cpC.zone}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-parchment-secondary mt-1.5 text-center">
              <div
                className={`py-0.5 px-1 rounded font-semibold ${
                  isObstacleAlertActive ? "bg-signal-criticalBg text-signal-critical" : "bg-parchment"
                }`}
              >
                IR {cpC.irSensor}
              </div>
              <div className="py-0.5 px-1 rounded bg-parchment">{cpC.signalRssi} dBm</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-parchment-bright border transition-colors shadow-sm ${
              selectedCheckpointId === "cp-c"
                ? isObstacleAlertActive
                  ? "border-signal-critical ring-2 ring-signal-critical/25"
                  : "border-cobalt ring-2 ring-cobalt/20"
                : "border-parchment-borderStrong hover:border-signal-critical"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-ink-onAccent flex items-center justify-center text-[11px] font-bold shrink-0 ${
                isObstacleAlertActive ? "bg-signal-critical" : "bg-signal-normal"
              }`}
            >
              C
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-parchment-text leading-tight">
                {cpC.name}
              </div>
              <div className="text-[10px] text-parchment-muted">
                {isObstacleAlertActive ? "Obstacle blocking path" : "Clear patrol sweep"}
              </div>
            </div>
            <span
              className={`ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                isObstacleAlertActive
                  ? "bg-signal-criticalBg text-signal-criticalText"
                  : "bg-signal-normalBg text-signal-normalText"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isObstacleAlertActive ? "bg-signal-criticalBright animate-ping" : "bg-signal-normalBright"
                }`}
              />
              {cpC.statusLabel}
            </span>
          </div>
        </button>

        {/* iOS-Style Traveling Robot Location Marker on Patrol Path */}
        <RoverRobotMarker
          xPercent={rover.xPercent}
          yPercent={rover.yPercent}
          progress={rover.progress}
          isPatrolling={rover.isPatrolling}
          irObstacleDetected={rover.irObstacleDetected}
          currentCheckpointId={rover.currentCheckpointId}
          targetCheckpointId={rover.targetCheckpointId}
          isHardwareLive={isHardwareLive}
        />
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
