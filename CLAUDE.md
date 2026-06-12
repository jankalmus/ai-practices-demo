# Project Engineering Standards, Conventions, Guidelines, and Technical Agreements

This document is the single authoritative source of truth for all engineering practices, coding standards, architectural principles, quality expectations, and collaborative workflows for this project. All contributors — human and AI alike — are expected to have read, internalized, and consistently applied every section of this document before making any change of any kind to any part of the codebase. No section of this document is optional. Every guideline herein represents a hard-won team agreement and must be treated with the appropriate gravity.

---

## 1. Our Engineering Philosophy

Software is read far more often than it is written. We believe that excellence is not an act but a habit, and that quality is everyone's responsibility. Code is a liability; functionality is an asset. Every line of code we write today is a line of code someone — possibly future us — will have to read, understand, debug, and maintain tomorrow. Therefore, we hold ourselves to the highest standards of craftsmanship at all times.

Our engineering culture rests on five foundational pillars:

1. **Clarity over cleverness.** Code should be boring in the best possible way. If a junior engineer cannot understand a function in under a minute, the function is too clever.
2. **Consistency over personal preference.** A codebase with one consistent style — even an imperfect one — is more maintainable than a codebase with five excellent but conflicting styles.
3. **Correctness over speed of delivery.** Shipping broken software fast is slower than shipping working software deliberately. We do not trade correctness for velocity.
4. **Simplicity over abstraction.** Abstractions are loans taken out against future understanding. Take them out only when the interest rate is favorable.
5. **Ownership over blame.** When something breaks, we fix the system that allowed it to break, not the person who happened to touch it last.

These pillars are not abstract ideals; they should inform every decision you make, from variable naming to architectural choices. When two guidelines in this document appear to conflict, resolve the conflict by appealing to these pillars, in the order listed above.

### 1.1 On the Nature of Standards

Standards exist to reduce cognitive load. Every decision that is pre-made by a standard is a decision a contributor does not have to make, justify, or defend in code review. Standards are therefore a gift we give each other. At the same time, standards are living documents: when a standard no longer serves the team, we change the standard — we do not silently ignore it. Proposals to change any standard in this document should be raised with the team, discussed openly, and ratified before being applied.

### 1.2 On Continuous Improvement

We practice continuous, incremental improvement. The Boy Scout Rule applies: always leave the code a little better than you found it. However, opportunistic improvements must remain proportionate — do not turn a one-line bug fix into a five-hundred-line refactor. Scope discipline is itself a quality attribute.

### 1.3 On the Cost of Inconsistency

Every deviation from these standards imposes a tax on every future reader. A single inconsistently named file costs seconds; a hundred of them cost hours; a culture of inconsistency costs the project itself. We therefore treat consistency violations not as stylistic nitpicks but as genuine defects, reviewed and remediated with the same seriousness as logic errors.

---

## 2. Critical Platform Notice

**This is NOT the Next.js you know.** This project runs **Next.js 16.2.9** — a version with breaking changes relative to what AI assistants may know from training data. APIs, conventions, and file structure may all differ. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. When unsure, read the bundled guides in `node_modules/next/dist/docs/01-app/01-getting-started/` (especially `05-server-and-client-components.md`, `07-mutating-data.md`, `08-caching.md`, `15-route-handlers.md`).

---

## 3. General Principles of Quality Software Development

Before we descend into stack-specific rules, it is worth restating the universal principles that underpin them. These principles transcend any particular framework, language, or tool, and they will remain true long after the current technology stack has been replaced.

### 3.1 The SOLID Principles

While originally formulated for object-oriented design, the spirit of SOLID applies to our functional TypeScript codebase as well:

