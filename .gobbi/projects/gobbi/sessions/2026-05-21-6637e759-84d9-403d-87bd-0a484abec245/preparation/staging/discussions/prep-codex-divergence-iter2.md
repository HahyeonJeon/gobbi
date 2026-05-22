---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: preparation
feature: repo-reset
topic: iter1 cross-system divergence routing — surgical iter2 vs full REVISE
outcome: User authorized surgical iter2 additive routing — no re-litigation; 2 Codex findings pre-routed as Planning binding constraints
---

# Preparation iter1 Cross-System Divergence: Surgical iter2 Authorization

## Context

Preparation Loop iter1 returned a cross-system divergence: Claude PASS + Codex REVISE → aggregate REVISE (pessimistic union rule). Codex identified two findings the Claude evaluator missed: F-CX-PREP-O-01 (High/75, mistake-memory continuity) and F-CX-PREP-O-02 (Medium/75, project.json deletion drift). Both findings required acknowledging that the iter1 draft's zero-gap claim was incomplete with respect to Planning's concerns.

## Question

The manager presented the two Codex findings and offered two routing options:

1. **Full REVISE re-discussion**: revisit Sub-steps A–D, re-derive the gap list, produce a full iter2 draft with a revised Readiness summary and all sections rewritten as needed. Risk: re-litigates 19 user-locked Ideation decisions; may expand scope unnecessarily.

2. **Surgical iter2 (additive only)**: add a single new section `## Pre-routed gaps for Planning` between "Out of scope gaps" and "Decisions log" that documents both Codex findings as binding constraints on Planning's decomposition, without rewriting any existing section or re-litigating any locked decision. The findings are not Preparation `generate-now` gaps (the memory state is fine for Preparation); they are Planning decomposition constraints that belong at the Planning boundary.

## Options considered

- **Option 1 (full REVISE)**: thorough but unnecessary — the underlying readiness state is sound; only the Planning boundary needed the constraints surfaced. Would rewrite sections that do not need it and consume extra evaluation cycles.
- **Option 2 (surgical iter2)**: minimal and precise — adds only what Codex identified as missing, pre-routes both findings where they belong (Planning), and preserves the audit trail (iter1 file untouched at rawdata/draft-iter1.md; iter2 a new file).

## User decision

User authorized option 2: surgical iter2, additive only. New `## Pre-routed gaps for Planning` section added. No re-litigation of the 19 Ideation locks. Iter2 draft preserved at `rawdata/draft-iter2.md`; iter1 draft preserved verbatim at `rawdata/draft-iter1.md`.

## Implication

The iter2 draft is the canonical Preparation output. The two Codex findings are now first-class binding constraints in `preparation/artifacts/pre-routed-gaps.md` for Planning's consumption. The cross-system divergence is resolved at iter2 (both systems PASS). Planning receives a clear (a)/(b) decomposition choice for mistake-memory continuity and a one-line inventory correction for project.json.

## Related

- `preparation/artifacts/cross-system-divergence.md`
- `preparation/artifacts/pre-routed-gaps.md`
- `preparation/rawdata/draft-iter2.md` § iter2 round outcome
