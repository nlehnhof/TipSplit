import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TipSplit — Tip Out Calculator for Restaurants, Bars & Salons",
  description:
    "Split end-of-shift tips in under 60 seconds. Hours, sales, or points methods, house retention, cent-exact rounding. Free — no account needed.",
};

const LEGAL_NOTE =
  "TipSplit is a calculator. It does not process payments or file taxes. Tip pooling law varies by jurisdiction — confirm your split complies with local wage law.";

// --- Landing copy (from the marketing copy package: landing.md) ---
const hero = {
  subhead:
    "TipSplit is the tip out calculator built for closing managers. Enter your staff, hours, and the night's tip pool on your phone — get a cent-exact split, ready to post. No account needed. No spreadsheet required.",
  ctaUnder:
    "Free to use · No sign-up · Works on any phone, including yours at 11pm.",
};

const problem = {
  intro:
    "It's 11pm. The dining room is reset, the last ticket is closed, and you still have to split tips.",
  body1:
    "You open the shared spreadsheet on your phone. The columns have drifted since last week. Someone's hours are typed into the wrong row. The formula that summed last Friday's pool got overwritten in June and nobody noticed. You're pinching and scrolling sideways on a six-inch screen, squinting at a formula bar, and one fat-fingered number changes a coworker's take by $40.",
  body2:
    "Nobody gets paid wrong on purpose. But spreadsheets weren't built for this. They were built for desks and keyboards and the one person who wrote the formulas. At the bar at closing time, they fail exactly when you need them most.",
  body3:
    "TipSplit replaces the spreadsheet with one focused job: turn the night's tips into exact amounts for every person who worked. No formulas to maintain, no cells to protect, no scrolling to find the totals row.",
};

const methods = {
  intro:
    "Every tip-out comes down to a pool and a method. TipSplit supports the three methods restaurants, bars, and salons actually run — hours, sales, and points — and recalculates the whole shift the moment any number changes.",
};

const hoursMethod = {
  who:
    "any team that worked the same shift. It's the classic \"how to split tips by hours\" approach: everyone earns the same per hour, so the people who were on the clock longest take home more.",
  how: "each staffer's share is their hours as a fraction of the shift's total hours, applied to the pool.",
  formula: "share = (their hours ÷ total hours) × tip pool",
  exampleLabel: "Worked example — a $450 pool, 20 total hours:",
  example: [
    "Alex worked 8h → 8 ÷ 20 × $450 = $180.00",
    "Bailey worked 7h → 7 ÷ 20 × $450 = $157.50",
    "Casey worked 5h → 5 ÷ 20 × $450 = $112.50",
    "Total: $450.00 ✓",
  ],
  tail:
    "If your staff clock in and out, pull the hours straight from the time clock — no retyping. Every person can check the math themselves because the rule is one line long.",
};

const salesMethod = {
  who: "front-of-house teams where servers ring different volumes. A sales-based split ties the payout to what each person actually sold.",
  how: "share = (their sales ÷ total sales) × pool.",
  formula: "share = (their sales ÷ total sales) × tip pool",
  exampleLabel: "Worked example — a $300 pool, $3,000 in total sales:",
  example: [
    "Priya rang $1,200 → 1,200 ÷ 3,000 × $300 = $120.00",
    "Jordan rang $900 → 900 ÷ 3,000 × $300 = $90.00",
    "Sam rang $900 → 900 ÷ 3,000 × $300 = $90.00",
    "Total: $300.00 ✓",
  ],
  tail:
    "Sales splits are the standard tip out calculator setting for restaurants that pool tips in proportion to what each server sold. It's transparent: anyone can check their own sales against their payout.",
};

const pointsMethod = {
  who: "shifts with different roles — a host, a runner, and a bartender don't earn tips at the same rate, and a pure hours or sales split won't reflect that.",
  how: "you set a point weight per role (host 1 point per hour, server 2, bartender 2.5). Each staffer earns points = hours × role weight. Shares follow points.",
  formula: "share = (their points ÷ total points) × tip pool, where points = hours × role weight",
  exampleLabel:
    "Worked example — a $280 pool, weights host 1/hr, server 2/hr, bartender 2.5/hr:",
  example: [
    "Mia (host, 6h) → 6 points → 6 ÷ 28 × $280 = $60.00",
    "Dana (server, 6h) → 12 points → 12 ÷ 28 × $280 = $120.00",
    "Rico (bartender, 4h) → 10 points → 10 ÷ 28 × $280 = $100.00",
    "Total: 28 points → $280.00 ✓",
  ],
  tail:
    "Points is the most flexible restaurant tip pooling calculator method: change one weight and the whole shift recalculates instantly, so you can tune the split until it matches the policy you actually want to run — then save it as a preset on Pro and never retype it.",
};

