---
title: Dependency graph with strict T1→T3 wave ordering
status: accepted
scope: feature
feature: workflow
related:
  - planning/staging/decisions/lock1-wave-ordering-not-graph-enforced.md
  - planning/artifacts/plan.md
---

# Dependency graph — strict T1→T3 wave ordering (LOCK #1)

## Problem

The session-foundations-bundle-b plan bundles two independent feature areas (T1 doc edits and T3 script authoring). The ordering between them is not driven by hard technical dependency (the hook script tolerates pre-T1 session paths via D-3-3-resolver step ii), but by the user's requirement for coherent commit history and simpler audit trail.

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

## File-overlap conflict resolutions

- `orchestration/SKILL.md` touched by Tasks 01, 06, 10: forced sequential via `01→06, 01→10, 06→10`.
- `delegation/SKILL.md` touched by Tasks 04 and 10: forced sequential via `04→10`.
- `preparation/SKILL.md`: Task 03 depends on 02 (cross-skill semantic dependency).

## Validation

The DAG is acyclic (verified by traversal). Topological order: 01, 02, 03, 04, 05, 06, 07, 09, 08, 10 (or 09 and 08 swapped, since 09 depends only on 07 and 08 depends only on 07).

## Open issues

None. LOCK #1 is graph-enforced in iter2 via Fix 2. The prior iter1 gap (Task 07 requires only [05]) is closed.
