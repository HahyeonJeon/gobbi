---
name: wrap-up-step-2-5-escalation-shape
description: User selected hybrid escalation for Wrap-up Step 2.5 — auto-backfill mechanical gaps, NEEDS_CONTEXT for design or decision gaps.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [wrap-up, step-2-5, escalation, hybrid, memorization]
topic: wrap-up-step-2-5-escalation-shape
---

# Wrap-up Step 2.5 escalation shape — hybrid auto-backfill selected

## What was asked

Q: "When Wrap-up Step 2.5 detects a staging gap, should it: (a) always NEEDS_CONTEXT, (b) auto-fill all gaps, or (c) auto-fill mechanical gaps + NEEDS_CONTEXT for design/decision gaps?"

## User answer

"Auto-backfill and NEEDS_CONTEXT for design or decision."

## Decision and consequence

Hybrid (Option c) locked. Implementation:
1. Classify each gap as `mechanical` (Type in {`scenario_gap`, `checklist_gap`, `general`} + single Domain + deterministic routing) or `judgment-required` (Type in {`design_flaw`, `assumption_risk`}; OR `disposition: open`; OR missing/unrecognized Type/Domain; OR multi-subdir span).
2. Auto-fill mechanical gaps inline, respecting `evaluation/SKILL.md § Slug + collision policy` (lines 385-393) pre-write check.
3. Aggregate judgment-required gaps into a single NEEDS_CONTEXT with `user-question:` block.
4. Document classification rules in `wrap-up/SKILL.md` for auditability.

The final vocabulary uses the actual 5 Types (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) — NOT `improvement` or `bug`.

## Source

iter1-user-redirects.md § Decision 1 + iter3 vocabulary repair
