---
scope: feature
feature: git-workflow
title: Jujutsu jj workspace — revision-anchored isolation primitive for sub-agent dev
source: https://www.joshualyman.com/2026/02/demystifying-jujutsu-jj-workspaces/
type: blog
accessed: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [worktree, jujutsu, prior-art, session-isolation, sub-agent]
related: [claude-code-worktree-isolation-pattern]
---

# Jujutsu jj workspace as session-isolation prior art

## Insight
Jujutsu workspaces are filesystem-independent working copies that share the same `.jj` repo but each have their own working copy — like git worktrees, but anchored to a revision rather than a branch. Critically, the community frames `jj workspace` as "an ideal unit of isolation for sub-agent driven development: spin up one workspace per parallel task, let each agent iterate in its own directory, and merge back through jj's usual revision graph instead of branch-and-merge ceremony." This is a stronger architectural claim than git worktrees alone: the workspace is treated as the *primary* isolation unit, not an optional add-on. Plugin ecosystems already exist (`jj-worktree`, `claude-jj-worktree`) that intercept `git worktree` calls and convert them to `jj workspace` operations.

## Why it applies
T1 declares worktree-first uniform-for-every-session. The closest prior art outside the git ecosystem is jj workspaces — and the framing "one workspace per parallel task" is the exact framing T1 generalizes ("one worktree per session"). Two practical consequences: (a) the design direction is community-validated as the right primitive for sub-agent isolation, not a project-local idiosyncrasy; (b) future evolution to jj is forward-compatible if T1 keeps the abstraction at "isolated working surface per session" rather than "git worktree specifically." The jj framing also suggests an answer to T1's session-memory-survival design question: the underlying repo (`.jj` / `.git`) is the durable layer — if session memory commits to a branch, it lives in the repo, not the working copy, so it survives worktree removal automatically.

## Source
- https://www.joshualyman.com/2026/02/demystifying-jujutsu-jj-workspaces/
- "Demystifying Jujutsu (jj) Workspaces" — Joshua Lyman, accessed 2026-05-23

## Excerpt
> "Unlike git worktrees, they're not tied to a branch — they're tied to a revision… This makes workspaces an ideal unit of isolation for sub-agent driven development: spin up one workspace per parallel task, let each agent iterate in its own directory, and merge back through jj's usual revision graph instead of branch-and-merge ceremony."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-23 | 1b26cf20-677b-498c-8c1b-7d7e971597ac | T1 external insight #3 — cross-VCS prior-art validation that "one isolated working copy per session/sub-agent" is the right primitive |
