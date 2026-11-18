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

/**
 * Normalizes a Supabase URL so accidental suffixes like `/rest/v1/` never break
 * `@supabase/supabase-js` REST queries or Realtime WebSockets.
 */
export function normalizeSupabaseUrl(rawUrl: string | undefined): string | null {
  if (!isValidEnv(rawUrl)) return null;
  try {
    const parsed = new URL(rawUrl!.trim());
    return parsed.origin;
  } catch {
    return null;
  }
}

let browserClient: SupabaseClient | null = null;
let serverClient: SupabaseClient | null = null;

export function isSupabaseBrowserConfigured(): boolean {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url) && isValidEnv(anonKey);
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !isValidEnv(anonKey)) return null;

  if (!browserClient) {
    browserClient = createClient(url, anonKey!.trim(), {
      auth: { persistSession: false },
    });
  }
  return browserClient;
}

export function isSupabaseServerConfigured(): boolean {
  const url = normalizeSupabaseUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  );
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  return Boolean(url) && isValidEnv(key);
}

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = normalizeSupabaseUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  );
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !isValidEnv(key)) return null;
  if (!serverClient) {
    serverClient = createClient(url, key!.trim(), {
      auth: { persistSession: false },
    });
  }
  return serverClient;
}