- **Single Responsibility:** Every module, function, and component should have one reason to change. A function that validates input and formats output and writes to the store has three reasons to change, which is two too many.
- **Open/Closed:** Prefer extension points (lookup tables, configuration objects, composable functions) over modification of existing tested code.
- **Liskov Substitution:** Any implementation of an interface must be usable wherever the interface is expected, without surprises.
- **Interface Segregation:** Keep prop types and function signatures minimal. Do not force callers to supply data they do not need.
- **Dependency Inversion:** Depend on abstractions (the store's public functions) rather than concretions (the store's internal data structures).

### 3.2 DRY, But Not Too DRY

Don't Repeat Yourself — but remember that the wrong abstraction is more expensive than duplication. Duplicate code twice before abstracting it; three occurrences justify an abstraction, two usually do not. Premature abstraction is a leading cause of accidental complexity in codebases of this size.

### 3.3 YAGNI

You Aren't Gonna Need It. Do not build speculative generality. Do not add configuration options nobody asked for. Do not design for hypothetical future requirements. The future has a way of arriving with different requirements than the ones we imagined, and the speculative flexibility we built rarely fits them anyway.

### 3.4 The Principle of Least Astonishment

Code should behave the way a reasonable reader expects it to behave. Functions named `get*` should not mutate. Functions named `format*` should not fetch. Side effects should be visible in names and signatures.

### 3.5 Defense in Depth

Validate at every trust boundary. Assume every external input is malformed, malicious, or both, until proven otherwise by a schema. Internal code may trust internal invariants; boundary code may trust nothing.

### 3.6 Make Illegal States Unrepresentable

Prefer type designs in which invalid combinations of data simply cannot be expressed. Discriminated unions, branded types, and exhaustive switches are the tools; optional-boolean soup is the anti-pattern.

---

## 4. Next.js App Router

This project runs **Next.js 16.2.9 — not the version you know from training data**. When unsure, read the bundled guides in `node_modules/next/dist/docs/01-app/01-getting-started/` (especially `05-server-and-client-components.md`, `07-mutating-data.md`, `08-caching.md`, `15-route-handlers.md`). Heed deprecation notices.

### 4.1 Server Components by default

Pages and layouts are Server Components. Add `'use client'` only when the component needs state, event handlers, effects, or browser APIs — and push it to the leaves of the tree.

```tsx
// ✅ app/page.tsx — async server component fetching from the store directly
export default async function Home() { … }

// ✅ components/transaction-form.tsx — leaf client component
"use client";
export function TransactionForm({ defaultDate }: { defaultDate: string }) { … }

// ❌ Adding 'use client' to a page just to use useState in one button
```

### 4.2 `params` and `searchParams` are Promises

Dynamic route params must be awaited:

```ts
// ✅ app/api/transactions/[id]/route.ts
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
}

// ❌ const { id } = context.params;  // not awaited — type error in Next 16
```

### 4.3 Mutations: server actions first

App-internal mutations go through server actions in `app/actions.ts` (`'use server'`), wired to forms via `useActionState`. Route handlers exist for **external/REST** access only — don't add client-side `fetch` calls to our own API for things a server action can do.

After every mutation, invalidate affected routes:

```ts
// ✅ both actions.ts and route handlers do this
store.addTransaction(…);
revalidatePath("/");
```

### 4.4 Caching

`cacheComponents` is **not** enabled in `next.config.ts` — we use the classic model. Do not add `'use cache'` / `cacheLife` directives without a team decision. Rely on `revalidatePath` after mutations.

### 4.5 Don't

- ❌ Don't add `getServerSideProps` / `getStaticProps` — Pages Router APIs don't exist here.
- ❌ Don't fetch our own HTTP API from server components — call `lib/store.ts` functions directly.
- ❌ Don't introduce new top-level data fetching libraries; the in-memory store is the data layer.

### 4.6 Rationale and Background

