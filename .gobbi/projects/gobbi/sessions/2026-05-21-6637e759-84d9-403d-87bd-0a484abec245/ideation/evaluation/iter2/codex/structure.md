# Ideation iter2 — Structure perspective (codex)

## Stage 0 Artifact Summary

The artifact is a destructive repo-reset Ideation draft whose structural load-bearing design is the ordered Stage 0/A-G workflow: pre-reset tag, sweep branch, tracked/untracked deletes, placeholder reset, gitignore edits, session-dir tracking, terminal bare-UUID deletion, worktree/branch cleanup, PR squash merge, and post-merge verification. Its success depends less on abstractions than on crisp commit boundaries and executable sequencing.

## Stage 1 Locked Frame

- Scenario S1: Stage decomposition is acyclic and executable.
  - Checklist: each stage has one owner; every stage's output is the next stage's input; no stage depends on information produced later.
- Scenario S2: Commit boundaries are structurally coherent.
  - Checklist: "committed before" and "same commit" are not both required; FS-only deletes are not described as committed artifacts; session tracking happens after ignore rules permit it.
- Scenario S3 (adversarial): A verification gate requires impossible self-reference.
  - Checklist: if a commit SHA must be in `session.json`, the draft states whether it is the previous commit, a later reconciliation commit, or an external state write; no commit is required to contain its own SHA.
- Scenario S4: Cleanup commands preserve intended empty containers.
  - Checklist: `worktrees/` parent survives via `-mindepth 1`; branch deletion follows worktree removal.

## Inherited Iter1 Findings

- F-S-01 (Stage D/E commit boundary ambiguity): superseded, not fully addressed. Iter2 splits E.1/E.2, but introduces a sharper contradiction around the commit that contains the session dir and the SHA written into `session.json`.
- F-S-02 (`worktrees/` parent deletion): addressed. Stage F uses `find ... -mindepth 1 -type d -empty -delete` at line 303.
- F-S-03 (commit-vs-FS labels): addressed for most stages by explicit FS-only language at lines 245, 251, 281, 290, and 296.

## Stage 2 Findings

### F-CX-S-01 — Stage E.2's SHA gate is structurally self-referential

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: High
- **Evidence**: Stage E.2 requires the "sweep-branch commit containing the gitignore edits + the staged session dir" to exist and that "that commit's SHA has been written into ... session.json" at lines 292-294. D9 repeats the same two conditions at lines 416-422. But if `session.json` is part of the staged session dir in that same commit, the commit cannot contain its own final SHA; changing `session.json` changes the commit SHA. Lines 277-288 also oscillate between "same commit as Stage D" and "follow-on bisect-safe commit," which leaves no stable commit identity for the gate.
- **Why-it-matters**: This is the load-bearing safety gate before deleting the CLI's live bare-UUID session dir. A literal executor cannot satisfy it without either recording the wrong SHA, creating an uncommitted filesystem-only divergence, or looping through amend-after-amend. High/100 triggers REVISE.

### F-CX-S-02 — Stage D "committed before E.1" conflicts with E.1 "same commit as Stage D"

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Stage D line 273 instructs committing the gitignore edits and says E.2 depends on that SHA. Stage E.1 line 277 then says the session sweep is "same commit as Stage D's commit, or a follow-on bisect-safe commit." The critical invariant at lines 320-322 says Stage D is committed before Stage E.1's `git add`.
- **Why-it-matters**: The sequencing can be made sound, but the draft needs one canonical structure: either edit gitignore then add session dir before one commit, or commit gitignore first then use a follow-on session-dir commit. The current wording preserves the iter1 ambiguity in a narrower form.

## Per-perspective Verdict

REVISE. F-CX-S-01 is High/100, meeting the High>=50 threshold.

## Must-Preserve

- Preserve the E.1/E.2 split as a concept; only the SHA semantics need repair.
- Preserve Stage D before session `git add`.
- Preserve `-mindepth 1` for worktree empty-dir cleanup.
