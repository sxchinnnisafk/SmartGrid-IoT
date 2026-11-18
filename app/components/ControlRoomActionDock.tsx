"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import { Play, Pause, Upload } from "lucide-react";

export default function ControlRoomActionDock() {
  const {
    rover,
    startPatrol,
    stopPatrol,
    publishCommands,
    isBreakerIsolated,
    user,
  } = useGrid();

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const handlePatrolToggle = () => {
    if (rover.isPatrolling) {
      stopPatrol();
    } else {
      startPatrol();
    }
  };

  const handlePublishConfirm = () => {
    publishCommands();
    setIsPublishModalOpen(false);
  };

  return (
    <>
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
              Deploy ESP32-S3 rover along corridor
            </p>
          </div>
        </button>

        {/* ACTION 2: Publish Changes */}
        <button
          type="button"
          onClick={() => setIsPublishModalOpen(true)}
          className="group relative rounded-2xl bg-parchment hover:bg-parchment-light text-parchment-text p-4 lg:p-5 border border-parchment-border shadow-parchment transition-transform transition-colors hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-4 text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-parchment-dark flex items-center justify-center shrink-0 text-cobalt group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-xl font-normal text-parchment-text leading-tight">
              Publish changes
            </h3>
            <p className="text-xs font-sans text-parchment-muted mt-0.5 truncate">
              Apply operator commands to live twin
            </p>
          </div>
        </button>
      </div>

      {/* Operator Publish Confirmation Dialog */}
      {isPublishModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-deep/80 backdrop-blur-sm"
          onClick={() => setIsPublishModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-parchment border border-parchment-borderStrong p-6 text-parchment-text shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cobalt text-ink-onAccent flex items-center justify-center shadow-sm">
                <Upload className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-parchment-text font-normal">
                  Publish changes to edge
                </h3>
                <p className="text-xs font-sans text-parchment-muted">
                  Operator return-path transmission
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-parchment-secondary leading-relaxed mb-4">
              This action transmits operator-approved threshold parameters and simulated circuit breaker isolation commands back to the ESP32-S3 Rover and edge corridor nodes.
            </p>

            <div className="p-3.5 rounded-xl bg-parchment-light border border-parchment-border font-mono text-xs mb-6 space-y-1.5">
              <div className="flex justify-between gap-2">
                <span className="text-parchment-muted">Target Edge:</span>
                <span className="font-semibold text-parchment-text">ESP32-S3 / Node A, B, C</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-parchment-muted">Breaker SC-12:</span>
                <span className="font-semibold text-signal-critical">
                  {isBreakerIsolated ? "Simulated Isolation Armed" : "Normal Closed"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-parchment-muted">Operator:</span>
                <span className="font-semibold text-cobalt">
                  {user?.name || "Jordan Diaz"} ({user?.avatarText || "JD"})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 rounded-full bg-parchment-dark hover:bg-parchment-borderStrong text-xs font-sans text-parchment-text font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishConfirm}
                className="pill-button-cobalt text-xs py-2 px-5"
              >
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
