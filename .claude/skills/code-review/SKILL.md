---
name: code-review
description: Dispatches to the isolated code-reviewer agent — the code-review step of the development loop in CLAUDE.md. Use after a change has been implemented and verified, and whenever the user asks to review a PR, branch, or diff.
user-invocable: true
---

# Code review dispatch

Invoke the Agent tool with `subagent_type: code-reviewer` to run the review in a fresh, isolated context. The reviewer has not seen the implementation work in this session, so it cannot inherit your assumptions.

Pass relevant context in the prompt — the PR number, branch name, or "local changes" — so the reviewer knows what to examine. Example prompt: `"Review local changes on branch feat/foo against project standards."`.

When the agent returns its findings, relay them back to the user as-is. Do not filter, reinterpret, or soften the findings. State plainly whether there are any 🔴 blocking findings, since that determines whether the development loop repeats.
