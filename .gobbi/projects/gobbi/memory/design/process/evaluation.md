# Evaluation

## Intent

Gobbi Evaluation is critique-first and two-file. A cold evaluator freezes one target, criticizes it
without a checklist, then prepares and runs an evaluation-owned working checklist, reconciles, and
writes `report.md` plus working `checklist.md`. Callers consume only the contract-gate verdict.

The canonical [Evaluation](../../../skills/evaluation/SKILL.md) skill owns the SOP. This file records
current intent for Memory readers. Do not copy the live Procedure here.

## Procedure shape

Four phases with two freeze points: bind, critique, prepare-freeze-run-reconcile, then report.

Named Evaluation baselines are the Code, Documentation, Ideation, and Planning checklists. Wrap-up
is not a named Evaluation baseline. Evaluation reads coverage accounts. It does not own coverage and
does not add items to fill an account row. A reused source with no account is a Limit; the working
pass still runs.

## Dual record

- One `VERDICT:` line from in-contract Problems, sufficient evidence, and caller-supplied criteria.
- Quality opinion uses `meets-design`, `mixed`, `does-not-meet`, or `not-available` and never changes the gate.
- Out-of-contract Problems escalate. After completed `P1 · User Review` they do not reopen design.
- A runtime directory that holds only one of `report.md` and `checklist.md` is incomplete evidence and never PASS input.
- Do not alias historical names such as `codex.md`. Runtime tokens are `claude-code`, `codex`, `cursor`, and `grok`.

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
| Write surface `runtime-directory` | [Partner](../../../skills/gobbi/partner/SKILL.md) and [Partner design](../feature/partner.md) |
| Workflow path bind, RECORD, `gate.md` | [Workflow](../../../skills/workflow/SKILL.md) |
| Cowork one-parent layout and aggregation | [Cowork](../../../skills/cowork/SKILL.md) and [Cowork implementation commits](cowork.md) |
| Evaluator craft row | [Delegation](../../../skills/delegation/SKILL.md) |
| Role load maps | [Identity-and-load role contracts](identity-and-load-role-contracts.md) |

Cursor as active runtime writes both files. Cursor as Partner stays Unavailable. A Write or Edit
denial is `BLOCKED` with the denial. The manager does not scribe evaluation files.

## Current limits

Coverage accounts exist on the Checklist operation source. Named baselines and domain-family
checklists have no accounts yet. See [Evaluation backlog](../../backlogs/evaluation.md).
