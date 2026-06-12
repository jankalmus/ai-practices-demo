# Recipe: the data layer (schema → store → aggregate → test)

**Use this when** the page needs a data shape, filter, or computation the store doesn't have yet. Do this **before** the page — pages read from `lib/`, never the reverse. Read alongside [data-and-validation.md](../../../../docs/data-and-validation.md), [typescript.md](../../../../docs/typescript.md), and [testing.md](../../../../docs/testing.md).

The data layer is the single point of data access. There are up to four edits, in this order. Skip the ones the feature doesn't need.

## 1. Schema + type in `lib/schemas.ts`

Define the shape with Zod and derive the TypeScript type with `z.infer` — never hand-write a parallel `type` and risk drift.

```ts
export const reportFiltersSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Month must be in YYYY-MM format")
    .optional(),
  groupBy: z.enum(["category", "type"]).default("category"),
});

export type ReportFilters = z.infer<typeof reportFiltersSchema>;
```

This recipe covers only the *wiring* — defining a schema and deriving its type. **What** the shapes must obey — money representation, date format, deriving types with `z.infer`, discriminated unions over optional-field soup, trimmed/bounded strings — is governed by [data-and-validation.md](../../../../docs/data-and-validation.md) and [typescript.md](../../../../docs/typescript.md), which this file already tells you to read. Don't restate those rules here; follow the docs.

## 2. Read/compute functions in `lib/store.ts`

The store wraps the in-process data. Add a pure accessor; keep filtering declarative like the existing `listTransactions`.

```ts
export function listByMonth(month: string): Transaction[] {
  return listTransactions({ month });
}
```

Don't expose the store's internals; callers get arrays/objects, not the mutable `LedgerStore`.

## 3. Derivations in `lib/aggregate.ts`

Any totalling, grouping, sorting, or formatting goes here — **not** in the page or component. Return plain serializable data; keep functions pure and `Date`-injectable (`now: Date = new Date()`) so they're testable.

```ts
export function totalByCategory(transactions: Transaction[]): CategoryTotal[] {
  // … same shape as the existing byCategory helper
}
```

Reuse the existing shared helpers in `lib/aggregate.ts` rather than re-implementing them.

## 4. Tests in `lib/__tests__/`

`lib/` changes are **blocking-without-tests** in code review. Add a colocated Vitest file in AAA style (Arrange / Act / Assert), one behavior per `it`, no snapshots. Use `resetStore()` to control fixtures.

```ts
import { describe, expect, it } from "vitest";

import { totalByCategory } from "../aggregate";

describe("totalByCategory", () => {
  it("sums amounts within each category", () => {
    // Arrange
    const txs = [/* … */];
    // Act
    const result = totalByCategory(txs);
    // Assert
    expect(result).toEqual([/* … */]);
  });
});
```
