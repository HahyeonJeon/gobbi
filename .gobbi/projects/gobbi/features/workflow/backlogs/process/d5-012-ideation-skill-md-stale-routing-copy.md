---
name: d5-012-ideation-skill-md-stale-routing-copy
description: A second stale copy of the D1-002 routing-table drift lives at ideation/SKILL.md:496, out of this bundle's locked scope
type: backlogs
scope: feature
feature: workflow
status: open
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [docs-sync, process]
keywords: [d5-012, gen-d1-002, ideation-skill-md, staging-references, general-finding-routing]
author: claude
priority: medium
project-scope: false
shipped_in: null
---

# D5-012 — `ideation/SKILL.md:496` carries a stale routing-table copy

## Context

GEN-D1-002 (fixed in this session's locked design, `workflow/evaluation.md` § Routing Findings to RECORD)
is one home of a drifted, Type-only routing shortcut that contradicts the canonical Type+Domain table in
`evaluation/SKILL.md` § Finding Metadata. Codex's iter1 evaluation (F-CODEX-PROJ-001) discovered that the
SAME stale wording also lives at `ideation/SKILL.md:496` — the Ideation-RECORD output-paths supplementary
row: `"staging/references/{slug}.md (supplementary) | assistant (RECORD) | per general finding with citable
external pattern (atop WORK-staged)"`. GEN-D1-002's own finding text scopes to `workflow/evaluation.md` only
and names this `ideation/SKILL.md` line as a separate, distinct prior finding — D5-012.

## Why deferred

Folding `ideation/SKILL.md:496` into the locked D1-002 fix would breach the user-locked 3-finding bundle
scope (Principle 5 — Scope Is a Contract). The user chose exactly {D3-001, D3-002, D1-002 =
`workflow/evaluation.md` only}; expanding D1-002's edit target to a second file was not part of that
contract. iter2's draft corrected the over-claim that `ideation/SKILL.md` was fully consistent (it is NOT —
L430/435 are consistent, but L496 is stale) and explicitly declared this line out of scope, tracked here.

## When to pick up

No prerequisites — the fix is independent and can run any time. Recommended: bundle with a future
doc-consistency pass, or pick up standalone as a small, single-line fix once `workflow/evaluation.md`'s
D1-002 fix has shipped (so the pointer target it repoints to already exists).

## Suggested approach

Replace `ideation/SKILL.md:496`'s stale `general … citable external pattern → staging/references/` row with
a pointer to `evaluation/SKILL.md` § Finding Metadata (the same pattern D1-002 applies to
`workflow/evaluation.md`), or delete the redundant supplementary row entirely if the canonical table already
covers it via `record/SKILL.md`'s Step 6. Verify with the same grep pattern used for D1-002
(`general.*citable external pattern|Finding type \| Session staging destination`), scoped to
`ideation/SKILL.md` this time.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-05-1fecddb4-255e-4829-9912-42deb9c36fc8/`

## Related

- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — the sibling fix this backlog item's line is
  a second home of
- [[d1-002-affected-file-map-missed-ideation-skill-stale-copy]] — the iter1 finding that discovered this
  sibling copy
