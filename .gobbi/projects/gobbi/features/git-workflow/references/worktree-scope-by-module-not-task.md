---
name: worktree-scope-by-module-not-task
description: Community-validated worktree scoping discipline — scope by module not task, rebase not merge, commit at session boundaries — and the trade-offs of session-granularity worktrees.
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [worktree, scope, commit-discipline, session-isolation]
title: Worktree scope-by-module rule + commit-at-session-boundaries discipline
source: https://www.mindstudio.ai/blog/parallel-agentic-development-claude-code-worktrees
accessed: 2026-05-23
ref_type: blog
related: [claude-code-worktree-isolation-pattern]
---

# Worktree scope-by-module + commit-at-session-boundaries

## Insight
Community-validated practice for parallel Claude Code worktrees codifies three rules: (1) scope worktrees by module rather than task — tasks in the same module share a worktree sequentially, tasks across modules go to parallel worktrees; (2) rebase, not merge, between worktrees so `git log` stays readable for the agent; (3) commit at session boundaries — uncommitted changes are the only state that does not survive a session reset, so keep that state tiny. Two-to-three parallel sessions is the sustainable ceiling.

## Why it applies
The gobbi worktree-first design locks scope at session granularity (one worktree per session, not per module). This reference is the counter-position to that choice — it documents the trade-offs the user is implicitly accepting (more worktrees per feature, higher cognitive load if parallelism grows). Rule (3) "uncommitted changes are the only state that does not survive a session reset" is directly relevant to the session-memory-survival design question: the project's analogue is "session memory directory contents are the only state that does not survive worktree removal" → if session memory lives in the worktree, it must be committed (or mirrored) before worktree removal.

## Source
- https://www.mindstudio.ai/blog/parallel-agentic-development-claude-code-worktrees
- MindStudio, 2026, accessed 2026-05-23

## Excerpt
> "Rule 1: Scope worktrees by module, not by task. Tasks in the same module share a worktree (sequentially)… Rule 3: Commit at session boundaries. Every time a session ends — not every time Claude stops — you commit. Uncommitted changes are the only state that does not survive a session reset. Make that state tiny."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | External insight: informs session-memory-survival design question; "commit at session boundaries" maps directly to the per-iter commit-on-branch step |
