"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import {
  PatrolCheckpoint,
  AlertTicket,
  RoverState,
  LogMessage,
  ChatMessage,
  ChatSession,
  UserProfile,
} from "../types/grid";
import { getControlRoomPercent } from "../lib/patrolPath";

interface RoverContextType {
  checkpoints: PatrolCheckpoint[];
  selectedCheckpointId: string;
  setSelectedCheckpointId: (id: string) => void;
  selectedCheckpoint: PatrolCheckpoint;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isObstacleAlertActive: boolean;
  triggerObstacleAlert: (active?: boolean) => void;
  rover: RoverState;
  isHardwareLive: boolean;
  startPatrol: () => void;
  stopPatrol: () => void;
  routeRoverTo: (checkpointId: string) => void;
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

  // Active view tab
  activeTab: "control-room" | "chat" | "artifacts";
  setActiveTab: (tab: "control-room" | "chat" | "artifacts") => void;
}

const initialCheckpoints: PatrolCheckpoint[] = [
  {
    id: "cp-a",
    badge: "A",
    name: "North Gate Entry",
    zone: "Entry Perimeter",
    status: "clear",
    statusLabel: "Clear",
    irSensor: "CLEAR",
    signalRssi: -54,
    patrolPasses: 14,
    lastVisited: "10:21 AM",
    location: "Sector 1 — Main Gate Approach",
    description: "Entry path unobstructed. Clear IR sweep.",
    subDescription: "Gate Corridor • Clear Path",
  },
  {
    id: "cp-b",
    badge: "B",
    name: "Central Corridor",
    zone: "Main Walkway",
    status: "watch",
    statusLabel: "Watch",
    irSensor: "CLEAR",
    signalRssi: -61,
    patrolPasses: 12,
    lastVisited: "10:23 AM",
    location: "Sector 2 — High-Footfall Passage",
    description: "Active walkway watch. Monitoring closely.",
    subDescription: "Mid-Path • Active Watch",
  },
  {
    id: "cp-c",
    badge: "C",
    name: "Perimeter Bay",
    zone: "Rear Sector",
    status: "clear",
    statusLabel: "Clear",
    irSensor: "CLEAR",
    signalRssi: -65,
    patrolPasses: 9,
    lastVisited: "10:24 AM",
    location: "Sector 3 — Rear Perimeter Turnaround",
    description: "Perimeter Bay clear. Normal patrol sweep.",
    subDescription: "Rear Bay • Clear Path",
  },
];

const initialAlerts: AlertTicket[] = [];

const CHAT_STORAGE_KEY = "celestia_rover_chat_sessions_v1";
const ACTIVE_CHAT_STORAGE_KEY = "celestia_rover_active_chat_id_v1";

function formatSessionTitle(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "New conversation";
  return cleaned.length > 42 ? `${cleaned.slice(0, 42).trimEnd()}…` : cleaned;
}

const GridContext = createContext<RoverContextType | undefined>(undefined);

