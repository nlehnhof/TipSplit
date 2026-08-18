import { describe, expect, it } from "vitest";
import {
  buildCsvLine,
  buildSummaryText,
  computeSplit,
  formatCents,
  type SplitInput,
} from "./splits";

function ent(
  id: string,
  name: string,
  role: string,
  hours: number,
  sales: number
) {
  return { id, name, role, hours, sales };
}

function base(
  overrides: Partial<SplitInput> = {}
): SplitInput {
  return {
    entries: [],
    method: "hours",
    roleWeights: { server: 1, busser: 0.5, bartender: 0.75 },
    poolCents: 0,
    housePct: 0,
    ...overrides,
  };
}

describe("computeSplit — hours method", () => {
  it("divides exactly: $100 pool across 5/3/2 hours → 50/30/20", () => {
    const result = computeSplit(
      base({
        poolCents: 10_000,
        entries: [
          ent("a", "Alex", "server", 5, 0),
          ent("b", "Sam", "server", 3, 0),
          ent("c", "Jo", "busser", 2, 0),
        ],
      })
    );
    expect(result.validationErrors).toEqual([]);
    expect(result.entries.map((e) => e.shareCents)).toEqual([5000, 3000, 2000]);
    expect(result.houseRetentionCents).toBe(0);
    expect(result.distributableCents).toBe(10_000);
    expect(result.remainderCents).toBe(0);
  });

  it("assigns the remainder to the highest-hours staffer: $10 across 5/5/1", () => {
    const result = computeSplit(
      base({
        poolCents: 1000,
        entries: [
          ent("a", "Alex", "server", 5, 0),
          ent("b", "Sam", "server", 5, 0),
          ent("c", "Jo", "busser", 1, 0),
        ],
      })
    );
    // 1000 * 5/11 = 454.54… → 454; 1000 * 1/11 = 90.90… → 90; remainder 2¢.
    expect(result.entries.map((e) => e.shareCents)).toEqual([456, 454, 90]);
    expect(result.remainderCents).toBe(2);
    const sum = result.entries.reduce((s, e) => s + e.shareCents, 0);
    expect(sum).toBe(1000);
  });

  it("gives one staffer the single cent on a 1¢ pool with two equal staffers", () => {
    const result = computeSplit(
      base({
        poolCents: 1,
        entries: [
          ent("a", "Alex", "server", 5, 0),
          ent("b", "Sam", "server", 5, 0),
        ],
      })
    );
    // Tie on hours and sales → name ascending → Alex takes the 1¢ remainder.
    expect(result.entries.map((e) => e.shareCents)).toEqual([1, 0]);
    expect(result.remainderCents).toBe(1);
    expect(
      result.entries.reduce((s, e) => s + e.shareCents, 0) +
        result.houseRetentionCents
    ).toBe(1);
  });

  it("breaks the highest-hours tie by sales, then name, then id", () => {
    const result = computeSplit(
      base({
        poolCents: 1000,
        entries: [
          ent("b", "Sam", "server", 5, 10),
          ent("a", "Alex", "server", 5, 20),
          ent("c", "Jo", "busser", 1, 0),
        ],
      })
    );
    // Same hours (5) → higher sales (Alex 20 > Sam 10) gets the 2¢ remainder.
    expect(result.entries.find((e) => e.id === "a")!.shareCents).toBe(456);
    expect(result.entries.find((e) => e.id === "b")!.shareCents).toBe(454);
  });
});

describe("computeSplit — sales method", () => {
  it("splits $200 by sales 500/300/200 → 100/60/40", () => {
    const result = computeSplit(
      base({
        method: "sales",
        poolCents: 20_000,
        entries: [
          ent("a", "Alex", "server", 5, 500),
          ent("b", "Sam", "server", 4, 300),
          ent("c", "Jo", "busser", 6, 200),
        ],
      })
    );
    expect(result.validationErrors).toEqual([]);
    expect(result.entries.map((e) => e.shareCents)).toEqual([
      10_000, 6000, 4000,
    ]);
  });

  it("still rounds exactly when sales don't divide evenly", () => {
    const result = computeSplit(
      base({
        method: "sales",
        poolCents: 1000,
        entries: [
          ent("a", "Alex", "server", 0, 333),
          ent("b", "Sam", "server", 0, 333),
          ent("c", "Jo", "busser", 0, 334),
        ],
      })
    );
    expect(result.entries.map((e) => e.shareCents)).toEqual([333, 333, 334]);
    expect(result.remainderCents).toBe(0);
  });
});

