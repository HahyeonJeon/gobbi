---
name: t2-verifies-t5-owned-deletion
description: T2's absence gate checked for a term whose removal is T5's job, so a correct T2 exited 1 unless the executor did T5's work early
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, process]
keywords: [cod-plan-cons-002, t2-t5-boundary, recap-heuristic, cross-task-verification-leak]
author: claude
supersedes: null
superseded_by: null
related: []
---

# T2's verification no longer tests work that belongs to T5

## Context

At iter1, T2's absence gate had three alternatives, and one matched the 200-300-word recap heuristic at
`topics.md:541` — but removing that heuristic is IP-1-d / T5's job, not T2's. A correct T2 exited 1 unless the
executor either did T5's work early or ignored a required gate (`COD-PLAN-CONS-002`, High/100).

## Decision

Removed the recap-heuristic term from T2's gate; it now lives only in T5's gate and the T9 whole-bundle sweep.

## Rationale

Reproduced the defect: with the heuristic still live at `topics.md:541` (correct at T2's sequence point, since
T2 runs before T5), a correct T2 exited 1. After the fix, a compliant T2 passes WHILE the heuristic is still
present, and still correctly fails on a dropped co-located rule or a reintroduced pacing rule.

## Alternatives considered

- **Have T2 remove the recap heuristic too, merging it into T2's scope** — rejected: this blurs the T4/T5
  IP-1-c/d ownership split (recording.md field definitions vs. SKILL.md/topics.md wiring) that the plan's own
  STRUCT-F1 boundary depends on.

## Consequences

Any task's absence/presence gate must be scoped to ONLY the terms that task's OWN files-and-obligations own —
this finding is the concrete precedent cited when re-checking a gate's scope in future plan revisions.

## Related

(none — folded into the plan's task-ownership discipline, no separate residual)
