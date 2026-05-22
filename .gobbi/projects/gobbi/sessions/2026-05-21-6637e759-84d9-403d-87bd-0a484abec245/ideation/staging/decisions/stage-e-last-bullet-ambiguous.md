---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-U-01
Type: design_flaw
Domain: process
Disposition: superseded
Confidence: 75
Severity: High
supersedes: null
superseded_by: F-CX-OV-01
---

# Stage E Last Bullet Ambiguous (Superseded by F-CX-OV-01)

## Context

iter1 Claude evaluator (Usage perspective) found that Stage E's "bare-UUID delete LAST" instruction was ambiguous — when exactly is "LAST," and what is the gate?

## Decision

SUPERSEDED by F-CX-OV-01 (Codex iter2). The deeper issue was the SHA gate's self-referential impossibility. iter3 Q-Gate-Redesign resolves both the ambiguity AND the gate with two non-circular `git` plumbing pre-conditions.

## Related

- `ideation/staging/decisions/stage-d-e-commit-boundary-ambiguity.md` (F-S-01, co-superseded)
- `ideation/artifacts/scope-contract.md` (Stage E.2)
- iter1 `evaluation/iter1/claude/usage.md` § F-U-01
