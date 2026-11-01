"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GridNodeData,
  ThresholdConfig,
  TelemetryPoint,
  AlertTicket,
  RoverState,
  LogMessage,
} from "../types/grid";

interface GridContextType {
  nodes: GridNodeData[];
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  selectedNode: GridNodeData;
  thresholds: ThresholdConfig;
  setThresholds: React.Dispatch<React.SetStateAction<ThresholdConfig>>;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isThermalFaultActive: boolean;
  triggerThermalFault: (active?: boolean) => void;
  rover: RoverState;
  startPatrol: () => void;
  stopPatrol: () => void;
  telemetryHistory: TelemetryPoint[];
  alerts: AlertTicket[];
  acknowledgeAlert: (id: string) => void;
  logs: LogMessage[];
  addLog: (type: LogMessage["type"], message: string, level: LogMessage["level"]) => void;
  resetSystem: () => void;
}

const initialNodes: GridNodeData[] = [
  {
    id: "node-a",
    name: "Node A: Residential Feeder",
    type: "Residential Feeder",
    status: "normal",
    temperature: 42.5,
    voltage: 230.2,
    current: 48.4,
    powerLoad: 312.5,
    phaseBalance: 98.2,
    householdCount: 1420,
    location: "Sector 7 - Suburban Residential Grid",
    lastUpdated: new Date().toLocaleTimeString(),
    description: "Primary residential transformer feeding 1,420 households with stable solar micro-generation feed-in.",
  },
  {
    id: "node-b",
    name: "Node B: EV Charging Hub",
    type: "EV Charging Hub",
    status: "warning",
    temperature: 68.1,
    voltage: 218.7,
    current: 142.6,
    powerLoad: 780.0,
    phaseBalance: 91.5,
    activeEVs: 24,
    location: "Sector 4 - Commercial Highway Plaza",
    lastUpdated: new Date().toLocaleTimeString(),
    description: "High-capacity ultra-fast DC charging station hub experiencing peak load surges.",
  },
  {
    id: "node-c",
    name: "Node C: Industrial Transformer",
    type: "Industrial Transformer",
    status: "critical",
    temperature: 98.4,
    voltage: 194.5,
    current: 285.0,
    powerLoad: 1450.2,
    phaseBalance: 82.4,
    oilLevel: 41.0,
    location: "Sector 1 - Industrial Park Substation",
    lastUpdated: new Date().toLocaleTimeString(),
    description: "Heavy industrial step-down transformer currently showing thermal runaway indicators in winding coil T-3.",
  },
];

const initialThresholds: ThresholdConfig = {
  tempWarning: 65,
  tempCritical: 85,
  voltageMin: 205,
  voltageMax: 245,
  currentMax: 250,
};

const initialAlerts: AlertTicket[] = [
  {
    id: "ALT-8902",
    nodeId: "node-c",
    nodeName: "Node C: Industrial Transformer",
    severity: "CRITICAL",
    title: "Severe Thermal Runaway & Phase Voltage Sag",
    timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
    temperature: 98.4,
    voltage: 194.5,
    current: 285.0,
    rootCause: "Cooling oil degradation combined with 1450kW harmonic load imbalance on Phase C.",
    aiMitigation: [
      "Auto-throttle industrial feeder load by 35% via smart breaker SC-12.",
      "Dispatch Autonomous Patrol Rover R-1 for thermal FLIR imaging and acoustic inspection.",
      "Initiate auxiliary cooling pump bank B immediately.",
    ],
    status: "ACTIVE",
  },
  {
    id: "ALT-8894",
    nodeId: "node-b",
    nodeName: "Node B: EV Charging Hub",
    severity: "WARNING",
    title: "Elevated Thermal Gradient Detected",
    timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
    temperature: 68.1,
    voltage: 218.7,
    current: 142.6,
    rootCause: "Simultaneous fast-charging session load spike across 24 ports.",
    aiMitigation: [
      "Dynamic load shedding: limit max charger output to 120kW per stall.",
      "Monitor temperature gradient for 10 minutes.",
    ],
    status: "ACKNOWLEDGED",
  },
];

