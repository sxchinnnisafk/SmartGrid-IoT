"use client";

import React from "react";
import Link from "next/link";
import { useGrid } from "../context/GridContext";
import { Play, Pause, Bot } from "lucide-react";

export default function ControlRoomActionDock() {
  const { rover, startPatrol, stopPatrol } = useGrid();

  const handlePatrolToggle = () => {
    if (rover.isPatrolling) {
      stopPatrol();
    } else {
      startPatrol();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full select-none">
      {/* ACTION 1: Start / Pause Patrol */}
      <button
        type="button"
        onClick={handlePatrolToggle}
        className="group relative rounded-2xl bg-cobalt hover:bg-cobalt-hover text-ink-onAccent p-4 lg:p-5 shadow-cobalt transition-transform transition-colors hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-4 text-left border border-cobalt-border"
      >
        <div className="w-11 h-11 rounded-xl bg-ink-onAccent/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          {rover.isPatrolling ? (
            <Pause className="w-5 h-5 fill-current" aria-hidden="true" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-normal text-ink-onAccent leading-tight">
            {rover.isPatrolling ? "Pause patrol" : "Start patrol"}
          </h3>
          <p className="text-xs font-sans text-ink-onAccent/80 mt-0.5 truncate">
            Control ESP32-S3 rover movement along patrol path
          </p>
        </div>
      </button>

      {/* ACTION 2: AI Assistant Guidance */}
      <Link
        href="/ai-assistant"
        className="group relative rounded-2xl bg-parchment hover:bg-parchment-light text-parchment-text p-4 lg:p-5 border border-parchment-border shadow-parchment transition-transform transition-colors hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-4 text-left"
      >
        <div className="w-11 h-11 rounded-xl bg-parchment-dark flex items-center justify-center shrink-0 text-cobalt group-hover:scale-105 transition-transform">
          <Bot className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-xl font-normal text-parchment-text leading-tight">
            Ask AI Assistant
          </h3>
          <p className="text-xs font-sans text-parchment-muted mt-0.5 truncate">
            Review rover status, IR obstacles, and patrol advice
          </p>
        </div>
      </Link>
    </div>
  );
}
