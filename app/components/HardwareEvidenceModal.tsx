"use client";

import React from "react";
import Image from "next/image";
import { useGrid } from "../context/GridContext";
import { X, ShieldCheck, AlertCircle, Cpu, Eye, ExternalLink } from "lucide-react";

export default function HardwareEvidenceModal() {
  const { isEvidenceModalOpen, setIsEvidenceModalOpen } = useGrid();

  if (!isEvidenceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#141824] border border-[#273247] shadow-2xl p-6 sm:p-8 text-[#f4f5f8] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#222a3d] mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38bdf8] uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              <span>PHYSICAL PROTOTYPE BUILD EVIDENCE • TEAM CELESTIA</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Hardware Build & Edge Rover Evidence
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] mt-1 font-sans">
              Authentic photographs of the physical rover platform demonstrating the assembled edge controller, animated-eye TFT screen, and wiring chassis.
            </p>
          </div>
          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="p-2 rounded-full bg-[#1b2232] hover:bg-[#28334b] text-[#9ca3af] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evidence Status Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-[#1b2334] border border-[#29364f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#22c55e]">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Demonstrated by Photographs:</span> Assembled four-wheel chassis, ESP32-S3 microcontroller board, motor driver board, power enclosure, and functional TFT animated-eye display.
            </div>
          </div>
          <div className="text-[11px] px-2.5 py-1 rounded bg-[#3b59f8]/20 text-[#93c5fd] shrink-0 border border-[#3b59f8]/40">
            KLE Tech Univ • Power Hack 2026
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Photo 1: Front View with TFT Screen */}
          <div className="rounded-2xl bg-[#0e111a] border border-[#232c40] p-4 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-3 border border-[#1e2638]">
                <img
                  src="/assets/rover_front_prototype.jpg"
                  alt="Actual front-view rover photograph showing TFT animated-eye interface"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono text-[#22c55e] border border-[#22c55e]/30">
                  ● ACTIVE TFT EYE INTERFACE
                </div>
              </div>
              <h3 className="font-serif text-lg text-white mb-1">
                Front View: Animated-Eye TFT Interface
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Actual front-view photograph showing the four-wheel drive chassis and the SPI TFT screen displaying the real-time animated eye expression, status indicators, and lock-on HUD.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1e2638] text-[11px] font-mono text-[#60a5fa] flex items-center justify-between">
              <span>Resolution: 320x240 SPI LCD</span>
              <span>Layer 1: Mobile Edge</span>
            </div>
          </div>

          {/* Photo 2: Top View with Wiring & ESP32 */}
          <div className="rounded-2xl bg-[#0e111a] border border-[#232c40] p-4 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-3 border border-[#1e2638]">
                <img
                  src="/assets/rover_wiring_top_view.jpg"
                  alt="Actual top-view wiring photograph showing ESP32 controller and motor driver"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono text-[#38bdf8] border border-[#38bdf8]/30">
                  ● CONTROLLER & MOTOR WIRING
                </div>
              </div>
              <h3 className="font-serif text-lg text-white mb-1">
                Top View: Controller & Power Chassis
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Actual top-view wiring photograph showing the ESP32-S3 development board, motor-driver-style PCB, display connection bus, battery enclosure, and DC geared motors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1e2638] text-[11px] font-mono text-[#60a5fa] flex items-center justify-between">
              <span>Board: ESP32-S3 Wi-Fi Edge</span>
              <span>Chassis: 4WD Robotic Rig</span>
            </div>
          </div>
        </div>

        {/* Safety Boundary Notice */}
        <div className="p-4 rounded-2xl bg-[#261719] border border-[#4d1f24] text-xs font-mono text-[#fca5a5] flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#ef4444] mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-white uppercase">Tabletop Safety & Simulation Boundary: </span>
            This prototype is designed exclusively for safe, low-voltage educational demonstration. It is not connected to live utility mains, BESCOM distribution equipment, or high-voltage transformers. Breaker isolation and load-shedding responses are simulated in software and on low-voltage indicators.
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#222a3d]">
          <span className="text-xs font-mono text-[#9ca3af]">
            Team Celestia: Akash • Sachin • Obed • Rayyan | KLE Tech
          </span>
          <button
            onClick={() => setIsEvidenceModalOpen(false)}
            className="pill-button-cobalt text-xs py-2 px-5"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
