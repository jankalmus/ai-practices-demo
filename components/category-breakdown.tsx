import { Card, CategoryDot } from "@/components/ui";
import { byCategory, formatCents } from "@/lib/aggregate";
import { CATEGORY_COLORS } from "@/lib/categories";
import type { Transaction } from "@/lib/schemas";

export function CategoryBreakdown({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const rows = byCategory(transactions, "expense");

  return (
    <Card as="section" aria-label="Spending by category">
      <h2 className="text-sm font-semibold">Spending by category</h2>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">No expenses this month.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {rows.map((row) => (
            <li key={row.category}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <CategoryDot category={row.category} className="size-2" />
                  {row.category}
                </span>
                <span className="font-mono text-xs tabular-nums text-zinc-500">
                  {formatCents(row.totalCents)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full ${CATEGORY_COLORS[row.category]}`}
                  style={{ width: `${Math.max(2, Math.round(row.share * 100))}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
