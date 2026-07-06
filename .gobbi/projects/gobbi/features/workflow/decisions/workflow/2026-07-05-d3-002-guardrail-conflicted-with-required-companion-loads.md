---
name: d3-002-guardrail-conflicted-with-required-companion-loads
description: iter1 Codex finding F-CODEX-STRUCT-001 — D3-002's "ONLY the phase skill" guardrail contradicted required companion loads; resolved at iter2
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, docs-sync]
keywords: [f-codex-struct-001, d3-002, specialist-phase-loads, research-skill, memory-map]
author: claude
related: [d3-002-manager-refs-specialist-phase-loads-column-split]
---

# D3-002 guardrail conflicted with required companion loads (F-CODEX-STRUCT-001)

## Context

At iter1, the D3-002 design's `Specialist phase loads` guardrail (draft L102, echoed in
`working/discussion-log.md:20`) said the cell names "ONLY the phase skill." The same draft's own row-semantics
enumeration (L150) listed `research/SKILL.md` at Ideation Sub-step C and `memory/memory-map.md` at RECORD as
part of that same cell's content — two conditional companion loads the workflow headers themselves require
(`workflow/ideation.md:3`, `ideation/SKILL.md:245-246`, `workflow/record.md:3`). Codex's iter1 Structure
evaluator (F-CODEX-STRUCT-001, Type `design_flaw`, Domain `docs-sync`, Severity High, Confidence 100) flagged
this as a genuine implementation-blocking contradiction: an executor could satisfy the "ONLY" instruction by
omitting the companions, or satisfy the workflow headers by including them, and both readings were textually
supported.

## Decision

Reword the guardrail to ONE unified wording, applied everywhere the cell is described: the
`Specialist phase loads` cell names the phase-specific skill(s) — INCLUDING the conditional companion loads
the workflow header itself names — but does NOT restate the full `delegation/SKILL.md` Load block.

## Rationale

The contradiction was real, not a style preference: both readings were independently supported by the same
draft, which makes the D3-002 fix's own contract ambiguous for the next executor. Confirmed against the live
worktree that the companions ARE required (`workflow/ideation.md:3` + `31`, `ideation/SKILL.md:245-246`,
`workflow/record.md:3`), so the fix is to correct the "ONLY" wording, not to drop the companions.

## Alternatives considered

None — this is a wording defect with one clear resolution (state that companions are included), not a design
fork. The alternative of dropping the companion loads from the mapping was never viable: they are required
by the workflow headers themselves.

## Consequences

At iter2 the "ONLY the phase skill" phrasing was removed from all four in-draft sites (checklist, Option-S
bullet, rationale, validation). The Claude iter2 Structure evaluator confirmed: "Disposition: addressed for
its enumerated targets... All four in-draft description sites are unified." One residual surfaced — a fifth
site, `working/discussion-log.md:20`, still carried the stale wording at iter2-draft-write time and iter2's
draft made a now-false claim that it too was governed. See the sibling finding
`d3-002-discussion-log-guardrail-wording-stale` for that residual and its resolution.

## Related

- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design this finding shaped
- [[d3-002-discussion-log-guardrail-wording-stale]] — the residual provenance-accuracy defect this fix's
  own iter2 claim introduced
