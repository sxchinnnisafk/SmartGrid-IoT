"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import {
  GridNodeData,
  ThresholdConfig,
  TelemetryPoint,
  AlertTicket,
  RoverState,
  LogMessage,
  ChatMessage,
  ChatSession,
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
  isFaultActive: boolean;
  triggerFault: (active?: boolean) => void;
  rover: RoverState;
  startPatrol: () => void;
  stopPatrol: () => void;
  telemetryHistory: TelemetryPoint[];
  alerts: AlertTicket[];
  acknowledgeAlert: (id: string) => void;
  logs: LogMessage[];
  addLog: (type: LogMessage["type"], message: string, level: LogMessage["level"]) => void;
  resetSystem: () => void;

  // Chat & AI Assistant state (Gemini + OpenRouter + persistent conversation history)
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  createNewChat: () => void;
  deleteChatSession: (id: string) => void;
  isChatLoading: boolean;
  aiStatus: {
    gemini: boolean;
    elevenLabs: boolean;
    provider: string;
    model: string;
  };
  activeChatId: string;
  setActiveChatId: (id: string) => void;

  // ElevenLabs Voice Playback for AI Summaries
  isPlayingVoice: boolean;
  toggleVoicePlayback: () => void;
  voiceProgress: number;
  speakingMessageId: string | null;
  speakText: (text: string, messageId?: string) => Promise<void>;
  stopSpeaking: () => void;
  autoReadVoice: boolean;
  setAutoReadVoice: React.Dispatch<React.SetStateAction<boolean>>;

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
  activeTab: "control-room" | "chat" | "artifacts";
  setActiveTab: (tab: "control-room" | "chat" | "artifacts") => void;
}

const initialNodes: GridNodeData[] = [
  {
    id: "node-a",
    badge: "A",
    name: "Residential Feeder",
    type: "Residential Feeder",
    status: "normal",
    statusLabel: "Normal",
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
    title: "Critical Voltage Sag & Overload (194.5V / 285A)",
    timestamp: "10:24 AM",
    voltage: 194.5,
    current: 285.0,
    rootCause: "Line sensors show severe voltage sag (194.5V) and overcurrent draw (285A), exceeding safe corridor limits.",
    aiMitigation: [
      "Inspect Node C voltage sag and load readings closely in the Control Room.",
      "Pause or position the inspection rover near Node C for monitoring.",
      "Review available capacity on Node A (98 MW) and Node B (76 MW) before manual load adjustments.",
      "Notify the on-duty operator for manual substation inspection.",
    ],
    status: "ACTIVE",
  },
];

const CHAT_STORAGE_KEY = "smartgrid_chat_sessions_v1";
const ACTIVE_CHAT_STORAGE_KEY = "smartgrid_active_chat_id_v1";

function formatSessionTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "New conversation";
  return cleaned.length > 42 ? `${cleaned.slice(0, 42).trimEnd()}…` : cleaned;
}

