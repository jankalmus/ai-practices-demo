# Next.js App Router

## Critical Platform Notice

**This is NOT the Next.js you know.** This project runs **Next.js 16.2.9** — a version with breaking changes relative to what AI assistants may know from training data. APIs, conventions, and file structure may all differ. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices. When unsure, read the bundled guides in `node_modules/next/dist/docs/01-app/01-getting-started/` (especially `05-server-and-client-components.md`, `07-mutating-data.md`, `08-caching.md`, `15-route-handlers.md`).

## Server Components by default

Pages and layouts are Server Components. Add `'use client'` only when the component needs state, event handlers, effects, or browser APIs — and push it to the leaves of the tree.

```tsx
// ✅ app/page.tsx — async server component fetching from the store directly
export default async function Home() { … }

// ✅ components/transaction-form.tsx — leaf client component
"use client";
export function TransactionForm({ defaultDate }: { defaultDate: string }) { … }

// ❌ Adding 'use client' to a page just to use useState in one button
```

## `params` and `searchParams` are Promises

Dynamic route params must be awaited:

```ts
// ✅ app/api/transactions/[id]/route.ts
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
}

// ❌ const { id } = context.params;  // not awaited — type error in Next 16
```

## Mutations: server actions first

App-internal mutations go through server actions in `app/actions.ts` (`'use server'`), wired to forms via `useActionState`. Route handlers exist for **external/REST** access only — don't add client-side `fetch` calls to our own API for things a server action can do.

After every mutation, invalidate affected routes:

```ts
// ✅ both actions.ts and route handlers do this
store.addTransaction(…);
revalidatePath("/");
```

## Caching

`cacheComponents` is **not** enabled in `next.config.ts` — we use the classic model. Do not add `'use cache'` / `cacheLife` directives without a team decision. Rely on `revalidatePath` after mutations.

## Don't

- ❌ Don't add `getServerSideProps` / `getStaticProps` — Pages Router APIs don't exist here.
- ❌ Don't fetch our own HTTP API from server components — call `lib/store.ts` functions directly.
- ❌ Don't introduce new top-level data fetching libraries; the in-memory store is the data layer.

## Rationale and Background

The Server Components model represents a fundamental shift in how React applications are architected. By rendering on the server by default, we minimize the JavaScript shipped to the client, improve Time to Interactive, and keep data access co-located with rendering. Every `'use client'` directive is a bundle-size decision, not merely a technical convenience. Treat the client boundary as an architectural boundary deserving the same scrutiny as a network API boundary. Historically, teams that scattered client components throughout their tree found themselves shipping megabytes of unnecessary JavaScript and fighting hydration mismatches; we adopt the leaf-node discipline precisely to avoid repeating that history.
