# Risk Perspective - Iter2

VERDICT: REVISE

## Artifact Summary + Memory reads

Same artifact and memory register as `project.md`. Risk lens checks irreversible operations, merge gates, and cleanup safeguards.

## Locked Frame (Stage 1)

Scenario: manager-owned merge gate prevents unsafe integration.
- Checklist: CI green is checked before merge.
- Checklist: worktree clean is checked before merge.
- Checklist: PR body completeness is checked before merge.

Scenario: worktree cleanup follows git P5.
- Checklist: cleanup uses `git worktree remove` without `--force`.
- Checklist: worktree prune and empty-parent-dir cleanup run.
- Checklist: before removal, status and merged-into-base state are checked.

Scenario (adversarial): cleanup is mostly right but skips the final P5 guard.
- Checklist: command block is checked for post-merge `git status` or merged-branch verification.

## Per-scenario per-check results

PARTIAL. M2 has the pre-merge gate, non-force removal, prune, and empty-dir cleanup. It does not explicitly perform the P5 post-merge clean-and-merged check immediately before `git worktree remove`.

## Typed findings

### COD-PLAN2-RISK-001

- Type: checklist_gap
- Domain: git
- Disposition: open
- Confidence: 85
- Severity: Medium
- Evidence: `git/SKILL.md:198` requires running `git status` inside the worktree and confirming the branch is merged into base before `git worktree remove`; M2 jumps from post-merge sync to `git worktree remove` at `plan.md:497-499`.
- Finding: Cleanup is non-destructive in form, but it omits the final P5 verification immediately before worktree removal.

## Low-confidence appendix

None.
