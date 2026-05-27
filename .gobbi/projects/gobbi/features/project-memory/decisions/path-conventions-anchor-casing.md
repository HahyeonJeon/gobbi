---
name: path-conventions-anchor-casing
description: "Promote the Path conventions bold paragraph in memorization/SKILL.md to H3 for a stable cross-link anchor"
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [docs, memorization, anchor, cross-link]
title: "Memorization Path conventions → H3 promotion for stable cross-link anchor"
domain: docs-sync
supersedes: null
superseded_by: null
decision_status: accepted
---

# Path conventions anchor casing — promote to H3

## Question

`memorization/SKILL.md:224` heading is `**Path conventions**` (lowercase 'c', bold paragraph). The memorization skill required a stable anchor at this heading for cross-document linking.

## Resolution

**Option (b) — promote `**Path conventions**` to `### Path conventions` H3 at memorization/SKILL.md:224.** Small cosmetic change; no semantic impact; gives a stable GitHub-style anchor `#path-conventions` for cross-links.

Two other sites use the same `**Path conventions**` bold-paragraph convention:
- `mistake/SKILL.md:126` — `**Path conventions**`
- `planning/SKILL.md:459` — `**Path conventions**`

Only the memorization site was promoted in this session (scoped to the site needing the stable anchor). A follow-up backlog entry at `backlogs/project/normalize-path-conventions-h3.md` tracks the cross-skill normalization for a future session.

## Evidence

- `memorization/SKILL.md:224` — current `**Path conventions**` bold paragraph.
- `grep -n "Path conventions" .agents/skills/*/SKILL.md` finds 3 sites: memorization/planning/mistake.

## Action

Adopted in planning session. No User Challenge.
