---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-S-01
Type: design_flaw
Domain: process
Disposition: superseded
Confidence: 75
Severity: High
supersedes: null
superseded_by: F-CX-OV-01
---

# Stage D-to-E Commit Boundary Ambiguity (Superseded by F-CX-OV-01)

## Context

iter1 Claude evaluator (Structure perspective) found that the Stage D↔E commit boundary was ambiguous — what enters the commit vs. what is FS-only was unclear, and the bare-UUID LAST delete lacked a concrete gate.

## Decision

This finding is SUPERSEDED by F-CX-OV-01 (Codex iter2) which identified the deeper issue: the SHA gate itself was self-referential (impossible). iter3 Q-Gate-Redesign resolves both the ambiguity AND the self-referential gate with the non-circular `git log` + `git ls-tree` pre-conditions.

## Related

- iter2 codex `overall.md` § F-CX-OV-01 (the superseding finding)
- `ideation/artifacts/scope-contract.md` (Stage E.2 gate)
- iter1 `evaluation/iter1/claude/structure.md` § F-S-01
