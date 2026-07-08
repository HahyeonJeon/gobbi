---
name: delegation-brief-cited-nonexistent-skill-path
description: Verify every Load-Directives path exists on the current branch before dispatching — a manager's own brief can cite an unmerged skill and reproduce a recorded trap.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-08
session: 14fbc122-d84c-4a16-af52-3a6dc3b1894b
tags: [process, docs-sync]
keywords: [load-directives, pre-dispatch-checklist, claude-skill]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Verify Every Load-Directives Path Exists On The Current Branch Before Dispatching

## Insight

A delegation brief's Load-Directives block must be checked against the CURRENT branch's actual file
tree before it is sent — citing a path that only exists on an unmerged PR silently sends the subagent
to load nothing, with no error surfaced.

## Context

During this session's own delegation-skill overhaul, the manager's executor briefs cited
`skills/claude/SKILL.md` as a mandatory load. That file does not exist on `develop`; it ships only on
the unmerged PR #337. This reproduced, at the MANAGER's own authoring level, the already-recorded
`delegation-briefs-reference-nonexistent-rules-dir` trap (a brief citing a path that does not exist for
this project) — showing the pattern is not confined to templates. A manager can make the identical
mistake by hand while writing a fresh brief.

## Reason

A brief that cites an unresolvable path fails silently: a missing file produces "no content", not an
error, so the subagent proceeds without the skill and the manager has no signal anything went wrong
until a later review catches the gap. Losing this lesson means the same class of failure recurs at the
authoring layer even after the templates that cause the trap in one place are fixed.

## How

Before dispatching any delegation prompt, verify every Load-Directives path with `ls` / `find` against
the worktree the subagent will actually operate in — not against a mental model of "the skill that
should exist by now." This session's Pre-Dispatch Fill Checklist (added to `skills/delegation/SKILL.md`)
is the gate: it requires this check as a fill-time step, not a post-hoc review step.

## Counter-cases

A path that is genuinely being ADDED in the current session's own PR (e.g., a skill this same worktree
is creating) is not stale — verify against the worktree's current state at dispatch time, which includes
the session's own not-yet-committed writes, not only what is merged to the base branch.

## Related

- [`skills/delegation/mistakes.md#delegation-briefs-reference-nonexistent-rules-dir`](../../skills/delegation/mistakes.md#delegation-briefs-reference-nonexistent-rules-dir) — the recorded trap this reproduced at the manager's own authoring level
