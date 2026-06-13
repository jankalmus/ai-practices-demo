# Project Engineering Standards — Index

This file is the **index** to our engineering standards. The detailed standards live in topic files under [`docs/`](./docs/).

**The on-demand rule (mandatory).** Before doing real work in an area, open and read the corresponding `docs/*.md` file — and read *only* the docs relevant to the current task, not all of them. The index descriptions below tell you what each file covers and when it applies, so you can decide relevance without opening it. The hard-rules quick reference is a summary for the common cases, **not** a substitute for reading the topic doc when you work in that area.

## Read on every code-generating task, no exceptions

The on-demand rule below is about *relevance triage*. These two docs are exempt from that triage — they apply to **every** task that generates or edits code, no matter how small (yes, including a one-line Tailwind tweak). Read them before writing code, every time:

- [documentation-standards.md](./docs/documentation-standards.md) — how we document our code after changes.
- [general-principles.md](./docs/general-principles.md) — SOLID, DRY, YAGNI, and how we write code.

## Topic index

| Topic | Content description | Applicable paths |
| --- | --- | --- |
| [engineering-philosophy.md](./docs/engineering-philosophy.md) | The five pillars and how we resolve conflicts; consult when a decision feels like a judgment call. | `*` |
| [documentation-standards.md](./docs/documentation-standards.md) | Comments explain *why*; **+ the mandatory generated-file header for AI-authored `.ts`/`.tsx`**. | `**/*.{ts,tsx}` |
| [general-principles.md](./docs/general-principles.md) | SOLID, DRY, YAGNI, least astonishment, defense in depth, illegal states. | `*` |
| [nextjs.md](./docs/nextjs.md) | Next.js 16.2.9 App Router: server components by default, awaited `params`, server actions, caching. "It's just CSS" never excuses skipping it. | `app/**` |
| [react-components.md](./docs/react-components.md) | Rules on structuring React components used in our Next.js pages. Covers, file naming, props typing, server/client split, accessibility, granularity. | `components/**/*.tsx`, `app/**/*.tsx` |
| [typescript.md](./docs/typescript.md) | Strict mode, no `any`, derive types via `z.infer`, discriminated unions. | `**/*.{ts,tsx}` |
| [data-and-validation.md](./docs/data-and-validation.md) | The store as single data access point, Zod at every boundary, integer-cent money, string dates. | `lib/**` |
| [testing.md](./docs/testing.md) | Vitest setup, what must be tested, AAA style, no snapshots. | `lib/**`, `**/*.test.ts` |
| [styling.md](./docs/styling.md) | Tailwind utility-first, complete class literals, dark mode, the constrained scale. | `**/*.tsx`, `app/globals.css` |
| [api-route-handlers.md](./docs/api-route-handlers.md) | Handler shape, status codes, the standard error envelope. | `app/api/**/route.ts` |
| [git-workflow.md](./docs/git-workflow.md) | Branch naming, Conventional Commits, PRs, forbidden operations. | `*` (git operations) |
| [security.md](./docs/security.md) | Input validation, secret hygiene, safe error responses. | `app/api/**`, `app/actions.ts`, `lib/**` |
| [performance.md](./docs/performance.md) | Server components as the main lever, measure-before-optimizing. | `*` (optimization work) |

