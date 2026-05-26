---
name: archive-move-on-terminal-model
description: "Replaces the no-delete+no-move in-place archive model with no-delete + move-on-terminal: finished artifacts are moved (never deleted) into archive/{type}/ so active dirs show only live work."
type: design
scope: project
feature: null
status: active
created: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [archive, memory-system, project-memory]
supersedes: null
superseded_by: null
related: []
---

# Archive model: no-delete + move-on-terminal

## Problem

The prior invariant was **no-delete + no-move**: finished artifacts stayed at their original active path forever (status flipped in place), and `archive/` held only small **index pointer** files. Consequence: active directories (`backlogs/`, `design/`, etc.) accumulate every finished item, so the active list never shows only live work. The user flagged this when 7 shipped backlogs remained in `backlogs/` after PR #270.

## Decision (locked 2026-05-25)

Replace the invariant with **no-delete + move-on-terminal**:

1. **no-delete STAYS** — no project-memory file is ever physically deleted. Institutional memory is never destroyed.
2. **no-move is DROPPED** — when an artifact reaches a **terminal state**, its **full file** (frontmatter + body) is **moved** from its active directory into `archive/{type}/{YYYY-MM-DD}-{slug}.md`. The active directory then shows only live work. The move IS the archival; the file lives in `archive/` thereafter.
3. **No separate index** — the retired index-pointer model is gone. `archive/` holds the actual moved files, not pointers. (Reconcile: the 7 backlog index stubs from commit 95a220e become moves.)
4. **Applies to all artifact types** — including mistakes and learnings, but only at their terminal state (see vocabulary). Active artifacts NEVER move.

## Terminal-state vocabulary (what triggers a move)

| Artifact type | Terminal state(s) that trigger a move |
|---|---|
| backlogs | `shipped` / `closed` / `addressed` / `dropped` |
| design | `superseded` |
| decisions | `superseded` |
| plans | `superseded` |
| mistakes | `superseded` only (an active mistake NEVER moves — the trap stays live where agents read it and where `required-mistakes:` paths point) |
| learnings | `superseded` only |
| features | `retired` |
| sessions | closed + user opts to archive (the session dir is large; moving it is opt-in) |
| references | `superseded` |
| rules | `superseded` |

`reviews/` + `reports/` are append-only history — supersession via `status:` frontmatter, move only if the maintainer wants the active dir trimmed.

## Move procedure (Wrap-up, sole writer to project memory)

When an artifact reaches a terminal state:
1. Add archival frontmatter to the file: `archived_at: {YYYY-MM-DD}`, `archive_reason: shipped|closed|addressed|superseded|retired|dropped|abandoned`, and the existing terminal `status:` + (`superseded_by:` | `shipped_in:`) as applicable. Body preserved verbatim.
2. **Move** the file to `.gobbi/projects/{project-name}/archive/{type}/{YYYY-MM-DD}-{slug}.md` (`git mv` to preserve history). `{YYYY-MM-DD}` = the archive date (when the transition happened).
3. **Repoint inbound references**: any `[[slug]]` link, `required-mistakes:` path, `supersedes:`/`superseded_by:` pointer, or prose path that points at the old active path is updated to the archive path. (For mistakes: since only superseded mistakes move, active `required-mistakes:` citations are unaffected; a `superseded_by:` chain that crosses the move is repointed.)
4. Never delete the file; the move preserves it.

## Recovery (reactivating an archived artifact)

Explicit, user-confirmed: `git mv` the file from `archive/{type}/` back to its active directory, flip `status:` back to active/accepted/open, remove `archived_at`/`archive_reason`, repoint references back. No deletion involved.

## Why no-delete stays

Deleting would lose in-tree institutional memory — a recorded mistake's value is that the trap reminder persists in the repo, findable without git archaeology. Move (not delete) keeps every artifact in-tree, just relocated out of the active queue once terminal.

## Blast radius (what this refactor must touch)

- `memorization/templates/archive.md` — full rewrite to this model (was the in-place/index model).
- `wrap-up/SKILL.md` — Delete-semantics (line ~35), the in-place-archive paragraph (~77), the archive-output line (~168), Constraints (~420), and the routing/lifecycle: Wrap-up performs the move on terminal state.
- The per-skill **"Delete semantics"** blocks + **"MUST never delete"** constraints in: ideation, preparation, planning, execution, evaluation, memorization, research, interview, mistake — KEEP "never delete"; replace "updated in place" supersession language with the move-on-terminal model (point to archive.md).
- `memorization/templates/rules.md` + `memorization/templates/decisions.md` — supersession language → move-on-terminal.
- Reconcile the 7 backlog index stubs (commit 95a220e) into moves; migrate currently-terminal artifacts (the 7 shipped backlogs + any `superseded` files) into `archive/`.

## Validation

- After the refactor: `archive/` contains full moved files (not index stubs); active dirs contain only non-terminal artifacts.
- `grep -rn 'no-move\|in-place archive\|index entry' skills/` returns nothing stale (model fully swept).
- `grep -rn 'never delete\|no-delete' skills/` still present everywhere (no-delete preserved).
- The 7 shipped backlogs are no longer in `backlogs/`; they live in `archive/backlogs/` as full files.
- No broken `required-mistakes:` paths (active mistakes unmoved).

## Lessons

Intentionally sparse as of 2026-05-25 — authored at decision time. Deepen after the refactor ships and the move-on-terminal model is exercised across a few sessions.
