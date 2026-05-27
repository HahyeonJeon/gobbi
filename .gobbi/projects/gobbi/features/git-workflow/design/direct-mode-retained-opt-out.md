---
name: direct-mode-retained-opt-out
description: Direct mode is preserved as a documented opt-out from worktree-first; users set settings.git.workflow.mode=direct to bypass worktree creation.
type: design
scope: feature
feature: git-workflow
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, direct-mode, worktree-first, opt-out]
design-id: D-5
---

# Direct mode preserved as documented opt-out (D-5)

## Context

Worktree-first makes every session boot on a worktree branch. The open question was whether worktree-first should be a hard mandate (every session, no exceptions) or a default with an escape hatch. Some sessions — emergency hotfixes, pure read-only investigations — have no need for an isolated worktree, and the prior `direct` workflow mode already supported running directly on the main tree. A mandate would have to either delete direct mode or override it.

## Approach

The worktree creation step in the Configuration procedure carries a guard: `skip if settings.git.workflow.mode == "direct"`. Worktree-first is locked as the **default**, not a **mandate** — the user can set `settings.git.workflow.mode = "direct"` to bypass worktree creation, leaving `worktreePath` null and the session running on the main tree. Direct mode is thus preserved as a documented escape hatch rather than removed.

## Rationale

Steel-man analysis of the worktree-first mandate surfaced "emergency hotfix / pure read-only" sessions as legitimate use cases for direct mode. Removing direct mode would be a scope expansion beyond the user-locked decision; the user confirmed uniform worktree-first as the default *while preserving the opt-out*. Keeping the existing `direct` mode as the bypass costs nothing — it is already implemented — and avoids forcing worktree overhead onto sessions that do not benefit from it.

## Alternatives considered

- **Make worktree-first a hard mandate and remove direct mode** — rejected: scope expansion beyond what the user locked, and it strands legitimate emergency-hotfix / read-only sessions that have no need for an isolated worktree.
- **Make worktree-first a mandate but keep direct mode dormant/undocumented** — rejected: an undocumented bypass is a trap; if the opt-out exists it must be discoverable at the step it opts out of.

## Consequences

The worktree creation step in `orchestration/SKILL.md` Configuration Step 1 must carry the `skip if … mode == "direct"` guard (no code change beyond confirming the guard is present). `orchestration/SKILL.md` and `git/SKILL.md` must reference `settings.git.workflow.mode` identically — grep both files for `workflow.mode` to confirm matching references. The direct-mode opt-out text is documented at the worktree-creation step footnote (see `discussions/2026-05-24-direct-mode-opt-out-doc-home.md`).

## Related

- `discussions/non-feature-session-scope.md` — the discussion that locked uniform worktree-first with direct mode as the opt-out.
- `discussions/2026-05-24-direct-mode-opt-out-doc-home.md` — where the opt-out text is documented.
- `design/worktree-create-before-session-stamp.md` — the worktree-creation step (D-1) this guard attaches to.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/`
