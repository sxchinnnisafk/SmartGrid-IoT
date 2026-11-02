"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
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

  let statusBg = "bg-[var(--color-success-bg)] border-[var(--color-success-border)] glow-success";
  let statusColor = "text-[var(--color-success)]";
  let badgeText = "NORMAL";
  let Icon = CheckCircle2;

  if (nodeData.status === "warning") {
    statusBg = "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)] glow-warning";
    statusColor = "text-[var(--color-warning)]";
    badgeText = "WARNING";
    Icon = AlertTriangle;
  } else if (nodeData.status === "critical") {
    statusBg = "bg-[var(--color-error-bg)] border-[var(--color-error-border)] glow-error animate-pulse";
    statusColor = "text-[var(--color-error)]";
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
        isSelected ? "ring-2 ring-[var(--color-accent)] scale-[1.02]" : "hover:border-[var(--color-border-strong)]"
      } bg-[var(--color-card)] text-[var(--color-text)] shadow-2xl relative`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[var(--color-accent)] border-2 border-[var(--color-bg)]" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[var(--color-accent)] border-2 border-[var(--color-bg)]" />

      {/* Rover Indicator Badge */}
      {isRoverHere && (
        <div className="absolute -top-3 -right-2 bg-[var(--color-accent)] text-[var(--color-text-inverse)] font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg animate-bounce">
          <Navigation className="w-3 h-3" />
          <span>ROVER R-1</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg bg-[var(--color-bg-subtle)] ${statusColor} border border-[var(--color-border)]`}>
            <NodeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text)]">{nodeData.name}</h3>
            <span className="text-[11px] text-[var(--color-text-muted)]">{nodeData.type}</span>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
          nodeData.status === "normal" ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-success-border)]" :
          nodeData.status === "warning" ? "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border border-[var(--color-warning-border)]" :
          "bg-[var(--color-error-bg)] text-[var(--color-error-text)] border border-[var(--color-error-border)]"
        }`}>
          <Icon className="w-3 h-3" />
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--color-border)] text-center font-mono">
        <div className="bg-[var(--color-bg-subtle)] p-1.5 rounded border border-[var(--color-border)]">
          <div className="text-[10px] text-[var(--color-text-muted)]">TEMP</div>
          <div className={`text-xs font-bold ${
            nodeData.temperature > 80 ? "text-[var(--color-error)]" : nodeData.temperature > 60 ? "text-[var(--color-warning)]" : "text-[var(--color-success)]"
          }`}>
            {nodeData.temperature}°C
          </div>
        </div>
        <div className="bg-[var(--color-bg-subtle)] p-1.5 rounded border border-[var(--color-border)]">
          <div className="text-[10px] text-[var(--color-text-muted)]">VOLT</div>
          <div className="text-xs font-bold text-[var(--color-accent)]">{nodeData.voltage}V</div>
        </div>
        <div className="bg-[var(--color-bg-subtle)] p-1.5 rounded border border-[var(--color-border)]">
          <div className="text-[10px] text-[var(--color-text-muted)]">LOAD</div>
          <div className="text-xs font-bold text-[var(--color-text)]">{nodeData.powerLoad}kW</div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
        <span>{nodeData.location.split(" - ")[0]}</span>
        <span className="font-mono text-[var(--color-accent)]/80">Sync: {nodeData.lastUpdated}</span>
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
        style: { stroke: "var(--color-accent)", strokeWidth: 3, strokeDasharray: "6 6" },
        label: "Patrol Route Segment 1 (1.8 m/s)",
        labelStyle: { fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "monospace" },
        labelBgStyle: { fill: "var(--color-bg-elevated)", fillOpacity: 0.9 },
      },
      {
        id: "edge-b-c",
        source: "node-b",
        target: "node-c",
        animated: true,
        style: { stroke: "var(--color-warning)", strokeWidth: 3, strokeDasharray: "6 6" },
        label: "Patrol Route Segment 2 (Thermal Vector)",
        labelStyle: { fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "monospace" },
        labelBgStyle: { fill: "var(--color-bg-elevated)", fillOpacity: 0.9 },
      },
      {
        id: "edge-c-a",
        source: "node-c",
        target: "node-a",
        animated: true,
        style: { stroke: "var(--color-success)", strokeWidth: 2, strokeDasharray: "4 4" },
        label: "Return Loop (Micro-Grid Link)",
        labelStyle: { fill: "var(--color-text-subtle)", fontSize: 10, fontFamily: "monospace" },
        labelBgStyle: { fill: "var(--color-bg-elevated)", fillOpacity: 0.9 },
      },
    ];
  }, []);

  return (
    <div className="w-full h-[450px] bg-[var(--color-bg)]/80 rounded-2xl border border-[var(--color-border)] overflow-hidden relative shadow-2xl">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-[var(--color-bg-elevated)]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[var(--color-border)] flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-ping" />
        <span className="text-xs font-mono font-bold text-[var(--color-text)] uppercase tracking-wider">
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
        <Background color="var(--color-border)" gap={24} size={1} />
        <Controls className="bg-[var(--color-bg-elevated)] border-[var(--color-border)] text-[var(--color-text-muted)]" />
        <MiniMap
          nodeColor={(node) => {
            const d = node.data as any;
            if (d?.status === "critical") return "var(--color-error)";
            if (d?.status === "warning") return "var(--color-warning)";
            return "var(--color-success)";
          }}
          maskColor="rgba(2, 6, 23, 0.85)"
          className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
}