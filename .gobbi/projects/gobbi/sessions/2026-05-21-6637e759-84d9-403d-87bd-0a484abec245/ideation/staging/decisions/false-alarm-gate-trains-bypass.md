---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-R3-01
Type: design_flaw
Domain: process
Disposition: addressed
Confidence: 100
Severity: High
supersedes: null
superseded_by: null
---

# D11 Verify Step Is a False-Alarm Generator That Trains the Operator to Bypass the Gate (Meta-Risk)

## Context

iter3 Claude evaluator (Risk perspective) found that the Stage G verify step (D11/D2 #20-21/Success #14) would fire NEEDS_CONTEXT on every happy-path merge in this repo. This is not just a false alarm — it's a meta-risk: a verification gate that structurally cannot pass in the happy path trains the operator to develop a habit of waiving the gate. Once the habit is established, the gate stops protecting against the real force-push attack it was designed to detect. iter3's remedy for F-CX-OV-02 (body-grep verify) was thus *worse* than no check at all: it forced manager rationalization on every merge, which is precisely the `executor-rationalized-failing-verification-gate.md` failure mode elevated one level.

## Decision

Addressed by iter4. The body-grep verify is removed. Stage G uses `gh pr merge --match-head-commit "$HEAD_SHA"` — a server-side atomic guard that passes on the happy path and fails only on genuine head-mismatch. Exit 0 = pass cleanly; exit non-zero = real problem, NEEDS_CONTEXT. The meta-risk is resolved: the gate now passes on the happy path.

## Rationale

The `executor-rationalized-failing-verification-gate.md` mistake establishes that a gate which routinely fails without real cause trains bypassing behavior. The iter3 gate violated this principle at the manager level. The iter4 fix restores the gate's integrity: it is non-rationalizable because it only fires on actual head-mismatch.

## Consequences

Stage G's verification is now structurally sound. The false-alarm meta-risk is eliminated. The operator will encounter NEEDS_CONTEXT only on genuine force-push or concurrent-modification events.

## Related

- `ideation/staging/decisions/merge-head-stability.md` (F-CX-OV-02, the parent finding)
- `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md`
- iter3 `evaluation/iter3/claude/risk.md` § F-R3-01
