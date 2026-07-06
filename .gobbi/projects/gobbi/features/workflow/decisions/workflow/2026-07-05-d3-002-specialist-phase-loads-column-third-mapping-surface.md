---
name: d3-002-specialist-phase-loads-column-third-mapping-surface
description: iter1 Claude finding F-STRUCT-01 — Option S's new column is a third, un-guarded location for the phase-to-skill mapping; accepted residual
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, docs-sync]
keywords: [f-struct-01, d3-002, option-s, net-duplication, mapping-surface]
author: claude
related: [d3-002-manager-refs-specialist-phase-loads-column-split]
---

# Option S adds a third location for the phase→skill mapping (F-STRUCT-01)

## Context

Today the specialist→skill mapping lives in each `workflow/*.md` L3 header (verified across all eight
workflow docs). D3-002's locked Option S copies that same mapping into a new `Specialist phase loads` column
across ~9 tables in `auto-mode.md` and `chat-mode.md`. Meanwhile D1-002 REMOVES a duplicate table. Net effect
of the campaign: minus one duplicate (D1-002), plus one new mapping surface (D3-002's column). No automated
guard binds the new column against its source headers.

## Decision

Accept this trade-off as-is; it is the direct, foreseen cost of the user-locked Option S (structural split
over legend), not a design flaw to fix within this bundle. Record it as a deferred risk so a future session
knows the guard gap exists.

## Rationale

The finding is a genuine, named trade-off, not a defect: Option S was chosen precisely because a structural
fix makes ITS OWN regression class (a specialist row losing its distinct load cell) harder to reintroduce.
The cost — a third mapping location — is real but bounded: the mapping is small (7 phases) and stable
(phase→skill assignments rarely change), and the iter1 evaluator independently verified every one of the
deferred workflow headers matches the locked Option-S mapping before the design was approved.

## Alternatives considered

- **Have the `Specialist phase loads` cell `[link]` to the workflow header instead of restating the mapping
  inline.** Noted as a plausible Execution-time refinement (the iter1 evaluator suggested it), but not
  adopted as a design requirement — it would still need per-row wiring and does not remove the core
  trade-off; left as an Execution-discretion option, not mandated.
- **Reject Option S in favor of the legend (Option L) to avoid a third mapping surface entirely.** Rejected
  by the user at the design-lock decision (see `2026-07-05-d3-002-structural-split-locked-plus-design-
  approvals`) — the structural benefit outweighs this accepted cost.

## Consequences

This residual is not blocking any iteration; it is recorded so the guard gap
(`docs-routing-fixes-lack-automated-drift-guard`) and this mapping-duplication trade-off are both visible to
future sessions doing doc-consistency work. A future `check-routing-table-single-source`-style guard (out of
this bundle's scope) would close both.

## Related

- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design this finding shaped
- [[docs-routing-fixes-lack-automated-drift-guard]] — the sibling guard-gap finding
- [[net-duplication-tradeoff-in-doc-routing-campaign]] — the cross-perspective synthesis of this finding +
  the guard-gap finding