describe("computeSplit — points method", () => {
  it("splits $120: server 1.0 × 8h vs busser 0.5 × 8h → 80/40", () => {
    const result = computeSplit(
      base({
        method: "points",
        poolCents: 12_000,
        roleWeights: { server: 1, busser: 0.5, bartender: 0.75 },
        entries: [
          ent("a", "Alex", "server", 8, 0),
          ent("c", "Jo", "busser", 8, 0),
        ],
      })
    );
    expect(result.validationErrors).toEqual([]);
    expect(result.entries.map((e) => e.shareCents)).toEqual([8000, 4000]);
  });

  it("honors an editable custom weight (server 2.0 → 96/24)", () => {
    const result = computeSplit(
      base({
        method: "points",
        poolCents: 12_000,
        roleWeights: { server: 2, busser: 0.5, bartender: 0.75 },
        entries: [
          ent("a", "Alex", "server", 8, 0),
          ent("c", "Jo", "busser", 8, 0),
        ],
      })
    );
    // weights 16 and 4 → 12000 * 16/20 = 9600, 12000 * 4/20 = 2400
    expect(result.entries.map((e) => e.shareCents)).toEqual([9600, 2400]);
  });

  it("defaults unknown roles to weight 1", () => {
    const result = computeSplit(
      base({
        method: "points",
        poolCents: 1000,
        roleWeights: { server: 1 },
        entries: [
          ent("a", "Alex", "server", 2, 0),
          ent("b", "Max", "manager", 2, 0),
        ],
      })
    );
    expect(result.entries.map((e) => e.shareCents)).toEqual([500, 500]);
  });
});

describe("computeSplit — house retention", () => {
  it("retains 5% of $200 → $10 house, $190 distributable", () => {
    const result = computeSplit(
      base({
        poolCents: 20_000,
        housePct: 5,
        entries: [
          ent("a", "Alex", "server", 5, 0),
          ent("b", "Sam", "server", 5, 0),
        ],
      })
    );
    expect(result.houseRetentionCents).toBe(1000);
    expect(result.distributableCents).toBe(19_000);
    expect(
      result.entries.reduce((s, e) => s + e.shareCents, 0)
    ).toBe(19_000);
  });

  it("clamps housePct to [0, 100]", () => {
    const over = computeSplit(
      base({ poolCents: 1000, housePct: 150, entries: [ent("a", "A", "server", 1, 0)] })
    );
    expect(over.houseRetentionCents).toBe(1000);
    expect(over.entries[0].shareCents).toBe(0);

    const under = computeSplit(
      base({ poolCents: 1000, housePct: -20, entries: [ent("a", "A", "server", 1, 0)] })
    );
    expect(under.houseRetentionCents).toBe(0);
    expect(under.entries[0].shareCents).toBe(1000);
  });

  it("keeps the reconciliation exact when retention leaves an odd distributable", () => {
    const result = computeSplit(
      base({
        poolCents: 10_003,
        housePct: 10,
        entries: [
          ent("a", "Alex", "server", 5, 0),
          ent("b", "Sam", "server", 5, 0),
          ent("c", "Jo", "busser", 1, 0),
        ],
      })
    );
    expect(result.houseRetentionCents).toBe(1000); // round(10003 * 10 / 100)
    expect(result.distributableCents).toBe(9003);
    const sum =
      result.entries.reduce((s, e) => s + e.shareCents, 0) +
      result.houseRetentionCents;
    expect(sum).toBe(10_003);
  });
});

