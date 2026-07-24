---
name: f-str3-001-set-placement-reason-gaming-symmetry
description: The MIG-2 set-placement_reason surface lacks the anti-cosmetic gaming floor MIG-3/SA-4 gives the sibling primary-declaration rationale.
type: decisions
scope: feature
feature: install-runtime
status: proposed
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [process, verification]
keywords: [gaming-check, placement-reason, sr-4, mig-2, symmetric-floor, startup]
author: claude
supersedes: null
superseded_by: null
related: [design-should-symmetrically-floor-sibling-resolution-enums]
---

# F-STR3-001 — Set `placement_reason` lacks the anti-cosmetic gaming floor the primary-declaration rationale carries

## Context
iter3's Ideation revision answers iter2 finding F-STRUCT-001 by requiring, for each family's PRIMARY
category declaration, "a gaming check FAILS a copy-pasted 'recommended by D14' or category-name-only
rationale" (`draft-iter3.md:207` MIG-3, `:241` D14, `SA-4` adversarial scenario `:180`). The same iter3
revision's MIG-2 deferral (`draft-iter3.md:206`, answering iter2 finding COD-STRUCT-002) introduces a NEW
author-justified surface — a `placement_reason` column per family in the auditable `family_id /
legacy_or_new / set_id / placement_reason` table — and requires it be present ("Execution justifies each in
`placement_reason`", `:240`), but attaches no analogous gaming check that FAILS a cosmetic
`placement_reason` (e.g. "matches the S1 theme").

## Decision
Recorded as an open `assumption_risk` finding for Planning to resolve — not fixed in this Ideation loop
(Low severity, does not meet the REVISE threshold). Planning MUST extend the SA-4/MIG-3 anti-cosmetic
gaming check to the MIG-2 `placement_reason` column (fail a theme-name-only or copy-pasted placement
rationale), OR explicitly state that set placement is organizational-only and does not need the same floor,
with a written rationale for the asymmetry.

## Rationale
`mistakes/assumption/design-should-symmetrically-floor-sibling-resolution-enums.md` establishes: when an
escape-hatch/gaming class is closed on one author-justified surface, every SIBLING author-justified surface
in the same design is a candidate for the identical relabel-to-dodge-work failure, whatever that surface's
own vocabulary. `placement_reason` and the primary-declaration `SR-4` justification are exactly such
siblings — both are "why did you assign X here" author rationale fields introduced by the same migration.
Impact is bounded: set placement is organizational, already gated by `union=30` / one-family-one-set / the
SR-8 threshold check, and is not itself an acceptance-bearing grading gate — hence Low, not a design breach
that blocks PASS.

## Alternatives considered
- **Fix it now in Ideation** — rejected: the exact gaming-check wording and its interaction with the MIG-2
  table's other fields is an Execution-mechanism decision (per the Scope Contract's Out-of-Scope: "detailed
  implementation mechanism ... deferred to Planning/Execution"), and the finding is Low/50 — it does not
  block the PASS verdict at Ideation altitude.
- **Ignore the asymmetry** — rejected: it is a real, named class of gap (per the cited mistake) with a
  concrete gaming vector (an Execution agent could fill `placement_reason` cosmetically, echoing the D13
  recommended placement or the set theme name, the same cosmetic-compliance pattern SA-4 guards against for
  primaries).

## Consequences
Planning MUST either (a) add an explicit MIG-2 `placement_reason` gaming check to the plan's acceptance
criteria for the family-migration task, mirroring MIG-3's primary-declaration gaming check, or (b) record an
explicit, justified decision that `placement_reason` does not need the same floor and cite why (e.g., because
downstream SR-8 count/threshold checks already catch a materially wrong placement even if the stated reason
is cosmetic). Either resolution must be reflected in the Planning-loop plan before Execution authors the
MIG-2 table.

## Related

- [[design-should-symmetrically-floor-sibling-resolution-enums]] — the project mistake this finding instantiates
