---
name: auto-mode-configuration-row-summary-must-track-split
description: iter1 Codex finding CONS-D7-001-AUTO-CONFIG-SUMMARY-001 — auto-mode.md:64 hardcodes a stale Configuration row enumeration that must become a D7-001 edit target, not verify-only
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [docs-sync]
keywords: [auto-mode, configuration-rows, d7-001, verify-only]
author: codex
scenario: d7-001-split-fresh-init-resume-rehydration
item_status: implemented
anchor: novel
implemented_in: null
---

# `auto-mode.md:64`'s hardcoded Configuration row summary must be a D7-001 edit target

## What

The iter1 draft marked `auto-mode.md:64` "VERIFY-ONLY" on the theory that it defers to
`orchestration/SKILL.md`'s canonical Configuration table. But `:64` does more than defer — it
hardcodes "rows 1-4: Create Worktree -> Resolve Settings -> Init state.json -> Init session.json,"
which is already stale against the current canonical table (row-2 record skeleton, row-5 session
init) and becomes MORE stale once the D7-001 fresh/resume split changes the Configuration model
again.

## Why

Leaving this line verify-only preserves a stale Configuration summary in Auto Mode. An implementer or
future manager reading Auto Mode could miss the resume-rehydration branch or reapply the old row
sequence even after `orchestration/SKILL.md` is fixed — the doc that is supposed to defer instead
actively misleads.

## Verification

`git grep -ni 'rows 1-4' -- .gobbi/projects/gobbi/skills/orchestration/auto-mode.md` → either updated
for the fresh/resume split or the row enumeration is removed entirely so the line becomes a true
pointer to the canonical `orchestration/SKILL.md` table.

## Status notes

**Addressed at iter2**: the draft moved `auto-mode.md:64` from "verify-only" to a mandatory D7-001
EDIT target; the iter2 evaluator verified `:64` still hardcodes the stale row-1-4 enumeration prior to
the fix, confirming the edit target is real and necessary. `chat-mode.md:136` remains verify-only — it
is a pure deferral pointer with no hardcoded row summary of its own (verified separately).

## Related

- [[d7-001-split-fresh-init-resume-rehydration]] — the design this finding shaped
