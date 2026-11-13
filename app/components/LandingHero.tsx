"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGrid } from "../context/GridContext";
import {
  ArrowUpRight,
  Wifi,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function LandingHero() {
  const router = useRouter();
  const { isThermalFaultActive, triggerThermalFault, rover, startPatrol, stopPatrol } = useGrid();
  const [activeHoverNode, setActiveHoverNode] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen bg-[#11141b] text-[#f4f5f8] overflow-hidden flex flex-col justify-between selection:bg-[#3b59f8] selection:text-white">
      {/* Background Chalk & Mountain Horizon Silhouettes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,89,248,0.15),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-96 mountain-silhouette opacity-80" />
        {/* Subtle grid line curves */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100,500 Q 400,350 900,480 T 1900,380"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <path
            d="M -100,600 Q 500,450 1100,580 T 2100,460"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            strokeDasharray="6 12"
          />
        </svg>
      </div>

      {/* Top Navbar matching landing_page_design_concept.png */}
      <header className="relative z-20 px-6 sm:px-12 py-6 max-w-[1700px] w-full mx-auto flex items-center justify-between">
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-3">
          <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-[#1a1f2c] border border-[#2b3347]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
          </div>
          <span className="font-bold tracking-wider text-base sm:text-lg uppercase text-white font-sans">
            SMARTGRID <span className="text-[#3b59f8]">AIoT</span>
          </span>
        </Link>

        {/* Center Links: SOLUTIONS, TECHNOLOGY, IMPACT, RESOURCES */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-[#9ca3af]">
          <a href="#solutions" className="hover:text-white transition-colors uppercase">
            Solutions
          </a>
          <a href="#technology" className="hover:text-white transition-colors uppercase">
            Technology
          </a>
          <a href="#impact" className="hover:text-white transition-colors uppercase">
            Impact
          </a>
          <a href="#resources" className="hover:text-white transition-colors uppercase">
            Resources
          </a>
        </nav>

        {/* Right CTA Button */}
        <Link
          href="/control-room"
          className="pill-button-cobalt text-xs sm:text-sm font-semibold tracking-wide"
        >
          <span>Open Control Room</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Main Hero Body */}
      <main className="relative z-10 max-w-[1700px] w-full mx-auto px-6 sm:px-12 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Editorial Copy */}
        <div className="lg:col-span-5 space-y-8 text-left">
          {/* Kicker */}
          <div className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#9ca3af] uppercase reveal" data-delay="50">
            SENSING TODAY. A SAFER TOMORROW.
          </div>

          {/* Big Editorial Serif Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-normal leading-[1.08] tracking-tight text-[#f4f5f8] reveal" data-delay="100">
            See the grid <br />
            before it becomes <br />
            <span className="italic font-serif">a problem.</span>
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-lg text-[#9ca3af] font-sans max-w-lg leading-relaxed reveal" data-delay="150">
            From edge sensor to operator action.
          </p>

          {/* CTA Pill Button */}
          <div className="pt-2 flex flex-wrap items-center gap-4 reveal" data-delay="200">
            <Link
              href="/control-room"
              className="pill-button-cobalt text-base py-3 px-8 shadow-cobalt"
            >
              <span>Open Control Room</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>

            <a
              href="#story-chapters"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b202c] hover:bg-[#252c3d] text-sm text-[#cbd5e1] font-mono border border-[#2d3748] transition-all"
            >
              <span>Explore 6-Chapter Story</span>
              <ChevronRight className="w-4 h-4 text-[#818cf8]" />
            </a>
          </div>

          {/* Quick Stats / Credibility Callout */}
          <div className="pt-6 border-t border-[#232a3b] grid grid-cols-3 gap-4 max-w-md font-mono text-xs reveal" data-delay="250">
            <div>
              <div className="text-[#818cf8] font-bold text-base">3 Nodes</div>
              <div className="text-[#9ca3af] text-[11px]">Physical Twin Corridor</div>
            </div>
            <div>
              <div className="text-[#22c55e] font-bold text-base">ESP32-S3</div>
              <div className="text-[#9ca3af] text-[11px]">Edge Telemetry Rover</div>
            </div>
            <div>
              <div className="text-[#f59e0b] font-bold text-base">AI + Voice</div>
              <div className="text-[#9ca3af] text-[11px]">Human-in-the-Loop</div>
            </div>
          </div>
        </div>

        {/* Right Hero Visual: Isometric Grid Scene mirroring landing_page_design_concept.png */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[460px] sm:min-h-[580px] reveal" data-delay="200">
          {/* Top-Right Italic Serif Quote */}
          <div className="absolute top-0 right-4 hidden sm:block text-right">
            <p className="font-serif italic text-base sm:text-lg text-[#d1d5db] tracking-wide">
              From data to a <br />
              brighter tomorrow.
            </p>
          </div>

          {/* Interactive SVG Diagram Backdrop & Power Lines */}
          <div className="relative w-full max-w-2xl aspect-[1.3/1] rounded-3xl bg-[#141822]/60 border border-[#283144] p-6 shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Topographic subtle background lines */}
            <div className="absolute inset-0 topographic-lines opacity-20 pointer-events-none" />

            {/* Power Grid Transmission Path (Glowing Curves) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 700 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="powerLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b59f8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connected high-voltage power lines between nodes */}
              <path
                d="M 220,170 Q 340,190 420,290"
                stroke="#3b59f8"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-dash-flow"
              />
              <path
                d="M 440,310 Q 520,310 590,240"
                stroke={isThermalFaultActive ? "#ef4444" : "#3b59f8"}
                strokeWidth="3"
                filter="url(#lineGlow)"
              />

              {/* Rover dashed telemetry route from Node B to Node C */}
              <path
                d="M 370,410 Q 460,400 540,350"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
            </svg>

            {/* NODE A: Residential Feeder */}
            <div
              className={`absolute top-[16%] left-[8%] sm:left-[14%] z-10 transition-transform duration-300 ${
                activeHoverNode === "node-a" ? "scale-105" : ""
              }`}
              onMouseEnter={() => setActiveHoverNode("node-a")}
              onMouseLeave={() => setActiveHoverNode(null)}
            >
              {/* Node Card badge on warm parchment */}
              <div className="flex items-center gap-3 bg-[#ede4d8] text-[#1c1f28] px-3.5 py-2 rounded-xl shadow-parchment border border-[#d8ccbc] hover:border-[#3b59f8] transition-all cursor-pointer">
                <span className="w-7 h-7 rounded-full bg-[#4f46e5] text-white flex items-center justify-center font-bold text-xs shadow">
                  A
                </span>
                <div className="text-left">
                  <div className="font-semibold text-xs sm:text-sm font-sans text-[#181a20]">
                    Residential Feeder
                  </div>
                  <div className="text-[10px] text-[#555a68] font-mono">
                    Homes • Smart Meters
                  </div>
                </div>
              </div>

              {/* Isometric 3D Node Graphic Representation */}
              <div className="mt-2 ml-4 p-2.5 rounded-2xl bg-[#1b2230]/90 border border-[#2b354a] inline-flex items-center gap-2 shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono text-left">
                  <div className="text-[#cbd5e1] font-semibold">98 MW Baseline</div>
                  <div className="text-[#22c55e] text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                    Normal Operation
                  </div>
                </div>
              </div>
            </div>

            {/* NODE B: EV Charging Hub */}
            <div
              className={`absolute bottom-[28%] left-[18%] sm:left-[24%] z-10 transition-transform duration-300 ${
                activeHoverNode === "node-b" ? "scale-105" : ""
              }`}
              onMouseEnter={() => setActiveHoverNode("node-b")}
              onMouseLeave={() => setActiveHoverNode(null)}
            >
              {/* Node Card badge on warm parchment */}
              <div className="flex items-center gap-3 bg-[#ede4d8] text-[#1c1f28] px-3.5 py-2 rounded-xl shadow-parchment border border-[#d8ccbc] hover:border-[#f59e0b] transition-all cursor-pointer">
                <span className="w-7 h-7 rounded-full bg-[#4f46e5] text-white flex items-center justify-center font-bold text-xs shadow">
                  B
                </span>
                <div className="text-left">
                  <div className="font-semibold text-xs sm:text-sm font-sans text-[#181a20]">
                    EV Charging Hub
                  </div>
                  <div className="text-[10px] text-[#555a68] font-mono">
                    Fast Chargers • Energy Storage
                  </div>
                </div>
              </div>

              {/* Isometric Station Sub-Card */}
              <div className="mt-2 ml-4 p-2.5 rounded-2xl bg-[#1b2230]/90 border border-[#2b354a] inline-flex items-center gap-2 shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono text-left">
                  <div className="text-[#cbd5e1] font-semibold">76 MW Load</div>
                  <div className="text-[#f59e0b] text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    Warning • Peak Load
                  </div>
                </div>
              </div>
            </div>

            {/* NODE C: Industrial Transformer (with glowing alert icon) */}
            <div
              className={`absolute top-[24%] right-[4%] sm:right-[10%] z-10 transition-transform duration-300 ${
                activeHoverNode === "node-c" ? "scale-105" : ""
              }`}
              onMouseEnter={() => setActiveHoverNode("node-c")}
              onMouseLeave={() => setActiveHoverNode(null)}
            >
              {/* Glowing Alert Indicator ! */}
              {isThermalFaultActive && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#ef4444] text-white flex items-center justify-center font-bold text-sm shadow-[0_0_20px_#ef4444] animate-bounce">
                    !
                  </div>
                </div>
              )}

              {/* Node Card badge on warm parchment */}
              <div className="flex items-center gap-3 bg-[#ede4d8] text-[#1c1f28] px-3.5 py-2 rounded-xl shadow-parchment border border-[#d8ccbc] hover:border-[#ef4444] transition-all cursor-pointer">
                <span className="w-7 h-7 rounded-full bg-[#dc2626] text-white flex items-center justify-center font-bold text-xs shadow">
                  C
                </span>
                <div className="text-left">
                  <div className="font-semibold text-xs sm:text-sm font-sans text-[#181a20]">
                    Industrial Transformer
                  </div>
                  <div className="text-[10px] text-[#555a68] font-mono">
                    Substation • High Load
                  </div>
                </div>
              </div>

              {/* Substation Sub-Card */}
              <div className="mt-2 ml-4 p-2.5 rounded-2xl bg-[#1b2230]/90 border border-[#2b354a] inline-flex items-center gap-2 shadow-lg">
                <div className="w-8 h-8 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-mono text-left">
                  <div className="text-[#cbd5e1] font-semibold">102°C Winding</div>
                  <div className="text-[#ef4444] text-[10px] flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping" />
                    Critical Thermal Fault
                  </div>
                </div>
              </div>
            </div>

            {/* ESP32-S3 ROVER PATROLLING ALONG ROUTE */}
            <div className="absolute bottom-[14%] right-[24%] sm:right-[30%] z-20">
              <div className="flex items-center gap-2 bg-[#1b2230] border border-[#3b59f8] p-2.5 rounded-2xl shadow-cobalt rover-pulse">
                <div className="w-8 h-8 rounded-xl bg-[#3b59f8]/20 border border-[#3b59f8]/40 flex items-center justify-center text-[#3b59f8]">
                  <Wifi className="w-4 h-4 animate-pulse" />
                </div>
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>ESP32-S3 Rover</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#3b59f8]/30 text-[#60a5fa]">
                      LIVE
                    </span>
                  </div>
                  <div className="text-[10px] text-[#9ca3af]">
                    Inspect • Detect • Report
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Legend Pill matching the concept photo */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-4 bg-[#1b2230]/90 border border-[#2c374d] px-4 py-2 rounded-full text-[11px] font-mono shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                <span className="text-[#d1d5db]">NORMAL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className="text-[#d1d5db]">WARNING</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="text-[#d1d5db]">CRITICAL</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Bar matching landing_page_design_concept.png */}
      <footer className="relative z-20 px-6 sm:px-12 py-6 border-t border-[#1e2638] max-w-[1700px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9ca3af]">
        <div className="flex items-center gap-6 tracking-widest uppercase">
          <span>CLEANER GRIDS</span>
          <span className="text-[#3b4760]">•</span>
          <span>STRONGER COMMUNITIES</span>
          <span className="text-[#3b4760]">•</span>
          <span>BRIGHTER TOMORROWS</span>
        </div>
        <div className="font-semibold text-[#cbd5e1] tracking-wider uppercase">
          SMARTGRID AIoT
        </div>
      </footer>
    </div>
  );
}
