"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGrid } from "../context/GridContext";
import {
  Bell,
  Search,
  ChevronDown,
  Home,
  Bot,
  GitBranch,
  PlayCircle,
  Camera,
  Layers,
  ShieldAlert,
} from "lucide-react";

interface BrandHeaderProps {
  currentViewTitle?: string;
  variant?: "control-room" | "assistant" | "default";
}

export default function BrandHeader({
  currentViewTitle = "Control Room",
  variant = "control-room",
}: BrandHeaderProps) {
  const pathname = usePathname();
  const {
    isThermalFaultActive,
    triggerThermalFault,
    alerts,
    setIsEvidenceModalOpen,
    startEndToEndDemo,
    activeTab,
    setActiveTab,
  } = useGrid();

  const isControlRoom = pathname === "/control-room" || activeTab === "control-room";
  const isAssistant = pathname === "/ai-assistant" || activeTab === "chat";
  const isWorkflow = pathname === "/workflow" || activeTab === "workflow";

  return (
    <header className="sticky top-0 z-50 bg-[#12151c]/95 backdrop-blur-md border-b border-[#242b3b] px-4 lg:px-8 py-3 text-[#f4f5f8]">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* 6-dot matrix logo icon */}
            <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-[#1a1f2c] border border-[#2b3347] group-hover:border-[#3b59f8] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b59f8]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-base lg:text-lg uppercase text-white font-sans">
                SMARTGRID <span className="text-[#3b59f8]">AIoT</span>
              </span>
            </div>
          </Link>

          {/* Breadcrumb / Mode Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#8c94a5] font-mono pl-3 border-l border-[#283144]">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
            </Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">{currentViewTitle}</span>
          </div>
        </div>

        {/* Center Tagline / Quote */}
        <div className="hidden xl:block text-xs text-[#a0a8b9] italic font-serif tracking-wide">
          From data to a brighter tomorrow.
        </div>

        {/* Quick View Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#181c26] p-1 rounded-full border border-[#283144] text-xs font-mono">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full transition-all ${
              pathname === "/"
                ? "bg-[#252c3d] text-white font-semibold"
                : "text-[#8e97a9] hover:text-white"
            }`}
          >
            Landing Story
          </Link>
          <Link
            href="/control-room"
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              pathname === "/control-room"
                ? "bg-[#3b59f8] text-white font-semibold shadow-cobalt"
                : "text-[#8e97a9] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Control Room</span>
          </Link>
          <Link
            href="/ai-assistant"
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              pathname === "/ai-assistant"
                ? "bg-[#3b59f8] text-white font-semibold shadow-cobalt"
                : "text-[#8e97a9] hover:text-white"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </Link>
          <Link
            href="/workflow"
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              pathname === "/workflow"
                ? "bg-[#3b59f8] text-white font-semibold shadow-cobalt"
                : "text-[#8e97a9] hover:text-white"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Workflow Canvas</span>
          </Link>
        </nav>

        {/* Right Controls & Profile */}
        <div className="flex items-center gap-3">
          {/* 5-Step Demo Trigger */}
          <button
            onClick={startEndToEndDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e2536] hover:bg-[#28324a] text-xs font-mono text-[#a5b4fc] border border-[#374151] transition-all"
            title="Launch 5-Step Tabletop Demonstration sequence"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>Demo Flow</span>
          </button>

          {/* Prototype Evidence Trigger */}
          <button
            onClick={() => setIsEvidenceModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e2536] hover:bg-[#28324a] text-xs font-mono text-[#cbd5e1] border border-[#374151] transition-all"
            title="Inspect actual prototype rover photographs & wiring"
          >
            <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Hardware Evidence</span>
          </button>

          {/* Search Icon */}
          <button
            aria-label="Search"
            className="p-2 rounded-full hover:bg-[#1f2533] text-[#8e97a9] hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-[#1f2533] text-[#8e97a9] hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#ea580c] text-white text-[10px] font-bold flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>

          {/* Operator Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181c26] border border-[#283144] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[#e2e8f0] font-medium">Operator</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8e97a9]" />
          </div>

          {/* Profile Avatar Badge */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-[#262f44] border border-[#3d4b6b] flex items-center justify-center text-xs font-bold text-white tracking-wider">
              JD
            </div>
            <div className="hidden 2xl:block text-left text-xs leading-tight">
              <div className="font-semibold text-white">Jordan Diaz</div>
              <div className="text-[10px] text-[#8e97a9]">Grid Operations</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
