---
name: codex-rollout-session-id-correlation
description: Robust gobbi-session ↔ codex-rollout correlation via a session_id stamp — current cwd+mtime heuristic can miss or over-count codex token usage
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [codex, metadata, tokensUsed, correlation, follow-up]
priority: medium
disposition: open
project-scope: true
shipped_in: null
---

# Robust gobbi-session ↔ codex-rollout correlation via session_id stamp

## Context

Documented by the exec-fix-codex-erasure executor in
`execution/task-03/artifacts/revise-codex-erasure.md` (§ Correlation limitation). SessionEnd's
`capture_codex_total()` matches codex rollouts to the gobbi session by `mtime ∈ [startedAt ..
now]` AND `session_meta.payload.cwd ∈ {worktree, main tree}`, then sums each rollout's LAST
`token_count`. This cwd+mtime correlation can **miss** a Codex run launched from an unrelated
dir, or **over-count** if two gobbi sessions share one worktree at the same wall-clock time.

## Why deferred

The preserve-on-empty fallback (reconciler change 1a: `usage.codex.total` is overwritten only
when a codex source is supplied, otherwise preserved) keeps the system safe meanwhile — a
mis-correlation cannot silently zero a previously-correct value. Surfaced as a non-blocking
documented follow-up; the Execution eval did not gate on it.

## When to pick up

When codex token telemetry accuracy matters (e.g., per-session cost accounting), or when
concurrent same-worktree sessions become common.

## Suggested approach

Stamp the gobbi session_id into the Codex run (env var / originator field) at spawn time, and
match rollouts by that stamp instead of cwd+mtime. The robust fix removes the heuristic entirely.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/` — Execution task-03 revise (codex-erasure fix), documented concern.
