---
name: executor-mirror-path-vs-worktree-physical-copy
description: Worktree canonical files (skills/, agents/) are branch-isolated copies on the worktree branch — executors MUST use the worktree-absolute path to edit them; bare `.gobbi/projects/...` resolves to the main tree.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [process, worktree, execution]
domain: process
supersedes: null
superseded_by: null
---

# Worktree canonical files are branch-isolated — always use the worktree-absolute path

When a worktree is checked out, `git` materializes the branch into the worktree directory. The canonical `.gobbi/projects/{project}/skills/` and `agents/` files are **branch-isolated copies on the worktree's branch** — they are NOT shared with the main tree. If an executor edits the bare path `.gobbi/projects/...` from a cwd that resolves to the main tree, the worktree branch remains untouched. The executor must use the **worktree-absolute path** (e.g., `<worktree-root>/.gobbi/projects/{project}/skills/{skill}/SKILL.md`) for every file touched in a worktree session.

> **Separate concern:** the `.claude/skills/` mirror is per-file SYMLINKS into the canonical `.gobbi/.../skills/` tree (not physical copies). One edit to the canonical file reflects through the symlink automatically — no double edit needed. See `mistakes/skills-mirror-symlinks-not-copies.md` for that distinct concern.

## What happened

In worktree mode (the canonical mode this session shipped via T1), the worktree's `.gobbi/projects/{project}/skills/...` files are **branch-isolated physical copies on the worktree branch** — each worktree checkout materializes its own copy of these files on its branch, not symlinks back to the main tree. Multiple executors this session were briefed with the older guidance "edit the canonical mirror at `.gobbi/projects/...`" without absolute paths, then proceeded to edit the main-tree copy (because their cwd resolved there) — leaving the worktree branch untouched. Task 03 surfaced this explicitly: the executor reported editing main-tree canonical, then had to revert + re-apply inside the worktree.

The corrective stance: worktree-mode delegation prompts MUST specify the canonical path as the **worktree-absolute** path (e.g., `<worktree>/.gobbi/projects/{project}/skills/{skill}/SKILL.md`), not the bare `.gobbi/projects/...` form. The executor's `cd` (or absolute path use) must be inside the worktree.

## Why it happens

- The whole point of worktree mode is branch-isolated changes; editing the main-tree copy defeats it, so a bare-path edit silently subverts the worktree's purpose.
- The Edit-tool symlink-refusal mistake (`edit-tool-refuses-symlink-paths.md`) already pushes executors to the canonical-mirror path — without absolute disambiguation the fallback path is ambiguous between worktree and main tree.
- Reverting + re-applying after the fact is fragile; the only durable fix is preventive in the brief itself.

Alternatives that were considered and rejected:

- Trust the executor to `cd` into the worktree first. Rejected — multiple briefs this session showed executors editing main-tree even when told to `cd`.
- Add a post-Execution diff-check gate in orchestration. Possible follow-up but does not prevent the wrong edit; only catches it.

Downstream consequences of the chosen prevention:

- Manager delegation prompts in worktree mode need a "Worktree-canonical paths" block calling out the absolute path.
- The phase-doc per-iter commit cadence rule (T05) is unaffected — it already references `worktreePath`.

## Correct approach

Add a "Canonical-mirror paths (worktree-absolute)" subsection to executor briefs in worktree mode, listing every file the executor may touch as `<worktree>/.gobbi/projects/{project}/skills/...`. Executors should use absolute paths throughout — never bare `.gobbi/projects/...` in a worktree session.

## How to detect

- Brief uses bare `.gobbi/projects/...` for an executor without an explicit absolute path or a `cd "$worktreePath"` instruction.
- Executor's verification command reads from main-tree rather than `git -C <worktree> show HEAD:<path>`.
- An executor reports "edited `.gobbi/projects/...`" without an absolute worktree prefix.

## Related

- `mistakes/skills-mirror-symlinks-not-copies.md` — the `.claude/skills/` mirror is symlinks, not physical copies; editing the canonical file reflects automatically. That is a SEPARATE concern from worktree branch-isolation described here.
- `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-01/staging/decisions/edit-tool-refuses-symlink-canonical-fallback.md`
- T1 implementation (PR #269)
