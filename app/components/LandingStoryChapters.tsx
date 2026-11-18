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
  Compass,
} from "lucide-react";

export default function LandingStoryChapters() {
  const {
    checkpoints,
    rover,
    isObstacleAlertActive,
    isPlayingVoice,
    toggleVoicePlayback,
    voiceProgress,
  } = useGrid();

  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLElement | null>(null);

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

  const totalPasses = checkpoints.reduce((sum, cp) => sum + cp.patrolPasses, 0);

  const chapters = [
    {
      num: "01",
      id: "chapter-01",
      shortTitle: "The Blind-Spot Gap",
      title: "The Blind-Spot Gap",
      subtitle: "Static checkpoints leave patrol paths unmonitored between walks",
      content:
        "Corridors, entry gates, and rear perimeter bays often rely on periodic manual walkthroughs or fixed mounts with blind spots. A dedicated mobile surveillance rover bridges those gaps by continuously patrolling along defined checkpoints and reporting path status back to operators in real time.",
      highlight:
        "Continuous roving patrol turns intermittent manual checks into live, checkpoint-by-checkpoint visibility.",
      tag: "Mission",
      citation: "Celestia Rover Patrol Architecture",
    },
    {
      num: "02",
      id: "chapter-02",
      shortTitle: "ESP32-S3 Rover",
      title: "The Physical Surveillance Rover",
      subtitle: "4WD ESP32-S3 platform with local IR obstacle protection",
      content:
        "A four-wheel ESP32-S3 rover powered through an L298N motor driver patrols the physical corridor. An onboard IR obstacle module detects nearby obstructions to trigger an instant local stop, while the SPI TFT display renders animated status eyes reflecting patrol, standby, or obstacle-hold states.",
      highlight:
        "Hardware-first safety: local IR obstacle detection halts the rover immediately without waiting for cloud round-trips.",
      tag: "Edge Hardware",
      citation: "ESP32-S3 • L298N 4WD • SPI TFT • IR Obstacle Module",
    },
    {
      num: "03",
      id: "chapter-03",
      shortTitle: "Live Path Map",
      title: "Interactive Patrol Path Monitor",
      subtitle: "Real-time visibility across every monitored checkpoint",
      content:
        "Operators monitor Checkpoint A (North Gate Entry), Checkpoint B (Central Corridor), and Checkpoint C (Perimeter Bay) on a synchronized live map. Every checkpoint reports IR path state, Wi-Fi signal strength (RSSI), and completed patrol passes, allowing operators to start, pause, or route the rover on demand.",
      highlight:
        "One live interface linking rover status, battery level, Wi-Fi RSSI, IR obstacle alerts, and checkpoint routing.",
      tag: "Path Control",
      citation: "Three-Checkpoint Surveillance Corridor",
    },
    {
      num: "04",
      id: "chapter-04",
      shortTitle: "AI Advisor",
      title: "AI Patrol Assistant & Voice Alerts",
      subtitle: "Conversational diagnostics and spoken status summaries",
      content:
        "Built with Google Gemini and ElevenLabs audio playback, the AI Assistant helps operators check rover health, understand IR obstacle halts, and plan manual corridor inspections. Conversations are saved automatically in local browser history so operators can revisit earlier patrol reviews.",
      highlight:
        "Strictly patrolling, monitoring, and AI guidance — operators retain full control over every patrol decision.",
      tag: "AI + Voice",
      citation: "Human-in-the-Loop Surveillance Operations",
    },
  ];

  const renderChapterVisual = (chapterNum: number) => {
    switch (chapterNum) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary">
                Corridor Patrol Coverage
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cobalt-tint text-cobalt-soft font-semibold">
                LIVE LOOP
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-parchment text-parchment-text border border-parchment-border">
                <div className="text-xs text-parchment-muted font-sans">Monitored Checkpoints</div>
                <div className="font-serif text-2xl sm:text-3xl font-normal mt-1">{checkpoints.length}</div>
                <div className="text-[11px] text-parchment-muted mt-1">A · B · C Path Loop</div>
              </div>
              <div className="p-4 rounded-2xl bg-ink-card border border-ink-border">
                <div className="text-xs text-ink-muted font-sans">Completed Sweeps</div>
                <div className="font-serif text-2xl sm:text-3xl text-ink-text font-normal mt-1">{totalPasses}</div>
                <div className="text-[11px] text-signal-normalBright mt-1">Logged checkpoint passes</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ink-card border border-ink-border space-y-3 text-xs">
              <div className="font-sans font-medium text-ink-text">Manual Walks vs. Roving Patrol</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-ink-muted mb-1">
                    <span>Periodic manual walkthrough</span>
                    <span className="font-sans text-signal-warningBright font-medium">Gaps between checks</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-deep overflow-hidden">
                    <div className="h-full w-[38%] rounded-full bg-signal-warningBright" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-ink-muted mb-1">
                    <span>Continuous ESP32-S3 rover patrol</span>
                    <span className="font-sans text-signal-normalBright font-medium">Real-time path status</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-deep overflow-hidden">
                    <div className="h-full w-[92%] rounded-full bg-signal-normalBright" />
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
                {rover.roverId}
              </span>
              <span className="text-xs font-sans px-2 py-0.5 rounded bg-cobalt-tint text-cobalt-soft font-semibold">
                {rover.patrolMode}
              </span>
            </div>

            {/* SPI TFT Animated Eyes Preview */}
            <div className="rounded-2xl bg-ink-deep border-2 border-ink-borderStrong p-5 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-6">
                <div
                  className={`w-12 h-8 rounded-2xl transition-colors ${
                    rover.irObstacleDetected ? "bg-signal-criticalBright" : "bg-cobalt"
                  } shadow-cobalt`}
                />
                <div
                  className={`w-12 h-8 rounded-2xl transition-colors ${
                    rover.irObstacleDetected ? "bg-signal-criticalBright" : "bg-cobalt"
                  } shadow-cobalt`}
                />
              </div>
              <div className="text-xs font-sans text-ink-muted">
                SPI TFT Status Eyes:{" "}
                <span className="font-mono text-ink-secondary">{rover.tftEyeState}</span>
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
                <div className="text-[11px] text-ink-muted font-sans">IR Sensor</div>
                <div
                  className={`text-sm font-mono font-semibold mt-0.5 ${
                    rover.irObstacleDetected ? "text-signal-criticalBright" : "text-signal-normalBright"
                  }`}
                >
                  {rover.irObstacleDetected ? "OBSTACLE" : "CLEAR"}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-ink-card border border-ink-border">
                <div className="text-[11px] text-ink-muted font-sans">Wi-Fi RSSI</div>
                <div className="text-sm font-mono font-semibold text-cobalt-soft mt-0.5">
                  {rover.wifiRssi} dBm
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-ink-border pb-3">
              <span className="text-xs font-sans font-medium text-ink-secondary flex items-center gap-2">
                <Compass className="w-4 h-4 text-cobalt-soft" aria-hidden="true" />
                Live Checkpoint Sync
              </span>
              <span className="text-xs font-sans font-medium text-signal-normalBright">Synced</span>
            </div>

            {checkpoints.map((cp) => {
              const statusTone =
                cp.status === "alert"
                  ? "bg-signal-criticalBg text-signal-criticalText"
                  : cp.status === "watch"
                  ? "bg-signal-warningBg text-signal-warningText"
                  : "bg-signal-normalBg text-signal-normalText";

              return (
                <div
                  key={cp.id}
                  className="p-3.5 rounded-2xl bg-parchment text-parchment-text border border-parchment-border flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full text-ink-onAccent font-bold text-xs flex items-center justify-center shrink-0 ${
                        cp.status === "alert" ? "bg-signal-critical" : "bg-control"
                      }`}
                    >
                      {cp.badge}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs sm:text-sm truncate">{cp.name}</div>
                      <div className="flex items-center gap-2.5 text-[11px] font-sans text-parchment-muted tabular-nums">
                        <span>IR {cp.irSensor}</span>
                        <span>{cp.signalRssi} dBm</span>
                        <span>{cp.patrolPasses} passes</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${statusTone}`}>
                    {cp.statusLabel}
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
                AI Advisory &amp; Voice Alert
              </span>
              <span className="text-xs font-sans font-medium text-cobalt-soft">Gemini + Audio</span>
            </div>

            <div className="p-4 rounded-2xl bg-ink-card border border-ink-border space-y-3">
              <p className="text-xs sm:text-sm text-ink-secondary italic font-serif leading-relaxed">
                &ldquo;
                {isObstacleAlertActive
                  ? "Patrol alert for ESP32-S3 Rover R-1: IR obstacle detected at Checkpoint C Perimeter Bay. Rover is holding position until the path is verified clear."
                  : "ESP32-S3 Rover R-1 status nominal. All three monitored checkpoints are clear with active Wi-Fi telemetry."}
                &rdquo;
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
                    <span>{isPlayingVoice ? "Playing rover voice alert" : "Preview spoken status"}</span>
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
                Monitoring &amp; advisory only
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
        <div aria-hidden="true" className="h-0.5 w-full bg-ink-border/60 overflow-hidden">
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
            <span>Open Patrol Control</span>
            <ArrowRight className="w-3.5 h-3.5 text-cobalt-soft" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Smooth Scroll Editorial Header */}
      <div id="solutions" className="scroll-mt-20 max-w-[1440px] mx-auto px-6 sm:px-10 pt-16 pb-10">
        <div className="max-w-2xl reveal" data-delay="50">
          <p className="text-sm font-sans font-medium text-cobalt-soft mb-2">
            Four-part system walkthrough
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-ink-text leading-tight break-words min-w-0">
            Surveillance patrolling, made clear.
          </h2>
          <p className="mt-3 text-base text-ink-muted leading-relaxed">
            Follow how the ESP32-S3 rover patrols monitored checkpoints, halts safely on IR obstacles, and keeps operators informed with live telemetry and AI advice.
          </p>
        </div>
      </div>

      {/* Sequential Scroll-Driven Editorial Chapters */}
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
              {isImpact && <span id={ch.id} className="sr-only" aria-hidden="true" />}

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

                  <p className="text-base text-ink-secondary leading-relaxed">{ch.content}</p>

                  <div className="p-4 rounded-xl bg-ink-card border-l-4 border-cobalt text-sm text-ink-text font-sans leading-relaxed">
                    {ch.highlight}
                  </div>
                </div>

                <div className="pt-4 border-t border-ink-border flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs font-sans text-ink-muted">Reference: {ch.citation}</div>
                </div>
              </div>

              {/* Interactive Visual Column */}
              <div
                className={`lg:col-span-5 flex flex-col justify-between bg-ink rounded-2xl border border-ink-border p-6 min-w-0 ${
                  isEven ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div>{renderChapterVisual(chapterNum)}</div>

                <div className="pt-5 border-t border-ink-border mt-6 flex flex-wrap items-center justify-between gap-3">
                  <Link href="/control-room" className="pill-button-cobalt text-xs py-2 px-4">
                    <span>Open Patrol Control</span>
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
