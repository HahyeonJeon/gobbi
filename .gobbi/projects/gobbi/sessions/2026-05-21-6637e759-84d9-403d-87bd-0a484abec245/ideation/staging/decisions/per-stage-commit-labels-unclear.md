---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-C-03
Type: design_flaw
Domain: docs-sync
Disposition: addressed
Confidence: 100
Severity: Low
supersedes: null
superseded_by: null
---

# Per-Stage `worktrees/` Description Contradicts Success Criterion #3

## Context

iter1 Claude evaluator (Consistency perspective) found that the Scope Contract described `worktrees/` as "becomes empty after worktree removal" while Success Criterion #3 expected `worktrees/` (empty) to survive post-sweep. The cross-perspective issue was that F-S-02 (Structure perspective) showed the `find -empty -delete` command without `-mindepth 1` would delete the `worktrees/` directory itself, creating a false verification failure.

## Decision

This finding is the Consistency cross-perspective framing of the same issue fixed by F-S-02: iter2 L-1 adds `-mindepth 1` to the `worktrees/` cleanup command. The design says preserve; the command now preserves it. Consistency is restored.

## Related

- `ideation/staging/decisions/worktrees-find-without-mindepth.md` (F-S-02, the structural fix)
- `ideation/artifacts/scope-contract.md` § KEEP CONTENT description + Success Criteria #3
- iter1 `evaluation/iter1/claude/consistency.md` § F-C-03
