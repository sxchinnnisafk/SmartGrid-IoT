"use client";

import React from "react";
import { useGrid } from "../context/GridContext";
import {
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle,
  RotateCcw,
  Zap,
  ShieldAlert,
  Cpu,
} from "lucide-react";

export default function Header() {
  const {
    isOffline,
    setIsOffline,
    isThermalFaultActive,
    triggerThermalFault,
    alerts,
    resetSystem,
  } = useGrid();

  const activeAlertsCount = alerts.filter((a) => a.status === "ACTIVE").length;

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 glow-cyan">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider text-slate-100 uppercase">
                SmartGrid <span className="text-cyan-400">AIoT</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                v2.4-PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Command & Digital Twin Control Center • ESP32 Edge Network
            </p>
          </div>
        </div>

        {/* System Status Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Offline Mode Indicator */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isOffline
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 glow-rose"
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 glow-emerald"
            }`}
            title="Click to toggle Wi-Fi / Edge Link simulation"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>OFFLINE MODE (Wi-Fi Loss)</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>ESP32 LINK: ONLINE</span>
              </>
            )}
          </button>

          {/* Fault Status Pill */}
          <button
            onClick={() => triggerThermalFault()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isThermalFaultActive
                ? "bg-red-500/20 text-red-300 border-red-500/50 glow-rose animate-pulse"
                : "bg-slate-800 text-slate-300 border-slate-700"
            }`}
            title="Click to toggle simulated Node C thermal fault"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>
              {isThermalFaultActive ? "THERMAL FAULT ACTIVE (Node C)" : "GRID HEALTH: NOMINAL"}
            </span>
          </button>

          {/* Active Alerts Badge */}
          {activeAlertsCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{activeAlertsCount} Fault Ticket{activeAlertsCount > 1 ? "s" : ""}</span>
            </div>
          )}

          {/* Reset System Button */}
          <button
            onClick={resetSystem}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Reset system simulation state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
