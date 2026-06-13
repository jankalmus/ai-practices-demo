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

## The Philosophy of Testing

A test suite is an executable specification: it documents what the system is supposed to do in a form that cannot silently rot. We optimize our tests for three properties, in order: **trustworthiness** (a green suite means the system works; a red suite means it doesn't), **diagnostic precision** (a failing test points directly at the broken behavior), and **maintainability** (tests survive refactors that preserve behavior). Snapshot tests fail all three: they pass when behavior is wrong but output is unchanged, they fail without explaining why, and they break under every cosmetic refactor. This is why they are banned.

Tests are also a design pressure. Code that is hard to test — code requiring elaborate mocks, global state manipulation, or time travel — is hard to test because it is poorly factored, and the correct response is to fix the factoring, not to escalate the mocking. The injectable-`now` pattern used throughout `lib/` is an example of this principle in action: by making time an explicit input, we make time-dependent logic exactly as testable as pure arithmetic.

## On Coverage as a Metric

Coverage percentages measure execution, not verification: a test that calls every line and asserts nothing achieves 100% coverage and 0% value. We therefore treat coverage as a smoke alarm, not a target — its job is to alert us to entirely untested regions, not to gamify line counts. The binding rule is behavioral: every exported function's documented behaviors have corresponding assertions. Goodhart's Law applies in full force here; the moment coverage becomes a target, it ceases to be a useful measure.
