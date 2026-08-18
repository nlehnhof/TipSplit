"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  buildSummaryText,
  computeSplit,
  formatCents,
  type SplitInput,
  type SplitMethod,
} from "@/lib/splits";

const ROLES = ["server", "busser", "bartender", "other"] as const;
type Role = (typeof ROLES)[number];

type Row = {
  id: string;
  name: string;
  role: Role;
  hours: string;
  sales: string;
};

const ROLE_LABELS: Record<Role, string> = {
  server: "Server",
  busser: "Busser",
  bartender: "Bartender",
  other: "Other",
};

const DEFAULT_WEIGHTS: Record<Role, string> = {
  server: "1",
  busser: "0.5",
  bartender: "0.75",
  other: "1",
};

const METHODS: { value: SplitMethod; label: string }[] = [
  { value: "hours", label: "Hours" },
  { value: "sales", label: "Sales" },
  { value: "points", label: "Points" },
];

let idCounter = 0;
function makeId(): string {
  try {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `row-${Date.now()}-${idCounter++}`;
  } catch {
    return `row-${Date.now()}-${idCounter++}`;
  }
}

function newRow(): Row {
  return { id: makeId(), name: "", role: "server", hours: "", sales: "" };
}

/** "12.5" → 12.5; empty/garbage → 0. */
function toNum(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** Dollars string → integer cents (rounded). */
function toCents(dollars: string): number {
  return Math.round(toNum(dollars) * 100);
}

export default function CalculatorClient() {
  const [poolDollars, setPoolDollars] = useState("");
  const [housePct, setHousePct] = useState("0");
  const [method, setMethod] = useState<SplitMethod>("hours");
  const [rows, setRows] = useState<Row[]>(() => [newRow()]);
  const [weights, setWeights] = useState<Record<Role, string>>({
    ...DEFAULT_WEIGHTS,
  });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  /** Id of a freshly added row whose name field still needs focus. */
  const pendingFocusRef = useRef<string | null>(null);

  const input: SplitInput = useMemo(
    () => ({
      entries: rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        hours: toNum(r.hours),
        sales: toNum(r.sales),
      })),
      method,
      roleWeights: Object.fromEntries(
        (Object.keys(weights) as Role[]).map((role) => [
          role,
          toNum(weights[role]),
        ])
      ),
      poolCents: toCents(poolDollars),
      housePct: toNum(housePct),
    }),
    [rows, method, weights, poolDollars, housePct]
  );

  const result = useMemo(() => computeSplit(input), [input]);

  const addRow = useCallback(() => {
    const row = newRow();
    setRows((prev) => [...prev, row]);
    // Focused by the name input's callback ref when it mounts.
    pendingFocusRef.current = row.id;
  }, []);

  const updateRow = useCallback((id: string, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const focusField = useCallback((id: string, field: string) => {
    inputRefs.current[`${id}:${field}`]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, row: Row, field: string) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (field === "name") focusField(row.id, "hours");
      else if (field === "hours") focusField(row.id, "sales");
      else if (field === "sales") addRow();
    },
    [addRow, focusField]
  );

  const copySummary = useCallback(async () => {
    const text = buildSummaryText(input, result);
    setCopyError(null);
    try {
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        // Fallback for older browsers / non-secure contexts.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand("copy");
        } catch {
          ok = false;
        } finally {
          document.body.removeChild(ta);
        }
      }
      if (!ok) throw new Error("clipboard unavailable");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Every failure path lands here — never an unhandled rejection.
      setCopyError(
        "Couldn't copy automatically — long-press the summary to select it manually."
      );
    }
  }, [input, result]);

  const poolCents = input.poolCents;
  const hasRows = rows.length > 0;
  const hasPool = poolCents > 0;
  const showResults = hasRows && hasPool && result.validationErrors.length === 0;
  const shareById = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of result.entries) map.set(e.id, e.shareCents);
    return map;
  }, [result]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Tip calculator
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600">
          Enter tonight&apos;s tip pool and your staff — every share updates as
          you type. No account required.
        </p>
      </header>

      {/* ── Pool + house retention ─────────────────────────────── */}
      <section aria-label="Tip pool" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-end gap-3">
          <label className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Tip pool
            </span>
            <span className="flex h-14 items-center rounded-lg border border-zinc-300 bg-white px-3 focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10">
              <span className="text-2xl font-semibold text-zinc-400">$</span>
              <input
                ref={(el) => {
                  inputRefs.current["pool"] = el;
                }}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                autoFocus
                value={poolDollars}
                onChange={(e) => setPoolDollars(e.target.value)}
                placeholder="0.00"
                aria-label="Tip pool in dollars"
                className="w-full min-w-0 bg-transparent text-3xl font-bold tabular-nums text-zinc-900 outline-none placeholder:text-zinc-300"
              />
            </span>
          </label>
          <label className="flex w-24 shrink-0 flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              House %
            </span>
            <span className="flex h-14 items-center rounded-lg border border-zinc-300 bg-white px-3 focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10">
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={housePct}
                onChange={(e) => setHousePct(e.target.value)}
                onBlur={() => {
                  const n = toNum(housePct);
                  const clamped = Math.min(100, Math.max(0, n));
                  setHousePct(String(clamped));
                }}
                aria-label="House retention percentage"
                className="w-full min-w-0 bg-transparent text-lg font-semibold tabular-nums text-zinc-900 outline-none placeholder:text-zinc-300"
              />
              <span className="text-sm font-medium text-zinc-400">%</span>
            </span>
          </label>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          House retention is taken off the top, before the split — the rest is
          distributable.
        </p>
      </section>

      {/* ── Method ─────────────────────────────────────────────── */}
      <section aria-label="Split method">
        <div
          role="group"
          aria-label="Split method"
          className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1"
        >
          {METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              aria-pressed={method === m.value}
              onClick={() => setMethod(m.value)}
              className={`h-11 rounded-lg text-sm font-semibold transition ${
                method === m.value
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          {method === "hours" &&
            "Hours: everyone gets a share of the pool proportional to hours worked."}
          {method === "sales" &&
            "Sales: everyone gets a share proportional to their sales for the shift."}
          {method === "points" &&
            "Points: hours × role weight. Servers earn more points per hour than bussers."}
        </p>
      </section>

      {/* ── Role weights (points only) ─────────────────────────── */}
      {method === "points" && (
        <section
          aria-label="Role weights"
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-zinc-900">Role weights</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Points per hour for each role (minimum 0.01).
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ROLES.map((role) => (
              <label key={role} className="flex flex-col gap-1">
                <span className="text-xs font-medium capitalize text-zinc-600">
                  {ROLE_LABELS[role]}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={weights[role]}
                  onChange={(e) =>
                    setWeights((prev) => ({ ...prev, [role]: e.target.value }))
                  }
                  onBlur={() => {
                    const n = toNum(weights[role]);
                    setWeights((prev) => ({
                      ...prev,
                      [role]: String(n > 0 && n >= 0.01 ? n : 0.01),
                    }));
                  }}
                  aria-label={`${ROLE_LABELS[role]} weight per hour`}
                  className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-base font-semibold tabular-nums text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {/* ── Staff rows ─────────────────────────────────────────── */}
      <section aria-label="Staff">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Staff</h2>
          <span className="text-xs text-zinc-500">
            {rows.length} {rows.length === 1 ? "person" : "people"}
          </span>
        </div>

        <ul className="mt-2 flex flex-col gap-3">
          {rows.map((row) => {
            const shareCents = shareById.get(row.id) ?? 0;
            return (
              <li
                key={row.id}
                className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={(el) => {
                      inputRefs.current[`${row.id}:name`] = el;
                      if (el && pendingFocusRef.current === row.id) {
                        pendingFocusRef.current = null;
                        el.focus();
                      }
                    }}
                    type="text"
                    autoComplete="off"
                    value={row.name}
                    onChange={(e) =>
                      updateRow(row.id, { name: e.target.value })
                    }
                    onKeyDown={(e) => handleKeyDown(e, row, "name")}
                    placeholder="Name"
                    aria-label={`Name for staff member ${rows.indexOf(row) + 1}`}
                    className="h-11 min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-base text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  />
                  <span
                    aria-live="polite"
                    className="w-20 shrink-0 text-right text-lg font-bold tabular-nums text-zinc-900"
                  >
                    {showResults ? formatCents(shareCents) : "—"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    aria-label={`Remove ${row.name || "this staff member"}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <label className="flex min-w-0 flex-col gap-1">
                    <span className="text-[11px] font-medium text-zinc-500">
                      Role
                    </span>
                    <select
                      value={row.role}
                      onChange={(e) =>
                        updateRow(row.id, {
                          role: e.target.value as Role,
                        })
                      }
                      aria-label={`Role for ${row.name || `staff member ${rows.indexOf(row) + 1}`}`}
                      className="h-11 rounded-lg border border-zinc-300 bg-white px-2 text-base text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex min-w-0 flex-col gap-1">
                    <span className="text-[11px] font-medium text-zinc-500">
                      Hours
                    </span>
                    <input
                      ref={(el) => {
                        inputRefs.current[`${row.id}:hours`] = el;
                      }}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={row.hours}
                      onChange={(e) =>
                        updateRow(row.id, { hours: e.target.value })
                      }
                      onKeyDown={(e) => handleKeyDown(e, row, "hours")}
                      placeholder="0"
                      aria-label={`Hours worked by ${row.name || `staff member ${rows.indexOf(row) + 1}`}`}
                      className="h-11 min-w-0 rounded-lg border border-zinc-300 bg-white px-3 text-base tabular-nums text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1">
                    <span className="text-[11px] font-medium text-zinc-500">
                      Sales
                    </span>
                    <input
                      ref={(el) => {
                        inputRefs.current[`${row.id}:sales`] = el;
                      }}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={row.sales}
                      onChange={(e) =>
                        updateRow(row.id, { sales: e.target.value })
                      }
                      onKeyDown={(e) => handleKeyDown(e, row, "sales")}
                      placeholder="0"
                      aria-label={`Sales in dollars by ${row.name || `staff member ${rows.indexOf(row) + 1}`}`}
                      className="h-11 min-w-0 rounded-lg border border-zinc-300 bg-white px-3 text-base tabular-nums text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                    />
                  </label>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={addRow}
          className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-zinc-300 text-sm font-semibold text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
        >
          <span className="text-lg leading-none">+</span> Add staff
        </button>
        <p className="mt-2 text-center text-xs text-zinc-500">
          Press Enter in the Sales field to add the next row.
        </p>
      </section>

      {/* ── Results ────────────────────────────────────────────── */}
      <section
        aria-label="Results"
        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
      >
        {!showResults ? (
          <div className="rounded-lg bg-zinc-50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-zinc-700">
              {!hasPool && !hasRows
                ? "Enter tonight's tip pool and add your staff — every share appears here as you type."
                : !hasPool
                  ? "Enter the tip pool to see each person's share."
                  : "Add at least one staff member with the fields above."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-zinc-50 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Distributable
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-zinc-900">
                {formatCents(result.distributableCents)}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                House
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-zinc-900">
                {formatCents(result.houseRetentionCents)}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Pool
              </p>
              <p className="mt-0.5 text-lg font-bold tabular-nums text-zinc-900">
                {formatCents(poolCents)}
              </p>
            </div>
          </div>
        )}

        {result.validationErrors.length > 0 && (
          <ul className="mt-3 rounded-lg bg-amber-50 px-3 py-2.5">
            {result.validationErrors.map((err) => (
              <li key={err} className="text-sm font-medium text-amber-800">
                {err}
              </li>
            ))}
          </ul>
        )}

        {/* Trust line — always visible, computed from the real values. */}
        <p className="mt-4 text-center text-base font-semibold tabular-nums text-zinc-900">
          Split {formatCents(result.distributableCents)} + house{" "}
          {formatCents(result.houseRetentionCents)} = pool{" "}
          {formatCents(poolCents)} ✓
        </p>
        {result.remainderCents > 0 && showResults && (
          <p className="mt-1 text-center text-xs text-zinc-500">
            Rounding: {result.remainderCents}
            {result.remainderCents === 1 ? " cent" : " cents"} remainder
            assigned to the staffer with the most hours.
          </p>
        )}

        <div className="mt-4">
          <button
            type="button"
            onClick={copySummary}
            disabled={!showResults}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {copied ? (
              <>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                    clipRule="evenodd"
                  />
                </svg>
                Copied ✓
              </>
            ) : (
              "Copy summary"
            )}
          </button>
          {copyError && (
            <p className="mt-2 text-center text-xs font-medium text-red-600">
              {copyError}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
