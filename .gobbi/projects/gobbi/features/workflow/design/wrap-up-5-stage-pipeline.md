---
name: wrap-up-5-stage-pipeline
description: Wrap-up restructured as a 5-stage gated pipeline with git LAST and non-skippable memory validation
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [wrap-up, pipeline, evaluation, git, design]
supersedes: null
superseded_by: null
related:
  - features/workflow/decisions/2026-06-13-stage3-memory-validation-nonskippable.md
  - features/workflow/design/handoff-artifact-spec.md
---

# Wrap-up 5-stage pipeline (D-c + D8 + D13)

## Problem
The wrap-up procedure today is a 7-step WORK sequence with no explicit git stage and no named pipeline structure. The memorization/promotion job and the git finalization job are not separated, and the non-skippable evaluation gate before git is not enforced by the procedure text.

## Scope
In: restructure `wrap-up/SKILL.md` WORK into 5 named stages with owners + failure semantics; add explicit manager-owned git stage 5; state D13 non-skippable rule. Out: changes to the promotion routing table semantics.

## Approach

| # | Stage | Owner | Input | Output | Failure semantics |
|---|---|---|---|---|---|
| 1 | Session-record validation | assistant (WORK) | all prior loops' `staging/` | pass/gap report in `promotion-manifest.md` | gap → auto-backfill or NEEDS_CONTEXT; BLOCKS stage 2 |
| 2 | Memorization (promotion: session record → memory) | assistant (WORK) | validated staging + routing table | written memory files + manifest | unroutable file → NEEDS_CONTEXT; idempotent |
| 3 | Memory validation (NON-SKIPPABLE) | dual-system EVALUATION | post-promotion memory state + snapshot diff | per-perspective eval + verdict | REVISE → re-run promotion; FAIL → escalate; BLOCKS stage 5 |
| 4 | Handoff (file + shown to session) | assistant writes; manager shows | promoted memory + outputs + manifest | `handoff.md` + in-session display | missing section → REVISE |
| 5 | Git finalization | manager (git skill) | validated memory (tracked files) | commit + PR/merge + cleaned worktree | runs ONLY after stage 3 PASS |

**Stage 3 is the wrap-up loop's dual-system EVALUATION sub-phase** (D11). Stage 1 is a mechanical pre-gate inside WORK (the existing Step 2.5). The two gates act on DIFFERENT artifacts: stage 1 validates the input record; stage 3 validates the output memory. Neither duplicates the other (EXT-5).

**D13 lock**: settings can NEVER set `evaluate.mode: skip` for stage 3. It always runs and always gates stage 5.

**Role boundary**: stage 5 is MANAGER-owned. The assistant does stages 1–4 only. Subagents never push/merge (per `agents/leader.md` and the git skill).

## Scenarios
- Golden: stages 1–5 all pass; `workflow.finish` emitted.
- Stage 3 REVISE: stage 5 does NOT run; promotion re-runs from stage 2.
- Stage 3 FAIL: escalate to user; git never runs.

## Validation
Walk all scenarios against the stage table; confirm a failed stage-3 verdict blocks stage 5 in the procedure text; confirm no settings key can skip stage 3; confirm the assistant's Memory Access Matrix never grants git.

## Trade-offs
Adds an explicit git stage (previously implicit and unsequenced). This delays git finalization until after memory validation — the correct order. The assistant's surface shrinks (no git), not expands.

## Open issues
None. D8/D11/D13 are all user-locked.
