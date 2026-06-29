---
name: non-redundancy-verify-gate
description: The design's (d)(ii) non-redundancy check is not bound to any verify in V1-V13; executor must run the heading comparison
type: checklists
scope: feature
feature: coding
status: active
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [non-redundancy, review-md, heading-comparison, validation-method-d, B4-failure-mode, executor-verify]
author: claude
---

# Non-Redundancy Verify Gate

## What the check is

The Ideation design lists four validation methods for `review.md`. Method (d)(ii) states: "pass the non-redundancy check — headings are not just the 7 perspectives." Ideation defines B4 (failure-mode B4) as `review.md` collapsing into a duplicate 7-perspective frame. The non-redundancy check is the named mitigation: compare `review.md` headings against `coding/evaluation.md` and confirm the taxonomy/procedure organization stays distinct from the 7-perspective frame.

## The gap

The Planning draft's V1–V13 verifies do not bind this check. The plan's verifies header claims "(a)(b)(c)(d)" coverage, but (d)(ii) is not assigned to any verify gate. Both the Claude evaluator (F-PROJ-1, F-CONSIST-1, Medium/75) and the Codex evaluator (codex-planning-usage-001, Medium/75) independently flagged this.

## The check to run at Execution

The executor must confirm that `review.md`'s top-level organizing headings are NOT the 7 perspective names (`project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk`). A fast method:

1. Extract headings from `review.md`: `grep -nE '^#{1,3} ' skills/coding/review.md`
2. Compare against `coding/evaluation.md`'s per-perspective section headings.
3. Confirm the taxonomy and procedure sections are organized by review property (point #1…#13, Phase 0…Phase 5) — not by the 7 perspectives.

This check passes when the taxonomy/procedure organization is clearly distinct from the 7-perspective frame. It fails when `review.md` re-uses the 7-perspective names as its primary structural axis.

## Evidence

- Claude evaluator: F-PROJ-1 (project.md), F-CONSIST-1 (consistency.md) — both Medium/75, checklist_gap/docs-sync
- Codex evaluator: codex-planning-usage-001 (usage.md) — Medium/75, checklist_gap/process
