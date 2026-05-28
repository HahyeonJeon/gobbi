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

## What happened

A prior session emergency-stopped mid-Execution at Task 02 iter2 due to manager context overflow. This session resumed Bundle B (10 tasks + iter2 cycles + dual-system evals) and observed the same pressure curve: large per-task subagent reports + ITER cycles + dual-system evals + multiple file reads accumulate quickly. We finished only by aggressive batching (T07+T08 shared executor; pruning Codex evals on small fixes) and trimming reads.

The corrective stance: bundles of ≥8 plan tasks should be scoped against the manager's context budget at Planning time. Two levers — split the bundle across sessions when total parallel-spawn weight (estimated tokens × tasks × iter cap × dual-system) exceeds budget, and adopt single-system evals on small iter2 surgical fixes (matcher rename, 1-char typo, footnote insertion) reserving dual-system for substantive iter1 reviews.

## Why it happens

- Iron Law 11: context budget is a real resource; not budgeting for it is "no improvement that games the tool" applied to plan size.
- The emergency-stop is unrecoverable mid-Execution and forces an extra session for resume + Wrap-up (the prior emergency-stop session itself is proof).
- Dual-system on every iter (including trivial surgical fixes) is the literal example of "metric improvement at high cost" — single-system catches the same issues for small fixes.

Alternatives that were considered and rejected:

- Always plan ≤ 6 tasks. Rejected — sometimes scope demands more, and rigid caps are themselves gaming. A heuristic-based decision is better.
- Spawn-thread the manager (subagent-of-subagent). Rejected — the orchestration boundary already says one manager, and parallel state coordination is fraught.

Downstream consequences of the chosen prevention:

- The Planning loop adds a "manager-context-budget" check: estimate budget vs. plan size; if at risk, split.
- Eval-protocol matrix: dual-system on iter1 (high-stakes); optional single-system on iter2 surgical fixes (low-stakes).

## Correct approach

At Planning EVALUATION (or at Ideation Lock Scope, when task count is known): if ≥ 8 tasks with ≥ 2-iter ceiling each, route the second half to a follow-up session via backlog entry. If the user insists on single-session, switch iter2+ to single-system eval by default.

## How to detect

- Plan task count ≥ 8 AND projected dual-system × ITER cap > 3 per task.
- Mid-Execution manager context > 80% used before half the tasks are done.

## Related
- Prior session HANDOFF (emergency-stop) at `sessions/2026-05-22-7ea62d36-.../HANDOFF.md` (or equivalent path)
- This session's HANDOFF.md (resume + completion)
