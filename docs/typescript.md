# TypeScript

`strict` mode is on and stays on. Target: readable, inference-friendly code.

## Rules

- **No `any`.** For untrusted input use `unknown` and narrow with Zod or type guards:

  ```ts
  // ✅ app/api/transactions/route.ts
  let body: unknown;
  try { body = await request.json(); } catch { … }
  const parsed = transactionInputSchema.safeParse(body);

  // ❌ const body = (await request.json()) as any;
  ```

- **Derive types, don't duplicate them.** Schema-derived types come from `z.infer`; constant-derived unions from `as const` arrays:

  ```ts
  // ✅ lib/schemas.ts / lib/categories.ts
  export type TransactionInput = z.infer<typeof transactionInputSchema>;
  export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
  ```

- **Discriminated unions for state machines** — see `AddTransactionState` in `app/actions.ts` (`status: "idle" | "success" | "error"`); never optional-boolean soup.
- **Imports:** use the `@/*` alias for cross-directory imports (`@/lib/store`), relative imports within a directory (`./categories`). `import type` for type-only imports.
- Prefer plain functions over classes; prefer `readonly`/`const` over mutation in exported APIs.
- Exported functions get explicit return types when the signature is part of a contract (store, aggregate); local helpers may rely on inference.

## Don't

- ❌ No `@ts-ignore` / `@ts-expect-error` to silence errors — fix the type.
- ❌ No non-null assertions (`!`) on data that can legitimately be absent — handle the `undefined` branch (see `getTransaction`).
- ❌ No `enum` — use `as const` arrays/objects (matches `lib/categories.ts`).