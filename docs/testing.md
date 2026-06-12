# Testing

## Setup

- **Vitest 4**, `node` environment, configured in `vitest.config.ts`.
- Tests live in `lib/__tests__/*.test.ts` — the include pattern is `lib/**/*.test.ts`, so tests outside `lib/` won't run.
- Run with `pnpm test` (CI parity) or `pnpm test:watch` while developing.

## What must be tested

Pure business logic in `lib/` — aggregation, schemas, store behavior. **Every new or changed exported function in `lib/` gets test coverage** in the matching `__tests__` file (`aggregate.test.ts`, `schemas.test.ts`, `store.test.ts`, or a new sibling).

There are deliberately **no UI/component tests** in this setup. The consequence: keep logic out of components and inside `lib/` so it's testable. If you find yourself wanting a component test, extract the logic first.

## How to write them

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

## Don't

- ❌ Don't add snapshot tests — assert specific values.
- ❌ Don't mock `lib/` internals from other `lib/` tests — test through public exports.
- ❌ Don't let a PR lower coverage of `lib/`: changed logic without adjusted tests fails review.