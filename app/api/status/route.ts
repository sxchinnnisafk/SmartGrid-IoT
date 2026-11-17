import { NextResponse } from "next/server";

function isConfigured(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("your_") || trimmed.includes("_here")) return false;
  return true;
}

export async function GET() {
  const geminiDirect = isConfigured(process.env.GEMINI_API_KEY);
  const openRouter = isConfigured(process.env.OPENROUTER_API_KEY);
  const elevenLabs = isConfigured(process.env.ELEVENLABS_API_KEY);

  return NextResponse.json({
    gemini: geminiDirect || openRouter,
    provider: geminiDirect ? "gemini" : openRouter ? "openrouter" : "fallback",
    model: geminiDirect
      ? process.env.GEMINI_MODEL || "gemini-3.8-flash"
      : openRouter
      ? process.env.OPENROUTER_MODEL || "google/gemini-3.8-flash"
      : "local-telemetry",
    elevenLabs,
    elevenLabsModel: process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5",
    voiceId: process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb",
  });
}
