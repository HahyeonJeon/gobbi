---
name: prep-deferred-constraints-wired-into-plan
description: Preparation's two deferred verification constraints (COD-PROJ-001-ITER3) and the STRUCT-F1 carry-forward are now authored as literal task-local predicates
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification, docs-sync]
keywords: [cod-proj-001-iter3, lp-d23, lp-d8, struct-f1, phase-doc-predicate, probe-wiring-predicate]
author: claude
supersedes: null
superseded_by: null
related: [pacing-regex-residual-formulation-gaps]
---

# Preparation's deferred verification constraints are now wired into Planning's task-local predicates

## Context

Preparation iter3 (PASS, user-accept-with-deferral) closed with one deferred constraint, `COD-PROJ-001-ITER3`:
the Codex evaluator found the ten manual verification anchors (VA-01…VA-10) lacked literal, self-failing pass
predicates for two obligations — the D2/D3 phase-doc schema/body/provenance fields (an extension of anchor 7),
and the D8 probe-continuation allowance's wiring to A4/riskiest-assumption plus the override path (an extension
of anchor 10). Preparation recorded the gap but explicitly deferred authoring the predicates to Planning, per
the user's accept-with-deferral decision (`2-preparation/staging/decisions/cod-proj-001-iter3-literal-verification-predicates-to-planning.md`).
Separately, `STRUCT-F1` (Preparation carry-forward) requires that field definitions / canonical claim-state /
cross-file taxonomies live in the owning child doc, never in `SKILL.md` prose — a live acceptance consequence,
not yet attached to a specific task at Preparation-close.

## Decision

Both deferred constraints are resolved in this Plan, not pushed further into Execution:

- **LP-D23** (extends anchor 7): the phase-doc schema/body/provenance fields are self-failingly checked — authored
  verbatim in **T4**'s `verifies:` field, with a literal task-local D11 predicate (compare / reopen earliest
  owner / invalidate downstream / regenerate / re-confirm).
- **LP-D8** (extends anchor 10): the affirmative probe-continuation allowance must be present in BOTH
  `topics.md` AND `SKILL.md`, explicitly wired to A4 / the riskiest-assumption selection AND to the override
  path — authored verbatim in **T3**'s `verifies:` field, declared **MANDATORY-MANUAL** (the shell block cannot
  test it: `A4` and `riskiest-assumption` already exist pre-edit, so a token-presence grep is a false green on
  the exact deferred predicate — `verification/verifies-must-be-self-failing`).
- **STRUCT-F1**: attached, implemented, and verified as a live acceptance consequence in **T4, T5, and T9** — a
  FAIL condition if field definitions / canonical claim-state / cross-file taxonomies land in manager prose
  instead of the owning child doc.

## Rationale

Both anchor extensions require task-local, not summary-table, acceptance authority — a fresh executor dispatched
with one task brief must be able to derive the requirement from that brief alone (the same principle the plan
applies to every `D1…D16` lock via the `traces-to` quotation contract). Attaching LP-D23/LP-D8 only to a
Preparation-level anchor summary would leave the actual authoring task (T3, T4) without an enforceable
obligation. STRUCT-F1's boundary is only testable where the phase-doc contract and its consumers are actually
authored (T4, T5) and where the whole six-file package is verified (T9).

## Alternatives considered

- **Leave the predicates in Preparation's anchor register only, unattached to a task** — rejected: a summary
  table is not an acceptance authority a fresh single-task executor can enforce; this is exactly the gap
  `COD-PROJ-001-ITER3` identified.
- **Defer LP-D23/LP-D8 to Execution's own task-authoring** — rejected: Execution runs one task at a time from a
  Planning-authored brief; authoring a new acceptance predicate mid-Execution would be scope creep the plan's
  own dual-system integration discipline exists to prevent, and it would leave Planning's own EVALUATION unable
  to verify the deferred constraint was actually closed before PASS.

## Consequences

Execution's T3 and T4 executors MUST treat LP-D23 and LP-D8 as MANDATORY-MANUAL acceptance items — a passing
shell block for T3's pre-existing tokens (`A4`, `riskiest-assumption`) is NOT evidence LP-D8 is satisfied; only
`MC-T3` (exercising the A4/riskiest-assumption selection path and its override) closes it. T9's audit of the
whole six-file package must include a STRUCT-F1 sweep for stray field definitions in manager prose.

## Related

- [[pacing-regex-residual-formulation-gaps]] — the sibling forward-looking finding staged alongside this one
