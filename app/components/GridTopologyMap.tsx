"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import { useGrid } from "../context/GridContext";
import { GridNodeData } from "../types/grid";
import {
  Home,
  Zap,
  Factory,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Navigation,
} from "lucide-react";

// Custom Node Component
function CustomGridNode({ data }: { data: GridNodeData }) {
  const nodeData = data;
  const { selectedNodeId, setSelectedNodeId, rover } = useGrid();
  const isSelected = selectedNodeId === nodeData.id;
  const isRoverHere = rover.currentNodeId === nodeData.id || (rover.isPatrolling && rover.targetNodeId === nodeData.id);

  let statusBg = "bg-emerald-500/10 border-emerald-500/50 glow-emerald";
  let statusColor = "text-emerald-400";
  let badgeText = "NORMAL";
  let Icon = CheckCircle2;

  if (nodeData.status === "warning") {
    statusBg = "bg-amber-500/10 border-amber-500/50 glow-amber";
    statusColor = "text-amber-400";
    badgeText = "WARNING";
    Icon = AlertTriangle;
  } else if (nodeData.status === "critical") {
    statusBg = "bg-rose-500/15 border-rose-500/60 glow-rose animate-pulse";
    statusColor = "text-rose-400";
    badgeText = "CRITICAL";
    Icon = ShieldAlert;
  }

  let NodeIcon = Home;
  if (nodeData.type === "EV Charging Hub") NodeIcon = Zap;
  if (nodeData.type === "Industrial Transformer") NodeIcon = Factory;

  return (
    <div
      onClick={() => setSelectedNodeId(nodeData.id)}
      className={`cursor-pointer rounded-xl p-4 w-72 backdrop-blur-md transition-all border ${statusBg} ${
        isSelected ? "ring-2 ring-cyan-400 scale-105" : "hover:border-slate-500"
      } bg-slate-900/90 text-slate-100 shadow-2xl relative`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-cyan-400 border-2 border-slate-900" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-cyan-400 border-2 border-slate-900" />

      {/* Rover Indicator Badge */}
      {isRoverHere && (
        <div className="absolute -top-3 -right-2 bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg animate-bounce">
          <Navigation className="w-3 h-3" />
          <span>ROVER R-1</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg bg-slate-800/80 ${statusColor} border border-slate-700`}>
            <NodeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{nodeData.name}</h3>
            <span className="text-[11px] text-slate-400">{nodeData.type}</span>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
          nodeData.status === "normal" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
          nodeData.status === "warning" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
          "bg-rose-500/20 text-rose-300 border border-rose-500/40"
        }`}>
          <Icon className="w-3 h-3" />
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center font-mono">
        <div className="bg-slate-800/50 p-1.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">TEMP</div>
          <div className={`text-xs font-bold ${
            nodeData.temperature > 80 ? "text-rose-400" : nodeData.temperature > 60 ? "text-amber-400" : "text-emerald-400"
          }`}>
            {nodeData.temperature}°C
          </div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">VOLT</div>
          <div className="text-xs font-bold text-cyan-400">{nodeData.voltage}V</div>
        </div>
        <div className="bg-slate-800/50 p-1.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">LOAD</div>
          <div className="text-xs font-bold text-slate-200">{nodeData.powerLoad}kW</div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
        <span>{nodeData.location.split(" - ")[0]}</span>
        <span className="font-mono text-cyan-400/80">Sync: {nodeData.lastUpdated}</span>
      </div>
    </div>
  );
}

const nodeTypes = {
  gridNode: CustomGridNode,
};

export default function GridTopologyMap() {
  const { nodes, selectedNodeId } = useGrid();

  // Map nodes to React Flow format
  const flowNodes = useMemo(() => {
    return [
      {
        id: "node-a",
        type: "gridNode",
        position: { x: 50, y: 120 },
        data: nodes.find((n) => n.id === "node-a") || nodes[0],
      },
      {
        id: "node-b",
        type: "gridNode",
        position: { x: 420, y: 40 },
        data: nodes.find((n) => n.id === "node-b") || nodes[1],
      },
      {
        id: "node-c",
        type: "gridNode",
        position: { x: 790, y: 140 },
        data: nodes.find((n) => n.id === "node-c") || nodes[2],
      },
    ];
  }, [nodes]);

  // Animated dashed edges representing the patrol route
  const flowEdges = useMemo(() => {
    return [
      {
        id: "edge-a-b",
        source: "node-a",
        target: "node-b",
        animated: true,
        style: { stroke: "#06b6d4", strokeWidth: 3, strokeDasharray: "6 6" },
        label: "Patrol Route Segment 1 (1.8 m/s)",
        labelStyle: { fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" },
        labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 },
      },
      {
        id: "edge-b-c",
        source: "node-b",
        target: "node-c",
        animated: true,
        style: { stroke: "#f59e0b", strokeWidth: 3, strokeDasharray: "6 6" },
        label: "Patrol Route Segment 2 (Thermal Vector)",
        labelStyle: { fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" },
        labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 },
      },
      {
        id: "edge-c-a",
        source: "node-c",
        target: "node-a",
        animated: true,
        style: { stroke: "#10b981", strokeWidth: 2, strokeDasharray: "4 4" },
        label: "Return Loop (Micro-Grid Link)",
        labelStyle: { fill: "#64748b", fontSize: 10, fontFamily: "monospace" },
        labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 },
      },
    ];
  }, []);

  return (
    <div className="w-full h-[450px] bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
          Grid Topology & Rover Patrol Canvas
        </span>
      </div>

      <ReactFlow
        nodes={flowNodes as any}
        edges={flowEdges as any}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls className="bg-slate-900 border-slate-800 text-slate-300" />
        <MiniMap
          nodeColor={(node) => {
            const d = node.data as any;
            if (d?.status === "critical") return "#ef4444";
            if (d?.status === "warning") return "#f59e0b";
            return "#10b981";
          }}
          maskColor="rgba(9, 13, 22, 0.85)"
          className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
}
