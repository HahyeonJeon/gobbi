---
name: hooks-domain-mistakes-watchlist
description: Flags zero hooks-domain mistakes currently; deferred until N≥2 hook-authoring mistakes accumulate or a 3rd hook author arrives.
type: backlogs
scope: project
feature: null
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, mistakes, watchlist, deferred]
title: Hooks-domain mistakes watchlist — capture mid-Execution as they emerge
project: gobbi
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
disposition: open
---

# Hooks-domain mistakes watchlist

## Context

Bundle B's T3 introduces `.claude/hooks/post-tool-use-agents.sh` — the project's 2nd shell hook after `.claude/hooks/session-start.sh` (shipped in env-var-audit, 2026-05-22). The hooks domain is new in this codebase: zero entries in `.gobbi/projects/gobbi/mistakes/` carry a `hooks` domain tag. All 8 current project mistakes are `process` / `workflow` domain.

The Sub-step B gap scan (`rawdata/sub-steps-a-d-iter1.md` § B-G4, Medium severity) noted this absence. There are no retrospective hook-authoring pitfalls to capture — hooks haven't existed long enough to accumulate. The right discipline is **moment-of-capture mid-Execution**: as executors implementing T3 (B1 + B2) encounter wrong assumptions or evaluator corrections, those land as mistake-candidates in this session's staging per the `mistake` skill P2 procedure, and Wrap-up promotes them to project memory.

This backlog item exists to flag that hooks-domain coverage is currently zero and to remind future sessions to keep moment-of-capture discipline tight on this surface until N≥2 mistakes accumulate (at which point a domain-tagged read at any hook-touching task becomes load-bearing).

## Why deferred

Mistakes are trigger-bound (per Principle 10 — "Change Only With a Real Trigger"). There are no hook-authoring triggers yet. Speculatively pre-emptively staging a "watch-list of potential pitfalls" would be Principle 10 violation — speculation without a real motivator. Defer until real corrections fire.

## When to pick up

Two triggers — pick up at whichever fires first:

- **N≥2 hooks-domain mistakes accumulate** in `.gobbi/projects/gobbi/mistakes/` from moment-of-capture writes during Execution sessions. At that point, the witness-pattern is strong enough to consider a project-skill extraction (paired with `backlogs/project/gobbi-hook-authoring-skill.md`).
- **3rd hook author proposes a new hook** (after `session-start.sh` and T3's `post-tool-use-agents.sh`). At that point, future hook authors will benefit from a captured watchlist even if formal mistakes haven't accumulated — the third instance is when pattern under-engineering becomes likely.

## Suggested approach

This backlog is a **perpetual capture reminder**: it remains `in-progress` until the N≥2 extraction trigger fires or the domain is subsumed by a dedicated skill. No pre-meditated work is required — just moment-of-capture discipline on every hook-touching execution session.

Ad-hoc per execution session — no large pre-meditated work. When an executor or evaluator corrects a hook-authoring approach mid-Execution, the existing `mistake` skill P2 / P3 flow handles staging; no separate workflow needed.

**N≥2 extraction trigger**: when ≥2 hooks-domain mistakes accumulate in `.gobbi/projects/gobbi/mistakes/`, extract a `gobbi-hook-authoring` project skill. At that point, the pattern is witness-backed and a domain-tagged P1 read becomes load-bearing.

If/when N≥2 hooks-domain mistakes exist, consider whether to:
- Stage a `gobbi-hook-authoring` project skill (see `backlogs/project/gobbi-hook-authoring-skill.md` — separate backlog item already deferred for this trigger).
- Add a `hooks` domain tag convention to `mistake/SKILL.md` so future P1 loads filter cleanly (the `hooks` tag is already added to the domain-tag examples as of Bundle C, T03).

Effort estimate: **ad-hoc per execution session** (no upfront work). Skill extraction at N≥2 trigger: separate backlog (gobbi-hook-authoring-skill).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

Pointer: Preparation iter1 Sub-step D, gap D-2, AskUserQuestion Card 4. User chose "Recommended: Defer to backlog — capture mid-Execution as they emerge."
