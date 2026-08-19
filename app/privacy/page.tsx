import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — TipSplit",
  description:
    "How TipSplit handles your data: email for sign-in, saved rosters and shifts, and calculator inputs that stay in your browser. We don't sell personal data.",
};

const intro =
  "This policy explains what TipSplit collects, why we collect it, and what you can do about it. It's written in plain language on purpose — if any part is unclear, email support@tipsplit.app and we'll answer.";

const shortVersion =
  "**Short version:** TipSplit is a tip-distribution calculator. We collect only what's needed to run the service: an email address if you create an account, and the roster/shift data you choose to save. We don't sell personal data. You can delete your account and everything in it at any time.";

const sections = [
  {
    heading: "1. What we collect",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "**Calculator inputs (no account):** When you use the calculator without signing in — staff names, roles, hours, sales, and the tip pool — the math happens in your browser and nothing is saved to our servers. The data stays on your device until you leave the page.",
        "**Account data (when you sign in):** If you create an account, we collect:",
        "Your email address, for magic-link sign-in (we send you a link to log in; no password needed).",
        "Staff data you save: names, roles, hours, sales, and any tip pool entries.",
        "Shift history: the splits you save while signed in, plus any presets (split methods, role weights, retention) you create.",
        "**Payment data:** We don't see or store your card details. Payments for Pro are processed by Stripe, our payment provider, under their own privacy policy.",
      ],
    },
  },
  {
    heading: "2. Why we collect it",
    body: {
      type: "list" as const,
      items: [
        "Your email is used only to sign you in via magic link.",
        "Staff and shift data is used only to provide the service: so your saved roster, presets, and history are there when you return.",
        "We don't use your data for advertising, profiling, or selling to third parties. Full stop.",
      ],
    },
  },
  {
    heading: "3. Who we share it with (processors)",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "We use two service providers who process data on our behalf:",
        "**Supabase** — provides authentication (magic-link sign-in) and the database that stores account data. They store what we store.",
        "**Stripe** — processes Pro subscription payments. Stripe handles your payment details under their privacy policy; we only receive the fact that a subscription is active.",
        "We don't sell or rent your personal data to anyone, and we don't share it except with these processors to operate the service or where the law requires it.",
      ],
    },
  },
  {
    heading: "4. How long we keep it",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "We keep your account data for as long as your account exists, so your roster and history are available each shift. When you delete your account, we delete your stored staff data, presets, and shift history. (Calculator-only use, without an account, stores nothing on our servers.)",
      ],
    },
  },
  {
    heading: "5. Cookies and local storage",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "We use browser storage for authentication tokens (so you stay signed in) and to keep the current calculator state on your device. We don't use third-party advertising cookies.",
      ],
    },
  },
  {
    heading: "6. Your rights",
    body: {
      type: "list" as const,
      items: [
        "**Access** — see what data your account holds (it's all visible in the app).",
        "**Correct** — edit or remove staff, shifts, or your email.",
        "**Delete** — delete your account and all associated data.",
        "**Ask questions** — email support@tipsplit.app and we'll help.",
      ],
    },
  },
  {
    heading: "7. Children",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "TipSplit is a business tool for adults managing staff. We don't knowingly collect data from children.",
      ],
    },
  },
  {
    heading: "8. Changes to this policy",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "If we change this policy, we'll update it here and note the new effective date. Material changes will be flagged on the site.",
      ],
    },
  },
  {
    heading: "9. Contact",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "Questions, corrections, or deletion requests: **support@tipsplit.app**.",
      ],
    },
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="August 18, 2026"
      intro={[intro, shortVersion]}
      sections={sections}
      contact="Questions, corrections, or deletion requests: support@tipsplit.app."
    />
  );
}
