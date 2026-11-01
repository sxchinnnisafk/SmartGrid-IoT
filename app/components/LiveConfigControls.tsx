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
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">
                Autonomous Patrol Rover Control (R-1)
              </h3>
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                rover.isPatrolling
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {rover.isPatrolling ? "PATROL ACTIVE" : "STANDBY"}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Deploy ESP32-guided inspection rover along distribution topology lines to perform thermal FLIR scans and acoustic partial discharge checks.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">CURRENT NODE</span>
              <div className="text-slate-200 font-bold mt-0.5 uppercase">{rover.currentNodeId}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">TARGET NODE</span>
              <div className="text-cyan-400 font-bold mt-0.5 uppercase">{rover.targetNodeId}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">BATTERY LEVEL</span>
              <div className="text-emerald-400 font-bold mt-0.5">{rover.batteryLevel}%</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">ROUTE PROGRESS</span>
              <div className="text-amber-400 font-bold mt-0.5">{rover.progress}%</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          {rover.isPatrolling ? (
            <button
              onClick={stopPatrol}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg glow-rose"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Recall / Stop Patrol</span>
            </button>
          ) : (
            <button
              onClick={startPatrol}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg glow-cyan"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Patrol (ESP32)</span>
            </button>
          )}

          <button
            onClick={() => addLog("ROVER", "Manual FLIR snapshot requested from Rover R-1 camera.", "info")}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-xl border border-slate-700 transition-colors"
          >
            FLIR Snapshot
          </button>
        </div>
      </div>

      {/* Right Col: Live Threshold Config Sliders */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">
                Live Threshold Config (Dynamic Sliders)
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Real-Time Sync
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-5">
            Adjust warning and critical fault thresholds on the fly. ESP32 edge nodes receive updated limit parameters via MQTT.
          </p>

          <div className="space-y-4 font-mono text-xs">
            {/* Warning Temp Slider */}
            <div>
              <div className="flex justify-between mb-1.5 text-slate-300">
                <span>Warning Temperature Threshold</span>
                <span className="text-amber-400 font-bold">{thresholds.tempWarning}°C</span>
              </div>
              <input
                type="range"
                min="50"
                max="80"
                value={thresholds.tempWarning}
                onChange={handleTempWarningChange}
                className="w-full accent-amber-500 bg-slate-955 cursor-pointer h-2 bg-slate-950 rounded-lg border border-slate-800"
              />
            </div>

            {/* Critical Temp Slider */}
            <div>
              <div className="flex justify-between mb-1.5 text-slate-300">
                <span>Critical Temperature Threshold</span>
                <span className="text-rose-400 font-bold">{thresholds.tempCritical}°C</span>
              </div>
              <input
                type="range"
                min="75"
                max="110"
                value={thresholds.tempCritical}
                onChange={handleTempCriticalChange}
                className="w-full accent-rose-500 bg-slate-950 cursor-pointer h-2 rounded-lg border border-slate-800"
              />
            </div>

            {/* Voltage Min Slider */}
            <div>
              <div className="flex justify-between mb-1.5 text-slate-300">
                <span>Minimum Voltage Sag Limit</span>
                <span className="text-cyan-400 font-bold">{thresholds.voltageMin} V</span>
              </div>
              <input
                type="range"
                min="180"
                max="220"
                value={thresholds.voltageMin}
                onChange={handleVoltageMinChange}
                className="w-full accent-cyan-500 bg-slate-950 cursor-pointer h-2 rounded-lg border border-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>MQTT QoS Level: 1 (At least once)</span>
          <button
            onClick={() => triggerThermalFault()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 transition-colors font-mono"
          >
            Toggle Fault State
          </button>
        </div>
      </div>
    </div>
  );
}
