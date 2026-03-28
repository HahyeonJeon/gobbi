# Plan: Claude Docs Review

## Goal

Produce a structured findings report reviewing gobbi's 53 .claude/ docs for internal consistency against gobbi-claude standards and comparison with GSD (v1 + v2).

## Subtasks (14 agents, 4 waves)

### Wave 1 (8 parallel)

| # | Task | Agent | Files |
|---|------|-------|-------|
| 1A | Skills — Core/Workflow | Explore | 8 SKILL.md: gobbi, orchestration, discuss, ideation, plan, delegation, execution, collection |
| 1B | Skills — Eval/Utility/Special | Explore | 7 SKILL.md: evaluation, 3 stage-evals, notification (335L exception), hack (empty), note |
| 1C | Claude Docs + Gotcha | Explore | gobbi-claude SKILL.md + 4 children + gobbi-gotcha + 13 gotcha files |
| 1D | Agent Definitions | Explore | 5 agents: pi, 3 evaluators, planner (empty) |
| 1E | Design + Root Docs | Explore | 9 design docs + CLAUDE.md + GOBBI.md + README |
| 2A | GSD — State & Context | gobbi-pi | Compare session continuity, context budget, state persistence |
| 2B | GSD — Agent Architecture | gobbi-pi | Compare specialization, dispatch, tool permissions |
| 2C | GSD — Quality Gates | gobbi-pi | Compare verification, plan checking, regression testing |

### Wave 2 (2 parallel — overflow from Wave 1 ceiling)

| # | Task | Agent | Files |
|---|------|-------|-------|
| 2D | GSD — Workflow Automation | gobbi-pi | Compare auto-advance, recovery, stuck detection |
| 2E | GSD — Doc & Planning | gobbi-pi | Compare doc organization, templates, decomposition |

### Wave 3 (1 — depends on waves 1+2)

| # | Task | Agent |
|---|------|-------|
| 3A | Report Synthesis | general-purpose |

### Wave 4 (3 parallel — depends on wave 3)

| # | Task | Agent |
|---|------|-------|
| 4A/B/C | Evaluate Report | 3 evaluator stances |

## Evaluation Feedback (plan evaluation round)

- **Positive: PASS** — file-level precision, wave structure, scope coverage sound
- **Moderate: REVISE** → Fixed: added explicit file lists, verification criteria, GSD source URLs, skill loading, subtask naming
- **Critical: REVISE** → Fixed: added audit checklist, empty file classification, AskUserQuestion suppression for parallel gobbi-pi, merge rules for synthesis, scope boundaries

## User Decision

Approved after one revision round.
