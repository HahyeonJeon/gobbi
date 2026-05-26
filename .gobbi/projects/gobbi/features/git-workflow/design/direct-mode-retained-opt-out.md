---
name: direct-mode-retained-opt-out
description: Direct mode is preserved as a documented opt-out from worktree-first; users set git.workflow.mode=direct to bypass worktree creation.
type: design
scope: feature
feature: git-workflow
status: locked
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, direct-mode, worktree-first, opt-out]
design-id: D-5
---

# D-5 — Direct mode preserved as documented opt-out

## Decision

The worktree creation step in the Configuration procedure includes a guard: `skip if session.json.git.workflow.mode == "direct"`. Direct mode is preserved as a documented escape hatch.

The Scope Contract locks worktree-first as the **default**, not a **mandate**. The user can configure `settings.git.workflow.mode = "direct"` to bypass worktree creation.

## Rationale

Steel-man analysis of the worktree-first mandate surfaced "emergency hotfix / pure read-only" sessions as legitimate use cases for direct mode. Removing direct mode would be a scope expansion beyond the user-locked decision (user confirmed uniform worktree-first as default while preserving the opt-out).

## Validation

`orchestration/SKILL.md` and `git/SKILL.md` reference `settings.git.workflow.mode` identically. Grep both files for `workflow.mode` to confirm matching references.

## Implementation note

No code change required for this decision — the guard must be confirmed present in the worktree creation step. See `orchestration/SKILL.md` Configuration Step 1 for the current row placement.

## Source

Full session context at `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/`
