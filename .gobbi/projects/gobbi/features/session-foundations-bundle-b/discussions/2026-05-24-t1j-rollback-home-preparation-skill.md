---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
loop: planning
feature: session-foundations-bundle-b
topic: T1.j rollback semantics doc home — preparation/SKILL.md or git/SKILL.md?
outcome: preparation/SKILL.md, co-located with narrow-exception text (LOCK #4)
---

# T1.j rollback semantics doc home (LOCK #4)

## Context

Ideation Implementation Checklist T1.j specifies rollback semantics for a failed `generate-now` promote-now commit. The leader asked where these semantics should live — co-located with the promote-now procedure in `preparation/SKILL.md`, or in `git/SKILL.md` alongside the general git discipline.

## Question

Where should the T1.j rollback semantics documentation live?

## Options considered

1. **preparation/SKILL.md** (recommended) — co-located with the narrow-exception text describing the promote-now procedure. Preserves single-source-of-truth.
2. **git/SKILL.md** — alongside the general git critical-rule paragraph. Creates cross-skill indirection.

## User decision

preparation/SKILL.md confirmed (LOCK #4). Rollback semantics live co-located with the narrow-exception text.

## Rollback sequence (per Ideation:283)

1. `git commit` fails post-copy
2. Manager: `git -C "$worktreePath" rm <copied-paths>` — removes the copied skill file
3. AskUserQuestion: surface failure to user
4. Re-attempt or abort per user response

**Critical**: rollback REMOVES the copied file (NOT `git checkout`). The file did not pre-exist in the worktree before the promote-now operation. git checkout would fail or restore to HEAD (which has no version of this file). Removal is the only correct recovery.

## Implication

Task 03 (`03-preparation-generate-now-commit-on-branch`) owns both the promote-now path and the rollback semantics. The executor brief for Task 03 MUST cite Ideation:283 verbatim (Iron Law 7 procedural mandate).

## Related

- draft-iter2.md:173 (Task 03 what)
- planning/staging/decisions/rollback-semantics-drift-from-ideation.md
- Ideation iter3 draft line 283
