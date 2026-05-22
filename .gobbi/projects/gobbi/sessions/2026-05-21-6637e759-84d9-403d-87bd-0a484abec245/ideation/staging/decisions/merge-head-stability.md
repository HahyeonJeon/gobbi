---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-CX-OV-02
Type: assumption_risk
Domain: process
Disposition: addressed
Confidence: 50
Severity: Medium
supersedes: null
superseded_by: null
---

# Merge-Head Stability Not Checked Before Squash-Merge

## Context

iter2 Codex evaluator (Overall perspective) found that Stage G called `gh pr merge --squash --delete-branch` without first capturing or verifying the PR head SHA immediately before merge. In the solo-user context this is not a threshold driver, but the destructive sweep should prove the squashed commit corresponds to the reviewed branch head.

## Decision

Three iterations were needed to address this correctly:

- **iter3** (Q-Gate-Redesign partial): Added `HEAD_SHA` capture step and a post-merge body-grep verify (D11 Option A/B). This was refuted empirically in iter3 evaluation: this repo's squash-merge commits do NOT contain source-SHA trailers in the body (verified against 5 recent squash-merges: 487fc35, 228fbdc, adae51e, f3769cc, cd9eb86). The verify step would fire NEEDS_CONTEXT on every happy-path merge, training the operator to ignore the gate — exactly the `executor-rationalized-failing-verification-gate.md` failure mode, elevated to meta-risk.

- **iter4** (Q-iter4-Override): Replaces the body-grep verify with `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. The `--match-head-commit` flag is a server-side atomic guard: if the PR head does not match `$HEAD_SHA` at merge transaction time, the server rejects the merge and returns non-zero exit code. There is no race window between verify and merge. The flag is documented in `gh pr merge --help` and backed by the GitHub REST merge endpoint's `sha` parameter.

## Rationale

The atomic guard is superior to any post-merge verification because it eliminates the race window. Post-merge checks can only detect a substitution after it has occurred; the atomic guard prevents it entirely. The iter3 mechanism (body-grep) was not only ineffective on this repo's squash style but actively harmful (false-alarm generator). The iter4 mechanism uses the server-side API contract directly.

## Consequences

Stage G's merge command is `gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"`. Exit 0 is the sole pass criterion. Exit non-zero → NEEDS_CONTEXT (no rationalization per `executor-rationalized-failing-verification-gate.md`). The HEAD_SHA capture step is preserved as an audit log record. D11 contains the full historical narrative of iter3's mechanism and why it was replaced.

## Related

- `ideation/artifacts/implementation-checklist.md` § Stage G
- `ideation/artifacts/design-direction.md` § D11
- iter2 `evaluation/iter2/codex/overall.md` § F-CX-OV-02
- iter4 `evaluation/iter4/claude/overall.md` § F-CX-OV-02 disposition
- iter4 `evaluation/iter4/codex/overall.md` (independently verified `--match-head-commit` via `gh pr merge --help`)
