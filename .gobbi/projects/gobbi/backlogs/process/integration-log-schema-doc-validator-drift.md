---
name: integration-log-schema-doc-validator-drift
description: "production.md Integration Log schema omits the leading `#` column the validate-integration-log.sh validator requires"
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 0dc5cf75-54c5-4b52-82fa-b18750bdaade
tags: [process, schema, validation, docs-sync]
keywords: [integration-log, production, validator, schema-drift, dual-system]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Integration Log schema drift — doc says 4 columns, validator requires 5

## Context
The dual-system production Integration Log (`working/reconciliation-iter{n}.md`) is documented in
`orchestration/workflow/production.md` § Integration Log with a 4-field row schema —
`delta` / `decision` / `why` / `codex_origin`. But the structural gate
`skills/orchestration/scripts/validate-integration-log.sh` reads `decision` as awk/pipe field `$4`,
which only holds when the table carries a LEADING `#` index column (`| # | delta | decision | why |
codex_origin |`). A producer who follows the doc literally writes a 4-column table; the validator
then reads `delta` at the wrong field, the header never matches, and it false-fails with "no
Integration Log delta table found".

## Why deferred
G2-class (process / tooling hygiene), OUT of the G1 deployment-hygiene scope (C1 + C7). This slip
just occurred in this very session — the G1 Integration Log was authored 4-column per the doc and
the validator rejected it until a `#` column was added. It is a real doc/tool drift but belongs to
a separate process-hygiene cluster, not G1.

## When to pick up
Any time. No prerequisite. Natural fit for a G2 (process/tooling) fix session. The fix is a doc-vs-
tool reconciliation: either (a) update `production.md` § Integration Log to document the 5-column
schema with the leading `#` index (recommended — the validator's column-read is the safer design,
per its own COD-STRUCT-1 rationale), OR (b) relax the validator to locate the `decision` column by
header name rather than fixed field `$4`. Decide one source of truth; align both.

## Suggested approach
Recommend (a): make `production.md` show the canonical 5-column header and a numbered example row,
since the validator already documents WHY it reads a fixed column (avoiding a body-wide grep
false-fail). Add a one-line note that the `#` column is required. Re-run
`validate-integration-log.sh` against a doc-conformant example to confirm `VALID`.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-06-29-0dc5cf75-54c5-4b52-82fa-b18750bdaade/`

## Related
- [[fix-d2-review-findings]] — sibling deployment/process fix queue from the same review campaign
