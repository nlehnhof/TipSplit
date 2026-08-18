import Link from "next/link";

/**
 * Placeholder — the real /calculator (hours / sales / points split methods,
 * house retention, cent-exact rounding) is built in a later task.
 */
export default function CalculatorPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">Tip calculator</h1>
      <p className="max-w-sm text-sm leading-relaxed text-zinc-600">
        Coming soon — split tips by hours, sales, or points in under 60
        seconds. No account required.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-800"
      >
        ← Back to home
      </Link>
    </main>
  );
}
