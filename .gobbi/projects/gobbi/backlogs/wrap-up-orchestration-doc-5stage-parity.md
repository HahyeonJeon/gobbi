---
name: wrap-up-orchestration-doc-5stage-parity
description: orchestration/workflow/wrap-up.md could adopt the explicit 5-stage vocabulary (stage names + D8/D13 locks) for parity with the updated wrap-up/SKILL.md
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [docs-sync, wrap-up, orchestration]
priority: low
disposition: open
project-scope: true
shipped_in: null
---

# Wrap-up orchestration doc 5-stage parity

## Context

Session `7e00f98e` updated `wrap-up/SKILL.md` with the explicit 5-stage pipeline vocabulary: (1) session-record validation, (2) memorization/promotion, (3) memory validation (NON-SKIPPABLE), (4) handoff, (5) git finalization. The corresponding orchestration doc `skills/orchestration/workflow/record.md` (formerly `workflow/memorization.md`) describes the per-loop RECORD sub-phase and was renamed in scope.

The file `skills/orchestration/workflow/wrap-up.md` was NOT updated to use the new 5-stage vocabulary — it is an older doc that describes Wrap-up at a higher level. Bringing it to parity (stage names, D8 git-last, D13 non-skippable) would make the orchestration and skill layers consistent.

## Why deferred

This update was out of scope for the session `7e00f98e` vocabulary rename (the 21-EXCLUDE list covered orchestration/workflow/wrap-up.md). It is a low-risk docs-sync item with no correctness impact — the canonical spec is `wrap-up/SKILL.md`; the orchestration doc is supplementary.

## When to pick up

After the session `7e00f98e` PR merges to develop. No other prerequisites.

## Suggested approach

Open `skills/orchestration/workflow/wrap-up.md` and add or update the Wrap-up phase description to use the 5-stage vocabulary: name each stage, note that stage 5 (git finalization) is manager-owned and LAST (D8), and note that stage 3 (memory validation) is NON-SKIPPABLE (D13). Keep the edit narrow — no restructuring, just vocabulary alignment.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-12-7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4/`
