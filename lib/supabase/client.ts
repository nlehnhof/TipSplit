"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseAnonConfig } from "@/lib/env";

/**
 * Supabase browser client for client components.
 *
 * Throws if Supabase env vars are missing — call getSupabaseAnonConfig()
 * from @/lib/env first when you need a graceful "not configured" state
 * instead of a crash.
 */
export function createClient() {
  const { url, anonKey } = requireSupabaseAnonConfig();
  return createBrowserClient(url, anonKey);
}
