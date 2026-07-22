---
name: README
description: Historical child-doc split plus the current single-report-per-system evaluation package and owner boundaries.
type: features
scope: feature
feature: evaluation-childdoc-split
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: []
keywords: [scenario-md, checklist-md, class-predicate, completeness-gate, three-way-split]
author: claude
value_proposition: Step-specific evaluation references stay focused while one Evaluation owner defines the complete fresh dual-system report and validator.
subsystems: [skills/ideation, skills/planning, skills/execution, skills/wrap-up, skills/evaluation, skills/evaluation/scripts/validate-evaluation-report.sh]
---

# Evaluation Child-Doc Split

## Overview

The productive-step skills may keep focused `evaluation.md`, `scenarios.md`, and `checklists.md` references for their own obligations. Those child docs are inputs to the Evaluation owner, not separate runtime report files and not another evaluation procedure.

## Current contract (2026-07-20)

- Ideation, Planning, Execution, and Wrap-up all use `DISCUSSION -> WORK -> EVALUATION -> RECORD`. Planning owns its readiness entry gate; there is no standalone Preparation step.
- Each EVALUATION dispatches fresh independent Claude and Codex evaluators. Each returns one schema-valid report at `evaluation/iteration-{n}/{system}.md`.
- Each system report contains Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, Overall, eight finding ledgers, a completed checklist, and verdicts derived pessimistically from the findings.
- The Evaluation-owned validator rejects missing or duplicate perspectives, contradictory section/report verdicts, bad provenance, dangling checklist findings, and stale identity. Pair validation aggregates the two systems with `FAIL > REVISE > PASS` while preserving provenance.
- The evaluator package is no longer a nine-file perspective bundle. The former `check-eval-childdocs.sh` gate is retired; `skills/evaluation/scripts/validate-evaluation-report.sh` is the Evaluation command in the ten-command set.
- `state.json` version 3 routes the evaluation stage and iteration. `session.json` version 5 records only final durable outcomes and exact approved waivers, not evaluation telemetry or history.
- Findings are presented once to the user for disposition. Material revision creates a full new dual-system WORK and fresh dual-system EVALUATION iteration.

## Historical status

The dated session account below describes the earlier child-doc and nine-file implementation. It is not the current runtime artifact shape.

**Former v0.5.3 contract:** the guard and bundle inventory covered four productive loops. Preparation-specific paths in the session account describe the still earlier implementation.

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

## Current open work

- Finish the ownership review proving step child docs point to Evaluation rather than restating its report mechanics.
- Run the evaluation validator's single-report and pair fixtures plus the complete fresh dual-system Execution review.

## Historical backlog references

The entries below are preserved from the former child-doc gate and are not current work instructions.

- `backlogs/evaluation/illustrative-d5-omissions.md` — confirm the guard's actual first-run classification against 3 known smoke-test surfaces
- `.gobbi/projects/gobbi/backlogs/process/coding-skill-evaluation-childdoc-split.md` — project-level follow-up: apply this split to the `coding` skill

## Related

- [[completeness-model-is-a-build-time-gate]] — the mistake this feature's core completeness-gate fix generalizes
- [[guard-revises-twice-means-scope-model-wrong]] — the project-level pattern this feature's Ideation loop independently re-confirmed
