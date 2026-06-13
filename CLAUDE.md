All engineering standards are indexed in **[docs/index.md](./docs/index.md)**. Read it to triage which `docs/*.md` apply, and follow **the on-demand rule** it describes: before doing real work in an area, open and read the relevant `docs/*.md` — and only those relevant to the task, not all of them.

**On every code-generating task — no triage, no exceptions** (yes, including a one-line Tailwind tweak), read these two before writing code:

- [general-principles.md](./docs/general-principles.md) — SOLID, DRY, YAGNI, and how we write code.
- [documentation-standards.md](./docs/documentation-standards.md) — how we document our code, including the mandatory generated-file header for AI-authored `.ts`/`.tsx`.

## The development loop

Code is not done the moment it's written. Every code change runs through a short cycle, and the cycle repeats until the change is actually clean — not just until it looks finished. The point is to catch failures while they're cheap (a failed build, a broken test, an agreement you drifted away from) instead of discovering them in review or in CI, where they cost far more to unwind.

**Decide the session's PR intent up front (once).** Before starting a code change, establish whether this session should finish by opening a pull request:

- If you are carrying out a **plan the user approved** (plan mode), the session **is** authorized to open a PR — approving the plan covers the change through to the PR. Don't ask again.
- Otherwise, **ask the user once, immediately** (AskUserQuestion): "Should this session open a pull request when the change is clean?" A *yes* lets the rest of the cycle run agentically through to the PR; a *no* falls back to confirming before any commit or PR.

Carry that decision through the whole session.

1. **Code** — implement the change, following the standards indexed in [docs/index.md](./docs/index.md).
2. **Verify** — run the `verify` skill (build, lint, test). This is what tells you the app still compiles, type-checks, and passes its tests; skipping it means you're only guessing the change works.
3. **Code-review** — delegate to the `code-reviewer` **subagent** (via the Agent tool, `subagent_type: code-reviewer`) — **not** the similarly-named global `code-review` skill, which is a different, unrelated tool. It reviews the change against the standards in its own fresh context window, so the review isn't coloured by the assumptions you made while writing the code. It reports findings back to you.
4. **Repeat** — if verify fails, or the review returns any 🔴 blocking finding, go back to step 1 and address it, then run the cycle again.
5. **Finalize** — once verify is green **and** the review reports no blocking findings, the change is clean. Then:
   - **PR authorized** (approved plan, or the up-front *yes*) → commit with the `commit` skill, then open the PR with the `pull-request` skill, **without asking again**.
   - **Not authorized** (the up-front *no*) → report the change is clean, then confirm with the user before any commit or PR.

Steps 1–4 repeat until the change is clean; only then does step 5 run. Do not announce a change as complete, commit it, or open a PR before that bar is met.
