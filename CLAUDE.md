All engineering standards are indexed in **[docs/index.md](./docs/index.md)**. Read it to triage which `docs/*.md` apply, and follow **the on-demand rule** it describes: before doing real work in an area, open and read the relevant `docs/*.md` — and only those relevant to the task, not all of them.

**On every code-generating task** read these two before writing code:

- [coding-principles.md](./docs/coding-principles.md) — SOLID, DRY, YAGNI, and how we write code.
- [documentation-standards.md](./docs/documentation-standards.md) — how we document our code, including the mandatory generated-file header for AI-authored `.ts`/`.tsx`.

For **feature documentation** — what features exist, what they must do, what constraints they have, and which files implement them — see **[docs/features/](./docs/features/)** and its [index](./docs/features/index.md). These docs describe the  behavior of the system, distinct from engineering standards.

## The development loop

Follow the defined development cycle when asked to develop functionality:

1. **Code** — implement the change, following the standards indexed in [docs/index.md](./docs/index.md).
2. **Verify** — run the `verify` skill (build, lint, test). This is what tells you the app still compiles, type-checks, and passes its tests; skipping it means you're only guessing the change works.
3. **Code-review** — run the `code-review` skill. It delegates to the `code-reviewer` agent, which runs in an isolated context — it has not seen your implementation work, reads the diff fresh, and judges it against the standards in [docs/index.md](./docs/index.md) without inheriting your assumptions. The agent reports its findings back; relay them as-is.
4. **Repeat** — if verify fails, or the review returns any 🔴 blocking finding, go back to step 1 and address it, then run the cycle again.

The change is done only when verify is green and the review reports no blocking findings. Do not announce a change as complete, commit it, or open a PR before then.
