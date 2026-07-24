---
name: check-id-boundary-sibling-shape-fix
description: The check_ids extractor had no trailing ID boundary, letting a longer compound-split sibling silently alias a shorter legacy check ID; a boundary plus a pinned -S{NN} sibling shape now prevents it
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [f3-struct-02, f2-struct-02, check-id-boundary, sibling-shape-pin, comm-23-zero-loss-proof]
author: claude
supersedes: null
superseded_by: null
related: [t1-ledger-gate-cross-task-predicate-fix]
---

# `check_ids` extractor gains a trailing boundary and a pinned `-S{NN}` sibling shape

## Context

MIG-5 mandates splitting compound legacy checks "losslessly (legacy ID on the core claim)" with "deterministic
sibling IDs", but at iter2 the extractor's regex had no trailing boundary, so a longer token could match as a
PREFIX of a shorter one. Fixture-verified: a bundle whose legacy `-CHECK-01` had been widened to `-CHECK-010`
still passed the `comm -23` zero-loss proof (exit 0) even though the legacy ID was gone (`F2-STRUCT-02`,
High/100).

## Decision

Added a trailing `([^0-9A-Za-z-]|$)` boundary to the extractor, and PINNED the compound-split sibling shape: the
core atomic claim keeps the bare legacy ID; every carved-out claim takes the legacy ID plus a `-S{NN}` suffix
(`-S01`, `-S02`, …) in source order. `check_id_shape_violations` rejects any other sibling form (a letter suffix,
a widened number, a free-form segment).

## Rationale

Neither the Idea (MIG-5) nor VA-03 named the sibling's actual SHAPE, and a gate whose correctness depends on an
Execution-time naming choice is not a gate. Fixture-verified across both directions: the four distinct IDs
`-CHECK-01` / `-CHECK-01a` / `-CHECK-120` / `-CHECK-12` now extract as four distinct values (the OLD extractor
returned two); the widened-ID bundle now FAILS the zero-loss proof (exit 1, was exit 0).

## Alternatives considered

- **Add the boundary without pinning a sibling shape** — rejected: would leave correctness dependent on
  whatever naming an Execution-time executor happens to choose, an unenforceable gate.
- **Leave the extractor unchanged and rely on `check_id_shape_violations` alone** — rejected: without the
  boundary, the aliasing happens before shape-violation checking ever runs; the boundary is the root fix.

## Consequences

Both forms return the same 119 IDs on the live, unmigrated `checklist.md` — nothing regressed on the current
bundle. T6/T7's compound-split work in Execution MUST use exactly the pinned `-S{NN}` shape or
`check_id_shape_violations` will reject it.

## Related

- [[t1-ledger-gate-cross-task-predicate-fix]] — the sibling composition-at-task-boundaries fix in the same finding family
