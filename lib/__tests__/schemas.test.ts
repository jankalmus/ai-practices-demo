import { describe, expect, it } from "vitest";

import {
  listFiltersSchema,
  toNewTransaction,
  transactionInputSchema,
} from "../schemas";

const validExpense = {
  type: "expense",
  name: "Coffee",
  amount: "4.50",
  date: "2026-06-10",
  category: "Food",
};

describe("transactionInputSchema", () => {
  it("accepts a valid expense and coerces the amount", () => {
    const result = transactionInputSchema.safeParse(validExpense);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(4.5);
    }
  });

  it("accepts a valid income", () => {
    const result = transactionInputSchema.safeParse({
      type: "income",
      name: "Salary",
      amount: 3850,
      date: "2026-06-01",
      category: "Salary",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an income category on an expense", () => {
    const result = transactionInputSchema.safeParse({
      ...validExpense,
      category: "Salary",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero, negative and >2-decimal amounts", () => {
    for (const amount of [0, -5, "12.345"]) {
      const result = transactionInputSchema.safeParse({
        ...validExpense,
        amount,
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejects a missing name and an invalid date", () => {
    expect(
      transactionInputSchema.safeParse({ ...validExpense, name: "  " }).success,
    ).toBe(false);
    expect(
      transactionInputSchema.safeParse({ ...validExpense, date: "tomorrow" })
        .success,
    ).toBe(false);
  });

  it("turns an empty description into undefined", () => {
    const result = transactionInputSchema.safeParse({
      ...validExpense,
      description: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeUndefined();
    }
  });
});

describe("toNewTransaction", () => {
  it("converts the euro amount to integer cents", () => {
    const parsed = transactionInputSchema.parse(validExpense);
    expect(toNewTransaction(parsed)).toEqual({
      type: "expense",
      name: "Coffee",
      description: undefined,
      amountCents: 450,
      date: "2026-06-10",
      category: "Food",
    });
  });

  it("avoids floating point drift", () => {
    const parsed = transactionInputSchema.parse({
      ...validExpense,
      amount: "0.07",
    });
    expect(toNewTransaction(parsed).amountCents).toBe(7);
  });
});

describe("listFiltersSchema", () => {
  it("accepts valid filters and an empty object", () => {
    expect(listFiltersSchema.safeParse({}).success).toBe(true);
    expect(
      listFiltersSchema.safeParse({
        type: "expense",
        category: "Food",
        month: "2026-06",
      }).success,
    ).toBe(true);
  });

  it("rejects unknown types and malformed months", () => {
    expect(listFiltersSchema.safeParse({ type: "loan" }).success).toBe(false);
    expect(listFiltersSchema.safeParse({ month: "June" }).success).toBe(false);
    expect(listFiltersSchema.safeParse({ month: "2026-13" }).success).toBe(
      false,
    );
  });
});
