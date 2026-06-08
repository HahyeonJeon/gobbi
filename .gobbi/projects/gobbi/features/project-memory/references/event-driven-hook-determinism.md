---
name: event-driven-hook-determinism
description: Event-driven hooks fire deterministically per event, fire-and-forget, and must be idempotent + non-blocking; end-of-session state needs an end-of-session event.
type: references
scope: feature
feature: project-memory
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [hooks, determinism, idempotency, metadata, session-end]
title: Git Hooks documentation + determinism guidance
source: https://git-scm.com/docs/githooks
accessed: 2026-06-08
ref_type: docs
---

# Git Hooks documentation + determinism guidance

## Insight
Event-driven hooks run deterministically at a fixed event point, are fire-and-forget, and must be idempotent and non-blocking. A single hook fire only sees the state available at its event — end-of-session rollups require an end-of-session event, not a mid-stream one.

## Related
- design decision D5 (hook-only deterministic metadata + SessionEnd/Stop manager rollup)
- internal insight I3 (manager tokens unsummable until the main transcript stops growing)

## Why it applies
D5 makes metadata recording hook-only and deterministic. The PostToolUse hook can write real per-subagent tokens because the subagent transcript is complete at that event. But the manager's own total cannot be summed until the main transcript stops growing — so the design needs a SessionEnd/Stop hook for the manager rollup + `usage.sessionTotal`. The hook must stay idempotent and never block, consistent with the existing `post-tool-use-agents.sh` "always exit 0" invariant.

## Source
- https://git-scm.com/docs/githooks
- https://www.atlassian.com/git/tutorials/git-hooks

## Excerpt
Native git metadata tools (Gerrit NoteDb, gittuf) store state in native structures and reconcile deterministically rather than trusting a single fire — the reconcile-at-checkpoint pattern as a safety net.
