---
name: skills-mirror-symlinks-not-copies
description: "The .claude/skills/ mirror is per-file symlinks into .gobbi/.../skills/, not a second physical copy — one edit reflects automatically, no double edit needed."
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [docs-sync, symlinks, mirror, skills]
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# The .claude/skills mirror is SYMLINKS, not physical copies — one edit, not two

## What happened

The Ideation leader designed the memory-system propagation plan and Principle #13 on the premise that `.claude/skills/...` and `.gobbi/projects/gobbi/skills/...` are **two physical copies**, so "every skill/template edit doubles" (design draft §7 intro + §6 P13 procedure). The Codex evaluator flagged it; manager verification confirmed it is FALSE.

## Ground truth (verified 2026-05-25, main tree)

- `.gobbi/projects/gobbi/skills/` = **canonical**: 57 real files, 0 symlinks.
- `.claude/skills/` = **56 symlinks, 0 real files**, each pointing `../../../.gobbi/projects/gobbi/skills/{skill}/...`.
- Therefore editing the canonical `.gobbi/.../skills/X/SKILL.md` is reflected in `.claude/skills/X/SKILL.md` automatically — **one edit, not two**.
- Asymmetry: `gobbi-hook-authoring` exists ONLY in `.gobbi/.../skills/` (canonical) with NO `.claude/skills/` symlink. Unmirrored.
- Phantom skills referenced in early designs: `gobbi-install` (a CLI tool on a deprecated branch, not a skill dir) and `_claude`/`claude` (CLAUDE.md links it but no dir exists — FLAG-2 follow-up).

## Why it happens

The leader conflated two separate facts from mistake `executor-mirror-path-vs-worktree-physical-copy.md`:

1. (TRUE) The `.gobbi/.../skills/` real files are branch-isolated — each worktree has its own copy on its branch, so a worktree executor must edit the worktree-absolute `.gobbi/...` path, not the main tree's.
2. (FALSE inference) ".claude ↔ .gobbi are two physical copies, so edits double." — No: `.claude/skills/` is a symlink layer over the single canonical `.gobbi` file.

The existing mistake's wording ("physical copies on the branch, not symlinks back to the main tree") is about worktree-isolation of the *canonical real files*; it is easily misread as "the mirror doubles edits." A clarification / cross-link to this mistake is a deferred follow-up.

## How to detect

- Any plan that says "this skill edit must be applied to BOTH .claude and .gobbi copies / edits double / ×2 mirror."
- A propagation count that doubles for the mirror.
- A P13 CRUD plan listing `.claude/skills/X/SKILL.md` as a separate Update line from `.gobbi/.../skills/X/SKILL.md`.

## Correct approach

- Edit the **canonical** file at `<worktree>/.gobbi/projects/gobbi/skills/{skill}/...` (worktree-absolute). The `.claude/skills/{skill}/...` symlink reflects it automatically — do NOT make a second edit.
- For `gobbi-hook-authoring` (and any other canonical-only skill), there is NO `.claude` symlink to update; if a `.claude` view is desired, create the symlink (separate concern).
- Verify with `readlink .claude/skills/{skill}/SKILL.md` and `find .claude/skills -type l | wc -l`.

## Related

- `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` — the misread source; its real lesson is worktree branch-isolation (canonical files are worktree-local), NOT that the `.claude↔.gobbi` mirror doubles edits. Deferred follow-up: clarify/cross-link in W5-T2.
- Codex eval finding MIG-1; Claude eval Must-Preserve item #4 (which got it wrong — anti-groupthink win).
- Session: 2026-05-25-a10c82d6 ideation, staging decision `skills-mirror-is-symlinks-not-physical-copies.md`.
