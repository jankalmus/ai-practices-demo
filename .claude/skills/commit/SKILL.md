---
name: commit
description: Create a git commit in this repo following project conventions. Use whenever committing changes — covers pre-commit checks, branch rules, and commit message format.
---

# Committing

## Before every commit

You are required to run the verify skill before each commit to ensure you are not commiting a broken state.

## Message format

Conventional Commits, matching existing history (`git log --oneline`):

```
<type>: <imperative subject, ≤72 chars, no trailing period>
```

Types in use: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`.

✅ Good examples
```
feat: add month filter to transactions API
fix: round amounts to cents before storing
docs: document the category breakdown feature
```

❌ Incorrect examples
```
Updated stuff
feat: Added a new filter.
```

Add a body (blank line after the subject) only when the *why* isn't obvious from the diff. 

Full spec and more examples: [references/commit-format.md](references/commit-format.md).

## Rules

- One logical change per commit — split unrelated work.
- Never commit secrets, `.env` files, or generated output (`.next/`, `node_modules/`).
- Don't amend or rebase commits that are already pushed to a shared branch.
- If a pre-commit check fails, fix the cause — never bypass with `--no-verify`.
