---
name: wrap-up-step-2-5-escalation-default
description: "Wrap-up Step 2.5 escalation default — hybrid auto-backfill + NEEDS_CONTEXT"
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [wrap-up, step-2-5, escalation, orchestration]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Wrap-up Step 2.5 escalation default

## Context

When Wrap-up's Step 2.5 detects a prior-loop MEMORIZATION gap, it needs a default action: auto-backfill the gap, escalate via NEEDS_CONTEXT, or some hybrid. The manager surfaced this to the user as a question, because the right answer depends on whether the gap is routing-deterministic (safe to fill automatically) or requires a design/arbitration call (must go back to the user).

## Decision

Use a hybrid escalation default: auto-backfill mechanical gaps, and NEEDS_CONTEXT for gaps that involve a design choice or decision. The user's words: "Auto-backfill and NEEDS_CONTEXT for design or decision."

- **Auto-backfill** when the gap is mechanical / routing-deterministic — e.g., a `scenario_gap` finding routes to `staging/scenarios/{slug}.md` deterministically per `evaluation/SKILL.md § Finding Metadata`. The assistant writes the staging file from the finding's content.
- **NEEDS_CONTEXT** when the gap involves a design choice or decision — e.g., a `design_flaw` finding that flags a routing ambiguity, a finding with `disposition: open` requiring user arbitration, or a finding that spans multiple staging subdirs and needs the user to pick the canonical destination.

## Rationale

A routing-deterministic gap has exactly one valid destination, so escalating it to the user is pure friction; auto-backfill is safe and faster. A gap that needs a design call or arbitration has no single correct fill, so auto-backfilling it would make an autonomous choice the user must own. The hybrid splits cleanly along that line.

## Alternatives considered

- **Always NEEDS_CONTEXT.** Rejected: too friction-heavy for gaps that route deterministically.
- **Always auto-backfill.** Rejected: too autonomous on findings that require user arbitration.

## Consequences

The Step 2.5 specification must classify each detected gap as `mechanical` or `judgment-required`, auto-fill the mechanical gaps inline, aggregate the judgment-required gaps into a single NEEDS_CONTEXT surfacing, and document the classification rules in `wrap-up/SKILL.md` so users can audit the assistant's gap-classification.

## Related

- `design/wrap-up-step-2-5-compliance-check.md` — the Step 2.5 specification that implements this policy.
- `discussions/wrap-up-step-2-5-escalation-shape.md` — the AskUserQuestion exchange that selected the hybrid shape.

## Source

This decision was split out of a two-decision bundle; the full session context — including the companion codex-invocation decision and the deterministically-resolved concerns — is preserved in `archive/decisions/2026-05-23-iter1-user-redirects.md`.
