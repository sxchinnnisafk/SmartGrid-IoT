import { NextRequest, NextResponse } from "next/server";

const DEFAULT_FREE_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George (ElevenLabs official free premade default)

function isConfigured(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  return Boolean(trimmed) && !trimmed.startsWith("your_") && !trimmed.includes("_here");
}

async function synthesizeWithVoice(
  apiKey: string,
  voiceId: string,
  modelId: string,
  text: string
): Promise<Response> {
  const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
    voiceId
  )}?output_format=mp3_44100_128`;

  return fetch(elevenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });
}

async function findFirstFreeAccountVoice(apiKey: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": apiKey },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      voices?: Array<{ voice_id?: string; category?: string }>;
    };
    const voices = data.voices || [];
    const premade = voices.find((v) => v.category === "premade" && v.voice_id);
    return premade?.voice_id || voices[0]?.voice_id || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { text?: string; voiceId?: string };
    const text = (body.text || "").trim().slice(0, 1500);

    if (!text) {
      return NextResponse.json({ error: "Text is required for speech synthesis." }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!isConfigured(apiKey)) {
      return NextResponse.json(
        {
          fallback: true,
          error: "ELEVENLABS_API_KEY is not configured in .env yet.",
        },
        { status: 501 }
      );
    }

    const cleanKey = apiKey!.trim();
    const voiceId = (body.voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_FREE_VOICE_ID).trim();
    const modelId = (process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5").trim();

    let response = await synthesizeWithVoice(cleanKey, voiceId, modelId, text);

    // If the configured voice is unavailable on this account tier (402/404), auto-select an available premade voice
    if (!response.ok && (response.status === 402 || response.status === 404)) {
      const accountVoiceId = await findFirstFreeAccountVoice(cleanKey);
      if (accountVoiceId && accountVoiceId !== voiceId) {
        response = await synthesizeWithVoice(cleanKey, accountVoiceId, modelId, text);
      }
    }

    if (!response.ok) {
      const errDetail = await response.text().catch(() => "");
      console.error("ElevenLabs API error:", response.status, errDetail);
      return NextResponse.json(
        {
          fallback: true,
          error: `ElevenLabs synthesis failed (HTTP ${response.status}).`,
        },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("TTS API route failure:", err);
    return NextResponse.json(
      { fallback: true, error: "Failed to synthesize speech audio." },
      { status: 500 }
    );
  }
}
