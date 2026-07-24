---
name: t6-t9-effort-banding
description: T6 and T9 are now explicitly effort-banded as the plan's two large tasks, so an executor is not surprised mid-task
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, process]
keywords: [f3-perf-01, effort-banding, t6-sizing, t9-sizing, no-sampling]
author: claude
scenario: plan-struct-task-sizing
item_status: implemented
anchor: novel
implemented_in: null
---

# T6 and T9 carry an explicit effort-banding table

## What

The plan's task-sizing must reflect actual output volume and manual-verification burden, not just file count —
T6 (30-family `scenario.md` rewrite) and T9 (six-file non-sample-based verification across 8 workstreams) are
materially larger than the other seven one-sitting tasks.

## Why

At iter2, every task was sized by files-touched count only (1-3 files each), which hid that T6 and T9 are the
plan's two largest units of real work (`F2-PERF-01`, Medium/75). An executor running short mid-T6 or mid-T9 does
not fail loudly under time pressure — it silently samples, which is exactly the failure the "no sampling"
wording in `MC-T6`/`MC-T9` exists to prevent, and nothing downstream detects a silently-sampled manual predicate.

## Verification

Added an explicit effort-banding table (`draft-iter1.md` § Agent assignments) naming T6's checkpoint (Phase A
close, before PROJ-08) and T9's per-workstream resumability (8 separable `MC-T9` steps, each recorded as it
completes). This is a budget, not a re-slice — T6 keep-whole stays manager-adjudicated.

## Status notes

Resolved. The banding is descriptive/process guidance for the executor, not a new acceptance gate — verification
is that the table exists and names a concrete checkpoint/continuation point for each of the two large tasks.

## Related

- [[t6-single-largest-task-sizing]] — the iter1 Claude finding that first raised T6's size as an observation
