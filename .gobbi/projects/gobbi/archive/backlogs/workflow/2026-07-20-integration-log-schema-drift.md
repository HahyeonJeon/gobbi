---
name: integration-log-schema-drift
description: "production.md documents the Integration Log as 4 columns; the validator requires a 5th leading # column"
type: backlogs
scope: project
feature: null
status: closed
created: 2026-07-05
session: 0bf4a2a4-9676-4159-a866-49d8e6fe3680
tags: [schema, docs-sync, validation]
keywords: [integration-log, production, validator, doc-drift]
author: claude
priority: low
project-scope: true
archived_at: 2026-07-20
archive_reason: dropped
---

# Integration Log schema drift — production.md vs validate-integration-log.sh

**Found during** 2026-07-05 GEN-D2-001 fix session, Ideation iter1 integration-log validation.

**What:** `orchestration/workflow/production.md` § Integration Log documents the delta-table columns as
`delta | decision | why | codex_origin` (4 columns, no row-number). But
`skills/orchestration/scripts/validate-integration-log.sh` requires a **5-column** shape
`| # | delta | decision | why | codex_origin |` — it locates the header by trimmed column `$3 == "delta"`
AND `$4 == "decision"`, which only holds when a leading `#` row-number column is present. A leader that
follows production.md's documented 4-column schema produces a log the validator rejects with
"no Integration Log delta table found."

**Impact:** every dual-system loop's Integration Log fails the pre-evaluation structural gate unless the
producer happens to add the undocumented `#` column. This session's Ideation log had to be hand-patched
(added the `#` column) to pass the gate.

**Fix options:** (a) update production.md § Integration Log to document the 5-column `| # | ... |` shape the
validator enforces; OR (b) relax the validator to detect the header by `delta`+`decision` columns in ANY
positions (not fixed $3/$4). Prefer (a) — align the doc to the enforcement gate — unless the `#` column is
deemed unnecessary, in which case (b).

**Why (root):** doc and its enforcement script drifted; the validator is the enforcement contract but the
spec doc is what producers read. Same doc-vs-tooling drift class as several 2026-07-01 review findings.
