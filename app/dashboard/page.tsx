"use client";

import React from "react";
import Header from "../components/Header";
import GridTopologyMap from "../components/GridTopologyMap";
import TelemetryDiagnostics from "../components/TelemetryDiagnostics";
import LiveConfigControls from "../components/LiveConfigControls";
import EdgeCommandLog from "../components/EdgeCommandLog";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />

      <main className="flex-1 container py-8 space-y-8">
        {/* Section 1: Grid Topology Map */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              1. Distribution Grid Topology & Patrol Route
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Interactive React Flow canvas displaying Node A (Normal), Node B (Warning), and Node C (Critical Fault).
            </p>
          </div>
          <GridTopologyMap />
        </section>

        {/* Section 2: Telemetry & Diagnostics Dashboard */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              2. Real-Time Telemetry, Fault Tickets & AI Mitigation
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Recharts live sensor streaming, critical thermal fault ticket alerts, and AI-generated maintenance recommendations.
            </p>
          </div>
          <TelemetryDiagnostics />
        </section>

        {/* Section 3: Live Configuration Controls & Rover Patrol */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              3. Live Configuration Controls & Autonomous Rover
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Remote command dispatching for patrol rovers and dynamic slider configuration for fault thresholds.
            </p>
          </div>
          <LiveConfigControls />
        </section>

        {/* Section 4: ESP32 Edge Command Terminal & Logs */}
        <section className="space-y-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
              4. ESP32 Edge MQTT Broker Log & Terminal
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Low-level protocol stream simulating bi-directional socket communication with edge microcontrollers.
            </p>
          </div>
          <EdgeCommandLog />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-card)] border-t border-[var(--color-border)] py-6 px-4 text-center text-xs text-[var(--color-text-muted)] font-mono">
        SmartGrid AIoT Digital Twin • Command Center • Built by Team Celestia
      </footer>
    </div>
  );
}