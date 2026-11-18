export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarText: string;
  isGuest: boolean;
}

export type CheckpointStatus = "clear" | "watch" | "alert";

export interface PatrolCheckpoint {
  id: string;
  name: string;
  badge: "A" | "B" | "C";
  zone: "Entry Perimeter" | "Main Walkway" | "Rear Sector";
  status: CheckpointStatus;
  statusLabel: "Clear" | "Watch" | "Alert";
  irSensor: "CLEAR" | "OBSTACLE";
  signalRssi: number; // dBm
  patrolPasses: number;
  lastVisited: string;
  location: string;
  description: string;
  subDescription: string;
}

export interface AlertTicket {
  id: string;
  checkpointId: string;
  checkpointName: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  timestamp: string;
  irSensor: "CLEAR" | "OBSTACLE";
  signalRssi: number;
  details: string;
  recommendations: string[];
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
}

export interface RoverState {
  isPatrolling: boolean;
  currentCheckpointId: string;
  targetCheckpointId: string;
  progress: number; // 0 to 100 along current segment
  batteryLevel: number; // %
  patrolMode: "Full Path Loop" | "Targeted Check" | "Obstacle Hold" | "Standby";
  speedMps: number;
  roverId: string;
  wifiRssi: number; // dBm
  irObstacleDetected: boolean;
  tftEyeState: "PATROL_SCAN" | "OBSTACLE_HALT" | "STANDBY";
  xPercent: number; // horizontal position on patrol map
  yPercent: number; // vertical position on patrol map
}

export interface LogMessage {
  id: string;
  timestamp: string;
  type: "ROVER" | "PATH" | "ALERT" | "SYSTEM" | "WIFI";
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
  voicePreview?: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}
