---
name: two-skill-hybrid-d10
description: User selected the 2-skill hybrid (skills/memory/ + skills/record/ + thin loop-skill RECORD sections) over leader's alternatives
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [design]
keywords: [skill-restructure, locked]
author: claude
outcome: D10 two skills — skills/memory/ (durable tier) + skills/record/ (capture procedure) + thin RECORD sections in loop skills
---

# 2-skill hybrid: D10 — skills/memory/ + skills/record/ + thin loop-skill RECORD sections

## Context
The leader proposed three options for how to restructure `skills/memorization/`: (A) one `skills/memory/` skill with the capture procedure as a section; (B) three skills (memory + record + a thin router); (C) two skills + thin loop-skill RECORD sections. The user overrode the leader's recommendation and chose option C (the "user hybrid").

## Question
How should `skills/memorization/` be restructured when it is split into durable-memory CRUD standard and per-loop capture procedure?

## Options considered
- A: One `skills/memory/` skill (durable tier), with capture procedure as a section. (Leader B3 recommendation.)
- B: Three separate skills.
- C (user selection): Two skills (`skills/memory/` + `skills/record/`) + thin RECORD sections in each loop skill pointing at `skills/record/SKILL.md`.

## User decision
D10: **Two-skill hybrid (C)**. `skills/memory/` holds durable-memory files (rules.md, memory-map.md, 17 templates). `skills/record/` holds the per-loop RECORD capture procedure. Each loop skill (ideation/preparation/planning/execution/wrap-up) gets a thin RECORD section that points at `skills/record/SKILL.md` — procedure body lives in one place, no 5-way drift.

## Implication
The D-b mapping table flows entirely from D10. The thin-RECORD-section approach means loop skills stay concise while the capture procedure is canonical in one place. Eliminates drift across 5 loop skills.

## Related
- Discussion log D10 (2026-06-13 post-leader-findings round)
- Design § D-b (full mapping table)
