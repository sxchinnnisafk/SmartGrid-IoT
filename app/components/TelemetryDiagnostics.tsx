"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  FileText,
  Bot,
  Zap,
  Clock,
  Send,
  WifiOff,
} from "lucide-react";

export default function TelemetryDiagnostics() {
  const {
    selectedNode,
    telemetryHistory,
    alerts,
    acknowledgeAlert,
    isThermalFaultActive,
    isOffline,
  } = useGrid();

  const [activeMetricTab, setActiveMetricTab] = useState<"temp" | "voltage" | "current">("temp");

  const activeAlerts = alerts.filter((a) => a.nodeId === selectedNode.id || a.severity === "CRITICAL");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Recharts Telemetry Dashboard */}
      <div className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--color-accent)]" />
                <h2 className="text-base font-bold text-[var(--color-text)]">
                  Real-Time ESP32 Telemetry Stream
                </h2>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Live sensor metrics for <span className="text-[var(--color-accent)] font-medium">{selectedNode.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[var(--color-bg-subtle)] p-1 rounded-lg border border-[var(--color-border)]">
              <button
                onClick={() => setActiveMetricTab("temp")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeMetricTab === "temp"
                    ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)] font-bold shadow"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Temperature (°C)
              </button>
              <button
                onClick={() => setActiveMetricTab("voltage")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeMetricTab === "voltage"
                    ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)] font-bold shadow"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Voltage (V)
              </button>
              <button
                onClick={() => setActiveMetricTab("current")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeMetricTab === "current"
                    ? "bg-[var(--color-accent)] text-[var(--color-text-inverse)] font-bold shadow"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Current (A)
              </button>
            </div>
          </div>

          {/* Offline Warning Banner inside Telemetry if offline */}
          {isOffline && (
            <div className="mb-4 bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-xl p-3 flex items-center gap-3 text-[var(--color-error-text)] text-xs font-mono">
              <WifiOff className="w-5 h-5 text-[var(--color-error)] animate-pulse shrink-0" />
              <div>
                <span className="font-bold">Offline Mode Active:</span> ESP32 edge link disconnected. Recharts is rendering cached local buffer data.
              </div>
            </div>
          )}

          {/* Chart Display */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
                <XAxis dataKey="timeLabel" stroke="var(--color-chart-axis)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-chart-axis)" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-chart-tooltip-bg)",
                    borderColor: "var(--color-chart-tooltip-border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "var(--color-chart-tooltip-text)",
                  }}
                />
                {activeMetricTab === "temp" && (
                  <>
                    <Line type="monotone" dataKey="nodeATemp" name="Node A (Resid)" stroke="var(--color-success)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeBTemp" name="Node B (EV Hub)" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeCTemp" name="Node C (Industrial)" stroke="var(--color-error)" strokeWidth={3} dot={false} />
                  </>
                )}
                {activeMetricTab === "voltage" && (
                  <>
                    <Line type="monotone" dataKey="nodeAVoltage" name="Node A Voltage (V)" stroke="var(--color-success)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeBVoltage" name="Node B Voltage (V)" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeCVoltage" name="Node C Voltage (V)" stroke="var(--color-error)" strokeWidth={3} dot={false} />
                  </>
                )}
                {activeMetricTab === "current" && (
                  <>
                    <Line type="monotone" dataKey="nodeACurrent" name="Node A Current (A)" stroke="var(--color-success)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeBCurrent" name="Node B Current (A)" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeCCurrent" name="Node C Current (A)" stroke="var(--color-error)" strokeWidth={3} dot={false} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Node Summary Footer */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--color-border)]">
          <div className="bg-[var(--color-bg-subtle)] p-2.5 rounded-xl border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">PHASE BALANCE</span>
            <div className="text-sm font-bold font-mono text-[var(--color-accent)]">{selectedNode.phaseBalance}%</div>
          </div>
          <div className="bg-[var(--color-bg-subtle)] p-2.5 rounded-xl border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">POWER LOAD</span>
            <div className="text-sm font-bold font-mono text-[var(--color-text)]">{selectedNode.powerLoad} kW</div>
          </div>
          <div className="bg-[var(--color-bg-subtle)] p-2.5 rounded-xl border border-[var(--color-border)]">
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">EDGE FIRMWARE</span>
            <div className="text-sm font-bold font-mono text-[var(--color-success)]">ESP32-FreeRTOS v4.1</div>
          </div>
        </div>
      </div>

      {/* Right Col: Critical Fault Alert Ticket Section */}
      <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[var(--color-error)]" />
              <h2 className="text-base font-bold text-[var(--color-text)]">Fault Tickets & Alerts</h2>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--color-error-bg)] text-[var(--color-error-text)] border border-[var(--color-error-border)]">
              {alerts.length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  alert.severity === "CRITICAL"
                    ? "bg-[var(--color-error-bg)] border-[var(--color-error-border)] glow-error"
                    : "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      {alert.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      alert.severity === "CRITICAL" ? "bg-[var(--color-error)] text-[var(--color-text-inverse)]" : "bg-[var(--color-warning)] text-[var(--color-text-inverse)]"
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-[var(--color-text)] mb-1">{alert.title}</h4>
                <p className="text-[11px] text-[var(--color-text-muted)] mb-2">{alert.nodeName}</p>

                <div className="bg-[var(--color-bg-subtle)]/80 p-2 rounded-lg border border-[var(--color-border)] mb-3 text-[11px]">
                  <span className="text-[var(--color-text-muted)] font-mono">Root Cause:</span>
                  <p className="text-[var(--color-text)] mt-0.5">{alert.rootCause}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/80">
                  <span className="text-[10px] font-mono text-[var(--color-accent)]">
                    Status: {alert.status}
                  </span>
                  {alert.status === "ACTIVE" && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text-inverse)] text-[11px] font-bold rounded transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width / Span Layout Block: AI-Generated Maintenance & Mitigation Summary Report */}
      <div className="lg:col-span-3 bg-gradient-to-r from-[var(--color-bg-elevated)] via-[var(--color-bg-elevated)] to-[var(--color-accent-muted)] border border-[var(--color-accent)]/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/40 rounded-xl text-[var(--color-accent)] glow-accent">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--color-text)] uppercase tracking-wider">
                  AI-Generated Maintenance & Mitigation Summary Report
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                  LLM Diagnostic Assistant
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Automated failure analysis based on ESP32 telemetry, thermal FLIR vectors, and IEEE 1547 grid standards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Maintenance Report exported as PDF & MQTT payload successfully.")}
              className="flex items-center gap-2 px-3.5 py-2 bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text)] text-xs font-mono rounded-xl border border-[var(--color-border)] transition-all"
            >
              <FileText className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Export Report PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="bg-[var(--color-bg-subtle)]/80 p-4 rounded-xl border border-[var(--color-border)]">
            <div className="text-[var(--color-accent)] font-mono font-bold mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>1. Diagnostic Analysis</span>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              {isThermalFaultActive
                ? "Node C (Industrial Transformer) is exhibiting severe thermal runaway at 98.4°C on winding coil T-3. Voltage drop to 194.5V indicates high impedance fault or overloaded Phase C leg. Risk of dielectric oil breakdown is critical."
                : "All grid nodes are operating within nominal thermal envelopes. Node A and B maintain stable phase synchronicity with minor load fluctuations."}
            </p>
          </div>

          <div className="bg-[var(--color-bg-subtle)]/80 p-4 rounded-xl border border-[var(--color-border)]">
            <div className="text-[var(--color-warning)] font-mono font-bold mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>2. Recommended Action Plan</span>
            </div>
            <ul className="text-[var(--color-text-muted)] space-y-1.5 list-disc list-inside">
              <li>Auto-throttle Node C transformer tap changer by 2 steps.</li>
              <li>Activate autonomous patrol rover R-1 for targeted acoustic & thermal verification.</li>
              <li>Reroute 150kW surplus EV charging load from Node B to Node A feeder.</li>
            </ul>
          </div>

          <div className="bg-[var(--color-bg-subtle)]/80 p-4 rounded-xl border border-[var(--color-border)]">
            <div className="text-[var(--color-success)] font-mono font-bold mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Automated Mitigation Status</span>
            </div>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
              Smart breaker SC-12 armed for automatic load shedding upon operator confirmation or autonomous rover clearance.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span className="text-[11px] font-mono text-[var(--color-success)]">Safety Interlock: ARMED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}