---
name: net-duplication-tradeoff-in-doc-routing-campaign
description: iter1 Claude Overall finding F-OVERALL-01 — the campaign trades one duplicate (D1-002) for one new un-guarded mapping surface (D3-002)
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, docs-sync]
keywords: [f-overall-01, net-duplication, d1-002, d3-002, cross-perspective]
author: claude
related: [d3-002-specialist-phase-loads-column-third-mapping-surface, docs-routing-fixes-lack-automated-drift-guard]
---

# The campaign's net effect on the doc graph is a trade, not a pure reduction (F-OVERALL-01)

## Context

The Stage 3 Overall pass (iter1) synthesized two per-perspective findings that share one underlying fact:
`d3-002-specialist-phase-loads-column-third-mapping-surface` (Structure — Option S adds a new mapping
location) and `docs-routing-fixes-lack-automated-drift-guard` (Risk — neither the new column nor D1-002's
pointer is mechanically guarded). Read together, they describe the campaign's actual net effect: minus one
duplicate (D1-002 removes the local routing table), plus one new un-guarded mapping surface (D3-002's
column).

## Decision

Record the cross-perspective framing as its own accepted-risk entry, distinct from (but cross-referencing)
the two individual findings, because the SYNTHESIS itself is the useful signal for a future reader: this
campaign is not a strict simplification of the doc graph, it is a considered trade the user made when
locking Option S over the legend.

## Rationale

Neither individual per-perspective finding states the trade as clearly on its own — Structure sees the new
surface, Risk sees the guard gap, but only the Overall pass names the NET accounting. A future session
auditing "did this campaign make things simpler" needs this framing, not just the two component findings.

## Alternatives considered

- **Skip staging this as a separate entry since it duplicates the two component findings' evidence.**
  Rejected — the synthesis (net trade, not pure reduction) is itself the distinct claim; recording only the
  two components would lose that framing for a future reader.
- **Merge this into one of the two component findings.** Rejected — it is a Stage-3, cross-perspective
  claim about the CAMPAIGN as a whole, not about either individual defect; keeping it separate preserves
  Stage-3's synthesis role distinctly from Stage-2's per-perspective findings.

## Consequences

Structurally, Option S makes its own regression class harder to reintroduce (a genuine mitigation); the
D1-002 pointer offers no equivalent structural guard. Both facts stand; the net accounting is accepted as
correct and complete for this session — no further design change follows from it. A future automated guard
(see `docs-routing-fixes-lack-automated-drift-guard`) would close the residual gap this synthesis names.

## Related

- [[d3-002-specialist-phase-loads-column-third-mapping-surface]] — one of the two findings this synthesis
  combines
- [[docs-routing-fixes-lack-automated-drift-guard]] — the other of the two findings this synthesis combines
