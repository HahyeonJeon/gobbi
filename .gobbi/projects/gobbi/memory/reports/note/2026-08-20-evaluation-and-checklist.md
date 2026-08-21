# Evaluation and Checklist improvement

## Result

Accepted on `feat/improve-eval` at `7b0c37c5a17b39a19805423cffba740abc282129`, tree
`def39d219975fde3a73d07826c3fe5caf4245d11`, six commits from `6e9d1cdfb4e9f612499ae161fdc6ab7e07b61d97`.

Evaluation now criticizes a frozen target before any checklist, then writes `report.md` and working
`checklist.md` under one per-runtime directory. Checklist owns coverage accounts. Partner write set
`runtime-directory` accepts the sibling pair and fails a third file. Workflow RECORD and Cowork
aggregation copy only the contract-gate verdict.

Session history: [Critique-first two-file Evaluation and Checklist coverage](../../history/2026-08-20-evaluation-and-checklist.md).
Current design: [Evaluation](../../design/process/evaluation.md),
[Partner](../../design/feature/partner.md),
[Cowork implementation commits](../../design/process/cowork.md).

## What shipped

| Commit | Owner | Change |
|---|---|---|
| `e162f876` | Checklist | Coverage account, `supported`, template and `checklist/checklist.md` account blocks |
| `88d4b4c6` | Evaluation | Four-phase SOP, report fields, working-checklist template |
| `2e575304` | Partner | Write set `runtime-directory` |
| `fef9ad82` | Roles and Delegation | Both files, dual-record `VERDICT:`, Cursor evaluator writes |
| `e5f91e54` | Workflow and Cowork | Per-runtime layout, contract-gate consumption, one Cowork `tmp/` parent |
| `7b0c37c5` | Projections | Claude nested working-checklist symlink, Cursor evaluator copy, plugin `--check` 0 |

Whole-branch evaluation used the Grok complete pair. Decision PASS. Claude Code Partner hit
`timeout 1200` WRAPPER_EXIT 124 with only `claude-code/checklist.md` present. That incomplete pair
was not PASS input. No extraction, repair, or retry.

## Limits

- Two Low in-contract wording defects remain: Evaluation Rule 2 versus required working-checklist
  template load, and Checklist References still sequencing Evaluation as prepare-then-evaluate.
  They did not unmet the gate. Deferred: [Evaluation backlog](../../backlogs/evaluation.md).
- Cursor live Write/Edit after removing `readonly: true` was not measured. Cursor Partner stays
  Unavailable.
- Named baselines and domain-family checklists have no coverage accounts. Wrap-up is not a named
  Evaluation baseline. Execution does not yet read accounts at Step 4.1.
- Merge, push, and worktree cleanup are Wrap-up Git actions and are not claimed here.
