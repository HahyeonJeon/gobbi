# Ideation iter3 — Risk perspective (codex)

## Stage 0 Artifact Summary

This is a destructive cleanup plan whose risk controls are the pre-reset tag, worktree-before-branch ordering, tracked-vs-untracked command separation, symlink target preservation, non-circular E.2 gate, and post-merge verification. Iter3 removes the main safety blocker from iter2: the live bare-UUID session dir is no longer protected by an impossible self-SHA condition.

## Stage 1 Locked Frame

- Scenario R1: Rollback remains possible after destructive changes.
  - Checklist: pre-reset tag is local and remote before deletion; PR can be abandoned; post-merge can be reverted.
- Scenario R2: Live session state is not deleted before durable state exists.
  - Checklist: E.2 waits for a branch tip and committed kept-session tree entry; failure returns NEEDS_CONTEXT.
- Scenario R3: Worktree and branch cleanup does not corrupt git state.
  - Checklist: `git worktree remove` precedes branch deletion; dirty worktrees stop the executor.
- Scenario R4 (adversarial): PR head changes between review and merge.
  - Checklist: merge command itself rejects a head mismatch; post-merge verification cannot be fooled by editable commit text.
- Scenario R5: Deleted mistakes do not erase the only copy of a safety lesson.
  - Checklist: date-prefix, gate-rationalization, and grep-count lessons are encoded in surviving draft/session artifacts.

## Stage 2 Findings

### F-CX-R-04 — Merge-head race is checked after the risky action, not prevented

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence with line numbers**: Stage G captures the PR head at `draft-iter3.md:343-345`, merges at `draft-iter3.md:346`, and only then checks whether commit body text references `$HEAD_SHA` at `draft-iter3.md:347-350`. `gh pr merge --help` documents `--match-head-commit SHA`, which would make the merge fail if the PR head changed between capture and merge. The draft's fallback to `${HEAD_SHA:0:7}` at `draft-iter3.md:487` further weakens the check to short text matching.
- **Why-it-matters**: For a destructive sweep, the safest race control is fail-before-merge. Post-hoc detection still leaves a wrong squash commit on `develop` and requires a revert. Short/body grep also risks false positives if the old short SHA appears in PR-controlled text.

## Stage 2 Step 3 — Iter2 Inherited Finding Disposition

- F-CX-R-01: addressed. The bare-UUID deletion gate cannot fail closed forever due to self-reference anymore; E.2's two checks are satisfiable and deterministic at `draft-iter3.md:318-324`.
- F-CX-R-02: open/deferred Medium from iter2. Stage F still orders worktree removal before branch deletion at `draft-iter3.md:328-336`, and S4 handles dirty worktrees at `draft-iter3.md:236`, but explicit recovery after a failed `git worktree remove` remains implied.
- F-CX-R-03 / F-CX-OV-02: partially addressed/open Medium. Capture was added; atomic merge-head enforcement was not.
- Iter1 risk findings: F-R-01 remains addressed, F-R-02 remains user-accepted/disputed-addressed, F-R-04 remains deferred/low.

## Per-perspective Verdict

PASS. The remaining risk finding is Medium, below threshold.

## Must-Preserve

- Preserve pre-reset tag and remote push before the sweep PR.
- Preserve `.codex` symlink-target semantics and `.claude/{agents,skills}` survivor validation.
- Preserve `-d` vs `-D` split exactly as user-authorized.
- Preserve E.2 failure as NEEDS_CONTEXT with exact git output.
