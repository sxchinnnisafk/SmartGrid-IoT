import { NextResponse } from "next/server";
import { isSupabaseServerConfigured } from "../../lib/supabase";

function parseApiKeys(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[\n,;]+/)
    .map((k) => k.trim().replace(/^["']|["']$/g, ""))
    .filter((k) => Boolean(k) && !k.startsWith("your_") && !k.includes("_here"));
}

export async function GET() {
  const geminiDirect = parseApiKeys(process.env.GEMINI_API_KEY).length > 0;
  const openRouter = parseApiKeys(process.env.OPENROUTER_API_KEY).length > 0;
  const elevenLabs = parseApiKeys(process.env.ELEVENLABS_API_KEY).length > 0;
  const supabase = isSupabaseServerConfigured();

  return NextResponse.json({
    gemini: geminiDirect || openRouter,
    provider: geminiDirect ? "gemini" : openRouter ? "openrouter" : "unconfigured",
    model: geminiDirect
      ? process.env.GEMINI_MODEL || "gemini-3.8-flash"
      : openRouter
      ? process.env.OPENROUTER_MODEL || "google/gemini-3.8-flash"
      : "unconfigured",
    elevenLabs,
    elevenLabsModel: process.env.ELEVENLABS_MODEL_ID || "eleven_flash_v2_5",
    voiceId: process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb",
    supabase,
  });
}
