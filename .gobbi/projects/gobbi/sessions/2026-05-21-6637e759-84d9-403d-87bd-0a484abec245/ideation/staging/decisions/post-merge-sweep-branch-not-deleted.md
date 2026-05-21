---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-C-02
Type: design_flaw
Domain: process
Disposition: addressed
Confidence: 100
Severity: Medium
supersedes: null
superseded_by: null
---

# Post-Merge Sweep Branch Not Deleted, Causing Success Criterion #5 to Fail

## Context

iter1 Claude evaluator (Consistency perspective) found that Success Criterion #5 requires `git branch | grep -vE '^[* ] (main|develop)$'` to return no rows post-merge. However, the artifact had no step explicitly deleting the local sweep branch after the squash-merge. `gh pr merge --squash --delete-branch` deletes the remote branch but not the local one. The sweep's Stage F branch-delete list named four specific branches but not the sweep branch itself.

## Decision

iter2 M-2 adds a Stage G post-merge cleanup step: `git checkout develop && git pull && git branch -d <sweep-branch>`. This is the M-2 local cleanup sequence. Success Criterion #5 now passes because the local sweep branch is explicitly deleted.

## Rationale

GitHub's `--delete-branch` flag on `gh pr merge` removes the remote branch only. The local reference persists until explicitly deleted. Omitting this step causes a false verification failure at Success Criterion #5.

## Consequences

Stage G now includes the local sweep-branch deletion. M-2 in the Implementation Checklist covers: `git checkout develop && git pull && git branch -d <sweep-branch>`.

## Related

- `ideation/artifacts/implementation-checklist.md` § Stage G / M-2
- `ideation/artifacts/scope-contract.md` § Success Criteria #5
- iter1 `evaluation/iter1/claude/consistency.md` § F-C-02
