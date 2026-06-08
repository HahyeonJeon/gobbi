---
name: resolver-maxdepth-misses-worktree-session-json
description: PostToolUse resolver `find -maxdepth 8` cannot reach the depth-11 worktree session.json from a main-tree cwd — the seed silently no-ops (SessionEnd backfills)
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, metadata, resolver, worktree, follow-up]
priority: medium
disposition: open
project-scope: true
shipped_in: null
---

# Resolver maxdepth-8 cannot reach the depth-11 worktree session.json

## Context

Execution EVALUATION finding F-STR-1 (Claude Structure, design_flaw, Medium/90). The
PostToolUse hook's session.json resolver (`post-tool-use-agents.sh:108`, `find "$r" -maxdepth 8`)
searches three roots (`$cwd`, `$CLAUDE_PROJECT_DIR`, `git rev-parse --show-toplevel`). This
worktree's live session.json is at depth 11 from the repo root. If the hook fires with a
main-tree cwd — the exact scenario the rewrite's own comment says it fixes — all three roots
collapse to the repo root and maxdepth-8 misses the depth-11 worktree copy, so the resolver
bails and the PostToolUse seed silently no-ops.

## Why deferred

Non-blocking and not data-loss-fatal: SessionEnd is the authoritative writer and backfills the
telemetry; the always-worktree model means cwd is normally the worktree. Surfaced by the eval
as a constructive follow-up (no REVISE gate). Coupled with F-RISK-1 — see
`resolver-disambiguation-heuristic-bail.md`; remediate the two resolver edges together.

## When to pick up

Any session that touches the metadata-recording hooks, or when a session's PostToolUse seed is
observed to silently never record. Pair with F-RISK-1.

## Suggested approach

Raise `-maxdepth` to cover the worktree session-dir depth (≥ 11), OR resolve the worktree path
deterministically from `git.worktreePath` in session.json rather than a bounded `find`. Add a
fixture that fires the hook with a main-tree cwd and asserts the depth-11 worktree session.json
is found.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-08-c7673705-2d69-4be8-9bd4-436c3eb91be2/` — Execution eval iter1 (Claude Structure).
