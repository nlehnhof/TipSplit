import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "./checkout-button";

export const metadata: Metadata = {
  title: "Pricing — TipSplit: Free Calculator, Pro $12/mo",
  description:
    "The tip split calculator is free and unlimited — no account needed. Pro at $12/mo adds a saved roster, split presets, shift history, and CSV export. Cancel anytime.",
};

const LEGAL_NOTE =
  "TipSplit is a calculator. It does not process payments or file taxes. Tip pooling law varies by jurisdiction — confirm your split complies with local wage law.";

const freeFeatures = [
  "Unlimited tip out calculations — hours, sales, or points splits",
  "House retention (percentage off the top)",
  "Cent-exact rounding with reconciliation line",
  "Copy-to-clipboard summary",
  "No account, no credit card, no trial countdown",
];

const proFeatures = [
  "Everything in Free",
  "Saved staff roster — names and roles, ready in one tap",
  "Split presets — your method, role weights, and retention saved",
  "Unlimited shift history — every split stored while you're signed in",
  "CSV export of any saved shift (Excel / Google Sheets / payroll-friendly)",
];

export default async function PricingPage(props: PageProps<"/pricing">) {
  const { checkout } = await props.searchParams;
  const cancelled = checkout === "cancelled";

  return (
    <main className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        {/* PAGE HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Simple pricing. The calculator is free.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-700">
            The math — all three split methods, house retention, and cent-exact
            rounding — is free and unlimited. Pro is for managers who want to
            stop retyping the same roster every night.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            The calculator works without an account. Sign in only when you want
            to save.
          </p>
        </div>

        {/* CANCELLED NOTICE */}
        {cancelled && (
          <div
            role="status"
            className="mt-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            Checkout cancelled — you weren&apos;t charged. Your Free access is
            unchanged; the calculator still works without an account.
          </div>
        )}

        {/* CARDS */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* FREE */}
          <section
            aria-label="Free plan"
            className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <h2 className="text-lg font-bold text-zinc-900">Free</h2>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900">
              $0 <span className="text-base font-semibold text-zinc-500">— forever</span>
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              The full calculator, no account needed.
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm leading-relaxed text-zinc-700">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span aria-hidden="true" className="shrink-0 text-emerald-600">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/calculator"
              className="mt-8 inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            >
              Open the calculator
            </Link>
          </section>

          {/* PRO */}
          <section
            aria-label="Pro plan"
            className="flex flex-col rounded-2xl border-2 border-zinc-900 bg-zinc-950 p-6 text-white"
          >
            <h2 className="text-lg font-bold">Pro</h2>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">
              $12 <span className="text-base font-semibold text-zinc-400">/ month, billed monthly</span>
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              For managers who run the same split every night.
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm leading-relaxed text-zinc-200">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span aria-hidden="true" className="shrink-0 text-emerald-400">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CheckoutButton />
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                $12/month, billed monthly. Cancel anytime — you keep access
                until the end of the paid period. No refunds for partial
                months.
              </p>
            </div>
          </section>
        </div>

        {/* BELOW THE CARDS */}
        <p className="mt-10 text-center text-sm text-zinc-600">
          No hidden fees. No per-seat pricing — one account covers the manager
          running the split. Staff never need accounts or payments.
        </p>
        <p className="mt-3 text-center text-sm text-zinc-600">
          Questions about how the split works or what you can save?{" "}
          <Link
            href="/#faq"
            className="font-semibold text-zinc-900 underline underline-offset-2 hover:text-zinc-600"
          >
            See the FAQ
          </Link>
          .
        </p>

        {/* LEGAL NOTE (verbatim) */}
        <p className="mt-12 text-center text-xs leading-relaxed text-zinc-500">
          {LEGAL_NOTE}
        </p>
      </div>
    </main>
  );
}
