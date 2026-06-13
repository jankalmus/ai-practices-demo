/**
 * @file app/categories/[category]/page.tsx
 * @generated 2026-06-14
 * @model claude-sonnet-4-6
 * @description Detail page for a single expense category, showing filtered transactions and all-time statistics.
 * @feature category-detail
 */

import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryStatsPanel } from "@/components/category-stats";
import { TransactionList } from "@/components/transaction-list";
import { CategoryDot } from "@/components/ui";
import {
  availableMonths,
  categoryStats,
  currentMonth,
  monthLabel,
} from "@/lib/aggregate";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { listFiltersSchema } from "@/lib/schemas";
import { listTransactions } from "@/lib/store";

export const dynamic = "force-dynamic";

function monthHref(category: string, month: string, type?: "income" | "expense") {
  const params = new URLSearchParams({ month });
  if (type) params.set("type", type);
  return `/categories/${category}?${params.toString()}`;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: categoryParam } = await params;

  if (!EXPENSE_CATEGORIES.includes(categoryParam as never)) {
    notFound();
  }

  const category = categoryParam as typeof EXPENSE_CATEGORIES[number];

  const sp = await searchParams;
  const parsed = listFiltersSchema.safeParse({
    month: typeof sp.month === "string" ? sp.month : undefined,
  });
  const filters = parsed.success ? parsed.data : {};

  const allTransactions = listTransactions();
  const months = availableMonths(allTransactions);
  const month = filters.month ?? months[0] ?? currentMonth();

  const categoryTransactions = listTransactions({ month, category });
  const stats = categoryStats(allTransactions, category);

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
          <div className="flex items-center gap-2">
            <Link
              href={`/?month=${month}`}
              className="rounded-md px-2 py-1 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-2">
              <CategoryDot category={category} className="size-4" />
              <h1 className="text-xl font-semibold tracking-tight">{category}</h1>
            </div>
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
              href={monthHref(category, olderMonth)}
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
              href={monthHref(category, newerMonth)}
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
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={categoryTransactions}
              month={month}
            />
          </div>
          <div>
            <CategoryStatsPanel stats={stats} category={category} />
          </div>
        </div>
      </main>
    </div>
  );
}
