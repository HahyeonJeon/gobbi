---
title: 10-task decomposition for session-foundations-bundle-b
status: accepted
feature: session-foundations-bundle-b
related:
  - planning/artifacts/plan.md
  - ideation/artifacts/bundle-b-ideation-pass.md
  - preparation/artifacts/preparation.md
---

# 10-task decomposition — session-foundations-bundle-b

## Problem

The T1 (worktree-first session architecture) + T3 (PostToolUse/PostToolUseFailure hook + reconstructor) bundle from `session-foundations-bundle-b` requires coordinated edits across 13 files (5 skill docs, 3 skill subdocs, 2 new scripts, 1 JSON config) with non-trivial ordering constraints and a strict wave gate between T1 and T3 work.

## Scope

In-scope: 10 tasks covering 18 Ideation implementation checklist anchors (T1.a-T1.j + T3.a-T3.h). Out-of-scope: T2 (deferred), Codex CI, T3.f and T3.h (verification-only — already staged at Ideation).

## Approach

10 medium-granularity tasks organized into two strict waves:

**T1 wave (Tasks 01-06):** 6 doc-edit tasks building the worktree-first session architecture scaffold. Each task modifies 1-2 skill files with bounded scope. Dependency chain: 01 (orchestration row 5.5) → 02 (git qualifier) → 03 (preparation rollback) → 04 (gobbi/delegation cross-ref). Tasks 05 and 06 depend on 01/03 and 01 respectively, and both are terminal T1 leaves gating the T3 wave.

**T3 wave (Tasks 07-10):** 4 tasks building the hook+reconstructor system. Strict gate: Tasks 07-10 cannot start until both 05 AND 06 complete (LOCK #1). Task 07 (hook script) and Task 08 (reconstructor) share a single executor delegation (LOCK #2). Task 09 (settings.json) depends only on 07. Task 10 (cross-cutting narrative) depends on 01/04/06/07/08.

## Validation

Each task carries a `verifies:` block with runnable grep/jq/bash-n commands the executor uses as completion gates. The plan-level gate is: all 10 `verifies:` blocks pass + no broken symlinks + `bash -n` exits 0 on both new scripts.

## Trade-offs

- **10 tasks vs. fewer larger tasks**: 10 preserves bounded scope per task and reduces reviewer confusion on shared-file edits. The trade-off is more delegation handoffs.
- **LOCK #2 shared executor**: preserves jq snippet context across Task 07 and Task 08 at the cost of a large combined delegation. See assumption_risk staging for the context-budget risk.
- **Sequential T1→T3 waves**: adds wall-clock time vs. interleaving, but provides coherent commit history and avoids interleaving ambiguity on `orchestration/SKILL.md` (touched by both waves).

## Open issues

- `effort:` field is non-canonical (checklist_gap staged separately)
- Task 01 `traces-to` T1.c overclaim (checklist_gap staged separately)
- D-ref codes lack inline expansion for executors (checklist_gap staged separately)
- LOCK #2 context-budget risk (assumption_risk staged separately)
