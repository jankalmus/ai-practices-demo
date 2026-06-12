# Data & Validation

## The store is the single data access point

All reads/writes go through `lib/store.ts` (`listTransactions`, `getTransaction`, `addTransaction`, `deleteTransaction`). Never touch `globalThis.__ledgerStore` directly, and never keep parallel copies of transaction data.

The store is in-memory (stashed on `globalThis` to survive Turbopack HMR) — it resets on restart and is reseeded from `lib/seed.ts`. Tests use `resetStore()` to control contents.

## Validate at every boundary with Zod

External input (form data, JSON bodies, query params) is parsed with schemas from `lib/schemas.ts` **before** it reaches the store:

```ts
// ✅ server action — FormData boundary
const parsed = transactionInputSchema.safeParse(Object.fromEntries(formData));
if (!parsed.success) {
  const { fieldErrors, formErrors } = z.flattenError(parsed.error);
  return { status: "error", message: formErrors[0], fieldErrors };
}

// ✅ route handler — query param boundary
const parsed = listFiltersSchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));

// ❌ const input = Object.fromEntries(formData) as TransactionInput;
```

- Use `safeParse` + structured error responses, never throwing `parse` at a boundary.
- New input shapes get a schema in `lib/schemas.ts` — don't define schemas inline in routes/actions.
- Note: this is Zod 4 — error flattening is `z.flattenError(error)`, not `error.flatten()`.

## Money

Amounts are stored as **integer cents** (`amountCents`). User input is euros, converted once at the boundary via `toNewTransaction` (`Math.round(amount * 100)`). All arithmetic happens in cents; formatting to EUR strings only at render time via `formatCents` in `lib/aggregate.ts`.

- ❌ Never store or sum floating-point euro values.

## Dates

Dates are **strings**: `YYYY-MM-DD` for transactions, `YYYY-MM` for months. Comparison/filtering uses string operations (`localeCompare`, `startsWith`) — this is intentional; ISO dates sort lexicographically. Formatting for display goes through `formatDate` / `monthLabel`.

- ❌ Don't introduce `Date` objects into stored data or filters; convert at the display edge only.