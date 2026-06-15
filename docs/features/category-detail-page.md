# Feature: Category Detail Page

> **Slug:** `category-detail-page` · **Status:** active · **Last reviewed:** 2026-06-15

## Summary

Provides a drill-down view at `/categories/[category]?month=YYYY-MM` where a user can see all transactions for one category in a chosen month alongside all-time statistics for that category. Navigated to from the spending-by-category sidebar on the home page, where each category row is now a clickable link.

## Requirements

- The route `/categories/[category]` accepts any valid `Category` string (income or expense) as the dynamic segment and an optional `month=YYYY-MM` query parameter.
- An unknown category slug returns a 404 (Next.js `notFound()`).
- A present but malformed `?month=` value (not matching `YYYY-MM`) returns a 404.
- When `?month=` is omitted, the page defaults to the most recent month that has transactions for this category; if none exist, it falls back to the current calendar month.
- The main content area shows all transactions for the selected category and month in a read-only list. Each row displays the category colour dot, name, optional description, date, and signed amount.
- When no transactions exist for the selected month, the list shows an empty-state message ("No transactions this month") with a suggestion to try another month.
- The sidebar shows all-time statistics for the category (regardless of the selected month): average frequency per month, average transaction amount, date of the most recent transaction, smallest transaction (amount + name), and largest transaction (amount + name).
- When the category has no transactions at all, the stats sidebar shows a plain text fallback ("No stats available.").
- A back link in the page header navigates to the home page pre-filtered to the same month (`/?month=YYYY-MM`).
- The home page category-breakdown sidebar makes each expense-category row a `<Link>` to `/categories/[category]?month=YYYY-MM`, passing the currently viewed month.
- `categoryStats` is order-independent: `lastDate` is derived by lexicographic string comparison over all transactions, not by assuming the input is sorted.

## Restrictions & constraints

- The page is server-rendered on demand (`export const dynamic = "force-dynamic"`) because the store is mutable in-process memory; it cannot be statically prerendered.
- There is no month-navigation UI on the detail page itself — month selection requires editing the URL or using the back link and navigating from the home page.
- The detail page is read-only: transactions cannot be deleted or added from this view.
- Only expense categories appear as links in the category breakdown sidebar (the breakdown itself only covers expenses); income categories are reachable by direct URL entry.
- `categoryStats` returns `null` for an empty transaction list; callers must handle the null case before rendering.
- All monetary values are stored and computed in integer cents; `formatCents` is used at every display boundary.

## Integrations

- **`lib/store.ts` → this feature** (inbound): `listTransactions({ category })` and `listTransactions({ category, month })` are the sole data-access calls; the page never touches store internals directly.
- **`lib/aggregate.ts` → this feature** (inbound): `availableMonths`, `currentMonth`, `monthLabel`, `formatCents`, `formatDate`, and the new `categoryStats` function are all consumed by the page and its components.
- **`lib/schemas.ts` → this feature** (inbound): `categorySchema` (exported from `lib/schemas.ts`) validates the `[category]` route segment; `listFiltersSchema.shape.month` validates the `?month=` query param.
- **`lib/categories.ts` → this feature** (inbound): `INCOME_CATEGORIES`, `EXPENSE_CATEGORIES`, and `CATEGORY_COLORS` drive category validation and colour rendering.
- **`components/ui` → this feature** (inbound): `<Card>` and `<CategoryDot>` primitives are used by both new components.
- **Home page (`app/page.tsx`) → this feature** (outbound): the home page passes `month` to `<CategoryBreakdown>`, which renders links to category detail pages.

## Files

The implementation files for this feature. This section is the human-readable inverse of the `@feature` headers (see [documentation-standards.md](../../../../docs/documentation-standards.md)) — every file tagged `@feature category-detail-page` appears here.

| File | Role |
| --- | --- |
| `app/categories/[category]/page.tsx` | Category detail page — shows month-scoped transactions and all-time stats for one category. |
| `app/page.tsx` | Home page — monthly overview with summary cards, transaction list, and category breakdown. |
| `components/category-breakdown.tsx` | Sidebar breakdown of spending by category with links to the category detail page. |
| `components/category-stats.tsx` | Sidebar card showing all-time statistics for a single category. |
| `components/category-transaction-list.tsx` | Read-only list of transactions for a single category scoped to one month. |
| `lib/aggregate.ts` | Pure aggregation and formatting utilities for transaction data. |
| `lib/schemas.ts` | Zod schemas and derived types for all external input boundaries. |
| `lib/__tests__/aggregate.test.ts` | Tests for aggregate utility functions including categoryStats. |
