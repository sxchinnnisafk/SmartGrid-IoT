"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGrid } from "../context/GridContext";
import {
  ArrowUpRight,
  Wifi,
  AlertTriangle,
  Play,
  Pause,
  Radar,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

export default function LandingHero() {
  const {
    checkpoints,
    isObstacleAlertActive,
    triggerObstacleAlert,
    rover,
    startPatrol,
    stopPatrol,
    logout,
  } = useGrid();

  const [focusedId, setFocusedId] = useState<string>("cp-c");
  const [depthOffset, setDepthOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [heroScrollY, setHeroScrollY] = useState<number>(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const cpA = checkpoints.find((c) => c.id === "cp-a") || checkpoints[0];
  const cpB = checkpoints.find((c) => c.id === "cp-b") || checkpoints[1];
  const cpC = checkpoints.find((c) => c.id === "cp-c") || checkpoints[2];
  const focusedCp = checkpoints.find((c) => c.id === focusedId) || cpC;

  useEffect(() => {
    const heroEls = document.querySelectorAll<HTMLElement>("#hero-root .reveal");
    heroEls.forEach((el) => el.classList.add("is-revealed"));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scrollRaf: number | null = null;
    const onScroll = () => {
      if (scrollRaf !== null) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        setHeroScrollY(Math.min(240, window.scrollY));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setDepthOffset({ x: nx, y: ny });
    });
  };

  const handleStagePointerLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setDepthOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      id="hero-root"
      className="relative min-h-screen bg-ink text-ink-text overflow-x-clip flex flex-col justify-between selection:bg-cobalt selection:text-ink-onAccent"
    >
      {/* Plane 0: Deep Atmospheric Horizon & Topographic Field */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-ink-backdrop sc-plane"
          style={{
            transform: `translate3d(${depthOffset.x * -6}px, ${depthOffset.y * -4}px, 0)`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-80 mountain-silhouette opacity-80" />
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-15 sc-plane"
          style={{
            transform: `translate3d(${depthOffset.x * -10}px, ${depthOffset.y * -6 - heroScrollY * 0.14}px, 0)`,
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100,480 Q 400,330 900,460 T 1900,360"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <path
            d="M -100,580 Q 500,430 1100,560 T 2100,440"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 12"
          />
        </svg>
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 px-6 sm:px-10 py-4 max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-ink-card border border-ink-border group-hover:border-cobalt transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
          </div>
          <span className="font-bold text-base sm:text-lg text-ink-text font-sans whitespace-nowrap">
            Celestia <span className="text-cobalt">Rover</span>
          </span>
        </Link>

        {/* Anchor Navigation */}
        <nav aria-label="Primary sections" className="hidden md:flex items-center gap-7 text-sm font-sans text-ink-muted">
          <a href="#solutions" className="hover:text-ink-text transition-colors whitespace-nowrap">
            Overview
          </a>
          <a href="#impact" className="hover:text-ink-text transition-colors whitespace-nowrap">
            AI Advisor
          </a>
        </nav>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => logout()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-ink-surface hover:bg-ink-hover text-xs font-sans font-medium text-ink-secondary border border-ink-border transition-colors whitespace-nowrap"
            title="Lock Console / Return to Operator Sign In"
          >
            <span>Operator Sign In</span>
          </button>
          <Link
            href="/control-room"
            className="pill-button-cobalt text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 whitespace-nowrap"
          >
            <span>Open Patrol Control</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Main Hero Body */}
      <main className="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-10 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center flex-1">
        {/* Left Editorial Column */}
        <div className="lg:col-span-5 space-y-5 text-left min-w-0">
          <p className="text-sm font-sans font-medium text-cobalt-soft reveal" data-delay="50">
            Autonomous surveillance &amp; path monitoring
          </p>

          <h1
            className="font-serif text-4xl sm:text-5xl xl:text-[3.75rem] font-normal leading-[1.06] tracking-tight text-ink-text break-words min-w-0 reveal"
            data-delay="100"
          >
            Keep watch on every path, live.
          </h1>

          <p
            className="text-base sm:text-lg text-ink-muted font-sans max-w-md leading-relaxed reveal"
            data-delay="150"
          >
            Track rover status, patrol monitored checkpoints, detect obstacles instantly, and consult AI guidance in real time.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="pt-1 flex flex-wrap items-center gap-3 reveal" data-delay="200">
            <Link
              href="/control-room"
              className="pill-button-cobalt text-sm sm:text-base py-2.5 px-7 shadow-cobalt"
            >
              <span>Open Patrol Control</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href="#story-chapters"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-card hover:bg-ink-hover text-sm text-ink-secondary font-sans font-medium border border-ink-border transition-colors"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
            </a>
          </div>

          {/* Grounded Surveillance Robot Architecture Facts */}
          <div
            className="pt-5 border-t border-ink-border grid grid-cols-3 gap-4 max-w-md font-sans text-xs reveal"
            data-delay="250"
          >
            <div className="min-w-0">
              <div className="text-cobalt-soft font-semibold text-sm sm:text-base">3 Checkpoints</div>
              <div className="text-ink-muted text-xs mt-0.5">Monitored Patrol Path</div>
            </div>
            <div className="min-w-0">
              <div className="text-signal-normalBright font-semibold text-sm sm:text-base">ESP32-S3</div>
              <div className="text-ink-muted text-xs mt-0.5">4WD Patrol Rover</div>
            </div>
            <div className="min-w-0">
              <div className="text-signal-warningBright font-semibold text-sm sm:text-base">IR + AI</div>
              <div className="text-ink-muted text-xs mt-0.5">Obstacle &amp; Advisor</div>
            </div>
          </div>
        </div>

        {/* Right Hero Visual: Dimensional Layered Live Patrol Path Stage */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-w-0 reveal" data-delay="150">
          <div
            ref={stageRef}
            onPointerMove={handleStagePointerMove}
            onPointerLeave={handleStagePointerLeave}
            className="relative w-full max-w-[680px] rounded-3xl bg-ink-surface border border-ink-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Stage Top Bar */}
            <div className="relative z-20 px-5 py-3 border-b border-ink-border bg-ink-deep/70 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isObstacleAlertActive ? "bg-signal-criticalBright animate-pulse" : "bg-signal-normalBright"
                  }`}
                />
                <span className="font-sans font-medium text-ink-text">
                  Live Patrol Preview
                </span>
                <span className="text-ink-muted hidden sm:inline">
                  {rover.patrolMode}
                </span>
              </div>

              {/* Interactive Live Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerObstacleAlert(!isObstacleAlertActive)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    isObstacleAlertActive
                      ? "bg-signal-criticalBg text-signal-criticalText border-signal-criticalBorder"
                      : "bg-ink-card text-ink-secondary border-ink-border hover:border-cobalt"
                  }`}
                >
                  {isObstacleAlertActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Clear Obstacle</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-signal-criticalBright" aria-hidden="true" />
                      <span>Simulate Obstacle</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => (rover.isPatrolling ? stopPatrol() : startPatrol())}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-ink-card text-ink-secondary border border-ink-border hover:border-cobalt transition-colors"
                >
                  {rover.isPatrolling ? (
                    <>
                      <Pause className="w-3 h-3 text-cobalt-soft" aria-hidden="true" />
                      <span>Pause Rover</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-signal-normalBright" aria-hidden="true" />
                      <span>Start Rover</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Dedicated Stack */}
            <div className="flex sm:hidden flex-col gap-3 p-4">
              {[cpA, cpB, cpC].map((cp) => {
                const isSelected = focusedId === cp.id;
                const badgeTone = cp.status === "alert" ? "bg-signal-critical" : "bg-control";
                const statusTextTone =
                  cp.status === "alert"
                    ? "text-signal-criticalBright"
                    : cp.status === "watch"
                    ? "text-signal-warningBright"
                    : "text-signal-normalBright";

                return (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => setFocusedId(cp.id)}
                    className={`w-full flex items-center justify-between gap-3 bg-parchment text-parchment-text px-3.5 py-2.5 rounded-2xl border text-left transition-colors ${
                      isSelected ? "border-cobalt ring-2 ring-cobalt/30" : "border-parchment-border"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full ${badgeTone} text-ink-onAccent flex items-center justify-center font-bold text-xs shrink-0`}
                      >
                        {cp.badge}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-parchment-text truncate">{cp.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-parchment-muted">
                          <span>IR {cp.irSensor}</span>
                          <span>{cp.signalRssi} dBm</span>
                          <span>{cp.patrolPasses} passes</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold shrink-0 px-2 py-0.5 rounded-full bg-ink-card ${statusTextTone}`}>
                      {cp.statusLabel}
                    </span>
                  </button>
                );
              })}

              <div className="flex items-center justify-between gap-2 bg-ink-card border border-cobalt px-3.5 py-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-cobalt-soft shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold text-ink-text">{rover.roverId}</span>
                </div>
                <span className="text-[11px] text-cobalt-soft">
                  {rover.patrolMode} ({rover.batteryLevel}%)
                </span>
              </div>
            </div>

            {/* Desktop Layered 3-Plane Interactive Patrol Stage */}
            <div className="hidden sm:block relative w-full h-[380px] sm:h-[400px] overflow-hidden">
              <div
                className="absolute inset-0 topographic-lines opacity-20 pointer-events-none sc-plane"
                style={{
                  transform: `translate3d(${depthOffset.x * -8}px, ${depthOffset.y * -6}px, 0) scale(1.04)`,
                }}
              />

              {/* Plane 1: Connected SVG Patrol Route */}
              <svg
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none sc-plane"
                style={{
                  transform: `translate3d(${depthOffset.x * -3}px, ${depthOffset.y * -2}px, 0)`,
                }}
                viewBox="0 0 680 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="heroLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Path Segment A -> B */}
                <path
                  d="M 140,132 C 165,178 195,204 238,224"
                  stroke="var(--color-cobalt)"
                  strokeWidth="2.5"
                  strokeDasharray="6 5"
                  className="animate-dash-flow"
                />
                {/* Path Segment B -> C */}
                <path
                  d="M 345,240 C 400,235 408,142 438,102"
                  stroke={isObstacleAlertActive ? "var(--color-signal-critical-bright)" : "var(--color-cobalt)"}
                  strokeWidth="3"
                  filter="url(#heroLineGlow)"
                />
                <path
                  d="M 345,240 C 400,235 408,142 438,102"
                  stroke={isObstacleAlertActive ? "var(--color-signal-critical-bg)" : "var(--color-cobalt-soft)"}
                  strokeWidth="1.5"
                  strokeDasharray="5 9"
                  className="animate-dash-flow"
                />
                {/* Return Patrol Loop */}
                <path
                  d="M 140,330 Q 340,355 545,280"
                  stroke="var(--color-cobalt-soft)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  opacity="0.55"
                />

                {/* Checkpoint Anchor Dots */}
                <circle cx="140" cy="132" r="4" fill="var(--color-signal-normal-bright)" />
                <circle cx="238" cy="224" r="4" fill="var(--color-signal-warning-bright)" />
                <circle
                  cx="438"
                  cy="102"
                  r="4.5"
                  fill={isObstacleAlertActive ? "var(--color-signal-critical-bright)" : "var(--color-signal-normal-bright)"}
                />
              </svg>

              {/* Plane 2: Foreground Interactive Checkpoints */}
              <div
                className="absolute inset-0 sc-plane"
                style={{
                  transform: `translate3d(${depthOffset.x * 5}px, ${depthOffset.y * 4}px, 0)`,
                }}
              >
                {/* CHECKPOINT A */}
                <button
                  type="button"
                  onClick={() => setFocusedId("cp-a")}
                  className={`absolute top-[9%] left-[4%] sm:left-[6%] z-10 text-left transition-transform duration-200 ${
                    focusedId === "cp-a" ? "scale-[1.03]" : "hover:scale-[1.02]"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2.5 bg-parchment text-parchment-text px-3 py-2 rounded-xl shadow-parchment border transition-colors ${
                      focusedId === "cp-a" ? "border-cobalt ring-2 ring-cobalt/30" : "border-parchment-border"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-control text-ink-onAccent flex items-center justify-center font-bold text-xs shrink-0">
                      A
                    </span>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm font-sans text-parchment-text leading-tight">
                        {cpA.name}
                      </div>
                      <div className="text-[11px] text-parchment-muted font-sans">
                        IR {cpA.irSensor} · {cpA.signalRssi} dBm
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 ml-3 px-2.5 py-1 rounded-lg bg-ink-card/95 border border-ink-border inline-flex items-center gap-1.5 text-[11px] font-sans text-signal-normalBright">
                    <Radar className="w-3 h-3" aria-hidden="true" />
                    <span>Path clear</span>
                  </div>
                </button>

                {/* CHECKPOINT B */}
                <button
                  type="button"
                  onClick={() => setFocusedId("cp-b")}
                  className={`absolute top-[52%] left-[12%] sm:left-[18%] z-10 text-left transition-transform duration-200 ${
                    focusedId === "cp-b" ? "scale-[1.03]" : "hover:scale-[1.02]"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2.5 bg-parchment text-parchment-text px-3 py-2 rounded-xl shadow-parchment border transition-colors ${
                      focusedId === "cp-b"
                        ? "border-signal-warningBright ring-2 ring-signal-warningBright/30"
                        : "border-parchment-border"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-control text-ink-onAccent flex items-center justify-center font-bold text-xs shrink-0">
                      B
                    </span>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm font-sans text-parchment-text leading-tight">
                        {cpB.name}
                      </div>
                      <div className="text-[11px] text-parchment-muted font-sans">
                        IR {cpB.irSensor} · {cpB.signalRssi} dBm
                      </div>
                    </div>
                  </div>
                  <div className="mt-1.5 ml-3 px-2.5 py-1 rounded-lg bg-ink-card/95 border border-ink-border inline-flex items-center gap-1.5 text-[11px] font-sans text-signal-warningBright">
                    <Radar className="w-3 h-3" aria-hidden="true" />
                    <span>Active corridor watch</span>
                  </div>
                </button>

                {/* CHECKPOINT C */}
                <button
                  type="button"
                  onClick={() => setFocusedId("cp-c")}
                  className={`absolute top-[16%] right-[4%] sm:right-[6%] z-10 text-left transition-transform duration-200 ${
                    focusedId === "cp-c" ? "scale-[1.03]" : "hover:scale-[1.02]"
                  }`}
                >
                  {isObstacleAlertActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-3.5 right-3 w-6 h-6 rounded-full bg-signal-criticalBright text-ink-onAccent flex items-center justify-center font-bold text-xs shadow-lg animate-signal-pulse"
                    >
                      !
                    </span>
                  )}
                  <div
                    className={`flex items-center gap-2.5 bg-parchment text-parchment-text px-3 py-2 rounded-xl shadow-parchment border transition-colors ${
                      focusedId === "cp-c"
                        ? isObstacleAlertActive
                          ? "border-signal-criticalBright ring-2 ring-signal-criticalBright/30"
                          : "border-cobalt ring-2 ring-cobalt/30"
                        : "border-parchment-border"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full text-ink-onAccent flex items-center justify-center font-bold text-xs shrink-0 ${
                        isObstacleAlertActive ? "bg-signal-critical" : "bg-signal-normal"
                      }`}
                    >
                      C
                    </span>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm font-sans text-parchment-text leading-tight">
                        {cpC.name}
                      </div>
                      <div className="text-[11px] text-parchment-muted font-sans">
                        IR {cpC.irSensor} · {cpC.signalRssi} dBm
                      </div>
                    </div>
                  </div>
                  <div
                    className={`mt-1.5 ml-3 px-2.5 py-1 rounded-lg bg-ink-card/95 border border-ink-border inline-flex items-center gap-1.5 text-[11px] font-sans font-medium ${
                      isObstacleAlertActive ? "text-signal-criticalBright" : "text-signal-normalBright"
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                    <span>{isObstacleAlertActive ? "IR obstacle detected" : "Path clear"}</span>
                  </div>
                </button>

                {/* ESP32-S3 Rover Live Pill */}
                <div className="absolute bottom-[10%] right-[6%] sm:right-[10%] z-20">
                  <div className="flex items-center gap-2.5 bg-ink-card border border-cobalt px-3 py-2 rounded-2xl shadow-cobalt rover-pulse">
                    <div className="w-7 h-7 rounded-lg bg-cobalt-tint border border-cobalt-border flex items-center justify-center text-cobalt-soft">
                      <Wifi className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-ink-text flex items-center gap-1.5">
                        <span>ESP32-S3 Rover</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cobalt-tintStrong text-cobalt-soft font-mono">
                          {rover.patrolMode}
                        </span>
                      </div>
                      <div className="text-[11px] text-ink-muted font-mono">
                        Battery {rover.batteryLevel}% · Target {rover.targetCheckpointId.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Live Telemetry Readout & Legend Footer */}
            <div className="relative z-20 px-5 py-3 border-t border-ink-border bg-ink-deep/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 font-mono text-ink-secondary">
                <span className="font-sans font-semibold text-ink-text">
                  Checkpoint {focusedCp.badge}:
                </span>
                <span>IR {focusedCp.irSensor}</span>
                <span>{focusedCp.signalRssi} dBm</span>
                <span>{focusedCp.patrolPasses} passes</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-sans text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-signal-normalBright" />
                  Clear
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-signal-warningBright" />
                  Watch
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-signal-criticalBright" />
                  Alert
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="relative z-20 px-6 sm:px-10 py-4 border-t border-ink-border max-w-[1440px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-ink-muted">
        <div className="flex flex-wrap items-center gap-5">
          <span>Clearer paths</span>
          <span>Continuous patrol</span>
          <span>Live rover status</span>
        </div>
        <div className="font-semibold text-ink-secondary">Celestia Rover</div>
      </footer>
    </div>
  );
}
