---
name: api-weekly-limit-degraded-mode-integration
description: A contributor interruption after both drafts freeze preserves independence, but synthesis still resumes through the active specialist.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-08
session: 33de02b8-4dff-4768-bafa-c1f53ae81890
tags: [codex, process]
keywords: [usage-limit, dual-system-work, frozen-drafts, replacement-specialist, resume]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Frozen drafts preserve independence across a contributor interruption

## Insight

When both system-labeled drafts were independently created, validated, and frozen before a contributor interruption, their independence remains intact. Recovery can resume from those durable artifacts without recreating either draft or pretending the interruption produced missing-system evidence.

## Context

In the originating session, Claude hit a weekly usage limit after both independent creation artifacts existed. The historical manager completed the combination work from those artifacts. The reusable fact is narrower: completed frozen inputs survive a runtime interruption; incomplete inputs do not.

## Reason

Independence is a property of the creation order and frozen artifacts, not of one contributor remaining addressable forever. Once both drafts pass the freeze barrier, a replacement can be fully reprised from the durable package. That does not authorize skipping reciprocal reviews, synthesis, open-decision resolution, or evaluation.

## How

First validate that both drafts under `working/iteration-{n}/drafts/` are complete, correctly labeled, independently ordered, and immutable. Confirm the interrupted assignment in `state.json.activeDispatches`. Replace or resume the active-runtime step specialist, fully reprime it from both drafts and the neutral contract, and continue with both reciprocal cross-reviews, synthesis, and resolved `open-decisions.md`.

If either draft is missing or invalid, pause and surface the exact failure. Only an explicit user waiver naming the missing system, step, and iteration permits single-system continuation. Do not call an interrupted run “degraded,” mine process output, or reduce later evaluation rigor.

## Counter-cases

This does not apply when either draft is incomplete, unvalidated, mutable, or created after exposure to the peer. It also does not authorize the manager to bypass the active-runtime specialist, reuse a prior iteration, omit cross-review, or treat a missing system as a silent fallback.
