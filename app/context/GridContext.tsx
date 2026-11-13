"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GridNodeData,
  ThresholdConfig,
  TelemetryPoint,
  AlertTicket,
  RoverState,
  LogMessage,
  WorkflowNodeItem,
  ChatMessage,
  UserProfile,
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

  // Workflow Canvas state
  workflowNodes: WorkflowNodeItem[];
  setWorkflowNodes: React.Dispatch<React.SetStateAction<WorkflowNodeItem[]>>;
  isBreakerIsolated: boolean;
  toggleBreakerIsolation: () => void;
  isWorkflowExecuting: boolean;
  testWorkflow: () => void;
  publishWorkflow: () => void;

  // Chat & AI Assistant state
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  activeChatId: string;
  setActiveChatId: (id: string) => void;

  // 5-Step Demo Controller
  currentDemoStep: number;
  runDemoStep: (step: number) => void;
  isDemoRunning: boolean;
  startEndToEndDemo: () => void;
  resetDemo: () => void;
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;

  // Hardware Evidence Modal
  isEvidenceModalOpen: boolean;
  setIsEvidenceModalOpen: (open: boolean) => void;

  // Audio Dispatch Player
  isPlayingVoice: boolean;
  toggleVoicePlayback: () => void;
  voiceProgress: number;

  // Authentication & Guest Operator state
  user: UserProfile | null;
  isAuthenticated: boolean;
  hasSkippedAuth: boolean;
  isAuthLoaded: boolean;
  login: (email: string, name?: string, role?: string) => void;
  register: (name: string, email: string, role?: string) => void;
  skipAuth: () => void;
  logout: () => void;

  // Active view tab (for unified navigation)
  activeTab: "control-room" | "chat" | "workflow" | "artifacts";
  setActiveTab: (tab: "control-room" | "chat" | "workflow" | "artifacts") => void;
}

const initialNodes: GridNodeData[] = [
  {
    id: "node-a",
    badge: "A",
    name: "Residential Feeder",
    type: "Residential Feeder",
    status: "normal",
    statusLabel: "Normal",
    temperature: 42.5,
    voltage: 230.2,
    current: 48.4,
    powerLoad: 98,
    powerLoadUnit: "MW",
    phaseBalance: 98.2,
    householdCount: 1420,
    location: "Sector 7 - Suburban Feeder Corridor",
    lastUpdated: "10:24 AM",
    description: "Neighborhood supply stable.",
    subDescription: "Homes • Smart Meters",
  },
  {
    id: "node-b",
    badge: "B",
    name: "EV Charging Hub",
    type: "EV Charging Hub",
    status: "warning",
    statusLabel: "Warning",
    temperature: 68.1,
    voltage: 218.7,
    current: 142.6,
    powerLoad: 76,
    powerLoadUnit: "MW",
    phaseBalance: 91.5,
    activeEVs: 24,
    location: "Highway Corridor 4 - Rapid Charging Station",
    lastUpdated: "10:24 AM",
    description: "Elevated load detected. Monitoring closely.",
    subDescription: "Fast Chargers • Energy Storage • 4 chargers online",
  },
  {
    id: "node-c",
    badge: "C",
    name: "Industrial Transformer",
    type: "Industrial Transformer",
    status: "critical",
    statusLabel: "Critical",
    temperature: 102.0,
    voltage: 194.5,
    current: 285.0,
    powerLoad: 102,
    powerLoadUnit: "MW",
    phaseBalance: 82.4,
    oilLevel: 41.0,
    location: "Substation Bay 3 - Heavy Industrial Feeder",
    lastUpdated: "10:24 AM",
    description: "High load detected. Immediate attention.",
    subDescription: "Substation • High Load",
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
    title: "Severe Thermal Runaway (102°C Exceeding 85°C Threshold)",
    timestamp: "10:24 AM",
    temperature: 102.0,
    voltage: 194.5,
    current: 285.0,
    rootCause: "Thermal sensors show elevated equipment temperature (102°C), exceeding 85°C safe limit.",
    aiMitigation: [
      "Isolate Node C breaker to prevent damage and ensure safety.",
      "Stop the inspection rover in the area.",
      "Reroute load to Node A and B (capacity available: 98 MW / 76 MW).",
      "Dispatch a field crew to inspect and repair.",
    ],
    status: "ACTIVE",
  },
];

