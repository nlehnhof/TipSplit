import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — TipSplit",
  description:
    "The terms for using TipSplit, a tip-distribution calculator. What's covered, Pro billing and cancellation, your responsibilities, and our disclaimers.",
};

const LEGAL_NOTE =
  "TipSplit is a calculator. It does not process payments or file taxes. Tip pooling law varies by jurisdiction — confirm your split complies with local wage law.";

const intro =
  'These Terms of Service ("Terms") govern your use of TipSplit, a web-based tip-distribution calculator for restaurant, bar, and salon managers. By using TipSplit, you agree to these Terms. If you don\'t agree, don\'t use the service.';

const sections = [
  {
    heading: "1. What TipSplit is",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "TipSplit is a calculator tool. You enter staff, hours, sales, a tip pool, and a split method; it computes the resulting distribution. That's the whole service, and these Terms are written for exactly that.",
        LEGAL_NOTE,
        "Nothing in this service constitutes legal, tax, or payroll advice, and TipSplit is not a payroll provider, a bank, or a law firm. You are responsible for deciding how to pay your staff, for verifying your split complies with the wage and hour laws that apply where you operate, and for your payroll and tax obligations. When in doubt about the law, consult a qualified attorney.",
      ],
    },
  },
  {
    heading: "2. Accounts and access",
    body: {
      type: "list" as const,
      items: [
        "**No account needed for the calculator.** The core calculator works without signing up, and staff never need accounts.",
        "**Sign-in is via magic link.** If you create an account, we email you a link to sign in. You're responsible for keeping your email account secure, since anyone who can read your sign-in email can access your TipSplit account.",
        "**One account per user.** You may not share your account in a way that lets unrelated people save data under your identity, and you're responsible for activity under your account.",
      ],
    },
  },
  {
    heading: "3. Pro subscription",
    body: {
      type: "list" as const,
      items: [
        "Pro is a paid subscription billed **monthly** through Stripe Checkout at the price shown on the pricing page (currently **$12/month**).",
        "**Billing:** your card is charged monthly until you cancel. Payment terms are set by Stripe's services as well as these Terms.",
        "**Cancellation:** you can cancel anytime from your account (or by contacting support@tipsplit.app). After cancellation you keep Pro access until the end of the period you've already paid for, then the account reverts to Free.",
        "**No refunds for partial months:** if you cancel partway through a billing month, you won't be charged again, but the month already paid for isn't refunded. We don't refund for partial months or for periods unused.",
        "**Price changes:** if we change the Pro price, we'll tell you in advance; the new price applies from your next billing cycle, and you can cancel before it takes effect.",
      ],
    },
  },
  {
    heading: "4. Acceptable use",
    body: {
      type: "list" as const,
      items: [
        "For any unlawful purpose, or in violation of any wage, labor, or other law applicable to you.",
        "To process payments, run payroll, or hold yourself out as providing legal, tax, or accounting services through TipSplit.",
        "To attempt to disrupt, reverse-engineer, or abuse the service, or to access other users' data.",
        "To input unlawful content or impersonate other people.",
      ],
    },
  },
  {
    heading: "5. Your data and our IP",
    body: {
      type: "list" as const,
      items: [
        "**You own your data.** The staff rosters, shift records, and presets you save are yours. You grant TipSplit a limited license to store and process them solely to provide the service to you.",
        "**We own the service.** TipSplit (the name, software, and site) is our property. Nothing here transfers any rights in the service to you.",
      ],
    },
  },
  {
    heading: "6. Disclaimers",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        'The service is provided **"as is"** and **"as available"**, without warranties of any kind, express or implied — including fitness for a particular purpose and non-infringement.',
        "**Calculator accuracy is your responsibility to verify.** We work to make the math correct, but you are responsible for reviewing each split before you act on it — including the reconciliation line — and for confirming it complies with the laws that apply to you. TipSplit doesn't guarantee that any particular split is legal, complete, or suitable for your business.",
        "We don't guarantee uninterrupted availability; the service may be unavailable for maintenance, outages, or reasons outside our control.",
      ],
    },
  },
  {
    heading: "7. Limitation of liability",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "To the maximum extent permitted by law, TipSplit's total liability for any claim arising from or related to the service is limited to the amount you paid for Pro in the three months before the claim (or, if you're on Free, zero). In no event will TipSplit be liable for indirect, incidental, special, or consequential damages — including lost wages, lost profits, or data loss — even if advised of the possibility. Because tips and pay are involved, take this seriously: **verify every split before you post it.**",
      ],
    },
  },
  {
    heading: "8. Termination",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "You can stop using TipSplit at any time and delete your account (which removes your stored data). We may suspend or terminate access if you breach these Terms, use the service unlawfully, or if we discontinue the service; we'll notify you where reasonably possible. Termination doesn't waive payment obligations already incurred.",
      ],
    },
  },
  {
    heading: "9. Changes to these Terms",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "We may update these Terms from time to time. We'll post the revised Terms here with a new effective date; for material changes we'll make reasonable efforts to notify you (for example, in-app or by email). Continued use of TipSplit after changes take effect means you accept them.",
      ],
    },
  },
  {
    heading: "10. Governing law",
    body: {
      type: "paragraphs" as const,
      paragraphs: [
        "These Terms are governed by the laws of the jurisdiction where the user is located, without regard to conflict-of-law rules. You agree to resolve any disputes in the courts of that jurisdiction.",
      ],
    },
  },
  {
    heading: "11. Contact",
    body: {
      type: "paragraphs" as const,
      paragraphs: ["Questions about these Terms: **support@tipsplit.app**."],
    },
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      effectiveDate="August 18, 2026"
      intro={[intro]}
      sections={sections}
      contact="Questions about these Terms: support@tipsplit.app."
    />
  );
}
