---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-C-01
Type: design_flaw
Domain: process
Disposition: addressed
Confidence: 100
Severity: Medium
supersedes: null
superseded_by: null
---

# Success Criterion #2 Internally Contradicts the Multi-Commit Sweep Model

## Context

iter1 Claude evaluator (Consistency perspective) found that Success Criterion #2 states "`git log --oneline -2` shows exactly one new sweep commit (squashed PR) plus the prior `487fc35` SOP commit on `develop`." However, the Implementation Checklist described multiple sweep commits on the sweep branch (sweep commit 1/2/3/4 labels), which an executor might misread as multiple commits landing on develop.

## Decision

iter2 M-1 renames per-stage labels to "sweep-branch commit N (squash-merged into develop as 1 commit)" and clarifies in Stage G that the PR is squash-merged. Success Criterion #2 measures post-merge develop. The distinction between sweep-branch commits and the single squash result on develop is now explicit.

## Rationale

An executor reading "sweep commit 1/2/3/4" labels without context may push 4 separate commits to develop or not understand the squash-merge step. The clarified labels remove that ambiguity.

## Consequences

Implementation Checklist stage labels now include the sweep-branch/squash-merge distinction. Success Criterion #2 is unambiguous: one commit on develop post-merge.

## Related

- `ideation/artifacts/implementation-checklist.md` (stage labels)
- `ideation/artifacts/scope-contract.md` § Success Criteria #2
- iter1 `evaluation/iter1/claude/consistency.md` § F-C-01
