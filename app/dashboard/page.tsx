"use client";

import React from "react";
import Header from "../components/Header";
import GridTopologyMap from "../components/GridTopologyMap";
import TelemetryDiagnostics from "../components/TelemetryDiagnostics";
import LiveConfigControls from "../components/LiveConfigControls";
import EdgeCommandLog from "../components/EdgeCommandLog";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Section 1: Grid Topology Map */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                1. Distribution Grid Topology & Patrol Route
              </h2>
              <p className="text-xs text-slate-400">
                Interactive React Flow canvas displaying Node A (Normal), Node B (Warning), and Node C (Critical Fault).
              </p>
            </div>
          </div>
          <GridTopologyMap />
        </section>

        {/* Section 2: Telemetry & Diagnostics Dashboard */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              2. Real-Time Telemetry, Fault Tickets & AI Mitigation
            </h2>
            <p className="text-xs text-slate-400">
              Recharts live sensor streaming, critical thermal fault ticket alerts, and AI-generated maintenance recommendations.
            </p>
          </div>
          <TelemetryDiagnostics />
        </section>

        {/* Section 3: Live Configuration Controls & Rover Patrol */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              3. Live Configuration Controls & Autonomous Rover
            </h2>
            <p className="text-xs text-slate-400">
              Remote command dispatching for patrol rovers and dynamic slider configuration for fault thresholds.
            </p>
          </div>
          <LiveConfigControls />
        </section>

        {/* Section 4: ESP32 Edge Command Terminal & Logs */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              4. ESP32 Edge MQTT Broker Log & Terminal
            </h2>
            <p className="text-xs text-slate-400">
              Low-level protocol stream simulating bi-directional socket communication with edge microcontrollers.
            </p>
          </div>
          <EdgeCommandLog />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900/80 border-t border-zinc-900/80 py-4 px-4 text-center text-xs text-zinc-500 font-mono">
        SmartGrid AIoT Digital Twin • Command Center • Built by Team Celestia
      </footer>
    </div>
  );
}
