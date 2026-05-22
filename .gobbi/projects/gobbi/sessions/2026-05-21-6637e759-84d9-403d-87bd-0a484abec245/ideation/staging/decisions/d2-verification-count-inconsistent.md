---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-C3-02
Type: assumption_risk
Domain: process
Disposition: addressed
Confidence: 100
Severity: High
supersedes: null
superseded_by: null
---

# D2 Verification Gates #20-21 Cite `grep -F $HEAD_SHA` Which Does Not Match This Repo's Squash Bodies

## Context

iter3 Claude evaluator (Consistency perspective) found that D2 gates #20 and #21 (the post-merge verify gates) depended on the same false empirical claim as F-C3-01: that `gh pr merge --squash` produces a commit body containing the source SHA. These gates would fail on every happy-path merge in this repo.

## Decision

Addressed by iter4. D2's two post-merge verify gates (#20 and #21) are collapsed into one gate (#20): the atomic-guard exit-code check. The executor verifies `gh pr merge` returned exit code 0. No body-grep. D2 now has 20 gates instead of 21.

## Related

- `ideation/staging/decisions/i11-d11-cite-false-squash-body-shape.md` (F-C3-01, same root)
- `ideation/artifacts/design-direction.md` § D2 (gate #20)
- iter3 `evaluation/iter3/claude/consistency.md` § F-C3-02
