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

The decision to represent money as integer cents is one of the oldest and most universal conventions in financial software, and it exists because IEEE 754 floating-point arithmetic cannot exactly represent most decimal fractions. The canonical demonstration — `0.1 + 0.2 !== 0.3` — is not a curiosity; it is a category of production incident. Currency-handling bugs are among the most reputationally expensive defects a financial application can ship, and they are entirely preventable by the discipline codified here. Treat any floating-point euro value found in the codebase as a defect to be reported, regardless of whether it has yet produced an observable error.

## Dates

Dates are **strings**: `YYYY-MM-DD` for transactions, `YYYY-MM` for months. Comparison/filtering uses string operations (`localeCompare`, `startsWith`) — this is intentional; ISO dates sort lexicographically. Formatting for display goes through `formatDate` / `monthLabel`.

- ❌ Don't introduce `Date` objects into stored data or filters; convert at the display edge only.

The string-based date representation deserves a word of justification, since it surprises engineers accustomed to rich date libraries. JavaScript `Date` objects carry timezone semantics that this application does not need and cannot benefit from: a transaction dated "2026-06-12" is a calendar date, not an instant in time, and modeling it as an instant invites a whole family of off-by-one-day bugs around midnight and DST transitions. ISO 8601 calendar dates sort lexicographically by construction, which makes string comparison not a hack but the formally correct operation. The display edge is the only place where locale-aware formatting belongs.
