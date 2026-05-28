---
name: lock1-wave-ordering-not-graph-enforced
description: T1→T3 wave ordering was stated in prose only, not machine-enforced in the task dependency graph — decision to add graph edges.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, wave-ordering, dependency-graph, lock1]
domain: structure
supersedes: null
decision_status: accepted
---

# Wave ordering not graph-enforced — T1→T3 dependency edges added

## Context

The first Planning draft stated in prose that the T1 wave (Tasks 01-06) must complete before the T3 wave (Tasks 07-10). However, Task 07's `requires:` field only listed `[05]`, which permitted Task 06 to run in parallel with or after Task 07 — violating the stated wave gate. Additionally, Tasks 06 and 10 both touch `orchestration/SKILL.md` with no ordering edge between them.

## Decision

Add the missing dependency-graph edges so the wave gate is machine-enforced:
- Task 07 `requires` changed from `[05]` to `[05, 06]`, graph-enforcing both terminal T1 wave leaves as prerequisites.
- Task 10 `requires` gains `06`, enforcing the `orchestration/SKILL.md` sequential-edit ordering.

## Rationale

The prose claim "the T1 wave completes before the T3 wave starts" must be machine-readable in the task graph, not just prose. With only `requires: [05]`, a scheduler or manager could legitimately start Task 07 while Task 06 was still in progress. The strengthened edges close this loophole. Both 05 AND 06 are required on Task 07 because 05 brings the phase-docs cadence rule and 06 brings the direct-mode opt-out, both T1 surfaces the T3 hook script must respect.

## Alternatives considered

- **Leave the wave gate as prose with `requires: [05]`.** Rejected: prose ordering is not enforced by the scheduler, and the single `[05]` prerequisite let Task 06 race Task 07.
- **Gate Task 07 on Task 05 only.** Rejected: that omits the direct-mode opt-out brought by Task 06, which the hook script depends on; both terminal leaves must gate the T3 wave.

## Consequences

The execution order is now strictly 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 (Task 09 may run before 08, since 09 depends only on 07). No T3 task can begin before both 05 and 06 complete.

## Related

- `design/dependency-graph-strict-wave-ordering.md` — the design that captures the full wave-ordering graph.
- `discussions/2026-05-24-wave-ordering-sequential-t1-t3.md` — the AskUserQuestion exchange that confirmed strict (not advisory) ordering.
