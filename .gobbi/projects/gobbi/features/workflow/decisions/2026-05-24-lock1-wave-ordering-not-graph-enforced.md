---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: accepted
scope: feature
feature: workflow
loop: planning
finding-id: lock-graph-under-enforced
type: design_flaw
domain: structure
disposition: addressed
confidence: 96
severity: High
surfaced-by: claude+codex (convergent)
addressed-in: iter2 Fix 2
supersedes: null
---

# LOCK #1 T1→T3 wave ordering not graph-enforced (addressed in iter2)

## Context

The Planning iter1 draft stated in prose that the T1 wave (Tasks 01-06) must complete before the T3 wave (Tasks 07-10). However, Task 07's `requires:` field only listed `[05]`, which permitted Task 06 to run in parallel with or after Task 07 — violating the stated wave gate. Additionally, Tasks 06 and 10 both touch `orchestration/SKILL.md` with no ordering edge between them.

## Decision

In iter2 Fix 2:
- Task 07 `requires` changed from `[05]` to `[05, 06]`, graph-enforcing both terminal T1 wave leaves as prerequisites.
- Task 10 `requires` added `06`, enforcing the orchestration/SKILL.md sequential-edit ordering.

## Rationale

The prose claim "T1 wave completes before T3 wave starts" must be machine-readable in the task graph, not just prose. With only `requires: [05]`, a scheduler or manager could legitimately start Task 07 while Task 06 was still in progress. The strengthened edges close this loophole.

Both 05 AND 06 are required on Task 07's requires because: 05 brings the phase-docs cadence rule and 06 brings the direct-mode opt-out, both of which are T1 surfaces the T3 hook script must respect.

## Consequences

The execution order is now strictly: 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 (with Task 09 optionally before 08 since 09 only depends on 07). No T3 task can begin before both 05 and 06 complete.

## Related

- draft-iter2.md:276 (Task 07 requires), :347 (Task 10 requires), :388 (dep table), :399 (wave-ordering paragraph)
- Ideation LOCK #1 decision
