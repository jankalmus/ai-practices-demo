# Engineering Standards — Index

The detailed standards live in the topic files in this directory. This index is the **shared entry point** for triage — one place to look, one place to change.

**The on-demand rule (mandatory).** Before doing real work in an area, open and read the corresponding `docs/*.md` file — and read *only* the docs relevant to the current task, not all of them. The descriptions below tell you what each file covers and when it applies, so you can decide relevance without opening it.

## Read on every code-generating task, no exceptions

The on-demand rule above is about *relevance triage*. These two docs are exempt from that triage — they apply to **every** task that generates or edits code, no matter how small (yes, including a one-line Tailwind tweak). Read them before writing code, every time:

- [documentation-standards.md](./documentation-standards.md) — how we document our code after changes.
- [general-principles.md](./general-principles.md) — SOLID, DRY, YAGNI, and how we write code.

## Topic index

| Topic | Content description | Applicable paths |
| --- | --- | --- |
| [engineering-philosophy.md](./engineering-philosophy.md) | The five pillars and how we resolve conflicts; consult when a decision feels like a judgment call. | `*` |
| [documentation-standards.md](./documentation-standards.md) | Comments explain *why*; **+ the mandatory generated-file header for AI-authored `.ts`/`.tsx`**. | `**/*.{ts,tsx}` |
| [general-principles.md](./general-principles.md) | SOLID, DRY, YAGNI, least astonishment, defense in depth, illegal states. | `*` |
| [nextjs.md](./nextjs.md) | Next.js 16.2.9 App Router: server components by default, awaited `params`, server actions, caching. "It's just CSS" never excuses skipping it. | `app/**` |
| [react-components.md](./react-components.md) | Rules on structuring React components used in our Next.js pages. Covers, file naming, props typing, server/client split, accessibility, granularity. | `components/**/*.tsx`, `app/**/*.tsx` |
| [typescript.md](./typescript.md) | Strict mode, no `any`, derive types via `z.infer`, discriminated unions. | `**/*.{ts,tsx}` |
| [data-and-validation.md](./data-and-validation.md) | The store as single data access point, Zod at every boundary, integer-cent money, string dates. | `lib/**` |
| [testing.md](./testing.md) | Vitest setup, what must be tested, AAA style, no snapshots. | `lib/**`, `**/*.test.ts` |
| [styling.md](./styling.md) | Tailwind utility-first, complete class literals, dark mode, the constrained scale. | `**/*.tsx`, `app/globals.css` |
| [api-route-handlers.md](./api-route-handlers.md) | Handler shape, status codes, the standard error envelope. | `app/api/**/route.ts` |
| [git-workflow.md](./git-workflow.md) | Branch naming, Conventional Commits, PRs, forbidden operations. | `*` (git operations) |
| [security.md](./security.md) | Input validation, secret hygiene, safe error responses. | `app/api/**`, `app/actions.ts`, `lib/**` |
| [performance.md](./performance.md) | Server components as the main lever, measure-before-optimizing. | `*` (optimization work) |

## Feature documentation

The files above are **engineering standards** — how we build. Per-feature documentation — *what* we built, its requirements, restrictions, integrations, and implementing files — lives separately in [features/](./features/index.md), authored by the `document` skill. Consult it when you need to understand or document a specific business feature rather than a coding rule.
