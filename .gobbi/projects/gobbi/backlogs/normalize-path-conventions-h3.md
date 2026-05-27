---
name: normalize-path-conventions-h3
description: Promote **Path conventions** bold paragraph to H3 at mistake/SKILL.md and planning/SKILL.md — two sites left after memorization/SKILL.md was promoted in this session.
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [docs-sync, h3, path-conventions, skill-authoring]
title: "Normalize Path conventions to H3 across mistake/SKILL.md and planning/SKILL.md"
domain: docs-sync
priority: low
disposition: deferred
---

# Normalize `Path conventions` to H3 — cross-skill backlog

## Context

Promote the `**Path conventions**` bold paragraph to a `### Path conventions` H3 heading at two skill sites that an earlier pass left in the bold-paragraph form:

- `mistake/SKILL.md` — `**Path conventions**`
- `planning/SKILL.md` — `**Path conventions**`

The `memorization/SKILL.md` site was already promoted to H3 in the originating session, so the other two sites now diverge from it. Promoting them to H3 gives the section a stable anchor and removes the cross-skill divergence.

## Why deferred

The originating session's scope only targeted the `memorization/SKILL.md` site. The other two sites are low-traffic — no inbound cross-links depend on a stable anchor today — so they were left for a future single-session cleanup pass with minimal risk.

## When to pick up

No hard prerequisites — can run any time. Best paired with any future cross-skill anchor-stability cleanup, or picked up the moment an inbound link needs to target either of the two remaining `Path conventions` sections.

## Suggested approach

In a future session:
1. `grep -n "Path conventions" .gobbi/projects/gobbi/skills/*/SKILL.md` to locate the current sites.
2. Promote each `**Path conventions**` to a `### Path conventions` H3.
3. Verify no anchor regressions (these files have no current inbound anchor links requiring the exact bold-paragraph form).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/` — the orchestration-workflow-improvements session that promoted only the `memorization/SKILL.md` site and deferred the other two.
