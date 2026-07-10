---
name: illustrative-d5-omissions
description: Known gate-catchable omissions in the illustrative D5 that the build-time guard, not hand-listing, is expected to resolve
type: backlogs
scope: feature
feature: evaluation-childdoc-split
status: open
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, process]
keywords: [illustrative-d5, verified-leave, hand-listing, guard-catchable]
author: claude
priority: low
project-scope: false
shipped_in: null
---

# Known illustrative-D5 omissions — resolve by guard, not by another hand-listing pass

## Context

Across iterations 1-6, the illustrative D5 in the draft repeatedly needed a hand-listing patch as evaluators (both independently, and via low-confidence appendix notes) kept surfacing eval-output-shape surfaces the prose list had not yet named. Iteration 4 fixed the underlying MODEL (see `completeness-model-is-a-build-time-gate`) so this class of gap can no longer ship silently once `check-eval-childdocs.sh` exists — the guard shipped as task 01 of this session's Execution — but this smoke-test set has not yet been confirmed run against the guard's actual first real-tree sweep.

Known specific instances surfaced but not hand-added to D5 (both PASS-worthy, non-blocking, exactly the "illustrative, not exhaustive" case the design anticipates):

- **`codex/SKILL.md:358/:359`** — a dispatch-prompt line naming `{perspective}.md`. The iter6 Claude evaluator's low-confidence appendix (confidence 25) noted this surface is not hand-listed in D5, but its shape IS covered by the `{perspective}.md` sweep family, so the (future) gate correctly classifies it `verified-leave` — confirming the model works even where the hand-list is silent.
- **Loop-skill exit checklists** — the iter6 Codex evaluator's low-confidence appendix noted broad wording in loop-skill exit checklists stating both systems produced per-perspective files; covered by the `per-perspective files` sweep family, so not a REVISE-worthy gap under the calibrated bar, but the future gate should classify these explicitly rather than leave them as an unexamined "probably fine."
- **`skill-writing/SKILL.md:121`** (mirrored-skills count) and **`wrap-up/evaluation.md:155`** (promoted-file bloat check) — both matched the `wc -l` sweep pattern during the iter6 FIX-U2 sweep but are unrelated to the eval-output directory; classified `not applicable`, listed here so a future guard run does not need to re-derive that they are false-positive matches.

## Why deferred

None of these change the design; they are exactly the kind of low-confidence, shape-covered residue the class-predicate model is designed to absorb without another Ideation iteration. Re-litigating them in Ideation would repeat the iter1-3 hand-listing-patch pattern the model fix was meant to end.

## When to pick up

`check-eval-childdocs.sh` now exists (task 01, this session). Pick this up by re-checking these 4 specific surfaces against the guard's actual `--self-test` / `--classify-only` output: the guard should classify `codex/SKILL.md:358/:359` and the loop-skill exit-checklist wording as `verified-leave` (Family-9 shape, correctly not requiring an update), and should classify `skill-writing/SKILL.md:121` / `wrap-up/evaluation.md:155` as `not applicable` (pattern match, wrong subject). If the guard disagrees with any of these three classifications, that is a guard bug to fix before trusting its output on the real co-touch set. The guard's own `--self-test` invocation (task 01's verifies) already exercises this exact fixture set — confirm the fixture set matches before closing this item.

## Suggested approach

No design work needed — this is a verification fixture for the guard's first run, not a design gap.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-07-39f3dfb0-49df-44d4-a6bd-d2e4743b36e3/`

## Related

- [[guard-check-eval-childdocs-early]] — the (now-shipped) guard-build backlog item this smoke-test set validates
- [[completeness-model-is-a-build-time-gate]] — the model fix that makes these omissions non-blocking
</content>
