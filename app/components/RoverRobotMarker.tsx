"use client";

import React from "react";

interface RoverRobotMarkerProps {
  xPercent: number;
  yPercent: number;
  progress: number;
  isPatrolling: boolean;
  irObstacleDetected: boolean;
  currentCheckpointId: string;
  targetCheckpointId: string;
  compact?: boolean;
  isHardwareLive?: boolean;
}

export default function RoverRobotMarker({
  xPercent,
  yPercent,
  progress,
  isPatrolling,
  irObstacleDetected,
  currentCheckpointId,
  targetCheckpointId,
  compact = false,
  isHardwareLive = false,
}: RoverRobotMarkerProps) {
  const fromBadge = currentCheckpointId.replace("cp-", "").toUpperCase();
  const toBadge = targetCheckpointId.replace("cp-", "").toUpperCase();

  const accentColor = irObstacleDetected
    ? "#ef4444"
    : isPatrolling
    ? "#3b82f6"
    : "#f59e0b";

  const ringClass = irObstacleDetected
    ? "bg-signal-criticalBright/30"
    : isPatrolling
    ? "bg-cobalt/35"
    : "bg-signal-warningBright/25";

  const statusText = irObstacleDetected
    ? "HOLD"
    : isPatrolling
    ? `${fromBadge} → ${toBadge}`
    : "PAUSED";

  return (
    <div
      className="absolute z-30 pointer-events-none select-none will-change-[left,top]"
      style={{
        left: `${xPercent}%`,
        top: `${yPercent}%`,
        transform: "translate(-50%, -50%)",
        transition: "left 260ms linear, top 260ms linear",
      }}
      aria-label={`ESP32-S3 Rover location moving ${statusText}`}
    >
      <div className="relative flex flex-col items-center">
        {/* iOS Find-My Style Pulsing Location Halo */}
        <span
          aria-hidden="true"
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${ringClass} ${
            isPatrolling || irObstacleDetected ? "animate-ping" : ""
          } ${compact ? "w-11 h-11" : "w-14 h-14"}`}
        />

        {/* iOS-Style Squircle Robot App/Emoji Icon */}
        <div
          className={`relative flex items-center justify-center rounded-[28%] border-2 border-white/90 shadow-xl ${
            compact ? "w-9 h-9" : "w-11 h-11"
          }`}
          style={{
            background: "linear-gradient(145deg, #f8fafc 0%, #dbeafe 55%, #bfdbfe 100%)",
            boxShadow: `0 8px 20px -4px rgba(15, 23, 42, 0.45), 0 0 0 2px ${accentColor}55`,
          }}
        >
          {/* Glossy iOS top sheen */}
          <span
            aria-hidden="true"
            className="absolute inset-x-1 top-0.5 h-1/3 rounded-t-[24%] bg-white/60 pointer-events-none"
          />

          {/* Crisp iOS-inspired Robot Head SVG */}
          <svg
            viewBox="0 0 40 40"
            className={compact ? "w-7 h-7 relative z-10" : "w-8 h-8 relative z-10"}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Antenna stem & glowing beacon */}
            <line x1="20" y1="6.5" x2="20" y2="11" stroke="#475569" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="20" cy="5.5" r="3" fill={accentColor} />
            <circle cx="19" cy="4.6" r="1" fill="#ffffff" opacity="0.85" />

            {/* Side ears */}
            <rect x="3.5" y="17.5" width="4" height="9" rx="2" fill="#64748b" />
            <rect x="32.5" y="17.5" width="4" height="9" rx="2" fill="#64748b" />

            {/* Main metallic iOS robot head */}
            <rect x="7" y="11" width="26" height="22" rx="7.5" fill="url(#iosRobotHead)" stroke="#475569" strokeWidth="1.5" />

            {/* Dark OLED visor */}
            <rect x="10.5" y="15" width="19" height="9.5" rx="4.5" fill="#0f172a" />

            {/* Glowing animated-style eyes */}
            <circle cx="15.5" cy="19.8" r="2.4" fill={irObstacleDetected ? "#f87171" : "#38bdf8"} />
            <circle cx="24.5" cy="19.8" r="2.4" fill={irObstacleDetected ? "#f87171" : "#38bdf8"} />
            <circle cx="14.8" cy="19" r="0.85" fill="#ffffff" />
            <circle cx="23.8" cy="19" r="0.85" fill="#ffffff" />

            {/* Friendly speaker grille mouth */}
            <rect x="14" y="27.2" width="12" height="2.8" rx="1.4" fill="#334155" />
            <line x1="17" y1="27.2" x2="17" y2="30" stroke="#94a3b8" strokeWidth="0.9" />
            <line x1="20" y1="27.2" x2="20" y2="30" stroke="#94a3b8" strokeWidth="0.9" />
            <line x1="23" y1="27.2" x2="23" y2="30" stroke="#94a3b8" strokeWidth="0.9" />

            <defs>
              <linearGradient id="iosRobotHead" x1="7" y1="11" x2="33" y2="33" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="0.55" stopColor="#e2e8f0" />
                <stop offset="1" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Compact Location Tag */}
        <div
          className={`mt-1 px-2 py-0.5 rounded-full bg-ink-deep/95 border text-[10px] font-mono font-semibold text-ink-text shadow-md whitespace-nowrap flex items-center gap-1.5 ${
            irObstacleDetected ? "border-signal-criticalBright" : "border-cobalt"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              irObstacleDetected
                ? "bg-signal-criticalBright animate-pulse"
                : isPatrolling
                ? "bg-signal-normalBright animate-pulse"
                : "bg-signal-warningBright"
            }`}
          />
          <span>{statusText}</span>
          {!irObstacleDetected && (
            <span className="text-ink-muted tabular-nums">· {Math.round(progress)}%</span>
          )}
          {isHardwareLive && <span className="text-signal-normalBright">LIVE</span>}
        </div>
      </div>
    </div>
  );
}
