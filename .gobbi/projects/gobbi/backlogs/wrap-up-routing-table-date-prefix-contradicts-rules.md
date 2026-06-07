---
name: wrap-up-routing-table-date-prefix-contradicts-rules
description: The wrap-up routing table maps decisions and discussions to bare-slug destinations, contradicting memorization/rules.md §1.2 which requires date-prefixed filenames for both types.
type: backlogs
scope: project
feature: null
status: active
created: 2026-06-07
session: b02c3111-68be-4558-a19f-fabf9627602f
tags: [wrap-up, routing-table, date-prefix, docs-sync, naming-standard]
priority: medium
disposition: open
project-scope: true
shipped_in: null
---

# Wrap-up routing table date-prefix contradicts rules

## Context

`memorization/rules.md §1.2` defines two filename modes keyed to whether content is intrinsically time-indexed:

- **Date-prefixed** types: `notes`, `reviews`, `reports`, `changelogs`, `decisions`, `plans`, `discussions`, `archive entries` — pattern `YYYY-MM-DD-{slug}.md`.
- **Bare-slug** types: `features`, `mistakes`, `rules`, `learnings`, `design`, `references`, `backlogs`, `scenarios`, `checklists` — pattern `{slug}.md`.

The `wrap-up/SKILL.md` "Staging → Project-memory routing" table governs how each staging path maps to its project-memory destination. Two rows in that table are inconsistent with §1.2:

| Routing table row | Table says | §1.2 requires |
|---|---|---|
| `staging/decisions/{slug}.md` → | `features/{feature-name}/decisions/{slug}.md` | `features/{feature-name}/decisions/{date}-{slug}.md` |
| `staging/discussions/{slug}.md` → | `features/{feature-name}/discussions/{slug}.md` | `features/{feature-name}/discussions/{date}-{slug}.md` |

The `plans` row is correct: `sessions/.../planning/staging/plans/{slug}.md` → `features/{feature-name}/plans/{date}-{slug}.md` — the date prefix is present.

## Why deferred

Editing `wrap-up/SKILL.md` is an Always-Ask skill edit (user confirmation required before changes to any skill file). This requires a dedicated session to review the routing table change, confirm the fix with the user, and verify no other rows carry the same drift.

## When to pick up

No hard prerequisites. Can run any time as a standalone docs-sync session. Recommended to pick up before the next session that produces `decisions/` or `discussions/` promotions, to prevent a repeat.

## Suggested approach

1. Open `wrap-up/SKILL.md` § Staging → Project-memory routing.
2. Update the `staging/decisions/{slug}.md` row: destination → `features/{feature-name}/decisions/{date}-{slug}.md`.
3. Update the `staging/discussions/{slug}.md` row: destination → `features/{feature-name}/discussions/{date}-{slug}.md`.
4. Confirm no other routing rows are missing date prefixes for types §1.2 lists as date-prefixed.
5. Run dual-system evaluation on the change.

## Originating session

This backlog was identified during the dual-system Wrap-up evaluation of session `2026-06-07-b02c3111-68be-4558-a19f-fabf9627602f`. The Wrap-up assistant followed the routing table (bare-slug) and produced `decisions/p9-p10-locked-design.md` and `discussions/p9-p10-title-boundary-scope.md`; the evaluators flagged both against §1.2 (STRUCT-001 / dead-path findings). Remediation renamed the files to the dated form in iter2. The routing table itself was not fixed in that session — that requires an Always-Ask skill edit, deferred to this backlog.

Evidence path: `.gobbi/projects/gobbi/sessions/2026-06-07-b02c3111-68be-4558-a19f-fabf9627602f/wrap-up/rawdata/promotion-manifest.md` (iter2 remediation entry).