const retention = {
  body: [
    "Many operations take a percentage off the top of the pool before anything is split — for credit card processing fees, a house take, or to fund a separate tip-out. TipSplit lets you set that retention, applies it to the pool first, and shows the retained amount as its own line so staff can see exactly where the money went.",
    "Example: an $800 pool with 3% retention → $24.00 kept by the house, $776.00 split among staff. Both numbers are on screen. No \"where did the money go\" conversations at the end of the night.",
  ],
};

const rounding = {
  body: [
    "Tips almost never divide evenly, and rounding mistakes are how a split silently stops adding up. TipSplit rounds to the cent and assigns the leftover remainder to the staffer with the most hours — the industry-standard tiebreaker — then shows a reconciliation line so every amount can be checked in five seconds.",
    "Example: a $100 pool across three staffers with equal hours → $33.33, $33.33, and $33.34. The reconciliation line confirms the total: $100.00 ✓. The numbers always add up, and you can prove it to anyone who asks.",
  ],
};

const audience = {
  items: [
    "Restaurants — servers, runners, hosts, bartenders; split by hours, sales, or points.",
    "Bars — bartenders and barbacks on any of the same methods.",
    "Salons — stylists, assistants, and front desk, by hours or points.",
  ],
  free:
    "Free, and no account required: the calculator itself is free and unlimited — no trial countdown, no paywall on the core math. You only create an account if you want the Pro features: a saved staff roster, split presets, and shift history you can come back to.",
};

const finalCta = {
  headline: "Tonight's numbers, in under a minute.",
  body: "Open TipSplit, tap in the staff, drop in the pool, pick the method. Copy the summary, post it, and go home.",
};

// --- FAQ copy (from faq.md; visible text and FAQPage JSON-LD stay identical) ---
const faqItems: { q: string; a: string }[] = [
  {
    q: "What is tip pooling?",
    a: "Tip pooling is when a business collects the tips earned by a group of staff during a shift and distributes them among that group according to a set rule — by hours worked, by sales, or by role-weighted points. TipSplit automates the math for those pools: you enter the staff and the rule, and it produces the exact split.",
  },
  {
    q: "Is tip pooling legal?",
    a: "Tip pooling law varies by jurisdiction and by whether staff are tipped or non-tipped. In many places pooling among tipped employees is allowed, and some jurisdictions permit pools that include non-tipped staff under specific conditions — but the rules genuinely differ. Before you set up or change a pool, check your local wage law and ask a qualified employment attorney if you're unsure. TipSplit just does the math; it can't tell you whether your pool is legal where you operate.",
  },
  {
    q: "How does house retention work?",
    a: "House retention is a percentage taken off the top of the tip pool before anything is split. In TipSplit you set the retention percentage, and the calculator applies it to the pool first, then splits what remains among staff. The retained amount is shown as its own line. Example: an $800 pool with 3% retention keeps $24 for the house and splits $776 among staff.",
  },
  {
    q: "How is rounding handled?",
    a: "Tip pools almost never divide evenly, so TipSplit rounds every payout to the cent. Any leftover remainder is assigned to the staffer with the most hours, the industry-standard tiebreaker. A reconciliation line totals the payouts so you can verify they add up to the pool in seconds. Example: a $100 pool split three ways by equal hours pays $33.33, $33.33, and $33.34, totaling $100.00.",
  },
  {
    q: "Do my staff need accounts?",
    a: "No. The calculator works entirely without an account — anyone can enter staff, hours, and the tip pool and get a full split without signing up. Staff never need accounts to see their payout; you can copy the summary and share it however you normally would. Accounts exist only for the manager who wants to save rosters, presets, and shift history.",
  },
  {
    q: "What does Pro include?",
    a: "Pro costs $12/month and adds three things: a saved staff roster (so you don't retype names and roles every shift), split presets (your method and role weights, saved), and unlimited shift history (every split you run while signed in, stored and searchable). The core calculator — all three split methods, house retention, cent-exact rounding — is free and unlimited for everyone.",
  },
  {
    q: "Can I export my shifts?",
    a: "Yes — CSV export is a Pro feature. When you're signed in with Pro, every saved shift can be exported as a CSV file (compatible with Excel, Google Sheets, and most payroll systems). Free users can copy the on-screen summary to their clipboard but can't export saved shift data.",
  },
  {
    q: "Does TipSplit process payroll or taxes?",
    a: "No. TipSplit is a calculator: it computes how to split a tip pool you enter, and nothing more. It does not process payments, doesn't run payroll, doesn't withhold or report taxes, and doesn't file anything. You still handle payouts, payroll, and tax obligations through your normal systems, and you're responsible for verifying that your split complies with local wage law.",
  },
];

