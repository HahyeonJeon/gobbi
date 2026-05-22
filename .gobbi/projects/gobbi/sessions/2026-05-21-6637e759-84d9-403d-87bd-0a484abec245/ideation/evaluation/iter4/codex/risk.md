# Ideation iter4 — Risk perspective (codex)

## Stage 0 Artifact Summary

This is a destructive cleanup plan whose risk controls are the pre-reset tag, worktree-before-branch ordering, tracked/untracked command separation, survivor symlink validation, non-circular E.2 gate, and the iter4 merge-head atomic guard. Risk review focuses on whether the new guard fails before merge on a moved PR head and whether failure handling avoids rationalization.

Memory reads: `draft-iter4.md`, iter3 codex `risk.md`, iter3 claude `risk` findings via `overall.md`, `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md`, local `gh pr merge --help`, GitHub CLI manual, and GitHub REST merge docs.

## Locked Frame (Stage 1)

- Scenario R1: Wrong-head destructive merge is blocked before it lands.
  - Checklist: merge command includes `--match-head-commit "$HEAD_SHA"`; mismatch produces non-zero/409; no post-merge inference.
- Scenario R2: Non-zero guarded merge cannot be rationalized.
  - Checklist: executor returns NEEDS_CONTEXT on any non-zero; exact stderr and current head are reported.
- Scenario R3: Existing destructive-operation safeguards survive.
  - Checklist: pre-reset tag exists before deletions; E.2 waits for durable branch state; worktrees removed before branch deletion.
- Scenario R4 (adversarial): Guard failure is too narrowly interpreted.
  - Checklist: artifact names head moved, malformed SHA, auth loss, and API error as possible non-zero causes; manager receives enough evidence to distinguish them.
- Scenario R5 (adversarial): Post-merge cleanup false alarm happens after the irreversible merge.
  - Checklist: local branch deletion expectations match `gh --delete-branch` behavior.

## Stage 2 Findings

### F-CX-R4-01 — Post-merge local branch cleanup can false-alarm if `gh --delete-branch` already deleted it

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence with line numbers**: Local `gh pr merge --help` documents `--delete-branch` as deleting "the local and remote branch after merge". Iter4 says `gh pr merge --delete-branch` handles remote only at `draft-iter4.md:360`, then runs `git branch -d <sweep-branch>`. The same remote-only assumption appears at `draft-iter4.md:64` and `draft-iter4.md:78`.
- **Why-it-matters**: A redundant local `git branch -d` can fail after the irreversible part already succeeded. That is a post-merge cleanup false alarm, not a head-integrity failure. It should not be confused with the guarded merge's non-zero semantics. This is pre-existing from M-2 and not introduced by `--match-head-commit`.

## Stage 2 Step 3 — Disposition Of Every Iter3 Inherited Finding

- F-CX-R-04: addressed, Confidence 100, Severity Medium. Merge-head race is now prevented at merge time by `draft-iter4.md:356-359`.
- F-CX-R-01: addressed, Confidence 100, Severity High. E.2 remains satisfiable and deterministic at `draft-iter4.md:328-334`.
- F-CX-R-02: open/deferred, Confidence 75, Severity Medium. Failed `git worktree remove` recovery remains mostly implied; S4 handles dirty worktrees at `draft-iter4.md:246`, and ordering is correct at `draft-iter4.md:340-346`.
- F-CX-R-03 / F-CX-OV-02: addressed, Confidence 100, Severity Medium. Capture plus atomic enforcement replaces post-hoc detection.
- Iter1 risk findings: F-R-01 remains addressed; F-R-02 remains user-accepted/disputed-addressed; F-R-04 remains deferred/low.
- Claude F-R3-01: addressed, Confidence 100, Severity High. The false-alarm body-grep gate is removed; the live non-zero gate is now the merge command itself at `draft-iter4.md:413`.

## Per-perspective Verdict

PASS. F-CX-R4-01 and the inherited F-CX-R-02 are Medium, below the High>=50 REVISE threshold.

## Must-Preserve

- Preserve pre-reset tag and remote push before destructive work.
- Preserve `-d` vs `-D` split for the four named branches.
- Preserve worktree removal before branch deletion.
- Preserve guarded merge non-zero as NEEDS_CONTEXT with no retry and no rationalization.

