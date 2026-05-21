---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-U4-01
Type: general
Domain: docs-sync
Disposition: open
Confidence: 25
Severity: Low
supersedes: null
superseded_by: null
---

# iter4 Dropped Codex iter3's Second-Half `mergeCommit.oid == git rev-parse develop` Post-Merge Check

## Context

iter4 Claude evaluator (Usage perspective) noted that Codex iter3 had prescribed both `--match-head-commit` (the atomic guard) AND a post-merge `gh pr view --json mergeCommit -q .mergeCommit.oid` compared against `git rev-parse develop` as belt-and-suspenders. iter4 only adopted the first half. Stage G has no explicit post-merge "local develop is in sync" assertion beyond M-2's `git pull` step.

## Decision

Open Low/25. Below threshold. The atomic guard alone closes F-CX-OV-02 (which is the failure mode Codex cited). The local-sync check would catch a different defect (operator skipping M-2's `git pull`) — orthogonal to the head-match contract. M-2's explicit `git checkout develop && git pull` step is the existing mitigation. Could be added as a Success Criterion in a future iteration; not blocking.

## Related

- `ideation/staging/decisions/merge-head-stability.md` (F-CX-OV-02)
- `ideation/artifacts/implementation-checklist.md` § Stage G / M-2
- iter4 `evaluation/iter4/claude/usage.md` § F-U4-01
