---
name: guard-run-mode-goal-state
description: Planning must state check-eval-childdocs.sh's two run modes and their verifiable goal-states explicitly, not just "build it early"
type: backlogs
scope: feature
feature: evaluation-childdoc-split
status: closed
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, process]
keywords: [check-eval-childdocs, guard-run-mode, atomic-last, goal-state]
author: claude
priority: medium
project-scope: false
shipped_in: 48ff11a2
---

# State the guard's two run-mode goal-states explicitly at Planning

## Context

This is the iter6 Claude evaluator's USAGE-01 (Medium/confidence 50) finding, fully recorded as a typed decision at `guard-run-mode-not-separated`. The design's FIX-U3 says "build `check-eval-childdocs.sh` early" (sequencing), but does not separate that from the two-family predicate's "Family-9 surfaces must include `checklist.md`" wording (an assertion), and the two can only be satisfied at different points in the rollout.

## Why deferred

This is imperative-over-declarative under-specification in the design PROSE, not a design defect — both evaluators PASSed iter6 with this as a non-blocking note. It does not require reopening Ideation; it requires Planning to state the goal precisely when it decomposes the guard-build task.

## When to pick up

When Planning decomposes the `guard-check-eval-childdocs-early` backlog item into a concrete task (same feature, no separate trigger — pick up together).

## Suggested approach

State two distinct, verifiable goal-states for the guard, and specify which Execution step each holds at:

1. **F1 — classify-completeness mode.** Goal-state: "every genuine eval-output-shape hit across the swept surfaces is classified (Family-9 / Family-8 / `verified-leave`, with a correctness-checked reason)." Holds starting immediately — runnable against the CURRENT tree, before any loop bundle is split.
2. **F2 — flip-gated inclusion-enforcement mode.** Goal-state: "every Family-9-classified surface's on-disk content actually contains `checklist.md`." Holds ONLY after the atomic-last parent-contract flip has run — asserting it before that point will fail on every Family-9 surface, by design (none has been updated yet).

Planning should wire F1 as a standing/repeatable check run throughout the split (each per-loop task re-runs it to confirm no new stale surface appeared), and F2 as a one-time acceptance check for the atomic-last flip task specifically — never combine them into a single invocation the guard runs the same way at every point in the rollout.

## Resolution

Planning's task 01 (`build-check-eval-childdocs-guard`) implemented the two modes as separate invocation flags — `--classify-only` / `--bundle {loop} --pre-flip` (F1, run throughout the split at tasks 04/06-09) and `--enforce-inclusion` (F2, task 10's sole acceptance gate). The two-mode separation held through all 10 tasks with no chicken-and-egg failure. See `mechanical-boundary-guard-relocates-not-converges` for how the `--enforce-inclusion` implementation itself converged.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-07-39f3dfb0-49df-44d4-a6bd-d2e4743b36e3/`

## Related

- [[evaluation-childdoc-split]] (design) — the D6 rollout + atomic-last flip this goal-state split applies to
- [[guard-check-eval-childdocs-early]] — the sibling backlog item this note refines (the WHEN of the guard build; this note is the WHAT of its two run modes)
- [[guard-run-mode-not-separated]] — the typed decision this backlog note carried forward as a Planning-input
