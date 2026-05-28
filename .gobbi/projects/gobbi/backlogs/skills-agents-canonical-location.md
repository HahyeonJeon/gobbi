---
name: skills-agents-canonical-location
description: memorization/memory-map.md excludes skills/ and agents/ from its write surface while wrap-up/SKILL.md lists them as write targets; contradiction touches symlink and plugin-mirror logic.
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-25
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [skills, agents, memory-map, wrap-up, symlinks, canonical-location]
priority: high
disposition: open
project-scope: true
---

# `skills/` + `agents/` canonical-location contradiction (L8 / FLAG-1)

## Context

Two skill documents describe different write-surface authorities for the `skills/` and `agents/` directories under `.gobbi/projects/{project-name}/`:

- `memorization/memory-map.md` — excludes `skills/` and `agents/` from its memory-tier write matrix entirely (neither listed as a writable tier for any loop).
- `wrap-up/SKILL.md` — lists `skills/` as a write target in its staging to project-memory promotion routing (generated skills promoted by Preparation loop are written to `.gobbi/projects/{project-name}/skills/{slug}/`).

The contradiction surfaces several sub-questions: Is `skills/` a memory type or a separate project artifact tier? Who is the canonical writer for new project skills (Wrap-up promotion vs. in-loop generation vs. Interview bootstrap)? How does the plugin-mirror layer (`plugins/gobbi/skills/`) relate to the canonical `.gobbi/.../skills/` tree? What is the correct symlink-creation contract when a new project skill is added?

This was logged as FLAG-1 in the Ideation design doc (§11) and locked out of scope by L8.

## Why deferred

Explicitly out of scope per L8 lock (session 2026-05-25-a10c82d6): "Do not relocate or rework `.gobbi/projects/gobbi/skills/` (18 dirs) or `agents/` this session." The work touches symlink/plugin mirroring logic and potentially the Preparation WORK to Wrap-up promotion contract for generated skills. Resolving it requires a careful audit of the plugin-mirror layer and agreement on whether `skills/` belongs in the memory-map's type taxonomy or is explicitly a separate tier.

## When to pick up

Prerequisites:
- Session 2026-05-25-a10c82d6 closes (memory-system redesign shipped) — the 13 per-type specs, the new `memorization/rules.md` standard, and the updated `memorization/memory-map.md` will be in place, making the `skills/`-placement question easier to reason about against a clean backdrop.
- No other hard prerequisites — can run any time after this session completes.

## Suggested approach

1. Audit the three surfaces: `memorization/memory-map.md`, `wrap-up/SKILL.md`, and `preparation/SKILL.md` (which describes the Preparation WORK to Wrap-up generated-skill promotion path). Determine whether `skills/` should be listed as an explicit tier in the memory-map (with its own write-authority row) or documented as a separate project-artifact tier entirely outside the memory taxonomy.
2. Audit the plugin-mirror relationship: `plugins/gobbi/skills/` vs. canonical `.gobbi/projects/gobbi/skills/`; confirm whether the symlink-creation contract in `preparation/SKILL.md` is complete.
3. Reconcile `wrap-up/SKILL.md`'s routing table entry for `skills/` against the memory-map's scope boundary.
4. Propagate the resolution to `memorization/memory-map.md`, `wrap-up/SKILL.md`, `preparation/SKILL.md`, and any delegation templates that reference the promotion path.

## Originating session

`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/` — Ideation FLAG-1 / L8 and Preparation Readiness.
