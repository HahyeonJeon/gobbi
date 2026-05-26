---
scope: feature
feature: git-workflow
title: claude-jj-worktree shim — interception pattern for worktree subcommands
source: https://github.com/jasagiri/claude-jj-worktree
type: code
accessed: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [worktree, plugin, shim, claude-code, jj]
related: [jj-workspace-isolation-revision-not-branch, claude-code-worktree-isolation-pattern]
---

# claude-jj-worktree shim pattern

## Insight
Open-source plugins (`jasagiri/claude-jj-worktree`, `kawaz/jj-worktree`) implement a shim layer that intercepts Claude Code's `git worktree` calls and routes them to `jj workspace` equivalents. This is a transparent-layer-substitution pattern: the calling surface (`git worktree add`) stays unchanged while the underlying isolation primitive swaps. The plugin's frontmatter pattern is: declaring `--worktree` (or `isolation: worktree`) on the entry point and the shim handles primitive selection.

## Why it applies
T1's worktree-first proposal needs to be specified at the right abstraction level. If specified as "git worktree at this path," it locks the implementation. If specified as "isolated working surface per session with branch reference," it leaves room for jj substitution and other future primitives. The shim ecosystem is direct evidence that users do swap underlying primitives without changing the calling discipline — the discipline travels at the Claude Code agent boundary, not at the git boundary. Locks T1's spec at the right layer.

## Source
- https://github.com/jasagiri/claude-jj-worktree
- https://github.com/kawaz/jj-worktree
- Both repos accessed 2026-05-23

## Excerpt
> "Claude Code plugin: delegates --worktree to Jujutsu (jj) workspaces for parallel session isolation"
> "A shim that redirects git worktree subcommands to jj workspace, enabling Claude Code worktree integration with jj"

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | T1 external insight #4 — abstraction-layer guidance for the T1 spec |
