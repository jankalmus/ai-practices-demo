# Plan: Category Detail Page

## Context

The app currently shows a monthly overview with a category breakdown in the sidebar. There is no way to drill into a category and see its individual transactions or historical statistics. This page adds that drill-down: a route at `/categories/[category]` that shows the month's transactions on the left and all-time stats for that category on the right.

---

## Route & URL

`/categories/[category]?month=YYYY-MM`

- `[category]` — a valid `Category` string (e.g., `Food`, `Housing`, `Salary`)
- `month` — optional; defaults to the most recent month that has transactions for this category, then `currentMonth()`
- Entering an unknown category slug returns a 404

---

## Files to Create or Modify

### 1. `lib/aggregate.ts` — add `categoryStats`

Add a new exported type and function at the bottom of the file.

```ts
export type CategoryStats = {
  avgFrequencyPerMonth: number; // total txns / distinct months
  avgAmountCents: number;       // mean of amountCents, rounded to whole cents
  lastDate: string;             // most recent date (YYYY-MM-DD)
  minTx: { name: string; amountCents: number };
  maxTx: { name: string; amountCents: number };
};

export function categoryStats(transactions: Transaction[]): CategoryStats | null {
  if (transactions.length === 0) return null;
  const distinctMonths = new Set(transactions.map((tx) => tx.date.slice(0, 7))).size;
  const avgFrequencyPerMonth = transactions.length / distinctMonths;
  const avgAmountCents = Math.round(
    transactions.reduce((sum, tx) => sum + tx.amountCents, 0) / transactions.length,
  );
  const lastDate = transactions[0].date; // store returns date DESC
  let minTx = transactions[0];
  let maxTx = transactions[0];
  for (const tx of transactions) {
    if (tx.amountCents < minTx.amountCents) minTx = tx;
    if (tx.amountCents > maxTx.amountCents) maxTx = tx;
  }
  return {
    avgFrequencyPerMonth,
    avgAmountCents,
    lastDate,
    minTx: { name: minTx.name, amountCents: minTx.amountCents },
    maxTx: { name: maxTx.name, amountCents: maxTx.amountCents },
  };
}
```

Relies on `listTransactions()` returning results sorted date DESC so `transactions[0]` is the most recent without an extra sort pass.

---

### 2. `lib/__tests__/aggregate.test.ts` — add `categoryStats` tests

Add a `describe("categoryStats", ...)` block:

- returns `null` for an empty array
- computes `avgFrequencyPerMonth` as count / distinct months
- computes `avgAmountCents` as rounded mean
- `lastDate` equals the first transaction's date (DESC sort)
- identifies `minTx` and `maxTx` correctly
- handles a single transaction (all values collapse to that one transaction)
- spans multiple months correctly for the frequency denominator

---

### 3. `components/category-stats.tsx` — new sidebar component (create)

Props: `{ stats: CategoryStats; categoryLabel: string }`

Renders a `<Card>` titled "All-time stats" with a `<dl>` of label/value pairs using a private `StatRow` helper:

| Stat | Label | Value format |
|---|---|---|
| avgFrequencyPerMonth | Avg per month | `1.5×` (one decimal) |
| avgAmountCents | Avg amount | `formatCents(...)` |
| lastDate | Last transaction | `formatDate(...)` |
| minTx | Smallest | `formatCents(...)` + name as secondary line |
| maxTx | Largest | `formatCents(...)` + name as secondary line |

Use `font-mono tabular-nums` on values, `text-zinc-500` on labels. `<dt>` left-aligned, `<dd>` right-aligned with `text-right`.

---

### 4. `components/category-transaction-list.tsx` — new transaction list (create)

Props: `{ transactions: Transaction[]; month: string }`

A read-only list — no delete button, no filter tabs (this is already scoped to a category). Wrapped in `<Card>` with `monthLabel(month)` as the heading.

Each row: `<CategoryDot>` + name (+ optional description below) + date + amount. Mirror the DOM structure of the existing `TransactionList` for visual consistency.

Empty state: "No transactions this month" with a suggestion to try another month.

---

### 5. `app/categories/[category]/page.tsx` — new page (create)

```ts
export const dynamic = "force-dynamic";
```

**Params validation:**
```ts
const categorySchema = z.union([z.enum(INCOME_CATEGORIES), z.enum(EXPENSE_CATEGORIES)]);
```
Call `notFound()` if `params.category` fails this schema.

**Month fallback:**
```ts
const allCategoryTxns = listTransactions({ category });
const months = availableMonths(allCategoryTxns);
const month = parsedMonth ?? months[0] ?? currentMonth();
```

**Two store calls:**
- `listTransactions({ category })` → all-time data for `categoryStats()`
- `listTransactions({ category, month })` → month-scoped list for the transaction list component

**Layout** — mirrors `app/page.tsx`:
```
mx-auto max-w-6xl
  header: back link "← Back to June 2026" + CategoryDot + category name + month subtitle
  main: grid lg:grid-cols-3
    div lg:col-span-2: <CategoryTransactionList>
    div: <CategoryStats> (or empty-state text if stats is null)
```

Back link href: `` `/?month=${month}` ``

---

### 6. `components/category-breakdown.tsx` — make rows clickable

**Add a `month` prop:**
```ts
export function CategoryBreakdown({ transactions, month }: { transactions: Transaction[]; month: string })
```

**Wrap each `<li>` content in a `<Link>`:**
```tsx
<li key={row.category}>
  <Link href={`/categories/${row.category}?month=${month}`} className="block group/row">
    <div className="flex items-baseline justify-between gap-2 text-sm">
      <span className="flex items-center gap-2">
        <CategoryDot category={row.category} className="size-2" />
        <span className="group-hover/row:underline">{row.category}</span>
      </span>
      ...
    </div>
    ...bar...
  </Link>
</li>
```

**Update caller in `app/page.tsx`:**
```tsx
<CategoryBreakdown transactions={monthTransactions} month={month} />
```

`month` is already defined in `app/page.tsx` — no new logic needed.

---

## Utilities to Reuse

| Utility | Location |
|---|---|
| `listTransactions({ category, month })` | `lib/store.ts` |
| `availableMonths()`, `currentMonth()`, `monthLabel()`, `formatCents()`, `formatDate()` | `lib/aggregate.ts` |
| `INCOME_CATEGORIES`, `EXPENSE_CATEGORIES`, `CATEGORY_COLORS` | `lib/categories.ts` |
| `<Card>`, `<CategoryDot>` | `components/ui/` |

---

## What to Leave Alone

`app/categories/[type]/[category]/` — this empty folder exists in the repo but has no `page.tsx` and causes no routing conflict. Leave it untouched.

---

## Verification

1. `pnpm test` — all existing tests pass; new `categoryStats` suite passes
2. `pnpm build` (or `verify` skill) — no TypeScript errors; check that `params` and `searchParams` are `await`-ed, `notFound()` is from `next/navigation`
3. `pnpm lint` — all new files have the JSDoc provenance header
4. Manual smoke test:
   - Home page: each category row in the breakdown panel is a clickable link
   - Click "Food" → lands on `/categories/Food?month=2026-06`, shows Food transactions + all-time stats sidebar
   - Navigate to `/categories/Food` (no month) → defaults to the most recent month with Food transactions
   - Navigate to `/categories/XYZ` → 404
   - Select a month with no transactions for that category → empty-state message in the list, stats sidebar still shows all-time data
