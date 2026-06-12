All engineering standards are indexed in **[docs/index.md](./docs/index.md)**. Read it to triage which `docs/*.md` apply, and follow **the on-demand rule** it describes: before doing real work in an area, open and read the relevant `docs/*.md` — and only those relevant to the task, not all of them.

**On every code-generating task — no triage, no exceptions** (yes, including a one-line Tailwind tweak), read these two before writing code:

- [general-principles.md](./docs/general-principles.md) — SOLID, DRY, YAGNI, and how we write code.
- [documentation-standards.md](./docs/documentation-standards.md) — how we document our code, including the mandatory generated-file header for AI-authored `.ts`/`.tsx`.

## The development loop

Code is not done the moment it's written. Every code change runs through a short cycle, and the cycle repeats until the change is actually clean — not just until it looks finished. The point is to catch failures while they're cheap (a failed build, a broken test, an agreement you drifted away from) instead of discovering them in review or in CI, where they cost far more to unwind.

1. **Code** — implement the change, following the standards indexed in [docs/index.md](./docs/index.md).
2. **Verify** — run the `verify` skill (build, lint, test). This is what tells you the app still compiles, type-checks, and passes its tests; skipping it means you're only guessing the change works.
3. **Code-review** — run the `code-review` skill. It reviews the change against the standards indexed in [docs/index.md](./docs/index.md), reading the diff fresh rather than trusting the assumptions you made while writing the code, and reports its findings back to you.
4. **Repeat** — if verify fails, or the review returns any 🔴 blocking finding, go back to step 1 and address it, then run the cycle again.

The change is done only when verify is green **and** the review reports no blocking findings. Do not announce a change as complete, commit it, or open a PR before then.