// --- JSON-LD (rendered server-side into the landing HTML) ---
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TipSplit",
  applicationCategory: "BusinessApplication",
  description: metadata.description,
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "12",
      priceCurrency: "USD",
      description:
        "Monthly subscription: saved staff roster, split presets, unlimited shift history, and CSV export.",
    },
  ],
};

function jsonLd(data: object): string {
  // Escape "<" so no JSON content can ever terminate the script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const PRIMARY_BTN =
  "inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2";
const SECONDARY_BTN =
  "inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 text-base font-semibold text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2";

export default function LandingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(softwareJsonLd) }}
      />

      {/* HERO */}
      <section className="bg-zinc-950 px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Close the books in under 60 seconds.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">
            {hero.subhead}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/calculator" className={PRIMARY_BTN}>
              Calculate tonight&apos;s tips
            </Link>
            <a href="#methods" className={SECONDARY_BTN}>
              How the split works
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-400">{hero.ctaUnder}</p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            The closing-time spreadsheet is costing you time
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-700">
            <p>{problem.intro}</p>
            <p>{problem.body1}</p>
            <p>{problem.body2}</p>
            <p>{problem.body3}</p>
          </div>
        </div>
      </section>

      {/* THREE WAYS TO SPLIT */}
      <section id="methods" className="bg-zinc-50 px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Three ways to split tips, done right
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-700">
            {methods.intro}
          </p>

          <div className="mt-10 space-y-8">
            {/* Hours */}
            <article className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="text-xl font-bold text-zinc-900">
                Split by hours — the fairest simple method
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                <span className="font-semibold text-zinc-800">Who it fits:</span>{" "}
                {hoursMethod.who}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                <span className="font-semibold text-zinc-800">
                  How it works:
                </span>{" "}
                {hoursMethod.how}
              </p>
              <p className="mt-3 font-mono text-sm text-zinc-800">
                {hoursMethod.formula}
              </p>
              <p className="mt-4 text-sm font-semibold text-zinc-800">
                {hoursMethod.exampleLabel}
              </p>
              <ul className="mt-2 space-y-1 font-mono text-sm text-zinc-700">
                {hoursMethod.example.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                {hoursMethod.tail}
              </p>
            </article>

            {/* Sales */}
            <article className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="text-xl font-bold text-zinc-900">
                Split by sales — the people who sell more take more
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                <span className="font-semibold text-zinc-800">Who it fits:</span>{" "}
                {salesMethod.who}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                <span className="font-semibold text-zinc-800">
                  How it works:
                </span>{" "}
                {salesMethod.how}
              </p>
              <p className="mt-3 font-mono text-sm text-zinc-800">
                {salesMethod.formula}
              </p>
              <p className="mt-4 text-sm font-semibold text-zinc-800">
                {salesMethod.exampleLabel}
              </p>
              <ul className="mt-2 space-y-1 font-mono text-sm text-zinc-700">
                {salesMethod.example.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                {salesMethod.tail}
              </p>
            </article>

            {/* Points */}
            <article className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="text-xl font-bold text-zinc-900">
                Split by points — role weights for mixed teams
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                <span className="font-semibold text-zinc-800">Who it fits:</span>{" "}
                {pointsMethod.who}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                <span className="font-semibold text-zinc-800">
                  How it works:
                </span>{" "}
                {pointsMethod.how}
              </p>
              <p className="mt-3 font-mono text-sm text-zinc-800">
                {pointsMethod.formula}
              </p>
              <p className="mt-4 text-sm font-semibold text-zinc-800">
                {pointsMethod.exampleLabel}
              </p>
              <ul className="mt-2 space-y-1 font-mono text-sm text-zinc-700">
                {pointsMethod.example.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                {pointsMethod.tail}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* HOUSE RETENTION */}
      <section className="px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            House retention — take your cut off the top
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-700">
            {retention.body.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ROUNDING */}
      <section className="bg-zinc-50 px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Rounding you can verify
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-700">
            {rounding.body.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Built for the places that live on tips
          </h2>
          <ul className="mt-6 space-y-3 text-base leading-relaxed text-zinc-700">
            {audience.items.map((item) => (
              <li key={item.slice(0, 24)} className="flex gap-2">
                <span aria-hidden="true" className="text-zinc-400">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-zinc-700">
            {audience.free}
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-zinc-950 px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {finalCta.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-300">
            {finalCta.body}
          </p>
          <div className="mt-8">
            <Link href="/calculator" className={PRIMARY_BTN}>
              Open the calculator
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
            {faqItems.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-zinc-400 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LEGAL NOTE (verbatim, end of body) */}
      <p className="px-4 pb-4 text-center text-xs leading-relaxed text-zinc-500">
        {LEGAL_NOTE}
      </p>
    </main>
  );
}
