---
name: entry-doc-evaluation-block-omits-prep-wrapup
description: CLAUDE.md/AGENTS.md "Evaluation is mandatory" block names only Ideation/Planning/Execution; should include Preparation and Wrap-up with the non-skippable note for Wrap-up's stage 3
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [docs-sync, evaluation, wrap-up, preparation]
keywords: []
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Entry-doc evaluation block omits Preparation and Wrap-up

## Context

The "Evaluation is mandatory" block in CLAUDE.md and AGENTS.md currently reads: "Evaluation runs inside Ideation, Planning, and Execution — mandatory after Execution, optional at the earlier steps." This omits two steps: Preparation (which can run optional evaluation) and Wrap-up (which runs NON-SKIPPABLE mandatory evaluation at stage 3 — memory validation).

The omission is misleading for agents bootstrapping from the entry doc: they may conclude that evaluation is only relevant to Ideation/Planning/Execution and miss that Wrap-up has a non-bypassable evaluation gate (D13).

## Why deferred

Session `7e00f98e` had a locked scope contract (D12) covering the workflow feature only — the 21-EXCLUDE list explicitly excluded CLAUDE.md and AGENTS.md from the vocabulary-rename scope. This backlog item is a follow-on docs-sync task for a future docs session.

## When to pick up

After the session `7e00f98e` PR merges to develop. No other prerequisites.

## Suggested approach

Edit the "Evaluation is mandatory" paragraph in both CLAUDE.md (`.claude/`) and AGENTS.md (`.codex/`) to mention all five productive steps. The Wrap-up mention should note that its stage-3 memory validation is NON-SKIPPABLE (D13 lock) and cannot be bypassed via `evaluate.mode: skip`. Keep the edit narrow — one paragraph update plus the non-skippable note; no other changes.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-12-7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4/`
