---
name: verify
description: The quality gate of the development loop — runs the build, lint, and tests locally so you find broken builds, type errors, lint violations, and failing tests yourself, before they reach code-review or CI where they are far more expensive to unwind. Run it after every code change, and again before moving on to the code-reviewer subagent, committing, or opening a PR. Do not describe a change as working, or treat it as done, until you have actually run these checks and watched all three pass — a change that has not been verified is only assumed to work, not known to.
tools: Bash
---

# Verify

Run to confirm the application is operational before wrapping up a development cycle.

## When to use

- At the **end of a development cycle**, once a change feels complete.
- Before `/commit` or `/pull-request`, to catch failures locally instead of in CI.
- Whenever you need to confirm the app still builds, type-checks, lints, and passes tests.

## How to run

Run all three checks. CI runs them as independent jobs, so a green local run means a green gate.

You should never use PowerShell to run any of the commands, always use the Bash tool.

```bash
pnpm build                       # Next.js production build (also type-checks)
pnpm lint                        # ESLint
pnpm test                        # Vitest (vitest run)
```

Run them individually rather than chained so a failure in one doesn't mask the others — report the status of all three.

## Interpreting results

- **All three pass** → the app is operational. Say so plainly and report what ran.
- **Any check fails** → the app is **not** verified. Show the failing output, identify the cause, and fix it (or report it clearly). Re-run the failed check after fixing.

## Rules

- **Never** declare success without actually running the checks and seeing them pass.
- **Never** bypass a failure (e.g. skipping tests, `--no-verify`, disabling lint rules to silence an error). Fix the underlying cause.
- `pnpm build` is required — it's the type-check too. Don't substitute `tsc` or skip it.
- If a check is genuinely flaky or environment-dependent, say so explicitly rather than silently passing.
