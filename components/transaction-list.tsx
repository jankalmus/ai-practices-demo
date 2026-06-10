import Link from "next/link";

import { deleteTransaction } from "@/app/actions";
import { Card, CategoryDot } from "@/components/ui";
import { formatCents, formatDate } from "@/lib/aggregate";
import type { Transaction } from "@/lib/schemas";

import { DeleteButton } from "./delete-button";

type Props = {
  transactions: Transaction[];
  activeType?: "income" | "expense";
  month: string;
};

const TABS = [
  { label: "All", type: undefined },
  { label: "Income", type: "income" },
  { label: "Expenses", type: "expense" },
] as const;

function tabHref(month: string, type?: "income" | "expense") {
  const params = new URLSearchParams({ month });
  if (type) params.set("type", type);
  return `/?${params.toString()}`;
}

export function TransactionList({ transactions, activeType, month }: Props) {
  return (
    <Card as="section" aria-label="Transactions">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Transactions</h2>
        <nav
          aria-label="Filter by type"
          className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
        >
          {TABS.map((tab) => {
            const active = activeType === tab.type;
            return (
              <Link
                key={tab.label}
                href={tabHref(month, tab.type)}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {transactions.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-medium">No transactions this month</p>
          <p className="mt-1 text-sm text-zinc-500">
            Add one with the form to get started.
          </p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
          {transactions.map((tx) => (
            <li key={tx.id} className="group flex items-center gap-3 py-3">
              <CategoryDot category={tx.category} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{tx.name}</p>
                <p className="truncate text-xs text-zinc-500">
                  {[tx.category, tx.description].filter(Boolean).join(" · ")}
                </p>
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
              <form action={deleteTransaction.bind(null, tx.id)}>
                <DeleteButton />
              </form>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
