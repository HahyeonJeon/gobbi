---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
status: accepted
feature: repo-reset
finding-id: F-CX-PLAN-O3-O-01
finding-type: general
domain: docs-sync
severity: High
confidence: 100
disposition: addressed
supersedes: null
superseded_by: null
---

# Derived Summary (main.md) Must Be Cross-Checked Against Rawdata Changes in Each Revision

## Context

After iter3's rawdata corrections (Fix 1-4), the derived summary `staging/plans/main.md` retained 3 stale references to `draft-iter2.md` (at lines 126, 141, 154). Additionally, §5a's summary at line 141 omitted the `git status --porcelain` precheck that iter3 Fix 2 added to the rawdata. Claude's iter3 evaluation focused on the rawdata being correct and did not mechanically verify the derived summary. Codex ran `grep -nE "draft-iter2.md" main.md` and surfaced the residual.

## Decision

When a LIGHT iter's changes are concentrated in a derived summary file (or when any iter modifies the rawdata), the evaluator must explicitly run pointer-staleness checks (`grep -nE "<old-ref>" <summary-file>`) rather than relying on the rawdata being correct as a proxy for the summary being correct. The mechanical grep is the verification, not reasoning.

## Rationale

A derived summary file and its rawdata source can drift independently. The iter3 evaluator correctly verified the rawdata; it failed to verify that the derived summary reflected the rawdata's changes. This is the same pattern as the `manager-mispec-grep-c-for-occurrence-count.md` lesson: empirical verification (grep) catches what reasoning misses.

## Alternatives considered

Only verify rawdata correctness and trust the summary follows. Rejected: this is exactly what failed. The summary has its own change surface.

## Consequences

Planning evaluators for LIGHT iters must add a grep step: "does the derived summary `main.md` still contain any stale references from the prior iter?" This should be in the planning/evaluation.md child doc as a required Step 2 verification.

## Related

- `planning/rawdata/draft-iter4.md` § D-PLAN-12
- `planning/staging/plans/main.md`
- `.gobbi/projects/gobbi/mistakes/manager-mispec-grep-c-for-occurrence-count.md`
