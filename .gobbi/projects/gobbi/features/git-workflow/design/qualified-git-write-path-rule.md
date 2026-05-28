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

# Qualify the session-write path rule: worktreePath when set, main tree as fallback (D-2)

## Context

`git/SKILL.md` carried an "always main-tree" rule for session writes — every session-memory write resolved against the main tree's absolute root. Under worktree-first this is wrong: when a worktree exists, session writes must root at `worktreePath`, not the main tree, or they land in the wrong tree. But simply deleting the rule would re-open the opposite failure: the documented `codex-eval-session-write-path-nested-in-worktree` mistake, where session writes landed nested inside the worktree instead of rooted correctly. The rule needed qualification, not removal, so it stays correct in both worktree and direct modes (and for transcript paths, which live outside both trees).

## Decision

Qualify the `git/SKILL.md` "always main-tree" session-write rule to read:
> "Use `session.json.git.worktreePath` as the absolute root when set; fall back to main tree when null (direct mode)."

Add an explicit note that transcript paths in `~/.claude/projects/...` are outside both trees and are always main-tree-absolute regardless of mode.

## Rationale

Removing the rule outright would re-open the inverse failure mode where session writes land nested in the worktree rather than rooted correctly (documented as the `codex-eval-session-write-path-nested-in-worktree` mistake). Qualifying the rule eliminates the symlink-gap failure that occurred in commit `1829fa3` while preserving correct handling for direct mode and transcript paths.

## Alternatives considered

- **Remove the "always main-tree" rule outright** — rejected: the inverse failure has a documented witness (`mistakes/codex-eval-session-write-path-nested-in-worktree.md`); removing the rule reopens that failure mode, where session writes land nested in the worktree rather than rooted correctly.

## Consequences

The qualified rule eliminates the symlink-gap failure that occurred during this feature's work (commit `1829fa3`) while preserving correct handling for direct mode (null `worktreePath` → main tree) and for transcript paths in `~/.claude/projects/...` (outside both trees, always main-tree-absolute). Verification: `grep -n 'main tree absolute' .claude/skills/delegation/SKILL.md` returns ≤ 1 occurrence, all qualified; `grep -rn 'main tree absolute' .claude/skills/` returns ≤ 1 per file, all qualified.

## Related

- `discussions/worktree-first-failure-mode-confirm.md` — the cwd-based failure framing this rule addresses.
- `design/worktree-create-before-session-stamp.md` — where `worktreePath` is stamped (D-1), the value this rule resolves against.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/`
