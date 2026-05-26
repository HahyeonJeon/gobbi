---
name: manager-context-overflow-with-large-bundle
description: Bundles of ≥8 plan tasks risk manager-context overflow mid-Execution; scope against context budget at Planning time.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [process, orchestration, planning]
domain: process
supersedes: null
superseded_by: null
---

# Bundles with ≥8 plan tasks risk manager-context overflow mid-Execution

## Context
Prior session 2026-05-23-7ea62d36 emergency-stopped mid-Execution at Task 02 iter2 due to manager context overflow. This session resumed Bundle B (10 tasks + iter2 cycles + dual-system evals) and observed the same pressure curve: large per-task subagent reports + ITER cycles + dual-system evals + multiple file reads accumulate quickly. We finished only by aggressive batching (T07+T08 shared executor; pruning Codex evals on small fixes) and trimming reads.

## Decision
Bundles of ≥8 plan tasks should be scoped against the manager's context budget at Planning time. Two levers:
1. **Split the bundle across sessions** when total parallel-spawn weight (estimated tokens × tasks × iter cap × dual-system) exceeds budget.
2. **Adopt single-system evals on small iter2 fixes** (matcher rename, 1-char typo, footnote insertion). Dual-system only for substantive iter1 reviews.

## Rationale
- Iron Law 11: context budget is a real resource; not budgeting for it is "no improvement that games the tool" applied to plan size.
- The emergency-stop is unrecoverable mid-Execution and forces an extra session for resume + Wrap-up (this session itself is proof).
- Dual-system on every iter (including trivial fixes) is the literal example of "metric improvement at high cost" — single-system catches the same issues for small fixes.

## Alternatives considered
- Always plan ≤ 6 tasks. Rejected — sometimes scope demands more, and rigid caps are gaming. Heuristic-based decision is better.
- Spawn-thread the manager (subagent-of-subagent). Rejected — orchestration boundary already says one manager, and parallel state coordination is fraught.

## Consequences
- Planning loop adds a "manager-context-budget" check: estimate budget vs. plan size; if at risk, split.
- Eval-protocol matrix: dual-system on iter1 (high-stakes); optional single-system on iter2 surgical fixes (low-stakes).

## How to recognize next time
- Plan task count ≥ 8 AND projected dual-system × ITER cap > 3 per task.
- Mid-Execution manager context > 80% used before half the tasks are done.

## Corrected approach
At Planning EVALUATION (or Ideation Lock Scope when tasks count is known): if ≥ 8 tasks with ≥ 2-iter ceiling each, route the second half to a follow-up session via backlog entry. If the user insists on single-session, switch iter2+ to single-system eval by default.

## Related
- Prior session HANDOFF (emergency-stop) at `sessions/2026-05-22-7ea62d36-.../HANDOFF.md` (or equivalent path)
- This session's HANDOFF.md (resume + completion)
