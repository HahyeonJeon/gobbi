# Evaluation

## Intent

The Generic Evaluation skill and `skills/evaluation/` are removed without an alias. Cowork still has a
user-called `evaluate` phase. This process design is stale until Evaluation is redesigned. Do not treat a
domain Review skill as a replacement Evaluation skill.

Coverage Accounts are not required on domain child checklists. The Checklist skill template still owns the
account.

This file records remaining Cowork `evaluate` facts and former Evaluation-skill limits for Memory readers.
Do not copy a live SOP here.

## Procedure shape

The former Evaluation skill SOP is gone. Critique-first two-file procedure, named Evaluation baselines
(Coding Review, Documentation, Ideation, and Planning checklists), and Coverage Account gather rules were
owned by that skill. They are not current procedure.

A reused source with no Coverage Account is not a domain-child defect. Child-skill checklists omit the
account by decision.

## Dual record

These two-file and verdict facts still describe Cowork `evaluate` as of this session. They are not a
redesigned Evaluation skill.

- One `VERDICT:` line from in-contract Problems, sufficient evidence, and caller-supplied criteria.
- Quality opinion uses `meets-design`, `mixed`, `does-not-meet`, or `not-available` and never changes the gate.
- Out-of-contract Problems escalate. After completed `P1 · User Review` they do not reopen design.
- A runtime directory that holds only one of `report.md` and `checklist.md` is incomplete evidence and never PASS input.
- Do not alias historical names such as `codex.md`. Runtime tokens are `claude-code`, `codex`, `cursor`, and `grok`.

Former Evaluation-skill rules about unaided critique before a same-subject Coding Review report, and about
Evaluation owning finding and verdict authority, are stale until Evaluation is redesigned.

## Evaluation depth

These tokens still describe Cowork `evaluate`. Bind any caller-supplied `evaluation-depth` in the evaluate
call. Workflow and Cowork require the field in evaluator briefs. A missing-field stop-or-report protocol is
not specified.

| Token | In-contract bar |
|---|---|
| `ideation-design` | Goal, decisions, boundaries, constraints, work strategy, indexed integrity, required discussion and user decisions. Not implementation completeness or document polish. |
| `planning-decomposition` | Hierarchy coverage, grouping coherence, dependency-valid order, assignment contract. Not implementation recipes. |
| `execution-implementation` | Implementation, applicable Coding Review baseline and Execution documentation checklist, task verification. |
| `by-owning-stage` | Mixed subject: each artifact uses its owning stage's token. Cowork whole-branch `evaluate` uses this. |

A current indexed Ideation or Planning result at `ideation-design` or `planning-decomposition` uses its
own checklist, not the Execution documentation checklist. Mixed work under `by-owning-stage` applies each
matching baseline to the artifact class it owns. Implementation recipes belong to Execution.

Former Generic Evaluation code-routing rules are stale. There is no Generic Evaluation skill to load the
Coding Review checklist as an Evaluation-owned working copy. Domain Review remains non-gating. Do not
invent a replacement evaluation skill.

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
| Former Evaluation SOP | Removed. `skills/evaluation/` is gone. Stale until Evaluation is redesigned. |
| Reusable sources and Coverage Account template | [Checklist](../../../skills/checklist/SKILL.md) |
| Domain child checklists | Matching domain Review skill. No Coverage Account required. |
| Code baseline and caller-bound Coding Review report | [Coding Review](../../../skills/coding/coding-review/SKILL.md) and [Coding skill family](../feature/coding-skill-family.md) |
| Write surface `runtime-directory` | [Partner](../../../skills/gobbi/partner/SKILL.md) and [Partner design](../feature/partner.md) |
| Workflow path bind, RECORD, `gate.md` | [Workflow](../../../skills/workflow/SKILL.md) |
| Cowork `evaluate` call, one-parent layout, and aggregation | [Cowork](../../../skills/cowork/SKILL.md) and [Cowork implementation commits](cowork.md) |
| Evaluator craft row | [Delegation](../../../skills/delegation/SKILL.md) |
| Role load maps | [Identity-and-load role contracts](identity-and-load-role-contracts.md) |

Cursor as active runtime writes both files. Cursor as Partner stays Unavailable. A Write or Edit
denial is `BLOCKED` with the denial. The manager does not scribe evaluation files.

## Current limits

Generic Evaluation and `skills/evaluation/` are removed. Coverage Accounts are not required on domain
child checklists. The Checklist skill template still has a Coverage Account. The evaluator load map in
[Identity-and-load role contracts](identity-and-load-role-contracts.md) is stale until Evaluation is
redesigned. Callers that still load `skills/evaluation/` will fail. See remaining items in
[Evaluation backlog](../../backlogs/evaluation.md).
