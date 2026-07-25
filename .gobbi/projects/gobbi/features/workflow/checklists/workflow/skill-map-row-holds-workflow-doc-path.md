---
name: skill-map-row-holds-workflow-doc-path
description: gobbi/SKILL.md's skill-map "Skill" column holds a workflow-doc path for the Planning Loop row, not a bare skill name like its siblings; spec-authorized and mitigated, deferred to task 08.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync]
keywords: [skill-map, workflow-doc-path, planning-loop-row, task-09-migration, task-08-deferred]
author: claude
scenario: migrate-moved-content-consumers
item_status: deferred
anchor: novel
implemented_in: null
---

# Check that a future SOP-finalize task considers a cross-cutting row for the generic `planning` SOP

## What

In `gobbi/SKILL.md`, under the table "### Loop skills (one per workflow step's loop body)" with column
header "Skill", the Planning row's value is now a workflow-doc path
(`orchestration/workflow/planning.md`) rather than a bare skill name like its siblings (`ideation`,
`preparation`, `execution`, `wrap-up`). The task-09 evaluator (single-system Claude; Codex user-waived)
flagged this as a minor heading/content nuance — a reader scanning the "Skill" column meets one
non-skill path.

## Why

This is spec-authorized: task C9 explicitly calls for "skill-map Planning Loop row -> the WF doc (loop
ownership)". The migration also added a clarifying sentence explaining the generic `planning` SOP's
role, so the row is not misleading in context — but a future reader might still expect the generic
`planning` SOP to also appear as a cross-cutting-skills row, since it remains a real skill a leader can
load for craft.

**Manager disposition: ACCEPTED, deferred to task 08's consideration.** Task 08 (the SOP-finalize task)
is the correct place to decide whether to add a cross-cutting-skills row for the generic `planning` SOP
so both the loop-owner and the SOP are discoverable. Adding a row now, inside task 09, would be scope
creep — task 09's contract is exactly the 9 consumer repoints, not a skill-map structural change.

## Verification

Not required for task 09 (this finding is Low severity, confidence 50, and did not affect the PASS
verdict on any perspective). When task 08 runs, it should re-read this finding and decide: add a
cross-cutting-skills row for `planning`, or explicitly note the loop-owner/SOP split is sufficiently
disambiguated by the migration's added sentence.

## Status notes

`item_status: deferred` here means "the manager reviewed and intentionally declined to remediate inside
task 09," with an explicit forward pointer to task 08 — not "scheduled with no owner." The rationale is
recorded above and in `evaluation/iter1/claude/aesthetics.md` (AE-1) and
`evaluation/iter1/claude/checklist.md` (Aesthetics section).

## Related

- `evaluation/iter1/claude/aesthetics.md` — the evaluator's full AE-1 finding text
- [[task-09-single-system-evaluation-codex-waived]] — staged discussion, the evaluation-mode note for
  this same iteration
