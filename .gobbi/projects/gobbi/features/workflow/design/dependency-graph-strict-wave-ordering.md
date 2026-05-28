---
name: dependency-graph-strict-wave-ordering
description: The 10-task plan enforces T1→T3 wave ordering via explicit dependency graph edges, not prose-only guidance.
type: design
scope: feature
feature: workflow
status: accepted
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, dependency-graph, wave-ordering, lock1]
title: Dependency graph with strict T1→T3 wave ordering
related:
  - planning/staging/decisions/lock1-wave-ordering-not-graph-enforced.md
  - planning/artifacts/plan.md
---

# Dependency graph — strict T1→T3 wave ordering (LOCK #1)

## Context

The session-foundations-bundle-b plan bundles two independent feature areas (the T1 doc-edit wave and the T3 script-authoring wave). The ordering between them is not driven by hard technical dependency — the hook script tolerates pre-T1 session paths via the resolver's fallback step — but by the user's requirement for coherent commit history and a simpler audit trail. The first plan draft expressed that ordering in prose only: Task 07 (the first T3 task) listed only `requires: [05]`, which would have let the other terminal T1 task (06) run in parallel with or after Task 07, violating the stated wave gate.

## Decision

Express the T1→T3 wave gate as explicit dependency-graph edges, not prose-only guidance: both terminal T1 leaves (Tasks 05 and 06) are made hard prerequisites of Task 07 (`05 → 07` AND `06 → 07`), so no T3 task can begin until the whole T1 wave is complete.

## Approach

Strict wave ordering, graph-enforced:

```
T1 wave (01 → 02 → 03 → 04 → 05 → 06):
  01 (orchestration row 5.5)
  ├── 02 (git qualifier)
  │   ├── 03 (preparation rollback)
  │   │   └── 05 (5 phase docs) ────────────────→ 07 (LOCK #1 gate)
  │   └── 04 (gobbi/delegation cross-ref) ─→ 10
  └── 06 (direct-mode + smoke-test) ──────────→ 07 (LOCK #1 gate)
                                                   └── 10

T3 wave (07 → {08, 09, 10}):
  07 (hook script) [gated: requires [05, 06]]
  ├── 08 (reconstructor) → 10
  ├── 09 (settings.json)
  └── 10 (row 6 + delegation headers)
```

Both terminal T1 leaves (05 and 06) must complete before Task 07 begins. This is the machine-readable expression of LOCK #1.

## Rationale

The prose claim "the T1 wave completes before the T3 wave starts" must be machine-readable in the task graph, not just narrated. With only `requires: [05]`, a scheduler or manager could legitimately start Task 07 while Task 06 was still in progress. Both 05 AND 06 are required because 05 brings the phase-docs cadence rule and 06 brings the direct-mode opt-out — both T1 surfaces the T3 hook script must respect. File-overlap conflicts are resolved by the same graph mechanism:

- `orchestration/SKILL.md` touched by Tasks 01, 06, 10: forced sequential via `01→06, 01→10, 06→10`.
- `delegation/SKILL.md` touched by Tasks 04 and 10: forced sequential via `04→10`.
- `preparation/SKILL.md`: Task 03 depends on 02 (cross-skill semantic dependency).

## Alternatives considered

- **Prose-only ordering guidance.** Rejected: a prose claim that the T1 wave precedes T3 is not enforced by the graph; the original `requires: [05]` form let Task 06 race Task 07. Prose ordering is advisory, not a gate.
- **A single terminal-leaf prerequisite (05 only).** Rejected: 05 alone does not capture the direct-mode opt-out brought by Task 06, which the hook script depends on; both terminal leaves must gate the T3 wave.

## Consequences

The DAG is acyclic (verified by traversal). The topological order is 01, 02, 03, 04, 05, 06, 07, 09, 08, 10 (09 and 08 are interchangeable, since each depends only on 07). The wave gate is now graph-enforced rather than prose-only; the earlier loophole (Task 07 requiring only `[05]`) is closed.

## Related

- `decisions/2026-05-24-lock1-wave-ordering-not-graph-enforced.md` — the decision record that added these dependency edges.
- `design/task-decomposition-10-tasks.md` — the 10-task decomposition this graph orders.
