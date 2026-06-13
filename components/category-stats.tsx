/**
 * @file components/category-stats.tsx
 * @generated 2026-06-14
 * @model claude-sonnet-4-6
 * @description Sidebar panel showing all-time statistics for a category: transaction frequency, averages, extremes.
 * @feature category-detail
 */

import { Card } from "@/components/ui";
import { formatCents, formatDate } from "@/lib/aggregate";
import type { CategoryStats } from "@/lib/aggregate";
import type { ExpenseCategory } from "@/lib/categories";

export function CategoryStatsPanel({
  stats,
  category,
}: {
  stats: CategoryStats;
  category: ExpenseCategory;
}) {
  if (
    stats.avgTransactionsPerMonth === 0 &&
    stats.lastTransactionDate === null
  ) {
    return (
      <Card as="section" aria-label={`Statistics for ${category}`}>
        <h2 className="text-sm font-semibold">Category statistics</h2>
        <p className="mt-4 text-sm text-zinc-500">No transactions in this category.</p>
      </Card>
    );
  }

  return (
    <Card as="section" aria-label={`Statistics for ${category}`}>
      <h2 className="text-sm font-semibold">Category statistics</h2>

      <ul className="mt-5 space-y-3 text-sm">
        <li className="flex justify-between">
          <span className="text-zinc-600 dark:text-zinc-400">Avg frequency</span>
          <span className="font-mono text-xs tabular-nums">
            {stats.avgTransactionsPerMonth.toFixed(1)}/month
          </span>
        </li>

        <li className="flex justify-between">
          <span className="text-zinc-600 dark:text-zinc-400">Avg amount</span>
          <span className="font-mono text-xs tabular-nums">
            {formatCents(stats.averageAmountCents)}
          </span>
        </li>

        {stats.lastTransactionDate && (
          <li className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Last transaction</span>
            <span className="font-mono text-xs tabular-nums">
              {formatDate(stats.lastTransactionDate)}
            </span>
          </li>
        )}

        {stats.minAmountCents !== null && (
          <li className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Lowest</span>
            <span className="font-mono text-xs tabular-nums">
              {formatCents(stats.minAmountCents)}
            </span>
          </li>
        )}

        {stats.maxAmountCents !== null && (
          <li className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Largest</span>
            <span className="font-mono text-xs tabular-nums">
              {formatCents(stats.maxAmountCents)}
            </span>
          </li>
        )}
      </ul>
    </Card>
  );
}