describe("computeSplit — validation & robustness", () => {
  it("reports 'Enter the tip pool' when pool is 0 or negative", () => {
    for (const poolCents of [0, -100]) {
      const result = computeSplit(
        base({ poolCents, entries: [ent("a", "A", "server", 5, 0)] })
      );
      expect(result.validationErrors).toContain("Enter the tip pool");
      expect(result.entries[0].shareCents).toBe(0);
      expect(result.entries[0].shareCents).not.toBeNaN();
    }
  });

  it("errors on zero total hours for hours/points methods", () => {
    const byHours = computeSplit(
      base({ poolCents: 1000, entries: [ent("a", "A", "server", 0, 0)] })
    );
    expect(byHours.validationErrors).toContain(
      "Add hours for at least one staffer"
    );
    expect(byHours.entries[0].shareCents).toBe(0);

    const byPoints = computeSplit(
      base({
        method: "points",
        poolCents: 1000,
        entries: [ent("a", "A", "server", 0, 0)],
      })
    );
    expect(byPoints.validationErrors).toContain(
      "Add hours for at least one staffer"
    );
  });

  it("errors on zero total sales for the sales method", () => {
    const result = computeSplit(
      base({
        method: "sales",
        poolCents: 1000,
        entries: [ent("a", "A", "server", 5, 0)],
      })
    );
    expect(result.validationErrors).toContain(
      "Add sales for at least one staffer"
    );
    expect(result.entries[0].shareCents).toBe(0);
  });

  it("clamps negative hours/sales to 0 instead of crashing", () => {
    const result = computeSplit(
      base({
        poolCents: 1000,
        entries: [
          ent("a", "A", "server", -5, 0),
          ent("b", "B", "server", 5, 0),
        ],
      })
    );
    expect(result.validationErrors).toEqual([]);
    expect(result.entries[0].hours).toBe(0);
    expect(result.entries[0].shareCents).toBe(0);
    expect(result.entries[1].shareCents).toBe(1000);
  });

  it("returns zero shares (not NaN) when there are no entries", () => {
    const result = computeSplit(base({ poolCents: 1000 }));
    expect(result.entries).toEqual([]);
    expect(result.validationErrors).toContain(
      "Add hours for at least one staffer"
    );
  });
});

describe("computeSplit — reconciliation property", () => {
  const inputs: SplitInput[] = [
    base({
      poolCents: 10_000,
      entries: [
        ent("a", "Alex", "server", 5, 0),
        ent("b", "Sam", "server", 3, 0),
        ent("c", "Jo", "busser", 2, 0),
      ],
    }),
    base({
      poolCents: 10_013,
      entries: [
        ent("a", "Alex", "server", 5, 0),
        ent("b", "Sam", "server", 5, 0),
        ent("c", "Jo", "busser", 1, 0),
      ],
    }),
    base({
      method: "sales",
      poolCents: 7777,
      entries: [
        ent("a", "Alex", "server", 2, 333),
        ent("b", "Sam", "server", 2, 333),
        ent("c", "Jo", "busser", 2, 334),
      ],
    }),
    base({
      method: "points",
      poolCents: 12_345,
      housePct: 7.5,
      roleWeights: { server: 1, busser: 0.5, bartender: 0.75 },
      entries: [
        ent("a", "Alex", "server", 8, 0),
        ent("b", "Sam", "bartender", 8, 0),
        ent("c", "Jo", "busser", 6, 0),
      ],
    }),
    base({ poolCents: 1, entries: [ent("a", "A", "server", 7, 0)] }),
    base({
      poolCents: 100_001,
      housePct: 12,
      entries: [
        ent("a", "Alex", "server", 4.5, 0),
        ent("b", "Sam", "server", 4.25, 0),
        ent("c", "Jo", "busser", 3.75, 0),
      ],
    }),
  ];

  it("Σ shareCents + houseRetentionCents === poolCents for every input", () => {
    for (const input of inputs) {
      const result = computeSplit(input);
      const total =
        result.entries.reduce((s, e) => s + e.shareCents, 0) +
        result.houseRetentionCents;
      expect(total, JSON.stringify(input)).toBe(input.poolCents);
      for (const e of result.entries) {
        expect(Number.isInteger(e.shareCents)).toBe(true);
        expect(e.shareCents).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("summary + CSV helpers", () => {
  it("builds a readable clipboard summary", () => {
    const input = base({
      poolCents: 10_000,
      housePct: 5,
      entries: [
        ent("a", "Alex", "server", 5, 0),
        ent("b", "Sam", "server", 5, 0),
      ],
    });
    const result = computeSplit(input);
    const text = buildSummaryText(input, result);
    expect(text).toContain("Hours split");
    expect(text).toContain("Pool: $100.00");
    expect(text).toContain("House retention: 5% ($5.00)");
    expect(text).toContain("Distributable: $95.00");
    expect(text).toContain("Alex — $47.50");
    expect(text).toContain("Sam — $47.50");
  });

  it("formats cents with two decimal places", () => {
    expect(formatCents(0)).toBe("$0.00");
    expect(formatCents(1)).toBe("$0.01");
    expect(formatCents(1001)).toBe("$10.01");
  });

  it("quotes CSV cells that need it", () => {
    expect(buildCsvLine(["Alex", 4750])).toBe("Alex,4750");
    expect(buildCsvLine(["Doe, Jane", 100])).toBe('"Doe, Jane",100');
    expect(buildCsvLine(['say "hi"', 1])).toBe('"say ""hi""",1');
  });
});
