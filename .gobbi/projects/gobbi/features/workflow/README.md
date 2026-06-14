---
name: workflow
description: The gobbi workflow engine — the 6-step state machine that governs every session, its per-session working-memory tree, and the orchestration skills that drive it.
type: features
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [workflow, session-memory, orchestration, scaffold, vocabulary-rename, wrap-up-pipeline]
value_proposition: Deterministic, auditable session execution — every session runs the same 6-step machine against a spec-defined, script-materialized working-memory tree, with a vocabulary that unambiguously names per-loop capture (RECORD) separately from durable promotion (memorization in the 5-stage Wrap-up pipeline).
subsystems: [skills/orchestration, skills/record, skills/memory, skills/ideation, skills/preparation, skills/planning, skills/execution, skills/wrap-up]
---

# Workflow

## Overview

The `workflow` feature is the gobbi session engine. It defines the 6-step state machine (Configuration + Ideation + Preparation + Planning + Execution + Wrap-up), the per-session working-memory tree, and the orchestration skills that govern each step. Every gobbi session runs against this feature's spec — from the moment a session starts (Configuration) to the moment it closes (Wrap-up emits `workflow.finish`).

## Status

**Session `7e00f98e` (2026-06-12):** vocabulary rename + Wrap-up pipeline redesign shipped. The per-loop capture sub-phase is now named RECORD (`skills/record/`); durable-tier CRUD standards are now in `skills/memory/`; the old `skills/memorization/` directory is gone. Wrap-up is restructured as a 5-stage gated pipeline: (1) session-record validation, (2) promotion/memorization, (3) memory validation (NON-SKIPPABLE — gates stage 5), (4) handoff, (5) git finalization (manager-owned, LAST). CLAUDE.md and AGENTS.md reconciled to the 6-step machine. 13 commits, all loops dual-system PASS. Two guard scripts added: `check-markdown-links.sh` + `check-residual-vocab.sh`.

**Session `1abeb43f` (2026-06-08):** session-memory tree redesign shipped. Spec-defined and script-materialized tree: `orchestration/templates/session-tree.md` + `orchestration/scripts/scaffold-session-dir.sh`. Full 45-file doc sweep. All 5 loops dual-system PASS.

Deferred: post-cleanup session-memory retention (backlog `backlogs/persist-session-memory-past-cleanup.md`), `[FLAG-1]` project-skills-is-memory classification, `[FLAG-2]` claude doc-authoring skill.

## Subdirectories

- `design/` — 7 files: session-memory-tree design + 6 Wrap-up/vocabulary-split design docs (D-a through D-f)
- `decisions/` — 19 files: 8 from session `1abeb43f` + 11 from session `7e00f98e`
- `references/` — 8 files: 3 from session `1abeb43f` + 5 from session `7e00f98e`
- `discussions/` — 8 files: 1 from session `1abeb43f` + 7 from session `7e00f98e` (D5-D16 vocabulary/pipeline decisions)
- `plans/` — 2 files: the locked 10-task session-memory plan + the locked 11-task vocabulary-rename plan
- `backlogs/` — 1 file: task-record template + 17 dangling-ref fix (deferred from this session)
- `checklists/` — 5 files: executor verification checklists for sweep, gates, and evaluation steps
- `scenarios/` — 1 file: workflow/memorization.md doc-filename rename edge case

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-13 | 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4 | Vocabulary rename + Wrap-up pipeline redesign: RECORD/memory/memorization vocabulary lock; 2-skill split (record + memory); 5-stage Wrap-up pipeline; CLAUDE.md/AGENTS.md reconcile; 2 guard scripts; 13 commits; 4 mistakes promoted (2 layer-2) |
| 2026-06-08 | 1abeb43f-6389-4abf-b098-b2b3e68d79b2 | Session-memory tree redesign: spec doc + scaffold script + 45-file doc sweep shipped; 6 decisions + design + plan + 3 references promoted |

## Open items

- `backlogs/task-record-template-and-dangling-ref.md`: author task-record template + fix 17 dangling refs in chat-mode.md.
- `backlogs/persist-session-memory-past-cleanup.md` (project-level): retain session working memory after worktree cleanup for post-session debugging.
- `[FLAG-1]`: clarify whether project `skills/` is memory (out of scope for this session).
- `[FLAG-2]`: author the `claude` doc-authoring skill (out of scope for this session).

## Key design decisions (session `7e00f98e`)

- **D5/D6/D7** — Vocabulary lock: per-loop sub-phase = RECORD; durable store = memory; wrap-up promotion stage = memorization.
- **D-b/D10** — Two-skill split: `skills/record/` = per-loop procedure; `skills/memory/` = durable CRUD standard.
- **D-c/D8/D13** — Wrap-up 5-stage pipeline; git finalization is stage 5 (LAST, manager-owned); stage 3 memory validation is NON-SKIPPABLE and gates stage 5.
- **D-f** — CLAUDE.md/AGENTS.md reconciled to 6-step machine (Configuration named explicitly).

## Related

- `record/record-map.md` — single source of truth for the session record tree shape.
- `orchestration/scripts/scaffold-session-dir.sh` — the idempotent materializer.
- `record/scripts/verify-record-map.sh` — the sync-check gate.
- `orchestration/scripts/check-markdown-links.sh` — link-resolution guard (added session `7e00f98e`).
- `orchestration/scripts/check-residual-vocab.sh` — multi-class vocabulary residual guard (added session `7e00f98e`).