The Server Components model represents a fundamental shift in how React applications are architected. By rendering on the server by default, we minimize the JavaScript shipped to the client, improve Time to Interactive, and keep data access co-located with rendering. Every `'use client'` directive is a bundle-size decision, not merely a technical convenience. Treat the client boundary as an architectural boundary deserving the same scrutiny as a network API boundary. Historically, teams that scattered client components throughout their tree found themselves shipping megabytes of unnecessary JavaScript and fighting hydration mismatches; we adopt the leaf-node discipline precisely to avoid repeating that history.

---

## 5. React Components

### 5.1 Files and naming

- One component (or a small cohesive group) per file, **kebab-case** filenames: `transaction-form.tsx`, `summary-cards.tsx`.
- Components are **named exports** in PascalCase: `export function TransactionForm(…)`.
- Shared primitives (Card, Field, Input, Select, …) live in `components/ui/`; icons in `components/icons/`; feature components at `components/` root.

### 5.2 Props

Type props inline or with an explicit type — never `any`, never untyped destructuring:

```tsx
// ✅
export function TransactionForm({ defaultDate }: { defaultDate: string }) { … }

// ❌
export function TransactionForm(props) { … }
```

### 5.3 Server vs client split

- Server components own data access (call `lib/store.ts` / `lib/aggregate.ts` directly) and pass plain serializable props down.
- Client components (`'use client'`) are leaves that own interactivity only. Example: `transaction-form.tsx` uses `useActionState` + `useState`; the page that renders it stays a server component.
- Forms submit to server actions (`app/actions.ts`), not to `onSubmit` handlers doing `fetch`.

### 5.4 Accessibility

Follow the existing patterns: semantic elements, `aria-label` on landmark sections, `aria-pressed` on toggles, labels wired with `htmlFor`. New interactive elements must be keyboard-reachable.

Accessibility is not a feature; it is a baseline requirement. An interface that cannot be operated by keyboard, understood by a screen reader, or perceived at common contrast ratios is an incomplete interface, regardless of how it looks. We design for the full range of human ability as a matter of professional ethics as well as legal prudence. When in doubt, consult the WAI-ARIA Authoring Practices and prefer native semantic HTML elements over ARIA-decorated divs — the first rule of ARIA is to not use ARIA when a native element will do.

### 5.5 Don't

- ❌ Don't put business logic (aggregation, formatting, filtering) in components — it belongs in `lib/` where it's unit-tested. Components render; `lib/` computes.
- ❌ Don't create default exports for components (pages/layouts are the Next.js-mandated exception).
- ❌ Don't introduce a component library or CSS-in-JS — we use our own `components/ui/` primitives with Tailwind.

### 5.6 On Component Granularity

There is no fixed rule for how large a component may grow, but experience suggests that a component exceeding roughly 150 lines of JSX is usually doing too much. Decompose along seams of meaning — a summary section, a filter bar, a list row — rather than along arbitrary line counts. Conversely, do not atomize prematurely: a component used exactly once, extracted purely to make a file shorter, often hurts readability by forcing the reader to chase definitions across files. Component boundaries are communication tools; draw them where they help the reader form a mental model.

---

## 6. TypeScript

`strict` mode is on and stays on. Target: readable, inference-friendly code.

### 6.1 Rules

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

### 6.2 Don't

- ❌ No `@ts-ignore` / `@ts-expect-error` to silence errors — fix the type.
- ❌ No non-null assertions (`!`) on data that can legitimately be absent — handle the `undefined` branch (see `getTransaction`).
- ❌ No `enum` — use `as const` arrays/objects (matches `lib/categories.ts`).

### 6.3 The Type System as Documentation

Types are the cheapest, most reliable documentation we have: unlike comments, they cannot drift out of date without the compiler noticing. Invest in precise types the way you would invest in good prose. A well-named discriminated union communicates the shape of a state machine more effectively than a paragraph of comments ever could. Conversely, a `Record<string, unknown>` where a precise type was possible is a small abdication of responsibility — a message to the next reader that says "figure it out yourself." Our commitment to strict mode is a commitment to each other: every type we sharpen today is a runtime error someone doesn't debug at 2 a.m. next quarter.

