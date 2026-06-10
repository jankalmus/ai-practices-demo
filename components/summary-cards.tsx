import { ArrowDownIcon, ArrowUpIcon, ScaleIcon } from "@/components/icons";
import { Card } from "@/components/ui";
import { formatCents, type Summary } from "@/lib/aggregate";

type StatCardProps = {
  label: string;
  value: string;
  valueClass: string;
  iconClass: string;
  icon: React.ReactNode;
};

function StatCard({ label, value, valueClass, iconClass, icon }: StatCardProps) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </p>
        <p className={`mt-2 font-mono text-2xl font-semibold tabular-nums sm:text-3xl ${valueClass}`}>
          {value}
        </p>
      </div>
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
        {icon}
      </span>
    </Card>
  );
}

export function SummaryCards({ summary }: { summary: Summary }) {
  const balancePositive = summary.balanceCents >= 0;

  return (
    <section aria-label="Monthly summary" className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Income"
        value={formatCents(summary.incomeCents)}
        valueClass="text-emerald-600 dark:text-emerald-400"
        iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
        icon={<ArrowUpIcon />}
      />
      <StatCard
        label="Expenses"
        value={formatCents(summary.expenseCents)}
        valueClass="text-rose-600 dark:text-rose-400"
        iconClass="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
        icon={<ArrowDownIcon />}
      />
      <StatCard
        label="Balance"
        value={`${balancePositive ? "" : "−"}${formatCents(Math.abs(summary.balanceCents))}`}
        valueClass={
          balancePositive
            ? "text-zinc-900 dark:text-zinc-50"
            : "text-rose-600 dark:text-rose-400"
        }
        iconClass="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        icon={<ScaleIcon />}
      />
    </section>
  );
}
