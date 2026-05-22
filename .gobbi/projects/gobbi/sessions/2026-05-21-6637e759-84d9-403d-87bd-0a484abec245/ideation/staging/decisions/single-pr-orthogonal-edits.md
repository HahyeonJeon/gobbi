---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-OV-02
Type: assumption_risk
Domain: process
Disposition: disputed
Confidence: 50
Severity: Medium
supersedes: null
superseded_by: null
---

# Single-PR Bundles Orthogonal Edits (Disputed by Q3 Lock)

## Context

iter1 Claude evaluator (Overall/Stage 3) raised the Karpathy "orthogonal edits" anti-pattern: the sweep bundles code wipe, project memory wipe, git-ref wipe, multi-system wipe, and gitignore policy changes in one PR. A more decomposed shape would use one PR per axis. The evaluator noted the user explicitly chose single-PR via Q3 (atomic sweep) and marked this as `disputed`.

## Decision

DISPUTED by Q3 user lock. The user confirmed in Q3 (AskUserQuestion round 3) that the entire sweep must land atomically in one PR. The orthogonal-edits pattern signal is acknowledged but overridden by the user's explicit preference for atomic reversibility (one rollback point via the pre-reset tag + one squash commit on develop).

## Rationale

The single-PR approach maximizes atomic reversibility: the entire reset is one commit, reachable via `git revert` or `git reset --hard pre-reset-2026-05-21`. Decomposing into multiple PRs would create intermediate states where some axes are wiped but others are not, complicating rollback.

## Consequences

The single-PR approach is locked for this sweep. Future sweeps of this nature may revisit the per-axis decomposition pattern if rollback complexity is not a concern.

## Related

- `ideation/artifacts/scope-contract.md` § Decisions Locked (Q3)
- iter1 `evaluation/iter1/claude/overall.md` § F-OV-02