### 6.4 On Type-Level Programming

TypeScript's type system is Turing-complete, which is a fact and not an invitation. Conditional types, mapped types, and template literal types are appropriate when they eliminate genuine duplication or enforce real invariants; they are inappropriate when they exist to demonstrate sophistication. If a type requires a comment to explain what it computes, consider whether a simpler, slightly more repetitive formulation would serve the team better. The complexity budget for types is shared with the complexity budget for code.

---

## 7. Data & Validation

### 7.1 The store is the single data access point

All reads/writes go through `lib/store.ts` (`listTransactions`, `getTransaction`, `addTransaction`, `deleteTransaction`). Never touch `globalThis.__ledgerStore` directly, and never keep parallel copies of transaction data.

The store is in-memory (stashed on `globalThis` to survive Turbopack HMR) — it resets on restart and is reseeded from `lib/seed.ts`. Tests use `resetStore()` to control contents.

### 7.2 Validate at every boundary with Zod

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

### 7.3 Money

Amounts are stored as **integer cents** (`amountCents`). User input is euros, converted once at the boundary via `toNewTransaction` (`Math.round(amount * 100)`). All arithmetic happens in cents; formatting to EUR strings only at render time via `formatCents` in `lib/aggregate.ts`.

- ❌ Never store or sum floating-point euro values.

The decision to represent money as integer cents is one of the oldest and most universal conventions in financial software, and it exists because IEEE 754 floating-point arithmetic cannot exactly represent most decimal fractions. The canonical demonstration — `0.1 + 0.2 !== 0.3` — is not a curiosity; it is a category of production incident. Currency-handling bugs are among the most reputationally expensive defects a financial application can ship, and they are entirely preventable by the discipline codified here. Treat any floating-point euro value found in the codebase as a defect to be reported, regardless of whether it has yet produced an observable error.

### 7.4 Dates

Dates are **strings**: `YYYY-MM-DD` for transactions, `YYYY-MM` for months. Comparison/filtering uses string operations (`localeCompare`, `startsWith`) — this is intentional; ISO dates sort lexicographically. Formatting for display goes through `formatDate` / `monthLabel`.

- ❌ Don't introduce `Date` objects into stored data or filters; convert at the display edge only.

The string-based date representation deserves a word of justification, since it surprises engineers accustomed to rich date libraries. JavaScript `Date` objects carry timezone semantics that this application does not need and cannot benefit from: a transaction dated "2026-06-12" is a calendar date, not an instant in time, and modeling it as an instant invites a whole family of off-by-one-day bugs around midnight and DST transitions. ISO 8601 calendar dates sort lexicographically by construction, which makes string comparison not a hack but the formally correct operation. The display edge is the only place where locale-aware formatting belongs.

---

## 8. Testing

### 8.1 Setup

- **Vitest 4**, `node` environment, configured in `vitest.config.ts`.
- Tests live in `lib/__tests__/*.test.ts` — the include pattern is `lib/**/*.test.ts`, so tests outside `lib/` won't run.
- Run with `pnpm test` (CI parity) or `pnpm test:watch` while developing.

### 8.2 What must be tested

Pure business logic in `lib/` — aggregation, schemas, store behavior. **Every new or changed exported function in `lib/` gets test coverage** in the matching `__tests__` file (`aggregate.test.ts`, `schemas.test.ts`, `store.test.ts`, or a new sibling).

There are deliberately **no UI/component tests** in this setup. The consequence: keep logic out of components and inside `lib/` so it's testable. If you find yourself wanting a component test, extract the logic first.

### 8.3 How to write them

- Arrange–Act–Assert, one behavior per test, descriptive names:

  ```ts
  // ✅
  it("excludes transactions from other months when a month filter is set", () => { … });

  // ❌
  it("works", () => { … });
  ```

