---
slug: wrap-up-step-2-5-escalation-default
title: "Wrap-up Step 2.5 escalation default — hybrid auto-backfill + NEEDS_CONTEXT"
domain: docs-sync
type: design_flaw
disposition: addressed
mistake-candidate: false
project: gobbi
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
created: 2026-05-23
status: active
supersedes: null
date: 2026-05-23
feature: gobbi-orchestration-workflow-improvements
superseded_by: null
---

# Wrap-up Step 2.5 escalation default

Split from the iter1 user-redirects bundle (Decision 1). Full session context — including the codex invocation decision (Decision 2) and the deterministically-resolved concerns 1/4/6 — is preserved in `archive/decisions/2026-05-23-iter1-user-redirects.md`.

## Question

After the leader's iter1 draft returned DONE_WITH_CONCERNS, the manager surfaced the Wrap-up Step 2.5 escalation default to the user: when the assistant detects a prior-loop MEMORIZATION gap, should it auto-backfill, escalate via NEEDS_CONTEXT, or both?

## Resolution

**User answer**: "Auto-backfill and NEEDS_CONTEXT for design or decision." — Hybrid (Option 3 in the manager's question card).

- **Auto-backfill** when the gap is mechanical / routing-deterministic — e.g., a `scenario_gap` finding routes to `staging/scenarios/{slug}.md` deterministically per `evaluation/SKILL.md § Finding Metadata`. Assistant writes the staging file from the finding's content.
- **NEEDS_CONTEXT** when the gap involves a design choice or decision — e.g., a `design_flaw` finding that flags a routing ambiguity, a finding with `disposition: open` requiring user arbitration, or a finding that spans multiple staging subdirs and needs user to pick the canonical destination.

## Implementation impact on Design D

Leader must respec Step 2.5 to:
1. Classify each detected gap as `mechanical` or `judgment-required`.
2. Auto-fill `mechanical` gaps inline.
3. Aggregate `judgment-required` gaps into a single NEEDS_CONTEXT surfacing.
4. Document the classification rules in `wrap-up/SKILL.md` so users can audit the assistant's gap-classification.
