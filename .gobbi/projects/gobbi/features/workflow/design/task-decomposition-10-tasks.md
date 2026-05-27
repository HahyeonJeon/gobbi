---
name: task-decomposition-10-tasks
description: The session-foundations-bundle-b work is decomposed into 10 medium-granularity tasks organized into T1 doc-edit and T3 script-authoring waves.
type: design
scope: feature
feature: workflow
status: accepted
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, task-decomposition, wave-ordering, execution]
title: 10-task decomposition for session-foundations-bundle-b
related:
  - planning/artifacts/plan.md
  - ideation/artifacts/bundle-b-ideation-pass.md
  - preparation/artifacts/preparation.md
---

# 10-task decomposition — session-foundations-bundle-b

## Context

The session-foundations-bundle-b work joins two areas — the worktree-first session architecture (the T1 doc edits) and the PostToolUse/PostToolUseFailure hook plus its reconstructor (the T3 script authoring). Together they require coordinated edits across 13 files (5 skill docs, 3 skill subdocs, 2 new scripts, 1 JSON config) with non-trivial ordering constraints and a strict wave gate between the T1 and T3 work. The decomposition must keep each task narrow enough for one executor while honoring those ordering constraints. In scope: 10 tasks covering 18 Ideation implementation-checklist anchors. Out of scope: the skill-loading matrix topic (deferred), Codex CI, and two verification-only checklist anchors already staged at Ideation.

## Decision

Decompose the bundle into 10 medium-granularity tasks organized into two strict waves — a T1 doc-edit wave (Tasks 01-06) and a T3 script-authoring wave (Tasks 07-10) — with the T3 wave gated behind completion of the whole T1 wave.

## Approach

10 medium-granularity tasks organized into two strict waves:

**T1 wave (Tasks 01-06):** 6 doc-edit tasks building the worktree-first session architecture scaffold. Each task modifies 1-2 skill files with bounded scope. Dependency chain: 01 (orchestration row 5.5) → 02 (git qualifier) → 03 (preparation rollback) → 04 (gobbi/delegation cross-ref). Tasks 05 and 06 depend on 01/03 and 01 respectively, and both are terminal T1 leaves gating the T3 wave.

**T3 wave (Tasks 07-10):** 4 tasks building the hook+reconstructor system. Strict gate: Tasks 07-10 cannot start until both 05 AND 06 complete (LOCK #1). Task 07 (hook script) and Task 08 (reconstructor) share a single executor delegation (LOCK #2). Task 09 (settings.json) depends only on 07. Task 10 (cross-cutting narrative) depends on 01/04/06/07/08.

## Rationale

Each task carries a `verifies:` block with runnable grep/jq/bash-n commands the executor uses as completion gates; the plan-level gate is all 10 `verifies:` blocks passing, no broken symlinks, and `bash -n` exiting 0 on both new scripts. Choosing 10 narrow tasks over fewer larger ones keeps each task's scope bounded and reduces reviewer confusion on shared-file edits, at the cost of more delegation handoffs. Sequential T1→T3 waves add wall-clock time versus interleaving, but buy coherent commit history and remove interleaving ambiguity on `orchestration/SKILL.md` (touched by both waves).

## Alternatives considered

- **Fewer, larger tasks.** Rejected: larger tasks blur scope per executor and make reviewer attention on shared-file edits harder; the 10-task split keeps each delegation auditable.
- **Interleaved T1/T3 waves.** Rejected: interleaving the doc-edit and script-authoring waves creates ordering ambiguity on the files both touch and produces a less coherent commit history.
- **Splitting the hook (Task 07) and reconstructor (Task 08) across two executors.** Rejected here: Task 08 consumes the jq snippets and stdin contract Task 07 establishes, so a shared-executor delegation (LOCK #2) avoids re-deriving that context — accepting the context-budget risk tracked below.

## Consequences

The execution plan is 10 tasks in two gated waves. Four follow-up items surfaced during decomposition and were carried as separate records rather than blocking the plan:

- `checklists/effort-field-non-canonical-schema.md` — the `effort:` task-YAML field is not in the canonical schema.
- `checklists/task01-t1c-trace-overclaim.md` — Task 01's `traces-to` overclaims an anchor whose edit belongs to Task 02.
- `checklists/dq-anchor-readability.md` / `checklists/dq-anchor-traceability.md` — design-question anchors lack inline expansion for executors.
- `backlogs/lock2-shared-executor-mega-task-risk.md` — the LOCK #2 shared-executor context-budget risk.

## Related

- `design/dependency-graph-strict-wave-ordering.md` — the wave-ordering design this 10-task decomposition sequences against.
- `design/five-locked-decisions.md` — the five locked decisions that bound the decomposition's scope.
- `backlogs/lock2-shared-executor-mega-task-risk.md` — the deferred shared-executor risk surfaced during decomposition.

## Source

Originating session `2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac` (session-foundations-bundle-b planning) — the plan, ideation, and preparation artifacts that produced this decomposition.
