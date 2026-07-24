---
name: post-gate-outcome-provenance-check
description: The canonical preparation checklist.md seed lacks a check verifying that a post-gate user-decision claim cites a durable, anchor-resolvable session-record source.
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-17
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [docs-sync, verification]
keywords: [outcome-evidence, seed-checklist-gap, preparation-skill, canonical-bundle]
author: claude
scenario: post-gate-outcome-provenance-scenario
item_status: pending
anchor: novel
implemented_in: null
---

# Canonical checklist seed lacks an outcome-evidence check

## What

Add a check to the canonical `preparation/checklist.md` (Usage family, anchored to the post-gate-outcome-provenance scenario) that verifies every post-gate user-decision claim in a Preparation WORK draft cites a durable session-record file — not the manager's raw transcript, and not merely a description of the discussion.

## Why

Codex's iter-2 evaluator (`CODEX-PREP-USAGE-FRAME-002`, Low/100, `checklist_gap`/`docs-sync`) found that although this session's revised target passes the inherited `PREP-USAGE-SCENARIO-04-CHECK-01` check, actor/path traceability alone can still pass without proving the post-gate outcome — the canonical checklist has no check that specifically forces the citable-record requirement. The gap is paired with `post-gate-outcome-provenance-scenario` (`CODEX-PREP-USAGE-FRAME-001`): the scenario names the requirement, this checklist item is the concrete yes/no test for it.

## Verification

A future Preparation evaluation, given this checklist item, would fail a draft that claims "the user decided X" without citing a file (only a transcript reference or bare prose) and pass a draft that cites an anchor-resolvable gate-decision record, per this session's own corrected `gate-decisions-iter1.md` pattern.

## Status notes

**Canonical-skill-bundle improvement candidate**, same class as the paired scenario finding — implementing this means editing `.gobbi/projects/gobbi/skills/preparation/checklist.md` directly, outside this session's Scope Contract. Non-blocking (Low/100). Staged under `feature: workflow` per session-record convention; Wrap-up should weigh the true promotion home.

## Related

- [[post-gate-outcome-provenance-scenario]] — the paired scenario_gap this checklist item implements (`CODEX-PREP-USAGE-FRAME-001`)
