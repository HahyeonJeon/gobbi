---
name: execution-cut-line-06-to-10
description: Tasks 06-10 (the 4 remaining loop bundles + the atomic parent flip) of the evaluation-childdoc-split plan, originally deferred to the next session but shipped in this same session
type: backlogs
scope: feature
feature: evaluation-childdoc-split
status: closed
created: 2026-07-08
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [process]
keywords: [wave-2, wave-3, atomic-flip, cut-line, cross-session-hazard]
author: claude
priority: high
project-scope: false
shipped_in: task-10-atomic-flip
---

# Ship tasks 06-10 of the evaluation-childdoc-split plan

## Context

The evaluation-childdoc-split plan (`features/evaluation-childdoc-split/plans/workflow/2026-07-08-evaluation-childdoc-split.md`, this session's Planning output) decomposes into 10 tasks across 4 waves. This session's Execution was originally scoped to tasks 01-05 only (Wave 0 + Wave 1: build the completeness guard, prove the execution-loop 3-file bundle, land the prototype-safe shared docs). Tasks 06-10 — the other 4 loop bundles (ideation, preparation, planning, wrap-up) and the atomic parent-contract flip — were recorded here as out of the original Execution-scope estimate.

## Why deferred

Session-size cut line, recorded in the plan's Decisions log: "Recommended CUT LINE for this Chat session's Execution: tasks 01-05 ... Tasks 06-10 → next session(s)." Repeating the same 3-file-bundle pattern across the remaining 4 loops plus the large atomic flip (task 10 touches ~20 Family-9 co-touch files in one commit) was estimated to exceed a reasonable single-session Execution budget.

## When to pick up

Original prerequisites, as recorded at Planning time: tasks 01-05 shipped and evaluated cleanly in the same session's Execution + Wrap-up; the next session picks up `evaluation-childdoc-split` as its `session.json.feature` and continues from the locked plan.

**Original CRITICAL cross-session hazard (superseded — recorded here for history):** the plan warned that the branch would be INTENTIONALLY incoherent between task 04 and task 10 until the flip landed, and that no real workflow evaluation should run against the worktree in that window. This hazard no longer applies — task 10's `--enforce-inclusion` gate passed within this same session, closing the window before the session ended.

## Suggested approach

Continue Wave 2 in order — task 06 (ideation) → 07 (preparation) → 08 (planning) → 09 (wrap-up), each internally scenario → checklist → trim (the source-before-delete invariant, see `execution-bundle-source-before-trim`), each re-running `check-eval-childdocs.sh --bundle {loop} --pre-flip`. Then Wave 3 — task 10, the single atomic commit landing the parent-contract hard-require + the mechanical 8→9 + every guard-certified Family-9 co-touch file, gated by `--enforce-inclusion` as the sole acceptance check.

## Resolution

Execution continued past the original cut line within this same session: tasks 06-10 all shipped and passed dual-system evaluation (task 06 iter2, task 07 iter2, task 08 iter2, task 09 iter3, task 10 iter2 — Codex `VERDICT: PASS` confirmed in task 10's `evaluation/iter2/codex/last-message.md`). Task 10's atomic flip landed as a single commit per the plan's design. This backlog item is closed as shipped in the same session it was raised, not deferred to a future one.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-07-39f3dfb0-49df-44d4-a6bd-d2e4743b36e3/`

## Related

- [[execution-bundle-source-before-trim]] — the internal ordering invariant each of tasks 06-09 restated
- [[dual-system-plan-integration]] — the plan this backlog entry originally deferred from
- [[atomic-flip-must-propagate-to-cotouch-prose-and-active-mistakes]] — the task-10 finding on what the atomic flip's structural guard did not, by itself, prove
</content>
