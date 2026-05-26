---
name: hook-event-count-31-vs-29-docs-sync
description: Deferred docs-sync — correct the "31 hook events" claim to "29" in any surviving references and planning artifacts.
type: backlogs
scope: feature
feature: guardrails
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, docs-sync, event-count, deferred]
priority: low
disposition: open
project-scope: false
shipped_in: null
---

# Hook event count claim (31) contradicts captured evidence (29)

## Context

The session planning artifact for the hook + reconstructor task, and the reference file `features/guardrails/references/claude-code-posttooluse-hook-schema.md`, claim the official hooks page lists 31 hook events. That reference file itself enumerates 29 event names. The current official page visible lifecycle list also shows 29 events. A Codex evaluator independently fetched the page and confirmed 29.

The `PostToolUseFailure` event itself is verified by both Claude and Codex evaluators — this is a supporting-prose defect, not an operational blocker.

## Why deferred

Accepted as a non-blocking docs-sync finding at Ideation exit. The load-bearing claim — that `PostToolUseFailure` is a supported shell-command hook event — is independently verified. The count is support prose. Correcting it requires a 2-3 word change in multiple locations and was not worth blocking Planning.

## When to pick up

When authoring or editing `.claude/settings.json` hook registration for PostToolUseFailure, or during any sweep of the guardrails references.

## Suggested approach

- In `features/guardrails/references/claude-code-posttooluse-hook-schema.md`: if the header claims "31 events", update to "29".
- Verify no other guardrails docs repeat the "31" claim.
- After update: `grep -rn '"31 hook' features/guardrails/` returns 0 matches.

## Originating session

`.gobbi/projects/gobbi/sessions/` — originated in session 1b26cf20 guardrails Ideation evaluation (Codex overall finding COD-OVERALL-ITER3-001).

## Related

- `features/guardrails/references/claude-code-posttooluse-hook-schema.md` (the reference carrying the "31" claim)
- Codex evaluator overall finding COD-OVERALL-ITER3-001 (provenance)
- See also `features/guardrails/checklists/hook-event-count-31-vs-29-docs-sync.md` (checklist form of same item)
