---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
loop: planning
feature: session-foundations-bundle-b
topic: T1.g direct-mode opt-out doc home — orchestration/SKILL.md or git/SKILL.md?
outcome: orchestration/SKILL.md row 5.5 footnote (LOCK #5)
---

# T1.g direct-mode opt-out doc home (LOCK #5)

## Context

Ideation Implementation Checklist T1.g specifies documenting the direct-mode opt-out path. Direct mode means the manager skips the worktree creation step (row 5.5) and `worktreePath` remains null. The leader asked where this documentation belongs.

## Question

Where should the direct-mode opt-out be documented?

## Options considered

1. **orchestration/SKILL.md row 5.5 footnote** (recommended) — co-locates the opt-out with the row it opts out of.
2. **git/SKILL.md workflow-mode docs** — alongside the general git workflow-mode documentation. Creates cross-skill indirection; executor reading orchestration/SKILL.md row 5.5 would need to cross-reference git/SKILL.md to find the opt-out.

## User decision

orchestration/SKILL.md row 5.5 footnote confirmed (LOCK #5).

## Opt-out text (per Ideation T1.g)

"If `workflow.git.mode = 'direct'`, row 5.5 is skipped and `worktreePath` remains null."

Co-located with the smoke-test gate (T1.h): `jq '.git.branch' session.json` must match `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` regex when worktree mode is active.

## Implication

Task 06 (`06-direct-mode-opt-out-and-smoke-test`) owns both the footnote and the smoke-test gate. The file home is `orchestration/SKILL.md` row 5.5 footnote. git/SKILL.md gets the general critical-rule qualifier (worktreePath resolution) but NOT the direct-mode opt-out.

## Related

- draft-iter2.md:249 (Task 06 what)
- planning/staging/design/five-locked-decisions.md (LOCK #5)
