export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarText: string;
  isGuest: boolean;
}

export type NodeStatus = "normal" | "warning" | "critical";

export interface GridNodeData {
  id: string;
  name: string;
  badge: "A" | "B" | "C";
  type: "Residential Feeder" | "EV Charging Hub" | "Industrial Transformer";
  status: NodeStatus;
  statusLabel: "Normal" | "Warning" | "Critical";
  voltage: number;     // V
  current: number;     // A
  powerLoad: number;   // kW or MW
  powerLoadUnit: "kW" | "MW";
  phaseBalance: number;// %
  oilLevel?: number;   // % (for transformer)
  activeEVs?: number;  // count (for EV hub)
  householdCount?: number; // count (for feeder)
  location: string;
  lastUpdated: string;
  description: string;
  subDescription: string;
}

export interface ThresholdConfig {
  voltageMin: number;
  voltageMax: number;
  currentMax: number;
}

export interface TelemetryPoint {
  timestamp: string;
  timeLabel: string;
  nodeAVoltage: number;
  nodeACurrent: number;
  nodeBVoltage: number;
  nodeBCurrent: number;
  nodeCVoltage: number;
  nodeCCurrent: number;
}

export interface AlertTicket {
  id: string;
  nodeId: string;
  nodeName: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  timestamp: string;
  voltage: number;
  current: number;
  rootCause: string;
  aiMitigation: string[];
  status: "ACTIVE" | "ACKNOWLEDGED" | "DISPATCHED" | "RESOLVED";
}

export interface RoverState {
  isPatrolling: boolean;
  currentNodeId: string;
  targetNodeId: string;
  progress: number; // 0 to 100
  batteryLevel: number;
  patrolMode: "Full Network Sweep" | "Targeted Diagnostic" | "Emergency Inspection" | "Autonomous Inspection";
  speedMps: number;
  roverId: string;
  cameraStatus: "ONLINE" | "OFFLINE";
  xPercent: number; // position on map
  yPercent: number;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  type: "MQTT" | "SYSTEM" | "ROVER" | "ALERT" | "HTTP";
  message: string;
  level: "info" | "warn" | "error" | "success";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  senderName: string;
  avatarText?: string;
  timestamp: string;
  content: string;
  isCriticalAlert?: boolean;
  recommendations?: string[];
}
