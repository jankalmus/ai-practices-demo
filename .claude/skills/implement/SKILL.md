---
name: implement
description: Drives a feature plan through the full development cycle — implement, verify, code-review, document, commit, and open a pull request — using the implementor agent. Requires a plan file in docs/plans/. Use when asked to implement a feature end-to-end.
user-invocable: true
tools: Glob, Read, Bash, AskUserQuestion, Agent
---

# Implement a feature

Entry point for the full development cycle. This skill locates the plan, confirms it with the user if needed, then hands off to the `implementor` agent which drives the rest of the cycle.

## Step 1 — Find the plan

Glob `docs/plans/*.md` to list available plan files.

**If plan files exist:**
- If the user provided a plan name as an argument, locate `docs/plans/<name>.md`. If not found, report the error and list the available plans.
- If exactly one plan exists and no argument was given, auto-select it and tell the user which plan was picked.
- If multiple plans exist and no argument was given, use **AskUserQuestion** to ask the user which plan to use.

**If `docs/plans/` is empty or does not exist:**
- Use **AskUserQuestion** to confirm with the user:
  - **"Yes, use my prompt"** → treat the user's original message as the plan description and continue.
  - **"No, cancel"** → stop and tell the user to add a `.md` plan file to `docs/plans/` before running `/implement`.

## Step 2 — Read the plan

Read the selected plan file in full. This content is the input to the implementor agent.

## Step 3 — Get current branch

```bash
git branch --show-current
```

## Step 4 — Invoke the implementor agent

Invoke the Agent tool with:
- `subagent_type: implementor`
- A prompt that includes the full plan content and the current branch name.

Format the prompt as:
> "Implement the following feature plan on branch `<branch>`. Plan:\n\n<full plan content>"

## Step 5 — Present the summary

When the agent returns, present its full structured summary to the user as-is. Do not filter, condense, or reinterpret the findings.
