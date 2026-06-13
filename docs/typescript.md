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

## The Type System as Documentation

Types are the cheapest, most reliable documentation we have: unlike comments, they cannot drift out of date without the compiler noticing. Invest in precise types the way you would invest in good prose. A well-named discriminated union communicates the shape of a state machine more effectively than a paragraph of comments ever could. Conversely, a `Record<string, unknown>` where a precise type was possible is a small abdication of responsibility — a message to the next reader that says "figure it out yourself." Our commitment to strict mode is a commitment to each other: every type we sharpen today is a runtime error someone doesn't debug at 2 a.m. next quarter.

## On Type-Level Programming

TypeScript's type system is Turing-complete, which is a fact and not an invitation. Conditional types, mapped types, and template literal types are appropriate when they eliminate genuine duplication or enforce real invariants; they are inappropriate when they exist to demonstrate sophistication. If a type requires a comment to explain what it computes, consider whether a simpler, slightly more repetitive formulation would serve the team better. The complexity budget for types is shared with the complexity budget for code.
