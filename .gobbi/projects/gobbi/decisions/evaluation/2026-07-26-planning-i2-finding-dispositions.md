---
name: planning-i2-finding-dispositions
description: Record the user-approved Planning iteration 2 finding-disposition batch.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [planning, evaluation]
keywords: [react-pr-369, planning-iteration-2, finding-dispositions]
author: codex
supersedes: null
superseded_by: null
---

# Preserve the Planning iteration 2 REVISE findings for repair

## Context

At source cursor `Planning / RECORD / iteration 2 / task null`, the router records `lastVerdict: REVISE`. The evaluated subject is `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/working/iteration-2/synthesis.md` at SHA-256 `e94b1d5f0b92d10189c87d0c380d87a9f543bb1014f1f1d986792a1c0628cebd`. The source report is `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/evaluation/iteration-2/codex.md` at SHA-256 `186c40a34bdcf4888e91a977a1d6c3d2fe6cfda4b957f5101e716f290bb16c42`.

The report is one independently validated Codex report with `pairComplete: false`; its three findings retain the exact provenance below. The user authorized this complete disposition batch for session `bae334bf-c3df-4155-bbd0-92d5a36f3feb`.

## Decision

| Finding | Provenance | Disposition | Reason | Consequence |
|---|---|---|---|---|
| `CODEX-PROJECT-001` | `codex//root/react_pr369_planning_i2_evaluator/CODEX-PROJECT-001` | `open` | Task 02 does not require or mechanically validate the locked ten-category Scenario coverage register in every scenario child. | Planning iteration 3 must add the per-child ten-category requirement and count/semantic checks, then trace the repair through the handoff and downstream consumers. |
| `CODEX-STRUCTURE-001` | `codex//root/react_pr369_planning_i2_evaluator/CODEX-STRUCTURE-001` | `open` | Task 03 requires Checklist `CR-1` through `CR-15`, but the canonical Checklist owner ends at `CR-7`. | Planning iteration 3 must correct the owner input to `CR-1` through `CR-7` and re-resolve affected rule ranges across the seven reopened tasks. |
| `CODEX-OVERALL-001` | `codex//root/react_pr369_planning_i2_evaluator/CODEX-OVERALL-001` | `deferred` | Claude Planning iteration 2 evidence is absent under the previously authorized named waiver, so cross-system agreement remains unevaluable. | Preserve the limitation without backfilling frozen iteration 2 history; any later Claude evidence belongs only to a new valid iteration. |

## Rationale

These dispositions match the frozen report, preserve its evidence-derived `REVISE` result, and route the two material defects to a fresh Planning iteration without inventing missing-system evidence.

## Alternatives considered

- Editing the iteration 2 synthesis was rejected because frozen WORK and EVALUATION artifacts are immutable.
- Dismissing either High-confidence open finding was rejected because it would contradict the approved report.
- Backfilling a Claude iteration 2 artifact was rejected because it would falsify provenance and history.

## Consequences

Planning iteration 2 produces no canonical plan output. Planning iteration 3 must perform a fresh repair and evaluation under its separately recorded waiver. This decision grants no source-edit, Execution, publication, merge, or cleanup authority.

## Related

- User-approved dispositions: `CODEX-PROJECT-001: open`, `CODEX-STRUCTURE-001: open`, `CODEX-OVERALL-001: deferred`.
- Machine source: `/tmp/pr369-planning-i2-evaluation-codex.json` at SHA-256 `15dd6917a488b456d0936f918cb05e79785748ad5133ca9847b588ea7b21e06b`.
- Open-decision source: `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/working/iteration-2/open-decisions.md`.
- Immutable Ideation source: `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/1-ideation/outputs/ideation.md` at SHA-256 `444c3f826ddbe1d2c4f5bfa526105e3f5067cfac378abc4f4a63abe294eb8df0`.
