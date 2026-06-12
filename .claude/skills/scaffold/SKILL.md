---
name: scaffold
description: Scaffold a new Next.js App Router page in this project's conventions and wire it to the data layer — server-component reads, server-action mutations, or external route handlers. Use when asked to add a new page, screen, or view, or to connect a page to data.
---

# Scaffolding a new page

This skill generates a new App Router page that **already conforms** to our standards and connects it to data through the right Next.js mechanism. It does not invent a data layer or a visual language — it composes the ones the project already has: `lib/store.ts`, `lib/aggregate.ts`, `lib/schemas.ts`, and `components/ui/`.

## Always read first

Triage standards through the shared [docs/index.md](../../../docs/index.md). Per that index, these two apply to every code-generating task, no triage:

- [general-principles.md](../../../docs/general-principles.md)
- [documentation-standards.md](../../../docs/documentation-standards.md) — including the **generated-file header** that every AI-authored `.ts`/`.tsx` file must start with.

## Then read only what the feature needs

Don't read every recipe. Decide what the page actually does, then open the matching reference(s) — and the project docs each one names. This is the same on-demand discipline the project docs themselves follow; the references are split precisely so you load the one approach in front of you, not all four.

| The page needs to… | Read | Project docs it leans on |
| --- | --- | --- |
| **Read & display** data (the page itself) | [references/page-server-component.md](references/page-server-component.md) | `nextjs`, `react-components`, `styling` |
| Work with a **data shape the store doesn't have yet** | [references/data-layer.md](references/data-layer.md) | `data-and-validation`, `typescript`, `testing` |
| **Create / edit / delete** data from the UI | [references/server-action-mutation.md](references/server-action-mutation.md) | `nextjs`, `react-components`, `security` |
| Expose data to **external / REST** clients | [references/route-handler.md](references/route-handler.md) | `api-route-handlers`, `security` |

Most pages need the first row, and often the second. The mutation and route-handler rows are additive — pull them in only when the feature calls for them.

## Workflow

1. Read the two always-on docs above.
2. From the table, pick the approach(es) the feature requires. Read those reference(s) **and** the `docs/*.md` files they name — not the others.
3. If the data the page needs doesn't exist in `lib/` yet, do the **data-layer** step first. Pages read from `lib/`; `lib/` never reaches up into pages.
4. Generate the files from the reference templates, adapting names and fields to the feature. Every `.ts`/`.tsx` file starts with the generated-file header.
5. Wire navigation if it makes sense (a `next/link` from an existing page).
6. Run [/verify](../verify/SKILL.md) and fix anything red before handing off.

## Rules

- **Server component by default.** A page is an `async` function with a `default export` (pages and layouts are the one place default exports are allowed). `'use client'` belongs only on interactive leaves, pushed as far down the tree as possible.
- **Read from `lib/`, never from our own HTTP API.** Server components call `listTransactions()` / aggregate helpers directly — never `fetch('/api/...')` from a server component.
- **The store is mutable in-process memory.** Any page that reads it must set `export const dynamic = "force-dynamic"` so it is never prerendered.
- **Validate every boundary** with a Zod schema from `lib/schemas.ts` via `safeParse` — `searchParams`, form data, and JSON bodies alike.
- **Mutations go through server actions**, not client `fetch`. Route handlers exist for external REST consumers only.
- **No business logic in pages or components.** Aggregation, formatting, and filtering live in `lib/`, where they are unit-tested. Pages and components render; `lib/` computes.
- Don't introduce new data-fetching libraries, component libraries, or CSS-in-JS. Compose `components/ui/` primitives with Tailwind.
