"use client";

import React from "react";
import { useGrid } from "../context/GridContext";
import ThemeToggle from "./ThemeToggle";
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
import Link from "next/link";

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
    <header className="sticky top-0 z-[var(--z-sticky)] glass border-b border-[var(--color-header-border)] px-4 py-3">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="p-2 bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 rounded-lg text-[var(--color-accent)] glow-accent">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-wider text-[var(--color-text)]">
              SmartGrid <span className="text-[var(--color-accent)]">AIoT</span>
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Command & Digital Twin Control Center
            </p>
          </div>
        </Link>

        {/* System Status Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Offline Mode Indicator */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isOffline
                ? "bg-[var(--color-error-bg)] text-[var(--color-error-text)] border-[var(--color-error-border)] glow-error"
                : "bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)] glow-success"
            }`}
            title="Click to toggle Wi-Fi / Edge Link simulation"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-[var(--color-error)] animate-pulse" />
                <span>OFFLINE MODE</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-[var(--color-success)]" />
                <span>ESP32 LINK: ONLINE</span>
              </>
            )}
          </button>

          {/* Fault Status Pill */}
          <button
            onClick={() => triggerThermalFault()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              isThermalFaultActive
                ? "bg-[var(--color-error-bg)] text-[var(--color-error-text)] border-[var(--color-error-border)] glow-error animate-pulse"
                : "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)]"
            }`}
            title="Click to toggle simulated Node C thermal fault"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>
              {isThermalFaultActive ? "THERMAL FAULT ACTIVE" : "GRID HEALTH: NOMINAL"}
            </span>
          </button>

          {/* Active Alerts Badge */}
          {activeAlertsCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] text-[var(--color-warning-text)] text-xs font-mono">
              <AlertTriangle className="w-4 h-4 text-[var(--color-warning)] animate-spin" />
              <span>{activeAlertsCount} Fault Ticket{activeAlertsCount > 1 ? "s" : ""}</span>
            </div>
          )}

          {/* Reset System Button */}
          <button
            onClick={resetSystem}
            className="p-1.5 bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] rounded-lg border border-[var(--color-border)] transition-colors"
            title="Reset system simulation state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}