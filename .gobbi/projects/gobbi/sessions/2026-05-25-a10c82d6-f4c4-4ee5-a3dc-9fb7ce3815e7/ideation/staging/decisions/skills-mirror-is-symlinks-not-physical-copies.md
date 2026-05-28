---
date: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
status: accepted
feature: project-memory
mistake-candidate: true
domain: docs-sync
project-scope: true
supersedes: null
superseded_by: null
---

# The .claude/skills ↔ .gobbi/projects/gobbi/skills mirror is SYMLINKS, not physical copies — edits do not double

## What went wrong
The Ideation leader designed the memory-system propagation plan and Principle #13 on the premise that `.claude/skills/...` and `.gobbi/projects/gobbi/skills/...` are **two physical copies**, so "every skill/template edit doubles" (draft-iter1.md §7 intro + §6 P13 procedure). The Codex evaluator flagged it; manager verification confirmed it is FALSE.

## Ground truth (verified 2026-05-25, main tree)
- `.gobbi/projects/gobbi/skills/` = **canonical**: 57 real files, 0 symlinks.
- `.claude/skills/` = **56 symlinks, 0 real files**, each pointing `../../../.gobbi/projects/gobbi/skills/{skill}/...`.
- Therefore editing the canonical `.gobbi/.../skills/X/SKILL.md` is reflected in `.claude/skills/X/SKILL.md` automatically — **one edit, not two**.
- Asymmetry: `gobbi-hook-authoring` exists ONLY in `.gobbi/.../skills/` (canonical) with NO `.claude/skills/` symlink. Unmirrored.
- Phantom skills referenced by the design: `gobbi-install` (a CLI tool on a deprecated branch, not a skill) and `_claude`/`claude` (CLAUDE.md links it but no dir exists).

## Why it happened
The leader conflated two separate facts from mistake `executor-mirror-path-vs-worktree-physical-copy.md`:
1. (TRUE) The `.gobbi/.../skills/` real files are branch-isolated — each worktree has its own copy on its branch, so a worktree executor must edit the worktree-absolute `.gobbi/...` path, not the main tree's.
2. (FALSE inference) ".claude ↔ .gobbi are two physical copies, so edits double." — No: `.claude/skills/` is a symlink layer over the single canonical `.gobbi` file.

That existing mistake's wording ("physical copies on the branch, not symlinks back to the main tree") is about worktree-isolation of the *canonical real files*; it is easily misread as "the mirror doubles edits." It should be clarified/cross-linked so future agents don't repeat the misread.

## How to recognize next time
- Any plan that says "this skill edit must be applied to BOTH .claude and .gobbi copies / edits double / ×2 mirror."
- A propagation count that doubles for the mirror.

## Corrected approach
- Edit the **canonical** file at `<worktree>/.gobbi/projects/gobbi/skills/{skill}/...` (worktree-absolute). The `.claude/skills/{skill}/...` symlink reflects it automatically — do NOT make a second edit.
- For `gobbi-hook-authoring` (and any other canonical-only skill), there is NO `.claude` symlink to update; if a `.claude` view is desired, create the symlink (separate concern).
- Verify with `readlink .claude/skills/{skill}/SKILL.md` and `find .claude/skills -type l | wc -l`.

## Related
- `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` (the misread source — candidate for clarification)
- `learnings/dual-system-cross-mirror-drift-detection.md`
- Codex eval finding MIG-1; Claude eval Must-Preserve item #4 (which got it wrong — anti-groupthink win)
