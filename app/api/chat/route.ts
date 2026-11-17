import { NextRequest, NextResponse } from "next/server";

interface IncomingNode {
  id: string;
  badge: string;
  name: string;
  status: string;
  statusLabel: string;
  temperature: number;
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
    isThermalFaultActive?: boolean;
    isBreakerIsolated?: boolean;
    activeAlertsCount?: number;
  };
}

interface StructuredAIReply {
  reply: string;
  isCriticalAlert: boolean;
  recommendations?: string[];
  suggestWorkflow?: boolean;
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
          `- Node ${n.badge} (${n.name}): Status=${n.statusLabel}, Temp=${n.temperature}°C, Voltage=${n.voltage}V, Current=${n.current}A, Load=${n.powerLoad}${n.powerLoadUnit}, PhaseBalance=${n.phaseBalance}%`
      )
      .join("\n") ||
    "- Node A (Residential Feeder): Normal, 42.5°C, 230.2V, 98MW\n- Node B (EV Charging Hub): Warning, 68.1°C, 218.7V, 76MW\n- Node C (Industrial Transformer): Critical, 102.0°C, 194.5V, 102MW";

  const roverSummary = gridContext?.rover
    ? `ESP32-S3 Rover: patrolling=${gridContext.rover.isPatrolling}, current=${gridContext.rover.currentNodeId}, target=${gridContext.rover.targetNodeId}, battery=${gridContext.rover.batteryLevel}%, speed=${gridContext.rover.speedMps}m/s, camera=${gridContext.rover.cameraStatus}`
    : "ESP32-S3 Rover patrolling corridor at 89% battery";

  return `You are SmartGrid AI, an operator-facing intelligent power distribution advisor for Team Celestia's SmartGrid AIoT system (Power Hack 2026).

LIVE CORRIDOR TELEMETRY:
${nodesSummary}

EDGE ROVER:
${roverSummary}

SAFETY & STATE:
- Thermal fault active on Node C: ${gridContext?.isThermalFaultActive ? "YES" : "NO"}
- Breaker SC-12 simulated isolation armed: ${gridContext?.isBreakerIsolated ? "YES" : "NO"}
- Active alerts count: ${gridContext?.activeAlertsCount ?? 0}
- Policy: Human-in-the-loop mandatory. You explain root causes and recommend mitigation steps; human operators retain final authority over all switching/isolation actions. This is an isolated low-voltage tabletop prototype with no live utility mains connection.

RESPONSE FORMAT:
Return ONLY valid JSON with this exact schema (no markdown code fences):
{
  "reply": "Clear, concise, operator-grade diagnostic answer (2-4 sentences referencing exact live numbers).",
  "isCriticalAlert": boolean,
  "recommendations": ["Optional array of 2-4 crisp numbered action steps when mitigation is relevant"],
  "suggestWorkflow": boolean
}`;
}

function parseStructuredReply(rawText: string, fallbackCritical: boolean): StructuredAIReply {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<StructuredAIReply>;
    if (typeof parsed.reply === "string" && parsed.reply.trim().length > 0) {
      return {
        reply: parsed.reply.trim(),
        isCriticalAlert: Boolean(parsed.isCriticalAlert),
        recommendations: Array.isArray(parsed.recommendations)
          ? parsed.recommendations.filter((r): r is string => typeof r === "string" && r.trim().length > 0).slice(0, 5)
          : undefined,
        suggestWorkflow: Boolean(parsed.suggestWorkflow),
      };
    }
  } catch {
    // Plain text fallback if the model didn't strictly emit JSON
  }

  return {
    reply: cleaned || "Telemetry analyzed. All three corridor nodes remain under active supervision.",
    isCriticalAlert: fallbackCritical,
  };
}

function buildLocalFallback(message: string, gridContext?: ChatRequestBody["gridContext"]): StructuredAIReply {
  const q = message.toLowerCase();
  const nodeC = gridContext?.nodes?.find((n) => n.id === "node-c");
  const nodeCTemp = nodeC?.temperature ?? 102.0;
  const nodeCVolt = nodeC?.voltage ?? 194.5;
  const faultActive = gridContext?.isThermalFaultActive ?? true;

  if (q.includes("node c") || q.includes("risk") || q.includes("thermal") || q.includes("fault")) {
    return {
      reply: faultActive
        ? `Thermal sensors at Node C read ${nodeCTemp}°C with phase voltage sagging to ${nodeCVolt}V, exceeding the 85°C safe threshold. Winding degradation risk is elevated until isolation is confirmed.`
        : `Node C is currently operating within nominal thermal bounds at ${nodeCTemp}°C and ${nodeCVolt}V with no active fault ticket.`,
      isCriticalAlert: faultActive,
      recommendations: faultActive
        ? [
            "Isolate the Node C SC-12 breaker to protect transformer windings.",
            "Hold ESP32-S3 Rover R-1 at safe standoff distance.",
            "Reroute 26 MW surplus load to Residential Feeder A and EV Hub B.",
            "Dispatch field crew with standard thermal inspection kit.",
          ]
        : undefined,
      suggestWorkflow: faultActive,
    };
  }

  if (q.includes("patrol") || q.includes("rover")) {
    const r = gridContext?.rover;
    return {
      reply: `ESP32-S3 Rover R-1 is ${r?.isPatrolling ? "actively patrolling" : "in standby"} between ${r?.currentNodeId?.toUpperCase() || "NODE-B"} and ${r?.targetNodeId?.toUpperCase() || "NODE-C"} at ${r?.speedMps ?? 1.8} m/s with ${r?.batteryLevel ?? 89}% battery and live SPI TFT telemetry eyes.`,
      isCriticalAlert: false,
    };
  }

  if (q.includes("dispatch") || q.includes("voice") || q.includes("brief")) {
    return {
      reply: `Field dispatch brief prepared: Crew assigned to Substation Bay 3 (Node C, ${nodeCTemp}°C). Verify breaker SC-12 isolation status before thermal imaging inspection. Use the Listen button to play spoken audio via ElevenLabs.`,
      isCriticalAlert: faultActive,
      suggestWorkflow: faultActive,
    };
  }

  return {
    reply: `Corridor telemetry verified across 3 nodes. Node A is stable at baseline, Node B is handling elevated EV charging load, and Node C reads ${nodeCTemp}°C (${faultActive ? "critical thermal alert active" : "nominal"}).`,
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

    // 1. Direct Google Gemini API (Primary)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (isConfigured(geminiKey)) {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const contents = [
        ...recentHistory.map((h) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        })),
        { role: "user", parts: [{ text: message }] },
      ];

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
            temperature: 0.35,
            maxOutputTokens: 512,
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
          const structured = parseStructuredReply(
            rawText,
            Boolean(body.gridContext?.isThermalFaultActive)
          );
          return NextResponse.json({
            provider: "gemini",
            model,
            ...structured,
          });
        }
      } else {
        const errText = await res.text().catch(() => "");
        console.error("Gemini API error:", res.status, errText);
      }
    }

    // 2. Optional OpenRouter Fallback (if OPENROUTER_API_KEY is configured)
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (isConfigured(openRouterKey)) {
      const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
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
          temperature: 0.35,
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
          const structured = parseStructuredReply(
            rawText,
            Boolean(body.gridContext?.isThermalFaultActive)
          );
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
