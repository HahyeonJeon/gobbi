---
name: README
description: Splits each workflow loop skill's evaluation.md into evaluation.md + scenario.md + checklist.md, certified complete by a class-predicate build-time gate.
type: features
scope: feature
feature: evaluation-childdoc-split
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: []
keywords: [scenario-md, checklist-md, class-predicate, completeness-gate, three-way-split]
author: claude
value_proposition: A future reader of any loop's evaluation procedure gets three focused docs instead of one conflated file — the procedure, the per-perspective Good/Bad/Adversarial framing, and the per-check pass/fail bookkeeping — with a build-time gate that proves every co-touch surface was repointed, not a hand-list that silently misses one.
subsystems: [skills/ideation, skills/preparation, skills/planning, skills/execution, skills/wrap-up, skills/evaluation, skills/skill-writing, skills/orchestration/scripts]
---

# Evaluation Child-Doc Split

## Overview

Each of the 5 workflow-loop skills (`ideation`, `preparation`, `planning`, `execution`, `wrap-up`) used to carry one `evaluation.md` that conflated the evaluation procedure, the per-perspective scenario framing (what GOOD vs BAD vs ADVERSARIAL looks like), and the per-check pass/fail bookkeeping. This feature splits each into three sibling files — `evaluation.md` (procedure) + `scenario.md` (framing) + `checklist.md` (checks) — and makes checklist coverage a real 9th output file per evaluation run, certified complete by a build-time class-predicate gate (`check-eval-childdocs.sh`) rather than a hand-maintained co-touch list.

## Status

**Session `39f3dfb0-49df-44d4-a6bd-d2e4743b36e3` (2026-07-07 → 2026-07-10):** shipped complete. Ideation (6 iterations, dual-system PASS on iter6) locked the design and 4 user decisions. Planning (2 iterations, dual-system PASS on iter2) produced a 10-task guard-first-then-atomic-flip-last plan. Execution shipped all 10 tasks: task 01 built `check-eval-childdocs.sh` (8 evaluation iterations); tasks 02-04 proved the `execution/` 3-file bundle prototype; task 05 landed the prototype-safe shared docs (`evaluation/SKILL.md`, `skill-writing/SKILL.md`); tasks 06-09 split the remaining 4 loop bundles (ideation, preparation, planning, wrap-up); task 10 landed the atomic parent-contract flip (8→9 file count, Stage-0 hard-require, full Family-9 co-touch set) as a single commit, gated by `--enforce-inclusion`. Every task passed dual-system (Claude + Codex) evaluation. 24 commits total.

No deferred work remains in this feature's own scope — the original session-size cut line (tasks 01-05 this session, 06-10 next) was superseded when Execution continued through task 10 in the same session (see the closed `execution-cut-line-06-to-10` backlog). One follow-up is out of this feature's locked scope and tracked as a project-level backlog: applying the same split to the `coding` skill's still-monolithic `evaluation.md` (`backlogs/process/coding-skill-evaluation-childdoc-split.md`).

## Subdirectories

- `design/` — 1 file: the full split design (D1-D4 + the completeness-model fix + the two-family class predicate)
- `scenarios/` — 1 file: `scenario.md` authoring spec, per-step Good/Bad/Adversarial table, worked examples
- `checklists/` — 1 file: `checklist.md` authoring spec, the Point-2 copy-then-tick contract
- `discussions/` — 1 file: the Ideation Sub-step A/B + D exchanges that locked scope and the 4 design forks
- `references/` — 1 file: the classified co-touch inventory (D5), by sweep-pattern family
- `plans/` — 1 file: the 10-task Planning decomposition, guard-first then atomic-flip-last
- `decisions/` — 3 files: the 4 locked user decisions; the open guard-run-mode risk; the Planning dual-system integration record
- `backlogs/` — 4 files: 3 closed (guard build, guard run-mode goal-state, the cut-line deferral) + 1 open (the guard's first-run smoke-test confirmation)
- `mistakes/` — none yet (this session's mistakes were all classified project-scope; see the project `mistakes/` tier: `verification/`, `refactor/`, `docs-sync/`)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-07-10 | 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3 | Wrap-up promotion: feature directory created; 6 artifacts + 3 decisions + 4 backlogs promoted; 14 mistakes promoted to the project tier (8 verification, 4 docs-sync, 2 refactor); 1 project backlog raised for the `coding` skill follow-up |
| 2026-07-08 → 2026-07-10 | 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3 | Execution: all 10 tasks shipped — guard built (01), execution 3-file bundle prototype (02-04), shared prototype-safe docs (05), the other 4 loop bundles (06-09), atomic parent-contract flip (10) |
| 2026-07-08 | 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3 | Planning: 10-task plan locked (iter2 PASS), dual-system-integrated from a Codex proposal |
| 2026-07-07 | 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3 | Ideation: design + 4 user decisions locked (iter6 PASS) |

## Open items

- `backlogs/evaluation/illustrative-d5-omissions.md` — confirm the guard's actual first-run classification against 3 known smoke-test surfaces
- `.gobbi/projects/gobbi/backlogs/process/coding-skill-evaluation-childdoc-split.md` — project-level follow-up: apply this split to the `coding` skill

## Related

- [[completeness-model-is-a-build-time-gate]] — the mistake this feature's core completeness-gate fix generalizes
- [[guard-revises-twice-means-scope-model-wrong]] — the project-level pattern this feature's Ideation loop independently re-confirmed
