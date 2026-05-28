---
name: hook-event-count-31-vs-29-docs-sync
description: Implementation checklist — correct all "31 hook events" claims in guardrails docs to "29" (verified count).
type: checklists
scope: feature
feature: guardrails
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, docs-sync, event-count, checklist]
---

# Hook event count claim (31) contradicts captured evidence (29)

## What

Correct all "31 hook events" claims in the guardrails docs to "29" (the verified enumerated count):

- [ ] In `features/guardrails/references/claude-code-posttooluse-hook-schema.md`: if the header or body claims "31 events", update to "29" (verified enumerated count).
- [ ] Scan all guardrails docs for other occurrences of the "31" hook event count claim and correct each.
- [ ] After update: `grep -rn '"31 hook' features/guardrails/` returns 0 matches (all corrected to 29).

## Why

The guardrails Ideation artifacts and the reference `features/guardrails/references/claude-code-posttooluse-hook-schema.md` claim the official hooks page lists 31 hook events. That same reference itself enumerates only 29 event names. The current official page visible lifecycle list also shows 29 events. An evaluator independently fetched the page and confirmed 29. The `PostToolUseFailure` event itself is verified by both Claude and Codex evaluators — this is a supporting-prose defect, not an operational blocker.

## Verification

`grep -rn '"31 hook' features/guardrails/` returns 0 matches after the sweep — every "31" hook-event-count claim has been corrected to the verified enumerated count of 29.

## Status notes

Pending — this is a tracked docs-sync item, not yet swept. The count correction is support prose; the load-bearing `PostToolUseFailure` claim is already independently verified, so this does not block any operational work.

## Related

- `features/guardrails/references/claude-code-posttooluse-hook-schema.md` (the reference carrying the claim)
- Surfaced as an Overall-perspective evaluator finding during the guardrails Ideation evaluation (provenance in that session's evaluation artifacts).
- See also `features/guardrails/backlogs/hook-event-count-31-vs-29-docs-sync.md` (backlog form of same item)
