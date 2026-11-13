"use client";

import React, { useState } from "react";
import { useGrid } from "../context/GridContext";
import {
  Plus,
  Minus,
  Navigation,
  Compass,
  Wifi,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  RotateCcw,
} from "lucide-react";

export default function ControlRoomCanvas() {
  const {
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    rover,
    isThermalFaultActive,
    triggerThermalFault,
  } = useGrid();

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isAssetPaletteOpen, setIsAssetPaletteOpen] = useState<boolean>(false);

  const nodeA = nodes.find((n) => n.id === "node-a") || nodes[0];
  const nodeB = nodes.find((n) => n.id === "node-b") || nodes[1];
  const nodeC = nodes.find((n) => n.id === "node-c") || nodes[2];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(150, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(70, z - 10));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="relative w-full h-[580px] xl:h-[640px] rounded-3xl bg-[#ede4d8] border border-[#d8cdbd] text-[#1c1f28] shadow-parchment overflow-hidden flex flex-col justify-between select-none">
      {/* Top Banner on Canvas */}
      <div className="relative z-20 px-6 pt-5 flex items-start justify-between">
        {/* Left Drag Assets CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAssetPaletteOpen(!isAssetPaletteOpen)}
            className="w-9 h-9 rounded-full bg-[#f5eee5] hover:bg-white text-[#1c1f28] border border-[#d2c5b3] flex items-center justify-center shadow-sm transition-all hover:scale-105"
            title="Add asset to grid"
          >
            <Plus className="w-5 h-5 text-[#3b59f8]" />
          </button>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#181a22] leading-tight">
              Drag assets to add to the grid
            </h2>
            <p className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#717888] uppercase">
              BUILD A CLEANER, MORE RESILIENT TOMORROW.
            </p>
          </div>
        </div>

        {/* Right Slogan */}
        <div className="hidden sm:block text-right">
          <p className="text-[10px] font-mono tracking-widest text-[#717888] uppercase leading-tight">
            REAL-WORLD ENERGY. <br />
            HIGHER INTELLIGENCE.
          </p>
        </div>
      </div>

      {/* Asset Palette Dropdown */}
      {isAssetPaletteOpen && (
        <div className="absolute top-16 left-6 z-30 bg-[#f7f2ea] border border-[#d6c7b3] rounded-2xl p-4 shadow-xl text-xs font-mono w-72">
          <div className="text-[11px] font-bold text-[#181a22] mb-2 uppercase">
            Available Micro-Grid Assets
          </div>
          <div className="space-y-2">
            <div className="p-2 bg-white rounded-lg border border-[#e2d6c6] flex items-center gap-2 cursor-pointer hover:border-[#3b59f8]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span>Solar Micro-Inverter Feeder</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-[#e2d6c6] flex items-center gap-2 cursor-pointer hover:border-[#3b59f8]">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              <span>EV DC Fast Charger Bank</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-[#e2d6c6] flex items-center gap-2 cursor-pointer hover:border-[#ef4444]">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span>Distribution Step-Down Transformer</span>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-[#838b9c]">
            Click to drop onto tabletop coordinate corridor.
          </p>
        </div>
      )}

      {/* Main Isometric Interactive Stage */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
      >
        {/* Stylized Isometric Landscape Background with Lake and Roads */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle contour lines */}
          <path
            d="M 50,200 Q 250,150 450,220 T 950,180"
            stroke="#d8cdbd"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <path
            d="M 100,320 Q 300,280 600,340 T 980,310"
            stroke="#d8cdbd"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />
          <path
            d="M 0,460 Q 400,420 800,470"
            stroke="#d8cdbd"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />

          {/* Lake / Pond at bottom right matching the concept screenshot */}
          <path
            d="M 680,480 Q 740,430 820,440 T 960,490 Q 990,560 920,590 T 720,580 Q 660,540 680,480 Z"
            fill="#b8d4e3"
            opacity="0.8"
          />

          {/* Isometric Road Corridor connecting nodes */}
          <path
            d="M 120,420 Q 320,380 440,320 T 820,240"
            stroke="#e0d5c4"
            strokeWidth="28"
            strokeLinecap="round"
          />

          {/* Energy Pulse Line (Royal Blue connecting A -> B -> C) */}
          <path
            d="M 160,250 Q 280,240 370,260 T 570,270"
            stroke="#3b59f8"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Glowing Junction Dots */}
          <circle cx="160" cy="250" r="5" fill="#3b59f8" />
          <circle cx="280" cy="245" r="4" fill="#3b59f8" />
          <circle cx="370" cy="260" r="5" fill="#3b59f8" />
          <circle cx="470" cy="265" r="4" fill="#3b59f8" />
          <circle cx="570" cy="270" r="5" fill="#3b59f8" />

          {/* Rover Dashed Telemetry Trail */}
          <path
            d="M 220,380 Q 320,360 420,390 T 580,410"
            stroke="#3b59f8"
            strokeWidth="2"
            strokeDasharray="5 7"
            fill="none"
          />
        </svg>

        {/* NODE A: Residential Feeder */}
        <div
          onClick={() => setSelectedNodeId("node-a")}
          className={`absolute top-[22%] left-[6%] sm:left-[10%] z-20 cursor-pointer transition-all duration-300 ${
            selectedNodeId === "node-a" ? "scale-105" : "hover:scale-102"
          }`}
        >
          {/* Isometric House & Solar Illustration */}
          <div className="relative w-36 h-28 sm:w-44 sm:h-32 mb-1 flex items-center justify-center">
            {/* Visual House Model Block */}
            <div className="w-28 h-20 rounded-2xl bg-[#f5efe6] border border-[#d4c6b2] shadow-md p-2 flex flex-col justify-between relative overflow-hidden group">
              <div className="h-6 rounded bg-[#3b59f8]/15 border border-[#3b59f8]/30 flex items-center justify-center text-[10px] font-mono text-[#3b59f8] font-bold">
                SOLAR ROOF
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-[#626877]">
                <div className="p-1 rounded bg-[#ece4d8]">1420 Homes</div>
                <div className="p-1 rounded bg-[#ece4d8]">98.2% Bal</div>
              </div>
            </div>
          </div>

          {/* Node Badge Card matching the mockup */}
          <div
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#f7f2ea] border transition-all shadow-sm ${
              selectedNodeId === "node-a"
                ? "border-[#3b59f8] ring-2 ring-[#3b59f8]/20"
                : "border-[#d8ccbb] hover:border-[#3b59f8]"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#4f46e5] text-white flex items-center justify-center text-[11px] font-bold">
              A
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-[#1c1f28]">
                Residential Feeder
              </div>
              <div className="text-[10px] text-[#6d7486]">
                Neighborhood supply
              </div>
            </div>
            <div className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span>Normal</span>
            </div>
          </div>
        </div>

        {/* NODE B: EV Charging Hub */}
        <div
          onClick={() => setSelectedNodeId("node-b")}
          className={`absolute top-[30%] left-[34%] sm:left-[36%] z-20 cursor-pointer transition-all duration-300 ${
            selectedNodeId === "node-b" ? "scale-105" : "hover:scale-102"
          }`}
        >
          {/* Isometric Canopy & EV Illustration */}
          <div className="relative w-36 h-28 sm:w-44 sm:h-32 mb-1 flex items-center justify-center">
            <div className="w-28 h-20 rounded-2xl bg-[#f5efe6] border border-[#d4c6b2] shadow-md p-2 flex flex-col justify-between relative overflow-hidden">
              <div className="h-6 rounded bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[10px] font-mono text-[#d97706] font-bold">
                EV CANOPY
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-[#626877]">
                <div className="p-1 rounded bg-[#ece4d8]">4 Stalls</div>
                <div className="p-1 rounded bg-[#ece4d8]">76 MW</div>
              </div>
            </div>
          </div>

          {/* Node Badge Card */}
          <div
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#f7f2ea] border transition-all shadow-sm ${
              selectedNodeId === "node-b"
                ? "border-[#f59e0b] ring-2 ring-[#f59e0b]/20"
                : "border-[#d8ccbb] hover:border-[#f59e0b]"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#4f46e5] text-white flex items-center justify-center text-[11px] font-bold">
              B
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-[#1c1f28]">
                EV Charging Hub
              </div>
              <div className="text-[10px] text-[#6d7486]">
                4 chargers online
              </div>
            </div>
            <div className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              <span>Warning</span>
            </div>
          </div>
        </div>

        {/* NODE C: Industrial Transformer */}
        <div
          onClick={() => setSelectedNodeId("node-c")}
          className={`absolute top-[20%] right-[6%] sm:right-[12%] z-20 cursor-pointer transition-all duration-300 ${
            selectedNodeId === "node-c" ? "scale-105" : "hover:scale-102"
          }`}
        >
          {/* Substation Tower & Transformer Illustration */}
          <div className="relative w-40 h-32 sm:w-48 sm:h-36 mb-1 flex items-center justify-center">
            <div className="w-32 h-24 rounded-2xl bg-[#f5efe6] border border-[#d4c6b2] shadow-md p-2 flex flex-col justify-between relative overflow-hidden">
              <div
                className={`h-6 rounded border flex items-center justify-center text-[10px] font-mono font-bold ${
                  isThermalFaultActive
                    ? "bg-[#fee2e2] text-[#dc2626] border-[#fecaca] animate-pulse"
                    : "bg-[#22c55e]/15 text-[#16a34a] border-[#bbf7d0]"
                }`}
              >
                SUBSTATION T-3
              </div>
              <div className="grid grid-cols-2 gap-1 text-[9px] font-mono text-[#626877]">
                <div
                  className={`p-1 rounded font-bold ${
                    isThermalFaultActive ? "bg-[#fee2e2] text-[#dc2626]" : "bg-[#ece4d8]"
                  }`}
                >
                  {nodeC.temperature}°C
                </div>
                <div className="p-1 rounded bg-[#ece4d8]">194.5 V</div>
              </div>
            </div>
          </div>

          {/* Node Badge Card */}
          <div
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#f7f2ea] border transition-all shadow-sm ${
              selectedNodeId === "node-c"
                ? "border-[#ef4444] ring-2 ring-[#ef4444]/20"
                : "border-[#d8ccbb] hover:border-[#ef4444]"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white flex items-center justify-center text-[11px] font-bold">
              C
            </span>
            <div className="text-left font-sans">
              <div className="font-semibold text-xs text-[#1c1f28]">
                Industrial Transformer
              </div>
              <div className="text-[10px] text-[#6d7486]">
                High load detected
              </div>
            </div>
            <div className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping" />
              <span>Critical</span>
            </div>
          </div>
        </div>

        {/* ESP32-S3 ROVER PATROL ON CANVAS */}
        <div
          className="absolute z-20 transition-all duration-1000"
          style={{
            bottom: "22%",
            left: `${rover.xPercent}%`,
          }}
        >
          {/* Rover Model Inset */}
          <div className="flex flex-col items-center">
            {/* Wi-Fi Waves Icon */}
            <div className="mb-1 text-[#3b59f8] animate-bounce">
              <Wifi className="w-5 h-5" />
            </div>

            {/* Rover Chassis */}
            <div className="w-16 h-10 rounded-xl bg-[#1e2330] border-2 border-[#3b59f8] shadow-lg flex items-center justify-center text-[9px] font-mono text-white font-bold rover-pulse">
              ROVER R-1
            </div>

            {/* Label below */}
            <div className="mt-1.5 text-center font-mono">
              <div className="text-xs font-bold text-[#181a24]">
                ESP32-S3 Rover
              </div>
              <div className="text-[9px] tracking-wider text-[#636a7b] uppercase">
                AUTONOMOUS INSPECTION
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Bottom Controls (Compass left, Zoom controls right) */}
      <div className="relative z-20 px-6 pb-5 flex items-center justify-between">
        {/* North Compass Indicator at bottom-left */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f5eee5] border border-[#d8ccbc] shadow-sm text-xs font-mono font-bold text-[#181a24]">
          <Compass className="w-4 h-4 text-[#3b59f8]" />
          <span>N</span>
          <span>▲</span>
        </div>

        {/* Zoom Controls Pill at bottom-right */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5eee5] border border-[#d8ccbc] shadow-sm text-xs font-mono text-[#181a24]">
          <button
            onClick={handleZoomOut}
            className="w-5 h-5 rounded hover:bg-white flex items-center justify-center transition-colors font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <span className="px-1 text-[11px] font-semibold">{zoomLevel}%</span>
          <button
            onClick={handleZoomIn}
            className="w-5 h-5 rounded hover:bg-white flex items-center justify-center transition-colors font-bold"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
