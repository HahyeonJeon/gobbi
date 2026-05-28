---
name: session-commit-storage-bounds
description: Per-iteration MEMORIZATION commits add storage to develop's git history; storage estimate accepted with deferred formal budget.
type: decisions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, storage, performance, session-commits]
domain: cost
cost-impact: ~10-50 KB per session added to develop's git history
supersedes: null
superseded_by: null
---

# Session commit / storage bounds — inline estimate accepted, formal budget deferred

## Context

Each loop's MEMORIZATION phase ends with a `git commit` to the worktree branch (Design Decision D-4). These per-iteration session-memory commits accumulate in develop's git history once the worktree branch's PR merges. No formal storage budget was locked during Ideation, so the question was whether the accumulation needs a budget gate before the feature ships.

## Decision

Accept the storage cost at current session cadence and defer a formal storage budget to post-Execution monitoring. The accumulated session-memory data is non-PII operational telemetry; no budget gate blocks the git-workflow feature.

## Rationale

The accumulation is bounded and small. The bounds, confirmed during Planning evaluation, are the accepted estimate:
- Per-iteration session-memory commit: ~10-50 KB per session committed to develop's history.
- Upper bound: `maxIterations × 5 loops = 15 commits per session`.
- No API or infra cost; no cost-runaway scenario — commit count is bounded by Task spawn count and rate-limited by the Claude Code permission system.

At these bounds, the storage cost is acceptable and does not justify the complexity of a formal budget mechanism before there is monitoring evidence that cadence is scaling.

## Alternatives considered

- **Lock a formal storage budget during Ideation** — rejected: premature optimization. With ~10-50 KB per session and no observed cadence pressure, a budget mechanism would add complexity without a witnessed need. Monitoring first, budget only if evidence motivates it.
- **Squash session-memory commits before merge to minimize history footprint** — deferred, not rejected outright: a compaction strategy is the natural response if cadence scales, but it is future work, not a precondition for shipping.

## Consequences

If session cadence scales (e.g., multiple sessions per day, long-running projects), a compaction strategy (squash-merge session dirs, prune old worktree branches) may be needed. This is a future backlog item, not a blocker for the git-workflow feature.

## Related

- `design/per-iteration-session-commit-cadence.md` — Design Decision D-4, the per-iteration commit cadence whose storage cost this decision bounds.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/planning/`
