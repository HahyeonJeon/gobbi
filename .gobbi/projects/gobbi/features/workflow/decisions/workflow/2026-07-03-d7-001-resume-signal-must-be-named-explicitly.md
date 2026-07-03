---
name: d7-001-resume-signal-must-be-named-explicitly
description: iter1 finding F-STRUCT-1 — D7-001 must name the concrete fresh-vs-resume signal row 4 branches on
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [f-struct-1, resume-signal, fresh-vs-resume]
author: claude
related: [d7-001-split-fresh-init-resume-rehydration-shipped]
---

# D7-001 must name the concrete fresh-vs-resume signal source

## Context

The iter1 draft's D7-001 recommendation said "make row-4 Ideation stamp fresh-only" and "add a
'Rehydrate state.json' resume row," but never named WHICH signal row 4 should branch on. The Claude
Structure evaluator (finding F-STRUCT-1, Low/50) noted the signal already exists —
`orchestration/SKILL.md:104` row 1's 3-state worktree guard (`worktreePath: null` = fresh) and `:108`
row 5's `previousSessionId` stamp on resume — but the draft never stated that row 4 must consume the
row-1 determination, leaving the mechanism buildable but under-specified for a design hand-off.

## Decision

Name the concrete resume signal explicitly in the design: resume iff `settings.json` exists AND
`session.json.previousSessionId` is non-null AND a valid `state.json` carries a non-`configuration`
Active/Revising step; fresh iff the row-1 3-state guard reports `worktreePath: null` OR there is no
prior `state.json`.

## Rationale

A Planner decomposing the D7-001 direction into FIX tasks needs a concrete signal to implement
against, not just "a signal exists somewhere." Naming it explicitly removes the risk that a Planner
either invents an inconsistent signal or re-derives one that diverges from what Step 1 already
computes.

## Alternatives considered

- **Leave the signal implicit** — rejected; this is exactly the specificity gap F-STRUCT-1 flagged,
  and the fix costs nothing (the signal already exists in the codebase).

## Consequences

The iter2 evaluator verified every element of the named signal against the real fields
(`orchestration/SKILL.md:108` `previousSessionId`, `:104` the 3-state guard) — both real, both
consumed correctly by the refined design.

## Related

- [[d7-001-split-fresh-init-resume-rehydration]] — the design this decision anchors
