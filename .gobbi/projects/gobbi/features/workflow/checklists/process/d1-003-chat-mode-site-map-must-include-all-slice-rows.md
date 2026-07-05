---
name: d1-003-chat-mode-site-map-must-include-all-slice-rows
description: iter1 finding F-CONS-1 / F-USAGE-1 — the D1-003 chat-mode.md site map and validation grep must cover every slice RECORD row, case-insensitively
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [docs-sync, verification]
keywords: [d1-003, chat-mode, site-map, case-sensitivity]
author: claude
scenario: d1-003-chat-staging-wrapup-inventory-extension
item_status: implemented
anchor: novel
implemented_in: null
---

# D1-003 `chat-mode.md` site map and validation grep must cover every slice RECORD row

## What

The iter1 draft's D1-003 affected-file map listed `chat-mode.md:153` (the mini-Ideation slice RECORD
row: "Narrowed PASS path per §4") but omitted `:183` (mini-Planning) and `:201` (mini-Execution),
which carry the identical phrasing. The draft's validation command
(`git grep -nE 'narrowed PASS path'`) is also case-sensitive and misses the actual capital-N
"Narrowed PASS path" wording present at all three sites — tool-verified: 10 case-sensitive hits vs.
13 case-insensitive hits tree-wide.

## Why

Under the recommended (b), all three slice RECORD rows must change to base RECORD. Editing only
`:153` would leave `:183`/`:201` as dangling references to a deleted §4 model, and the
case-sensitive validation grep cannot detect them — a live contradiction survivor that a Planner or
Executor trusting the grep's "clean" result would never see, exactly the failure mode the draft's own
adversarial scenario and its loaded mistakes (`cotouch-enumeration-must-cover-semantic-equivalents`)
warn against.

## Verification

`git grep -niE 'narrowed PASS path' -- .gobbi/projects/gobbi/skills/orchestration/chat-mode.md` → all
occurrences found and classified for edit, case-insensitively.

## Status notes

**Addressed at iter2**: the draft added `chat-mode.md:183` and `:201` to the site map and made every
D1-003 validation grep case-insensitive; the iter2 evaluator tool-verified both lines carry the
identical phrasing and confirmed the 10-vs-13 case-sensitivity count. Cross-ref not double-counted:
F-USAGE-1 (Usage perspective, iter1) raised the same gap from the consumer-impact angle; Consistency
owns the primary record.

## Related

- [[d1-003-chat-staging-wrapup-inventory-extension]] — the design this finding shaped
