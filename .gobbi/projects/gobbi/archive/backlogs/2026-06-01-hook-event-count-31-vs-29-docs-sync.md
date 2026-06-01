---
name: hook-event-count-31-vs-29-docs-sync
description: Deferred docs-sync — correct the "31 hook events" claim to "29" in any surviving references and planning artifacts.
type: backlogs
scope: feature
feature: guardrails
status: addressed
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, docs-sync, event-count, deferred]
priority: low
disposition: addressed
project-scope: false
shipped_in: "session 34563fb4 (commits 84521bc + iter2 remediation)"
archived_at: 2026-06-01
archive_reason: addressed
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

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/` — surfaced by the Codex Overall-perspective evaluator on the third evaluation iteration of that session's guardrails Ideation, which flagged the "31 hook events" count as unsupported by the captured enumeration.

## Related

- `features/guardrails/references/claude-code-posttooluse-hook-schema.md` (the reference carrying the "31" claim)
- Provenance: the Codex Overall-perspective evaluator finding on iteration 3 of that session's guardrails Ideation evaluation
- See also `features/guardrails/checklists/hook-event-count-31-vs-29-docs-sync.md` (checklist form of same item)

## Resolution (2026-06-01)

The live count was independently re-verified on 2026-06-01 via Claude WebFetch, Codex, and a raw-HTML parse (curl + Python row-count of the lifecycle table) as **30**, not 29. The "29" this item assumed was itself stale: the page gained `MessageDisplay` at position 12 (between Notification and SubagentStart) since the 2026-05-23 capture that produced the "29" figure. All 29 previously-captured names remain present; `MessageDisplay` is the single net addition.

The reference file `features/guardrails/references/claude-code-posttooluse-hook-schema.md` was corrected to 30 (commit 84521bc, session 34563fb4) — the event count, full enumeration, and all prose referring to "31" updated to "30". The README `## Open items` bullet was removed and a `## Recent activity` row added.

Note on the closure gate: `grep -rn '"31 hook' features/guardrails/` will reach 0 matches only after this resolved item (and the companion checklist `checklists/hook-event-count-31-vs-29-docs-sync.md`) are archived out of `features/guardrails/` into `archive/backlogs/` at Wrap-up. The files are left in place here per the archive-template sole-writer rule; physical archive `git mv` is a Wrap-up-only operation.
