import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseAnonConfig } from "@/lib/env";

/**
 * Supabase server client for Server Components, Server Actions, and Route
 * Handlers. Uses the request's cookies so the session follows the user.
 *
 * Next.js 15+: `cookies()` is async, hence `await cookies()`.
 */
export async function createClient() {
  const { url, anonKey } = requireSupabaseAnonConfig();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component. Safe to ignore when the
          // session is being refreshed by middleware — writing cookies
          // from a Server Component would otherwise throw.
        }
      },
    },
  });
}
