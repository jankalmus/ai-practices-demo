# Feature: <Feature Name>

> **Slug:** `<feature-slug>` · **Status:** draft | active | deprecated · **Last reviewed:** <YYYY-MM-DD>

## Summary

One or two sentences: what the feature does for the user and why it exists. Plain language — a new teammate should grasp the point without reading code.

## Requirements

The behaviour the feature must deliver, written as concrete, verifiable statements (not implementation notes).

- …

## Restrictions & constraints

Known limitations, edge cases that are deliberately **not** handled, and business rules that bound the feature.

- …

## Integrations

External systems and internal modules/features this one depends on, or that depend on it. Name the direction of the dependency.

- …

## Files

The implementation files for this feature. This section is the human-readable inverse of the `@feature` headers (see [documentation-standards.md](../../../../docs/documentation-standards.md)) — every file tagged `@feature <feature-slug>` appears here.

| File | Role |
| --- | --- |
| `lib/…` | … |
