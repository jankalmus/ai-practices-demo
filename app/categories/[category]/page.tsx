/**
 * @file app/categories/[category]/page.tsx
 * @model claude-sonnet-4-6
 * @description Category detail page — lists expenses for a specific category and month, with an all-time stats sidebar.
 * @feature Category detail page
 * @created 2026-06-16
 */

import Link from "next/link";
import { redirect } from "next/navigation";

import { CategoryStatsSidebar } from "@/components/category-stats-sidebar";
import { TransactionList } from "@/components/transaction-list";
import { CategoryDot } from "@/components/ui";
import {
  availableMonths,
  categoryStats,
  currentMonth,
  monthLabel,
} from "@/lib/aggregate";
import { expenseCategoryParamSchema, listFiltersSchema } from "@/lib/schemas";
import { listTransactions } from "@/lib/store";

// The store is mutable in-process memory — never prerender this page.
export const dynamic = "force-dynamic";

function monthHref(category: string, month: string) {
  return `/categories/${category}?month=${month}`;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: rawCategory } = await params;

  const categoryParsed = expenseCategoryParamSchema.safeParse(rawCategory);
  if (!categoryParsed.success) redirect("/");
  const category = categoryParsed.data;

  const queryParams = await searchParams;
  const monthParsed = listFiltersSchema.safeParse({
    month: typeof queryParams.month === "string" ? queryParams.month : undefined,
  });
  const filters = monthParsed.success ? monthParsed.data : {};

  const allCategoryTxs = listTransactions({ type: "expense", category });
  const months = availableMonths(allCategoryTxs);
  const month = filters.month ?? months[0] ?? currentMonth();

  const monthlyTxs = allCategoryTxs.filter((tx) => tx.date.startsWith(month));
  const stats = categoryStats(allCategoryTxs);

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
            <CategoryDot category={category} />
            <h1 className="text-xl font-semibold tracking-tight">{category}</h1>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {monthLabel(month)} expenses
          </p>
        </div>

        <div className="flex items-center gap-4">
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

          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            ← Overview
          </Link>
        </div>
      </header>

      <main className="mt-8">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={monthlyTxs}
              month={month}
            />
          </div>
          <div>
            <CategoryStatsSidebar stats={stats} />
          </div>
        </div>
      </main>
    </div>
  );
}
