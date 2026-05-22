---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-R-03
Type: assumption_risk
Domain: process
Disposition: superseded
Confidence: 75
Severity: Medium
supersedes: null
superseded_by: F-CX-OV-01
---

# D2 Gate Uses `grep -c` Patterns That Risk Repeating the Manager-Mispec Mistake (Superseded by F-CX-OV-01)

## Context

iter1 Claude evaluator (Risk perspective) found that D2 verification gates #11 and #15 used `grep -c` and `wc -l` patterns. The evaluator noted the recently-promoted `manager-mispec-grep-c-for-occurrence-count.md` mistake and verified that the specific usages in D2 were actually correct (one entry per line in each case). The finding was about the risk of the ambiguity in gate semantics (per F-S-01/F-U-01) inviting the executor-rationalized-failing-verification-gate anti-pattern.

## Decision

SUPERSEDED by F-CX-OV-01 (Codex iter2). The deeper issue was not the `grep -c` syntax but that the Stage D/E gate itself was self-referential (impossible to satisfy). iter3 Q-Gate-Redesign resolves both the gate ambiguity (F-S-01/F-U-01) AND the self-reference (F-CX-OV-01) with non-circular `git log` + `git ls-tree` pre-conditions, making the gate unambiguous and non-rationalizable per the `executor-rationalized-failing-verification-gate.md` discipline.

## Related

- `ideation/staging/decisions/sha-gate-self-referential.md` (F-CX-OV-01, the superseding finding)
- `ideation/staging/decisions/stage-d-e-commit-boundary-ambiguity.md` (F-S-01, co-superseded)
- iter1 `evaluation/iter1/claude/risk.md` § F-R-03
