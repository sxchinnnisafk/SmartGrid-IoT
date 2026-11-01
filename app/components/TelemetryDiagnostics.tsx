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
      <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-slate-100">
                  Real-Time ESP32 Telemetry Stream
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Live sensor metrics for <span className="text-cyan-400 font-medium">{selectedNode.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveMetricTab("temp")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeMetricTab === "temp"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Temperature (°C)
              </button>
              <button
                onClick={() => setActiveMetricTab("voltage")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeMetricTab === "voltage"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Voltage (V)
              </button>
              <button
                onClick={() => setActiveMetricTab("current")}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeMetricTab === "current"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Current (A)
              </button>
            </div>
          </div>

          {/* Offline Warning Banner inside Telemetry if offline */}
          {isOffline && (
            <div className="mb-4 bg-rose-500/15 border border-rose-500/40 rounded-xl p-3 flex items-center gap-3 text-rose-300 text-xs font-mono">
              <WifiOff className="w-5 h-5 text-rose-400 animate-pulse shrink-0" />
              <div>
                <span className="font-bold">Offline Mode Active:</span> ESP32 edge link disconnected. Recharts is rendering cached local buffer data.
              </div>
            </div>
          )}

          {/* Chart Display */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "#f1f5f9",
                  }}
                />
                {activeMetricTab === "temp" && (
                  <>
                    <Line type="monotone" dataKey="nodeATemp" name="Node A (Resid)" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeBTemp" name="Node B (EV Hub)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeCTemp" name="Node C (Industrial)" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </>
                )}
                {activeMetricTab === "voltage" && (
                  <>
                    <Line type="monotone" dataKey="nodeAVoltage" name="Node A Voltage (V)" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeBVoltage" name="Node B Voltage (V)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeCVoltage" name="Node C Voltage (V)" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </>
                )}
                {activeMetricTab === "current" && (
                  <>
                    <Line type="monotone" dataKey="nodeACurrent" name="Node A Current (A)" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeBCurrent" name="Node B Current (A)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="nodeCCurrent" name="Node C Current (A)" stroke="#ef4444" strokeWidth={3} dot={false} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Node Summary Footer */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono">PHASE BALANCE</span>
            <div className="text-sm font-bold font-mono text-cyan-400">{selectedNode.phaseBalance}%</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono">POWER LOAD</span>
            <div className="text-sm font-bold font-mono text-slate-100">{selectedNode.powerLoad} kW</div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono">EDGE FIRMWARE</span>
            <div className="text-sm font-bold font-mono text-emerald-400">ESP32-FreeRTOS v4.1</div>
          </div>
        </div>
      </div>

      {/* Right Col: Critical Fault Alert Ticket Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-slate-100">Fault Tickets & Alerts</h2>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {alerts.length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  alert.severity === "CRITICAL"
                    ? "bg-rose-500/10 border-rose-500/40 glow-rose"
                    : "bg-amber-500/10 border-amber-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {alert.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      alert.severity === "CRITICAL" ? "bg-rose-500 text-slate-950" : "bg-amber-500 text-slate-950"
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-100 mb-1">{alert.title}</h4>
                <p className="text-[11px] text-slate-300 mb-2">{alert.nodeName}</p>

                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 mb-3 text-[11px]">
                  <span className="text-slate-400 font-mono">Root Cause:</span>
                  <p className="text-slate-200 mt-0.5">{alert.rootCause}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-cyan-400">
                    Status: {alert.status}
                  </span>
                  {alert.status === "ACTIVE" && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold rounded transition-colors"
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
      <div className="lg:col-span-3 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400 glow-cyan">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                  AI-Generated Maintenance & Mitigation Summary Report
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LLM Diagnostic Assistant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated failure analysis based on ESP32 telemetry, thermal FLIR vectors, and IEEE 1547 grid standards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Maintenance Report exported as PDF & MQTT payload successfully.")}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-xl border border-slate-700 transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Export Report PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-cyan-400 font-mono font-bold mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>1. Diagnostic Analysis</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {isThermalFaultActive
                ? "Node C (Industrial Transformer) is exhibiting severe thermal runaway at 98.4°C on winding coil T-3. Voltage drop to 194.5V indicates high impedance fault or overloaded Phase C leg. Risk of dielectric oil breakdown is critical."
                : "All grid nodes are operating within nominal thermal envelopes. Node A and B maintain stable phase synchronicity with minor load fluctuations."}
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-amber-400 font-mono font-bold mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>2. Recommended Action Plan</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Auto-throttle Node C transformer tap changer by 2 steps.</li>
              <li>Activate autonomous patrol rover R-1 for targeted acoustic & thermal verification.</li>
              <li>Reroute 150kW surplus EV charging load from Node B to Node A feeder.</li>
            </ul>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-emerald-400 font-mono font-bold mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Automated Mitigation Status</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-3">
              Smart breaker SC-12 armed for automatic load shedding upon operator confirmation or autonomous rover clearance.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-300">Safety Interlock: ARMED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
