"use client";

import React from "react";
import { useGrid } from "../context/GridContext";
import {
  Navigation,
  Sliders,
  Play,
  Square,
  Zap,
  ShieldAlert,
  Activity,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

export default function LiveConfigControls() {
  const {
    rover,
    startPatrol,
    stopPatrol,
    thresholds,
    setThresholds,
    isThermalFaultActive,
    triggerThermalFault,
    addLog,
  } = useGrid();

  const handleTempWarningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setThresholds((prev) => ({ ...prev, tempWarning: val }));
  };

  const handleTempCriticalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setThresholds((prev) => ({ ...prev, tempCritical: val }));
  };

  const handleVoltageMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setThresholds((prev) => ({ ...prev, voltageMin: val }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Col: Rover Patrol Command Hub */}
      <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[var(--color-accent)]" />
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Autonomous Patrol Rover Control (R-1)
              </h3>
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                rover.isPatrolling
                  ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-success-border)] animate-pulse"
                  : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
              }`}
            >
              {rover.isPatrolling ? "PATROL ACTIVE" : "STANDBY"}
            </span>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            Deploy ESP32-guided inspection rover along distribution topology lines to perform thermal FLIR scans and acoustic partial discharge checks.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5 font-mono text-xs">
            <div className="bg-[var(--color-bg-subtle)] p-3 rounded-xl border border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)] text-[10px]">CURRENT NODE</span>
              <div className="text-[var(--color-text)] font-bold mt-0.5 uppercase">{rover.currentNodeId}</div>
            </div>
            <div className="bg-[var(--color-bg-subtle)] p-3 rounded-xl border border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)] text-[10px]">TARGET NODE</span>
              <div className="text-[var(--color-accent)] font-bold mt-0.5 uppercase">{rover.targetNodeId}</div>
            </div>
            <div className="bg-[var(--color-bg-subtle)] p-3 rounded-xl border border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)] text-[10px]">BATTERY LEVEL</span>
              <div className="text-[var(--color-success)] font-bold mt-0.5">{rover.batteryLevel}%</div>
            </div>
            <div className="bg-[var(--color-bg-subtle)] p-3 rounded-xl border border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)] text-[10px]">ROUTE PROGRESS</span>
              <div className="text-[var(--color-warning)] font-bold mt-0.5">{rover.progress}%</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
          {rover.isPatrolling ? (
            <button
              onClick={stopPatrol}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 text-[var(--color-text-inverse)] font-bold text-xs rounded-xl transition-all shadow-lg glow-error"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Recall / Stop Patrol</span>
            </button>
          ) : (
            <button
              onClick={startPatrol}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text-inverse)] font-bold text-xs rounded-xl transition-all shadow-lg glow-accent"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Patrol (ESP32)</span>
            </button>
          )}

          <button
            onClick={() => addLog("ROVER", "Manual FLIR snapshot requested from Rover R-1 camera.", "info")}
            className="px-4 py-2.5 bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text)] text-xs font-mono rounded-xl border border-[var(--color-border)] transition-colors"
          >
            FLIR Snapshot
          </button>
        </div>
      </div>

      {/* Right Col: Live Threshold Config Sliders */}
      <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[var(--color-accent)]" />
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Live Threshold Config (Dynamic Sliders)
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/30">
              Real-Time Sync
            </span>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mb-5">
            Adjust warning and critical fault thresholds on the fly. ESP32 edge nodes receive updated limit parameters via MQTT.
          </p>

          <div className="space-y-4 font-mono text-xs">
            {/* Warning Temp Slider */}
            <div>
              <div className="flex justify-between mb-1.5 text-[var(--color-text)]">
                <span>Warning Temperature Threshold</span>
                <span className="text-[var(--color-warning)] font-bold">{thresholds.tempWarning}°C</span>
              </div>
              <input
                type="range"
                min="50"
                max="80"
                value={thresholds.tempWarning}
                onChange={handleTempWarningChange}
                className="w-full accent-[var(--color-warning)] bg-[var(--color-bg)] cursor-pointer h-2 bg-[var(--color-bg-subtle)] rounded-lg border border-[var(--color-border)]"
              />
            </div>

            {/* Critical Temp Slider */}
            <div>
              <div className="flex justify-between mb-1.5 text-[var(--color-text)]">
                <span>Critical Temperature Threshold</span>
                <span className="text-[var(--color-error)] font-bold">{thresholds.tempCritical}°C</span>
              </div>
              <input
                type="range"
                min="75"
                max="110"
                value={thresholds.tempCritical}
                onChange={handleTempCriticalChange}
                className="w-full accent-[var(--color-error)] bg-[var(--color-bg)] cursor-pointer h-2 rounded-lg border border-[var(--color-border)]"
              />
            </div>

            {/* Voltage Min Slider */}
            <div>
              <div className="flex justify-between mb-1.5 text-[var(--color-text)]">
                <span>Minimum Voltage Sag Limit</span>
                <span className="text-[var(--color-accent)] font-bold">{thresholds.voltageMin} V</span>
              </div>
              <input
                type="range"
                min="180"
                max="220"
                value={thresholds.voltageMin}
                onChange={handleVoltageMinChange}
                className="w-full accent-[var(--color-accent)] bg-[var(--color-bg)] cursor-pointer h-2 rounded-lg border border-[var(--color-border)]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>MQTT QoS Level: 1 (At least once)</span>
          <button
            onClick={() => triggerThermalFault()}
            className="px-3 py-1.5 bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-hover)] text-[var(--color-accent)] rounded-lg border border-[var(--color-border)] transition-colors font-mono"
          >
            Toggle Fault State
          </button>
        </div>
      </div>
    </div>
  );
}