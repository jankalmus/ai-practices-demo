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

export type CategoryStats = {
  avgTransactionsPerMonth: number;
  averageAmountCents: number;
  lastTransactionDate: string | null;
  minAmountCents: number | null;
  maxAmountCents: number | null;
};

export function categoryStats(
  allTransactions: Transaction[],
  category: Category,
): CategoryStats {
  const txs = allTransactions.filter((tx) => tx.category === category);

  if (txs.length === 0) {
    return {
      avgTransactionsPerMonth: 0,
      averageAmountCents: 0,
      lastTransactionDate: null,
      minAmountCents: null,
      maxAmountCents: null,
    };
  }

  const categoryMonths = [...new Set(txs.map((tx) => tx.date.slice(0, 7)))];
  const totalAmountCents = txs.reduce((sum, tx) => sum + tx.amountCents, 0);
  const amounts = txs.map((tx) => tx.amountCents);

  // Sort by date descending to find the most recent transaction
  const sortedByDate = [...txs].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return {
    avgTransactionsPerMonth:
      categoryMonths.length === 0 ? 0 : txs.length / categoryMonths.length,
    averageAmountCents: Math.round(totalAmountCents / txs.length),
    lastTransactionDate: sortedByDate[0]?.date ?? null,
    minAmountCents: Math.min(...amounts),
    maxAmountCents: Math.max(...amounts),
  };
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
