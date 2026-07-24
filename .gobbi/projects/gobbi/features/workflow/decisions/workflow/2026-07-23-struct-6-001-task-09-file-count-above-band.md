---
name: struct-6-001-task-09-file-count-above-band
description: Task 09 declares 9 files, one above the plan-quality "roughly 5-8 files" band — a defensible, recorded deviation, not a broken check.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [planning, process]
keywords: [task-size-heuristic, task-09, atomic-migration, size-band-deviation]
author: claude
---

# Task 09's 9-file scope exceeds the plan-quality file-count heuristic — a recorded, defensible deviation

## Context

Planning task 09 (`09-migrate-moved-content-consumers`) touches 9 files, extracted programmatically
from the plan's `files:` counts per task: `02=4, 03=1, 09=9, 01=1, 04=3, 05=3, 06=2, 08=1`.
`PLAN-STRUCT-SCENARIO-01-CHECK-01` reads "No task spans more than roughly 5-8 files." 9 files is
literally outside that band, so the checklist box cannot honestly be ticked PASS for task 09. The
iter-6 Claude evaluator (Structure perspective, `F-STRUCT-6-001`, Low/100, confidence 100) found this,
routed as a `general` Type / `process` Domain finding — which the canonical Type+Domain routing table
in `evaluation/SKILL.md` stages as a mistake-candidate for Wrap-up's routing decision.

## What went wrong / Why

Nothing went wrong in the plan's substance — the deviation is stated explicitly in the plan's own
text: "Task 09 is a deliberate multi-file exception: it is one atomic pre-strip migration of a single
inventory, and splitting it would re-introduce the per-file discovery it exists to eliminate." The
evaluator independently checked the alternative (splitting task 09 into 9 per-file tasks) and found it
would still be coherent at each stop point, so atomicity is not STRICTLY required by the
owner-transition model — but the discovery argument holds (splitting would multiply the already-cited
`F-CONS-6-001` inlined-gate-copy risk further), so the deviation is defensible on its own separate
grounds. What is genuinely a process gap: the plan-quality scenario check has a size heuristic with no
stated escape hatch for a deliberate, single-inventory atomic migration — so a defensible exception
still reads as a failed box unless a reader also reads the task's own justification prose.

## How to recognize it

A plan-quality scenario check states a numeric or range heuristic ("roughly N-M files/lines per
task") with no explicit "unless the task states a deliberate-exception rationale" escape clause. A
task then legitimately exceeds the band for a stated, sound reason, and the checklist box has no way
to record "exceeds the heuristic, justified" as distinct from "exceeds the heuristic, unexamined."

## Corrected approach

Record the deviation explicitly against the size heuristic (not only against "one atomic migration")
so a future reader of the checklist box sees the SPECIFIC heuristic that was knowingly exceeded and
why, rather than inferring it from separate prose elsewhere in the document. No plan change is
required for THIS plan (the checklist result already cites the deviation honestly in
`3-planning/evaluation/iter6/claude/structure.md`) — the corrected approach targets how future
plan-quality scenario checks are worded: a size-band check should carry its own stated escape hatch
("... unless the task is a single atomic migration whose split would re-introduce a per-file discovery
problem, stated explicitly in the task narrative") rather than relying on the reader to reconcile a
failed-looking box against separate justification prose.

## Related

- [[proj-6-001-union-diff-obligation-not-gate]] — a sibling Low/Medium finding from the same iter-6
  evaluation carried forward as a documentation/scope-note gap, not a plan defect
