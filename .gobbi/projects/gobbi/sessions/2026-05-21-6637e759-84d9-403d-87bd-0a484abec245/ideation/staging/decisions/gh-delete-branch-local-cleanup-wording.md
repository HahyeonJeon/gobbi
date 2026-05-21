---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-CX-O4-01
Type: assumption_risk
Domain: process
Disposition: deferred
Confidence: 75
Severity: Medium
supersedes: null
superseded_by: null
---

# `--delete-branch` Local Cleanup Wording Mismatch (Deferred to Planning/Execution)

## Context

iter4 Codex evaluator (Overall perspective) found that the artifact states `--delete-branch` handles "remote only" at `draft-iter4.md:360`, with similar assumptions at lines 64 and 78. However, local `gh pr merge --help` says `--delete-branch` deletes BOTH the local and remote branch after merge. The artifact then also includes an explicit `git branch -d <sweep-branch>` step after the merge — which may fail with "error: branch already deleted" if `--delete-branch` already removed the local branch.

## Decision

DEFERRED to Planning/Execution. This is a non-blocking cleanup concern: the explicit local delete step may fail if the branch is already gone, creating a false alarm after a successful merge. It does not weaken head-match protection (the `--match-head-commit` guard fires before the delete). Planning/Execution should normalize the cleanup command to the actual local `gh` behavior:
- Option A: Remove the explicit `git branch -d` step, relying on `--delete-branch` to handle both local and remote.
- Option B: Keep the explicit `git branch -d` step but prefix with `git branch --list <sweep-branch> | grep -q .` to check existence first.

## Rationale

Below the High/50 REVISE threshold (Medium/75). Does not affect the sweep's correctness or the head-match gate. The worst outcome is a benign "branch not found" error on the cleanup step after a successful merge.

## Consequences

Planning should resolve which option normalizes the `--delete-branch` + `git branch -d` interaction. The current artifact may produce a non-fatal error in M-2.

## Related

- `ideation/artifacts/implementation-checklist.md` § Stage G / M-2
- iter4 `evaluation/iter4/codex/overall.md` § F-CX-O4-01
