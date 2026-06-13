---
name: three-surface-loader-fixup
description: Skill-dir split must re-create loader symlinks on three surfaces with different granularities
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [skill-restructure, runtime-break, codex, symlinks]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Skill-dir split requires three-surface loader fixup with different granularities

## Context
The `skills/memorization/` split into `skills/memory/` + `skills/record/` has a real runtime-break surface. Three loader surfaces exist, each with different symlink granularity: (1) `.claude/skills/memorization` is a dir of 20 per-FILE symlinks; (2) `.agents/skills/memorization` is a single DIR-level symlink (the native Codex in-repo skill entry point per `AGENTS.md:5`); (3) `plugins/gobbi/skills` is a whole-`skills/`-dir symlink (auto-follows). Removing `skills/memorization/` without creating the new links on all three surfaces breaks skill loading.

## Decision
Per-surface fixup required:
- `.claude/skills/`: delete the 20 `memorization/` per-file links + the `workflow/memorization.md` link; create `memory/` + `record/` per-file links + a `workflow/record.md` link; edit `.claude/settings.json:19` `Skill(memorization)` → `Skill(memory)` + `Skill(record)`.
- `.agents/skills/`: delete the `memorization` dir-link; create `memory` + `record` dir-links. The `workflow/record.md` rename auto-follows because `.agents/skills/orchestration` is a dir-level link.
- `plugins/gobbi/skills`: NO per-skill action — whole-dir symlink auto-follows every rename.
- Prose: plugin.json, marketplace.json, `.codex/AGENTS.md` need vocabulary updates.

## Rationale
INT-1 (tool-verified): three-surface granularity confirmed by `readlink`. `.agents/skills/memorization` is the documented native Codex entry point — omitting it leaves Codex unable to load `memory/` or `record/` after the split.

## Alternatives considered
- Only fix `.claude/skills/` (rejected: native Codex in-repo runs off `.agents/skills/` and would break).
- Fix `.codex/config.toml` (not needed: has no Skill-permission analog).

## Consequences
Two post-split gates are BOTH required: (a) no-broken-symlink gate `find -L . -type l` — proves remaining links resolve; (b) presence gate — proves new `.agents/skills/{memory,record}`, `.claude/skills/{memory,record}/`, `Skill(memory)` + `Skill(record)`, and `workflow/record.md` entries EXIST. Gate (a) alone does NOT prove the new links were created.

## Related
- Success criterion 4 (both gates required)
- `evaluation/iter1/codex/project.md` (codex-ideation-project-001)
- `evaluation/iter1/codex/structure.md` (codex-ideation-structure-001)
