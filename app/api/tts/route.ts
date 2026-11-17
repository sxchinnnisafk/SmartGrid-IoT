import { NextRequest, NextResponse } from "next/server";

function isConfigured(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  return Boolean(trimmed) && !trimmed.startsWith("your_") && !trimmed.includes("_here");
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

    const voiceId = (body.voiceId || process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM").trim();
    const modelId = (process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2").trim();

    const elevenUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(
      voiceId
    )}?output_format=mp3_44100_128`;

    const response = await fetch(elevenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
        "xi-api-key": apiKey!.trim(),
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
