/**
 * @file lib/__tests__/aggregate.test.ts
 * @model claude-sonnet-4-6
 * @description Unit tests for aggregate helpers.
 * @feature Core data layer
 * @updated 2026-06-16
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

describe("categoryStats", () => {
  const foodTxs = fixture.filter((tx) => tx.category === "Food");

  it("returns nulls and zero for an empty list", () => {
    expect(categoryStats([])).toEqual({
      lastDate: null,
      averageCents: 0,
      largestTx: null,
      smallestTx: null,
    });
  });

  it("identifies the most recent date", () => {
    expect(categoryStats(foodTxs).lastDate).toBe("2026-06-13");
  });

  it("rounds the average to whole cents", () => {
    // (7500 + 8200) / 2 = 7850
    expect(categoryStats(foodTxs).averageCents).toBe(7_850);
  });

  it("picks the smallest and largest by amountCents", () => {
    const stats = categoryStats(foodTxs);
    expect(stats.smallestTx?.id).toBe("t3");
    expect(stats.largestTx?.id).toBe("t4");
  });

  it("returns the same tx for both extremes when there is only one transaction", () => {
    const stats = categoryStats([fixture[1]!]);
    expect(stats.smallestTx?.id).toBe(stats.largestTx?.id);
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
