/**
 * @file components/category-stats.tsx
 * @model claude-sonnet-4-6
 * @description Sidebar card showing all-time statistics for a single category.
 * @feature category-detail-page
 * @created 2026-06-15
 */

import { Card } from "@/components/ui";
import { formatCents, formatDate, type CategoryStats as CategoryStatsData } from "@/lib/aggregate";

function StatRow({
  label,
  value,
  secondary,
}: {
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd className="text-right">
        <span className="font-mono text-sm font-medium tabular-nums">{value}</span>
        {secondary && (
          <p className="text-xs text-zinc-500">{secondary}</p>
        )}
      </dd>
    </div>
  );
}

export function CategoryStats({
  stats,
  categoryLabel,
}: {
  stats: CategoryStatsData;
  categoryLabel: string;
}) {
  return (
    <Card as="section" aria-label={`All-time stats for ${categoryLabel}`}>
      <h2 className="text-sm font-semibold">All-time stats</h2>
      <dl className="mt-5 space-y-4">
        <StatRow
          label="Avg per month"
          value={`${stats.avgFrequencyPerMonth.toFixed(1)}×`}
        />
        <StatRow
          label="Avg amount"
          value={formatCents(stats.avgAmountCents)}
        />
        <StatRow
          label="Last transaction"
          value={formatDate(stats.lastDate)}
        />
        <StatRow
          label="Smallest"
          value={formatCents(stats.minTx.amountCents)}
          secondary={stats.minTx.name}
        />
        <StatRow
          label="Largest"
          value={formatCents(stats.maxTx.amountCents)}
          secondary={stats.maxTx.name}
        />
      </dl>
    </Card>
  );
}
