import { beforeEach, describe, expect, it } from "vitest";

import type { Transaction } from "../schemas";
import {
  addTransaction,
  deleteTransaction,
  getTransaction,
  listTransactions,
  resetStore,
} from "../store";

const coffee: Omit<Transaction, "id"> = {
  type: "expense",
  name: "Coffee",
  amountCents: 450,
  date: "2026-06-01",
  category: "Food",
};

const salary: Omit<Transaction, "id"> = {
  type: "income",
  name: "Salary",
  amountCents: 385_000,
  date: "2026-06-05",
  category: "Salary",
};

const mayRent: Omit<Transaction, "id"> = {
  type: "expense",
  name: "Rent",
  amountCents: 125_000,
  date: "2026-05-03",
  category: "Housing",
};

beforeEach(() => {
  resetStore([]);
});

describe("addTransaction", () => {
  it("assigns an id and stores the transaction", () => {
    const created = addTransaction(coffee);
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(listTransactions()).toEqual([created]);
  });
});

describe("listTransactions", () => {
  it("sorts by date descending, then name ascending", () => {
    addTransaction(coffee);
    addTransaction(salary);
    addTransaction(mayRent);
    expect(listTransactions().map((tx) => tx.name)).toEqual([
      "Salary",
      "Coffee",
      "Rent",
    ]);
  });

  it("filters by type, category and month", () => {
    addTransaction(coffee);
    addTransaction(salary);
    addTransaction(mayRent);

    expect(listTransactions({ type: "income" }).map((tx) => tx.name)).toEqual([
      "Salary",
    ]);
    expect(
      listTransactions({ category: "Housing" }).map((tx) => tx.name),
    ).toEqual(["Rent"]);
    expect(listTransactions({ month: "2026-06" })).toHaveLength(2);
    expect(
      listTransactions({ type: "expense", month: "2026-06" }).map(
        (tx) => tx.name,
      ),
    ).toEqual(["Coffee"]);
  });

  it("returns a defensive copy", () => {
    addTransaction(coffee);
    listTransactions().pop();
    expect(listTransactions()).toHaveLength(1);
  });
});

describe("getTransaction", () => {
  it("finds a transaction by id", () => {
    const created = addTransaction(coffee);
    expect(getTransaction(created.id)).toEqual(created);
    expect(getTransaction("missing")).toBeUndefined();
  });
});

describe("deleteTransaction", () => {
  it("removes an existing transaction and reports unknown ids", () => {
    const created = addTransaction(coffee);
    expect(deleteTransaction(created.id)).toBe(true);
    expect(listTransactions()).toHaveLength(0);
    expect(deleteTransaction(created.id)).toBe(false);
  });
});
