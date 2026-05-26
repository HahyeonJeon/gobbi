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

Each loop's MEMORIZATION phase ends with a `git commit` to the worktree branch (Design Decision D-4). These per-iteration session-memory commits accumulate in develop's git history. No formal storage budget was locked during Ideation.

## Storage estimate

The following bounds were confirmed during Planning evaluation and are preserved as the accepted estimate:
- Per-iteration session-memory commit: ~10-50 KB per session committed to develop's history
- Upper bound: `maxIterations × 5 loops = 15 commits per session`
- No API or infra cost; no cost-runaway scenario (bounded by Task spawn count, rate-limited by Claude Code permission system)

## Decision

Formal storage budget deferred to post-Execution monitoring. The estimate is non-PII operational telemetry; storage cost is acceptable at current session cadence.

## Consequences

If session cadence scales (e.g., multiple sessions per day, long-running projects), a compaction strategy (squash-merge session dirs, prune old worktree branches) may be needed. This is a future backlog item, not a blocker for the git-workflow feature.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/planning/`
