---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-S-02
Type: design_flaw
Domain: process
Disposition: addressed
Confidence: 75
Severity: Low
supersedes: null
superseded_by: null
---

# `worktrees/` Cleanup Find Without `-mindepth 1` Would Delete the Dir Itself

## Context

iter1 Claude evaluator (Structure perspective) found that `find .gobbi/projects/gobbi/worktrees/ -type d -empty -delete` (without `-mindepth 1`) would delete the `worktrees/` directory itself once it's empty, breaking Success Criterion #3.

## Decision

iter2 L-1 adds `-mindepth 1` to the `worktrees/` cleanup command: `find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete`. The parent `worktrees/` dir is preserved.

## Rationale

The Success Criteria require `worktrees/` to remain in the tree (Q-A survivor set). Deleting it during cleanup would create a false verification failure at Success Criterion #3.

## Consequences

Stage F's `worktrees/` cleanup is now safe. S14 (edge scenario) explicitly covers this case.

## Related

- `ideation/artifacts/scenarios.md` (S14)
- iter1 `evaluation/iter1/claude/structure.md` § F-S-02
