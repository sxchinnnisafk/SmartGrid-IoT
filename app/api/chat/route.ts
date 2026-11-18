import { NextRequest, NextResponse } from "next/server";

interface IncomingCheckpoint {
  id: string;
  badge: string;
  name: string;
  zone: string;
  status: string;
  statusLabel: string;
  irSensor: string;
  signalRssi: number;
  patrolPasses: number;
  lastVisited: string;
}

interface IncomingHistoryItem {
  sender: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: IncomingHistoryItem[];
  roverContext?: {
    checkpoints?: IncomingCheckpoint[];
    rover?: {
      roverId: string;
      isPatrolling: boolean;
      patrolMode: string;
      currentCheckpointId: string;
      targetCheckpointId: string;
      progress: number;
      batteryLevel: number;
      speedMps: number;
      wifiRssi: number;
      irObstacleDetected: boolean;
      tftEyeState: string;
    };
    isObstacleAlertActive?: boolean;
    activeAlertsCount?: number;
  };
}

interface StructuredAIReply {
  reply: string;
  isCriticalAlert: boolean;
  recommendations?: string[];
  voicePreview?: string;
}

function parseApiKeys(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[\n,;]+/)
    .map((k) => k.trim().replace(/^["']|["']$/g, ""))
    .filter((k) => Boolean(k) && !k.startsWith("your_") && !k.includes("_here"));
}

function buildSystemPrompt(roverContext?: ChatRequestBody["roverContext"]): string {
  const checkpointsSummary =
    roverContext?.checkpoints
      ?.map(
        (cp) =>
          `- Checkpoint ${cp.badge} (${cp.name}, ${cp.zone}): Status=${cp.statusLabel}, IR_Sensor=${cp.irSensor}, WiFi_RSSI=${cp.signalRssi}dBm, PatrolPasses=${cp.patrolPasses}, LastVisited=${cp.lastVisited}`
      )
      .join("\n") ||
    "No live checkpoint telemetry attached (simulated patrol corridor only).";

  const r = roverContext?.rover;
  const roverSummary = r
    ? `${r.roverId}: patrolling=${r.isPatrolling}, mode=${r.patrolMode}, current=${r.currentCheckpointId.toUpperCase()}, target=${r.targetCheckpointId.toUpperCase()}, segmentProgress=${r.progress}%, battery=${r.batteryLevel}%, speed=${r.speedMps}m/s, wifiRssi=${r.wifiRssi}dBm, irObstacleDetected=${r.irObstacleDetected}, tftEyeState=${r.tftEyeState}`
    : "ESP32-S3 Rover R-1 (simulated standby state)";

  return `You are Celestia Rover AI, a sharp, chill, genuinely helpful AI assistant embedded in Team Celestia's Autonomous Surveillance & Patrol Robot web interface.

### CORE BEHAVIOR: THINK NATURALLY & ADAPT TO THE USER'S INTENT
Never sound robotic, preloaded, or scripted. Read what the user actually said and respond naturally by thinking through their message:

1. **CASUAL GREETINGS & SMALL TALK** (e.g., "hi", "hello", "hey", "yo", "how are you", "thanks"):
   - Give a short, chill, friendly reply (1–2 sentences max), like a real collaborator.
   - DO NOT dump robot specs, project pitches, patrol telemetry, or action lists on a greeting. Only talk about the rover or patrol paths if the user actually asks.
   - Set "isCriticalAlert": false, and omit "recommendations" and "voicePreview".

2. **ROVER STATUS, PATH MONITORING & OBSTACLE CHECKS** (ONLY when the user explicitly asks about rover status, patrol checkpoints A/B/C, obstacle alerts, or next patrol steps):
   - Report the exact rover or checkpoint status using ONLY the telemetry in context below (clearly distinguishing simulated dashboard telemetry vs. physical tabletop hardware when relevant).
   - Provide 2–4 crisp, practical operator steps in "recommendations" (e.g., pausing/routing the rover around obstructed checkpoints, inspecting the path visually, clearing obstacles before resuming full loop).
   - Optionally include a 1-sentence "voicePreview" under 20 words for ElevenLabs spoken readout.
   - Set "isCriticalAlert": true ONLY when an obstacle alert is actively blocking the inspected checkpoint or rover.

3. **PROJECT, HARDWARE, OR OPEN-ENDED QUESTIONS** (e.g., "What is this project?", "What sensors does the rover have?", "How does obstacle detection work?", "What happens if Wi-Fi drops?", or any general question):
   - Drop all rigid templates completely.
   - Think critically and answer the exact question directly, conversationally, and technically using the Project Ground Truth below when relevant.
   - Set "isCriticalAlert": false, and omit "recommendations" and "voicePreview".

### PROJECT GROUND TRUTH (USE ONLY WHEN RELEVANT TO THE USER'S QUESTION)
- **Mission**: Celestia Rover is a web command-and-monitoring interface for a 4WD ESP32-S3 mobile surveillance & patrol robot. It monitors rover status, helps operators patrol and monitor paths across 3 checkpoints (Checkpoint A: North Gate Entry, Checkpoint B: Central Corridor, Checkpoint C: Perimeter Bay), and provides AI-assisted guidance.
- **Physical Edge Hardware**: 4WD robotic rover driven by an ESP32-S3 Wi-Fi microcontroller, L298N motor driver with DC geared motors, and an SPI TFT display showing animated status eyes (PATROL_SCAN, OBSTACLE_HALT, STANDBY).
- **Sensors & Strict Hardware Honesty**:
  - **IR Obstacle Detection Module**: Emits infrared light and detects reflected IR from nearby objects in the rover's path to trigger an immediate local obstacle stop. Never claim the IR module measures distance in cm/m or temperature.
  - **Wi-Fi Telemetry Link**: Reports rover connection status, RSSI signal strength (dBm), battery percentage, speed, and checkpoint patrol progress.
  - **NO Electrical Grid or Temperature Sensors**: This surveillance robot does NOT have any voltage sensor, current sensor, power-grid sensor, or temperature sensor. Never invent or mention grid voltage, current, megawatts, transformers, or temperature readings.
- **Software & AI Stack**: Next.js web interface with live interactive patrol path map, persistent local conversation history, Google Gemini AI diagnostics, and ElevenLabs voice readout.
- **Control & Safety Boundary**: Local IR obstacle stops happen safely on the ESP32-S3 hardware. The web dashboard is strictly for patrolling control, live path monitoring, and human-in-the-loop AI advice—no automated crew dispatch or remote high-voltage switching.

### CURRENT ROVER & PATROL CONTEXT (REFERENCE ONLY WHEN ASKED ABOUT STATUS/PATH)
- Rover: ${roverSummary}
- Checkpoints:
${checkpointsSummary}
- Obstacle alert active on Checkpoint C: ${roverContext?.isObstacleAlertActive ? "YES" : "NO"}
- Active alerts count: ${roverContext?.activeAlertsCount ?? 0}

### RESPONSE FORMAT
Return ONLY valid JSON (no markdown code fences):
{
  "reply": "Your natural response text (use \\n\\n between paragraphs when helpful).",
  "isCriticalAlert": false,
  "recommendations": ["ONLY include when user explicitly asks for rover/path triage or next steps; omit otherwise"],
  "voicePreview": "ONLY include for active patrol/obstacle alerts (<20 words); omit otherwise"
}`;
}

function parseStructuredReply(rawText: string): StructuredAIReply {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<StructuredAIReply>;
    if (typeof parsed.reply === "string" && parsed.reply.trim().length > 0) {
      const recs = Array.isArray(parsed.recommendations)
        ? parsed.recommendations
            .filter((r): r is string => typeof r === "string" && r.trim().length > 0)
            .slice(0, 5)
        : undefined;
      const voice =
        typeof parsed.voicePreview === "string" && parsed.voicePreview.trim().length > 0
          ? parsed.voicePreview.trim()
          : undefined;
      return {
        reply: parsed.reply.trim(),
        isCriticalAlert: Boolean(parsed.isCriticalAlert),
        recommendations: recs && recs.length > 0 ? recs : undefined,
        voicePreview: voice,
      };
    }
  } catch {
    // Plain text response from model
  }

  return {
    reply: cleaned,
    isCriticalAlert: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const message = (body.message || "").trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(body.roverContext);
    const recentHistory = (body.history || []).slice(-10);
    const errors: string[] = [];

    // 1. Direct Google Gemini API (supports comma-separated backup keys with automatic rotation)
    const geminiKeys = parseApiKeys(process.env.GEMINI_API_KEY);
    if (geminiKeys.length > 0) {
      const primaryModel = (process.env.GEMINI_MODEL || "gemini-3.8-flash").trim();
      const candidateModels = Array.from(
        new Set([primaryModel, "gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"])
      );
      const contents = [
        ...recentHistory.map((h) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        })),
        { role: "user", parts: [{ text: message }] },
      ];

      for (const apiKey of geminiKeys) {
        let keyFailedAuthOrQuota = false;

        for (const model of candidateModels) {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
            model
          )}:generateContent?key=${encodeURIComponent(apiKey)}`;

          try {
            const res = await fetch(geminiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents,
                generationConfig: {
                  temperature: 0.4,
                  maxOutputTokens: 1024,
                  responseMimeType: "application/json",
                },
              }),
            });

            if (res.ok) {
              const data = await res.json();
              const rawText =
                data?.candidates?.[0]?.content?.parts
                  ?.map((p: { text?: string }) => p.text || "")
                  .join("") || "";

              if (rawText.trim()) {
                const structured = parseStructuredReply(rawText);
                return NextResponse.json({
                  provider: "gemini",
                  model,
                  ...structured,
                });
              }
            } else {
              const errText = await res.text().catch(() => "");
              console.error(`Gemini API error (${model}):`, res.status, errText);
              errors.push(`Gemini ${model}: HTTP ${res.status}`);

              if ([400, 401, 403, 429].includes(res.status)) {
                keyFailedAuthOrQuota = true;
                break;
              }
              if (![404, 503].includes(res.status)) break;
            }
          } catch (err) {
            console.error(`Gemini network error (${model}):`, err);
            errors.push(`Gemini ${model}: network error`);
            break;
          }
        }

        if (!keyFailedAuthOrQuota && errors.length > 0) {
          continue;
        }
      }
    }

    // 2. OpenRouter Fallback (supports comma-separated keys; prefers sk-or-* keys first)
    const rawOpenRouterKeys = parseApiKeys(process.env.OPENROUTER_API_KEY);
    const openRouterKeys = [
      ...rawOpenRouterKeys.filter((k) => k.startsWith("sk-or-")),
      ...rawOpenRouterKeys.filter((k) => !k.startsWith("sk-or-")),
    ];

    if (openRouterKeys.length > 0) {
      const primaryOrModel = (process.env.OPENROUTER_MODEL || "google/gemini-3.8-flash").trim();
      const candidateOrModels = Array.from(
        new Set([primaryOrModel, "google/gemini-3.8-flash", "google/gemini-2.5-flash", "google/gemini-2.0-flash-001"])
      );

      for (const apiKey of openRouterKeys) {
        for (const model of candidateOrModels) {
          try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
                "HTTP-Referer": "https://celestia-rover.local",
                "X-Title": "Celestia Rover",
              },
              body: JSON.stringify({
                model,
                temperature: 0.4,
                max_tokens: 1024,
                messages: [
                  { role: "system", content: systemPrompt },
                  ...recentHistory.map((h) => ({
                    role: h.sender === "user" ? "user" : "assistant",
                    content: h.content,
                  })),
                  { role: "user", content: message },
                ],
              }),
            });

            if (res.ok) {
              const data = await res.json();
              const rawText = data?.choices?.[0]?.message?.content || "";
              if (rawText.trim()) {
                const structured = parseStructuredReply(rawText);
                return NextResponse.json({
                  provider: "openrouter",
                  model,
                  ...structured,
                });
              }
            } else {
              const errText = await res.text().catch(() => "");
              console.error(`OpenRouter API error (${model}):`, res.status, errText);
              errors.push(`OpenRouter ${model}: HTTP ${res.status}`);

              if ([401, 402, 403, 429].includes(res.status)) {
                break;
              }
            }
          } catch (err) {
            console.error(`OpenRouter network error (${model}):`, err);
            errors.push(`OpenRouter ${model}: network error`);
            break;
          }
        }
      }
    }

    const detail =
      geminiKeys.length === 0 && openRouterKeys.length === 0
        ? "No GEMINI_API_KEY or OPENROUTER_API_KEY configured in server environment variables."
        : `Upstream AI providers failed (${errors.slice(0, 3).join("; ")}).`;

    return NextResponse.json({ error: detail }, { status: 502 });
  } catch (err) {
    console.error("Chat API route failure:", err);
    return NextResponse.json(
      { error: "Failed to process AI chat request." },
      { status: 500 }
    );
  }
}
