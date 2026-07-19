---
name: d3-002-manager-refs-specialist-phase-loads-column-split
description: Fix direction for GEN-D3-002 — mode tables split into Manager refs / Specialist phase loads columns
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [docs-sync, design]
keywords: [gen-d3-002, auto-mode, chat-mode, refs-column, specialist-phase-loads, option-s]
author: claude
---

# GEN-D3-002 — two-column structural split of the mode tables (`Manager refs` / `Specialist phase loads`)

## Problem

`auto-mode.md` §2 and `chat-mode.md` §3 per-step tables pair `Agent: leader/evaluator/assistant` with a
single `Refs` cell pointing at the manager's own orchestration doc (`workflow/{ideation,evaluation,record}.md`
etc.). Those target docs' own L1-3 headers immediately redirect specialists away — they say the spawned
agent loads `ideation/SKILL.md` / `evaluation/SKILL.md` / `record/SKILL.md` instead. A manager building a
delegation prompt from the table could copy a manager-only ref into a specialist's Load Directives.

## Scope

In scope: splitting the `Refs` column in the per-step tables of `auto-mode.md` §2 and `chat-mode.md` §3.
Out of scope: any change to the workflow docs' own headers (already correct); any change to
`orchestration/delegation.md`'s ownership of the full Gobbi Load Directives block.

## Approach

Replace the single `Refs` column with two columns: `Manager refs` (the manager-facing `workflow/*.md` doc)
and `Specialist phase loads` (the phase-specific skill(s) the spawned agent loads for that phase, on top of
the standard `orchestration/delegation.md` Load Directives). Manager-only rows (DISCUSSION, ITER-EXIT) get `—` in
`Specialist phase loads`. Per-phase mapping: Ideation WORK → `workflow/ideation.md` + `../ideation/SKILL.md`
(+ `../research/SKILL.md` at Sub-step C); Planning/Execution/Wrap-up WORK → their own
`workflow/*.md` + `../*/SKILL.md`; EVALUATION → `workflow/evaluation.md` + `../evaluation/SKILL.md`; RECORD →
`workflow/record.md` + `../record/SKILL.md` (+ `../memory/memory-map.md`).

**Guardrail (unified wording, finalized at iter2):** the `Specialist phase loads` cell names the phase-
specific skill(s) INCLUDING the conditional companion loads the workflow header itself names
(`../research/SKILL.md` at Ideation Sub-step C; `../memory/memory-map.md` at RECORD) but does NOT restate the
full `orchestration/delegation.md` Load block (principles / project-rules fallback / mistake / git) —
`orchestration/delegation.md` remains the sole owner of that block. The earlier iter1 wording said the cell names
"ONLY the phase skill," which contradicted the mapping's own companion loads (a real defect — see § Related,
`d3-002-guardrail-conflicted-with-required-companion-loads`); the unified wording above supersedes it
everywhere the cell is described.

**Readability fallback (bounded within Option S):** if the six-column table renders poorly in Markdown, the
executor MAY (with manager awareness) present the same two-part content in a narrower one-column form with
explicit inline labels. Only the rendering changes; this is not a reversion to the rejected legend alternative
and no agent re-opens the S-vs-legend choice.

## Scenarios

- S2 (golden) — manager builds a `leader` delegation prompt → `Specialist phase loads` sends it to
  `../ideation/SKILL.md` (+ `../research/SKILL.md` at Sub-step C) + `orchestration/delegation.md`; it cannot copy a
  `Manager refs` cell into the specialist's Load Directives.
- S2b (golden, RECORD companion) — manager builds the RECORD `assistant` prompt → the cell sends it to
  `../record/SKILL.md` + `../memory/memory-map.md` + `orchestration/delegation.md`.

Full enumeration lives in `sessions/2026-07-05-1fecddb4-255e-4829-9912-42deb9c36fc8/1-ideation/outputs/ideation-output.md` § Scenarios.

## Validation

Manual delegation-prompt-construction trace (S2/S2b). Consistency cross-read: the `Specialist phase loads`
mapping (including companions) equals each `workflow/*.md` L1-3 redirect; the guardrail wording is identical
everywhere the cell is described. Grep for zero specialist rows carrying a sole `workflow/*.md` ref after the
split. `check-markdown-links.sh` delta-clean; `check-workflow-mirror-consistency.sh` clean (regression).

## Trade-offs

Chosen over a Refs-audience legend (advisory-only note explaining the column's audience) because the finding
is High and the root cause is a structural column-overload — a legend only documents the boundary and a
future row can still regress; the structural split makes the regression non-recurrable. Costs a larger diff
(~9 loop tables across 2 docs, each row gaining a cell) and creates a third location for the phase→skill
mapping (workflow headers + this column + `orchestration/delegation.md`'s ownership statement) — an accepted,
low-but-nonzero drift-recurrence risk (see § Related,
`d3-002-specialist-phase-loads-column-third-mapping-surface`).

## Open issues

The new `Specialist phase loads` column has no automated content-consistency guard against its source
headers (see § Related, `docs-routing-fixes-lack-automated-drift-guard`) — accepted, guard-authoring is out
of this bundle's scope.

## Related

- [[d3-002-guardrail-conflicted-with-required-companion-loads]] — the iter1 defect this design's unified
  wording resolves
- [[d3-002-specialist-phase-loads-column-third-mapping-surface]] — the accepted net-duplication trade-off
- [[d3-002-readability-fallback-not-authority-bounded]] — the iter1 defect the bounded fallback above resolves
- [[d3-002-d1-002-co-locate-at-auto-mode-line-81]] — the sequencing coupling with the D1-002 fix
- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — the sibling High finding sharing
  `auto-mode.md:81`