const initialWorkflowNodes: WorkflowNodeItem[] = [
  {
    id: "step-1",
    type: "trigger",
    title: "Detect thermal fault",
    subtitle: "Node C • Threshold exceeded (102°C)",
    statusBadge: "Critical",
    statusColor: "critical",
    x: 80,
    y: 80,
    enabled: true,
  },
  {
    id: "step-2",
    type: "action",
    title: "Isolate breaker",
    subtitle: "Node C • Open breaker to prevent damage",
    statusBadge: "Enabled",
    statusColor: "normal",
    enabled: true,
    x: 420,
    y: 190,
  },
  {
    id: "step-3",
    type: "action",
    title: "Dispatch field crew",
    subtitle: "Node C • Standard repair kit",
    statusBadge: "Ready",
    statusColor: "normal",
    enabled: true,
    x: 720,
    y: 300,
  },
];

const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "user",
    senderName: "Jordan Diaz",
    avatarText: "JD",
    timestamp: "10:24 AM",
    content: "Show the current Node C risk and suggest the safest response.",
  },
  {
    id: "msg-2",
    sender: "assistant",
    senderName: "SmartGrid AI",
    timestamp: "10:24 AM",
    content:
      "Node C is in a critical state. Thermal sensors show elevated equipment temperature (102 °C), exceeding the 85 °C safe threshold. Risk of equipment failure is high if no action is taken.",
    isCriticalAlert: true,
    recommendations: [
      "Isolate the Node C breaker to prevent damage and ensure safety.",
      "Stop the inspection rover in the area.",
      "Reroute load to Node A and B (capacity available).",
      "Dispatch a field crew to inspect and repair.",
    ],
    workflowCard: {
      title: "Fault response workflow",
      description: "Pre-filled with recommended actions for Node C.",
      buttonText: "Open in Workflow →",
    },
  },
];

