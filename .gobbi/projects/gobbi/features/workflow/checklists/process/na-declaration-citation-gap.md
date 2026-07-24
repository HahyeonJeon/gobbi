---
name: na-declaration-citation-gap
description: A draft's accessibility N/A declaration is plausible but does not carry the per-claim citation the draft's own evidence contract promises for every substantive claim.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-17
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, verification]
keywords: [na-declaration, per-claim-citation, evidence-contract, source-discipline]
author: claude
scenario: per-claim-citation-consistency
item_status: pending
anchor: novel
implemented_in: null
---

# A not-applicable declaration needs the same per-claim citation as any other substantive claim

## What

When a draft's own preamble promises per-claim scan/Ideation citations for every substantive readiness/design claim, every N/A declaration must be held to that same standard — not just the claims that assert something is true.

## Why

Codex's iter-2 evaluator (`CODEX-PREP-CONS-001`, Low/100, `general`/`docs-sync`) found that the iter-2 Preparation draft's line 4 promises per-claim citations for every substantive claim, and two of its three N/A declarations (throughput/scalability at line 31; privacy/data-retention + cost/budget at line 33) carry that citation — but the accessibility/localization N/A at line 32 does not. The conclusion itself is plausible (the deliverable is Markdown skill/doc text with no UI) and the applicable checklist check passes, so this is a documentation-discipline gap, not a substantive error: the draft's own stated evidence contract has one uncited claim among otherwise-consistent citation practice.

## Verification

Re-check the draft's N/A section: every declaration (throughput/scalability, accessibility/localization, privacy/cost) should carry the same citation pattern the other two already use (a pointer to the Scope Contract, the design docs, or an equivalent source justifying the N/A).

## Status notes

Non-blocking (Low/100) — the underlying conclusion is correct; this is purely a citation-consistency gap in the current draft, closable with a one-line addition whenever the draft is next touched (e.g. during Execution's own doc work, or a future Preparation pass).

## Related

- [[post-gate-outcome-provenance-scenario]] — the sibling residual finding from the same evaluation round (unrelated topic; both surfaced by the same iter-2 Codex pass)

No pre-existing scenario in this session's staged set covers per-claim citation consistency; `scenario: per-claim-citation-consistency` names this checklist item's own topic rather than anchoring to another staged scenario (`anchor: novel` reflects the same — no reference insight applies).
