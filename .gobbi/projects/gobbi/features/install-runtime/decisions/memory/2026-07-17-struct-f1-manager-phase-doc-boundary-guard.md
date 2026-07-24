---
name: struct-f1-manager-phase-doc-boundary-guard
description: STRUCT-F1 (manager touches every phase document) is a disputed, maintained non-defect — the manager is the pre-existing interview driver, not a new shared-state hub; a falsifiable boundary guard was added.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [process, design]
keywords: [struct-f1, shared-hub, boundary-guard, dispute, non-defect, startup]
author: claude
supersedes: null
superseded_by: null
related: []
---

# STRUCT-F1 — Manager touches every phase document (disputed, maintained as non-defect)

## Context
Across all three iterations, both evaluator systems flagged the same structural question: SG-1/SE-1/D4/D11
route every phase-doc render, every phase-close confirmation, and the cross-phase `recording.md §7` pass
through "the manager" — the STRUCT-03 adversarial seed asks whether this makes the manager a
shared-state/coordinator hub coupling every component. Codex's iter3 evaluator kept the finding at
`disputed`/Low/25 rather than closing it: "The creator's position ... is that the manager is the existing
interview driver, while the ledger is canonical state and `recording.md` owns fields and derivation. Direct
review of D1–D6 confirms no new manager-owned store or schema." (`evaluation/iter3/codex/structure.md:57-67`)

## Decision
This finding is accepted as a **disputed, maintained non-defect** — not fixed, not escalated, carried into
Planning with its dispute rationale preserved. The manager is the PRE-EXISTING startup interview driver
(`SKILL.md`'s existing P-procedure), not a NEW shared-state hub introduced by this design: the answer ledger
is the authoritative captured state; `recording.md` owns ledger/phase-doc fields + derivation; each phase
doc is a derived event view with source pointers; `scenario.md`/`checklist.md` own grading shapes;
`evaluation.md` owns the adapter procedure. The manager owns NONE of those schemas and introduces no shared
mutable store or reverse-authority edge — I8 (one-owner-per-fact) plus the one-way
ledger→readout→synthesis-step flow are judged the sufficient coupling controls.

## Rationale
Both systems independently confirm the literal observation (the manager does interact with all four
readouts) while agreeing the underlying risk — a coordinator becoming a data/schema hub — is not present:
"the manager does interact with all four readouts, so the literal concern is not erased; it is
non-defective because interaction is not state/schema ownership" (Codex, same citation). A maintained
non-defect still carries obligations: this design locks a **falsifiable boundary guard** at
`draft-iter3.md:272` — if later implementation puts field definitions, canonical claim state, or cross-file
taxonomies into manager prose, that violates I8 and MUST move back to the owning child doc. On the current
phase-doc design, that condition is absent.

## Alternatives considered
- **Redesign to remove the manager from the render/confirm path entirely** — rejected: the manager is
  already the startup interview's driver for every other gate (topic traversal, checkpoint confirmation);
  routing phase-doc renders/confirmations through a different actor would be a new structural pattern with
  no precedent in the existing `startup` skill, contradicting the "no novel structural pattern" Structure
  check (STRUCT-01-CHECK-04, PASS at iter3).
- **Silently close the finding as resolved** — rejected: both systems' Stage-2 disposition procedure requires
  a fresh disposition every iteration for an inherited finding; `disputed` (not `addressed`) is the honest
  disposition when the creator's position and the evaluator's Low/25 confidence disagree on severity but
  agree on outcome.

## Consequences
Planning inherits the boundary guard as a live acceptance condition: any Execution change that puts field
definitions, canonical claim state, or cross-file taxonomies into manager prose is a regression against this
locked decision and must move the content back to its owning child doc (`topics.md` / `recording.md` /
`scenario.md` / `checklist.md` / `evaluation.md` per I8).

## Related

(no `[[slug]]`-linked project mistakes directly instantiate this dispute; the boundary guard is a new,
locally-scoped acceptance condition)
