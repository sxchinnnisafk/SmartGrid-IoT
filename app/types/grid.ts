export type NodeStatus = "normal" | "warning" | "critical";

export interface GridNodeData {
  id: string;
  name: string;
  type: "Residential Feeder" | "EV Charging Hub" | "Industrial Transformer";
  status: NodeStatus;
  temperature: number; // °C
  voltage: number;     // V
  current: number;     // A
  powerLoad: number;   // kW
  phaseBalance: number;// %
  oilLevel?: number;   // % (for transformer)
  activeEVs?: number;  // count (for EV hub)
  householdCount?: number; // count (for feeder)
  location: string;
  lastUpdated: string;
  description: string;
}

export interface ThresholdConfig {
  tempWarning: number;
  tempCritical: number;
  voltageMin: number;
  voltageMax: number;
  currentMax: number;
}

export interface TelemetryPoint {
  timestamp: string;
  timeLabel: string;
  nodeATemp: number;
  nodeAVoltage: number;
  nodeACurrent: number;
  nodeBTemp: number;
  nodeBVoltage: number;
  nodeBCurrent: number;
  nodeCTemp: number;
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
  temperature: number;
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
  patrolMode: "Full Network Sweep" | "Targeted Diagnostic" | "Emergency Inspection";
  speedMps: number;
  roverId: string;
  cameraStatus: "ONLINE" | "THERMAL_ACTIVE" | "OFFLINE";
}

export interface LogMessage {
  id: string;
  timestamp: string;
  type: "MQTT" | "SYSTEM" | "ROVER" | "ALERT" | "HTTP";
  message: string;
  level: "info" | "warn" | "error" | "success";
}
