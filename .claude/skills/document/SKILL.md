---
name: document
description: Produce business-feature documentation for this project — requirements, restrictions, integrations, and the files that implement the feature — into docs/features/ using the project template, and keep the feature index up to date. Use when asked to document a feature, write feature docs, or describe what a feature does and which files it touches.
user-invocable: true
tools: Read, Grep, Glob, Write, Edit, AskUserQuestion
---

# Documenting a business feature

This skill writes a **feature document** — a plain-language record of one business feature: what it must do, what it deliberately does not do, what it integrates with, and which files implement it. The output is a markdown file in `docs/features/`, rendered from the project template, plus an entry in the feature index.

It documents features as they actually exist in the codebase. It does **not** design or change application code — if the user wants behaviour added or altered, that is a normal dev task, not this skill.

## Always read first

Triage standards through the shared [docs/index.md](../../../docs/index.md). Per that index, these two apply to every documentation task:

- [coding-principles.md](../../../docs/coding-principles.md) — how we write, including DRY and least-astonishment.
- [documentation-standards.md](../../../docs/documentation-standards.md) — comments explain *why*, docs ship with the change they describe, and the **generated-file header** whose `@feature` field is the link this skill relies on.

## Workflow

1. **Read the two always-on docs above.**

2. **Identify the feature and its slug.** Take the feature from the user's request. Derive a kebab-case `slug` (e.g. "Transaction reporting" → `reporting`). If the request is vague about scope, ask **one** clarifying question before proceeding.

3. **Derive the file list.** Find every file that declares this feature:

   - Search `.ts`/`.tsx` files for a header `@feature` line whose CSV contains the slug (use Grep, e.g. pattern `@feature .*\b<slug>\b`).
   - For each match, read the `@description` from its header to fill the *Role* column.
   - If the search returns nothing, say so — the feature may be undocumented in code, or the slug may not match the tags. Confirm the slug with the user rather than writing an empty Files section.

4. **Gather the prose sections.** From the user and from reading the matched files:
   - **Requirements** — concrete, verifiable behaviour the feature must deliver.
   - **Restrictions & constraints** — known limits, unhandled edge cases, bounding business rules.
   - **Integrations** — external systems and internal modules/features it depends on or feeds, with the direction of each dependency.
   Ask the user for anything that can't be established from the code; do not invent requirements.

5. **Render the document** from [assets/format.md](./assets/format.md) into `docs/features/<slug>.md`. Fill every placeholder; set **Last reviewed** to today's date (`YYYY-MM-DD`, per the project's string-date convention). Do not leave template angle-bracket placeholders behind.

6. **Update the index.** Add or update the feature's row in [docs/features/index.md](../../../docs/features/index.md) (create the file from the existing pattern if a row is missing). Keep it alphabetical by slug.

7. **Report** the path written and the file count, and flag any section you could not fully populate so the user can complete it.

## Rules

- **Document reality, not intent.** Every requirement, restriction, and integration must be traceable to the code or to the user — never inferred-and-presented-as-fact.
- **Derive the Files section from `@feature` headers**, never hand-curate it. If a file is missing from the doc, the fix is to add the tag to the file's header (a dev task), not to edit the doc.
- **One feature per document.** If the request spans several features, write one doc each and name the others.
- **This skill writes docs only.** It never edits `app/`, `lib/`, or `components/`. If correcting a `@feature` tag is needed, say so and stop — that is a code change.
- **The template is the single source of layout.** Render from [assets/format.md](./assets/format.md); if the template's sections need to change, change the template, not individual docs.
