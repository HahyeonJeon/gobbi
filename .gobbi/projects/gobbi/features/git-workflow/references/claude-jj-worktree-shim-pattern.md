---
name: claude-jj-worktree-shim-pattern
description: Open-source shim plugins that intercept Claude Code git worktree calls and route them to jj workspace equivalents — evidence that the isolation discipline travels at the agent boundary, not the git boundary.
type: references
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [worktree, plugin, shim, claude-code, jj]
title: claude-jj-worktree shim — interception pattern for worktree subcommands
source: https://github.com/jasagiri/claude-jj-worktree
accessed: 2026-05-23
ref_type: code
related: [jj-workspace-isolation-revision-not-branch, claude-code-worktree-isolation-pattern]
---

# claude-jj-worktree shim pattern

## Insight
Open-source plugins (`jasagiri/claude-jj-worktree`, `kawaz/jj-worktree`) implement a shim layer that intercepts Claude Code's `git worktree` calls and routes them to `jj workspace` equivalents. This is a transparent-layer-substitution pattern: the calling surface (`git worktree add`) stays unchanged while the underlying isolation primitive swaps. The plugin's frontmatter pattern is: declaring `--worktree` (or `isolation: worktree`) on the entry point and the shim handles primitive selection.

## Why it applies
The gobbi worktree-first proposal needs to be specified at the right abstraction level. If specified as "git worktree at this path," it locks the implementation. If specified as "isolated working surface per session with branch reference," it leaves room for jj substitution and other future primitives. The shim ecosystem is direct evidence that users do swap underlying primitives without changing the calling discipline — the discipline travels at the Claude Code agent boundary, not at the git boundary.

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
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | External insight: abstraction-layer guidance for the worktree-first spec level |
