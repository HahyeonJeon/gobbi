---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: git-workflow
design-id: D-2
slug: d-2-qualified-git-rule
status: locked
iter: 2
---

# D-2 — `git/SKILL.md:33` rule: qualify, do not remove

## Decision

Qualify the `git/SKILL.md:33` "always main-tree" session-write rule to read:
> "Use `session.json.git.worktreePath` as the absolute root when set; fall back to main tree when null (direct mode)."

Add an explicit note that transcript paths in `~/.claude/projects/...` are outside both trees and are always main-tree-absolute regardless of mode.

## Rationale

Removing the rule outright would re-open the `codex-eval-session-write-path-nested-in-worktree` failure mode (the inverse failure). Qualifying eliminates the `1829fa3` symlink-gap failure and preserves direct-mode + transcript-path handling.

## Anchored insights

T1-I-1, T1-I-4, T1-I-5.

## Trade-offs considered

- Remove outright — rejected: inverse failure has a documented witness (`codex-eval-session-write-path-nested-in-worktree.md`)

## Validation

`grep -n 'main tree absolute' .claude/skills/delegation/SKILL.md` returns ≤ 1 occurrence, all qualified. `grep -rn 'main tree absolute' .claude/skills/` returns ≤ 1 per file, all qualified.

## Implementation checklist anchor

T1-I-T1.b, T1-I-T1.i

## Source

`rawdata/draft-iter3.md:315-320` (D-2 narrative)
