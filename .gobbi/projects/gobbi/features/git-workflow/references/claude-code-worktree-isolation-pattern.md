---
name: claude-code-worktree-isolation-pattern
description: Claude Code's official per-session worktree isolation pattern — the -w flag and isolation:worktree frontmatter as the runtime-recommended primitive.
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [worktree, session-isolation, claude-code, parallel-agents]
title: Claude Code official worktree-isolation pattern (parallel sessions)
source: https://code.claude.com/docs/en/worktrees
accessed: 2026-05-23
ref_type: docs
related: []
---

# Claude Code official worktree-isolation pattern

## Insight
Claude Code natively supports per-session worktree isolation: the `-w` flag spins each session in its own working directory + branch, and subagents can carry `isolation: worktree` in their frontmatter so they are placed in a worktree by default. Edits in one session never touch files in another — worktrees are the official isolation primitive the runtime offers, not a project-side hack.

## Why it applies
The gobbi worktree-first design aligns with the runtime-recommended isolation model. If gobbi declares every session must bootstrap a worktree at Configuration Step 1, it is harmonizing with the runtime's own pattern rather than inventing a project-local discipline. Importantly, the docs also call out a tightly-relevant constraint for the session-memory-survival design question: "Git worktrees isolate your files, but they don't isolate your database, environment variables, or running services" — i.e., the runtime treats worktree isolation as filesystem-only; cross-session state (e.g., session memory) must be addressed separately.

## Source
- https://code.claude.com/docs/en/worktrees
- Claude Code official docs, accessed 2026-05-23

## Excerpt
> "Running each Claude Code session in its own worktree means edits in one session never touch files in another, so you can have Claude building a feature in one terminal while fixing a bug in a second… Git worktrees isolate your files, but they don't isolate your database, environment variables, or running services."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | External insight supporting worktree-first — worktree-first is runtime-aligned; informs session-memory survival design question |
