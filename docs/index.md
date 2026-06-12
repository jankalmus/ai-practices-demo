# Engineering Standards — Index

The detailed standards live in the topic files in this directory. This index is the **shared entry point** for triage — one place to look, one place to change.

**The on-demand rule (mandatory).** Before doing real work in an area, open and read the corresponding `docs/*.md` file — and read *only* the docs relevant to the current task, not all of them. The descriptions below tell you what each file covers and when it applies, so you can decide relevance without opening it.

## Topic index

| Topic | Content description | Applicable paths |
| --- | --- | --- |
| [documentation-standards.md](./documentation-standards.md) | Comments explain *why*; **+ the mandatory generated-file header for AI-authored `.ts`/`.tsx`**. | `**/*.{ts,tsx}` |
| [coding-principles.md](./coding-principles.md) | SOLID, DRY, YAGNI, least astonishment, defense in depth, illegal states. | `*` |
| [nextjs.md](./nextjs.md) | Next.js 16.2.9 App Router: server components by default, awaited `params`, server actions, caching. "It's just CSS" never excuses skipping it. | `app/**` |
| [react-components.md](./react-components.md) | Rules on structuring React components used in our Next.js pages. Covers, file naming, props typing, server/client split, accessibility, granularity. | `components/**/*.tsx`, `app/**/*.tsx` |
| [typescript.md](./typescript.md) | Strict mode, no `any`, derive types via `z.infer`, discriminated unions. | `**/*.{ts,tsx}` |
| [data-and-validation.md](./data-and-validation.md) | The store as single data access point, Zod at every boundary, integer-cent money, string dates. | `lib/**` |
| [testing.md](./testing.md) | Vitest setup, what must be tested, AAA style, no snapshots. | `lib/**`, `**/*.test.ts` |
| [styling.md](./styling.md) | Tailwind utility-first, complete class literals, dark mode, the constrained scale. | `**/*.tsx`, `app/globals.css` |
| [api-route-handlers.md](./api-route-handlers.md) | Handler shape, status codes, the standard error envelope. | `app/api/**/route.ts` |
| [git-workflow.md](./git-workflow.md) | Branch naming, Conventional Commits, PRs, forbidden operations. | `*` (git operations) |