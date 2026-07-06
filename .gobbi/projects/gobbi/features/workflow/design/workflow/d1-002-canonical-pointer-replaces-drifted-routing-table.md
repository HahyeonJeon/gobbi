---
name: d1-002-canonical-pointer-replaces-drifted-routing-table
description: Fix direction for GEN-D1-002 — workflow/evaluation.md's local routing table contradicts the canonical Type+Domain table
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [docs-sync, design]
keywords: [gen-d1-002, finding-routing, routing-findings-to-record, canonical-pointer, d5-012]
author: claude
---

# GEN-D1-002 — replace the drifted routing table with a canonical pointer + inline constraints

## Problem

`workflow/evaluation.md` § Routing Findings to RECORD gives a narrowed, Type-only routing table whose only
`general` row sends findings to `staging/references/`, contradicting the canonical Domain-based routing table
in `evaluation/SKILL.md` § Finding Metadata (which routes Type=`general` by Domain across
decisions/checklists/references, with `general/general` as an error). The local table's own intro claims to
apply the canonical routing, and `record/SKILL.md` states RECORD "applies the canonical table with no
shortcut" — so the manager doc contradicts the source it claims to follow.

## Scope

In scope: `workflow/evaluation.md` § Routing Findings to RECORD ONLY. Out of scope: `ideation/SKILL.md:496`,
which carries the SAME stale wording as a sibling copy — that is a separate finding, D5-012, staged as a
backlog cross-ref (see `staging/backlogs/feature/d5-012-ideation-skill-md-stale-routing-copy.md`). Fixing
this doc does not, by itself, make `ideation/SKILL.md:496` consistent; that closure is D5-012's job.

## Approach

Three parts: (i) keep the `## Routing Findings to RECORD` heading text unchanged — `auto-mode.md:81` carries
a live inbound anchor (`#routing-findings-to-record`) to it, and renaming it would break that link;
(ii) delete the contradicting 4-row table and point routing authority at `evaluation/SKILL.md` § Finding
Metadata (+ `record/SKILL.md`), keeping the manager-relevant PASS/REVISE/FAIL + Wrap-up framing;
(iii) inline the two error-prone constraints (Type=`general` routes by Domain; `general/general` is invalid;
RECORD applies the canonical table with no shortcut) alongside the pointer, so the manager sees the two most
error-prone facts without a full 15-row table copy.

## Scenarios

- S3 (golden) — manager routes a `general`/`process` finding at PASS → the canonical Type+Domain table sends
  it to `staging/decisions/` with `mistake-candidate: true` (not `staging/references/`).
- S4 (edge) — a `general`/`general` finding is recognized as a contract violation (Error), not silently
  routed.
- S6 (consistency) — after the D3-002 split rewrites `auto-mode.md:81`, that row's Action-cell inbound link
  to this heading still resolves.

Full enumeration lives in `sessions/2026-07-05-1fecddb4-255e-4829-9912-42deb9c36fc8/1-ideation/outputs/ideation-output.md` § Scenarios.

## Validation

Consistency cross-read after the edit (the doc states one routing contract matching `evaluation/SKILL.md` +
`record/SKILL.md`, no residual narrowed table). Manual trace (S3/S4). Co-location check (S6, after the
D3-002 row-81 rewrite). Grep confirming the narrowed table is gone and the canonical contract is named
inline, scoped to `workflow/evaluation.md` only (the same grep pattern intentionally still hits
`ideation/SKILL.md:496` — expected, that's D5-012, out of scope). `check-markdown-links.sh` delta-clean (the
canonical-table link and the preserved inbound anchor resolve).

## Trade-offs

Rejects restating the full canonical Type+Domain table verbatim (Option B) because that re-introduces the
exact duplication that caused this defect. Rejects keeping only the Domain-independent Type rows and
dropping the contradicting `general` row (Option C) because it retains a smaller residual local table. The
chosen pointer-plus-two-constraints approach costs one reader-hop for the full table's edge cases, offset by
inlining the two facts that matter most day-to-day.

## Open issues

`ideation/SKILL.md:496` remains a live sibling stale copy of the same routing wording (D5-012) — explicitly
deferred, not fixed by this design. No automated guard prevents a future editor from re-introducing a local
routing table here (accepted; guard-authoring is out of this bundle's scope — see § Related,
`docs-routing-fixes-lack-automated-drift-guard`).

## Related

- [[d1-002-affected-file-map-missed-ideation-skill-stale-copy]] — the iter1 scope-accuracy defect this
  design's corrected claim resolves
- [[d3-002-d1-002-co-locate-at-auto-mode-line-81]] — the sequencing coupling with the D3-002 fix
- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the sibling High finding sharing
  `auto-mode.md:81`
- [[d3-001-route-both-step6-bullets-through-mode-dispatch]] — the third finding in the same 2026-07-01
  adversarial review bundle
