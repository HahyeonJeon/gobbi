---
name: execution-eval-bundle-frame-checks
description: 7 Codex constructive checklist_gap findings (COD-EXE-*-FRAME-001) proposed artifact-specific additions to skills/execution/checklist.md; consider promoting them to the Execution loop's own evaluation seed.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: [process, evaluation]
keywords: [execution-checklist, frame-coverage, checklist-gap, codex-evaluator]
author: claude
priority: low
project-scope: true
shipped_in: null
related: []
---

# Promote the 7 `COD-EXE-*-FRAME-001` frame-coverage findings into `skills/execution/checklist.md`

## Context

During this session's Execution loop, the Codex evaluator returned 7 Low-severity `checklist_gap`
findings (Type `checklist_gap`, one per perspective: `COD-EXE-PROJ-FRAME-001`,
`COD-EXE-STRUCT-FRAME-001`, `COD-EXE-PERF-FRAME-001`, `COD-EXE-AESTH-FRAME-001`,
`COD-EXE-USAGE-FRAME-001`, `COD-EXE-CONS-FRAME-001`, `COD-EXE-RISK-FRAME-001`) at iter1. Each names a
GAP IN THE EXECUTION LOOP'S OWN GENERIC EVALUATION SEED, not a defect in the `startup` artifact under
review — the pattern is "generic {perspective} checks do not test {artifact-specific property}":
scope-contract-specific checks, semantic-parity-specific checks, threshold-evidence-specific checks,
de-vanity-vocabulary-specific checks, evaluator-consumption-specific checks, the startup two-gate
invariant, and an acceptance-bypass-specific check. At iter2, Codex confirmed all 7 as "addressed as
frame-coverage records" — the artifact-specific checks were inherited and resolved within the
iteration, not left open against the `startup` artifact.

## Why deferred

These findings are tangential to the `startup` skill rewrite this session shipped — they are
constructive additions to the EXECUTION LOOP'S OWN evaluation frame (`skills/execution/checklist.md`,
the generic 7-perspective seed every Execution evaluation starts from), not findings against the
artifact under review. Execution's `resolution-log.md` explicitly surfaced this as an open question
for Wrap-up rather than deciding unilaterally: promoting 7 additional individual staging files for
Low-severity, evaluator-frame-only findings was judged out of proportion for this loop's own RECORD
pass, given they were already fully enumerated with disposition in the resolution log.

## When to pick up

No hard prerequisite — this is a standalone `execution` skill improvement. Natural pickup point: the
next session that revises `skills/execution/checklist.md` for any reason, or a dedicated
execution-eval-bundle-improvement session.

## Suggested approach

Read the full 7 findings from this session's `4-execution/evaluation/iter1/codex/{project,structure,
performance,aesthetics,usage,consistency,risk}.md` (each file's `COD-EXE-*-FRAME-001` section) and
`4-execution/outputs/resolution-log.md` (the disposition table). For each, evaluate whether the
artifact-specific check generalizes into a durable addition to `skills/execution/checklist.md`'s
generic seed (e.g., a standing "does this loop's artifact carry a scope-contract the check can trace
to?" prompt) — some may be too artifact-specific to gobbi's `startup` rewrite to generalize; judge
each independently rather than promoting all 7 uniformly.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-14-97d3ef5a-1b8a-4dab-b884-9f686e185b22/`

## Related

(none — recorded standalone from the Execution resolution-log's open question to Wrap-up)
