/**
 * Centralized environment variable access.
 *
 * NEXT_PUBLIC_* variables are safe to read anywhere — Next.js inlines them
 * into the client bundle at build time. Server-only secrets
 * (SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_PRICE_PRO_MONTHLY)
 * must only be read from server code; the helpers that read them throw if
 * called from the client bundle, so keep them out of client components.
 *
 * Every require*() helper throws a descriptive error when the variable is
 * missing, so misconfiguration fails loudly at request/build time instead of
 * failing silently at runtime.
 */

function missingEnvError(names: string[]): Error {
  const list = names.map((n) => `  - ${n}`).join("\n");
  return new Error(
    [
      `Missing required environment variable${names.length > 1 ? "s" : ""}:`,
      "",
      list,
      "",
      "Copy .env.example to .env.local and fill in real values.",
      "See README.md for setup instructions.",
    ].join("\n")
  );
}

/** Supabase browser/server client config, or null when not configured. */
export function getSupabaseAnonConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** Like getSupabaseAnonConfig but throws if Supabase is not configured. */
export function requireSupabaseAnonConfig(): { url: string; anonKey: string } {
  const config = getSupabaseAnonConfig();
  if (!config) {
    throw missingEnvError([
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]);
  }
  return config;
}

/** Server-only. Service role key for admin operations (e.g. seed script). */
export function requireServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw missingEnvError(["SUPABASE_SERVICE_ROLE_KEY"]);
  return key;
}

/** Server-only. Stripe test-mode keys and the Pro monthly price id. */
export function requireStripeKeys(): {
  publishableKey: string;
  secretKey: string;
  proMonthlyPriceId: string;
} {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const proMonthlyPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY;
  if (!publishableKey || !secretKey || !proMonthlyPriceId) {
    throw missingEnvError([
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "STRIPE_SECRET_KEY",
      "STRIPE_PRICE_PRO_MONTHLY",
    ]);
  }
  return { publishableKey, secretKey, proMonthlyPriceId };
}

/**
 * Public origin of the app (trailing slash stripped), or null when unset.
 * Used for magic-link redirects; callers should fall back to
 * window.location.origin on the client when null.
 */
export function getAppUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) return null;
  return url.replace(/\/+$/, "");
}
