# Ledger

A simple budgeting app — track expenses and incomes with a categorized monthly overview. Data lives in an in-memory store seeded with demo transactions, so the app is fully self-contained: no database, no external services.

This repository doubles as a demo of **enterprise AI-assisted development practices** — see [AI-assisted development](#ai-assisted-development) below.

## Stack

| Layer | Technology | Notes |
| --- | --- | --- |
| Framework | Next.js 16.2.9 (App Router) | 
| UI | React 19 | Server Components by default |
| Language | TypeScript 5 | `strict` mode, `@/*` path alias to repo root |
| Styling | Tailwind CSS 4 | Via `@tailwindcss/postcss` |
| Validation | Zod 4 | All external input validated at the boundary |
| Testing | Vitest 4 | Node environment, tests in `lib/__tests__/` |
| Linting | ESLint 9 | Flat config (`eslint.config.mjs`) |
| Package manager | pnpm 10 | Node 22 in CI |

## Project structure

```
app/                      Next.js App Router
  layout.tsx              Root layout
  page.tsx                Home page (server component)
  actions.ts              Server actions (mutations: add/delete transaction)
  api/transactions/       Route handlers (REST API: list, create, get, delete)
components/               React components (kebab-case files)
  ui/                     Shared UI primitives (Card, Field, Input, …)
  icons/                  Icon components
lib/                      Business logic (framework-free, unit-tested)
  store.ts                In-memory data store — the single data access point
  schemas.ts              Zod schemas + Transaction type
  aggregate.ts            Summaries, category breakdowns, formatting
  categories.ts           Income/expense category definitions
  seed.ts                 Demo seed data
  __tests__/              Vitest unit tests
docs/
  agreements/             Team technical agreements (per stack/objective)
  features/               Feature documentation
.claude/                  Claude Code harness: skills, hooks, settings
  tools/ledger-mcp/       Local MCP server exposing the transactions API
.github/workflows/        CI quality gate (build, test, lint)
```

## Getting started

Prerequisites: **Node 22** and **pnpm 10** (`corepack enable` or `npm i -g pnpm`).

```bash
pnpm install
pnpm dev          # start dev server → http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build
pnpm start        # serve the production build
pnpm test         # run unit tests once (vitest)
pnpm test:watch   # run tests in watch mode
pnpm lint         # eslint over the repo
```

## Quality gate

Every push and pull request runs the quality gate ([.github/workflows/quality-gate.yml](.github/workflows/quality-gate.yml)): **build**, **test**, and **lint** as parallel jobs. All three must pass before merging. Run the same checks locally with `pnpm lint && pnpm test && pnpm build`.

## Documentation

- [docs/agreements/index.md](docs/agreements/index.md) — granular team technical agreements (Next.js conventions, testing, validation, git workflow, …). Read the ones relevant to your change.
- [docs/features/](docs/features/) — one document per user-facing feature.

## AI-assisted development

This repo ships a project-specific Claude Code harness:

- **[CLAUDE.md](CLAUDE.md) / [AGENTS.md](AGENTS.md)** — entry-point instructions for AI agents, pointing to the agreements index.
- **[.claude/skills/](.claude/skills/)** — task playbooks (running the project, committing, PRs, code review, addressing PR feedback, documenting features).
- **[.claude/hooks/](.claude/hooks/)** — guardrails: auto-lint after every file edit, safety analysis of shell commands before execution.