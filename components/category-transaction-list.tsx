/**
 * @file components/category-transaction-list.tsx
 * @model claude-sonnet-4-6
 * @description Read-only list of transactions for a single category scoped to one month.
 * @feature category-detail-page
 * @created 2026-06-15
 */

import { Card, CategoryDot } from "@/components/ui";
import { formatCents, formatDate, monthLabel } from "@/lib/aggregate";
import type { Transaction } from "@/lib/schemas";

export function CategoryTransactionList({
  transactions,
  month,
}: {
  transactions: Transaction[];
  month: string;
}) {
  return (
    <Card as="section" aria-label={`Transactions for ${monthLabel(month)}`}>
      <h2 className="text-sm font-semibold">{monthLabel(month)}</h2>

      {transactions.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-medium">No transactions this month</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Try selecting a different month to see transactions.
          </p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center gap-3 py-3">
              <CategoryDot category={tx.category} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{tx.name}</p>
                {tx.description && (
                  <p className="truncate text-xs text-zinc-500">{tx.description}</p>
                )}
              </div>
              <span className="hidden shrink-0 text-xs tabular-nums text-zinc-500 sm:block">
                {formatDate(tx.date)}
              </span>
              <span
                className={`shrink-0 font-mono text-sm font-medium tabular-nums ${
                  tx.type === "income"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {tx.type === "income" ? "+" : "−"}
                {formatCents(tx.amountCents)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
