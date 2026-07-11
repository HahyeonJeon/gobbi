---
name: completeness-model-is-a-build-time-gate
description: A completeness-verification defect that recurs 2+ times means the MODEL is wrong — fix the gate's direction, don't hand-list harder
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, verification]
keywords: [completeness-gate, hand-listing, fail-closed, class-predicate, sweep-direction]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: [guard-revises-twice-means-scope-model-wrong]
---

# A completeness-verification defect that recurs means the gate's direction is wrong, not its count

## What happened

The evaluation-childdoc-split Ideation loop's co-touch inventory (D5 — every file that goes stale unless repointed) was hand-written prose, checked by a gate that ran `sweep ⊇ D5`: the sweep only had to match lines already written INTO the hand-listed D5. Across iterations 1-3, three consecutive REVISE rounds each found a different facet the hand-list had missed — iter1: `agents/` and per-phase workflow docs excluded entirely; iter2: sub-lines within files already present in D5; iter3: SSOT/map docs plus a false internal contradiction between two sections. Each round patched the immediate gap the evaluator found and shipped a "fixed" D5 that the NEXT round again found incomplete, one layer deeper.

## Why it happens

A gate that checks `sweep ⊇ D5` cannot fail on a surface that was never entered into D5 — the surface is invisible to the gate by construction. Patching the hand-list after each REVISE treats the SYMPTOM (this specific missed surface) instead of the ROOT (the gate's direction guarantees it can only ever validate what the author already thought to list, never surface what they forgot). This is the general pattern the project has already recorded once: [[guard-revises-twice-means-scope-model-wrong]] — a run-to-zero guard that REVISEs more than once, with each fix extending the pattern/allowlist/count while the next iteration finds the gap relocated, has a wrong SCOPE MODEL, not a wrong count. This session is a second, independent confirmation of that same pattern, across SIX iterations of the same underlying defect class (iter1-3 the original recurrence; iter4 the model fix; iter5-6 hardening the now-correct model against smaller misses of the same completeness-verification kind).

## Correct approach

When a completeness/coverage gate REVISEs more than once and each fix is "add the missed item(s) to the list," stop patching the list and flip the gate's DIRECTION instead: from `sweep ⊇ hand-list` (checks presence in an author-controlled set) to `hand-list ⊇ genuine-hits, fail-closed` (checks the author-controlled set covers every hit an independent sweep finds; any unclassified hit blocks completion). Once the direction is correct, generalize the classification to a CLASS PREDICATE closed under sibling-identity — every structurally identical surface classifies the same way automatically — rather than an instance-by-instance name list, so a new sibling cannot be cherry-picked or forgotten the way individual list items were. Finally, add a correctness check on top of the presence check: a classification can be "present but wrong" (a `verified-leave` on a surface that actually needed inclusion), so the gate must spot-check classifications, not just their existence.

## How to detect

A completeness/coverage/co-touch gate cited as a "run to zero" or "certifies complete" claim that REVISEs more than once, where each fix is described as "add X to the list" / "extend the pattern" / "found N more" and the NEXT evaluation round finds a different facet still missing. The signal is the recurrence pattern itself, not any single miss — one missed item is a normal REVISE; two or more consecutive rounds finding DIFFERENT missed items under the SAME gate is the model-is-wrong signal.

## Related

- [[guard-revises-twice-means-scope-model-wrong]] — the first recorded instance of this pattern (memory-migration-curation-campaign); this file is the second, independent confirmation, extended to the class-predicate + correctness-check generalization
