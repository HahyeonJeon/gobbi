---
name: docs-routing-fixes-lack-automated-drift-guard
description: iter1 Claude finding F-RISK-01 — the fixed content (D1-002 pointer, D3-002 column) has no automated guard against future re-drift
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, docs-sync]
keywords: [f-risk-01, check-workflow-mirror-consistency, check-markdown-links, drift-guard]
author: claude
related: [d1-002-canonical-pointer-replaces-drifted-routing-table, d3-002-manager-refs-specialist-phase-loads-column-split]
---

# Fixed content has no automated drift guard; correctness rests on manual validation (F-RISK-01)

## Context

After this session's fixes ship, nothing mechanically prevents a future edit from re-introducing a Type-only
routing table in `workflow/evaluation.md` (D1-002) or reintroducing a single-column `Refs`-cell conflation in
the mode tables (D3-002). `check-workflow-mirror-consistency.sh` only confirms each canonical `workflow/*.md`
has a resolving `.claude/` mirror symlink (an existence check, not content parity); `check-markdown-links.sh`
covers link/anchor resolution, not routing-table content; `check-skill-mistakes.sh` does not bind (no
`mistakes.md` is touched by these fixes).

## Decision

Accept the gap within this bundle's scope. Record it as a deferred risk with a named future-guard suggestion
rather than authoring a guard now (guard-authoring is out of the locked 3-finding scope).

## Rationale

D3-002's structural split makes ITS OWN regression class (Refs/specialist-cell conflation) harder to
reintroduce by construction — a future row must fill both cells. D1-002's pointer, by contrast, offers no
structural guard: a future editor can paste a local routing-table copy back into `workflow/evaluation.md`
without any automated signal. Authoring a `check-routing-table-single-source`-style guard is real, valuable
work, but it is a distinct deliverable from "design the fix direction for 3 findings" — adding it here would
be scope creep (Principle 5) without the user's explicit decision to extend the contract.

## Alternatives considered

- **Author the guard script now, inside this session.** Rejected — out of the locked scope; the three
  findings are documentation-content fixes, not tooling additions, and the user did not extend the contract
  to include guard-authoring.
- **Do not record the gap at all, since it is a pre-existing condition (no guard existed before this fix
  either).** Rejected — while the ABSENCE of a guard is pre-existing, the RISK becomes more salient
  immediately after this fix ships (the drift this session removes could silently return), so it is worth
  naming explicitly for the next session's awareness.

## Consequences

A future session doing doc-consistency tooling work should consider a `check-routing-table-single-source.sh`
guard that greps `workflow/evaluation.md` for a local routing table shape and fails if one reappears, plus a
content-diff check between the mode tables' `Specialist phase loads` column and each `workflow/*.md` header's
own phase-skill statement. Until then, the two-week smell test depends on reviewer vigilance, not a gate.

## Related

- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — the design this risk applies to
- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design this risk applies to
- [[net-duplication-tradeoff-in-doc-routing-campaign]] — the cross-perspective synthesis including this risk
