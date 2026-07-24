---
name: d12-whole-bundle-sop-migration-locked
description: D12 — the ENTIRE startup grading bundle (29 scenario families + 119 checklist checks) migrates to the current scenario/checklist SOP as part of this redesign, not only the new/extended families (resolves COD-STRUCT-001; locked at discussion-log F2).
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [design, process]
keywords: [d12, whole-bundle-migration, sop-conformance, scenario-checklist-sop, startup]
author: claude
supersedes: null
superseded_by: null
related: []
---

# D12 — whole-bundle SOP migration locked (resolves COD-STRUCT-001)

## Context
The startup grading bundle (`scenario.md`/`checklist.md`/`evaluation.md`) predates the current
`scenario`/`checklist` SOP. Its 29 scenario families have useful Good/Bad/Adversarial prose and its 119
checklist checks have useful binary intent, but the bundle lacks the SOP's set register, primary
declarations, coverage-role cases, obligation traces, per-item metadata, and closed terminal semantics.
iter1's draft proposed migrating only one new family + five extensions for the IP-1/2/3 changes, leaving the
other 24 families non-conformant. Both dual-system evaluators independently flagged this as a High-confidence
structural defect (COD-STRUCT-001): conformance was asserted for the artifact as a whole while the actual
edit plan left most of the bundle unmigrated, and a non-conformant bundle lets the new IP-1 grading gate be
gamed (superficially-present checks passing without the SOP's teeth).

## Decision
The ENTIRE bundle — all 29 legacy scenario families + all 119 legacy checklist checks — migrates to the
current `scenario`/`checklist` SOP standards as part of this redesign, not only the families/checks the
IP-1/2/3 changes directly touch. The user was asked directly (discussion-log F2, 2026-07-17 ~11:20) and
answered "Whole-bundle migration." This is a genuinely new scope class beyond the original three improvement
points, added because the user's own original framing ("redesign checklist.md, scenario.md and
evaluation.md") already made the bundle a full redesign surface, and a partial migration would leave the
gate the redesign itself introduces gameable.

## Rationale
The user's original task-trigger wording (verbatim, discussion-log "Task trigger") already named all three
bundle files as redesign targets, not just the scenario/checklist entries the IP-1/2/3 changes edit
incidentally. A bounded migration (only new/extended families) would leave 24 of 29 families and most of the
119 checks in the legacy shape — meaning the NEW IP-1 grading obligation (a graded, acceptance-bearing
requirement) would sit inside a bundle that, for everything else, still lacks the SOP's coverage-closure vs.
acceptance distinction, its evidence floor, and its anti-gaming primary/coverage-role declarations. A
half-migrated bundle is strictly worse than either a fully-legacy bundle (at least internally consistent) or
a fully-migrated one — it creates a two-tier document where some families have teeth and others don't, with
no way for a reader to tell which is which without re-deriving the migration history.

## Alternatives considered
- **Bounded migration (only the new/extended families touched by IP-1/2/3)** — this was iter1's original
  scope and is what COD-STRUCT-001 flagged as insufficient; rejected by the user at F2.
- **Defer the whole-bundle migration to a separate future session/feature** — considered implicitly (the
  narrower reading of the user's original wording) but rejected once the user confirmed the broader reading
  at F2; the redesign's own new grading obligation (IP-1) would otherwise ship inside a gameable legacy
  bundle from day one.

## Consequences
D13 (bounded logical sets — SR-8 parent-index split, four themes), D14 (family migration map — 30 primary
declarations, family-specific SR-4 justifications), D15 (checklist migration — eval-coverage-register mode,
closed terminals, two-gate model), and D16 (evaluation adapter — routes by declared primary, evaluator
independence) all OPERATIONALIZE this lock as recommended-derived-design (no separate user authority
required for D13-D16 themselves — Execution must still author each per-family justification). MIG-1 through
MIG-8 in the Implementation Checklist enumerate the migration procedure. The six-file scope boundary is
preserved (no new source file — AR-7); if SOP `SR-8` "split" is later proven to require separate child files,
that returns to the user as a latent Always-Ask escalation, not a silent scope expansion.

## Related

(no direct `[[slug]]` decision links; discussion-log F2 is this decision's authority trail; the migration
mechanism decisions D13-D16 live inline in `outputs/idea.md` § Design, not as separate staged decisions,
since they are non-binding recommended-derived-design per the locked-design authority boundary)
