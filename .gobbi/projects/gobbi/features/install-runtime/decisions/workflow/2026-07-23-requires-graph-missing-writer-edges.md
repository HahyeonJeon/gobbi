---
name: requires-graph-missing-writer-edges
description: The requires graph did not encode two load-bearing writer-order dependencies (T1-to-T2, T3/T4 file-sharing), so a scheduler reading only the graph could reorder tasks and lose edits; both systems found this independently
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [cod-plan-struct-001, f-struct-01, requires-graph, writer-order-edge, topological-order]
author: claude
supersedes: null
superseded_by: null
related: []
---

# The `requires:` graph now encodes every real ordering edge, including writer-order edges

## Context

At iter1, both evaluators independently found the same class of gap: `planning/SKILL.md` P-6 admits writer
order as real causality (two tasks that don't share data but must run in a fixed order because one's writer
discipline depends on the other's completion), but the plan's `requires:` graph omitted two such edges — T1→T2
(source-before-trim: the legacy inventory must freeze before any source prose moves, even though T1 and T2 are
file-disjoint) and the T3/T4 shared-file ordering. A scheduler reading the graph alone (not the surrounding
prose) could have run T4 before T3 or T3 before T2 and lost edits (`COD-PLAN-STRUCT-001`, High/100;
`F-STRUCT-01`, Medium/100 — the same underlying gap, found independently by both systems).

## Decision

Added the explicit T1→T2 writer-order edge and the T3→T4 shared-file edge to `requires:`, so the graph alone —
without any surrounding prose — reproduces the single documented task order.

## Rationale

Re-derived a topological sort by hand over the resulting `requires:` fields alone: the ready-set has exactly one
member at every step, so T1→T9 is the UNIQUE order the graph itself proves, not merely permits.

## Alternatives considered

- **State the ordering only in prose ("Lane A must complete before Lane B")** — rejected: a scheduler or a fresh
  executor reading only the machine-readable `requires:` field would not see it; the graph itself must carry
  every ordering edge.

## Consequences

Any future task-reordering change to this plan must re-run the topological-sort check (`PLAN-STRUCT-SCENARIO-02-CHECK-03`)
to confirm the graph still has exactly one valid order before treating a reordering as safe.

## Related

(none — the fix fully closed the finding at iter2, reconfirmed unchanged through iter3)
