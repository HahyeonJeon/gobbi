---
name: non-feature-session-scope
description: User confirmed worktree-first applies uniformly to every session, not only feature sessions; direct mode is the opt-out.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, worktree-first, session-scope, non-feature]
---

# Non-feature session scope — worktree-first for every session (uniform)

## Question asked

Should worktree-first apply only to feature sessions (those with a GitHub issue), or uniformly to every session including investigation / doc-only / mistake-promotion sessions?

## User answer

User chose **uniform**: worktree-first for every session. Direct mode preserved as opt-out per Design Decision D-5.

## Impact on design

Every session boots on a worktree branch. The non-feature branch name `chore/session-{date}-{ssid-short}` (no issue prefix) handles investigation and maintenance sessions. D-5 documents direct mode as the escape hatch for emergency hotfix or read-only sessions.
