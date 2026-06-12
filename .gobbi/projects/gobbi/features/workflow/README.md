---
name: workflow
description: The gobbi workflow engine — the 6-step state machine that governs every session, its per-session working-memory tree, and the orchestration skills that drive it.
type: features
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [workflow, session-memory, orchestration, scaffold]
value_proposition: Deterministic, auditable session execution — every session runs the same 5-step loop against a spec-defined, script-materialized working-memory tree that agents cannot drift.
subsystems: [skills/orchestration, skills/memorization, skills/ideation, skills/preparation, skills/planning, skills/execution, skills/wrap-up]
---

# Workflow

## Overview

The `workflow` feature is the gobbi session engine. It defines the 6-step state machine (Configuration + Ideation + Preparation + Planning + Execution + Wrap-up), the per-session working-memory tree, and the orchestration skills that govern each step. Every gobbi session runs against this feature's spec — from the moment a session starts (Configuration) to the moment it closes (Wrap-up emits `workflow.finish`).

## Status

The session-memory directory structure was redesigned in session `1abeb43f` (2026-06-08). The new shape is spec-defined and script-materialized: a single authoritative spec doc (`orchestration/templates/session-tree.md`) replaced ~16 scattered prose definitions, and an idempotent scaffold script (`orchestration/scripts/scaffold-session-dir.sh`) materializes the tree deterministically. The full doc sweep (45 files + 2 new scripts + 1 spec doc) shipped in one PR on `develop`. All 5 loops dual-system evaluated to PASS.

Deferred: post-cleanup session-memory retention (backlog `backlogs/persist-session-memory-past-cleanup.md`), `[FLAG-1]` project-skills-is-memory classification, `[FLAG-2]` claude doc-authoring skill.

## Subdirectories

- `design/` — 1 file: canonical session-memory tree design (session-memory-tree.md)
- `decisions/` — 8 files: 6 from Ideation, 2 from Preparation covering the key structural choices
- `references/` — 3 files: external prior art that grounded the design
- `discussions/` — 1 file: Ideation decision arc (user gate choices)
- `plans/` — 1 file: the locked 10-task execution plan
- `backlogs/` — 0 files (project-level backlog carries the deferred persistence item)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-08 | 1abeb43f-6389-4abf-b098-b2b3e68d79b2 | Session-memory tree redesign: spec doc + scaffold script + 45-file doc sweep shipped; 6 decisions + design + plan + 3 references promoted |

## Open items

- `backlogs/persist-session-memory-past-cleanup.md` (project-level): retain session working memory after worktree cleanup for post-session debugging.
- `[FLAG-1]`: clarify whether project `skills/` is memory (out of scope for this session).
- `[FLAG-2]`: author the `claude` doc-authoring skill (out of scope for this session).

## Related

- `orchestration/templates/session-tree.md` — the single source of truth for the session tree shape (created this session).
- `orchestration/scripts/scaffold-session-dir.sh` — the idempotent materializer (created this session).
- `orchestration/scripts/verify-session-tree.sh` — the sync-check gate (created this session).
