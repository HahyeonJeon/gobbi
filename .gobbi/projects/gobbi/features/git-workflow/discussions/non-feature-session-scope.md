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

## Context

Worktree-first was being locked as the session architecture, but its reach was undecided: should it apply only to feature sessions (those tied to a GitHub issue), or to every session including investigation, doc-only, and mistake-promotion sessions that have no issue? The answer determines whether non-feature sessions get a worktree branch at all.

## Question

Should worktree-first apply only to feature sessions, or uniformly to every session?

## Options considered

1. **Feature sessions only** — worktree-first applies when there is a GitHub issue; investigation / doc-only / mistake-promotion sessions run on the main tree as before.
2. **Uniform** — worktree-first applies to every session; non-feature sessions get a session-infrastructure branch with no issue prefix, and direct mode is the opt-out for the rare session that needs the main tree.

## User decision

User chose **uniform**: worktree-first for every session. Direct mode is preserved as the opt-out per Design Decision D-5.

## Implication

Every session boots on a worktree branch. The non-feature branch name `chore/session-{date}-{ssid-short}` (no issue prefix) handles investigation and maintenance sessions. D-5 documents direct mode as the escape hatch for emergency hotfix or read-only sessions.

## Related

- `design/direct-mode-retained-opt-out.md` — Design Decision D-5, the direct-mode opt-out that makes uniform worktree-first safe.
- `design/worktree-create-before-session-stamp.md` — the worktree-creation step (D-1) and the non-feature branch-naming scheme.
