/**
 * @file components/category-stats-sidebar.tsx
 * @model claude-sonnet-4-6
 * @description Sidebar panel showing all-time stats for a single expense category.
 * @feature Category detail page
 * @created 2026-06-16
 */

import { Card } from "@/components/ui";
import { formatCents, formatDate } from "@/lib/aggregate";
import type { CategoryStats } from "@/lib/aggregate";

type Props = {
  stats: CategoryStats;
};

function StatRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}

export function CategoryStatsSidebar({ stats }: Props) {
  const { lastDate, averageCents, largestTx, smallestTx } = stats;

  return (
    <Card as="section" aria-label="Category statistics">
      <h2 className="text-sm font-semibold">All-time stats</h2>

      <div className="mt-4 space-y-4">
        <StatRow label="Last transaction">
          {lastDate ? formatDate(lastDate) : <span className="text-zinc-400">—</span>}
        </StatRow>

        <StatRow label="Average amount">
          {averageCents > 0 ? (
            formatCents(averageCents)
          ) : (
            <span className="text-zinc-400">—</span>
          )}
        </StatRow>

        <StatRow label="Largest transaction">
          {largestTx ? (
            <span>
              {largestTx.name}
              <span className="ml-1.5 font-mono text-xs tabular-nums text-zinc-500">
                {formatCents(largestTx.amountCents)}
              </span>
            </span>
          ) : (
            <span className="text-zinc-400">—</span>
          )}
        </StatRow>

        <StatRow label="Smallest transaction">
          {smallestTx ? (
            <span>
              {smallestTx.name}
              <span className="ml-1.5 font-mono text-xs tabular-nums text-zinc-500">
                {formatCents(smallestTx.amountCents)}
              </span>
            </span>
          ) : (
            <span className="text-zinc-400">—</span>
          )}
        </StatRow>
      </div>
    </Card>
  );
}
