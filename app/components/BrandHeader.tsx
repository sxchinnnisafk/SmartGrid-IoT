"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  UserCheck,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Play,
  Pause,
} from "lucide-react";

interface BrandHeaderProps {
  currentViewTitle?: string;
  variant?: "control-room" | "assistant" | "default";
}

export default function BrandHeader({
  currentViewTitle = "Control Room",
}: BrandHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    nodes,
    setSelectedNodeId,
    isThermalFaultActive,
    triggerThermalFault,
    rover,
    startPatrol,
    stopPatrol,
    alerts,
    acknowledgeAlert,
    setIsEvidenceModalOpen,
    startEndToEndDemo,
    user,
    logout,
  } = useGrid();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const commandInputRef = useRef<HTMLInputElement | null>(null);

  const displayName = user?.name || "Jordan Diaz";
  const displayRole = user?.role || "Grid Operations";
  const displayAvatar = user?.avatarText || "JD";
  const isGuest = user?.isGuest ?? false;
  const unacknowledgedCount = alerts.filter((a) => a.status === "ACTIVE").length;

  // Global keyboard shortcut Ctrl+K / Cmd+K for quick operator command search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
        setIsAlertsOpen(false);
        setIsUserMenuOpen(false);
      } else if (e.key === "Escape") {
        setIsCommandOpen(false);
        setIsAlertsOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (isCommandOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 20);
    } else {
      setCommandQuery("");
    }
  }, [isCommandOpen]);

  const handleSignOut = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/signin");
  };

  const quickCommands = [
    {
      id: "nav-landing",
      label: "Go to Landing Story",
      hint: "Overview & 6 chapters",
      action: () => router.push("/"),
    },
    {
      id: "nav-control",
      label: "Go to Control Room",
      hint: "Live 3-node digital twin",
      action: () => router.push("/control-room"),
    },
    {
      id: "nav-ai",
      label: "Go to AI Assistant",
      hint: "Diagnostics & voice briefs",
      action: () => router.push("/ai-assistant"),
    },
    {
      id: "nav-workflow",
      label: "Go to Workflow Canvas",
      hint: "Operator switching plan",
      action: () => router.push("/workflow"),
    },
    ...nodes.map((n) => ({
      id: `inspect-${n.id}`,
      label: `Inspect Node ${n.badge}: ${n.name}`,
      hint: `${n.temperature}°C · ${n.voltage}V · ${n.statusLabel}`,
      action: () => {
        setSelectedNodeId(n.id);
        router.push("/control-room");
      },
    })),
    {
      id: "toggle-fault",
      label: isThermalFaultActive ? "Clear Node C Thermal Fault" : "Simulate Node C Thermal Fault",
      hint: "Live fault scenario",
      action: () => triggerThermalFault(!isThermalFaultActive),
    },
    {
      id: "toggle-patrol",
      label: rover.isPatrolling ? "Pause ESP32-S3 Rover Patrol" : "Start ESP32-S3 Rover Patrol",
      hint: `Battery ${rover.batteryLevel}%`,
      action: () => (rover.isPatrolling ? stopPatrol() : startPatrol()),
    },
    {
      id: "open-demo",
      label: "Launch 5-Step Demo Flow",
      hint: "Guided walkthrough",
      action: () => startEndToEndDemo(),
    },
    {
      id: "open-evidence",
      label: "Open Hardware Evidence",
      hint: "ESP32-S3 physical rover photos",
      action: () => setIsEvidenceModalOpen(true),
    },
  ];

  const filteredCommands = quickCommands.filter((cmd) => {
    const q = commandQuery.trim().toLowerCase();
    if (!q) return true;
    return cmd.label.toLowerCase().includes(q) || cmd.hint.toLowerCase().includes(q);
  });

  return (
    <>
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-ink-border px-4 lg:px-6 py-2.5 text-ink-text">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
          {/* Brand Left */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group whitespace-nowrap">
              <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-ink-card border border-ink-border group-hover:border-cobalt transition-colors shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
                <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
                <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
                <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
                <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
                <span className="w-1.5 h-1.5 rounded-full bg-cobalt" />
              </div>
              <span className="font-bold text-sm lg:text-base text-ink-text font-sans whitespace-nowrap">
                SmartGrid <span className="text-cobalt">AIoT</span>
              </span>
            </Link>

            {/* Breadcrumb (Compact, no wrap) */}
            <div className="hidden 2xl:flex items-center gap-2 text-xs text-ink-muted font-sans pl-3 border-l border-ink-border whitespace-nowrap">
              <Link href="/" className="hover:text-ink-text transition-colors" aria-label="Home">
                <Home className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink-text font-medium">{currentViewTitle}</span>
            </div>
          </div>

          {/* Center Navigation Pills (Single-line, zero wrap) */}
          <nav
            aria-label="Workspace navigation"
            className="hidden lg:flex items-center gap-1 bg-ink-surface p-1 rounded-full border border-ink-border text-xs font-sans shrink-0"
          >
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                pathname === "/"
                  ? "bg-ink-hover text-ink-text font-semibold"
                  : "text-ink-muted hover:text-ink-text"
              }`}
            >
              Landing
            </Link>
            <Link
              href="/control-room"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/control-room"
                  ? "bg-cobalt text-ink-onAccent font-semibold shadow-cobalt"
                  : "text-ink-muted hover:text-ink-text"
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Control Room</span>
            </Link>
            <Link
              href="/ai-assistant"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/ai-assistant"
                  ? "bg-cobalt text-ink-onAccent font-semibold shadow-cobalt"
                  : "text-ink-muted hover:text-ink-text"
              }`}
            >
              <Bot className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>AI Assistant</span>
            </Link>
            <Link
              href="/workflow"
              className={`px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/workflow"
                  ? "bg-cobalt text-ink-onAccent font-semibold shadow-cobalt"
                  : "text-ink-muted hover:text-ink-text"
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Workflow</span>
            </Link>
          </nav>

          {/* Right Controls & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={startEndToEndDemo}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-card hover:bg-ink-hover text-xs font-sans font-medium text-cobalt-soft border border-ink-border transition-colors whitespace-nowrap"
              title="Launch 5-Step Tabletop Demonstration sequence"
            >
              <PlayCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Demo Flow</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEvidenceModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink-card hover:bg-ink-hover text-xs font-sans font-medium text-ink-secondary border border-ink-border transition-colors whitespace-nowrap"
              title="Inspect actual prototype rover photographs & wiring"
            >
              <Camera className="w-3.5 h-3.5 text-cobalt-soft shrink-0" aria-hidden="true" />
              <span>Evidence</span>
            </button>

            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => {
                setIsCommandOpen(true);
                setIsAlertsOpen(false);
                setIsUserMenuOpen(false);
              }}
              aria-label="Open quick command search"
              title="Quick command search (Ctrl+K)"
              className="p-2 rounded-full hover:bg-ink-hover text-ink-muted hover:text-ink-text transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Notifications Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsAlertsOpen(!isAlertsOpen);
                  setIsUserMenuOpen(false);
                }}
                aria-label="Notifications"
                aria-expanded={isAlertsOpen}
                className="p-2 rounded-full hover:bg-ink-hover text-ink-muted hover:text-ink-text transition-colors relative"
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                {unacknowledgedCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-signal-critical text-ink-onAccent text-[10px] font-bold flex items-center justify-center">
                    {unacknowledgedCount}
                  </span>
                )}
              </button>

              {isAlertsOpen && (
                <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl bg-ink-surface border border-ink-borderStrong p-4 text-xs shadow-2xl">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-ink-border">
                    <span className="font-semibold text-ink-text font-sans">Active Grid Alerts</span>
                    <span className="font-mono text-ink-muted">{alerts.length} total</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="py-4 text-center text-ink-muted">No active alerts.</div>
                    ) : (
                      alerts.map((al) => (
                        <div
                          key={al.id}
                          className="p-2.5 rounded-xl bg-ink-card border border-ink-border flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-ink-text flex items-center gap-1.5">
                              <AlertTriangle
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  al.severity === "CRITICAL"
                                    ? "text-signal-criticalBright"
                                    : "text-signal-warningBright"
                                }`}
                                aria-hidden="true"
                              />
                              <span className="truncate">{al.title}</span>
                            </span>
                            <span className="text-[10px] font-mono text-ink-muted shrink-0">
                              {al.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink-muted leading-snug">{al.rootCause}</p>
                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedNodeId(al.nodeId);
                                setIsAlertsOpen(false);
                                router.push("/control-room");
                              }}
                              className="text-[11px] text-cobalt-soft hover:underline font-medium"
                            >
                              Inspect {al.nodeId.toUpperCase()}
                            </button>
                            {al.status !== "ACTIVE" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-signal-normalBright">
                                <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                                {al.status === "ACKNOWLEDGED" ? "Acknowledged" : al.status}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => acknowledgeAlert(al.id)}
                                className="px-2 py-0.5 rounded bg-ink-hover hover:bg-cobalt text-ink-text text-[11px] transition-colors"
                              >
                                Acknowledge
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsAlertsOpen(false);
                }}
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-ink-hover transition-colors"
              >
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-surface border border-ink-border text-xs whitespace-nowrap">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isGuest ? "bg-signal-warningBright" : "bg-signal-normalBright"
                    }`}
                  />
                  <span className="text-ink-secondary font-medium">{isGuest ? "Guest" : "Operator"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted" aria-hidden="true" />
                </div>

                <div className="w-8 h-8 rounded-full bg-ink-hover border border-ink-borderStrong flex items-center justify-center text-xs font-bold text-ink-text shrink-0">
                  {displayAvatar}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl bg-ink-surface border border-ink-borderStrong p-3 text-xs shadow-2xl">
                  <div className="px-3 py-2 border-b border-ink-border mb-2">
                    <div className="font-semibold text-ink-text">{displayName}</div>
                    <div className="text-[11px] text-cobalt-soft">{displayRole}</div>
                    {isGuest && (
                      <div className="mt-1 text-[11px] text-signal-warningBright">
                        Guest session active
                      </div>
                    )}
                  </div>

                  <Link
                    href="/signin"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-ink-secondary hover:bg-ink-hover hover:text-ink-text transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-cobalt" aria-hidden="true" />
                    <span>Switch / Sign In</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-signal-criticalBright hover:bg-signal-critical/15 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Exit Session (Gate)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-full hover:bg-ink-hover text-ink-secondary transition-colors"
            >
              {isMobileNavOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <nav
            aria-label="Mobile navigation"
            className="lg:hidden mt-3 pt-3 border-t border-ink-border grid grid-cols-2 gap-2 text-xs font-sans"
          >
            <Link
              href="/"
              onClick={() => setIsMobileNavOpen(false)}
              className="px-3 py-2 rounded-xl bg-ink-card text-ink-text font-medium"
            >
              Landing Story
            </Link>
            <Link
              href="/control-room"
              onClick={() => setIsMobileNavOpen(false)}
              className="px-3 py-2 rounded-xl bg-ink-card text-ink-text font-medium"
            >
              Control Room
            </Link>
            <Link
              href="/ai-assistant"
              onClick={() => setIsMobileNavOpen(false)}
              className="px-3 py-2 rounded-xl bg-ink-card text-ink-text font-medium"
            >
              AI Assistant
            </Link>
            <Link
              href="/workflow"
              onClick={() => setIsMobileNavOpen(false)}
              className="px-3 py-2 rounded-xl bg-ink-card text-ink-text font-medium"
            >
              Workflow Canvas
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsMobileNavOpen(false);
                startEndToEndDemo();
              }}
              className="px-3 py-2 rounded-xl bg-cobalt-tint text-cobalt-soft font-medium text-left"
            >
              Demo Flow
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMobileNavOpen(false);
                setIsEvidenceModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-ink-card text-ink-secondary font-medium text-left"
            >
              Hardware Evidence
            </button>
          </nav>
        )}
      </header>

      {/* Quick Operator Command Palette Modal (Ctrl+K) */}
      {isCommandOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink-deep/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4"
          onClick={() => setIsCommandOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-ink-surface border border-ink-borderStrong shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-border">
              <Search className="w-4 h-4 text-ink-muted shrink-0" aria-hidden="true" />
              <input
                ref={commandInputRef}
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Jump to view, inspect node, or toggle rover..."
                className="flex-1 bg-transparent text-sm text-ink-text placeholder-ink-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsCommandOpen(false)}
                className="p-1 rounded-lg hover:bg-ink-hover text-ink-muted"
                aria-label="Close command search"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-6 text-center text-xs text-ink-muted">No matching actions.</div>
              ) : (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={() => {
                      cmd.action();
                      setIsCommandOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-ink-hover flex items-center justify-between gap-3 text-left transition-colors"
                  >
                    <span className="text-sm text-ink-text font-medium flex items-center gap-2">
                      {cmd.id === "toggle-fault" && (
                        <Flame className="w-3.5 h-3.5 text-signal-criticalBright" aria-hidden="true" />
                      )}
                      {cmd.id === "toggle-patrol" &&
                        (rover.isPatrolling ? (
                          <Pause className="w-3.5 h-3.5 text-cobalt-soft" aria-hidden="true" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-signal-normalBright" aria-hidden="true" />
                        ))}
                      <span>{cmd.label}</span>
                    </span>
                    <span className="text-xs font-mono text-ink-muted shrink-0">{cmd.hint}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
