---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: deferred
feature: repo-reset
finding-id: F-P-02
Type: assumption_risk
Domain: process
Disposition: open
Confidence: 75
Severity: Medium
supersedes: null
superseded_by: null
---

# Counterfactual "Do Nothing" Not Fully Articulated

## Context

iter1 Claude evaluator (Project perspective) found that the artifact's counterfactual only steel-mans "do less (archive via tag)" rather than "do nothing (live with debt forever)." The purest "no reset" argument — continuing to build on the current incoherent state — is not articulated.

## Decision

Accepted as a minor gap; the steel-man for "do less" (which Q-F satisfies) is the most load-bearing alternative. Planning should note this as a residual risk: if the rebuild timeline slips significantly, the value of the pre-reset tag vs. the cost of maintaining a bifurcated state should be re-evaluated.

## Rationale

The artifact's re-framing conclusion checks two specific adjacent framings (consolidate trees, couple cleanup to rebuild design). The "do nothing" counterfactual is the weakest argument against the sweep given the user's explicit 7-item cleanup request. Accepted by the user and manager as below the REVISE threshold.

## Consequences

Planning inherits this as a background risk note: the "pre-reset tag as archival cheapness" assumption holds only if the tag is preserved and the rebuild timeline is reasonable.

## Related

- `ideation/artifacts/framed-problem.md` § Counterfactual / steel-man
- iter1 `evaluation/iter1/claude/project.md` § F-P-02
