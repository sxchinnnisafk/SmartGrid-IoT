"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert,
  Cpu,
  Activity,
  Bot,
  GitBranch,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function LandingStoryChapters() {
  const [activeChapter, setActiveChapter] = useState<number>(1);

  // Guarantee story chapters and chapter switches are always revealed
  useEffect(() => {
    const revealChapters = () => {
      const chapterEls = document.querySelectorAll<HTMLElement>("#story-chapters .reveal");
      chapterEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add("is-revealed");
        }
      });
    };
    revealChapters();
    const t = setTimeout(revealChapters, 50);
    return () => clearTimeout(t);
  }, [activeChapter]);

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
        "One consistent three-node model: Node A (Baseline) -> Node B (Peak Load) -> Node C (Critical Fault).",
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

  return (
    <section id="story-chapters" className="py-24 bg-[#0d1017] text-[#f4f5f8] border-t border-[#1e2638]">
      <div className="max-w-[1700px] mx-auto px-6 sm:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 reveal" data-delay="50">
          <div className="text-xs font-mono tracking-widest text-[#818cf8] uppercase mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>01 / DISCOVER • EDITORIAL LANDING STORY</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
            A grid story, <br />
            <span className="italic font-serif">made visible.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#9ca3af] leading-relaxed">
            Follow the prototype journey across six editorial chapters: from edge sensing to network visibility and operator-approved response.
          </p>
        </div>

        {/* Chapter Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12 reveal" data-delay="100">
          {chapters.map((ch, idx) => (
            <button
              key={ch.num}
              onClick={() => setActiveChapter(idx + 1)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeChapter === idx + 1
                  ? "bg-[#1f2638] border-[#3b59f8] shadow-cobalt"
                  : "bg-[#141822] border-[#222b3d] hover:border-[#334155] text-[#9ca3af]"
              }`}
            >
              <div className="text-xs font-mono font-bold text-[#818cf8] mb-1">
                CHAPTER {ch.num}
              </div>
              <div className="text-xs font-semibold text-white truncate">
                {ch.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active Chapter Showcase Card */}
        {chapters.map(
          (ch, idx) =>
            activeChapter === idx + 1 && (
              <div
                key={ch.num}
                className="rounded-3xl bg-[#161a25] border border-[#273247] p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center reveal"
                data-delay="150"
              >
                {/* Left Text */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b59f8]/15 border border-[#3b59f8]/30 text-xs font-mono text-[#93c5fd]">
                    <span>Chapter {ch.num}</span>
                    <span>•</span>
                    <span>{ch.tag}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-snug">
                    {ch.subtitle}
                  </h3>

                  <p className="text-base sm:text-lg text-[#cbd5e1] leading-relaxed">
                    {ch.content}
                  </p>

                  {/* Highlight Callout */}
                  <div className="p-4 rounded-xl bg-[#1a2130] border-l-4 border-[#3b59f8] text-sm text-[#e2e8f0] font-mono leading-relaxed">
                    {ch.highlight}
                  </div>

                  {/* Citation Footer */}
                  <div className="text-xs font-mono text-[#818cf8]/80 flex items-center gap-2">
                    <span>Source: {ch.citation}</span>
                  </div>
                </div>

                {/* Right Interactive / Visual Graphic */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#11141c] rounded-2xl border border-[#232b3c] p-6 text-left">
                  <div className="flex items-center justify-between border-b border-[#222a3b] pb-4 mb-4">
                    <span className="text-xs font-mono text-[#9ca3af] uppercase">
                      Interactive Architecture Link
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#22c55e]/20 text-[#22c55e]">
                      Verified Spec
                    </span>
                  </div>

                  <div className="space-y-4 py-2 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-[#181d28] border border-[#263145]">
                      <div className="text-[#9ca3af] text-[10px]">CORRIDOR POSITION</div>
                      <div className="text-white font-bold mt-0.5">Node A (Homes) → Node B (EV) → Node C (Transformer)</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#181d28] border border-[#263145]">
                      <div className="text-[#9ca3af] text-[10px]">MICROCONTROLLER TELEMETRY</div>
                      <div className="text-[#38bdf8] font-bold mt-0.5">ESP32-S3 Wi-Fi Stream • Low-Voltage Tabletop Demo</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#181d28] border border-[#263145]">
                      <div className="text-[#9ca3af] text-[10px]">OPERATOR SAFETY POLICY</div>
                      <div className="text-[#22c55e] font-bold mt-0.5">Human-in-the-Loop • Explicit Operator Approval Required</div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#222a3b] mt-4 flex items-center justify-between">
                    <Link
                      href="/control-room"
                      className="pill-button-cobalt text-xs py-2 px-4"
                    >
                      <span>Open in Control Room</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => setActiveChapter((prev) => (prev < 6 ? prev + 1 : 1))}
                      className="text-xs font-mono text-[#93c5fd] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Next Chapter</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </section>
  );
}
