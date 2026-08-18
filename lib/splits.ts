/**
 * TipSplit core split engine — pure functions, no React, no I/O.
 *
 * Splits an end-of-shift tip pool across staff by one of three methods
 * (hours / sales / points), takes an optional house retention off the top,
 * and rounds to the exact cent with a deterministic remainder assignment so
 * that the reconciliation always holds by construction:
 *
 *   Σ shareCents + houseRetentionCents === poolCents
 */

export type StaffEntry = {
  id: string;
  name: string;
  role: string;
  hours: number;
  sales: number;
};

export type SplitMethod = "hours" | "sales" | "points";

export type SplitInput = {
  entries: StaffEntry[];
  method: SplitMethod;
  /** Role → weight used by the "points" method (server: 1, busser: 0.5, …). */
  roleWeights: Record<string, number>;
  /** The total tip pool in cents. */
  poolCents: number;
  /** House retention percentage, clamped to [0, 100]. */
  housePct: number;
};

export type SplitResultEntry = {
  id: string;
  name: string;
  role: string;
  hours: number;
  sales: number;
  shareCents: number;
};

export type SplitResult = {
  entries: SplitResultEntry[];
  houseRetentionCents: number;
  distributableCents: number;
  /** Cents left over after flooring every share; assigned to one staffer. */
  remainderCents: number;
  totalWeight: number;
  validationErrors: string[];
};

export const SPLIT_METHOD_LABELS: Record<SplitMethod, string> = {
  hours: "Hours",
  sales: "Sales",
  points: "Points",
};

export const DEFAULT_ROLE_WEIGHTS: Record<string, number> = {
  server: 1,
  busser: 0.5,
  bartender: 0.75,
};

/** Clamp a raw house percentage into [0, 100]. */
export function clampHousePct(housePct: number): number {
  if (!Number.isFinite(housePct)) return 0;
  return Math.min(100, Math.max(0, housePct));
}

/** Negative hours/sales are clamped to 0 (typos like "-1" shouldn't break a split). */
function clampNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/** Smallest of the tie-break keys; used to pick a single remainder recipient. */
function compareRemainderRecipient(a: StaffEntry, b: StaffEntry): number {
  if (a.hours !== b.hours) return b.hours - a.hours; // highest hours first
  if (a.sales !== b.sales) return b.sales - a.sales; // then higher sales
  const byName = a.name.localeCompare(b.name); // then name ascending
  if (byName !== 0) return byName;
  return a.id.localeCompare(b.id); // then id ascending (always a total order)
}

export function computeSplit(input: SplitInput): SplitResult {
  const { entries, method, roleWeights, poolCents, housePct } = input;
  const validationErrors: string[] = [];

  // 1. House retention (clamped) + distributable pool.
  const clampedHousePct = clampHousePct(housePct);
  const houseRetentionCents = Math.round((poolCents * clampedHousePct) / 100);
  const distributableCents = poolCents - houseRetentionCents;

  // 2. Sanitized entries (negative hours/sales clamped to 0).
  const clean = entries.map((e) => ({
    ...e,
    hours: clampNonNegative(e.hours),
    sales: clampNonNegative(e.sales),
  }));

  // 3. Validation.
  if (poolCents <= 0) {
    validationErrors.push("Enter the tip pool");
  }
  if (method !== "sales") {
    const totalHours = clean.reduce((sum, e) => sum + e.hours, 0);
    if (totalHours === 0) {
      validationErrors.push("Add hours for at least one staffer");
    }
  }
  if (method === "sales") {
    const totalSales = clean.reduce((sum, e) => sum + e.sales, 0);
    if (totalSales === 0) {
      validationErrors.push("Add sales for at least one staffer");
    }
  }

  const invalid = validationErrors.length > 0;

  // 4. Weights per method.
  const weightOf = (e: StaffEntry): number => {
    if (method === "hours") return e.hours;
    if (method === "sales") return e.sales;
    // points: role weight × hours (unknown roles default to 1.0)
    const weight = roleWeights[e.role];
    const roleWeight = Number.isFinite(weight) && weight! >= 0 ? weight! : 1;
    return roleWeight * e.hours;
  };
  const weights = clean.map(weightOf);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  // A points split where every role weight is 0 would divide by zero below.
  if (method === "points" && totalWeight === 0) {
    validationErrors.push("Set a positive weight for at least one role");
  }

  // 5. Cents-exact rounding: floor each raw share, hand the leftover
  //    remainder to the single highest-hours entry (deterministic tie-break).
  let remainderCents = 0;
  const shareCents = clean.map((e, i) => {
    if (invalid || totalWeight === 0) return 0;
    const raw = (distributableCents * weights[i]) / totalWeight;
    return Math.floor(raw);
  });
  if (!invalid && totalWeight > 0) {
    const floored = shareCents.reduce((sum, s) => sum + s, 0);
    remainderCents = distributableCents - floored;
    if (remainderCents > 0) {
      const recipientIndex = clean.reduce(
        (best, e, i) =>
          compareRemainderRecipient(e, clean[best]) < 0 ? i : best,
        0
      );
      shareCents[recipientIndex] += remainderCents;
    }
  }

  return {
    entries: clean.map((e, i) => ({ ...e, shareCents: shareCents[i] })),
    houseRetentionCents,
    distributableCents,
    remainderCents,
    totalWeight,
    validationErrors,
  };
}

/** Format integer cents as "$12.34" (handles the 0.29-style float edge via toFixed). */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Plain-text clipboard summary: method, pool, house %, distributable total,
 * and one "Name — $X.XX" line per person.
 */
export function buildSummaryText(input: SplitInput, result: SplitResult): string {
  const methodLabel = SPLIT_METHOD_LABELS[input.method];
  const lines = [
    `TipSplit — ${methodLabel} split`,
    `Pool: ${formatCents(input.poolCents)}`,
    `House retention: ${clampHousePct(input.housePct)}% (${formatCents(
      result.houseRetentionCents
    )})`,
    `Distributable: ${formatCents(result.distributableCents)}`,
    "",
    ...result.entries.map(
      (e) => `${e.name || "Unnamed"} — ${formatCents(e.shareCents)}`
    ),
  ];
  return lines.join("\n");
}

/**
 * Minimal CSV cell helper for the later full CSV export: quotes any cell that
 * contains a comma, double-quote, or newline.
 */
export function buildCsvLine(values: (string | number)[]): string {
  return values
    .map((v) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(",");
}
