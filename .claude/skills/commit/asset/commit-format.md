# Commit message format — full spec

Based on [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), trimmed to what this project uses.

## Structure

```
<type>[optional scope]: <subject>

[optional body]

[optional footer(s)]
```

## Types

| Type | Use for |
| --- | --- |
| `feat` | New user-facing or API behavior |
| `fix` | Bug fixes (behavior was wrong, now right) |
| `docs` | Documentation only (README, docs/, comments) |
| `test` | Adding or fixing tests, no production code change |
| `refactor` | Code change that neither fixes a bug nor adds behavior |
| `chore` | Tooling, dependencies, harness config (.claude/, etc.) |
| `ci` | CI workflow changes (.github/workflows/) |

## Scope (optional)

A noun in parentheses narrowing the area: `feat(api): …`, `fix(store): …`. Existing history mostly omits scope — use it only when it adds clarity. Sensible scopes here: `api`, `store`, `ui`, `agreements`, `skills`, `hooks`, `mcp`.

## Subject rules

- Imperative mood: "add", "fix", "remove" — not "added", "fixes", "removing".
- ≤72 characters, lowercase after the colon, no trailing period.
- Must describe the change completely enough to be useful in `git log --oneline`.

## Body rules

- Separate from subject with one blank line; wrap at ~72 chars.
- Explain **why** the change was made and any non-obvious consequences — the diff already shows *what*.
- Bullet points are fine.

## Footers

- `BREAKING CHANGE: <description>` when behavior/API contracts change incompatibly.
- Issue references where applicable: `Closes #12`.

## Worked examples

```
feat(api): support month filter on GET /api/transactions

The dashboard needs per-month views without fetching everything.
Filter validates against YYYY-MM via listFiltersSchema and reuses
string-prefix matching on the ISO date column.
```

```
fix(store): keep deletion stable when ids collide after reseed

Closes #42
```

Bad examples and why:

- `update code` — no type, says nothing.
- `feat: fixed the bug where deleting failed` — type/content mismatch (that's a `fix`), past tense.
- `chore: misc changes` — multiple unrelated changes belong in separate commits.
