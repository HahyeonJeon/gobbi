---
name: generic-sop-heading-regex-second-literal-copy
description: GENERIC_SOP_HEADING_RE in check-workflow-pointer-drift.sh is a second literal copy of the D1-locked SOP section-heading list; a future heading rename in task 01 would silently drift the guard.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, verification]
keywords: [generic-sop-heading-re, hardcoded-baseline, task-01-handoff, drift-guard]
author: claude
scenario: guard-baseline-second-literal-copy
item_status: pending
anchor: novel
implemented_in: null
---

# Check that task 01's SOP headings stay byte-identical to the guard's forbidden-signature regex

## What

Add a check (or a cross-reference note in task 01's own verification) confirming that when task 01
materializes the generic SOP document, its four H2 section headings (`## Principles`, `## Rules`,
`## Procedure`, `## References`) stay byte-identical to `GENERIC_SOP_HEADING_RE` in
`orchestration/scripts/check-workflow-pointer-drift.sh:121`
(`^## (Principles|Rules|Procedure|References)$`). If task 01 ever renames one of these headings, tooth
(b) of check `#8` silently stops catching a copy of the renamed heading, and no existing gate flags
the drift.

## Why

The task 02 evaluation (Structure perspective, `4-execution/task-02-authorize-narrow-fold/evaluation/iter1/claude/structure.md`)
found that the same four-heading list is hardcoded in TWO places: the guard's regex and task 03's own
`verifies:` gate (`3-planning/working/draft-iter6.md` § Exec 2). This is an accepted, documented
coupling — task 02's own spec calls it a design constant, and task 01 is co-designed to produce exactly
these four headings — so it is not a defect in task 02's authorization. It IS a mild instance of the
project mistake `hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards`: any future
change to the guarded structure (the SOP's own headings) must also edit the guard.

## Verification

When task 01 lands, diff the SOP's actual H2 heading set against `GENERIC_SOP_HEADING_RE`'s four
alternatives; confirm they are identical. If task 01 changes a heading name, update the regex (and
task 03's mirrored copy) in the same change.

## Status notes

Not blocking task 02 — this is a forward-looking awareness note for task 01's own author/evaluator, not
rework for task 02. Confidence 100 (Low severity) per the Structure evaluator; disposition `open`
(unresolved until task 01 lands and is checked against this note).

## Related

- `mistakes/verification/hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards.md` — the
  general project trap this is a mild, accepted instance of
