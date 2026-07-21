---
name: d3-002-workflow-header-mapping-verification-todo
description: The current four-loop workflow-header mapping has been revalidated after Preparation retirement
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [docs-sync, verification]
keywords: [f-usage-01, checklist_gap, workflow-headers, verification-todo]
author: claude
scenario: d3-002-manager-refs-specialist-phase-loads-column-split
item_status: implemented
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Workflow-header mappings are revalidated for the four-loop workflow (F-USAGE-01)

> **v0.5.3 resolution:** Preparation and its workflow header were retired. The active mapping now
> covers Planning, Execution, Wrap-up, and the cross-loop production header; each resolves to its
> current specialist skill. The historical finding below explains the original TODO.

## What

The D3-002 blast-radius section's READ-for-consistency list still reads (unchanged through iter2): "confirm
the workflow-header specialist→skill mapping matches each doc's own redirect (verified for ideation/
evaluation/record; **check the rest before writing**)." Preparation, planning, execution, wrap-up, and
production workflow-header mappings remain an explicit TODO for the Execution writer rather than a closed,
verified fact in the design record.

## Why

A design-direction artifact's job (Usage lens: the artifact should answer the questions so the consumer need
not) is to confirm the mapping before locking the structural split, not hand the consumer an open
verification step. This is the same underlying gap as `ideation-design-blast-radius-verification-deferred-
to-execution` (Project perspective), scored here from the consumer/Usage angle as a distinct finding per
evaluation's per-perspective procedure.

## Verification

Both Ideation iter1 and iter2 evaluators independently confirmed all five deferred workflow headers
(`workflow/preparation.md:3`, `workflow/planning.md:3`, `workflow/execution.md:3`, `workflow/wrap-up.md:3`,
`workflow/production.md`) match the locked Option-S mapping. The verification itself is bounded and low-risk
— it PASSES — but the TODO wording in the artifact was never updated to reflect that the check already
happened.

## Status notes

Open — the "check the rest before writing" wording is still present in `working/draft-iter2.md` at iter2.
Suggested direction for a future edit: add the completed header-mapping confirmation into the design record
(a one-line "confirmed: all five deferred headers match" replacing the TODO phrasing) so Execution consumes a
verified mapping, not an open question.

## Related

- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design this item verifies

Note: the sibling Project-perspective finding on this same gap (originally staged as
`ideation-design-blast-radius-verification-deferred-to-execution`) was dropped at Wrap-up rather than
promoted — the deferral it named was independently verified sound by both Execution evaluators, so it was
judged not a genuine recurring trap. This checklist item is the sole surviving record of the underlying
gap; no dangling cross-reference is left pointing at the dropped item.
