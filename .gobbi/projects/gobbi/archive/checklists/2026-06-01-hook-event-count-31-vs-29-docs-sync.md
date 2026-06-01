---
name: hook-event-count-31-vs-29-docs-sync
description: Implementation checklist — correct all "31 hook events" claims in guardrails docs to "29" (verified count).
type: checklists
scope: feature
feature: guardrails
status: addressed
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [hooks, docs-sync, event-count, checklist]
disposition: addressed
shipped_in: "session 34563fb4 (commits 84521bc + iter2 remediation)"
archived_at: 2026-06-01
archive_reason: addressed
---

# Hook event count claim (31) contradicts captured evidence (29)

## What

Correct all "31 hook events" claims in the guardrails docs to "29" (the verified enumerated count):

- [x] In `features/guardrails/references/claude-code-posttooluse-hook-schema.md`: if the header or body claims "31 events", update to "29" (verified enumerated count). (corrected to **30**, not 29 — see Resolution)
- [x] Scan all guardrails docs for other occurrences of the "31" hook event count claim and correct each. (corrected to **30**, not 29 — see Resolution)
- [x] After update: `grep -rn '"31 hook' features/guardrails/` returns 0 matches (all corrected to 29). (corrected to **30**, not 29 — see Resolution; 0 matches in reference and README after this session; remaining matches are inside these now-resolved tracking files, which archive at Wrap-up)

## Why

The guardrails Ideation artifacts and the reference `features/guardrails/references/claude-code-posttooluse-hook-schema.md` claim the official hooks page lists 31 hook events. That same reference itself enumerates only 29 event names. The current official page visible lifecycle list also shows 29 events. An evaluator independently fetched the page and confirmed 29. The `PostToolUseFailure` event itself is verified by both Claude and Codex evaluators — this is a supporting-prose defect, not an operational blocker.

## Verification

`grep -rn '"31 hook' features/guardrails/` returns 0 matches after the sweep — every "31" hook-event-count claim has been corrected to the verified enumerated count of 29.

## Status notes

Pending — this is a tracked docs-sync item, not yet swept. The count correction is support prose; the load-bearing `PostToolUseFailure` claim is already independently verified, so this does not block any operational work.

## Related

- `features/guardrails/references/claude-code-posttooluse-hook-schema.md` (the reference carrying the claim)
- Surfaced as an Overall-perspective evaluator finding during the guardrails Ideation evaluation (provenance in that session's evaluation artifacts).
- See also `../backlogs/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` (backlog form of same item; archived 2026-06-01)

## Resolution (2026-06-01)

The live count was independently re-verified on 2026-06-01 via Claude WebFetch, Codex, and a raw-HTML parse (curl + Python row-count of the lifecycle table) as **30**, not 29. The "29" this checklist assumed as the correction target was itself stale: the page gained `MessageDisplay` at position 12 (between Notification and SubagentStart) since the 2026-05-23 capture. The reference file and README were corrected to 30 this session (commit 84521bc + iter2 remediation, session 34563fb4). Archive (project-level `archive/backlogs/` and `archive/checklists/`) deferred to Wrap-up per the archive-template sole-writer rule.
