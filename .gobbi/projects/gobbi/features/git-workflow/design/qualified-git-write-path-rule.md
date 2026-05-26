---
name: qualified-git-write-path-rule
description: The git session-write path rule is qualified to use worktreePath when set, falling back to main tree in direct mode.
type: design
scope: feature
feature: git-workflow
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, session-write-path, worktree-first, direct-mode]
design-id: D-2
---

# D-2 — Qualify the session-write path rule: worktreePath when set, main tree as fallback

## Decision

Qualify the `git/SKILL.md` "always main-tree" session-write rule to read:
> "Use `session.json.git.worktreePath` as the absolute root when set; fall back to main tree when null (direct mode)."

Add an explicit note that transcript paths in `~/.claude/projects/...` are outside both trees and are always main-tree-absolute regardless of mode.

## Rationale

Removing the rule outright would re-open the inverse failure mode where session writes land nested in the worktree rather than rooted correctly (documented as the `codex-eval-session-write-path-nested-in-worktree` mistake). Qualifying the rule eliminates the symlink-gap failure that occurred in commit `1829fa3` while preserving correct handling for direct mode and transcript paths.

## Trade-offs considered

- Remove outright — rejected: inverse failure has a documented witness (`mistakes/codex-eval-session-write-path-nested-in-worktree.md`); removing the rule reopens that failure mode

## Validation

`grep -n 'main tree absolute' .claude/skills/delegation/SKILL.md` returns ≤ 1 occurrence, all qualified. `grep -rn 'main tree absolute' .claude/skills/` returns ≤ 1 per file, all qualified.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/`
