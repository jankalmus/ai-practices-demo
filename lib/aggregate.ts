import type { Category } from "./categories";
import type { Transaction } from "./schemas";

export type Summary = {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
};

export function summarize(transactions: Transaction[]): Summary {
  let incomeCents = 0;
  let expenseCents = 0;
  for (const tx of transactions) {
    if (tx.type === "income") {
      incomeCents += tx.amountCents;
    } else {
      expenseCents += tx.amountCents;
    }
  }
  return { incomeCents, expenseCents, balanceCents: incomeCents - expenseCents };
}

export type CategoryTotal = {
  category: Category;
  totalCents: number;
  /** Fraction of this type's total, in [0, 1] — drives breakdown bar widths. */
  share: number;
};

export function byCategory(
  transactions: Transaction[],
  type: "income" | "expense",
): CategoryTotal[] {
  const totals = new Map<Category, number>();
  let sumCents = 0;
  for (const tx of transactions) {
    if (tx.type !== type) continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amountCents);
    sumCents += tx.amountCents;
  }
  return [...totals.entries()]
    .map(([category, totalCents]) => ({
      category,
      totalCents,
      share: sumCents === 0 ? 0 : totalCents / sumCents,
    }))
    .sort(
      (a, b) =>
        b.totalCents - a.totalCents || a.category.localeCompare(b.category),
    );
}

/** Distinct YYYY-MM months present in the data, newest first. */
export function availableMonths(transactions: Transaction[]): string[] {
  return [...new Set(transactions.map((tx) => tx.date.slice(0, 7)))].sort(
    (a, b) => b.localeCompare(a),
  );
}

export function currentMonth(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function todayIsoDate(now: Date = new Date()): string {
  return `${currentMonth(now)}-${String(now.getDate()).padStart(2, "0")}`;
}

const eurFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function formatCents(cents: number): string {
  return eurFormatter.format(cents / 100);
}

/** 'YYYY-MM' → 'June 2026' */
export function monthLabel(month: string): string {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

/** 'YYYY-MM-DD' → '10 Jun' */
export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
