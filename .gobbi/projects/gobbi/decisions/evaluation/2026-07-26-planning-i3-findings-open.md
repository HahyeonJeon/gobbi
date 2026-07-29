---
name: planning-i3-findings-open
description: Record the user-approved open dispositions for both Planning iteration 3 findings.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [planning, evaluation]
keywords: [react-pr-369, planning-iteration-3, finding-dispositions]
author: user
supersedes: null
superseded_by: null
---

# Keep both Planning iteration 3 findings open

## Context

At source cursor `Planning / RECORD / iteration 3 / task null`, the router records `lastVerdict: REVISE`. The evaluated subject is `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/working/iteration-3/synthesis.md` at SHA-256 `9cf66a37dc0733bf32e94f5a836a2dfccaeef2733aed9fd3d877939329ec4311`. The source report is `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/evaluation/iteration-3/codex.md` at SHA-256 `3d01582586e2cfb6ef20f3f0c269a5ead1ad3f4b3d57f5713336b51c907e9f2c`.

The user supplied this exact authority:

> Approve both findings as open; extend Planning maxIterations to 4; Claude absent Planning iteration . We don't have enough token. Please consider move to execution as soon as possible.

This record applies the first clause only. The separate cap decision records the second clause.

## Decision

| Finding | Provenance | Disposition | Consequence |
|---|---|---|---|
| `CODEX-USAGE-001` | `codex//root/react_pr369_planning_i3_evaluator/CODEX-USAGE-001` | `open` | A further valid Planning pass must bind the Task 02/03/04 SR-1 register proof to runnable validator and probe commands, controlled fixtures, validator identity, and reproducible evidence fields. |
| `CODEX-CONSISTENCY-001` | `codex//root/react_pr369_planning_i3_evaluator/CODEX-CONSISTENCY-001` | `open` | A further valid Planning pass must correct the seven-task owner/rule register and task contracts so the workflow-step-only documentation rule is classified by its declared applicability. |

The malformed clause `Claude absent Planning iteration .` contains no iteration number. It is not a valid named waiver, must not be repaired or inferred, and grants no Claude-absence waiver for Planning iteration 4.

## Rationale

The two open dispositions match the frozen Codex report and preserve its evidence-derived `REVISE` result. They route bounded plan defects to another Planning pass without changing locked product scope or inventing missing-system authority.

## Alternatives considered

- Dismissing either High-confidence finding was rejected because it would contradict the approved report.
- Treating an open disposition as permission to bypass the finding was rejected because `open` requires resolution before Planning acceptance.
- Repairing the incomplete waiver wording was rejected because step-and-iteration waivers require exact user authority.

## Consequences

Planning iteration 3 produces no canonical plan output. Both findings remain unresolved inputs to the next authorized Planning pass. This decision grants no source-edit, Execution, publication, merge, cleanup, or Claude-absence authority.

## Related

- Open-decision source: `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/working/iteration-3/open-decisions.md` at SHA-256 `04ded838d09ec6a0cc65ae645bb95e3de0a06ff214c5e7de3ead00422cc545a6`.
- Evaluated synthesis: `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/working/iteration-3/synthesis.md` at SHA-256 `9cf66a37dc0733bf32e94f5a836a2dfccaeef2733aed9fd3d877939329ec4311`.
- Evaluation report: `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/evaluation/iteration-3/codex.md` at SHA-256 `3d01582586e2cfb6ef20f3f0c269a5ead1ad3f4b3d57f5713336b51c907e9f2c`.
