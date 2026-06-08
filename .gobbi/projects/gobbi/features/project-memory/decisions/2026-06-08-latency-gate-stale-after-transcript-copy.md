---
name: latency-gate-stale-after-transcript-copy
description: Task 06 latency gate can become stale if task 07 wires transcript copy into session-end.sh — resolved in iter2 by constraining task 07 to MEMORIZATION step only
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [performance, hooks, design-flaw]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Constrain transcript copy to MEMORIZATION step to protect latency gate ordering

## Context

Task 06 (hook latency gate) measures the final `post-tool-use-agents.sh` and `session-end.sh` after tasks 02 and 04. Task 07 (D4 transcript capture docs) said "wire the actual copy into session-end.sh OR the memorization step" — leaving the implementation site as an executor choice. Both evaluator systems flagged this:

- Claude RISK-1 implicit + USAGE-2: task 07 delegates an architectural choice (which component does the copy) to the Executor. The copy site determines retention timing and hook weight.
- Codex STR-001 / PERF-001 (Structure/Performance, High, Confidence 75): if Execution wires D4 transcript copying into `session-end.sh`, the final SessionEnd hook is heavier than the one measured in task 06. The plan can pass task 06 measuring a pre-final hook.

## Decision

Iter2 constrains task 07 to wire the transcript copy into the **MEMORIZATION step only**, not any hook. The task's `what` states this explicitly ("copy manager + subagent .jsonl to sessions/.../transcripts/ in the MEMORIZATION step, NOT in any hook — keeps the hook lean"). Task 06 therefore measures the final hook shape. The plan-level note documents that the hook stays lean per this design constraint.

## Rationale

Keeping the transcript copy in MEMORIZATION (not the hook) is the correct design per the Principle 8 root-cause discipline: the hook's responsibility is telemetry recording; copying multi-MB transcript files on every session-end would inflate hook latency and violate the 500ms p99 gate. MEMORIZATION is the right abstraction because it runs at controlled, intentional points (the MEMORIZATION sub-phase), not on every session-end event. Retention timing (hook = every abort; memorization = only on clean loop) favors MEMORIZATION: an aborted session that never ran MEMORIZATION does not need its transcripts captured.

## Alternatives considered

- Allow either site (executor chooses): rejected — leaves the latency gate potentially measuring a pre-final hook; violates Planning's responsibility to remove "figure-it-out" from Execution.
- Wire into SessionEnd hook: rejected — adds a per-session large-file copy to the hook's hot path; exceeds the 500ms p99 gate at realistic transcript sizes.

## Consequences

Task 07's verify explicitly checks the capture step is in MEMORIZATION, not a hook. Task 06 measures the lean hook post-04. The 500ms gate covers the hook's final shape.

## Related

- `planning/evaluation/iter1/codex/structure.md` — STR-001
- `planning/evaluation/iter1/codex/performance.md` — PERF-001
- `planning/evaluation/iter1/claude/usage.md` — USAGE-2
- `planning/artifacts/task-list.md` — task 06 and task 07 definitions
