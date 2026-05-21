---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
status: accepted
feature: repo-reset
finding-id: F-CL-S-01
finding-type: design_flaw
domain: process
severity: High
confidence: 75
disposition: addressed
supersedes: null
superseded_by: null
---

# Stage D + Stage E.1 Share a Single Commit (Commit 3); EXACTLY 3 Sweep Commits Total

## Context

iter1 Plan stated "D+E.1 as one commit" by convention but never specified HOW — separate `git commit --amend`, deferred E.1 commit, or same-commit staging. A fresh executor reading the verbatim contract would not know which path to take.

## Decision

Stage D and Stage E.1 are staged together and land in a SINGLE commit (commit 3). The executor stages Stage D's gitignore edits, then stages Stage E.1's `git add` + runs the 52-sibling-dir `rm -rf`, AND THEN runs a single `git commit`. No `git commit --amend`. Total sweep-branch commit count: **EXACTLY 3**.

## Rationale

The dependency between D and E.1 (D's gitignore edits must be staged before E.1's `git add` of the now-trackable session dir) mandates they be in the same commit. Staging D → staging E.1 → single `git commit` is the canonical shape. This eliminates the amend-vs-separate-commit ambiguity entirely.

## Alternatives considered

Two separate commits (D then E.1 via amend). Rejected because `git commit --amend` is explicitly forbidden in the task's Special Discipline.

## Consequences

Task 02 `verifies:` block C asserts `git rev-list --count develop..<sweep-branch>` == 3 (not ≥4). Executor delegation prompt must call out "Stage D edits THEN Stage E.1 add THEN single git commit" explicitly.

## Related

- `planning/rawdata/draft-iter4.md` § D-PLAN-06
- `planning/rawdata/draft-iter4.md` § Stage D + Stage E.1 section
