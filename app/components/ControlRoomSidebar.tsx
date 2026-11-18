"use client";

import React from "react";
import { useGrid } from "../context/GridContext";
import { ChevronRight, Navigation, Wifi, Battery, Eye } from "lucide-react";

export default function ControlRoomSidebar() {
  const {
    checkpoints,
    selectedCheckpointId,
    setSelectedCheckpointId,
    rover,
    isHardwareLive,
    isSupabaseConnected,
    routeRoverTo,
  } = useGrid();

  const activeCp =
    checkpoints.find((c) => c.id === selectedCheckpointId) || checkpoints[0];

  return (
    <aside className="w-full lg:w-80 xl:w-[340px] rounded-3xl bg-parchment border border-parchment-border text-parchment-text shadow-parchment p-5 flex flex-col justify-between select-none shrink-0">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-parchment-text tracking-tight">
            Rover status
          </h2>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cobalt-tint text-cobalt text-xs font-sans font-semibold">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isHardwareLive ? "bg-signal-normalBright" : "bg-cobalt"
              }`}
            />
            <span>
              {isHardwareLive ? "ESP32 Live" : isSupabaseConnected ? "Supabase" : "Live"}
            </span>
          </div>
        </div>

        <p className="text-xs font-sans text-parchment-muted mb-4">
          {rover.roverId} · 3 monitored patrol checkpoints
        </p>

        {/* Live Rover Status Card */}
        <div className="mb-4 p-3.5 rounded-2xl bg-parchment-light border border-parchment-borderStrong text-xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-parchment-border">
            <span className="font-sans font-semibold text-parchment-text">{rover.patrolMode}</span>
            <span className="font-mono text-[11px] text-cobalt font-semibold">
              {rover.currentCheckpointId.toUpperCase()} → {rover.targetCheckpointId.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-parchment p-2 rounded-xl">
              <div className="text-[10px] font-sans text-parchment-muted flex items-center justify-center gap-1">
                <Battery className="w-3 h-3" aria-hidden="true" />
                <span>Batt</span>
              </div>
              <div className="text-xs font-bold text-parchment-text mt-0.5">
                {rover.batteryLevel}%
              </div>
            </div>
            <div className="bg-parchment p-2 rounded-xl">
              <div className="text-[10px] font-sans text-parchment-muted flex items-center justify-center gap-1">
                <Wifi className="w-3 h-3" aria-hidden="true" />
                <span>Wi-Fi</span>
              </div>
              <div className="text-xs font-bold text-cobalt mt-0.5">
                {rover.wifiRssi} dBm
              </div>
            </div>
            <div className="bg-parchment p-2 rounded-xl">
              <div className="text-[10px] font-sans text-parchment-muted flex items-center justify-center gap-1">
                <Eye className="w-3 h-3" aria-hidden="true" />
                <span>IR</span>
              </div>
              <div
                className={`text-xs font-bold mt-0.5 ${
                  rover.irObstacleDetected ? "text-signal-critical" : "text-signal-normal"
                }`}
              >
                {rover.irObstacleDetected ? "HOLD" : "CLEAR"}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-parchment-muted mb-1">
              <span>TFT: {rover.tftEyeState}</span>
              <span className="tabular-nums">Segment {Math.round(rover.progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-parchment-dark overflow-hidden">
              <div
                className="h-full bg-cobalt rounded-full transition-all duration-200"
                style={{ width: `${Math.max(4, Math.min(100, rover.progress))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checkpoints List */}
        <div className="space-y-2">
          {checkpoints.map((cp) => {
            const isSelected = selectedCheckpointId === cp.id;
            let badgeBg = "bg-signal-normalBg text-signal-normalText border-signal-normalBorder";
            let dotColor = "bg-signal-normalBright";

            if (cp.status === "watch") {
              badgeBg = "bg-signal-warningBg text-signal-warningText border-signal-warningBorder";
              dotColor = "bg-signal-warningBright";
            } else if (cp.status === "alert") {
              badgeBg = "bg-signal-criticalBg text-signal-criticalText border-signal-criticalBorder";
              dotColor = "bg-signal-criticalBright";
            }

            return (
              <button
                key={cp.id}
                type="button"
                onClick={() => setSelectedCheckpointId(cp.id)}
                className={`w-full p-2.5 rounded-2xl border transition-colors text-left flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? "bg-parchment-bright border-cobalt shadow-sm ring-2 ring-cobalt/20"
                    : "bg-parchment-light border-parchment-border hover:bg-parchment-bright hover:border-cobalt"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-ink-onAccent shrink-0 ${
                      cp.status === "alert" ? "bg-signal-critical" : "bg-control"
                    }`}
                  >
                    {cp.badge}
                  </span>

                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm text-parchment-text leading-snug truncate">
                      {cp.name}
                    </div>
                    <p className="text-[11px] text-parchment-muted truncate leading-tight">
                      {cp.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold border ${badgeBg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span>{cp.statusLabel}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-parchment-subtle" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Checkpoint Detail & Direct Routing */}
      <div className="mt-4 p-3.5 rounded-2xl bg-parchment-light border border-parchment-borderStrong text-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-parchment-border">
          <span className="font-sans font-medium text-parchment-muted">Selected checkpoint</span>
          <span className="font-mono text-cobalt font-semibold">{activeCp.id.toUpperCase()}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center font-mono">
          <div className="bg-parchment p-2 rounded-xl">
            <div className="text-[11px] font-sans text-parchment-muted">IR Sensor</div>
            <div
              className={`text-xs font-bold mt-0.5 ${
                activeCp.irSensor === "OBSTACLE" ? "text-signal-critical" : "text-signal-normal"
              }`}
            >
              {activeCp.irSensor}
            </div>
          </div>
          <div className="bg-parchment p-2 rounded-xl">
            <div className="text-[11px] font-sans text-parchment-muted">Patrol Passes</div>
            <div className="text-xs font-bold text-parchment-text mt-0.5">
              {activeCp.patrolPasses}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => routeRoverTo(activeCp.id)}
          className="w-full pill-button-cobalt text-xs py-2 flex items-center justify-center gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Route Rover to Checkpoint {activeCp.badge}</span>
        </button>
      </div>
    </aside>
  );
}
