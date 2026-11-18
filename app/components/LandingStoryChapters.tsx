"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGrid } from "../context/GridContext";
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Volume2,
  Play,
  Pause,
  Cpu,
  Radio,
  Layers,
} from "lucide-react";

export default function LandingStoryChapters() {
  const {
    nodes,
    rover,
    isFaultActive,
    isPlayingVoice,
    toggleVoicePlayback,
    voiceProgress,
  } = useGrid();

  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Scroll-linked reading progress hairline across the 4-chapter story
  useEffect(() => {
    let rafId: number | null = null;

    const updateProgress = () => {
      rafId = null;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - window.innerHeight * 0.65);
      const passed = Math.max(0, window.innerHeight * 0.35 - rect.top);
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

  // Scroll-spy: automatically highlight whichever chapter is centered in the viewport
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const chapterElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-chapter-band]")
    );
    if (chapterElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const num = Number((entry.target as HTMLElement).dataset.chapterBand);
            if (!Number.isNaN(num)) {
              setActiveChapter(num);
            }
          }
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: 0.05,
      }
    );

    chapterElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToElement = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "center",
    });
  };

  const chapters = [
    {
      num: "01",
      id: "chapter-01",
      shortTitle: "The Invisible Risk",
      title: "The Invisible Risk",
      subtitle: "Distribution asset failures create a costly reliability challenge",
      content:
        "Distribution transformers and associated assets face severe overload, fluctuating phase balance, and voltage stress. Delayed visibility makes maintenance reactive rather than preventative. KERC's Combined Tariff Order 2025 records BESCOM-reported repair expenditure of ₹134.44 crore for 36,035 faulty distribution transformers in FY 2023–24 alone.",
      highlight:
        "Historical BESCOM repair expenditure: ₹134.44 Cr for 36,035 transformers in FY24 (KERC Tariff Order 2025, p. 314).",
      tag: "Problem Analysis",
      citation: "Karnataka Electricity Regulatory Commission (KERC) Tariff Order 2025 / Appendix 1A",
    },
    {
      num: "02",
      id: "chapter-02",
      shortTitle: "Physical Edge",
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
      id: "chapter-03",
      shortTitle: "Digital Twin",
      title: "Three-Node Digital Twin",
      subtitle: "Live network visibility connecting edge to control room",
      content:
        "The digital twin models three illustrative corridor nodes: Node A Residential Feeder (stable baseline), Node B EV Charging Hub (peak-load surge), and Node C Industrial Transformer (simulated overload & voltage sag fault at 194.5V / 102 MW). Every node state stays strictly aligned across the rover, digital twin, and AI assistant.",
      highlight:
        "One consistent three-node model: Node A (Baseline) to Node B (Peak Load) to Node C (Critical Fault).",
      tag: "Digital Twin",
      citation: "Central Electricity Authority (CEA) Distribution Guidelines & Best Practices",
    },
    {
      num: "04",
      id: "chapter-04",
      shortTitle: "AI & Voice",
      title: "Intelligent Diagnostics & Voice",
      subtitle: "AI incident explanation without black-box automation",
      content:
        "Telemetry streams support instant diagnostic summaries. Gemini explains root causes (voltage sag, phase overload) and suggests practical next steps for operators. Spoken voice summaries let operators listen to monitoring alerts without automated dispatch.",
      highlight:
        "Built strictly for patrolling, monitoring, and AI guidance — operators review all alerts and handle actions manually.",
      tag: "AI & Voice",
      citation: "Human-in-the-Loop Operational Architecture",
    },
  ];

  // Bespoke per-chapter visual companion
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
                    <span className="font-sans text-signal-criticalBright font-medium">Post-failure</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-deep overflow-hidden">
                    <div className="h-full w-[88%] rounded-full bg-signal-criticalBright" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-ink-muted mb-1">
                    <span>Continuous edge corridor telemetry</span>
                    <span className="font-sans text-signal-normalBright font-medium">Early warning</span>
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
              <span className="text-xs font-sans px-2 py-0.5 rounded bg-cobalt-tint text-cobalt-soft font-semibold">
                {rover.isPatrolling ? "Patrolling" : "Standby"}
              </span>
            </div>

            {/* Simulated SPI TFT Animated Eyes Display */}
            <div className="rounded-2xl bg-ink-deep border-2 border-ink-borderStrong p-5 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-6">
                <div
                  className={`w-12 h-8 rounded-2xl transition-colors ${
                    isFaultActive ? "bg-signal-criticalBright" : "bg-cobalt"
                  } shadow-cobalt`}
                />
                <div
                  className={`w-12 h-8 rounded-2xl transition-colors ${
                    isFaultActive ? "bg-signal-criticalBright" : "bg-cobalt"
                  } shadow-cobalt`}
                />
              </div>
              <div className="text-xs font-sans text-ink-muted">
                SPI TFT Status Eyes:{" "}
                <span className="font-mono text-ink-secondary">
                  {isFaultActive ? "ALERT_OVERLOAD" : "NOMINAL_SCAN"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-[11px] text-ink-muted font-sans">Battery</div>
                <div className="text-sm font-mono font-semibold text-signal-normalBright mt-0.5">
                  {rover.batteryLevel}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-[11px] text-ink-muted font-sans">Target</div>
                <div className="text-sm font-mono font-semibold text-ink-text mt-0.5">
                  {rover.targetNodeId.toUpperCase()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-[11px] text-ink-muted font-sans">Link</div>
                <div className="text-sm font-sans font-semibold text-cobalt-soft mt-0.5">Wi-Fi</div>
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
              <span className="text-xs font-sans font-medium text-signal-normalBright">Synced</span>
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
                        <span>{node.voltage}V</span>
                        <span>{node.current}A</span>
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

      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary flex items-center gap-2">
                <Radio className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
                AI Advisory & Voice Summary
              </span>
              <span className="text-xs font-sans font-medium text-cobalt-soft">Gemini + Audio</span>
            </div>

            <div className="p-4 rounded-2xl bg-ink-card border border-ink-border space-y-3">
              <p className="text-xs sm:text-sm text-ink-secondary italic font-serif leading-relaxed">
                &ldquo;Monitoring alert for Node C Industrial Transformer: voltage dropped to 194.5V under 102 MW load. Suggested action: inspect Node C and review load balance across Nodes A and B.&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={toggleVoicePlayback}
                  className="w-9 h-9 rounded-full bg-cobalt hover:bg-cobalt-hover text-ink-onAccent flex items-center justify-center shrink-0 transition-colors"
                  aria-label={isPlayingVoice ? "Pause voice summary" : "Play voice summary"}
                >
                  {isPlayingVoice ? (
                    <Pause className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-sans text-ink-muted mb-1">
                    <span>{isPlayingVoice ? "Playing AI voice summary" : "Preview spoken alert"}</span>
                    <span className="font-mono">{Math.round(voiceProgress)}%</span>
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
                Advisory only — no automated dispatch
              </span>
              <Link href="/ai-assistant" className="text-cobalt-soft hover:underline font-medium">
                Open AI Assistant
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      ref={sectionRef}
      id="story-chapters"
      className="relative bg-ink-deep text-ink-text border-t border-ink-border"
    >
      {/* Sticky Scroll-Spy Chapter Rail & Progress Bar */}
      <div className="sticky top-0 z-30 bg-ink-deep/95 backdrop-blur-md border-b border-ink-border">
        <div
          aria-hidden="true"
          className="h-0.5 w-full bg-ink-border/60 overflow-hidden"
        >
          <div
            className="h-full bg-cobalt origin-left transition-transform duration-100"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-3 flex items-center justify-between gap-4">
          <div
            role="navigation"
            aria-label="Scroll chapter navigation"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
          >
            {chapters.map((ch, idx) => {
              const isCurrent = activeChapter === idx + 1;
              return (
                <button
                  key={ch.num}
                  type="button"
                  onClick={() => scrollToElement(ch.id)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap border transition-colors ${
                    isCurrent
                      ? "bg-cobalt text-ink-onAccent border-cobalt shadow-cobalt"
                      : "bg-ink-surface text-ink-muted border-ink-border hover:text-ink-text hover:border-ink-borderStrong"
                  }`}
                >
                  <span className="font-mono mr-1.5 opacity-80">{ch.num}</span>
                  <span>{ch.shortTitle}</span>
                </button>
              );
            })}
          </div>

          <Link
            href="/control-room"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink-card hover:bg-ink-hover text-xs font-sans font-medium text-ink-secondary border border-ink-border transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open Control Room</span>
            <ArrowRight className="w-3.5 h-3.5 text-cobalt-soft" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Smooth Scroll Editorial Header (Solutions Section Anchor) */}
      <div id="solutions" className="scroll-mt-20 max-w-[1440px] mx-auto px-6 sm:px-10 pt-16 pb-10">
        <div className="max-w-2xl reveal" data-delay="50">
          <p className="text-sm font-sans font-medium text-cobalt-soft mb-2">
            Four-chapter scroll story
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-ink-text leading-tight break-words min-w-0">
            A grid story, made visible.
          </h2>
          <p className="mt-3 text-base text-ink-muted leading-relaxed">
            Scroll smoothly through the prototype journey from edge sensing to network visibility and AI-assisted diagnostics.
          </p>
        </div>
      </div>

      {/* Sequential Scroll-Driven Editorial Chapters (01 to 04) */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 pb-24 space-y-12 sm:space-y-16">
        {chapters.map((ch, idx) => {
          const chapterNum = idx + 1;
          const isEven = chapterNum % 2 === 0;
          const isImpact = chapterNum === 4;
          const nextChapter = chapters[idx + 1];

          return (
            <article
              key={ch.num}
              id={isImpact ? "impact" : ch.id}
              data-chapter-band={chapterNum}
              className="scroll-mt-24 rounded-3xl bg-ink-surface border border-ink-border p-7 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch reveal"
            >
              {/* Anchor alias for chapter-04 when id="impact" is on the article */}
              {isImpact && (
                <span id={ch.id} className="sr-only" aria-hidden="true" />
              )}

              {/* Narrative Column */}
              <div
                className={`lg:col-span-7 flex flex-col justify-between space-y-5 min-w-0 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cobalt-tint border border-cobalt-border text-xs font-sans font-medium text-cobalt-soft">
                    <span>Chapter {ch.num}</span>
                    <span>{ch.tag}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-4xl text-ink-text font-normal leading-snug break-words min-w-0">
                    {ch.subtitle}
                  </h3>

                  <p className="text-base text-ink-secondary leading-relaxed">
                    {ch.content}
                  </p>

                  <div className="p-4 rounded-xl bg-ink-card border-l-4 border-cobalt text-sm text-ink-text font-sans leading-relaxed">
                    {ch.highlight}
                  </div>
                </div>

                <div className="pt-4 border-t border-ink-border flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs font-sans text-ink-muted">
                    Source: {ch.citation}
                  </div>
                </div>
              </div>

              {/* Bespoke Per-Chapter Interactive Visual Column */}
              <div
                className={`lg:col-span-5 flex flex-col justify-between bg-ink rounded-2xl border border-ink-border p-6 min-w-0 ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div>{renderChapterVisual(chapterNum)}</div>

                <div className="pt-5 border-t border-ink-border mt-6 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href="/control-room"
                    className="pill-button-cobalt text-xs py-2 px-4"
                  >
                    <span>Open in Control Room</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>

                  {nextChapter ? (
                    <button
                      type="button"
                      onClick={() => scrollToElement(nextChapter.id)}
                      className="text-xs font-sans font-medium text-cobalt-soft hover:text-ink-text inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Chapter {nextChapter.num}</span>
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollToElement("hero-root")}
                      className="text-xs font-sans font-medium text-cobalt-soft hover:text-ink-text inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Back to top</span>
                      <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
