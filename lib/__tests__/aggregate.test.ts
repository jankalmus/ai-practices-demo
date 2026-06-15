/**
 * @file lib/__tests__/aggregate.test.ts
 * @model claude-sonnet-4-6
 * @description Tests for aggregate utility functions including categoryStats.
 * @feature category-detail-page
 * @updated 2026-06-15
 */

import { describe, expect, it } from "vitest";

import {
  availableMonths,
  byCategory,
  categoryStats,
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

describe("categoryStats", () => {
  it("returns null for an empty array", () => {
    expect(categoryStats([])).toBeNull();
  });

  it("computes avgFrequencyPerMonth as count / distinct months", () => {
    // 3 txns across 2 distinct months → 1.5
    const txns: typeof fixture = [
      { id: "a1", type: "expense", name: "Groceries", amountCents: 5_000, date: "2026-06-01", category: "Food" },
      { id: "a2", type: "expense", name: "Groceries", amountCents: 6_000, date: "2026-06-15", category: "Food" },
      { id: "a3", type: "expense", name: "Groceries", amountCents: 7_000, date: "2026-05-10", category: "Food" },
    ];
    const stats = categoryStats(txns);
    expect(stats?.avgFrequencyPerMonth).toBe(1.5);
  });

  it("computes avgAmountCents as rounded mean", () => {
    const txns: typeof fixture = [
      { id: "b1", type: "expense", name: "Coffee", amountCents: 300, date: "2026-06-01", category: "Food" },
      { id: "b2", type: "expense", name: "Lunch", amountCents: 1_000, date: "2026-06-02", category: "Food" },
    ];
    // mean = 650
    const stats = categoryStats(txns);
    expect(stats?.avgAmountCents).toBe(650);
  });

  it("rounds avgAmountCents to whole cents", () => {
    const txns: typeof fixture = [
      { id: "c1", type: "expense", name: "A", amountCents: 100, date: "2026-06-01", category: "Food" },
      { id: "c2", type: "expense", name: "B", amountCents: 200, date: "2026-06-02", category: "Food" },
      { id: "c3", type: "expense", name: "C", amountCents: 300, date: "2026-06-03", category: "Food" },
    ];
    // mean = 200 exactly; change c3 to 301 → mean = 200.33... → rounds to 200
    const txns2 = [
      ...txns.slice(0, 2),
      { ...txns[2], amountCents: 301 },
    ];
    const stats = categoryStats(txns2);
    expect(stats?.avgAmountCents).toBe(200);
  });

  it("sets lastDate to the most recent date regardless of input order", () => {
    // ASC order — the function must derive lastDate via string comparison, not index 0
    const txns: typeof fixture = [
      { id: "d1", type: "expense", name: "A", amountCents: 300, date: "2026-05-10", category: "Food" },
      { id: "d2", type: "expense", name: "B", amountCents: 500, date: "2026-06-15", category: "Food" },
    ];
    const stats = categoryStats(txns);
    expect(stats?.lastDate).toBe("2026-06-15");
  });

  it("identifies minTx and maxTx correctly", () => {
    const txns: typeof fixture = [
      { id: "e1", type: "expense", name: "Small", amountCents: 200, date: "2026-06-01", category: "Food" },
      { id: "e2", type: "expense", name: "Medium", amountCents: 1_000, date: "2026-06-02", category: "Food" },
      { id: "e3", type: "expense", name: "Large", amountCents: 5_000, date: "2026-06-03", category: "Food" },
    ];
    const stats = categoryStats(txns);
    expect(stats?.minTx).toEqual({ name: "Small", amountCents: 200 });
    expect(stats?.maxTx).toEqual({ name: "Large", amountCents: 5_000 });
  });

  it("handles a single transaction (all values collapse to that one)", () => {
    const txns: typeof fixture = [
      { id: "f1", type: "expense", name: "Solo", amountCents: 999, date: "2026-06-10", category: "Food" },
    ];
    const stats = categoryStats(txns);
    expect(stats).toEqual({
      avgFrequencyPerMonth: 1,
      avgAmountCents: 999,
      lastDate: "2026-06-10",
      minTx: { name: "Solo", amountCents: 999 },
      maxTx: { name: "Solo", amountCents: 999 },
    });
  });

  it("uses distinct month count as frequency denominator across multiple months", () => {
    // 4 txns across 3 months → 4/3 ≈ 1.333...
    const txns: typeof fixture = [
      { id: "g1", type: "expense", name: "A", amountCents: 100, date: "2026-06-01", category: "Food" },
      { id: "g2", type: "expense", name: "B", amountCents: 200, date: "2026-05-01", category: "Food" },
      { id: "g3", type: "expense", name: "C", amountCents: 300, date: "2026-04-01", category: "Food" },
      { id: "g4", type: "expense", name: "D", amountCents: 400, date: "2026-06-15", category: "Food" },
    ];
    const stats = categoryStats(txns);
    expect(stats?.avgFrequencyPerMonth).toBeCloseTo(4 / 3);
  });
});
