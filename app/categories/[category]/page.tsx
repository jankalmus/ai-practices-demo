/**
 * @file app/categories/[category]/page.tsx
 * @model claude-sonnet-4-6
 * @description Category detail page — shows month-scoped transactions and all-time stats for one category.
 * @feature category-detail-page
 * @created 2026-06-15
 */

import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryStats } from "@/components/category-stats";
import { CategoryTransactionList } from "@/components/category-transaction-list";
import { CategoryDot } from "@/components/ui";
import {
  availableMonths,
  categoryStats,
  currentMonth,
  monthLabel,
} from "@/lib/aggregate";
import { categorySchema, listFiltersSchema } from "@/lib/schemas";
import { listTransactions } from "@/lib/store";

// The store is mutable in-process memory — never prerender this page.
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: rawCategory } = await params;
  const parsedCategory = categorySchema.safeParse(rawCategory);
  if (!parsedCategory.success) {
    notFound();
  }
  const category = parsedCategory.data;

  const rawSearch = await searchParams;
  const rawMonth = typeof rawSearch.month === "string" ? rawSearch.month : undefined;
  // Reject a month param that is present but malformed — avoids rendering "Invalid Date".
  if (rawMonth !== undefined) {
    const monthCheck = listFiltersSchema.shape.month.safeParse(rawMonth);
    if (!monthCheck.success) {
      notFound();
    }
  }
  // All-time transactions for this category — used for stats and month fallback.
  const allCategoryTxns = listTransactions({ category });
  const months = availableMonths(allCategoryTxns);
  const month = rawMonth ?? months[0] ?? currentMonth();

  // Month-scoped transactions for the list view.
  const monthTransactions = listTransactions({ category, month });

  const stats = categoryStats(allCategoryTxns);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={`/?month=${month}`}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            ← Back to {monthLabel(month)}
          </Link>
          <div className="mt-2 flex items-center gap-2.5">
            <CategoryDot category={category} className="size-3" />
            <h1 className="text-xl font-semibold tracking-tight">{category}</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500">{monthLabel(month)}</p>
        </div>
      </header>

      <main className="mt-8 grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CategoryTransactionList transactions={monthTransactions} month={month} />
        </div>
        <div>
          {stats ? (
            <CategoryStats stats={stats} categoryLabel={category} />
          ) : (
            <p className="text-sm text-zinc-500">No stats available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
