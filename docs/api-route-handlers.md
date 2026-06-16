# API Route Handlers

Route handlers live at `app/api/**/route.ts` and exist for **external/REST access** to Ledger data. For app-internal mutations, prefer server actions (see [nextjs.md](./nextjs.md)).

## Follow the existing shape

`app/api/transactions/route.ts` and `app/api/transactions/[id]/route.ts` are the templates:

- Export async functions named after HTTP methods (`GET`, `POST`, `DELETE`).
- Validate **all** input with schemas from `lib/schemas.ts` via `safeParse` — query params and JSON bodies alike. Wrap `request.json()` in try/catch (malformed JSON → 400, not a crash).
- Call `lib/store.ts` functions — handlers contain no business logic of their own.
- Call `revalidatePath("/")` after any mutation.
- `params` is a `Promise` — await it (`const { id } = await context.params`).

## Status codes and error shape

| Case | Status | Body |
| --- | --- | --- |
| Success (read) | 200 | the resource / `{ transactions, summary }` |
| Created | 201 | the created resource |
| Deleted | 204 | empty (`new Response(null, { status: 204 })`) |
| Validation failure | 400 | `{ error: "<summary>", details: z.flattenError(e).fieldErrors }` |
| Not found | 404 | `{ error: "Transaction not found" }` |

Errors are always `{ error: string, details? }` — don't invent new envelope shapes.

## Don't

- ❌ Don't return raw Zod errors — flatten to `fieldErrors`.
- ❌ Don't access the store's internals or fetch other internal routes from a handler.
- ❌ Don't add authentication/middleware ad hoc — that's a team-level decision.
