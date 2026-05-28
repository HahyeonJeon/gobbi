---
name: promote-now-rollback-doc-home
description: User confirmed the promote-now rollback semantics live in preparation/SKILL.md co-located with the narrow-exception text, not in git/SKILL.md.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, promote-now, rollback, preparation-skill]
topic: promote-now rollback semantics doc home — preparation/SKILL.md or git/SKILL.md?
outcome: preparation/SKILL.md, co-located with narrow-exception text
---

# Promote-now rollback semantics doc home

## Context

Design Decision D-3 (commit-on-branch for Preparation promote-now) includes a partial-failure rollback: if `git commit` fails post-copy, the manager must remove the copied skill file. The question was where to document this rollback sequence.

## Question

Where should the promote-now rollback semantics live?

## Options considered

1. **preparation/SKILL.md** (recommended) — co-located with the narrow-exception text describing the promote-now procedure. Preserves single-source-of-truth.
2. **git/SKILL.md** — alongside the general git critical-rule paragraph. Creates cross-skill indirection.

## User decision

`preparation/SKILL.md` confirmed. Rollback semantics live co-located with the narrow-exception promote-now text.

## Rollback sequence

1. `git commit` fails post-copy
2. Manager: `git -C "$worktreePath" rm <copied-paths>` — removes the copied skill file
3. Surface failure to user via AskUserQuestion
4. Re-attempt or abort per user response

**Critical**: rollback REMOVES the copied file (NOT `git checkout`). The file did not pre-exist in the worktree before the promote-now operation. `git checkout` would fail or restore to HEAD, which has no version of this file. Removal is the only correct recovery. See `decisions/2026-05-24-rollback-semantics-drift-from-ideation.md` for the formal decision record.

## Implication

The Execution task implementing the promote-now commit-on-branch owns both the promote-now path and the rollback semantics documentation in `preparation/SKILL.md`.

## Related

- `decisions/2026-05-24-rollback-semantics-drift-from-ideation.md` — the formal decision record for the `git rm` (not `git checkout`) rollback.
- `design/promote-now-commit-on-branch.md` — Design Decision D-3, the commit-on-branch path whose rollback this discussion places.
