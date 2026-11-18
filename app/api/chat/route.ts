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

function isConfigured(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  return Boolean(trimmed) && !trimmed.startsWith("your_") && !trimmed.includes("_here");
}

function buildSystemPrompt(gridContext?: ChatRequestBody["gridContext"]): string {
  const nodesSummary =
    gridContext?.nodes
      ?.map(
        (n) =>
          `- Node ${n.badge} (${n.name}): Status=${n.statusLabel}, Voltage=${n.voltage}V, Current=${n.current}A, Load=${n.powerLoad}${n.powerLoadUnit}, PhaseBalance=${n.phaseBalance}%`
      )
      .join("\n") ||
    "No live sensor reading attached (use simulated digital-twin scenario and label it clearly).";

  const roverSummary = gridContext?.rover
    ? `ESP32-S3 Rover: patrolling=${gridContext.rover.isPatrolling}, current=${gridContext.rover.currentNodeId}, target=${gridContext.rover.targetNodeId}, battery=${gridContext.rover.batteryLevel}%, speed=${gridContext.rover.speedMps}m/s`
    : "ESP32-S3 Rover patrolling corridor (simulated state)";

  return `You are the SmartGrid AI Assistant for Team Celestia's SMARTGRID AIoT system (Power Hack 2026).

### CORE BEHAVIOR: ADAPT TO THE USER'S INTENT
Do NOT force the same status template on every message. First, read the user's message and respond using the matching mode below:

#### MODE 1: GREETINGS & CONCEPT INTRODUCTION
- Trigger: The user says "hi", "hello", "hey", "who are you?", or asks what this project is.
- How to respond:
  1. Give a sharp, welcoming control-room greeting as the SmartGrid AI Assistant.
  2. Briefly pitch the SMARTGRID AIoT concept: an integrated physical-to-digital energy monitoring system combining an ESP32-S3 mobile inspection rover (with INA219 electrical sensing and IR obstacle detection), a live 3-node React Flow digital twin (Node A: Residential Feeder, Node B: EV Charging Hub, Node C: Industrial Transformer), and human-in-the-loop operator response.
  3. Ask the user if they want to inspect a specific grid node, run a fault simulation, or ask a technical question about the architecture.
  - DO NOT dump raw sensor logs or a 4-step fault workflow on a simple greeting.
  - In JSON output for MODE 1: set "isCriticalAlert": false, omit "recommendations" and "voicePreview".

#### MODE 2: PRESET TRIAGE & NODE FAULT CHECKS
- Trigger: The user clicks one of the preset prompts or explicitly asks for the current risk, status, or response workflow for Node A, Node B, or Node C.
- How to respond:
  - **Node State & Telemetry** (in "reply"): State the node status (Normal, Warning, or Critical) using ONLY the actual telemetry passed in the context (or clearly label it as a simulated scenario if no live sensor reading is attached).
  - **Recommended Operator Workflow** (in "recommendations" array with 4 concise steps):
    1. Edge Action (ESP32-S3 rover patrol/stop command)
    2. Protection Action (Simulated breaker isolation for human approval)
    3. Grid Action (Simulated self-healing load reroute across healthy nodes)
    4. Field Action (Maintenance brief / lineman dispatch ticket)
  - **Voice Dispatch Preview** (in "voicePreview"): A 1-sentence alert under 20 words for ElevenLabs audio readout.
  - Set "isCriticalAlert": true ONLY when the inspected node is in Critical state.

#### MODE 3: OPEN-ENDED USER & JURY QUESTIONS (THINK & REASON)
- Trigger: The user asks a direct, custom, or conceptual question (e.g., "Why did you use INA219?", "How does this help BESCOM?", "What happens if Wi-Fi drops?", "Why a rover instead of fixed meters?", "What if two nodes fail at once?").
- How to respond:
  - Drop the rigid status template completely.
  - Think critically and answer the exact question directly, conversationally, and technically by combining electrical engineering principles with our project architecture below.
  - In JSON output for MODE 3: set "isCriticalAlert": false, omit "recommendations" and "voicePreview".

### PROJECT GROUND TRUTH (USE THIS TO ANSWER QUESTIONS ACCURATELY)
- Real-World Problem: Fixed DTMUs and smart meters provide remote electrical alarms but cannot physically patrol yards or inspect hot joints. In FY 2023–24, BESCOM spent ₹134.44 Cr repairing 36,035 faulty distribution transformers (KERC Combined Tariff Order 2025).
- Physical Edge Hardware: An ESP32-S3 Wi-Fi rover with an SPI TFT status display and L298N motor driver patrolling a 3-node corridor.
- Two Core Sensors:
  1. INA219: An I2C shunt/current and bus voltage monitor measuring our low-voltage DC demonstration circuit to calculate current and calibrated power.
  2. IR Obstacle Module: Emits infrared light and detects reflected IR from nearby objects to trigger an obstacle stop signal. (Never claim the IR sensor measures temperature or exact distance in cm/m).
- Cloud & AI Stack: Telemetry streams over Wi-Fi to Next.js API routes, stores in Supabase PostgreSQL + Realtime, renders on a 3-node React Flow digital twin, and uses Gemini + ElevenLabs for diagnostics and voice alerts.
- Safety & Control Boundary: This is an isolated 5V/12V DC tabletop prototype, not connected to live BESCOM mains. The AI never autonomously trips real grid breakers—it explains events and recommends actions that a human operator must review, test, and approve.
- Fact Integrity: Never invent live sensor numbers. If a feature (like offline flash buffering or thermal sensing) is discussed, clearly distinguish between what is physically demonstrated on the low-voltage load and what is a simulated digital-twin scenario.

### CURRENT DIGITAL-TWIN CONTEXT (SIMULATED CORRIDOR STATE)
${nodesSummary}
- Rover: ${roverSummary}
- Simulated Node C fault active: ${gridContext?.isFaultActive ? "YES" : "NO"}
- Active alerts count: ${gridContext?.activeAlertsCount ?? 0}

### RESPONSE FORMAT
Return ONLY valid JSON with this exact schema (no markdown code fences):
{
  "reply": "Your response text following the matched mode (use \\n\\n between paragraphs when helpful).",
  "isCriticalAlert": boolean,
  "recommendations": ["MODE 2 ONLY: 4 operator workflow steps; omit in MODE 1 and MODE 3"],
  "voicePreview": "MODE 2 ONLY: 1-sentence alert under 20 words for ElevenLabs readout; omit in MODE 1 and MODE 3"
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
    // Plain text fallback if the model didn't strictly emit JSON
  }

  return {
    reply: cleaned || "SmartGrid AI Assistant online. How can I help you inspect the corridor today?",
    isCriticalAlert: false,
  };
}

function buildLocalFallback(message: string, gridContext?: ChatRequestBody["gridContext"]): StructuredAIReply {
  const q = message.toLowerCase().trim();
  const nodeA = gridContext?.nodes?.find((n) => n.id === "node-a");
  const nodeB = gridContext?.nodes?.find((n) => n.id === "node-b");
  const nodeC = gridContext?.nodes?.find((n) => n.id === "node-c");
  const faultActive = gridContext?.isFaultActive ?? true;

  // MODE 1: Greetings & Concept Introduction
  if (
    /^(hi|hello|hey|yo|good\s+(morning|afternoon|evening))\b/.test(q) ||
    q.includes("who are you") ||
    q.includes("what is this project") ||
    q.includes("introduce")
  ) {
    return {
      reply:
        "Welcome to the control room — I'm the SmartGrid AI Assistant.\n\nSMARTGRID AIoT is a physical-to-digital energy monitoring prototype combining an ESP32-S3 mobile inspection rover (with INA219 electrical sensing and IR obstacle detection), a live 3-node React Flow digital twin (Node A: Residential Feeder, Node B: EV Charging Hub, Node C: Industrial Transformer), and human-in-the-loop operator guidance.\n\nWould you like to inspect a specific grid node, run a fault simulation, or ask a technical question about our architecture?",
      isCriticalAlert: false,
    };
  }

  // MODE 3: Open-ended technical & jury questions
  if (q.includes("ina219")) {
    return {
      reply:
        "We chose the INA219 because it is an I2C high-side shunt current and bus voltage monitor capable of measuring both voltage and current simultaneously on our isolated 5V/12V DC tabletop circuit to compute calibrated power in real time. Unlike a raw ADC divider, it integrates a precision shunt amplifier and 12-bit ADC over a two-wire I2C bus directly into the ESP32-S3 with minimal wiring noise.",
      isCriticalAlert: false,
    };
  }

  if (q.includes("ir ") || q.includes("infrared") || q.includes("obstacle")) {
    return {
      reply:
        "The IR Obstacle Module emits infrared light and detects reflected IR from nearby objects in the rover's path to trigger an immediate obstacle stop signal on the ESP32-S3. To be strictly accurate about our hardware boundary, this IR module is purely for binary proximity/obstacle detection — it does not measure temperature or exact distance in centimeters or meters.",
      isCriticalAlert: false,
    };
  }

  if (q.includes("bescom") || q.includes("kerc") || q.includes("why a rover") || q.includes("fixed meter")) {
    return {
      reply:
        "Fixed DTMUs and smart meters generate remote electrical alarms, but they cannot physically patrol substation yards or inspect corridor equipment on-site. According to KERC's Combined Tariff Order 2025, BESCOM spent ₹134.44 Cr repairing 36,035 faulty distribution transformers in FY 2023–24 alone.\n\nPairing electrical telemetry with a mobile ESP32-S3 inspection rover bridges remote grid visibility and physical corridor checks, while keeping all switching decisions human-in-the-loop on our safe 5V/12V DC prototype.",
      isCriticalAlert: false,
    };
  }

  if (q.includes("wi-fi") || q.includes("wifi") || q.includes("offline") || q.includes("drops")) {
    return {
      reply:
        "In our tabletop prototype, the ESP32-S3 rover streams telemetry over Wi-Fi to Next.js API routes backed by Supabase PostgreSQL + Realtime. If Wi-Fi drops, local safety stops (such as IR obstacle halts and SPI TFT status updates) continue operating directly on the ESP32-S3 edge controller, while the dashboard flags an offline state and retains cached telemetry. Full flash-memory buffering for extended outages is a planned production extension beyond the live low-voltage demo.",
      isCriticalAlert: false,
    };
  }

  // MODE 2: Preset Triage & Node Fault Checks
  if (q.includes("node a") || q.includes("residential")) {
    const v = nodeA?.voltage ?? 230.2;
    const c = nodeA?.current ?? 48.4;
    const l = nodeA?.powerLoad ?? 98;
    return {
      reply: `Simulated Digital-Twin Telemetry — Node A (Residential Feeder) is currently Normal at ${v}V, ${c}A, and ${l} MW load with healthy headroom available.`,
      isCriticalAlert: false,
      recommendations: [
        "Edge Action: Continue routine ESP32-S3 rover corridor patrol past Node A.",
        "Protection Action: Keep breaker state normal (no isolation needed).",
        "Grid Action: Maintain Node A headroom as backup capacity for simulated load sharing.",
        "Field Action: No maintenance ticket required; log routine baseline check.",
      ],
      voicePreview: `Node A Residential Feeder is normal at ${v} volts and ${l} megawatts with no action required.`,
    };
  }

  if (q.includes("node b") || q.includes("ev")) {
    const v = nodeB?.voltage ?? 218.7;
    const c = nodeB?.current ?? 142.6;
    const l = nodeB?.powerLoad ?? 76;
    return {
      reply: `Simulated Digital-Twin Telemetry — Node B (EV Charging Hub) is in Warning state at ${v}V, ${c}A, and ${l} MW due to elevated fast-charging demand.`,
      isCriticalAlert: false,
      recommendations: [
        "Edge Action: Route ESP32-S3 rover past Node B to verify corridor status.",
        "Protection Action: Keep simulated protection on standby pending operator review.",
        "Grid Action: Prepare simulated load balancing toward Node A if EV demand climbs further.",
        "Field Action: Flag EV Hub Bay for peak-load monitoring by the on-duty operator.",
      ],
      voicePreview: `Warning at Node B EV Hub: voltage ${v} volts under elevated ${l} megawatt load.`,
    };
  }

  if (q.includes("node c") || q.includes("risk") || q.includes("fault") || q.includes("suggest") || q.includes("next step")) {
    const v = nodeC?.voltage ?? 194.5;
    const c = nodeC?.current ?? 285.0;
    const l = nodeC?.powerLoad ?? 102;
    return {
      reply: faultActive
        ? `Simulated Digital-Twin Telemetry — Node C (Industrial Transformer) is Critical at ${v}V, ${c}A, and ${l} MW load, indicating severe voltage sag and overcurrent stress.`
        : `Simulated Digital-Twin Telemetry — Node C (Industrial Transformer) is Normal at ${v}V, ${c}A, and ${l} MW load with no active fault.`,
      isCriticalAlert: faultActive,
      recommendations: faultActive
        ? [
            "Edge Action: Halt ESP32-S3 rover patrol at a safe standoff point near Node C.",
            "Protection Action: Review simulated breaker isolation for Node C pending human operator approval.",
            "Grid Action: Evaluate simulated self-healing load reroute across healthy Nodes A and B.",
            "Field Action: Prepare maintenance inspection brief for Substation Bay 3.",
          ]
        : undefined,
      voicePreview: faultActive
        ? `Critical alert at Node C: voltage dropped to ${v} volts at ${l} megawatts. Operator review required.`
        : `Node C Industrial Transformer is operating normally at ${v} volts.`,
    };
  }

  if (q.includes("patrol") || q.includes("rover")) {
    const r = gridContext?.rover;
    return {
      reply: `The ESP32-S3 mobile inspection rover is ${r?.isPatrolling ? "actively patrolling" : "in standby"} between ${r?.currentNodeId?.toUpperCase() || "NODE-B"} and ${r?.targetNodeId?.toUpperCase() || "NODE-C"} (simulated battery ${r?.batteryLevel ?? 89}%). On hardware, it uses an L298N motor driver, SPI TFT status eyes, INA219 electrical sensing, and an IR obstacle stop sensor.`,
      isCriticalAlert: false,
    };
  }

  return {
    reply:
      "I can help you inspect Node A, Node B, or Node C on our 3-node digital twin, review simulated fault triage steps, or answer technical questions about the ESP32-S3 rover, INA219 sensing, IR obstacle detection, and BESCOM reliability context. What would you like to explore?",
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
    const recentHistory = (body.history || []).slice(-8);

    // 1. Direct Google Gemini API (Primary — defaults to latest gemini-3.8-flash with automatic fallback)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (isConfigured(geminiKey)) {
      const primaryModel = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();
      const candidateModels = Array.from(
        new Set([primaryModel, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-3.8-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"])
      );
      const contents = [
        ...recentHistory.map((h) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        })),
        { role: "user", parts: [{ text: message }] },
      ];

      for (const model of candidateModels) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          model
        )}:generateContent?key=${encodeURIComponent(geminiKey!.trim())}`;

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

          if (rawText) {
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
          // Only retry next model on 404/503/429
          if (![404, 429, 503].includes(res.status)) break;
        }
      }
    }

    // 2. Optional OpenRouter Fallback (if OPENROUTER_API_KEY is configured)
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (isConfigured(openRouterKey)) {
      const model = process.env.OPENROUTER_MODEL || "google/gemini-3.8-flash";
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterKey!.trim()}`,
          "HTTP-Referer": "https://smartgrid-aiot.local",
          "X-Title": "SmartGrid AIoT",
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
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
        if (rawText) {
          const structured = parseStructuredReply(rawText);
          return NextResponse.json({
            provider: "openrouter",
            model,
            ...structured,
          });
        }
      } else {
        const errText = await res.text().catch(() => "");
        console.error("OpenRouter API error:", res.status, errText);
      }
    }

    // 3. Safe Telemetry-Aware Fallback (when API keys aren't added to .env yet)
    const fallback = buildLocalFallback(message, body.gridContext);
    return NextResponse.json({
      provider: "fallback",
      model: "local-telemetry",
      ...fallback,
    });
  } catch (err) {
    console.error("Chat API route failure:", err);
    return NextResponse.json(
      { error: "Failed to process AI chat request." },
      { status: 500 }
    );
  }
}
