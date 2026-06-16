/**
 * @file app/page.tsx
 * @updated 2026-06-16
 * @model claude-sonnet-4-6
 * @description Home dashboard — monthly transaction overview with summary cards, transaction list, category breakdown, and add form.
 * @feature none
 */

import Link from "next/link";

import { CategoryBreakdown } from "@/components/category-breakdown";
import { SummaryCards } from "@/components/summary-cards";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionList } from "@/components/transaction-list";
import {
  availableMonths,
  currentMonth,
  monthLabel,
  summarize,
  todayIsoDate,
} from "@/lib/aggregate";
import { listFiltersSchema } from "@/lib/schemas";
import { listTransactions } from "@/lib/store";

// The store is mutable in-process memory — never prerender this page.
export const dynamic = "force-dynamic";

function monthHref(month: string, type?: "income" | "expense") {
  const params = new URLSearchParams({ month });
  if (type) params.set("type", type);
  return `/?${params.toString()}`;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = listFiltersSchema.safeParse({
    type: typeof params.type === "string" ? params.type : undefined,
    month: typeof params.month === "string" ? params.month : undefined,
  });
  const filters = parsed.success ? parsed.data : {};

  const months = availableMonths(listTransactions());
  const month = filters.month ?? months[0] ?? currentMonth();

  const monthTransactions = listTransactions({ month });
  const visibleTransactions = filters.type
    ? monthTransactions.filter((tx) => tx.type === filters.type)
    : monthTransactions;
  const summary = summarize(monthTransactions);

  // months is sorted newest first
  const monthIndex = months.indexOf(month);
  const olderMonth = monthIndex === -1 ? undefined : months[monthIndex + 1];
  const newerMonth = monthIndex > 0 ? months[monthIndex - 1] : undefined;

  const navLinkClass =
    "flex size-7 items-center justify-center rounded-md text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800";
  const navDisabledClass =
    "flex size-7 items-center justify-center text-zinc-300 dark:text-zinc-700";

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 font-mono text-sm font-bold text-white">
              L
            </span>
            <h1 className="text-xl font-semibold tracking-tight">Ledger</h1>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {monthLabel(month)} overview
          </p>
        </div>

        <nav
          aria-label="Month"
          className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          {olderMonth ? (
            <Link
              href={monthHref(olderMonth, filters.type)}
              aria-label="Previous month"
              className={navLinkClass}
            >
              ‹
            </Link>
          ) : (
            <span className={navDisabledClass} aria-hidden>
              ‹
            </span>
          )}
          <span className="min-w-32 px-2 text-center font-medium">
            {monthLabel(month)}
          </span>
          {newerMonth ? (
            <Link
              href={monthHref(newerMonth, filters.type)}
              aria-label="Next month"
              className={navLinkClass}
            >
              ›
            </Link>
          ) : (
            <span className={navDisabledClass} aria-hidden>
              ›
            </span>
          )}
        </nav>
      </header>

      <main className="mt-8">
        <SummaryCards summary={summary} />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={visibleTransactions}
              activeType={filters.type}
              month={month}
            />
          </div>
          <div className="space-y-6">
            <CategoryBreakdown transactions={monthTransactions} month={month} />
            <TransactionForm defaultDate={todayIsoDate()} />
          </div>
        </div>
      </main>

      <footer className="mt-10 text-center text-xs text-zinc-400 dark:text-zinc-600">
        Demo app — data lives in server memory and resets on restart.
      </footer>
    </div>
  );
}
