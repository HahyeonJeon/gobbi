# Review

## Intent

The independent agent pass is Review. Cowork owns the user-called `review` call. Workflow owns stage
REVIEW on Execution tasks and Wrap-up. Domain Review skills write `report.md` and working `checklist.md`.
The Generic Evaluation skill and `skills/evaluation/` are gone. Do not restore that skill.

Coverage Accounts are not required on domain child checklists. The Checklist skill template still owns the
account.

This file records live Review facts for Memory readers. Do not copy a live SOP here.

## Dual record

- One `VERDICT:` line from in-contract Problems, sufficient evidence, and caller-supplied criteria.
- Quality opinion uses `meets-design`, `mixed`, `does-not-meet`, or `not-available` and never changes the gate.
- Out-of-contract Problems escalate. After completed `P1 · User Review` they do not reopen design.
- A runtime directory that holds only one of `report.md` and `checklist.md` is incomplete evidence and never
  PASS input.
- Do not alias historical names such as `codex.md`. Runtime tokens are `claude-code`, `codex`, `cursor`, and
  `grok`.

## Review depth

Bind any caller-supplied `review-depth` in the review call. Cowork `review` and Workflow units that include
REVIEW require the field in reviewer briefs. Workflow Ideation and Planning skip REVIEW.

| Token | In-contract bar |
|---|---|
| `ideation-design` | Goal, decisions, boundaries, constraints, work strategy, indexed integrity, required discussion and user decisions. Not implementation completeness or document polish. |
| `planning-decomposition` | Hierarchy coverage, grouping coherence, dependency-valid order, assignment contract. Not implementation recipes. |
| `execution-implementation` | Implementation, applicable Coding Review baseline and Execution documentation checklist, task verification. |
| `by-owning-stage` | Mixed subject: each artifact uses its owning stage's token. Cowork whole-branch `review` uses this. |

A current indexed Ideation or Planning result at `ideation-design` or `planning-decomposition` uses its
own checklist, not the Execution documentation checklist. Mixed work under `by-owning-stage` applies each
matching baseline to the artifact class it owns. Implementation recipes belong to Execution.

## Paths and writers

Workflow:

```text
<record-directory>/review/iteration-N/
  gate.md
  <runtime>/
    report.md
    checklist.md
```

`<record-directory>` for this layout is `3-execution/task-NN-slug/` or `wrap-up/`. Ideation and
Planning write a receipt only and do not create this review tree. Receipt stays
`<record-directory>/record/iteration-N.md`. The manager writes `gate.md` when REVIEW ran. The
reviewer does not.

Cowork has no `gate.md` and no Workflow iteration tree. One unique caller-named directory below
`tmp/` is the aggregation parent, with the same per-runtime children.

Remaining-runtime reviewer briefs name write set `runtime-directory` and `writing-path` as the
absolute `report.md`. Missing write set still means `writing-path-only` and cannot complete the
assignment. Wrapper capture stays outside the session and is not the review tree.

## Ownership

| Concern | Owner |
|---|---|
| Former Evaluation SOP | Removed. `skills/evaluation/` is gone. |
| Reusable sources and Coverage Account template | [Checklist](../../../skills/checklist/SKILL.md) |
| Domain child checklists | Matching domain Review skill. No Coverage Account required. |
| Independent review report | [Coding Review](../../../skills/coding/coding-review/SKILL.md), [Authoring Review](../../../skills/authoring/authoring-review/SKILL.md), or [Design Review](../../../skills/design/design-review/SKILL.md) |
| Write surface `runtime-directory` | [Partner](../../../skills/gobbi/partner/SKILL.md) and [Partner design](../feature/partner.md) |
| Workflow path bind, RECORD, `gate.md` | [Workflow](../../../skills/workflow/SKILL.md) |
| Cowork `review` call, one-parent layout, and aggregation | [Cowork](../../../skills/cowork/SKILL.md) and [Cowork implementation commits](cowork.md) |
| Reviewer craft row | [Delegation](../../../skills/delegation/SKILL.md) |
| Role load maps | [Identity-and-load role contracts](identity-and-load-role-contracts.md) |

Cursor as active runtime writes both files. Cursor as Partner stays Unavailable. A Write or Edit
denial is `BLOCKED` with the denial. The manager does not scribe review files.

## History

Generic Evaluation and `skills/evaluation/` were removed. Callers that still load `skills/evaluation/`
will fail. See remaining items in [Evaluation backlog](../../backlogs/evaluation.md).