// Generate initial 10 history points
const generateInitialTelemetry = (): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const now = Date.now();
  for (let i = 9; i >= 0; i--) {
    const d = new Date(now - i * 5000);
    points.push({
      timestamp: d.toISOString(),
      timeLabel: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      nodeATemp: 42 + Math.sin(i * 0.5) * 2,
      nodeAVoltage: 230 + Math.cos(i * 0.3) * 1.5,
      nodeACurrent: 48 + Math.sin(i * 0.4) * 3,
      nodeBTemp: 67 + Math.sin(i * 0.6) * 3,
      nodeBVoltage: 218 + Math.cos(i * 0.5) * 2,
      nodeBCurrent: 140 + Math.sin(i * 0.2) * 5,
      nodeCTemp: 95 + (i * 0.3),
      nodeCVoltage: 195 - (i * 0.2),
      nodeCCurrent: 280 + Math.sin(i * 0.7) * 4,
    });
  }
  return points;
};

const GridContext = createContext<GridContextType | undefined>(undefined);

export function GridProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<GridNodeData[]>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-c");
  const [thresholds, setThresholds] = useState<ThresholdConfig>(initialThresholds);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isThermalFaultActive, setIsThermalFaultActive] = useState<boolean>(true);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(generateInitialTelemetry());
  const [alerts, setAlerts] = useState<AlertTicket[]>(initialAlerts);
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: "log-1",
      timestamp: new Date().toLocaleTimeString(),
      type: "MQTT",
      message: "Connected to ESP32 Edge Broker at mqtt://192.168.1.105:1883",
      level: "success",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 3000).toLocaleTimeString(),
      type: "ALERT",
      message: "CRITICAL: Thermal fault triggered on Node C (Industrial Transformer)",
      level: "error",
    },
  ]);

  const [rover, setRover] = useState<RoverState>({
    isPatrolling: false,
    currentNodeId: "node-a",
    targetNodeId: "node-b",
    progress: 0,
    batteryLevel: 89,
    patrolMode: "Full Network Sweep",
    speedMps: 1.8,
    roverId: "ROVER-ESP32-X1",
    cameraStatus: "THERMAL_ACTIVE",
  });

  const addLog = (type: LogMessage["type"], message: string, level: LogMessage["level"]) => {
    const newLog: LogMessage = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      level,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Trigger thermal fault handler
  const triggerThermalFault = (active?: boolean) => {
    const newState = active !== undefined ? active : !isThermalFaultActive;
    setIsThermalFaultActive(newState);

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === "node-c") {
          return {
            ...n,
            status: newState ? "critical" : "normal",
            temperature: newState ? 98.4 : 45.2,
            voltage: newState ? 194.5 : 228.0,
            current: newState ? 285.0 : 160.0,
            powerLoad: newState ? 1450.2 : 820.0,
            lastUpdated: new Date().toLocaleTimeString(),
          };
        }
        return n;
      })
    );

    if (newState) {
      const newAlert: AlertTicket = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        nodeId: "node-c",
        nodeName: "Node C: Industrial Transformer",
        severity: "CRITICAL",
        title: "Manual Thermal Fault Simulation Triggered",
        timestamp: new Date().toLocaleTimeString(),
        temperature: 98.4,
        voltage: 194.5,
        current: 285.0,
        rootCause: "Simulated over-temperature condition induced on coil winding T-3 via dashboard trigger.",
        aiMitigation: [
          "Deploy autonomous patrol rover to inspect thermal radiation profile.",
          "Activate secondary oil-to-air heat exchangers.",
        ],
        status: "ACTIVE",
      };
      setAlerts((prev) => [newAlert, ...prev]);
      addLog("ALERT", "CRITICAL Thermal Fault simulated at Node C (98.4°C)", "error");
    } else {
      addLog("SYSTEM", "Thermal fault cleared at Node C. Status returned to Normal.", "success");
    }
  };

  // Start Patrol handler
  const startPatrol = () => {
    if (rover.isPatrolling) return;
    setRover((prev) => ({ ...prev, isPatrolling: true, progress: 0 }));
    addLog("ROVER", `Autonomous Patrol Rover ${rover.roverId} dispatched. Mode: ${rover.patrolMode}`, "success");
  };

  const stopPatrol = () => {
    setRover((prev) => ({ ...prev, isPatrolling: false }));
    addLog("ROVER", "Autonomous Patrol Rover halted by operator.", "warn");
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" as const } : a))
    );
    addLog("SYSTEM", `Alert ticket ${id} acknowledged by operator.`, "info");
  };

  const resetSystem = () => {
    setNodes(initialNodes);
    setIsThermalFaultActive(true);
    setIsOffline(false);
    setThresholds(initialThresholds);
    setAlerts(initialAlerts);
    setRover({
      isPatrolling: false,
      currentNodeId: "node-a",
      targetNodeId: "node-b",
      progress: 0,
      batteryLevel: 89,
      patrolMode: "Full Network Sweep",
      speedMps: 1.8,
      roverId: "ROVER-ESP32-X1",
      cameraStatus: "THERMAL_ACTIVE",
    });
    addLog("SYSTEM", "System state fully reset to default simulation baseline.", "info");
  };

  // Periodic simulation ticks (telemetry stream, rover movement, offline simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOffline) {
        addLog("HTTP", "Edge connection timeout: ESP32 node unresponsive (Offline Mode active)", "warn");
        return;
      }

      // Update telemetry history
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          const jitter = (Math.random() - 0.5) * 1.2;
          let temp = node.temperature + jitter * 0.4;
          if (node.id === "node-c" && isThermalFaultActive) {
            temp = Math.max(95, Math.min(102, 98.4 + (Math.random() - 0.5) * 1.5));
          }
          return {
            ...node,
            temperature: Number(temp.toFixed(1)),
            voltage: Number((node.voltage + (Math.random() - 0.5) * 0.8).toFixed(1)),
            current: Number((node.current + (Math.random() - 0.5) * 1.2).toFixed(1)),
            lastUpdated: timeLabel,
          };
        })
      );

      setTelemetryHistory((prev) => {
        const last = prev[prev.length - 1];
        const newPoint: TelemetryPoint = {
          timestamp: now.toISOString(),
          timeLabel,
          nodeATemp: last ? Number((last.nodeATemp + (Math.random() - 0.5)).toFixed(1)) : 42,
          nodeAVoltage: 230,
          nodeACurrent: 48,
          nodeBTemp: last ? Number((last.nodeBTemp + (Math.random() - 0.5) * 1.5).toFixed(1)) : 68,
          nodeBVoltage: 218,
          nodeBCurrent: 142,
          nodeCTemp: isThermalFaultActive ? 98.4 + (Math.random() - 0.5) * 1.2 : 45,
          nodeCVoltage: isThermalFaultActive ? 194.5 : 228,
          nodeCCurrent: isThermalFaultActive ? 285 : 160,
        };
        return [...prev.slice(1), newPoint];
      });

      // Rover movement simulation
      if (rover.isPatrolling) {
        setRover((prev) => {
          const nextProgress = prev.progress + 4;
          if (nextProgress >= 100) {
            const nodesSeq = ["node-a", "node-b", "node-c"];
            const currentIndex = nodesSeq.indexOf(prev.targetNodeId);
            const nextTargetIndex = (currentIndex + 1) % nodesSeq.length;
            const reachedId = prev.targetNodeId;
            const newTargetId = nodesSeq[nextTargetIndex];

            addLog("ROVER", `Rover arrived at ${reachedId.toUpperCase()}. FLIR scan complete. Moving to ${newTargetId.toUpperCase()}`, "success");

            return {
              ...prev,
              currentNodeId: reachedId,
              targetNodeId: newTargetId,
              progress: 0,
              batteryLevel: Math.max(10, prev.batteryLevel - 2),
            };
          }
          return { ...prev, progress: nextProgress };
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOffline, isThermalFaultActive, rover.isPatrolling, rover.targetNodeId]);

  return (
    <GridContext.Provider
      value={{
        nodes,
        selectedNodeId,
        setSelectedNodeId,
        selectedNode,
        thresholds,
        setThresholds,
        isOffline,
        setIsOffline,
        isThermalFaultActive,
        triggerThermalFault,
        rover,
        startPatrol,
        stopPatrol,
        telemetryHistory,
        alerts,
        acknowledgeAlert,
        logs,
        addLog,
        resetSystem,
      }}
    >
      {children}
    </GridContext.Provider>
  );
}

export function useGrid() {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("useGrid must be used within a GridProvider");
  }
  return context;
}
