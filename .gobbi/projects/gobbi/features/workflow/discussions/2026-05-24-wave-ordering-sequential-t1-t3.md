---
name: wave-ordering-sequential-t1-t3
description: User confirmed T1→T3 wave ordering is strict sequential (graph-enforced), not advisory — LOCK #1 applies as hard constraint.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, wave-ordering, lock1, dependency-graph]
topic: T1→T3 wave ordering — strict sequential or interleaved?
outcome: Strict sequential confirmed; graph-enforced via LOCK #1 (05,06 → 07)
---

# Wave ordering: strict sequential T1→T3 (workflow waves)

## Context

The plan proposes running T1 tasks (01-06) before T3 tasks (07-10). The leader asked the user to confirm whether this should be strictly sequential or merely recommended (allowing interleaving if an executor wanted to run Task 06 after Task 07, for example).

## Question

Should the T1 wave complete before the T3 wave starts (strict ordering), or is the ordering advisory (executors can interleave if it seems safe)?

## Options considered

1. **Strict sequential** — graph-enforced: LOCK #1 is the canonical choice. Tasks 07-10 cannot start until all of Tasks 01-06 complete. Rationale: coherent commit history, one wave per commit, avoids interleaving ambiguity on shared files.
2. **Advisory ordering** — prose-only: leader recommends the sequence but the dependency graph doesn't enforce it. Executors can interleave at their discretion.

## User decision

Strict sequential confirmed. LOCK #1 applies as strict ordering, not advisory.

## Implication

The dependency graph uses edges `05 → 07` AND `06 → 07` (both terminal T1 leaves gate Task 07). Neither 05 nor 06 alone gates 07 — both do. This was strengthened in iter2 Fix 2 from the iter1 form of `requires: [05]` only.

## Related

- planning/staging/decisions/lock1-wave-ordering-not-graph-enforced.md
- draft-iter2.md:388 (dep table), :399 (wave-ordering paragraph)
