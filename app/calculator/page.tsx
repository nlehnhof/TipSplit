import type { Metadata } from "next";
import CalculatorClient from "./calculator-client";

export const metadata: Metadata = {
  title: "Tip Out Calculator — Split Tips by Hours, Sales, or Points",
  description:
    "Enter staff, hours, and the tip pool. Get a cent-exact split by hours, sales, or points, with house retention and reconciliation. No sign-up.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
