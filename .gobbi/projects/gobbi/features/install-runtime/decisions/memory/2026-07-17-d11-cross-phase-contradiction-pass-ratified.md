---
name: d11-cross-phase-contradiction-pass-ratified
description: D11 (recording.md §7 cross-phase readout-comparison pass) was folded from the Codex iter1 proposal without user authority, then RATIFIED into the locked decision set at iter2 (discussion-log F1) after the dual-system evaluation caught the authority gap.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [design, process]
keywords: [d11, cross-phase-contradiction, user-authority, ratification, production-authority, startup]
author: claude
supersedes: null
superseded_by: null
related: []
---

# D11 — cross-phase contradiction pass, ratified into the user-locked set (resolves COD-PROJ-001)

## Context
iter1's canonical draft integrated a Codex-sourced design addition — extending `recording.md §7` to compare
each confirmed phase readout against its underlying topics AND against all earlier/later confirmed readouts,
reopening the earliest owning branch on a mismatch — as `took-codex` in the Integration Log (row 11), marked
"not a LARGE gap" and not escalated. Both dual-system evaluators (Claude PROJ-F1, Codex COD-PROJ-001)
independently flagged this as a High-confidence authority defect: the artifact asserted "no new design
beyond what the user locked," but D11 served the locked "catch cross-phase drift" goal via a genuinely new
mechanism the user had not explicitly authorized — the production contract classifies ANY Design or Scope
delta as LARGE, requiring escalation (`orchestration/workflow/production.md:81-90`).

## Decision
D11 is RATIFIED into the user-locked decision set. The user was asked directly (discussion-log F1,
2026-07-17 ~11:20) and answered "Ratify D11." The `recording.md §7` pass compares each confirmed phase
readout with its underlying topics AND with all earlier/later confirmed readouts; a mismatch reopens the
earliest owning branch, invalidates derived confirmations, and must resolve before the promotion manifest
gets pre-write approval.

## Rationale
D11 was not rejected on its merits — both evaluators judged it a defensible extension of the locked
cross-phase-drift goal — but the AUTHORITY path was wrong: a producer's own selective-integration decision
is not the same as user authorization for a genuine Design delta. Rather than strip D11 (losing a real
improvement) or leave the authority gap unresolved, the correct fix was to surface it explicitly to the user
for an Always-Ask decision, per `orchestration/workflow/production.md`'s Design/Scope escalation rule. This
also produced the general fix: a `discussion-log.md` authority trail didn't previously exist for the whole
loop (F-PROJ-001, iter2, addressed by writing it) and a locked-design authority boundary (§ Design in
`draft-iter3.md`) now explicitly separates user-locked decisions from mechanism-that-operationalizes-a-lock
from latent (not-yet-resolved) escalations — preventing the same authority-gap class from recurring for
D13-D16.

## Alternatives considered
- **Strip D11 from the design** — rejected; would discard a genuinely useful cross-phase-drift catch that
  both systems judged sound on the merits, purely because of a fixable process gap.
- **Leave D11 as producer-integrated without user ratification** — rejected; this is exactly the defect
  COD-PROJ-001/PROJ-F1 flagged. Silent acceptance would leave the "no new design beyond user locks" claim
  false.
- **Re-derive D11 from scratch as a fresh user-proposed decision** — rejected; unnecessary process overhead
  when the existing D11 content was already sound — a direct ratification question was the minimal correct
  fix.

## Consequences
`draft-iter3.md`'s authority trail (§ Scope Contract, § Design authority boundary, § Decisions Log) now cites
`discussion-log.md` for every lock including D11. The `manager-locked-decision-without-audit-trail-sync`
class of defect (a locked decision folded into an artifact without a synced discussion-log entry) is closed
for this loop by the same fix.

## Related

(no direct `[[slug]]` decision links; discussion-log F1 is this decision's authority trail)
