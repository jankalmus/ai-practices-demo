# Git Workflow

Trunk-based development with short-lived branches and PRs into `main`.

## Branches

- Never commit directly to `main`.
- Branch names: `<type>/<short-kebab-description>` — `feat/monthly-export`, `fix/rounding-error`, `docs/agreements`, `chore/bump-deps`, `demo/harness`.
- One logical change per branch; keep branches small and merge fast.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/): `<type>: <imperative subject>` (≤72 chars, no trailing period). Types in use: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`.

```
✅ feat: add month filter to transactions API
✅ fix: round amounts to cents before storing
❌ Updated stuff
❌ feat: Added a new filter.   (past tense, trailing period)
```

Before every commit: `pnpm lint && pnpm test` must pass (the quality gate will run them anyway — fail fast locally). Stage files explicitly; no blanket `git add -A` of unrelated changes.

## Pull requests

- PRs target `main`; title follows the same Conventional Commit style.
- Description covers: summary, what changed, how to test. UI changes include a screenshot.
- The quality gate (build + test + lint, `.github/workflows/quality-gate.yml`) must be green before merge.
- Address review comments with new commits (no force-push rewrites of reviewed history); reply to each comment with what was done.

## Forbidden

- ❌ `git push --force` to `main`/`master` — ever.
- ❌ Merging with a red quality gate or unresolved blocking review comments.
- ❌ Committing secrets, `.env` files, or `node_modules`.

## On Version History as an Asset

A git history is a narrative the team writes for its future self. `git blame`, `git bisect`, and `git log` are debugging tools whose effectiveness is directly proportional to the quality of the commits they traverse. A history of small, well-described, atomic commits lets a future engineer bisect a regression to a fifty-line change in minutes; a history of "WIP", "fix", and thousand-line omnibus commits turns the same investigation into archaeology. Conventional Commit discipline is therefore not bureaucratic ceremony — it is an investment in the debuggability of the system, made one commit at a time, that compounds over the life of the project.

## On Code Review Culture

Code review is the highest-leverage quality practice we have, and its value depends entirely on how it is conducted. Reviewers critique code, never people; authors treat critique as a gift, never an attack. A review comment should be specific, actionable, and where possible accompanied by a suggestion. "This is confusing" is less useful than "this would be clearer with an early return." Authors, for their part, owe reviewers small, focused PRs — review quality degrades superlinearly with diff size, and a two-thousand-line PR receives, in practice, a vibes-based skim followed by an approval. Keeping changes small is the single greatest courtesy an author can extend to a reviewer.
