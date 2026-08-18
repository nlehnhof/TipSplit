import type { Metadata } from "next";
import CalculatorClient from "./calculator-client";

export const metadata: Metadata = {
  title:
    "Tip Out Calculator — Split Tips by Hours, Sales, or Points | TipSplit",
  description:
    "Free tip out calculator for restaurants, bars, and salons. Split the tip pool by hours, sales, or role points, take house retention, and get cent-exact shares in seconds. No account needed.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
