---
slug: normalize-path-conventions-h3
title: "Normalize Path conventions to H3 across mistake/SKILL.md and planning/SKILL.md"
domain: docs-sync
type: general
disposition: deferred
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: planning
created: 2026-05-23
status: active
feature: gobbi-orchestration-workflow-improvements
scope: project
priority: low
---

# Normalize `Path conventions` to H3 — cross-skill backlog

## What

Promote `**Path conventions**` bold paragraph to `### Path conventions` H3 at two additional sites not covered in this session:

- `mistake/SKILL.md:126` — `**Path conventions**`
- `planning/SKILL.md:459` — `**Path conventions**`

The `memorization/SKILL.md` site was promoted in this session (Task 05 — Concern 2 resolution). The other two sites retain the `**bold paragraph**` form, creating cross-skill divergence.

## Why deferred

Scope constraint per `idea.md:54-61`. Cross-Link 7 only targets the `memorization/SKILL.md` site. The other two sites are low-traffic (no inbound cross-links requiring a stable anchor today). A single-session cleanup pass with minimal risk is the right vehicle.

## What to do

In a future session:
1. `grep -n "Path conventions" .agents/skills/*/SKILL.md` to locate current sites.
2. Promote each `**Path conventions**` to `### Path conventions` H3.
3. Verify no anchor regressions (these files have no current inbound anchor links requiring the exact bold-paragraph form).

## Witness

Ideation concern-2 resolution (Planning DISCUSSION iter1): `preparation.md:133-139`. Task 05 in this session handles only the memorization site.
