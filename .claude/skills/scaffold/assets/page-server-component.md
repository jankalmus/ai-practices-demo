# Recipe: the page (server component, read path)

**Use this for** the page itself — the thing at a URL that reads data and renders it. This is the starting point for almost every new screen. Read alongside [nextjs.md](../../../../docs/nextjs.md), [react-components.md](../../../../docs/react-components.md), and [styling.md](../../../../docs/styling.md).

## The file

A page lives at `app/<route>/page.tsx` and is an `async` **server component** with a `default export`. It reads from `lib/` directly and passes plain serializable props to components.

```tsx
import Link from "next/link";

import { SummaryCards } from "@/components/summary-cards";
import { availableMonths, currentMonth, monthLabel, summarize } from "@/lib/aggregate";
import { listFiltersSchema } from "@/lib/schemas";
import { listTransactions } from "@/lib/store";

// The store is mutable in-process memory — never prerender this page.
export const dynamic = "force-dynamic";

export default async function Reports({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // searchParams is a Promise in Next 16 — await it.
  const params = await searchParams;

  // Validate the boundary. Never trust raw query params.
  const parsed = listFiltersSchema.safeParse({
    month: typeof params.month === "string" ? params.month : undefined,
  });
  const filters = parsed.success ? parsed.data : {};

  const months = availableMonths(listTransactions());
  const month = filters.month ?? months[0] ?? currentMonth();
  const transactions = listTransactions({ month });
  const summary = summarize(transactions); // compute in lib/, not here

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Reports</h1>
          <p className="mt-2 text-sm text-zinc-500">{monthLabel(month)} overview</p>
        </div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">
          ← Back to overview
        </Link>
      </header>

      <main className="mt-8">
        <SummaryCards summary={summary} />
      </main>
    </div>
  );
}
```

## Conventions baked in above

- **Server component, default export, `async`.** Don't add `'use client'` to a page. If one button needs interactivity, extract a leaf client component (see the mutation recipe).
- **`export const dynamic = "force-dynamic"`** on any page that reads the store — it changes between requests and must not be prerendered.
- **`searchParams` (and `params`) are Promises** — `await` them. Reading `params.month` without awaiting is a type error in Next 16.
- **Validate query input** through a `lib/schemas.ts` schema via `safeParse`, then fall back to a default on failure rather than throwing.
- **Read via `lib/store.ts` and `lib/aggregate.ts`** — never `fetch('/api/...')` from the server, and never compute totals/filters inline (that belongs in `lib/`, where it is tested).
- **Layout container** follows the existing page: `mx-auto w-full max-w-6xl … px-4 py-8 sm:px-6 lg:py-12`, a `<header>` landmark, a `<main>`. Reuse `components/ui/` primitives and existing feature components rather than hand-rolling markup. Use complete Tailwind class literals (no string interpolation that breaks the JIT) — see `styling.md`.
- **Filenames:** the route folder is the URL. Components stay kebab-case named exports; only the page uses a default export.

## Wiring navigation

Add a `next/link` from an existing page (e.g. the home header) so the new route is reachable. Links are relative paths (`/reports`, `/reports?month=2026-06`).
