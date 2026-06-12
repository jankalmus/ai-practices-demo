# Recipe: route handlers (external / REST access)

**Use this only when** data must be reachable by clients outside the app — a REST consumer, a webhook, an integration. For anything the app's own UI does, use a server action instead (see the mutation recipe); don't add a route handler just so a client component can `fetch` it. Read alongside [api-route-handlers.md](../../../../docs/api-route-handlers.md) and [security.md](../../../../docs/security.md).

`app/api/transactions/route.ts` and `app/api/transactions/[id]/route.ts` are the canonical templates. Follow their shape exactly — an HTTP contract is load-bearing the moment it ships.

## Collection handler — `app/api/<resource>/route.ts`

```ts
import type { NextRequest } from "next/server";
import { z } from "zod";

import { totalByCategory } from "@/lib/aggregate";
import { reportFiltersSchema } from "@/lib/schemas";
import { listTransactions } from "@/lib/store";

export async function GET(request: NextRequest) {
  const parsed = reportFiltersSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid filters", details: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const transactions = listTransactions(parsed.data);
  return Response.json({ report: totalByCategory(transactions) });
}
```

For a `POST`, wrap `request.json()` in try/catch (malformed JSON → 400, not a crash), `safeParse` the body, call the store, `revalidatePath("/")`, and return the created resource with `201`.

## Item handler — `app/api/<resource>/[id]/route.ts`

`params` is a `Promise` in Next 16 — await it.

```ts
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const item = getReport(id);
  if (!item) {
    return Response.json({ error: "Report not found" }, { status: 404 });
  }
  return Response.json(item);
}
```

## The contract (non-negotiable)

| Case | Status | Body |
| --- | --- | --- |
| Success (read) | 200 | the resource / `{ … }` |
| Created | 201 | the created resource |
| Deleted | 204 | empty (`new Response(null, { status: 204 })`) |
| Validation failure | 400 | `{ error: "<summary>", details: z.flattenError(e).fieldErrors }` |
| Not found | 404 | `{ error: "… not found" }` |

Rules:

- **Method-named exports** (`GET`, `POST`, `DELETE`) — async functions, no default export.
- **Validate all input** — query params and JSON bodies — with `lib/schemas.ts` via `safeParse`. Flatten Zod errors to `fieldErrors`; never return raw Zod errors.
- **No business logic in handlers** — they validate, call `lib/store.ts`, and shape the response. Nothing more.
- **`revalidatePath("/")`** after any mutation.
- **Error envelope is always `{ error: string, details? }`** — don't invent new shapes.
- Don't access store internals, don't fetch other internal routes, and don't bolt on auth/middleware ad hoc — that's a team-level decision.