const generateTelemetryHistory = (): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const now = Date.now();
  for (let i = 12; i >= 0; i--) {
    const d = new Date(now - i * 4000);
    points.push({
      timestamp: d.toISOString(),
      timeLabel: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      nodeAVoltage: 230 + Math.cos(i * 0.3) * 1.2,
      nodeACurrent: 48 + Math.sin(i * 0.4) * 2,
      nodeBVoltage: 218 + Math.cos(i * 0.5) * 1.8,
      nodeBCurrent: 142 + Math.sin(i * 0.2) * 4,
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
  const [isFaultActive, setIsFaultActive] = useState<boolean>(true);
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
      message: "CRITICAL: Node C Industrial Transformer voltage sagged to 194.5V (285A / 102 MW).",
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
    cameraStatus: "ONLINE",
    xPercent: 62,
    yPercent: 68,
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatIdState] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<{
    gemini: boolean;
    elevenLabs: boolean;
    provider: string;
    model: string;
  }>({
    gemini: false,
    elevenLabs: false,
    provider: "unconfigured",
    model: "unconfigured",
  });
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoReadVoice, setAutoReadVoice] = useState<boolean>(false);

  const hasLoadedChatsRef = useRef<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate saved chat history from localStorage on mount
  useEffect(() => {
    try {
      const rawSessions = localStorage.getItem(CHAT_STORAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_CHAT_STORAGE_KEY) || "";
      if (rawSessions) {
        const parsed = JSON.parse(rawSessions) as unknown;
        if (Array.isArray(parsed)) {
          const validSessions = parsed.filter(
            (s): s is ChatSession =>
              Boolean(s) &&
              typeof s === "object" &&
              typeof (s as ChatSession).id === "string" &&
              typeof (s as ChatSession).title === "string" &&
              Array.isArray((s as ChatSession).messages)
          );
          if (validSessions.length > 0) {
            setChatSessions(validSessions);
            const hasActive = validSessions.some((s) => s.id === savedActiveId);
            setActiveChatIdState(hasActive ? savedActiveId : validSessions[0].id);
          }
        }
      }
    } catch {
      // Ignore malformed storage
    } finally {
      hasLoadedChatsRef.current = true;
    }
  }, []);

  // Persist chat sessions to localStorage whenever they change
  useEffect(() => {
    if (!hasLoadedChatsRef.current) return;
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatSessions));
      if (activeChatId) {
        localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, activeChatId);
      } else {
        localStorage.removeItem(ACTIVE_CHAT_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [chatSessions, activeChatId]);

  const chatMessages = useMemo(() => {
    const active = chatSessions.find((s) => s.id === activeChatId);
    return active ? active.messages : [];
  }, [chatSessions, activeChatId]);

  // Check Gemini & ElevenLabs API configuration status once on mount
  useEffect(() => {
    let active = true;
    fetch("/api/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setAiStatus({
          gemini: Boolean(data.gemini),
          elevenLabs: Boolean(data.elevenLabs),
          provider: String(data.provider || "fallback"),
          model: String(data.model || "local-telemetry"),
        });
      })
      .catch(() => {
        // Keep safe defaults
      });
    return () => {
      active = false;
    };
  }, []);

  // Voice playback simulation
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [voiceProgress, setVoiceProgress] = useState<number>(0);

  // Active view tab: control-room | chat | artifacts
  const [activeTab, setActiveTab] = useState<"control-room" | "chat" | "artifacts">("control-room");

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

  const triggerFault = (active?: boolean) => {
    const newState = active !== undefined ? active : !isFaultActive;
    setIsFaultActive(newState);

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === "node-c") {
          return {
            ...n,
            status: newState ? "critical" : "normal",
            statusLabel: newState ? "Critical" : "Normal",
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
      addLog("ALERT", "Load fault triggered at Node C: 194.5V / 285A detected.", "error");
    } else {
      addLog("SYSTEM", "Fault cleared at Node C. Voltage and load returned to nominal.", "success");
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

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingVoice(false);
    setSpeakingMessageId(null);
    setVoiceProgress(0);
  };

  const speakText = async (text: string, messageId?: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Toggle off if already playing the same message
    if (isPlayingVoice && (!messageId || speakingMessageId === messageId)) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    setIsPlayingVoice(true);
    setSpeakingMessageId(messageId || "advisory-preview");
    setVoiceProgress(0);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText }),
      });

      if (res.ok && res.headers.get("content-type")?.includes("audio")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;

        addLog("SYSTEM", "Playing ElevenLabs synthesized voice audio.", "success");

        audio.ontimeupdate = () => {
          if (audio.duration && Number.isFinite(audio.duration)) {
            setVoiceProgress(Math.min(18, Math.round((audio.currentTime / audio.duration) * 18)));
          }
        };
        audio.onended = () => {
          stopSpeaking();
        };
        audio.onerror = () => {
          stopSpeaking();
        };

        await audio.play();
        return;
      }
    } catch {
      // Fall through to Web Speech / visual timer fallback
    }

    // Graceful fallback: Browser Web Speech API + progress timer when ELEVENLABS_API_KEY is not set
    addLog("SYSTEM", "ElevenLabs key not configured; using browser voice fallback.", "info");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.02;
      utterance.onend = () => stopSpeaking();
      utterance.onerror = () => stopSpeaking();
      window.speechSynthesis.speak(utterance);
    }

    fallbackTimerRef.current = setInterval(() => {
      setVoiceProgress((p) => {
        if (p >= 18) {
          stopSpeaking();
          return 0;
        }
        return p + 1;
      });
    }, 1000);
  };

  // Cleanup audio resources on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const setActiveChatId = (id: string) => {
    stopSpeaking();
    setActiveChatIdState(id);
  };

  const createNewChat = () => {
    stopSpeaking();
    // Reuse existing empty session if already on one
    const current = chatSessions.find((s) => s.id === activeChatId);
    if (current && current.messages.length === 0) {
      return;
    }
    const now = Date.now();
    const newSession: ChatSession = {
      id: `chat-${now}-${Math.random().toString(36).slice(2, 6)}`,
      title: "New conversation",
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveChatIdState(newSession.id);
  };

  const deleteChatSession = (id: string) => {
    if (activeChatId === id) {
      stopSpeaking();
    }
    setChatSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (activeChatId === id) {
        setActiveChatIdState(next[0]?.id || "");
      }
      return next;
    });
  };

  const sendChatMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = Date.now();
    const userMsg: ChatMessage = {
      id: `msg-${now}`,
      sender: "user",
      senderName: user?.name || "Jordan Diaz",
      avatarText: user?.avatarText || "JD",
      timestamp: new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: trimmed,
    };

    const existingSession = chatSessions.find((s) => s.id === activeChatId);
    const targetChatId = existingSession ? existingSession.id : `chat-${now}-${Math.random().toString(36).slice(2, 6)}`;
    const historyPayload = (existingSession?.messages || []).slice(-10).map((m) => ({
      sender: m.sender,
      content: m.content,
    }));

    if (existingSession) {
      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === targetChatId
            ? {
                ...s,
                title: s.messages.length === 0 || s.title === "New conversation" ? formatSessionTitle(trimmed) : s.title,
                updatedAt: now,
                messages: [...s.messages, userMsg],
              }
            : s
        )
      );
    } else {
      const newSession: ChatSession = {
        id: targetChatId,
        title: formatSessionTitle(trimmed),
        createdAt: now,
        updatedAt: now,
        messages: [userMsg],
      };
      setChatSessions((prev) => [newSession, ...prev]);
      setActiveChatIdState(targetChatId);
    }

    setIsChatLoading(true);
    addLog("SYSTEM", `Operator queried AI Assistant: "${trimmed}"`, "info");

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmed,
        history: historyPayload,
        gridContext: {
          nodes,
          rover,
          isFaultActive,
          activeAlertsCount: alerts.filter((a) => a.status === "ACTIVE").length,
        },
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        return data;
      })
      .then((data) => {
        const replyText =
          typeof data.reply === "string" && data.reply.trim()
            ? data.reply.trim()
            : "";

        if (!replyText) {
          throw new Error("Empty response from AI server.");
        }

        const replyTime = Date.now();
        const aiMsgId = `msg-${replyTime + 1}`;
        const voicePreview =
          typeof data.voicePreview === "string" && data.voicePreview.trim()
            ? data.voicePreview.trim()
            : undefined;
        const aiMsg: ChatMessage = {
          id: aiMsgId,
          sender: "assistant",
          senderName: data.provider === "gemini" ? "SmartGrid AI (Gemini)" : "SmartGrid AI",
          timestamp: new Date(replyTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          content: replyText,
          isCriticalAlert: Boolean(data.isCriticalAlert),
          recommendations: Array.isArray(data.recommendations) && data.recommendations.length > 0
            ? data.recommendations
            : undefined,
          voicePreview,
          model: typeof data.model === "string" ? data.model : undefined,
        };

        setChatSessions((prev) =>
          prev.map((s) =>
            s.id === targetChatId
              ? { ...s, updatedAt: replyTime, messages: [...s.messages, aiMsg] }
              : s
          )
        );
        if (data.provider === "gemini" || data.provider === "openrouter") {
          addLog("SYSTEM", `AI reply generated via ${data.provider} (${data.model}).`, "success");
        }
        if (autoReadVoice) {
          void speakText(voicePreview || replyText, aiMsgId);
        }
      })
      .catch((err: unknown) => {
        const errTime = Date.now();
        const errMsg = err instanceof Error ? err.message : "Could not reach AI server.";
        const errorChatMsg: ChatMessage = {
          id: `msg-${errTime + 1}`,
          sender: "assistant",
          senderName: "SmartGrid AI",
          timestamp: new Date(errTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          content: `AI server error: ${errMsg}`,
        };
        setChatSessions((prev) =>
          prev.map((s) =>
            s.id === targetChatId
              ? { ...s, updatedAt: errTime, messages: [...s.messages, errorChatMsg] }
              : s
          )
        );
        addLog("SYSTEM", `AI chat request failed: ${errMsg}`, "error");
      })
      .finally(() => {
        setIsChatLoading(false);
      });
  };

  // Voice alert summary player (uses ElevenLabs API when configured)
  const toggleVoicePlayback = () => {
    if (isPlayingVoice) {
      stopSpeaking();
      return;
    }
    const nodeC = nodes.find((n) => n.id === "node-c");
    const summaryScript = `Monitoring alert for Node C Industrial Transformer. Voltage has dropped to ${
      nodeC?.voltage ?? 194.5
    } volts under ${nodeC?.powerLoad ?? 102} megawatts load. Review AI Assistant recommendations for manual inspection and load checks.`;
    void speakText(summaryScript, "advisory-preview");
  };

  const resetSystem = () => {
    setNodes(initialNodes);
    setIsFaultActive(true);
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
      cameraStatus: "ONLINE",
      xPercent: 62,
      yPercent: 68,
    });
    addLog("SYSTEM", "System reset to default state.", "info");
  };

  // Periodic simulated telemetry jitter (pauses automatically when tab is hidden)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOffline || (typeof document !== "undefined" && document.hidden)) return;

      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          voltage: Number((node.voltage + (Math.random() - 0.5) * 0.4).toFixed(1)),
          current: Number((node.current + (Math.random() - 0.5) * 0.8).toFixed(1)),
        }))
      );

      setTelemetryHistory((prev) => {
        const newPoint: TelemetryPoint = {
          timestamp: now.toISOString(),
          timeLabel,
          nodeAVoltage: 230.2,
          nodeACurrent: 48.4,
          nodeBVoltage: 218.7,
          nodeBCurrent: 142.6,
          nodeCVoltage: isFaultActive ? 194.5 : 229.0,
          nodeCCurrent: isFaultActive ? 285.0 : 155.0,
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
  }, [isOffline, isFaultActive, rover.isPatrolling]);

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
        isFaultActive,
        triggerFault,
        rover,
        startPatrol,
        stopPatrol,
        telemetryHistory,
        alerts,
        acknowledgeAlert,
        logs,
        addLog,
        resetSystem,

        chatSessions,
        chatMessages,
        sendChatMessage,
        createNewChat,
        deleteChatSession,
        isChatLoading,
        aiStatus,
        activeChatId,
        setActiveChatId,

        isPlayingVoice,
        toggleVoicePlayback,
        voiceProgress,
        speakingMessageId,
        speakText,
        stopSpeaking,
        autoReadVoice,
        setAutoReadVoice,

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
