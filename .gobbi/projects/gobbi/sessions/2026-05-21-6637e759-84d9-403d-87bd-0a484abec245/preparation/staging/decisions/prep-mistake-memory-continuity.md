---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
supersedes: null
superseded_by: null
disposition: addressed
addressed_by: iter2 Pre-routed gaps section (preparation/artifacts/pre-routed-gaps.md § F-CX-PREP-O-01)
finding_id: F-CX-PREP-O-01
severity: High
confidence: 75
---

# F-CX-PREP-O-01: Pre-route mistake-memory continuity constraint to Planning

## Context

The repo-reset sweep deliberately wipes `mistakes/` at Stage C as part of the 13-placeholder-target-dir reset. The `mistake` skill requires every executor to load project mistakes before starting work (P1 procedure). If Planning decomposes Stages 0–G into multiple executor tasks, any executor spawned AFTER Stage C runs against an empty `.gobbi/projects/gobbi/mistakes/` directory — violating P1 for all post-Stage-C tasks.

The locked H-2 trade-off (Ideation) encoded only 3 named mistake lessons inline in the Implementation Checklist, leaving ~37 additional project mistakes (git-flow, worktree-pwd-drift, docs-sync, process-discipline patterns) uncovered for post-Stage-C tasks.

## Decision

Pre-route this as a binding Planning constraint: all `mistake`-skill loads MUST happen BEFORE Stage C executes. Two remediation options for Planning:
- (a) Single-executor sweep (recommended) — entire Stages 0–G in ONE task; mistakes loaded once at task start before Stage 0.
- (b) Multi-task with pre-Stage-C snapshot + post-Stage-C delegation-prompt override pointing to snapshot path.

## Rationale

Option (a) extends the H-2 logic (one-time in-session loss is acceptable when lessons are loaded into context) to the full 40-mistake bundle, with zero new machinery. Option (b) adds snapshot orchestration overhead only justified if per-stage bisectability is required. The constraint is not a Preparation `generate-now` action — it is a Planning decomposition choice.

## Alternatives considered

Full REVISE of the Preparation draft, re-running Sub-steps A–D. Rejected by user in favor of surgical iter2 additive fix because the underlying readiness state is sound; only the Planning boundary needs the constraint surfaced.

## Consequences

Planning's Sub-step D AskUserQuestion MUST present (a) vs (b) with the task-size implication of (a) explicit. Whichever option Planning picks, the `mistake`-skill loads/snapshot step precedes Stage C.

## Related

- `preparation/artifacts/pre-routed-gaps.md` § F-CX-PREP-O-01
- `ideation/artifacts/implementation-checklist.md` Stage C
- `preparation/evaluation/iter1/codex/overall.md`