export function GridProvider({ children }: { children: React.ReactNode }) {
  const [checkpoints, setCheckpoints] = useState<PatrolCheckpoint[]>(initialCheckpoints);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string>("cp-a");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isObstacleAlertActive, setIsObstacleAlertActive] = useState<boolean>(false);
  const [isHardwareLive, setIsHardwareLive] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertTicket[]>(initialAlerts);
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: "log-1",
      timestamp: "10:22 AM",
      type: "WIFI",
      message: "ESP32-S3 Rover R-1 connected via Wi-Fi telemetry link (-58 dBm).",
      level: "success",
    },
    {
      id: "log-2",
      timestamp: "10:24 AM",
      type: "ROVER",
      message: "Autonomous patrol loop active across Checkpoints A → B → C.",
      level: "info",
    },
  ]);

  const initialPos = getControlRoomPercent("cp-a", "cp-b", 25);
  const [rover, setRover] = useState<RoverState>({
    isPatrolling: true,
    currentCheckpointId: "cp-a",
    targetCheckpointId: "cp-b",
    progress: 25,
    batteryLevel: 89,
    patrolMode: "Full Path Loop",
    speedMps: 1.4,
    roverId: "ESP32-S3 Rover R-1",
    wifiRssi: -58,
    irObstacleDetected: false,
    tftEyeState: "PATROL_SCAN",
    xPercent: initialPos.xPercent,
    yPercent: initialPos.yPercent,
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
          provider: String(data.provider || "unconfigured"),
          model: String(data.model || "unconfigured"),
        });
      })
      .catch(() => {
        // Keep safe defaults
      });
    return () => {
      active = false;
    };
  }, []);

  // Voice playback state
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [voiceProgress, setVoiceProgress] = useState<number>(0);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"control-room" | "chat" | "artifacts">("control-room");

  // User profile & Auth gate state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasSkippedAuth, setHasSkippedAuth] = useState<boolean>(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);

  // Clear stale auth storage on startup so visiting presents the Sign In gate cleanly
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

  const addLog = (type: LogMessage["type"], message: string, level: LogMessage["level"]) => {
    const newLog: LogMessage = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type,
      message,
      level,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  const login = (email: string, name?: string, role?: string) => {
    const displayName = name || (email.includes("@") ? email.split("@")[0] : "Jordan Diaz");
    const avatar =
      displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "JD";
    const newUser: UserProfile = {
      name: displayName,
      email,
      role: role || "Patrol Operations",
      avatarText: avatar,
      isGuest: false,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setHasSkippedAuth(false);
    addLog("SYSTEM", `Operator ${displayName} (${newUser.role}) authenticated.`, "success");
  };

  const register = (name: string, email: string, role?: string) => {
    login(email, name, role || "Patrol Operations Lead");
  };

  const skipAuth = () => {
    const guestUser: UserProfile = {
      name: "Guest Operator",
      email: "guest@celestiarover.io",
      role: "Observer Access",
      avatarText: "GO",
      isGuest: true,
    };
    setUser(guestUser);
    setHasSkippedAuth(true);
    setIsAuthenticated(false);
    addLog("SYSTEM", "Guest operator access granted. Rover patrol view unlocked.", "info");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setHasSkippedAuth(false);
    addLog("SYSTEM", "Operator signed out. Console locked.", "warn");
  };

  const selectedCheckpoint =
    checkpoints.find((c) => c.id === selectedCheckpointId) || checkpoints[2];

  const triggerObstacleAlert = (active?: boolean) => {
    const newState = active !== undefined ? active : !isObstacleAlertActive;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setIsObstacleAlertActive(newState);

    setCheckpoints((prev) =>
      prev.map((cp) => {
        if (cp.id === "cp-c") {
          return {
            ...cp,
            status: newState ? "alert" : "clear",
            statusLabel: newState ? "Alert" : "Clear",
            irSensor: newState ? "OBSTACLE" : "CLEAR",
            lastVisited: timeStr,
            description: newState
              ? "IR obstacle detected on patrol path."
              : "Perimeter Bay clear. Normal patrol sweep.",
            subDescription: newState ? "Rear Bay • Obstacle Detected" : "Rear Bay • Clear Path",
          };
        }
        return cp;
      })
    );

    if (newState) {
      setRover((prev) => ({
        ...prev,
        isPatrolling: false,
        patrolMode: "Obstacle Hold",
        speedMps: 0,
        irObstacleDetected: true,
        tftEyeState: "OBSTACLE_HALT",
      }));
      setAlerts((prev) => {
        const hasActive = prev.some((a) => a.checkpointId === "cp-c" && a.status === "ACTIVE");
        if (hasActive) return prev;
        return [
          {
            id: `ALT-${Math.floor(4000 + Math.random() * 5000)}`,
            checkpointId: "cp-c",
            checkpointName: "Checkpoint C: Perimeter Bay",
            severity: "CRITICAL",
            title: "IR Obstacle Detected Along Perimeter Bay Path",
            timestamp: timeStr,
            irSensor: "OBSTACLE",
            signalRssi: -67,
            details: "ESP32-S3 IR obstacle module detected an obstruction at Checkpoint C and engaged local obstacle hold.",
            recommendations: [
              "Inspect the Perimeter Bay corridor visually before resuming travel past Checkpoint C.",
              "Route ESP32-S3 Rover R-1 to Checkpoint A or B while Checkpoint C is obstructed.",
              "Clear the obstacle alert once the path is confirmed clear.",
            ],
            status: "ACTIVE",
          },
          ...prev,
        ];
      });
      addLog("ALERT", "IR obstacle detected at Checkpoint C (Perimeter Bay). Rover engaged local hold.", "error");
    } else {
      setRover((prev) => ({
        ...prev,
        irObstacleDetected: false,
        patrolMode: prev.isPatrolling ? "Full Path Loop" : "Standby",
        tftEyeState: prev.isPatrolling ? "PATROL_SCAN" : "STANDBY",
      }));
      setAlerts((prev) =>
        prev.map((a) => (a.checkpointId === "cp-c" ? { ...a, status: "RESOLVED" as const } : a))
      );
      addLog("PATH", "Obstacle cleared at Checkpoint C. Path ready for rover patrol.", "success");
    }
  };

  const startPatrol = () => {
    setRover((prev) => {
      // If Checkpoint C is obstructed, safely patrol between clear Checkpoints A and B
      const safeTarget =
        isObstacleAlertActive && prev.targetCheckpointId === "cp-c" ? "cp-a" : prev.targetCheckpointId;
      return {
        ...prev,
        isPatrolling: true,
        targetCheckpointId: safeTarget,
        patrolMode: isObstacleAlertActive ? "Targeted Check" : "Full Path Loop",
        speedMps: 1.4,
        irObstacleDetected: false,
        tftEyeState: "PATROL_SCAN",
      };
    });
    addLog(
      "ROVER",
      isObstacleAlertActive
        ? "ESP32-S3 Rover R-1 resumed patrol on clear path segments (avoiding obstructed Checkpoint C)."
        : "ESP32-S3 Rover R-1 patrol started across Checkpoints A → B → C.",
      "success"
    );
  };

  const stopPatrol = () => {
    setRover((prev) => ({
      ...prev,
      isPatrolling: false,
      patrolMode: "Standby",
      speedMps: 0,
      tftEyeState: "STANDBY",
    }));
    addLog("ROVER", "ESP32-S3 Rover R-1 paused in standby mode.", "warn");
  };

  const routeRoverTo = (checkpointId: string) => {
    const target = checkpoints.find((c) => c.id === checkpointId);
    if (!target) return;
    setSelectedCheckpointId(checkpointId);

    if (target.irSensor === "OBSTACLE") {
      setRover((prev) => ({
        ...prev,
        isPatrolling: false,
        targetCheckpointId: checkpointId,
        patrolMode: "Obstacle Hold",
        speedMps: 0,
        irObstacleDetected: true,
        tftEyeState: "OBSTACLE_HALT",
      }));
      addLog(
        "ALERT",
        `Cannot advance into ${target.name} (${target.badge}) while IR obstacle is active. Rover holding position.`,
        "warn"
      );
      return;
    }

    setRover((prev) => {
      const nextPos = getControlRoomPercent(prev.currentCheckpointId, checkpointId, 0);
      return {
        ...prev,
        isPatrolling: true,
        targetCheckpointId: checkpointId,
        progress: prev.currentCheckpointId === checkpointId ? 100 : 0,
        patrolMode: "Targeted Check",
        speedMps: 1.5,
        irObstacleDetected: false,
        tftEyeState: "PATROL_SCAN",
        xPercent: nextPos.xPercent,
        yPercent: nextPos.yPercent,
      };
    });
    addLog("ROVER", `Routing ESP32-S3 Rover R-1 to Checkpoint ${target.badge}: ${target.name}.`, "success");
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" as const } : a))
    );
    addLog("SYSTEM", `Alert ${id} acknowledged by operator.`, "info");
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

        addLog("SYSTEM", "Playing ElevenLabs synthesized voice alert.", "success");

        audio.ontimeupdate = () => {
          if (audio.duration && Number.isFinite(audio.duration)) {
            setVoiceProgress(Math.min(100, Math.round((audio.currentTime / audio.duration) * 100)));
          }
        };
        audio.onended = () => stopSpeaking();
        audio.onerror = () => stopSpeaking();

        await audio.play();
        return;
      }
    } catch {
      // Fall through to browser Web Speech fallback
    }

    addLog("SYSTEM", "Using browser voice fallback for spoken alert.", "info");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.02;
      utterance.onend = () => stopSpeaking();
      utterance.onerror = () => stopSpeaking();
      window.speechSynthesis.speak(utterance);
    }

    fallbackTimerRef.current = setInterval(() => {
      setVoiceProgress((p) => {
        if (p >= 100) {
          stopSpeaking();
          return 0;
        }
        return p + 10;
      });
    }, 600);
  };

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
    const targetChatId = existingSession
      ? existingSession.id
      : `chat-${now}-${Math.random().toString(36).slice(2, 6)}`;
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
                title:
                  s.messages.length === 0 || s.title === "New conversation"
                    ? formatSessionTitle(trimmed)
                    : s.title,
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
    addLog("SYSTEM", `Operator queried Rover AI: "${trimmed}"`, "info");

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: trimmed,
        history: historyPayload,
        roverContext: {
          checkpoints,
          rover,
          isObstacleAlertActive,
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
          typeof data.reply === "string" && data.reply.trim() ? data.reply.trim() : "";

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
          senderName: data.provider === "gemini" ? "Rover AI (Gemini)" : "Rover AI",
          timestamp: new Date(replyTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          content: replyText,
          isCriticalAlert: Boolean(data.isCriticalAlert),
          recommendations:
            Array.isArray(data.recommendations) && data.recommendations.length > 0
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
          senderName: "Rover AI",
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

  // Voice patrol alert preview player
  const toggleVoicePlayback = () => {
    if (isPlayingVoice) {
      stopSpeaking();
      return;
    }
    const summaryScript = isObstacleAlertActive
      ? `Patrol alert for ESP32-S3 Rover R-1. IR obstacle detected at Checkpoint C Perimeter Bay. Rover is holding position with ${rover.batteryLevel} percent battery. Check the corridor before resuming patrol.`
      : `ESP32-S3 Rover R-1 status nominal. All three patrol checkpoints are clear with ${rover.batteryLevel} percent battery and active Wi-Fi telemetry.`;
    void speakText(summaryScript, "advisory-preview");
  };

  const resetSystem = () => {
    const startPos = getControlRoomPercent("cp-a", "cp-b", 25);
    setCheckpoints(initialCheckpoints);
    setIsObstacleAlertActive(false);
    setIsOffline(false);
    setAlerts(initialAlerts);
    setRover({
      isPatrolling: true,
      currentCheckpointId: "cp-a",
      targetCheckpointId: "cp-b",
      progress: 25,
      batteryLevel: 89,
      patrolMode: "Full Path Loop",
      speedMps: 1.4,
      roverId: "ESP32-S3 Rover R-1",
      wifiRssi: -58,
      irObstacleDetected: false,
      tftEyeState: "PATROL_SCAN",
      xPercent: startPos.xPercent,
      yPercent: startPos.yPercent,
    });
    addLog("SYSTEM", "Surveillance rover system reset to active patrol loop.", "info");
  };

  // Poll /api/rover/telemetry so real ESP32-S3 hardware seamlessly takes over live position when connected
  useEffect(() => {
    let active = true;
    const pollHardware = async () => {
      if (isOffline || (typeof document !== "undefined" && document.hidden)) return;
      try {
        const res = await fetch("/api/rover/telemetry", { cache: "no-store" });
        if (!active || !res.ok) return;
        const data = await res.json();
        if (!active) return;

        if (data?.live && data?.telemetry) {
          const t = data.telemetry;
          setIsHardwareLive(true);
          const pos =
            typeof t.xPercent === "number" && typeof t.yPercent === "number"
              ? { xPercent: t.xPercent, yPercent: t.yPercent }
              : getControlRoomPercent(t.currentCheckpointId, t.targetCheckpointId, t.progress);

          setRover((prev) => ({
            ...prev,
            roverId: t.roverId || prev.roverId,
            isPatrolling: Boolean(t.isPatrolling),
            currentCheckpointId: t.currentCheckpointId,
            targetCheckpointId: t.targetCheckpointId,
            progress: t.progress,
            batteryLevel: t.batteryLevel,
            speedMps: t.speedMps,
            wifiRssi: t.wifiRssi,
            irObstacleDetected: Boolean(t.irObstacleDetected),
            tftEyeState: t.tftEyeState || prev.tftEyeState,
            patrolMode: t.irObstacleDetected
              ? "Obstacle Hold"
              : t.isPatrolling
              ? "Full Path Loop"
              : "Standby",
            xPercent: pos.xPercent,
            yPercent: pos.yPercent,
          }));
        } else {
          setIsHardwareLive(false);
        }
      } catch {
        // Keep local simulation active
      }
    };

    void pollHardware();
    const hwInterval = setInterval(pollHardware, 1500);
    return () => {
      active = false;
      clearInterval(hwInterval);
    };
  }, [isOffline]);

  // Smooth node-to-node rover travel loop (250ms tick along exact Bezier path segments)
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (isOffline || isHardwareLive || (typeof document !== "undefined" && document.hidden)) return;

      setRover((prev) => {
        if (!prev.isPatrolling) return prev;

        const nextProgress = prev.progress + 3;
        if (nextProgress >= 100) {
          const arrivedId = prev.targetCheckpointId;
          const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          setCheckpoints((cps) =>
            cps.map((cp) =>
              cp.id === arrivedId
                ? { ...cp, patrolPasses: cp.patrolPasses + 1, lastVisited: timeStr }
                : cp
            )
          );

          const seq = isObstacleAlertActive ? ["cp-a", "cp-b"] : ["cp-a", "cp-b", "cp-c"];
          const currIdx = seq.indexOf(arrivedId);
          const nextTarget = seq[(currIdx + 1) % seq.length];
          const anchorPos = getControlRoomPercent(arrivedId, nextTarget, 0);

          return {
            ...prev,
            currentCheckpointId: arrivedId,
            targetCheckpointId: nextTarget,
            progress: 0,
            xPercent: anchorPos.xPercent,
            yPercent: anchorPos.yPercent,
          };
        }

        const pos = getControlRoomPercent(prev.currentCheckpointId, prev.targetCheckpointId, nextProgress);
        return {
          ...prev,
          progress: nextProgress,
          xPercent: pos.xPercent,
          yPercent: pos.yPercent,
        };
      });
    }, 250);

    // Periodic gentle Wi-Fi RSSI telemetry jitter every 2.5s
    const rssiInterval = setInterval(() => {
      if (isOffline || isHardwareLive || (typeof document !== "undefined" && document.hidden)) return;

      setCheckpoints((prev) =>
        prev.map((cp) => {
          const delta = Math.round((Math.random() - 0.5) * 2);
          return { ...cp, signalRssi: Math.max(-78, Math.min(-48, cp.signalRssi + delta)) };
        })
      );
      setRover((prev) => ({
        ...prev,
        wifiRssi: Math.max(-76, Math.min(-48, prev.wifiRssi + Math.round((Math.random() - 0.5) * 2))),
      }));
    }, 2500);

    return () => {
      clearInterval(moveInterval);
      clearInterval(rssiInterval);
    };
  }, [isOffline, isObstacleAlertActive, isHardwareLive]);

  return (
    <GridContext.Provider
      value={{
        checkpoints,
        selectedCheckpointId,
        setSelectedCheckpointId,
        selectedCheckpoint,
        isOffline,
        setIsOffline,
        isObstacleAlertActive,
        triggerObstacleAlert,
        rover,
        isHardwareLive,
        startPatrol,
        stopPatrol,
        routeRoverTo,
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
