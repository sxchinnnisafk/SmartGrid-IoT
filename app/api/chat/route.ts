import { NextRequest, NextResponse } from "next/server";

interface IncomingNode {
  id: string;
  badge: string;
  name: string;
  status: string;
  statusLabel: string;
  voltage: number;
  current: number;
  powerLoad: number;
  powerLoadUnit: string;
  phaseBalance: number;
}

interface IncomingHistoryItem {
  sender: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: IncomingHistoryItem[];
  gridContext?: {
    nodes?: IncomingNode[];
    rover?: {
      isPatrolling: boolean;
      currentNodeId: string;
      targetNodeId: string;
      batteryLevel: number;
      speedMps: number;
      cameraStatus: string;
    };
    isFaultActive?: boolean;
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

function buildSystemPrompt(gridContext?: ChatRequestBody["gridContext"]): string {
  const nodesSummary =
    gridContext?.nodes
      ?.map(
        (n) =>
          `- Node ${n.badge} (${n.name}): Status=${n.statusLabel}, Voltage=${n.voltage}V, Current=${n.current}A, Load=${n.powerLoad}${n.powerLoadUnit}, PhaseBalance=${n.phaseBalance}%`
      )
      .join("\n") ||
    "No live sensor reading attached (simulated digital-twin scenario only).";

  const roverSummary = gridContext?.rover
    ? `ESP32-S3 Rover: patrolling=${gridContext.rover.isPatrolling}, current=${gridContext.rover.currentNodeId}, target=${gridContext.rover.targetNodeId}, battery=${gridContext.rover.batteryLevel}%, speed=${gridContext.rover.speedMps}m/s`
    : "ESP32-S3 Rover (simulated state)";

  return `You are SmartGrid AI, a sharp, chill, genuinely helpful AI assistant embedded in Team Celestia's SMARTGRID AIoT web app (Power Hack 2026).

### CORE BEHAVIOR: THINK NATURALLY & ADAPT TO THE USER'S INTENT
Never sound robotic, preloaded, or scripted. Read what the user actually said and respond naturally by thinking through their message:

1. **CASUAL GREETINGS & SMALL TALK** (e.g., "hi", "hello", "hey", "yo", "how are you", "thanks"):
   - Give a short, chill, friendly reply (1–2 sentences max), like a real human collaborator.
   - DO NOT dump grid details, project pitches, hardware specs, node telemetry, or action lists on a greeting. Only talk about the grid or project if the user actually asks.
   - Set "isCriticalAlert": false, and omit "recommendations" and "voicePreview".

2. **EXPLICIT NODE TRIAGE / FAULT CHECKS** (ONLY when the user specifically asks for the status, risk, or recommended response for Node A, Node B, or Node C):
   - State the node status (Normal, Warning, or Critical) using ONLY the telemetry in context below (clearly noting it is simulated digital-twin telemetry when no physical sensor reading is attached).
   - Provide concise, practical steps in "recommendations" (monitoring, rover patrol check, simulated protection/reroute review for human approval, operator inspection note — reminding that no real grid breaker is tripped automatically).
   - Optionally include a 1-sentence "voicePreview" under 20 words for ElevenLabs readout.
   - Set "isCriticalAlert": true ONLY when the inspected node is in Critical state.

3. **PROJECT, TECHNICAL, JURY, OR OPEN-ENDED QUESTIONS** (e.g., "What is this project?", "Why did you use INA219?", "How does this help BESCOM?", "What happens if Wi-Fi drops?", or any general question):
   - Drop all rigid templates completely.
   - Think critically and answer the exact question directly, conversationally, and accurately using electrical engineering reasoning and the Project Ground Truth below when relevant.
   - Set "isCriticalAlert": false, and omit "recommendations" and "voicePreview".

### PROJECT GROUND TRUTH (USE ONLY WHEN RELEVANT TO THE USER'S QUESTION)
- **Real-World Context**: Fixed DTMUs and smart meters send remote electrical alarms but cannot physically patrol yards or inspect equipment. In FY 2023–24, BESCOM spent ₹134.44 Cr repairing 36,035 faulty distribution transformers (KERC Combined Tariff Order 2025).
- **Physical Edge Hardware**: ESP32-S3 Wi-Fi mobile inspection rover with an SPI TFT status display and L298N motor driver patrolling a 3-node corridor (Node A: Residential Feeder, Node B: EV Charging Hub, Node C: Industrial Transformer).
- **Two Core Sensors**:
  1. **INA219**: I2C shunt/current and bus voltage monitor measuring our low-voltage DC demonstration circuit to calculate current and calibrated power.
  2. **IR Obstacle Module**: Emits infrared light and detects reflected IR from nearby objects to trigger an obstacle stop signal. Never claim the IR sensor measures temperature or exact distance in cm/m.
- **No Temperature Sensor**: Do not invent temperature readings—no temperature sensor is installed.
- **Cloud & AI Stack**: Telemetry streams over Wi-Fi to Next.js API routes, stores in Supabase PostgreSQL + Realtime, renders on a 3-node digital twin, and uses Gemini + ElevenLabs for diagnostics and voice playback.
- **Safety & Control Boundary**: Isolated 5V/12V DC tabletop prototype, not connected to live BESCOM mains. Strictly for patrolling, monitoring, and AI advisory—the web app never autonomously dispatches crews or trips real grid breakers; human operators review and perform actions manually.
- **Fact Integrity**: Never invent live sensor numbers. Clearly distinguish what is physically demonstrated on the low-voltage circuit vs. simulated on the digital twin.

### CURRENT DIGITAL-TWIN CONTEXT (REFERENCE ONLY WHEN ASKED ABOUT NODE/ROVER STATUS)
${nodesSummary}
- Rover: ${roverSummary}
- Simulated Node C fault active: ${gridContext?.isFaultActive ? "YES" : "NO"}
- Active alerts count: ${gridContext?.activeAlertsCount ?? 0}

### RESPONSE FORMAT
Return ONLY valid JSON (no markdown code fences):
{
  "reply": "Your natural response text (use \\n\\n between paragraphs when helpful).",
  "isCriticalAlert": false,
  "recommendations": ["ONLY include when user explicitly asks for fault triage/action steps; omit otherwise"],
  "voicePreview": "ONLY include for node fault alerts (<20 words); omit otherwise"
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
        ? parsed.recommendations.filter((r): r is string => typeof r === "string" && r.trim().length > 0).slice(0, 5)
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

    const systemPrompt = buildSystemPrompt(body.gridContext);
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

              // Auth/quota error on this key -> try next key immediately
              if ([400, 401, 403, 429].includes(res.status)) {
                keyFailedAuthOrQuota = true;
                break;
              }
              // 404/503 -> try next model on same key
              if (![404, 503].includes(res.status)) break;
            }
          } catch (err) {
            console.error(`Gemini network error (${model}):`, err);
            errors.push(`Gemini ${model}: network error`);
            break;
          }
        }

        if (!keyFailedAuthOrQuota && errors.length > 0) {
          // Still try next key if any remain
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
                "HTTP-Referer": "https://smartgrid-aiot.local",
                "X-Title": "SmartGrid AIoT",
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
                break; // Try next OpenRouter key
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

    // No hardcoded fake replies — report an honest upstream error if no AI provider succeeded
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
