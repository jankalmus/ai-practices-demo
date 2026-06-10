import { describe, expect, it } from "vitest";

import {
  availableMonths,
  byCategory,
  formatCents,
  formatDate,
  monthLabel,
  summarize,
} from "../aggregate";
import type { Transaction } from "../schemas";

const fixture: Transaction[] = [
  { id: "t1", type: "income", name: "Salary", amountCents: 385_000, date: "2026-06-01", category: "Salary" },
  { id: "t2", type: "expense", name: "Rent", amountCents: 125_000, date: "2026-06-03", category: "Housing" },
  { id: "t3", type: "expense", name: "Groceries", amountCents: 7_500, date: "2026-06-06", category: "Food" },
  { id: "t4", type: "expense", name: "Groceries", amountCents: 8_200, date: "2026-06-13", category: "Food" },
  { id: "t5", type: "expense", name: "Fuel", amountCents: 6_500, date: "2026-05-10", category: "Transport" },
  { id: "t6", type: "income", name: "Dividend", amountCents: 4_500, date: "2026-04-08", category: "Investments" },
];

describe("summarize", () => {
  it("totals income, expenses and balance", () => {
    expect(summarize(fixture)).toEqual({
      incomeCents: 389_500,
      expenseCents: 147_200,
      balanceCents: 242_300,
    });
  });

  it("returns zeroes for an empty list", () => {
    expect(summarize([])).toEqual({
      incomeCents: 0,
      expenseCents: 0,
      balanceCents: 0,
    });
  });
});

describe("byCategory", () => {
  it("groups one type, sorted by total descending", () => {
    const rows = byCategory(fixture, "expense");
    expect(rows.map((row) => row.category)).toEqual([
      "Housing",
      "Food",
      "Transport",
    ]);
    expect(rows[1]).toMatchObject({ category: "Food", totalCents: 15_700 });
  });

  it("computes shares that sum to 1", () => {
    const rows = byCategory(fixture, "expense");
    const total = rows.reduce((sum, row) => sum + row.share, 0);
    expect(total).toBeCloseTo(1);
  });

  it("returns an empty list when there is no data", () => {
    expect(byCategory([], "income")).toEqual([]);
  });
});

describe("availableMonths", () => {
  it("returns distinct months, newest first", () => {
    expect(availableMonths(fixture)).toEqual(["2026-06", "2026-05", "2026-04"]);
  });
});

describe("formatters", () => {
  it("formats cents as EUR", () => {
    expect(formatCents(123_456)).toBe("€1,234.56");
    expect(formatCents(450)).toBe("€4.50");
  });

  it("labels months and dates", () => {
    expect(monthLabel("2026-06")).toBe("June 2026");
    expect(formatDate("2026-06-10")).toBe("10 Jun");
  });
});
