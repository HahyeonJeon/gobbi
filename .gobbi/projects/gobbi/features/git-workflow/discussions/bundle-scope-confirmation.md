---
name: bundle-scope-confirmation
description: User confirmed worktree-first (with promote-now absorbed) and the agents[] hook in scope for this session; the skill-loading-discipline matrix and Codex CI deferred.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, session-scope, worktree-first, agents-hook]
---

# Bundle scope confirmation — worktree-first + agents[] hook in scope; skill-loading deferred

## Context

The session opened with four candidate work items competing for scope: worktree-first session architecture, a skill-loading-discipline matrix, an agents[] PostToolUse hook, and a new promote-now commit-on-branch addition. Plus two adjacent ideas (auto-mode silence, chat-mode redesign) and a Codex CI integration. The session needed an explicit scope lock before Planning could proceed.

## Question

Which of the candidate items should be in scope for this session?

## Options considered

The candidates on the table:
- **Worktree-first session architecture** — the core proposal; the others depend on or relate to it.
- **Promote-now commit-on-branch (NEW)** — a small addition that depends on worktree-first.
- **agents[] PostToolUse hook + reconstructor** — independent feature work.
- **Skill-loading-discipline matrix + Load-Directives validator** — flagged by the user as "looks ambiguous."
- **Codex CI integration**, **auto-mode silence vs always-ask**, **chat-mode tiki-taka redesign** — adjacent ideas.

## User decision

Scope locked to two Execution deliverables:
- **Worktree-first session architecture**, with the **promote-now commit-on-branch** addition absorbed into it — in scope.
- **agents[] PostToolUse hook + reconstructor** — in scope.

Deferred / out of scope:
- **Skill-loading-discipline matrix + Load-Directives validator** — deferred entirely (the user found it ambiguous).
- **Codex CI integration** — deferred.
- **auto-mode silence vs always-ask** and **chat-mode tiki-taka redesign** — out of scope.

## Implication

Two Execution tasks ship this session: worktree-first (with promote-now absorbed) and the agents[] hook. All deferred items are backlogged for future sessions.

## Related

- `design/worktree-create-before-session-stamp.md` — the worktree-first design (D-1) locked in scope here.
- `discussions/promote-now-depends-on-worktree-first.md` — the discussion that absorbed promote-now into worktree-first.
