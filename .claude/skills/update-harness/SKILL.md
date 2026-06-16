---
name: update-harness
description: Diagnose a problem the user hit with the harness itself (a doc, skill, hook, or permission) and propose a concrete fix to the harness. User-invoked only.
argument-hint: <describe the problem you ran into with the harness>
disable-model-invocation: true
allowed-tools: Read, AskUserQuestion, Agent
---

# Updating the project harness

The harness is the set of files that shape how the agent works in this repo:

- **Standards** — `docs/*.md` (indexed by [CLAUDE.md](../../../CLAUDE.md))
- **Skills** — `.claude/skills/*/SKILL.md` and their `references/`
- **Hooks** — `.claude/hooks/*` (wired in `.claude/settings.json` under `hooks`)
- **Permissions / config** — `.claude/settings.json` (`permissions.allow` / `permissions.deny`, env)

This skill is for when **the harness itself got in the way** — a standard was missing or ambiguous, a skill gave bad or incomplete guidance, a hook blocked something it shouldn't have (or failed to block something it should), or a permission was too tight or too loose. The goal is to turn that friction into a durable improvement, not to patch around it once.

> This skill edits the **harness**, never application code. If the fix the user wants is in `app/`, `lib/`, or `components/`, stop and say so — that's a normal change, not a harness change.

## Input

The text the user passed after the command is the **problem statement** — what they were trying to do and how the harness misbehaved. If it's empty or too vague to act on (e.g. "the skills are broken"), ask one focused clarifying question before investigating: what were they doing, what did they expect, what happened instead.

## Workflow

### 1. Triage — which part of the harness is implicated?

Map the problem to one or two areas before reading anything. Use the symptom, not a guess:

| Symptom in the problem statement | Investigate |
| --- | --- |
| "It didn't follow / there's no rule about X", a standard was wrong or contradictory | `docs/*.md` + the index in `CLAUDE.md` |
| A skill ran but skipped a step, gave wrong guidance, or the skill you needed doesn't exist | `.claude/skills/*/SKILL.md` + its `references/` |
| A command was blocked unexpectedly, or something dangerous was *not* blocked | `.claude/hooks/*` + the `hooks` block in `.claude/settings.json` |
| "It kept asking permission for X" / "it was allowed to do Y it shouldn't" | `permissions.allow` / `permissions.deny` in `.claude/settings.json` |

### 2. Investigate

Read **only** the files in the implicated area(s) — the same on-demand discipline the rest of the harness uses. Read them in full; a diagnosis from a snippet is a guess. For a hook, read the script *and* its matcher wiring in settings. For a skill, read `SKILL.md` and any `references/` the problem touches.

> **Grounding harness mechanics.** When the implicated area is a *skill, hook, tool, or permission* (not just a `docs/*.md` standard), don't diagnose the mechanism from the repo alone — its observed behavior may be a misunderstanding of how the construct works, not a defect in this repo's use of it. Delegate to the `claude-code-guide` agent to confirm the authoritative contract (hook event names & matcher syntax, `SKILL.md` frontmatter fields, `settings.json` permission rules, tool semantics) before settling on a root cause. This scopes itself out for pure `docs/*.md` standards work.

### 3. Diagnose

State the root cause in one or two sentences, grounded in a specific file and line. Distinguish honestly between:

- **A genuine harness defect** — a missing rule, a wrong instruction, an over-broad hook, a bad permission. → propose a fix.
- **Working as intended** — the harness did the right thing and the friction was warranted (e.g. a hook correctly blocked a destructive command). → say so plainly and explain why; don't weaken a guardrail just because it fired once.

If it's the second case, stop here and report — don't manufacture a change.

### 4. Propose solutions (with the changes highlighted)

Offer **one to three** options. For each, show:

- **What** changes — the exact file(s).
- **The change itself**, highlighted as a before → after or a diff-style block so the edit is unambiguous. Don't describe a change in prose when you can show it.
- **The trade-off** — what it costs or risks (e.g. "a broader allow rule means fewer prompts but also less oversight").

Prefer the smallest change that durably fixes the root cause. A doc clarification often beats a new hook; tightening an existing rule often beats adding a parallel one. Note when a change touches a guardrail (a `deny` rule, a blocking hook) — those deserve extra scrutiny.

### 5. Ask before implementing

Use the **AskUserQuestion** tool to ask whether to implement, with the proposed options as choices (and, when there are several, let the user pick which one). Never edit a harness file before the user has chosen — this skill diagnoses and proposes by default; it only changes files on an explicit go-ahead.

### 6. Implement (only if the user says yes)

- Apply the chosen change to the harness file(s).
- If you changed a **hook script** or a **permission**, test it: trigger the condition (e.g. run the command the hook guards) and confirm the new behavior, since these aren't covered by `pnpm test`.
- If you changed or added a **skill**, re-read it to confirm links resolve and frontmatter is valid.
- If you changed a **doc**, check whether `CLAUDE.md`'s index entry still describes it accurately and update the index in the same change.
- Summarize what changed and why, so the improvement is traceable.

## Rules

- Diagnose before proposing; propose before editing. No silent fixes.
- One root cause at a time — if the statement describes several problems, address the clearest and name the others.
- Keep guardrails strong. Don't loosen a `deny` rule or remove a blocking hook to make a one-off annoyance go away; weigh the next person who hits the guardrail for real.
- Stay inside the harness. Application-code changes are out of scope — redirect to the normal dev flow.
