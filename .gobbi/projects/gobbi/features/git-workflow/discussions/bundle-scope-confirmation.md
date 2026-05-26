---
name: bundle-scope-confirmation
description: User confirmed T1 (worktree-first with promote-now absorbed) and T3 (agents[] hook) in scope for this session; T2 and Codex CI deferred.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, session-scope, worktree-first, agents-hook]
phase: ideation
---

# Bundle scope confirmation — T1 + T3 in scope; T2 deferred

## Question asked

Scope lock: which of the four candidates (T1 worktree-first, T2 skill-loading discipline, T3 agents[] hook, NEW promote-now commit) should be in scope for this session?

## User answer

Scope locked:
- **T1 — Worktree-first session architecture** with NEW (promote-now commit-on-branch) absorbed: in scope
- **T3 — agents[] PostToolUse hook + reconstructor**: in scope
- **T2 — skill-loading-discipline matrix + Load-Directives validator**: deferred (user raised concern "looks ambiguous"; deferred entirely from this session)
- **Codex CI integration**: deferred
- **Item 2-1 auto-mode silence vs always-ask**: out of scope
- **Chat-mode tiki-taka redesign**: out of scope

## Impact on design

Two Execution tasks ship this session: T1 (with NEW absorbed) and T3. All deferred items are backlogged for future sessions.
