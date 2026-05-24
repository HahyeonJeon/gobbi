---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
feature: session-foundations-bundle-b
finding-id: CL-RISK-PREP3-001
type: assumption_risk
domain: process
disposition: open
confidence: 25
severity: Low
supersedes: null
superseded_by: null
---

# Deferred CI backlog pseudocode uses wrong git command for old-mode detection

## Context

The `ci-symlink-integrity-check.md` backlog file includes pseudocode for a pre-commit hook. The pseudocode uses `git ls-files -s` for both old_mode and staged_mode checks. However, `git ls-files -s` returns the staged (index) mode, not the HEAD/last-commit mode — so comparing staged to itself would never detect the `120000 → 100644` transition. Correct implementation should use `git diff --cached --raw` or `git ls-tree HEAD <path>` (for old mode) vs `git ls-files --stage` (for staged mode).

## Decision

Accepted as non-blocking. The backlog is deferred (zero current witnesses; Principle 10 applies). The pseudocode is labeled "Pseudocode — exact diff plumbing depends on the chosen pre-commit framework." Future pick-up of this backlog must fix the plumbing before implementing.

## Rationale

Confidence 25 — this is speculative (the backlog is deferred and no implementation exists). The acknowledgment in the backlog file is sufficient for a deferred item. Does not affect iter3 deliverable.

## Consequences

When the CI backlog is picked up, the implementer must correct the pseudocode to use `git diff --cached --raw` (or equivalent) for old-mode detection rather than `git ls-files -s` twice.

## Related

- `preparation/staging/backlogs/project/ci-symlink-integrity-check.md`
- `preparation/evaluation/iter3/claude/risk.md` (CL-RISK-PREP3-001)
