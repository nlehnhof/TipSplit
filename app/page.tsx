import Link from "next/link";

/**
 * Temporary placeholder home page — the real landing page is a later task.
 */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        TipSplit
      </h1>
      <p className="max-w-md text-base leading-relaxed text-zinc-600">
        The tip out &amp; tip pooling calculator for restaurant, bar, and salon
        managers. Split end-of-shift tips in under 60 seconds.
      </p>
      <nav className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/calculator"
          className="flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-700"
        >
          Open the calculator
        </Link>
        <Link
          href="/login"
          className="flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
        >
          Log in
        </Link>
      </nav>
    </main>
  );
}
