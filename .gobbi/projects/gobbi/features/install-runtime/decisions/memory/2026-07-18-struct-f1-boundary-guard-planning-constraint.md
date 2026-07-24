---
name: struct-f1-boundary-guard-planning-constraint
description: STRUCT-F1 (manager touches every phase document) stays a disputed, maintained non-defect through Preparation — Planning must attach, implement, and verify the I8 boundary guard as a live acceptance consequence.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-18
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [process, design]
keywords: [struct-f1, boundary-guard, disputed-non-defect, i8, planning-constraint, attach-implement-verify]
author: claude
supersedes: null
superseded_by: null
related: [struct-f1-manager-phase-doc-boundary-guard, preparation-ten-verification-anchors]
---

# STRUCT-F1 carries into Planning as a tracked constraint with a live acceptance consequence

## Context

STRUCT-F1 (the manager touches every phase document — is the manager a shared-state/coordinator hub?) was
raised during Ideation and resolved there as a **disputed, maintained non-defect**
(`1-ideation/staging/decisions/struct-f1-manager-phase-doc-boundary-guard.md`): the manager is the
pre-existing `startup` interview driver, not a new shared-state hub, and I8 (one-owner-per-fact) plus the
one-way ledger→readout→synthesis-step flow are the sufficient coupling controls — but Ideation locked a
**falsifiable boundary guard** as a condition of that disposition: if implementation later puts field
definitions, canonical claim state, or cross-file taxonomies into manager prose, that violates I8 and the
content MUST move back to its owning child doc.

Preparation's dual-system evaluation re-examined this finding at every iteration (COD-CONS-001-ITER2 at
iter2, re-verified addressed at iter3) because the disposition — disputed but not fixed — requires a fresh
per-iteration judgment, not a one-time close. iter2 found the readiness record gave STRUCT-F1 two
INCONSISTENT treatments in different sections (a High/100 Consistency finding); iter3's fix made the
treatment single and coherent: STRUCT-F1 keeps its Ideation-locked disputed/maintained-non-defect disposition
AND becomes a tracked Planning constraint with a live, testable acceptance consequence
(`outputs/preparation.md` § "Live Ideation carry-forwards", STRUCT-F1 row).

## Decision

STRUCT-F1 is NOT a Preparation fix and is NOT resolved by Preparation — it is a disputed finding whose
Ideation-locked disposition (maintained non-defect, with the I8 boundary-guard condition) is preserved
unchanged, and it becomes a **tracked Planning constraint with a live acceptance consequence**: Planning
ATTACHES the I8 boundary guard to the IP-1 source-edit and verification work (the phase-document render/
confirm path this finding concerns), and IMPLEMENTS + VERIFIES it — not merely tracks it as a note. The
acceptance consequence: FAIL if any Execution change puts field definitions, canonical claim state, or
cross-file taxonomies into manager prose; on a FAIL, move the content back to its owning child doc
(`topics.md` / `recording.md` / `scenario.md` / `checklist.md` / `evaluation.md` per I8).

## Rationale

Both dual-system evaluators, across all three Preparation iterations, confirm the underlying finding is a
non-defect on the CURRENT design (the manager interacts with all four phase-doc readouts but owns none of
their schemas — interaction is not state/schema ownership) while agreeing the boundary-guard condition
remains load-bearing precisely because interaction without ownership is a property Execution could violate
later. Two structurally different actions are both required and neither substitutes for the other: (a)
preserving the disputed/maintained-non-defect disposition (closing it as "resolved" would misrepresent an
active dispute the evaluators keep re-raising at Low/25 confidence), and (b) giving it a genuinely testable
Planning-level consequence (a disputed finding with no acceptance consequence is not actionable — it would
silently expire at the loop boundary). Preparation's iter2→iter3 fix (COD-CONS-001-ITER2) specifically closed
the gap where these two actions were split across inconsistent sections of the readiness record, giving one
coherent treatment instead.

## Alternatives considered

- **Close STRUCT-F1 as resolved (no longer a live concern).** Rejected: both systems' Stage-2 disposition
  procedure requires a fresh disposition every iteration for an inherited finding, and `disputed` — not
  `addressed` — is the honest disposition while the creator's position (non-defect) and the evaluator's
  Low/25-confidence flag disagree on severity but agree on the underlying observation. Silently closing it
  would drop the I8 boundary-guard condition Ideation locked.
- **Redesign to remove the manager from the phase-doc render/confirm path.** Rejected at Ideation (see
  `struct-f1-manager-phase-doc-boundary-guard` § Alternatives considered) as introducing a novel structural
  pattern with no precedent in the existing `startup` skill; not re-opened here.
- **Track STRUCT-F1 as an informational note only, with no Planning acceptance consequence.** Rejected: this
  was the iter2-flagged inconsistency (COD-CONS-001-ITER2) — a note with no testable consequence lets the
  boundary guard silently expire at the Preparation→Planning handoff. The iter3 fix requires Planning to
  ATTACH, IMPLEMENT, and VERIFY the guard, not merely note it.

## Consequences

Planning MUST attach the I8 boundary guard to the specific task(s) implementing or verifying the IP-1
source-edit and phase-document work, and that task's acceptance criteria MUST include a check that FAILS if
field definitions, canonical claim state, or cross-file taxonomies land in manager prose rather than their
owning child doc. This is a live acceptance consequence, not a passive carry-forward note — a Planning task
list that mentions STRUCT-F1 only in a risks/notes section without an attached, verifiable acceptance
criterion does not satisfy this decision. The underlying disputed/maintained-non-defect disposition from
Ideation is otherwise unchanged and is not re-litigated by Planning or Execution absent new evidence.

## Related

- [[struct-f1-manager-phase-doc-boundary-guard]] — the Ideation decision this file carries forward; the
  original dispute rationale, the I8 boundary-guard condition, and the alternatives Ideation already
  considered live there and are not restated here.
- [[preparation-ten-verification-anchors]] — the ten Preparation-locked manual anchors; STRUCT-F1 is a
  separate live Planning constraint, not one of the ten anchors.
