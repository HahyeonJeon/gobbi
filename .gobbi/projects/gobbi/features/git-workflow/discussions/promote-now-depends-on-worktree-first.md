---
name: promote-now-depends-on-worktree-first
description: User confirmed that the Preparation promote-now commit-on-branch feature depends on worktree-first (T1) and is absorbed into T1's implementation tasks.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, promote-now, worktree-first, dependency]
---

# Promote-now commit-on-branch dependency on worktree-first confirmed

## Context

The session had four candidate items, one of which was a new "Preparation promote-now commit-on-branch" addition. Before scope could be locked, the session needed to know whether that addition was an independent task or a dependent of the worktree-first work — which determines whether it stands alone or is absorbed.

## Question

Is the "Preparation promote-now commit-on-branch" item technically dependent on worktree-first, or can it ship independently?

## Options considered

1. **Dependent on worktree-first, absorbed into it** — promote-now needs a `$worktreePath` to commit to; without worktree-first there is no branch to commit on, so it collapses to a 2-line `git add` + `git commit` addition to `preparation/SKILL.md` once worktree-first is locked.
2. **Independent task** — promote-now ships as its own Execution task standing apart from worktree-first.

## User decision

Confirmed dependent on worktree-first. Without worktree-first there is no `$worktreePath` to commit to, so promote-now is a small addition on top of it rather than a standalone task.

## Implication

The promote-now commit-on-branch feature is absorbed into the worktree-first Execution tasks rather than standing as its own task. It ships as part of the worktree-first session architecture. See `design/promote-now-commit-on-branch.md` for the locked design.

## Related

- `design/promote-now-commit-on-branch.md` — Design Decision D-3, the locked promote-now design.
- `discussions/bundle-scope-confirmation.md` — the scope lock that absorbed promote-now into worktree-first.