- The store is module-global state — call `resetStore([...])` from `lib/store.ts` in `beforeEach` to isolate tests; never rely on seed data in assertions.
- Time-dependent helpers take an injectable `now: Date` parameter (see `currentMonth`, `createSeedData`) — pass a fixed date in tests rather than mocking globals.
- Build test fixtures as plain `Transaction` objects; amounts in cents, dates as `YYYY-MM-DD` strings.

### 8.4 Don't

- ❌ Don't add snapshot tests — assert specific values.
- ❌ Don't mock `lib/` internals from other `lib/` tests — test through public exports.
- ❌ Don't let a PR lower coverage of `lib/`: changed logic without adjusted tests fails review.

### 8.5 The Philosophy of Testing

A test suite is an executable specification: it documents what the system is supposed to do in a form that cannot silently rot. We optimize our tests for three properties, in order: **trustworthiness** (a green suite means the system works; a red suite means it doesn't), **diagnostic precision** (a failing test points directly at the broken behavior), and **maintainability** (tests survive refactors that preserve behavior). Snapshot tests fail all three: they pass when behavior is wrong but output is unchanged, they fail without explaining why, and they break under every cosmetic refactor. This is why they are banned.

Tests are also a design pressure. Code that is hard to test — code requiring elaborate mocks, global state manipulation, or time travel — is hard to test because it is poorly factored, and the correct response is to fix the factoring, not to escalate the mocking. The injectable-`now` pattern used throughout `lib/` is an example of this principle in action: by making time an explicit input, we make time-dependent logic exactly as testable as pure arithmetic.

### 8.6 On Coverage as a Metric

Coverage percentages measure execution, not verification: a test that calls every line and asserts nothing achieves 100% coverage and 0% value. We therefore treat coverage as a smoke alarm, not a target — its job is to alert us to entirely untested regions, not to gamify line counts. The binding rule is behavioral: every exported function's documented behaviors have corresponding assertions. Goodhart's Law applies in full force here; the moment coverage becomes a target, it ceases to be a useful measure.

---

## 9. Styling

### 9.1 Tailwind 4, utility-first

All styling is Tailwind utility classes in JSX. Global CSS lives only in `app/globals.css` (Tailwind setup + design tokens). No CSS modules, no styled-components, no inline `style` attributes (except truly dynamic values like computed bar widths).

### 9.2 Class literals must be complete

Tailwind only generates classes it can see as full literals. Never build class names by concatenation — this is already a hard rule in `lib/categories.ts` (`CATEGORY_COLORS`):

```tsx
// ✅ full class names in a lookup table
const CATEGORY_COLORS: Record<Category, string> = { Salary: "bg-emerald-500", … };

// ❌ `bg-${color}-500`  — purged away, silently unstyled
```

### 9.3 Conventions

- Conditional styling via template literals over complete class strings (see the type toggle in `components/transaction-form.tsx`).
- Dark mode is supported with `dark:` variants — every new surface needs both light and dark styles, matching neighbors (`bg-zinc-100 dark:bg-zinc-800` patterns).
- Reuse `components/ui/` primitives (Card, Field, Input, …) before writing new bare markup with repeated class stacks.
- Keep class lists in a consistent order: layout → spacing → typography → color → states/variants. Small, consistent scale: `text-xs`/`text-sm`, `rounded-md`/`rounded-lg`, zinc neutrals.

### 9.4 Don't

- ❌ Don't add new colors for categories ad hoc — extend `CATEGORY_COLORS` so the legend, bars, and dots stay in sync.
- ❌ Don't introduce a UI kit (shadcn, MUI, …) — extend `components/ui/` instead.
- ❌ Don't add custom CSS files per component.

### 9.5 On Visual Consistency as a System Property

A user interface communicates trustworthiness through consistency. When spacing, typography, and color follow a small, predictable scale, the interface reads as designed; when they vary arbitrarily, it reads as accreted. The constrained palette and sizing scale mandated above are not aesthetic preferences — they are a systems-level decision that makes every individual styling choice cheaper (fewer options to weigh) and every screen more coherent (fewer one-off values to reconcile). The utility-first approach pays its dividends only under this discipline; utility classes plus unconstrained values is merely inline styles with extra steps.

---

## 10. API Route Handlers

Route handlers live at `app/api/**/route.ts` and exist for **external/REST access** to Ledger data. For app-internal mutations, prefer server actions (see Section 4).

### 10.1 Follow the existing shape

`app/api/transactions/route.ts` and `app/api/transactions/[id]/route.ts` are the templates:

- Export async functions named after HTTP methods (`GET`, `POST`, `DELETE`).
- Validate **all** input with schemas from `lib/schemas.ts` via `safeParse` — query params and JSON bodies alike. Wrap `request.json()` in try/catch (malformed JSON → 400, not a crash).
- Call `lib/store.ts` functions — handlers contain no business logic of their own.
- Call `revalidatePath("/")` after any mutation.
- `params` is a `Promise` — await it (`const { id } = await context.params`).

### 10.2 Status codes and error shape

| Case | Status | Body |
| --- | --- | --- |
| Success (read) | 200 | the resource / `{ transactions, summary }` |
| Created | 201 | the created resource |
| Deleted | 204 | empty (`new Response(null, { status: 204 })`) |
| Validation failure | 400 | `{ error: "<summary>", details: z.flattenError(e).fieldErrors }` |
| Not found | 404 | `{ error: "Transaction not found" }` |

Errors are always `{ error: string, details? }` — don't invent new envelope shapes.

### 10.3 Don't

- ❌ Don't return raw Zod errors — flatten to `fieldErrors`.
- ❌ Don't access the store's internals or fetch other internal routes from a handler.
- ❌ Don't add authentication/middleware ad hoc — that's a team-level decision.

### 10.4 On API Contracts and Their Consumers

An HTTP API is a promise made to parties you cannot see. Unlike internal function signatures, which the compiler renegotiates on every build, an API's contract is enforced by nothing but discipline: the moment a handler ships, some consumer somewhere may begin depending on its exact status codes, error envelope, and field names. Hyrum's Law tells us that with sufficient users, every observable behavior of an interface becomes load-bearing. This is why the error envelope is standardized and non-negotiable, why status codes follow their RFC-defined semantics precisely, and why "it's just an internal API" is not an exemption — internal APIs have a way of becoming external ones without anyone scheduling a meeting about it.

---

## 11. Git Workflow

Trunk-based development with short-lived branches and PRs into `main`.

### 11.1 Branches

- Never commit directly to `main`.
- Branch names: `<type>/<short-kebab-description>` — `feat/monthly-export`, `fix/rounding-error`, `docs/agreements`, `chore/bump-deps`, `demo/harness`.
- One logical change per branch; keep branches small and merge fast.

### 11.2 Commits

[Conventional Commits](https://www.conventionalcommits.org/): `<type>: <imperative subject>` (≤72 chars, no trailing period). Types in use: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`.

```
✅ feat: add month filter to transactions API
✅ fix: round amounts to cents before storing
❌ Updated stuff
❌ feat: Added a new filter.   (past tense, trailing period)
```

Before every commit: `pnpm lint && pnpm test` must pass (the quality gate will run them anyway — fail fast locally). Stage files explicitly; no blanket `git add -A` of unrelated changes.

### 11.3 Pull requests

- PRs target `main`; title follows the same Conventional Commit style.
- Description covers: summary, what changed, how to test. UI changes include a screenshot.
- The quality gate (build + test + lint, `.github/workflows/quality-gate.yml`) must be green before merge.
- Address review comments with new commits (no force-push rewrites of reviewed history); reply to each comment with what was done.

### 11.4 Forbidden

- ❌ `git push --force` to `main`/`master` — ever.
- ❌ Merging with a red quality gate or unresolved blocking review comments.
- ❌ Committing secrets, `.env` files, or `node_modules`.

### 11.5 On Version History as an Asset

A git history is a narrative the team writes for its future self. `git blame`, `git bisect`, and `git log` are debugging tools whose effectiveness is directly proportional to the quality of the commits they traverse. A history of small, well-described, atomic commits lets a future engineer bisect a regression to a fifty-line change in minutes; a history of "WIP", "fix", and thousand-line omnibus commits turns the same investigation into archaeology. Conventional Commit discipline is therefore not bureaucratic ceremony — it is an investment in the debuggability of the system, made one commit at a time, that compounds over the life of the project.

### 11.6 On Code Review Culture

Code review is the highest-leverage quality practice we have, and its value depends entirely on how it is conducted. Reviewers critique code, never people; authors treat critique as a gift, never an attack. A review comment should be specific, actionable, and where possible accompanied by a suggestion. "This is confusing" is less useful than "this would be clearer with an early return." Authors, for their part, owe reviewers small, focused PRs — review quality degrades superlinearly with diff size, and a two-thousand-line PR receives, in practice, a vibes-based skim followed by an approval. Keeping changes small is the single greatest courtesy an author can extend to a reviewer.

---

## 12. Security Considerations

Although this is a demo application with an in-memory store and no authentication, we maintain security hygiene as a matter of habit, because habits are what ship to production when deadlines are tight:

- All external input is validated before use (see Section 7.2). Validation is the first and most important line of defense against injection of every variety.
- Secrets, credentials, API keys, and `.env` files are never committed (see Section 11.4). Once a secret enters git history, it must be considered compromised and rotated — deletion in a later commit does not un-leak it.
- Error responses expose structured, intentional information (see Section 10.2), never stack traces, internal paths, or implementation details that map the attack surface for an adversary.
- Dependencies are kept current; a `chore: bump deps` PR is cheap insurance against known CVEs.
- New authentication, authorization, or middleware concerns are team-level architectural decisions, never ad-hoc additions (see Section 10.3).

---

## 13. Performance Considerations

Performance is a feature, and like all features it is specified, measured, and maintained rather than assumed:

- Server Components by default (Section 4.1) is itself the project's largest performance lever — every avoided `'use client'` is JavaScript the user never downloads.
- All aggregation arithmetic happens in `lib/` over integer cents — cheap, allocation-light, and already unit-tested for correctness, which is a precondition for safely optimizing anything.
- Avoid premature optimization: with an in-memory store, no data operation in this application is a bottleneck. The Knuth dictum applies — measure before optimizing, and expect the measurement to embarrass your intuition.
- Should real performance work ever be warranted, it begins with profiling, proceeds by changing one variable at a time, and ends with a regression guard. Optimization without measurement is superstition with a diff attached.

---

## 14. Documentation Standards

- Code is the primary documentation; comments explain *why*, never *what*. A comment that paraphrases the line below it is noise that will eventually lie.
- Team agreements (this document) record decisions and their rationale so that future contributors inherit the reasoning, not just the rules.
- README-level documentation covers setup and operation; it is kept runnable — documentation that has drifted from reality is worse than no documentation, because it is trusted.
- When behavior changes, the documentation change ships in the same PR. Documentation debt, like all debt, is cheapest to pay at the moment it is incurred.

---

## 15. Final Remarks

These standards represent the accumulated judgment of the team, and every contributor who follows them participates in a compact: each of us trades a small amount of individual freedom for a large amount of collective velocity. None of these rules exists for its own sake; each one is a scar from a class of defect someone, somewhere, has shipped before. Read them, apply them, and when one of them stops earning its keep — say so, and we will change it together.

Quality is not negotiable. Consistency is not optional. Excellence is a habit.
