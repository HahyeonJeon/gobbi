# Evaluation

## Intent

Gobbi Evaluation is critique-first and two-file. A cold evaluator freezes one target, criticizes it
without a checklist, then prepares and runs an evaluation-owned working checklist, reconciles, and
writes `report.md` plus working `checklist.md`. Callers consume only the contract-gate verdict.

The canonical [Evaluation](../../../skills/evaluation/SKILL.md) skill owns the SOP. This file records
current intent for Memory readers. Do not copy the live Procedure here.

## Procedure shape

Four phases with two freeze points: bind, critique, prepare-freeze-run-reconcile, then report.

Named Evaluation baselines are the Code Review, Documentation, Ideation, and Planning checklists. The
Code baseline is `skills/code-review/checklist.md`, [Code Review's checklist](../../../skills/code-review/checklist.md),
owned by Code Review.
Wrap-up is not a named Evaluation baseline. A Checklist consumer may use the Code baseline without invoking
the Code Review operation. Evaluation reads coverage accounts. It does not own coverage and does not add
items to fill an account row. A reused source with no account is a Limit; the working pass still runs.
When `evaluation-depth` is bound, Phase 2 prompts and Phase 3 gather stay inside that token.

## Dual record

- One `VERDICT:` line from in-contract Problems, sufficient evidence, and caller-supplied criteria.
- Quality opinion uses `meets-design`, `mixed`, `does-not-meet`, or `not-available` and never changes the gate.
- Out-of-contract Problems escalate. After completed `P1 · User Review` they do not reopen design.
- Evaluation records its own unaided same-subject critique before reading a same-subject Code Review report.
  Prepared evidence is independently verified. It is not a checklist source and cannot substitute for
  Evaluation's finding or verdict authority.
- A runtime directory that holds only one of `report.md` and `checklist.md` is incomplete evidence and never PASS input.
- Do not alias historical names such as `codex.md`. Runtime tokens are `claude-code`, `codex`, `cursor`, and `grok`.

## Evaluation depth

Bind any caller-supplied `evaluation-depth` in Phase 1. Phase 2 prompts and Phase 3 gather stay inside
that token. Workflow and Cowork require the field in evaluator briefs. A missing-field stop-or-report
protocol is not specified.

| Token | In-contract bar |
|---|---|
| `ideation-design` | Goal, decisions, boundaries, constraints, work strategy, indexed integrity, required discussion and user decisions. Not implementation completeness or document polish. |
| `planning-decomposition` | Hierarchy coverage, grouping coherence, dependency-valid order, assignment contract. Not implementation recipes. |
| `execution-implementation` | Implementation, applicable Code Review and Execution documentation checklists, task verification. |
| `by-owning-stage` | Mixed subject: each artifact uses its owning stage's token. Cowork whole-branch `evaluate` uses this. |

A current indexed Ideation or Planning result at `ideation-design` or `planning-decomposition` uses its
own checklist, not the Execution documentation checklist. Mixed work under `by-owning-stage` applies each
matching baseline to the artifact class it owns. Implementation recipes belong to Execution.

## Paths and writers

Workflow:

```text
<record-directory>/evaluation/iteration-N/
  gate.md
  <runtime>/
    report.md
    checklist.md
```

`<record-directory>` is `1-ideation/`, `2-planning/`, `3-execution/task-NN-slug/`, or `wrap-up/`.
Receipt stays `<record-directory>/record/iteration-N.md`. The manager writes `gate.md`. The
evaluator does not.

Cowork has no `gate.md` and no Workflow iteration tree. One unique caller-named directory below
`tmp/` is the aggregation parent, with the same per-runtime children.

Remaining-runtime evaluator briefs name write set `runtime-directory` and `writing-path` as the
absolute `report.md`. Missing write set still means `writing-path-only` and cannot complete the
assignment. Wrapper capture stays outside the session and is not the evaluation tree.

## Ownership

| Concern | Owner |
|---|---|
| Critique, working copy, dual record | [Evaluation](../../../skills/evaluation/SKILL.md) |
| Reusable sources and coverage accounts | [Checklist](../../../skills/checklist/SKILL.md) |
| Code baseline and caller-bound Code Review report | [Code Review](../../../skills/code-review/SKILL.md) and [Code Review design](code-review.md) |
| Write surface `runtime-directory` | [Partner](../../../skills/gobbi/partner/SKILL.md) and [Partner design](../feature/partner.md) |
| Workflow path bind, RECORD, `gate.md` | [Workflow](../../../skills/workflow/SKILL.md) |
| Cowork one-parent layout and aggregation | [Cowork](../../../skills/cowork/SKILL.md) and [Cowork implementation commits](cowork.md) |
| Evaluator craft row | [Delegation](../../../skills/delegation/SKILL.md) |
| Role load maps | [Identity-and-load role contracts](identity-and-load-role-contracts.md) |

Cursor as active runtime writes both files. Cursor as Partner stays Unavailable. A Write or Edit
denial is `BLOCKED` with the denial. The manager does not scribe evaluation files.

## Current limits

Coverage Accounts exist on the Checklist operation source and the Code Review baseline. Documentation,
Ideation, Planning, Wrap-up, and domain-family checklists have no accounts yet. See [Evaluation backlog](../../backlogs/evaluation.md).
