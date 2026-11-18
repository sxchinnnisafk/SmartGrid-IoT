import { createClient, SupabaseClient } from "@supabase/supabase-js";

function isValidEnv(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  return (
    Boolean(trimmed) &&
    !trimmed.startsWith("your_") &&
    !trimmed.includes("your-project-id") &&
    !trimmed.includes("_here")
  );
}

let browserClient: SupabaseClient | null = null;
let serverClient: SupabaseClient | null = null;

export function isSupabaseBrowserConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return isValidEnv(url) && isValidEnv(anonKey);
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseBrowserConfigured()) return null;
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
      {
        auth: { persistSession: false },
      }
    );
  }
  return browserClient;
}

export function isSupabaseServerConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  return isValidEnv(url) && isValidEnv(key);
}

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!isValidEnv(url) || !isValidEnv(key)) return null;
  if (!serverClient) {
    serverClient = createClient(url!.trim(), key!.trim(), {
      auth: { persistSession: false },
    });
  }
  return serverClient;
}
