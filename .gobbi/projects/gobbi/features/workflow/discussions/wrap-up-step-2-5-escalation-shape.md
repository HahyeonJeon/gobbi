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

## Context

The Wrap-up Step 2.5 design needed a default behavior for when the compliance check detects a staging gap. The choice affects how autonomous the assistant is: filling every gap risks making decisions the user should own, while escalating every gap adds friction for gaps that have one obvious destination. The leader surfaced the three candidate shapes to the user.

## Question

When Wrap-up Step 2.5 detects a staging gap, should it: (a) always NEEDS_CONTEXT, (b) auto-fill all gaps, or (c) auto-fill mechanical gaps and NEEDS_CONTEXT for design/decision gaps?

## Options considered

1. **(c) Hybrid** — auto-fill mechanical gaps, NEEDS_CONTEXT for design/decision gaps.
2. **(a) Always NEEDS_CONTEXT** — escalate every gap to the user.
3. **(b) Auto-fill all gaps** — fill every gap autonomously.

## User decision

The hybrid (option c): "Auto-backfill and NEEDS_CONTEXT for design or decision."

## Implication

The hybrid is locked. The Step 2.5 implementation must:
1. Classify each gap as `mechanical` (Type in {`scenario_gap`, `checklist_gap`, `general`} + single Domain + deterministic routing) or `judgment-required` (Type in {`design_flaw`, `assumption_risk`}; OR `disposition: open`; OR missing/unrecognized Type/Domain; OR multi-subdir span).
2. Auto-fill mechanical gaps inline, respecting the `evaluation/SKILL.md § Slug + collision policy` pre-write check.
3. Aggregate judgment-required gaps into a single NEEDS_CONTEXT with a `user-question:` block.
4. Document the classification rules in `wrap-up/SKILL.md` for auditability.

The final vocabulary uses the actual 5 Types (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) — NOT `improvement` or `bug`.

## Related

- `decisions/wrap-up-step-2-5-escalation-default.md` — the decision record that fixes this hybrid policy.
- `design/wrap-up-step-2-5-compliance-check.md` — the Step 2.5 specification implementing it.

## Source

The full session context is preserved in `archive/decisions/2026-05-23-iter1-user-redirects.md` (the bundle this exchange was drawn from).
