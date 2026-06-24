---
name: slug-shape-mismatch-decisions-discussions-changelogs
description: rules.md §1.2 classes decisions/discussions/changelogs as date-prefixed, but memory-map feature rows + wrap-up routing treat them as bare-slug. Reconcile across the 3 docs.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-16
session: 8129f657-4591-48b3-b83c-3aa9bc759ca6
tags: [memory, docs-sync]
keywords: [slug-shape, consistency, temporal-split, decisions, discussions, changelogs]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Slug-shape mismatch: decisions / discussions / changelogs

## Context

`memory/rules.md` §1.2 (the temporal-split table) lists **decisions, discussions,
changelogs** under **Date-prefixed** (`YYYY-MM-DD-{slug}.md`). But two other docs
treat them as bare-slug:

- `memory/memory-map.md` feature path-index rows show these types as bare-slug
  `{slug}.md`.
- `wrap-up/SKILL.md` Outputs summary groups them under the bare-slug bullet, and the
  routing rows promote them bare.

So the authoritative slug shape for these three types disagrees across rules.md ↔
memory-map ↔ wrap-up.

## Why deferred

Surfaced by the Task 02 iter2 dual-system evaluation (Claude F-S1 / Codex F-004),
both classifying it **pre-existing** (git blame: pre-dates Task 02, lands at
`4a3d08a9` or earlier) and **out-of-scope** for Task 02 (those types were not among
the 4 feature-scoped types in scope). It is a silent divergence — no broken link, no
token residue catches it — but harmless until someone authors one of these types and
must pick a shape.

## When to pick up

No hard prerequisites. A dedicated consistency pass: decide the correct slug shape
per type (are decisions/discussions/changelogs genuinely date-indexed or evergreen?)
then reconcile rules.md §1.2 ↔ memory-map (type + feature tables) ↔ wrap-up (routing
rows + Outputs summary) so all three agree. Likely a small focused task once the
intended shape is decided.

## Suggested approach

Pick the intended shape first (most likely: changelogs/discussions are date-indexed,
decisions are evergreen — but that is the decision to make), then sweep the three
docs to one consistent statement and add a one-line cross-reference so future drift
is caught.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-14-8129f657-4591-48b3-b83c-3aa9bc759ca6/`