const generateTelemetryHistory = (): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const now = Date.now();
  for (let i = 12; i >= 0; i--) {
    const d = new Date(now - i * 4000);
    points.push({
      timestamp: d.toISOString(),
      timeLabel: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      nodeATemp: 42 + Math.sin(i * 0.5) * 1.5,
      nodeAVoltage: 230 + Math.cos(i * 0.3) * 1.2,
      nodeACurrent: 48 + Math.sin(i * 0.4) * 2,
      nodeBTemp: 68 + Math.sin(i * 0.6) * 2,
      nodeBVoltage: 218 + Math.cos(i * 0.5) * 1.8,
      nodeBCurrent: 142 + Math.sin(i * 0.2) * 4,
      nodeCTemp: 102 + (12 - i) * 0.2,
      nodeCVoltage: 194.5 - (12 - i) * 0.1,
      nodeCCurrent: 285 + Math.sin(i * 0.7) * 3,
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
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(generateTelemetryHistory());
  const [alerts, setAlerts] = useState<AlertTicket[]>(initialAlerts);
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: "log-1",
      timestamp: "10:22 AM",
      type: "SYSTEM",
      message: "ESP32-S3 Rover telemetry link established via Wi-Fi stream.",
      level: "success",
    },
    {
      id: "log-2",
      timestamp: "10:24 AM",
      type: "ALERT",
      message: "CRITICAL: Node C Industrial Transformer temperature at 102°C (>85°C limit).",
      level: "error",
    },
  ]);

  const [rover, setRover] = useState<RoverState>({
    isPatrolling: true,
    currentNodeId: "node-b",
    targetNodeId: "node-c",
    progress: 45,
    batteryLevel: 89,
    patrolMode: "Autonomous Inspection",
    speedMps: 1.8,
    roverId: "ESP32-S3 Rover",
    cameraStatus: "THERMAL_ACTIVE",
    xPercent: 62,
    yPercent: 68,
  });

  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNodeItem[]>(initialWorkflowNodes);
  const [isBreakerIsolated, setIsBreakerIsolated] = useState<boolean>(true);
  const [isWorkflowExecuting, setIsWorkflowExecuting] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [activeChatId, setActiveChatId] = useState<string>("chat-today-node-c");

  // 5-Step Demo Controller State
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);

  // Voice playback simulation
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [voiceProgress, setVoiceProgress] = useState<number>(0);

  // Active view tab: control-room | chat | workflow | artifacts
  const [activeTab, setActiveTab] = useState<"control-room" | "chat" | "workflow" | "artifacts">("control-room");

  // User profile & Auth gate state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasSkippedAuth, setHasSkippedAuth] = useState<boolean>(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);

  // Clear any stale storage flags on mount so visiting the domain always presents the Sign In gate
  useEffect(() => {
    try {
      localStorage.removeItem("smartgrid_auth_skipped");
      localStorage.removeItem("smartgrid_auth_user");
      sessionStorage.removeItem("smartgrid_auth_skipped");
      sessionStorage.removeItem("smartgrid_auth_user");
    } catch {
      // Storage fallback
    } finally {
      setIsAuthLoaded(true);
    }
  }, []);

  const login = (email: string, name?: string, role?: string) => {
    const displayName = name || (email.includes("@") ? email.split("@")[0] : "Jordan Diaz");
    const avatar = displayName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "JD";
    const newUser: UserProfile = {
      name: displayName,
      email,
      role: role || "Grid Operations",
      avatarText: avatar,
      isGuest: false,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setHasSkippedAuth(false);
    addLog("SYSTEM", `Operator ${displayName} (${newUser.role}) authenticated successfully.`, "success");
  };

  const register = (name: string, email: string, role?: string) => {
    login(email, name, role || "Grid Operations Lead");
  };

  const skipAuth = () => {
    const guestUser: UserProfile = {
      name: "Guest Operator",
      email: "guest@smartgrid.io",
      role: "Observer Access",
      avatarText: "GO",
      isGuest: true,
    };
    setUser(guestUser);
    setHasSkippedAuth(true);
    setIsAuthenticated(false);
    addLog("SYSTEM", "Guest operator access granted. Digital twin preview unlocked.", "info");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setHasSkippedAuth(false);
    try {
      localStorage.removeItem("smartgrid_auth_user");
      localStorage.removeItem("smartgrid_auth_skipped");
      sessionStorage.removeItem("smartgrid_auth_user");
      sessionStorage.removeItem("smartgrid_auth_skipped");
    } catch {}
    addLog("SYSTEM", "Operator signed out. Gateway locked.", "warn");
  };

  const addLog = (type: LogMessage["type"], message: string, level: LogMessage["level"]) => {
    const newLog: LogMessage = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type,
      message,
      level,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];

  const triggerThermalFault = (active?: boolean) => {
    const newState = active !== undefined ? active : !isThermalFaultActive;
    setIsThermalFaultActive(newState);

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === "node-c") {
          return {
            ...n,
            status: newState ? "critical" : "normal",
            statusLabel: newState ? "Critical" : "Normal",
            temperature: newState ? 102.0 : 44.5,
            voltage: newState ? 194.5 : 229.0,
            current: newState ? 285.0 : 155.0,
            powerLoad: newState ? 102 : 45,
            lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            description: newState
              ? "High load detected. Immediate attention."
              : "Substation load nominal. Normal baseline.",
          };
        }
        return n;
      })
    );

    if (newState) {
      addLog("ALERT", "Thermal anomaly triggered at Node C: 102°C detected.", "error");
    } else {
      addLog("SYSTEM", "Thermal anomaly cleared at Node C. Temperature returned to nominal.", "success");
    }
  };

  const startPatrol = () => {
    setRover((prev) => ({ ...prev, isPatrolling: true }));
    addLog("ROVER", "ESP32-S3 Rover patrol started. Autonomous inspection active.", "success");
  };

  const stopPatrol = () => {
    setRover((prev) => ({ ...prev, isPatrolling: false }));
    addLog("ROVER", "ESP32-S3 Rover paused at current checkpoint.", "warn");
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" as const } : a))
    );
    addLog("SYSTEM", `Alert ticket ${id} acknowledged by operator.`, "info");
  };

  const toggleBreakerIsolation = () => {
    setIsBreakerIsolated((prev) => {
      const next = !prev;
      setWorkflowNodes((nds) =>
        nds.map((n) => (n.id === "step-2" ? { ...n, enabled: next, statusBadge: next ? "Enabled" : "Disabled" } : n))
      );
      addLog("WORKFLOW", `Breaker isolation on Node C set to: ${next ? "ENABLED" : "DISABLED"}`, next ? "warn" : "info");
      return next;
    });
  };

  const testWorkflow = () => {
    setIsWorkflowExecuting(true);
    addLog("WORKFLOW", "Testing automated fault mitigation pipeline (Step 1 -> Step 2 -> Step 3)...", "info");

    setTimeout(() => {
      addLog("WORKFLOW", "Step 1: Detect thermal fault confirmed on Node C (102°C)", "success");
    }, 800);

    setTimeout(() => {
      addLog("WORKFLOW", "Step 2: Isolate breaker command verified. Simulated relay triggered.", "success");
    }, 1800);

    setTimeout(() => {
      addLog("WORKFLOW", "Step 3: Dispatch field crew generated. Audio alert prepared.", "success");
      setIsWorkflowExecuting(false);
    }, 2800);
  };

  const publishWorkflow = () => {
    addLog("WORKFLOW", "Operator approved and published workflow to live edge telemetry return path.", "success");
    alert("Workflow published! Commands dispatched to ESP32-S3 Rover and edge controllers.");
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      senderName: "Jordan Diaz",
      avatarText: "JD",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: text,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    addLog("SYSTEM", `Operator queried AI Assistant: "${text}"`, "info");

    // Simulate intelligent context-aware reply
    setTimeout(() => {
      let replyContent = "I have cross-checked recent telemetry with IEEE distribution guidelines. ";
      let recommendations: string[] | undefined;
      let isCritical = false;

      if (text.toLowerCase().includes("node c") || text.toLowerCase().includes("risk") || text.toLowerCase().includes("thermal")) {
        replyContent =
          "Node C remains in a critical thermal state (102°C). Coil winding degradation risk is elevated. Recommended response sequence is active.";
        recommendations = [
          "Isolate Node C breaker to prevent physical coil damage.",
          "Hold Rover R-1 at Node B waypoint.",
          "Reroute 26MW to Node A and Node B feeders.",
          "Dispatch emergency maintenance team with standard kit.",
        ];
        isCritical = true;
      } else if (text.toLowerCase().includes("patrol") || text.toLowerCase().includes("rover")) {
        replyContent =
          "ESP32-S3 Rover R-1 is currently patrolling between Node B and Node C at 1.8 m/s. Battery is at 89%. Optical TFT displays live telemetry eyes.";
      } else {
        replyContent =
          "Grid status across all 3 nodes is being continuously monitored. Node A is stable (Baseline), Node B is handling evening EV peak load, and Node C has an active simulated fault ticket.";
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        senderName: "SmartGrid AI",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: replyContent,
        isCriticalAlert: isCritical,
        recommendations,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    }, 900);
  };

  // Voice playback timer simulation
  const toggleVoicePlayback = () => {
    if (isPlayingVoice) {
      setIsPlayingVoice(false);
      setVoiceProgress(0);
    } else {
      setIsPlayingVoice(true);
      setVoiceProgress(0);
      addLog("SYSTEM", "Playing ElevenLabs voice dispatch alert audio preview (18s)...", "info");
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingVoice) {
      timer = setInterval(() => {
        setVoiceProgress((p) => {
          if (p >= 18) {
            setIsPlayingVoice(false);
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayingVoice]);

  // 5-Step End-to-End Demo Sequence (from PDF Page 6)
  const runDemoStep = (step: number) => {
    setCurrentDemoStep(step);
    if (step === 1) {
      // Step 1: Start Patrol
      setRover((r) => ({ ...r, isPatrolling: true, progress: 10, currentNodeId: "node-a", targetNodeId: "node-b" }));
      addLog("ROVER", "DEMO STEP 1: Operator initiated rover patrol from control room.", "success");
    } else if (step === 2) {
      // Step 2: Patrol + Sense
      setRover((r) => ({ ...r, isPatrolling: true, progress: 65, currentNodeId: "node-b", targetNodeId: "node-c" }));
      addLog("ROVER", "DEMO STEP 2: Rover moved from Node A through Node B toward Node C, streaming telemetry.", "info");
    } else if (step === 3) {
      // Step 3: Trigger the Event
      triggerThermalFault(true);
      addLog("ALERT", "DEMO STEP 3: Controlled thermal anomaly (102°C) introduced at Node C.", "error");
    } else if (step === 4) {
      // Step 4: Edge Response
      setRover((r) => ({ ...r, isPatrolling: false, progress: 95, currentNodeId: "node-c" }));
      addLog("ROVER", "DEMO STEP 4: Rover halts at Node C, TFT switches to critical alert, relay simulates isolation.", "warn");
    } else if (step === 5) {
      // Step 5: Twin + AI Response
      setIsPlayingVoice(true);
      addLog("SYSTEM", "DEMO STEP 5: Digital twin marks Node C critical, AI generates dispatch brief & voice alert.", "success");
    }
  };

  const startEndToEndDemo = () => {
    setIsDemoRunning(true);
    setIsDemoModalOpen(true);
    runDemoStep(1);
  };

  const resetDemo = () => {
    setIsDemoRunning(false);
    setCurrentDemoStep(1);
    setIsThermalFaultActive(false);
    setRover({
      isPatrolling: true,
      currentNodeId: "node-a",
      targetNodeId: "node-b",
      progress: 20,
      batteryLevel: 89,
      patrolMode: "Autonomous Inspection",
      speedMps: 1.8,
      roverId: "ESP32-S3 Rover",
      cameraStatus: "THERMAL_ACTIVE",
      xPercent: 62,
      yPercent: 68,
    });
    addLog("SYSTEM", "Demonstration reset to baseline.", "info");
  };

  const resetSystem = () => {
    setNodes(initialNodes);
    setIsThermalFaultActive(true);
    setIsOffline(false);
    setThresholds(initialThresholds);
    setAlerts(initialAlerts);
    setRover({
      isPatrolling: true,
      currentNodeId: "node-b",
      targetNodeId: "node-c",
      progress: 45,
      batteryLevel: 89,
      patrolMode: "Autonomous Inspection",
      speedMps: 1.8,
      roverId: "ESP32-S3 Rover",
      cameraStatus: "THERMAL_ACTIVE",
      xPercent: 62,
      yPercent: 68,
    });
    addLog("SYSTEM", "System reset to default state.", "info");
  };

  // Periodic simulated telemetry jitter
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOffline) return;

      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          const jitter = (Math.random() - 0.5) * 0.8;
          let temp = node.temperature + jitter * 0.2;
          if (node.id === "node-c" && isThermalFaultActive) {
            temp = Math.max(99, Math.min(104, 102.0 + (Math.random() - 0.5) * 1.2));
          } else if (node.id === "node-a") {
            temp = 42.5 + (Math.random() - 0.5) * 0.6;
          } else if (node.id === "node-b") {
            temp = 68.1 + (Math.random() - 0.5) * 1.0;
          }

          return {
            ...node,
            temperature: Number(temp.toFixed(1)),
            voltage: Number((node.voltage + (Math.random() - 0.5) * 0.4).toFixed(1)),
            current: Number((node.current + (Math.random() - 0.5) * 0.8).toFixed(1)),
          };
        })
      );

      setTelemetryHistory((prev) => {
        const last = prev[prev.length - 1];
        const newPoint: TelemetryPoint = {
          timestamp: now.toISOString(),
          timeLabel,
          nodeATemp: last ? Number((last.nodeATemp + (Math.random() - 0.5) * 0.4).toFixed(1)) : 42.5,
          nodeAVoltage: 230.2,
          nodeACurrent: 48.4,
          nodeBTemp: last ? Number((last.nodeBTemp + (Math.random() - 0.5) * 0.6).toFixed(1)) : 68.1,
          nodeBVoltage: 218.7,
          nodeBCurrent: 142.6,
          nodeCTemp: isThermalFaultActive ? 102.0 + (Math.random() - 0.5) * 0.8 : 44.5,
          nodeCVoltage: isThermalFaultActive ? 194.5 : 229.0,
          nodeCCurrent: isThermalFaultActive ? 285.0 : 155.0,
        };
        return [...prev.slice(1), newPoint];
      });

      // Rover progress update
      if (rover.isPatrolling) {
        setRover((prev) => {
          const next = prev.progress + 3;
          if (next >= 100) {
            const seq = ["node-a", "node-b", "node-c"];
            const currIdx = seq.indexOf(prev.targetNodeId);
            const nextIdx = (currIdx + 1) % seq.length;
            return {
              ...prev,
              currentNodeId: prev.targetNodeId,
              targetNodeId: seq[nextIdx],
              progress: 0,
            };
          }
          return { ...prev, progress: next };
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isOffline, isThermalFaultActive, rover.isPatrolling]);

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

        workflowNodes,
        setWorkflowNodes,
        isBreakerIsolated,
        toggleBreakerIsolation,
        isWorkflowExecuting,
        testWorkflow,
        publishWorkflow,

        chatMessages,
        sendChatMessage,
        activeChatId,
        setActiveChatId,

        currentDemoStep,
        runDemoStep,
        isDemoRunning,
        startEndToEndDemo,
        resetDemo,
        isDemoModalOpen,
        setIsDemoModalOpen,

        isEvidenceModalOpen,
        setIsEvidenceModalOpen,

        isPlayingVoice,
        toggleVoicePlayback,
        voiceProgress,

        // Auth state
        user,
        isAuthenticated,
        hasSkippedAuth,
        isAuthLoaded,
        login,
        register,
        skipAuth,
        logout,

        activeTab,
        setActiveTab,
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
