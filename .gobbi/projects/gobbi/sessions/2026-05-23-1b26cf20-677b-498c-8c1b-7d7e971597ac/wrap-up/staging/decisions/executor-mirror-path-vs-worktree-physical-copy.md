---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: accepted
feature: session-foundations-bundle-b
mistake-candidate: true
domain: process
supersedes: null
superseded_by: null
finding-id: WRAP-MIST-001
---

# Worktree-mode executors must edit worktree-internal canonical mirror, not main-tree canonical mirror

## Context
In worktree mode (the canonical mode this session shipped via T1), the worktree's `.gobbi/projects/{project}/skills/...` files are **physical copies on the branch**, not symlinks back to the main tree. Multiple executors this session were briefed with the older guidance "edit the canonical mirror at `.gobbi/projects/...`" without absolute paths, then proceeded to edit the main-tree mirror (because their cwd resolved there) — leaving the worktree branch untouched. Task 03 surfaced this explicitly: the executor reported editing main-tree canonical, then had to revert + re-apply inside the worktree.

## Decision
Worktree-mode delegation prompts MUST specify the canonical path as the **worktree-absolute** path (e.g., `<worktree>/.gobbi/projects/{project}/skills/{skill}/SKILL.md`), not the bare `.gobbi/projects/...` form. The executor's `cd` (or absolute path use) must be inside the worktree.

## Rationale
- The whole point of worktree mode is branch-isolated changes; editing the main-tree copy defeats it.
- The Edit-tool symlink-refusal mistake (`edit-tool-refuses-symlink-canonical-fallback.md`) already pushes executors to the canonical-mirror path — without absolute disambiguation the fallback path is ambiguous between worktree and main tree.
- Reverting + re-applying is fragile; the fix is preventive in the brief.

## Alternatives considered
- Trust the executor to `cd` into the worktree first. Rejected — multiple briefs this session showed executors editing main-tree.
- Add a post-Execution diff-check gate in orchestration. Possible follow-up but does not prevent the wrong edit; only catches it.

## Consequences
- Manager delegation prompts in worktree mode need a "Worktree-canonical paths" block calling out the absolute path.
- Phase-doc per-iter commit cadence rule (T05) is unaffected — it already references `worktreePath`.

## How to recognize next time
- Brief uses bare `.gobbi/projects/...` for an executor without an explicit absolute path or a `cd "$worktreePath"` instruction.
- Executor's verification command reads from main-tree rather than `git -C <worktree> show HEAD:<path>`.

## Corrected approach
Add a "Canonical-mirror paths (worktree-absolute)" subsection to executor briefs in worktree mode, listing every file the executor may touch as `<worktree>/.gobbi/projects/{project}/skills/...`.

## Related
- `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-01/staging/decisions/edit-tool-refuses-symlink-canonical-fallback.md`
- T1 implementation (PR #269)
