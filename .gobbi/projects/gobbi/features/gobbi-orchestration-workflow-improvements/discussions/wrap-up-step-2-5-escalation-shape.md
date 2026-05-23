---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
feature: gobbi-orchestration-workflow-improvements
loop: ideation
iter: 3
topic: wrap-up-step-2-5-escalation-shape
status: final
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/discussions/wrap-up-step-2-5-escalation-shape.md
promoted-at: 2026-05-23T14:00:00Z
---

# Discussion: Wrap-up Step 2.5 Escalation Shape (Post-WORK iter1 Redirect)

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
