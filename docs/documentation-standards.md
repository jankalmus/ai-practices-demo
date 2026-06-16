# Documentation Standards

- Code is the primary documentation; comments explain *why*, never *what*. A comment that paraphrases the line below it is noise that will eventually lie.
- Team agreements (these standards) record decisions and their rationale so that future contributors inherit the reasoning, not just the rules.
- README-level documentation covers setup and operation; it is kept runnable — documentation that has drifted from reality is worse than no documentation, because it is trusted.
- When behavior changes, the documentation change ships in the same PR. Documentation debt, like all debt, is cheapest to pay at the moment it is incurred.

## Generated-file headers (AI-authored files)

Every `.ts`/`.tsx` file authored, edited, or read by the AI model must begin with a JSDoc provenance header. Required fields: `@file`, `@model`, `@description`, `@feature`, plus at least one date field. The `PostToolUse` Edit/Write/Read hook validates compliance and injects the exact spec as context when the header is missing — see `.claude/hooks/ts-header-check.mjs`.

Date fields (use the ones that apply):

| Field | When to include |
| --- | --- |
| `@created` | Only when the file is fully AI-generated (first Write of a brand-new file) |
| `@updated` | Add/update every time AI edits the file |
