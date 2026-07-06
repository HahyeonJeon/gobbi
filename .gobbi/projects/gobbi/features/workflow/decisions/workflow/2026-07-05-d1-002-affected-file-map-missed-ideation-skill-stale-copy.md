---
name: d1-002-affected-file-map-missed-ideation-skill-stale-copy
description: iter1 Codex finding F-CODEX-PROJ-001 — D1-002's blast-radius map over-claimed ideation/SKILL.md as fully consistent; corrected at iter2 (D5-012)
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, docs-sync]
keywords: [f-codex-proj-001, d1-002, ideation-skill-md, d5-012, scope-accuracy]
author: claude
related: [d1-002-canonical-pointer-replaces-drifted-routing-table, d5-012-ideation-skill-md-stale-routing-copy]
---

# D1-002 affected-file map missed the live `ideation/SKILL.md` stale copy (F-CODEX-PROJ-001)

## Context

At iter1, the D1-002 blast-radius section scoped the edit to `workflow/evaluation.md` and listed
`ideation/SKILL.md` as read-for-consistency only, claiming it was already consistent. Codex's iter1 Project
evaluator (F-CODEX-PROJ-001, Type `design_flaw`, Domain `docs-sync`, Severity High, Confidence 100) found
that while `ideation/SKILL.md:430,435` genuinely do state "no shortcut routing" (consistent), the SAME file's
line 496 (the RECORD output-paths supplementary row) still carries the identical stale wording D1-002 exists
to remove: `general … citable external pattern → staging/references/`.

## Decision

Correct the draft's claim: `ideation/SKILL.md` is NOT fully consistent. Lines 430/435 are; line 496 is a
separate, sibling stale copy of the same drift, tracked as a distinct out-of-scope finding, D5-012. Do NOT
expand the locked D1-002 edit set to include `ideation/SKILL.md` — that would breach the user-locked
3-finding bundle. Instead: declare `ideation/SKILL.md:496` Out-of-Scope + Deferred in the Scope Contract, and
stage a backlog cross-ref (D5-012) for Wrap-up to surface.

## Rationale

D1-002's own finding text, as validated in the 2026-07-01 review, scopes to `workflow/evaluation.md` only —
`ideation/SKILL.md:496` is a genuinely separate prior finding the review corpus tracks as D5-012, not a
missed co-touch of THIS finding. Folding it in without the user's decision would be scope creep (Principle
5). The correct fix is a scope-accuracy correction (stop over-claiming consistency) plus an explicit backlog
pointer, not an edit-set expansion.

## Alternatives considered

- **Expand D1-002's edit set to include `ideation/SKILL.md:496`.** Rejected — breaches the locked 3-finding
  bundle without a user decision to extend scope.
- **Leave the over-claim uncorrected, since the actual live risk is low (a stale row, not a broken
  contract).** Rejected — the draft is a design-direction document Execution and future sessions read
  literally; a false "this file is consistent" claim misleads a future reader auditing the same drift.

## Consequences

The Claude iter2 Project evaluator confirmed: "Disposition: addressed. The scope-accuracy over-claim is
corrected, D5-012 is tracked out-of-scope, and no scope breach was introduced." The scope contract now
explicitly names D5-012 in both Out-of-Scope and Deferred sections, and `ideation/SKILL.md` is never listed
in the D1-002 EDIT set.

## Related

- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — the design this finding shaped
- [[d5-012-ideation-skill-md-stale-routing-copy]] — the backlog cross-ref this correction produced
