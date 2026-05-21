# Ideation iter3 — Structure perspective (codex)

## Stage 0 Artifact Summary

The artifact's structural backbone is the ordered Stage 0/A-G workflow: archival tag, sweep branch, tracked and untracked deletions, placeholder reset, gitignore edits, session-dir tracking, terminal bare-UUID deletion, worktree and branch cleanup, PR squash merge, and verification. Iter3's central structural change is replacing the impossible "commit contains its own SHA in session.json" gate with two branch/tree preconditions.

## Stage 1 Locked Frame

- Scenario S1: Stage decomposition is acyclic and executable.
  - Checklist: each stage depends only on earlier state; no stage requires a future commit's identity inside its own tree.
- Scenario S2: Stage D and E.1 can land either together or separately.
  - Checklist: Stage E.2 waits until the kept session dir is in the branch tree, not merely until gitignore was committed.
- Scenario S3 (adversarial): Another self-referential invariant appears elsewhere.
  - Checklist: CLAUDE.md deletion is content-pattern based; worktree deletion precedes branch deletion; PR merge checks do not require a squash commit to prove its own ancestry through user-controlled text.
- Scenario S4: Empty containers survive cleanup.
  - Checklist: `worktrees/` parent survives via `-mindepth 1`; placeholder dirs get README stubs after tracked/untracked wipes.

## Stage 2 Findings

### F-CX-S-03 — Stage G uses post-hoc message grep where an atomic head-match gate exists

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence with line numbers**: Stage G captures `HEAD_SHA` at `draft-iter3.md:343-345`, then merges without passing the captured SHA to `gh pr merge` at `draft-iter3.md:346`. Verification instead greps the resulting squash commit body at `draft-iter3.md:347-350` and `draft-iter3.md:486-488`. The local `gh pr merge --help` output exposes `--match-head-commit SHA` as the built-in merge-time guard, and the repo's own convention says the squashed commit body is the PR body's `## Summary` section at `.gobbi/projects/gobbi/skills/git/conventions.md:207-211`.
- **Why-it-matters**: Structurally, the correct invariant is "merge only if the current PR head still equals the reviewed head." A post-merge body grep is not the same invariant and is weaker than the available atomic merge precondition. This does not revive the iter2 High self-reference, but F-CX-OV-02 is not fully closed.

## Stage 2 Step 3 — Iter2 Inherited Finding Disposition

- F-CX-S-01: addressed. The self-referential `session.json` SHA condition is removed; E.2 now checks a non-empty branch tip and a committed-tree entry at `draft-iter3.md:318-324` and restates that the SHA is never written into `session.json` at `draft-iter3.md:470`.
- F-CX-S-02: addressed. The separate-commit case is now coherent because E.1 may be a follow-on commit at `draft-iter3.md:303-314`, and E.2's `git ls-tree <sweep-branch> <kept-session-dir>/` fails until the kept session dir is actually in the committed branch tree.
- F-CX-OV-02: open at Medium via F-CX-S-03. The head-SHA capture exists, but the merge command does not use `--match-head-commit`.

## Per-perspective Verdict

PASS. The remaining structural finding is Medium, below the High>=50 REVISE threshold.

## Must-Preserve

- Preserve the E.1/E.2 split and the two deterministic E.2 preconditions.
- Preserve NEEDS_CONTEXT on either E.2 precondition failure.
- Preserve Stage D before session `git add`.
- Preserve `find .../worktrees/ -mindepth 1 -type d -empty -delete`.
