---
name: edit-tool-refuses-symlink-paths
description: Edit tool refuses to write through symlink paths; always use the canonical worktree-absolute path for Edit operations on skill files.
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [process, symlinks, skills, tools]
domain: process
supersedes: null
superseded_by: null
---

# Edit Tool Refuses Symlink Paths — Use Canonical Path

## What happened

During Task 01 Execution, the executor attempted to edit `.claude/skills/orchestration/SKILL.md` (a symlink) using the Edit tool. The tool refused with "Refusing to write through symlink". The executor fell back to the canonical target path `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` and the edit succeeded.

The Preparation iter3 edit contract states "Edit tool default = safe via either path" — this claim is empirically FALSE in this Claude Code environment.

## Why it happens

The edit contract assumed the Edit tool would follow symlinks transparently. It does not — it refuses to write through symlink paths. The canonical path (the actual target of the symlink) is the correct path for Edit operations.

## Correct approach

Always use the canonical mirror path (`.gobbi/projects/{project-name}/skills/{skill-path}`) for Edit tool operations on skill files, not the symlink path (`.claude/skills/{skill-path}`). The symlink remains valid for reads; only Edit/Write require the canonical path.

Specific correction for the edit contract doc: amend point 1 of the safety table to read: "Edit tool may refuse symlink paths; canonical path (`.gobbi/projects/{project-name}/skills/...`) is the always-safe fallback."

## How to detect

Trigger signals:
- Edit tool returns "Refusing to write through symlink" when targeting a path under `.claude/skills/`
- The task involves editing a skill file via its `.claude/` mirror path rather than the canonical `.gobbi/projects/.../skills/` path
- The edit contract is being followed and names `.claude/` path as the safe default

## Related

- `execution/task-01/evaluation/iter1/claude/overall.md` — finding O-001
- Preparation iter3 edit contract (safety-table point 1) — the doc that needs updating
- Task 01 executor report: "Edit tool refused `.claude/skills/orchestration/SKILL.md` symlink; used canonical path instead"
