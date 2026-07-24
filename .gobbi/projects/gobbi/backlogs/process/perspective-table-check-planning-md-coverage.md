---
name: perspective-table-check-planning-md-coverage
description: check-workflow-pointer-drift.sh guard #6 (the 7-perspective-table check) does not run on planning.md because it lacks the no-perspective-table manifest flag — a pre-existing, low-risk coverage boundary, optionally closeable.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, verification]
keywords: [perspective-table-check, no-perspective-table-flag, coverage-boundary, pointer-drift-guard, planning-md]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Optionally close the guard-#6 perspective-table coverage boundary on planning.md

## Context

Task 02's Risk evaluation (finding F-RISK-01) found that `check-workflow-pointer-drift.sh`'s `run_check`
only runs `check_perspective_table` (guard `#6`) under the `no-perspective-table` manifest flag, and
`planning.md` does not carry that flag. So one peer-mechanism restatement vector on `planning.md` — a
copied 7-perspective evaluation table — is not covered by that specific check.

This was staged during the session as a `general`/`process` finding, which the canonical Type+Domain
routing mechanically flags as a mistake-candidate. Its own text (and the evaluator's framing note)
identify it as a **pre-existing coverage-boundary observation**, not a "what-went-wrong" trap, and
recommend Wrap-up route it to a project backlog rather than `mistakes/`. This Wrap-up honored that
recommendation. **(Routing flagged for manager review: staged with `mistake-candidate: true` but routed
here as a backlog on the finding's own recommendation.)**

## Why deferred

The gap predates task 02 (which is additive-only: a `local-procedure` flag + guard check `#8`), so it is
not a regression. A perspective table is also not a realistic drift vector for a planning document (they
appear in evaluation output, not planning docs), so the practical risk is low even though the coverage
gap is real. Closing it was explicitly out of task 02's authorize-only scope (`traces-to: C3`).

## When to pick up

Any session that next edits `check-workflow-pointer-drift.sh`, `pointer-drift-manifest.txt`, or does a
guard-coverage audit. No hard prerequisite. Optional — the risk is low enough that "leave as documented"
is a valid outcome.

## Suggested approach

If desired, add `no-perspective-table` to `planning.md`'s row in `pointer-drift-manifest.txt` so guard
`#6` also runs there, closing this specific coverage gap. Then re-run
`check-workflow-pointer-drift.sh --self-test` (must stay 18/18) and the live guard (exit 0). If not
pursued, record that the low practical risk makes the coverage boundary acceptable.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5/`

## Related

- `4-execution/task-02-authorize-narrow-fold/evaluation/iter1/claude/risk.md` — the F-RISK-01 finding
