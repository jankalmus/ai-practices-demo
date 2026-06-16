# Feature: Category Detail Page

> **Slug:** `category-detail-page` · **Status:** active · **Last reviewed:** 2026-06-16

## Summary

Shows all expense transactions for a single category in a selected month, alongside an all-time statistics sidebar (last transaction date, average amount, largest and smallest transactions). It gives users a focused drill-down from the home page's spending breakdown into a specific category.

## Requirements

- The route `/categories/[category]` accepts any valid expense category name as the path segment (e.g. `/categories/Food`).
- The selected month defaults to the most recent month that contains transactions for the given category.
- Month navigation arrows allow stepping forward and backward through months that have at least one transaction in the category.
- The main area lists all expense transactions for the selected category and month, reusing the shared `TransactionList` component.
- The sidebar displays four all-time statistics computed over every stored transaction in the category, regardless of the selected month:
  - Date of the most recent transaction.
  - Average transaction amount (rounded to whole cents).
  - Largest transaction by amount (name and amount).
  - Smallest transaction by amount (name and amount).
- Sidebar stat fields show `—` when the category has no stored transactions.
- An unknown or invalid category value in the URL path redirects to the home page (`/`).
- Each expense category row in the home page's "Spending by category" breakdown links to this page, pre-seeded with the currently displayed month.

## Restrictions & constraints

- Only **expense** categories are supported as route segments. Income categories (Salary, Freelance, Investments, Other) are not valid and trigger a redirect to home.
- Month navigation is scoped to months that have data for the selected category. If a `?month=` query param is supplied for a month with no data, the navigation arrows still reflect only months with data; the list renders empty for the requested month.
- All-time stats are bounded by what is in the in-memory store, which resets on server restart and is re-seeded from `lib/seed.ts`.
- The page is read-only — no add or delete transaction UI is present.
- The month nav falls back to `currentMonth()` (current calendar month) when the category has no transaction history at all, yielding an empty list.

## Integrations

- **`lib/store.ts` ← reads** — fetches expense transactions filtered by category via `listTransactions({ type: "expense", category })`.
- **`lib/aggregate.ts` ← reads** — `categoryStats()` for the sidebar stats; `availableMonths()`, `monthLabel()`, `currentMonth()` for month navigation; `formatCents()` and `formatDate()` for display formatting.
- **`lib/schemas.ts` ← reads** — `expenseCategoryParamSchema` validates the `[category]` path segment; `listFiltersSchema` validates the `?month=` query param.
- **`components/transaction-list.tsx` ← renders** — the existing shared transaction list component renders the monthly transaction rows.
- **`components/ui/` ← renders** — `Card` and `CategoryDot` primitives.
- **`components/category-breakdown.tsx` → navigates here** — the home page's spending breakdown links each category row to this page.

## Files

The implementation files for this feature. This section is the human-readable inverse of the `@feature` headers (see [documentation-standards.md](../../docs/documentation-standards.md)) — every file tagged `@feature Category detail page` appears here.

| File | Role |
| --- | --- |
| `app/categories/[category]/page.tsx` | Server component — route entry point; validates path and query params, fetches data, and composes the page layout. |
| `components/category-stats-sidebar.tsx` | Sidebar panel showing all-time stats for the selected expense category. |
| `components/category-breakdown.tsx` | Spending-by-category bar chart on the home page; each row is a link that navigates to this feature's route. |
