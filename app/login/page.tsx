"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { getSupabaseAnonConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "sent" | "error";

const inputClasses =
  "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-base text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 disabled:opacity-60";

export default function LoginPage() {
  // Read once at render: if Supabase env vars are missing we render a
  // graceful "not configured" state instead of constructing a client that
  // would throw.
  const authConfigured = getSupabaseAnonConfig() !== null;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoading = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!authConfigured || isLoading) return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${baseUrl.replace(/\/+$/, "")}/app`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong sending the magic link. Please try again."
      );
      setStatus("error");
    }
  }

  // --- Auth is not configured yet: graceful state, no crash, no console
  // --- errors from a half-initialized Supabase client.
  if (!authConfigured) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <h1 className="text-lg font-semibold text-amber-900">
            Auth is not configured yet
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-amber-800">
            Logging in needs Supabase credentials (
            <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>
            ). Add them to <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">.env.local</code> and restart the dev server.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-medium text-amber-900 underline underline-offset-2"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Log in to TipSplit</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Enter your email and we&apos;ll send you a magic link to get in.
        </p>

        {/* --- sent state --- */}
        {status === "sent" ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4" role="status">
            <p className="text-sm font-medium text-emerald-900">
              Check your email for the magic link.
            </p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800">
              We sent a link to{" "}
              <span className="font-medium">{email.trim()}</span>. It expires
              shortly — click it to finish logging in.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-3 text-sm font-medium text-emerald-900 underline underline-offset-2"
            >
              Didn&apos;t get it? Try again
            </button>
          </div>
        ) : (
          /* --- idle / loading state --- */
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-zinc-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                inputMode="email"
                placeholder="manager@yourrestaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={inputClasses}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Sending…" : "Send magic link"}
            </button>

            {/* --- error state --- */}
            {status === "error" && errorMessage ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
              >
                {errorMessage}
              </div>
            ) : null}
          </form>
        )}

        <p className="mt-5 border-t border-zinc-100 pt-4 text-center text-xs text-zinc-500">
          New here? There&apos;s nothing to sign up for — the calculator works
          without an account. Logging in adds saved rosters, presets, and shift
          history.
        </p>
        <div className="mt-3 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-800"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
