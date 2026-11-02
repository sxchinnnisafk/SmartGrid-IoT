"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import { Terminal, Send, Trash2, Cpu, CheckCircle2 } from "lucide-react";

export default function EdgeCommandLog() {
  const { logs, addLog } = useGrid();
  const [customCommand, setCustomCommand] = useState("");

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;

    addLog("HTTP", `Published command to ESP32: "${customCommand}"`, "success");
    setCustomCommand("");
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-5 backdrop-blur-md shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[var(--color-accent)]" />
          <h3 className="text-base font-bold text-[var(--color-text)]">
            ESP32 Edge Command & MQTT Broker Log
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
          <span>Broker: active (100 msgs)</span>
        </div>
      </div>

      {/* Terminal Output Box */}
      <div className="bg-[var(--color-bg)] font-mono text-xs rounded-xl p-4 h-44 overflow-y-auto border border-[var(--color-border)]/80 space-y-2 mb-4 shadow-inner">
        {logs.map((log) => {
          let badgeColor = "bg-[var(--color-accent-muted)] text-[var(--color-accent)] border-[var(--color-accent)]/30";
          if (log.type === "ALERT") badgeColor = "bg-[var(--color-error-bg)] text-[var(--color-error-text)] border-[var(--color-error-border)]";
          if (log.type === "ROVER") badgeColor = "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border-[var(--color-warning-border)]";
          if (log.level === "success") badgeColor = "bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]";

          let textColor = "text-[var(--color-text-muted)]";
          if (log.level === "error") textColor = "text-[var(--color-error)] font-bold";
          if (log.level === "warn") textColor = "text-[var(--color-warning)]";
          if (log.level === "success") textColor = "text-[var(--color-success)]";

          return (
            <div key={log.id} className="flex items-start gap-3 leading-relaxed">
              <span className="text-[var(--color-text-subtle)] shrink-0">{log.timestamp}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] border shrink-0 ${badgeColor}`}>
                {log.type}
              </span>
              <span className={textColor}>{log.message}</span>
            </div>
          );
        })}
      </div>

      {/* Command Input Form */}
      <form onSubmit={handleSendCommand} className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-2.5 text-[var(--color-accent)] font-mono text-xs">
            esp32@grid:~#
          </span>
          <input
            type="text"
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            placeholder="Type remote command (e.g. /sys/reboot, /node/c/throttle 35)..."
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-32 pr-4 py-2 text-xs font-mono text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-text-inverse)] font-bold text-xs font-mono rounded-xl transition-all shadow flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}