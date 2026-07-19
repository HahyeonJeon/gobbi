---
name: two-skill-restructure-memory-record
description: Split skills/memorization/ into skills/memory/ (durable tier) + skills/record/ (per-loop capture) with three-surface loader fixup
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [memory, design]
keywords: [skill-restructure, record, symlinks]
author: claude
supersedes: null
superseded_by: null
related: [three-surface-loader-fixup, workflow-memorization-doc-filename-rename, memory-map-split-seam-decision]
---

# Two-skill restructure: skills/memory/ + skills/record/ (D-b + D10)

> **Superseded 2026-07-19 for workflow shape only:** Preparation was retired in v0.5.3. Any Preparation name or old loop ordinal below is historical design evidence, not current execution guidance. The memory/record ownership decisions remain active under the four productive loops.

## Problem
`skills/memorization/` contains both the durable-memory CRUD standard (rules.md, memory-map.md, templates) and the per-loop session-record capture procedure (SKILL.md). These serve different consumers: wrap-up assistant needs the CRUD standard; loop assistants need the capture procedure. Mixing them in one skill dir causes load ambiguity.

## Scope
In: split `skills/memorization/` into `skills/memory/` + `skills/record/`; add thin RECORD sections in loop skills; mirror fixups on three loader surfaces. Out: behavioral changes to memory-CRUD rules (only vocabulary updates).

## Approach

File routing (D-b mapping table):

| Current path | New home | Rationale |
|---|---|---|
| `skills/memorization/SKILL.md` | `skills/record/SKILL.md` | Per-loop RECORD capture procedure |
| `skills/memorization/rules.md` | `skills/memory/rules.md` | Governs durable-memory files |
| `skills/memorization/memory-map.md` | `skills/memory/memory-map.md` | Primary home; session-record rows cross-linked from record/SKILL.md |
| `skills/memorization/templates/` (17 files) | `skills/memory/templates/` | Durable-memory destination schemas |
| `skills/orchestration/workflow/memorization.md` | `skills/orchestration/workflow/record.md` | FILENAME is renamed vocabulary under D5 |

Thin RECORD sections: each loop skill (ideation/preparation/planning/execution/wrap-up) gets a short RECORD section pointing at `skills/record/SKILL.md` — the procedure body lives in one place.

Loader surface fixups (per-surface granularity):
- `.claude/skills/` (per-FILE symlinks): delete 20 `memorization/` links + 1 `workflow/memorization.md` link; create `memory/` + `record/` per-file links + `workflow/record.md` link; edit `settings.json`.
- `.agents/skills/` (DIR-level): delete `memorization` dir-link; create `memory` + `record` dir-links.
- `plugins/gobbi/skills` (whole-dir symlink): no per-skill action.

## Scenarios
- Normal skill load post-split: a manager loads `skills/record/SKILL.md` for RECORD orchestration; a wrap-up assistant loads `skills/memory/SKILL.md` for CRUD standards. Both resolve via their respective loader surfaces.
- Native Codex load: `.agents/skills/memory` and `.agents/skills/record` exist as dir-level symlinks; no broken references.

## Validation
- Both post-split gates pass (see `features/workflow/checklists/codex/post-split-gate-both-required.md`).
- ~190 cross-ref links to `memorization/` updated to their new homes.
- `wrap-up/SKILL.md` cites `memory/templates/` + `memory/rules.md`; per-loop RECORD reference points at `record/SKILL.md`.

## Trade-offs
Creates two skills where one existed, adding one load directive per agent. Mitigated by thin RECORD sections in loop skills (no 5-way procedure drift).

## Open issues
None. D10 is user-locked.
