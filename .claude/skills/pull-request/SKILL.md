---
name: pull-request
description: Generate a pull request title and description for the current branch following project conventions. Must not be run on the main branch.
user-invocable: true
tools: Bash, AskUserQuestion
---

## Steps

### 1 — Guard: protected branch check

```bash
git branch --show-current
```

If the current branch is `main`, stop immediately:
> "This skill cannot be run on a protected branch."

### 2 — Extract task number

Parse the task number from the branch name using the convention `feature/DEMO-{number}`.

If no task number can be extracted - find a one word description for the features that have been developed and replace the `DEMO-{number}` entirely in the pull request output format. 

### 3 — Get full diff against main

```bash
git log main...HEAD --oneline
git diff main...HEAD --stat
git diff main...HEAD
```

Use the log for commit context and the diff to identify which files changed and what the primary changes are.

### 4 — Generate title and description

Refer to the format of the pull request in [format.md](./references/format.md)

#### Rules:
- Bullet points cover the most significant, distinct changes only — no filler
- Omit file references on bullet points that span many files or are cross-cutting
- Bullet points describe *what* changed, not *how*
- Do not exceed 6 bullet points even if there are more changes

### 5 — Confirm before creating (unless authorized for the session)

**Skip this step when PR creation is already authorized for the session** — i.e. the development-loop finalize step is running after an approved plan or the user's up-front *yes* (see "The development loop" in [CLAUDE.md](../../../CLAUDE.md)). In that case proceed directly to creation.

Otherwise — e.g. a user invoked `/pull-request` directly with no standing authorization — show the proposed title and description, then use the **AskUserQuestion** tool to confirm before pushing and opening the PR. Ask a single question — e.g. "Ready to push `{branch}` and create this PR against `main`?" — with these options:

- **Yes, create it** → continue to step 6.
- **Edit first** → incorporate the user's changes, then ask again with AskUserQuestion.
- **Cancel** → stop without pushing or creating anything.

(The user can also pick "Other" to give free-form direction — treat that as edit instructions.)

### 6 — Create the pull request

First, ensure the branch is pushed to the remote:

```bash
git push -u origin HEAD
```

Then create the pull request with the GitHub CLI, targeting `main`. Pass the description via a temporary file (or a here-doc) to preserve formatting:

```bash
gh pr create --base main --title "DEMO-{number} - {description}" --body-file <body-file>
```

If a PR already exists for this branch, update it instead:

```bash
gh pr edit --title "DEMO-{number} - {description}" --body-file <body-file>
```

On success, print the PR URL returned by `gh` so the user can open it directly.

If the `gh` CLI is not installed or not authenticated, fall back to printing the title and description so the user can create the PR manually:

```
## Title
DEMO-{number} - {description}

## Description
{full description block}
```


