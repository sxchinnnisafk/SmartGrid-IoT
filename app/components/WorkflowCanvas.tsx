"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useGrid } from "../context/GridContext";
import {
  MessageSquare,
  GitBranch,
  Plus,
  Settings,
  AlertTriangle,
  Users,
  Maximize2,
  Play,
  Upload,
  Info,
  RotateCcw,
  Send,
} from "lucide-react";

interface NodePos {
  x: number; // percent 0..100
  y: number; // percent 0..100
}

const DEFAULT_POSITIONS: Record<string, NodePos> = {
  step1: { x: 18, y: 12 },
  step2: { x: 34, y: 43 },
  step3: { x: 48, y: 72 },
};

export default function WorkflowCanvas() {
  const {
    nodes,
    isBreakerIsolated,
    toggleBreakerIsolation,
    isWorkflowExecuting,
    testWorkflow,
    publishWorkflow,
    setActiveTab,
    addLog,
    sendChatMessage,
  } = useGrid();

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [positions, setPositions] = useState<Record<string, NodePos>>(DEFAULT_POSITIONS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [canvasNotice, setCanvasNotice] = useState<string | null>(null);
  const [quickPrompt, setQuickPrompt] = useState<string>("");
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });

  const nodeC = nodes.find((n) => n.id === "node-c") || nodes[2];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(130, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(75, z - 10));
  const handleResetView = () => {
    setZoomLevel(100);
    setPositions(DEFAULT_POSITIONS);
    setCanvasNotice("Layout reset to default sequence.");
  };

  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    // Do not intercept clicks on interactive buttons inside cards
    if ((e.target as HTMLElement).closest("button")) return;
    const container = canvasRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const current = positions[id];
    const px = (current.x / 100) * rect.width;
    const py = (current.y / 100) * rect.height;
    dragOffsetRef.current = {
      dx: e.clientX - rect.left - px,
      dy: e.clientY - rect.top - py,
    };
    setDraggingId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingId !== id) return;
    const container = canvasRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left - dragOffsetRef.current.dx) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top - dragOffsetRef.current.dy) / rect.height) * 100;
    setPositions((prev) => ({
      ...prev,
      [id]: {
        x: Math.min(62, Math.max(14, rawX)),
        y: Math.min(76, Math.max(8, rawY)),
      },
    }));
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const handlePaletteAction = (kind: string, detail: string) => {
    setCanvasNotice(`${kind}: ${detail}`);
    addLog("WORKFLOW", `${kind} template inspected (${detail}).`, "info");
  };

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    sendChatMessage(quickPrompt);
    setQuickPrompt("");
    setCanvasNotice("Sent prompt to SmartGrid AI Assistant.");
  };

  // Compute SVG connector endpoints in 1000x500 coordinate space
  const p1 = { x: positions.step1.x * 10 + 180, y: positions.step1.y * 5 + 48 };
  const p2In = { x: positions.step2.x * 10 + 10, y: positions.step2.y * 5 + 52 };
  const p2Out = { x: positions.step2.x * 10 + 190, y: positions.step2.y * 5 + 52 };
  const p3In = { x: positions.step3.x * 10 + 10, y: positions.step3.y * 5 + 44 };

  return (
    <div className="flex-1 min-w-0 rounded-3xl bg-parchment border border-parchment-border text-parchment-text shadow-parchment p-5 xl:p-6 flex flex-col justify-between overflow-hidden">
      <div className="min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-parchment-border">
          <div className="min-w-0">
            <h1 className="font-serif text-2xl xl:text-3xl font-normal text-parchment-text tracking-tight">
              SmartGrid AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-parchment-muted font-sans mt-0.5">
              Arrange, verify, and publish operator-approved response steps.
            </p>
          </div>

          <div className="text-xs font-sans text-parchment-muted shrink-0">
            Human-in-the-loop switching
          </div>
        </div>

        {/* Mode Switcher Pills: Chat vs Workflow */}
        <div className="flex items-center justify-center mb-3.5">
          <div className="inline-flex p-1 rounded-full bg-parchment-dark border border-parchment-borderStrong">
            <Link
              href="/ai-assistant"
              className="flex items-center gap-2 px-5 py-1.5 rounded-full text-parchment-secondary hover:text-parchment-text text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Chat</span>
            </Link>
            <button
              type="button"
              onClick={() => setActiveTab("workflow")}
              className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-cobalt text-ink-onAccent text-xs font-semibold shadow-sm transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Workflow</span>
            </button>
          </div>
        </div>

        {/* Interactive Free-Form Workflow Canvas Surface */}
        <div
          ref={canvasRef}
          className="relative w-full h-[430px] xl:h-[470px] rounded-2xl bg-parchment border border-parchment-borderStrong shadow-inner overflow-hidden select-none bg-parchment-canvas"
        >
          {/* Top Right Helper Notice */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-parchment-light/90 border border-parchment-border text-[11px] text-parchment-secondary font-sans">
            <Info className="w-3.5 h-3.5 text-cobalt shrink-0" aria-hidden="true" />
            <span>{canvasNotice || "Drag cards to rearrange the flow"}</span>
          </div>

          {/* Floating Left Palette */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 p-1.5 rounded-2xl bg-parchment-light border border-parchment-borderStrong shadow-sm text-xs font-sans">
            <button
              type="button"
              onClick={() =>
                handlePaletteAction("Step node", "Thermal threshold trigger or contactor command")
              }
              className="flex flex-col items-center gap-0.5 p-2 rounded-xl bg-parchment-bright hover:bg-parchment text-cobalt border border-parchment-border transition-colors"
              title="Inspect step node"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span className="text-[10px] font-semibold">Add step</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handlePaletteAction("Condition gate", `Triggers when Node C exceeds 85°C (live: ${nodeC.temperature}°C)`)
              }
              className="flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-parchment text-parchment-secondary transition-colors"
              title="Inspect condition gate"
            >
              <GitBranch className="w-4 h-4" aria-hidden="true" />
              <span className="text-[10px]">Condition</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handlePaletteAction("Action node", "Breaker isolation, load reroute, or crew dispatch")
              }
              className="flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-parchment text-parchment-secondary transition-colors"
              title="Inspect action node"
            >
              <Settings className="w-4 h-4" aria-hidden="true" />
              <span className="text-[10px]">Action</span>
            </button>
          </div>

          {/* Scalable Canvas Content */}
          <div
            className="relative w-full h-full transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
          >
            {/* Dynamic SVG Curved Connectors Following Node Positions */}
            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 1000 500"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="workflowArrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--color-cobalt)" />
                </marker>
              </defs>

              <path
                d={`M ${p1.x},${p1.y} C ${p1.x + 80},${p1.y} ${p2In.x - 80},${p2In.y} ${p2In.x},${p2In.y}`}
                stroke="var(--color-cobalt)"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#workflowArrow)"
                className={isWorkflowExecuting ? "animate-pulse" : ""}
              />

              <path
                d={`M ${p2Out.x},${p2Out.y} C ${p2Out.x + 70},${p2Out.y} ${p3In.x - 70},${p3In.y} ${p3In.x},${p3In.y}`}
                stroke="var(--color-cobalt)"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#workflowArrow)"
                className={isWorkflowExecuting ? "animate-pulse" : ""}
              />
            </svg>

            {/* STEP 1: Detect thermal fault */}
            <div
              onPointerDown={(e) => handlePointerDown("step1", e)}
              onPointerMove={(e) => handlePointerMove("step1", e)}
              onPointerUp={handlePointerUp}
              style={{ left: `${positions.step1.x}%`, top: `${positions.step1.y}%` }}
              className={`absolute z-20 w-56 rounded-2xl bg-parchment-bright border p-3 shadow-md transition-colors cursor-grab active:cursor-grabbing ${
                isWorkflowExecuting
                  ? "border-signal-critical ring-2 ring-signal-critical/30"
                  : "border-parchment-borderStrong hover:border-cobalt"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-signal-criticalBg text-signal-critical border border-signal-criticalBorder flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-sm font-semibold text-parchment-text truncate">
                    Detect thermal fault
                  </h3>
                  <p className="text-[11px] text-parchment-muted font-sans">
                    Node C ({nodeC.temperature}°C)
                  </p>
                  <p className="text-[10px] text-signal-critical font-mono font-semibold">
                    Threshold exceeded
                  </p>
                </div>
              </div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cobalt border-2 border-parchment shadow" />
            </div>

            {/* STEP 2: Isolate breaker */}
            <div
              onPointerDown={(e) => handlePointerDown("step2", e)}
              onPointerMove={(e) => handlePointerMove("step2", e)}
              onPointerUp={handlePointerUp}
              style={{ left: `${positions.step2.x}%`, top: `${positions.step2.y}%` }}
              className={`absolute z-20 w-60 rounded-2xl bg-parchment-bright border p-3 shadow-md transition-colors cursor-grab active:cursor-grabbing ${
                isWorkflowExecuting
                  ? "border-cobalt ring-2 ring-cobalt/30"
                  : "border-parchment-borderStrong hover:border-cobalt"
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-control-bg text-control border border-cobalt-border flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-sm font-semibold text-parchment-text truncate">
                    Isolate breaker
                  </h3>
                  <p className="text-[11px] text-parchment-muted font-sans truncate">
                    Node C · Open SC-12 safely
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-parchment-border">
                <span className="text-[11px] font-sans text-parchment-muted">Breaker isolation</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isBreakerIsolated}
                    aria-label="Toggle breaker isolation"
                    onClick={toggleBreakerIsolation}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      isBreakerIsolated ? "bg-cobalt" : "bg-parchment-borderStrong"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-parchment-bright shadow transition-transform duration-200 ${
                        isBreakerIsolated ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-mono text-parchment-text font-medium">
                    {isBreakerIsolated ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cobalt border-2 border-parchment shadow" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cobalt border-2 border-parchment shadow" />
            </div>

            {/* STEP 3: Dispatch field crew */}
            <div
              onPointerDown={(e) => handlePointerDown("step3", e)}
              onPointerMove={(e) => handlePointerMove("step3", e)}
              onPointerUp={handlePointerUp}
              style={{ left: `${positions.step3.x}%`, top: `${positions.step3.y}%` }}
              className={`absolute z-20 w-56 rounded-2xl bg-parchment-bright border p-3 shadow-md transition-colors cursor-grab active:cursor-grabbing ${
                isWorkflowExecuting
                  ? "border-signal-normal ring-2 ring-signal-normal/30"
                  : "border-parchment-borderStrong hover:border-cobalt"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-signal-normalBg text-signal-normalText border border-signal-normalBorder flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-sm font-semibold text-parchment-text truncate">
                    Dispatch field crew
                  </h3>
                  <p className="text-[11px] text-parchment-muted font-sans">Node C bay</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-signal-normalText font-sans font-semibold mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-normalBright" />
                    <span>Ready</span>
                  </div>
                </div>
              </div>

              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cobalt border-2 border-parchment shadow" />
            </div>
          </div>

          {/* Canvas Bottom Left Zoom & Reset Controls */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-parchment-light border border-parchment-borderStrong shadow-sm text-xs font-mono text-parchment-text">
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-5 h-5 rounded-full hover:bg-parchment-bright flex items-center justify-center font-bold transition-colors"
              title="Zoom out"
              aria-label="Zoom out"
            >
              -
            </button>
            <span className="text-[11px] font-semibold px-0.5">{zoomLevel}%</span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-5 h-5 rounded-full hover:bg-parchment-bright flex items-center justify-center font-bold transition-colors"
              title="Zoom in"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="w-5 h-5 rounded-full hover:bg-parchment-bright flex items-center justify-center text-parchment-muted transition-colors"
              title="Reset layout and zoom"
              aria-label="Reset layout and zoom"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar below Canvas */}
      <div className="pt-3.5 border-t border-parchment-border mt-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        <form
          onSubmit={handleQuickAsk}
          className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-sm bg-parchment-bright border border-parchment-borderStrong rounded-full px-3 py-1.5 text-xs focus-within:border-cobalt transition-colors"
        >
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="Ask AI about this workflow..."
            className="flex-1 bg-transparent text-parchment-text placeholder-parchment-subtle focus:outline-none min-w-0"
          />
          <button
            type="submit"
            aria-label="Send workflow question"
            className="p-1 rounded-full text-cobalt hover:bg-cobalt-tint transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={testWorkflow}
            disabled={isWorkflowExecuting}
            className="pill-button-parchment text-xs py-2 px-4"
          >
            <Play
              className={`w-3.5 h-3.5 text-cobalt ${isWorkflowExecuting ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{isWorkflowExecuting ? "Testing..." : "Test workflow"}</span>
          </button>

          <button
            type="button"
            onClick={publishWorkflow}
            className="pill-button-cobalt text-xs py-2 px-5 shadow-cobalt"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Publish workflow</span>
          </button>
        </div>
      </div>
    </div>
  );
}
