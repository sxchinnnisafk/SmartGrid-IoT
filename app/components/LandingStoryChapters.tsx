"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGrid } from "../context/GridContext";
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Play,
  Pause,
  ShieldCheck,
  Cpu,
  Radio,
  Camera,
  PlayCircle,
  Zap,
  Globe,
  Layers,
} from "lucide-react";

export default function LandingStoryChapters() {
  const {
    nodes,
    rover,
    isThermalFaultActive,
    isBreakerIsolated,
    toggleBreakerIsolation,
    isPlayingVoice,
    toggleVoicePlayback,
    voiceProgress,
    setIsEvidenceModalOpen,
    startEndToEndDemo,
  } = useGrid();

  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Scroll-linked progress indicator within the editorial story section
  useEffect(() => {
    let rafId: number | null = null;

    const updateProgress = () => {
      rafId = null;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - window.innerHeight * 0.5);
      const passed = Math.max(0, window.innerHeight * 0.65 - rect.top);
      setScrollProgress(Math.min(1, Math.max(0, passed / total)));
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Ensure elements inside the switched chapter are revealed immediately
  useEffect(() => {
    const chapterEls = document.querySelectorAll<HTMLElement>("#story-chapters .reveal");
    chapterEls.forEach((el) => el.classList.add("is-revealed"));
  }, [activeChapter]);

  // Listen for anchor hash changes so header links jump cleanly to matching chapters
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash;
      if (hash === "#solutions") setActiveChapter(1);
      else if (hash === "#technology") setActiveChapter(2);
      else if (hash === "#impact") setActiveChapter(6);
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const chapters = [
    {
      num: "01",
      title: "The Invisible Risk",
      subtitle: "Distribution asset failures create a costly reliability challenge",
      content:
        "Distribution transformers and associated assets face severe overload, fluctuating phase balance, and thermal stress. Delayed visibility makes maintenance reactive rather than preventative. KERC's Combined Tariff Order 2025 records BESCOM-reported repair expenditure of ₹134.44 crore for 36,035 faulty distribution transformers in FY 2023–24 alone.",
      highlight:
        "Historical BESCOM repair expenditure: ₹134.44 Cr for 36,035 transformers in FY24 (KERC Tariff Order 2025, p. 314).",
      tag: "Problem Analysis",
      citation: "Karnataka Electricity Regulatory Commission (KERC) Tariff Order 2025 / Appendix 1A",
    },
    {
      num: "02",
      title: "The Physical Edge",
      subtitle: "A mobile ESP32-S3 rover patrols the physical corridor",
      content:
        "A modular four-wheel ESP32-S3 robotic platform serves as the mobile edge demonstrator. Equipped with an SPI TFT display rendering animated status eyes, it navigates a miniature tabletop distribution corridor capturing local conditions and transmitting real-time Wi-Fi telemetry.",
      highlight:
        "Physical rover platform with ESP32-S3 microcontroller, motor driver, and local TFT animated-eye display.",
      tag: "Physical Edge",
      citation: "Demonstrated by physical rover build and wiring assembly",
    },
    {
      num: "03",
      title: "Three-Node Digital Twin",
      subtitle: "Live network visibility connecting edge to control room",
      content:
        "The digital twin models three illustrative corridor nodes: Node A Residential Feeder (stable baseline), Node B EV Charging Hub (peak-load surge), and Node C Industrial Transformer (simulated thermal fault at 102°C). Every node state stays strictly aligned across the rover, digital twin, AI assistant, and workflow.",
      highlight:
        "One consistent three-node model: Node A (Baseline) to Node B (Peak Load) to Node C (Critical Fault).",
      tag: "Digital Twin",
      citation: "Central Electricity Authority (CEA) Distribution Guidelines & Best Practices",
    },
    {
      num: "04",
      title: "Intelligent Diagnostics & Voice",
      subtitle: "AI incident explanation without black-box automation",
      content:
        "Telemetry streams support instant diagnostic summaries. Gemini via OpenRouter explains root causes (thermal degradation, winding hotspot) and proposes a structured 4-step mitigation. Spoken dispatch alerts announce critical anomalies to field crews.",
      highlight:
        "AI explains and recommends. The human operator retains full authority over all switching and isolation actions.",
      tag: "AI & Voice",
      citation: "Human-in-the-Loop Operational Architecture",
    },
    {
      num: "05",
      title: "Human-Approved Response",
      subtitle: "Free-form visual workflow canvas for safe execution",
      content:
        "Response steps are arranged, reviewed, and published through a visual canvas. Operators confirm breaker isolation, halt rover motion, and trigger dispatch briefs. Breaker isolation and load rerouting are simulated on an isolated low-voltage tabletop setup.",
      highlight:
        "Tabletop simulation boundary: Safe, low-voltage educational demonstration with no direct mains or live utility grid connection.",
      tag: "Operator Workflow",
      citation: "Power Hack 2026 Safety & Simulation Boundary",
    },
    {
      num: "06",
      title: "Tabletop to Utility",
      subtitle: "Staged scalability supporting UN Sustainable Development Goals",
      content:
        "The modular architecture supports phased expansion: from a 3-node tabletop demo to an instrumented pilot on an isolated test rig, and ultimately to a utility-reviewed field pilot. Aligned with UN SDGs 7 (Affordable and Clean Energy), 9 (Industry, Innovation and Infrastructure), and 11 (Sustainable Cities and Communities).",
      highlight:
        "Advancing UN SDGs 7, 9, and 11 through open, modular, intelligent energy monitoring.",
      tag: "Scalability & SDGs",
      citation: "UN Sustainable Development Goals (Goals 7, 9, 11)",
    },
  ];

  const currentChapter = chapters[activeChapter - 1] || chapters[0];

  // Bespoke per-chapter visual companion (Scroll-Craft Rule 1: Variety is the product)
  const renderChapterVisual = (chapterNum: number) => {
    switch (chapterNum) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary">
                BESCOM FY 2023 to 2024 Reliability Benchmark
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-signal-warningBg text-signal-warningText font-semibold">
                KERC 2025
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-parchment text-parchment-text border border-parchment-border">
                <div className="text-xs text-parchment-muted font-sans">Annual Repair Spend</div>
                <div className="font-serif text-2xl sm:text-3xl font-normal mt-1">₹134.44 Cr</div>
                <div className="text-[11px] text-parchment-muted mt-1">Reported expenditure</div>
              </div>
              <div className="p-4 rounded-2xl bg-ink-card border border-ink-border">
                <div className="text-xs text-ink-muted font-sans">Faulty Transformers</div>
                <div className="font-serif text-2xl sm:text-3xl text-ink-text font-normal mt-1">36,035</div>
                <div className="text-[11px] text-signal-criticalBright mt-1">Single fiscal year</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ink-card border border-ink-border space-y-3 text-xs">
              <div className="font-sans font-medium text-ink-text">Reactive vs Preventative Detection</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-ink-muted mb-1">
                    <span>Reactive outage dispatch</span>
                    <span className="font-mono text-signal-criticalBright">Post-failure</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-deep overflow-hidden">
                    <div className="h-full w-[88%] rounded-full bg-signal-criticalBright" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-ink-muted mb-1">
                    <span>Continuous edge thermal telemetry</span>
                    <span className="font-mono text-signal-normalBright">Early warning</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-deep overflow-hidden">
                    <div className="h-full w-[32%] rounded-full bg-signal-normalBright" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
                ESP32-S3 Rover Edge Unit
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cobalt-tint text-cobalt-soft font-semibold">
                {rover.isPatrolling ? "Patrolling" : "Standby"}
              </span>
            </div>

            {/* Simulated SPI TFT Animated Eyes Display */}
            <div className="rounded-2xl bg-ink-deep border-2 border-ink-borderStrong p-5 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-6">
                <div
                  className={`w-12 h-8 rounded-2xl transition-colors ${
                    isThermalFaultActive ? "bg-signal-criticalBright" : "bg-cobalt"
                  } shadow-cobalt`}
                />
                <div
                  className={`w-12 h-8 rounded-2xl transition-colors ${
                    isThermalFaultActive ? "bg-signal-criticalBright" : "bg-cobalt"
                  } shadow-cobalt`}
                />
              </div>
              <div className="text-xs font-mono text-ink-muted">
                SPI TFT Status Eyes: {isThermalFaultActive ? "ALERT_HOTSPOT" : "NOMINAL_SCAN"}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center font-mono text-xs">
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-[11px] text-ink-muted font-sans">Battery</div>
                <div className="text-sm font-semibold text-signal-normalBright mt-0.5">
                  {rover.batteryLevel}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-[11px] text-ink-muted font-sans">Target</div>
                <div className="text-sm font-semibold text-ink-text mt-0.5">
                  {rover.targetNodeId.toUpperCase()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-[11px] text-ink-muted font-sans">Link</div>
                <div className="text-sm font-semibold text-cobalt-soft mt-0.5">Wi-Fi</div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary flex items-center gap-2">
                <Layers className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
                Live Three-Node State Sync
              </span>
              <span className="text-xs font-mono text-signal-normalBright">Synced</span>
            </div>

            {nodes.map((node) => {
              const statusTone =
                node.status === "critical"
                  ? "bg-signal-criticalBg text-signal-criticalText"
                  : node.status === "warning"
                  ? "bg-signal-warningBg text-signal-warningText"
                  : "bg-signal-normalBg text-signal-normalText";

              return (
                <div
                  key={node.id}
                  className="p-3.5 rounded-2xl bg-parchment text-parchment-text border border-parchment-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full text-ink-onAccent font-bold text-xs flex items-center justify-center shrink-0 ${
                        node.status === "critical" ? "bg-signal-critical" : "bg-control"
                      }`}
                    >
                      {node.badge}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs sm:text-sm truncate">{node.name}</div>
                      <div className="flex items-center gap-2.5 text-[11px] font-sans text-parchment-muted tabular-nums">
                        <span>{node.temperature}°C</span>
                        <span>{node.voltage}V</span>
                        <span>{node.powerLoad}MW</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${statusTone}`}>
                    {node.statusLabel}
                  </span>
                </div>
              );
            })}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary flex items-center gap-2">
                <Radio className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
                Voice Dispatch & AI Summary
              </span>
              <span className="text-xs font-mono text-cobalt-soft">Gemini + Audio</span>
            </div>

            <div className="p-4 rounded-2xl bg-ink-card border border-ink-border space-y-3">
              <p className="text-xs sm:text-sm text-ink-secondary italic font-serif leading-relaxed">
                &ldquo;Dispatching field crew to Node C. Thermal fault confirmed at 102°C on Industrial Transformer. Isolate breaker SC-12 and verify low-voltage corridor.&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={toggleVoicePlayback}
                  className="w-9 h-9 rounded-full bg-cobalt hover:bg-cobalt-hover text-ink-onAccent flex items-center justify-center shrink-0 transition-colors"
                  aria-label={isPlayingVoice ? "Pause voice dispatch" : "Play voice dispatch"}
                >
                  {isPlayingVoice ? (
                    <Pause className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted mb-1">
                    <span>{isPlayingVoice ? "Playing dispatch brief" : "Preview spoken alert"}</span>
                    <span>{Math.round(voiceProgress)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-deep overflow-hidden">
                    <div
                      className="h-full bg-cobalt rounded-full transition-transform duration-150 origin-left"
                      style={{ transform: `scaleX(${Math.max(0.06, voiceProgress / 100)})` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-muted px-1">
              <span className="inline-flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cobalt-soft" aria-hidden="true" />
                Operator confirmation mandatory
              </span>
              <Link href="/ai-assistant" className="text-cobalt-soft hover:underline font-medium">
                Open AI Assistant
              </Link>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-signal-normalBright" aria-hidden="true" />
                Human-in-the-Loop Interlock
              </span>
              <span className="text-xs font-mono text-signal-normalBright">Low-Voltage Sim</span>
            </div>

            <div className="p-4 rounded-2xl bg-parchment text-parchment-text border border-parchment-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">Breaker SC-12 Isolation</div>
                  <div className="text-xs text-parchment-muted">Node C simulated contactor</div>
                </div>
                <button
                  type="button"
                  onClick={toggleBreakerIsolation}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isBreakerIsolated
                      ? "bg-cobalt text-ink-onAccent"
                      : "bg-parchment-dark text-parchment-text border border-parchment-borderStrong"
                  }`}
                >
                  {isBreakerIsolated ? "Armed" : "Standby"}
                </button>
              </div>
              <p className="text-xs text-parchment-secondary leading-relaxed">
                AI recommends switching steps, while the operator reviews and explicitly publishes every circuit action.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-ink-muted">No live utility mains connection</span>
              <Link href="/workflow" className="text-cobalt-soft hover:underline font-medium">
                Open Workflow Canvas
              </Link>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary flex items-center gap-2">
                <Globe className="w-4 h-4 text-signal-normalBright" aria-hidden="true" />
                Phased Scalability & UN SDGs
              </span>
              <span className="text-xs font-mono text-cobalt-soft">SDGs 7, 9, 11</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-ink-card border border-cobalt-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink-text">Stage 1: Tabletop Twin</div>
                  <div className="text-ink-muted">3-node corridor + ESP32-S3 rover</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-signal-normalBg text-signal-normalText font-semibold">
                  Active
                </span>
              </div>
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink-text">Stage 2: Instrumented Test Rig</div>
                  <div className="text-ink-muted">Isolated lab switchgear sensors</div>
                </div>
                <span className="text-ink-muted font-mono">Next</span>
              </div>
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink-text">Stage 3: Utility Field Pilot</div>
                  <div className="text-ink-muted">Reviewed feeder deployment</div>
                </div>
                <span className="text-ink-muted font-mono">Planned</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-parchment text-parchment-text font-semibold">
                <Zap className="w-3.5 h-3.5 mx-auto mb-1 text-cobalt" aria-hidden="true" />
                SDG 7
              </div>
              <div className="p-2 rounded-xl bg-parchment text-parchment-text font-semibold">
                <Cpu className="w-3.5 h-3.5 mx-auto mb-1 text-cobalt" aria-hidden="true" />
                SDG 9
              </div>
              <div className="p-2 rounded-xl bg-parchment text-parchment-text font-semibold">
                <Globe className="w-3.5 h-3.5 mx-auto mb-1 text-cobalt" aria-hidden="true" />
                SDG 11
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      ref={sectionRef}
      id="story-chapters"
      className="relative py-20 bg-ink-deep text-ink-text border-t border-ink-border"
    >
      {/* Real Anchor Targets for Landing Hero Nav Links */}
      <span id="solutions" className="block -mt-16 pt-16 pointer-events-none" aria-hidden="true" />
      <span id="technology" className="block pointer-events-none" aria-hidden="true" />
      <span id="impact" className="block pointer-events-none" aria-hidden="true" />

      {/* Scroll-Driven Reading Progress Hairline */}
      <div
        aria-hidden="true"
        className="sticky top-0 z-30 h-0.5 w-full bg-ink-border/60 overflow-hidden"
      >
        <div
          className="h-full bg-cobalt origin-left transition-transform duration-100"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 pt-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 reveal" data-delay="50">
          <div className="max-w-2xl">
            <p className="text-sm font-sans font-medium text-cobalt-soft mb-2">
              Six-chapter architecture story
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-ink-text leading-tight break-words min-w-0">
              A grid story, made visible.
            </h2>
            <p className="mt-3 text-base text-ink-muted leading-relaxed">
              Follow the prototype journey from edge sensing to network visibility and operator-approved response.
            </p>
          </div>

          {/* Quick Prototype Proof & Demo Triggers */}
          <div id="resources" className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEvidenceModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-card hover:bg-ink-hover text-xs sm:text-sm font-sans font-medium text-ink-secondary border border-ink-border transition-colors"
            >
              <Camera className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
              <span>Inspect Hardware Evidence</span>
            </button>
            <button
              type="button"
              onClick={startEndToEndDemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-card hover:bg-ink-hover text-xs sm:text-sm font-sans font-medium text-ink-secondary border border-ink-border transition-colors"
            >
              <PlayCircle className="w-4 h-4 text-signal-normalBright" aria-hidden="true" />
              <span>Run 5-Step Demo</span>
            </button>
          </div>
        </div>

        {/* Chapter Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Editorial chapters"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10 reveal"
          data-delay="100"
        >
          {chapters.map((ch, idx) => {
            const isActive = activeChapter === idx + 1;
            return (
              <button
                key={ch.num}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveChapter(idx + 1)}
                className={`p-3.5 rounded-2xl border text-left transition-colors ${
                  isActive
                    ? "bg-ink-hover border-cobalt shadow-cobalt"
                    : "bg-ink-surface border-ink-border hover:border-ink-borderStrong text-ink-muted"
                }`}
              >
                <div className="text-xs font-mono font-semibold text-cobalt-soft mb-1">
                  Chapter {ch.num}
                </div>
                <div className="text-xs sm:text-sm font-sans font-semibold text-ink-text truncate">
                  {ch.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Showcase Card */}
        <div
          key={currentChapter.num}
          role="tabpanel"
          className="rounded-3xl bg-ink-surface border border-ink-border p-7 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch reveal is-revealed"
        >
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5 min-w-0">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-tint border border-cobalt-border text-xs font-sans font-medium text-cobalt-soft">
                <span>Chapter {currentChapter.num}</span>
                <span>{currentChapter.tag}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl text-ink-text font-normal leading-snug break-words min-w-0">
                {currentChapter.subtitle}
              </h3>

              <p className="text-base text-ink-secondary leading-relaxed">
                {currentChapter.content}
              </p>

              <div className="p-4 rounded-xl bg-ink-card border-l-4 border-cobalt text-sm text-ink-text font-sans leading-relaxed">
                {currentChapter.highlight}
              </div>
            </div>

            <div className="pt-4 border-t border-ink-border flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-sans text-ink-muted">
                Source: {currentChapter.citation}
              </div>
            </div>
          </div>

          {/* Right Bespoke Per-Chapter Interactive Visual Column */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-ink rounded-2xl border border-ink-border p-6 min-w-0">
            <div>{renderChapterVisual(activeChapter)}</div>

            <div className="pt-5 border-t border-ink-border mt-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/control-room"
                className="pill-button-cobalt text-xs py-2 px-4"
              >
                <span>Open in Control Room</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveChapter((prev) => (prev > 1 ? prev - 1 : 6))}
                  className="p-1.5 rounded-full bg-ink-card hover:bg-ink-hover text-ink-secondary border border-ink-border transition-colors"
                  aria-label="Previous chapter"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChapter((prev) => (prev < 6 ? prev + 1 : 1))}
                  className="text-xs font-sans font-medium text-cobalt-soft hover:text-ink-text inline-flex items-center gap-1 transition-colors"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
