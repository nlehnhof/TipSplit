"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "unavailable" | "error";

/**
 * "Start Pro" button. POSTs to the server-only /api/checkout route which
 * creates a Stripe Checkout Session. Never touches Stripe on the client.
 *
 * Async surface states:
 *  - idle:        ready to start checkout
 *  - loading:     request in flight ("Starting checkout…")
 *  - unavailable: Stripe isn't configured — button disabled, clear message
 *  - error:       checkout failed — message shown, button re-enabled to retry
 */
export default function CheckoutButton() {
  const [status, setStatus] = useState<Status>("idle");

  async function startCheckout() {
    if (status === "loading" || status === "unavailable") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) {
        if (res.status === 503) {
          setStatus("unavailable");
        } else {
          setStatus("error");
        }
        return;
      }
      const data = (await res.json()) as { url?: string | null };
      if (!data.url) {
        setStatus("error");
        return;
      }
      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  }

  const disabled = status === "loading" || status === "unavailable";

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading"
          ? "Starting checkout…"
          : status === "unavailable"
            ? "Payments aren't configured yet"
            : "Start Pro"}
      </button>
      {status === "unavailable" && (
        <p className="mt-3 text-xs leading-relaxed text-zinc-400">
          Payments aren&apos;t configured yet. Check back soon — the free
          calculator works without an account in the meantime.
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs leading-relaxed text-amber-300">
          Something went wrong starting checkout. Please try again.
        </p>
      )}
    </div>
  );
}
