---
slug: path-conventions-anchor-casing
title: "Memorization Path conventions → H3 promotion for stable cross-link anchor"
domain: docs-sync
type: design_flaw
disposition: addressed
mistake-candidate: false
project: gobbi
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: planning
created: 2026-05-23
status: active
supersedes: null
date: 2026-05-23
feature: gobbi-orchestration-workflow-improvements
superseded_by: null
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/decisions/concern-2-path-conventions-anchor-casing.md
promoted-at: 2026-05-23T14:00:00Z
---

# Path conventions anchor casing — promote to H3

## Question

`memorization/SKILL.md:224` heading is `**Path conventions**` (lowercase 'c', bold paragraph). Cross-Link 7 requires a stable anchor target.

## Resolution

**Option (b) — promote `**Path conventions**` to `### Path conventions` H3 at memorization/SKILL.md:224.** Small cosmetic change; no semantic impact; gives a stable GitHub-style anchor `#path-conventions` for Cross-Link 7.

Two other sites use the same `**Path conventions**` bold-paragraph convention:
- `mistake/SKILL.md:126` — `**Path conventions**`
- `planning/SKILL.md:459` — `**Path conventions**`

These are NOT promoted in this session (Concern 2 only targets the memorization site that Cross-Link 7 needs). A follow-up backlog entry was staged at `backlogs/project/normalize-path-conventions-h3.md` by Task 05 to track the cross-skill normalization for a future session.

## Evidence

- `memorization/SKILL.md:224` — current `**Path conventions**` bold paragraph.
- `grep -n "Path conventions" .agents/skills/*/SKILL.md` finds 3 sites: memorization/planning/mistake.
- Preparation recommendation (`preparation.md:133-139`) adopted as-is.

## Action

Adopted in Planning draft-iter1.md Task 05. No User Challenge.
