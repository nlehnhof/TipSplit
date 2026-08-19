import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TipSplit — Tip Out & Tip Pooling Calculator",
  description:
    "TipSplit is a mobile-first tip distribution calculator for restaurant, bar, and salon managers. Split end-of-shift tips by hours, sales, or points in under 60 seconds.",
};

const LEGAL_NOTE =
  "TipSplit is a calculator. It does not process payments or file taxes. Tip pooling law varies by jurisdiction — confirm your split complies with local wage law.";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto w-full max-w-3xl px-4 py-6">
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            >
              <Link
                href="/"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Home
              </Link>
              <Link
                href="/calculator"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Calculator
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Pricing
              </Link>
              <Link
                href="/privacy"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Terms
              </Link>
            </nav>
            <p className="mt-4 text-center text-xs leading-relaxed text-zinc-600">
              {LEGAL_NOTE}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
