---
name: validate-integration-log-spec-drift
description: validate-integration-log.sh expects a leading # column but production.md's Integration Log documents 4 columns with no # — the two are out of sync; plus, literal pipes in table cells must be escaped.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-27
session: b5601d38-c988-4f53-b34b-9ace12a55c25
tags: [process]
keywords: [integration-log, validator, spec-drift, production-md, dual-system, pipe-escape]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Reconcile `validate-integration-log.sh` table shape vs `production.md` Integration Log spec

## Context

The dual-system production workflow uses an Integration Log to record every producer decision when integrating a Codex proposal. Two documents govern this log:

1. **`skills/orchestration/workflow/production.md`** — prose spec documenting the Integration Log shape as 4 columns: `delta | decision | why | codex_origin`. No leading `#` column.
2. **`skills/orchestration/scripts/validate-integration-log.sh`** — the bash validator that enforces the log shape. It expects a 5-column table with a leading `#` column: `| # | delta | decision | why | codex_origin |` and reads `decision` from field `$4`.

A log authored to `production.md`'s documented shape (4 columns, no `#`) false-fails the validator with "no table found." A log that passes the validator (5 columns, leading `#`) is not what the prose doc says to write. The two are out of sync.

Evidence from session b5601d38: `working/reconciliation-iter1.md` was authored with the 5-column `| # | delta | decision | why | codex_origin |` shape (which the validator accepts). The prose spec in `production.md` would lead a reader to write the 4-column form, which would then false-fail.

## Additional symptom (2026-06-27, session b5601d38)

Integration Log table cells that contain literal pipes — from shell pipelines (e.g., `cmd1 | cmd2`) or regex alternations (e.g., `foo|bar`) — cause the validator's column-split to shift, producing a false-fail. The validator splits on unescaped `|` characters, so a cell value containing a bare `|` is misread as a column boundary.

Authors must escape literal pipes as `\|` inside Integration Log table cells. The validator's test fixtures and the `production.md` spec should document this escaping requirement explicitly. This was discovered during the wrap-up of session b5601d38 when writing the reconciliation log with cell values that described Codex's proposals (which included `|`-separated column patterns).

## Why deferred

Out of scope for the originating session. Discovered as side-observations while writing the reconciliation log. Fixing the drift requires reading the validator script in detail and deciding which form is canonical — a standalone task, not related to R1/R2/R3.

## When to pick up

No prerequisites. Can be picked up any time. Low urgency — the validator currently works if authors follow the 5-column form (as sessions b5601d38 and prior did) AND escape literal pipes. The risk is that future authors follow `production.md`'s documented shape or include unescaped pipes and produce a log that false-fails.

## Suggested approach

Two options for the column-shape drift:

1. **Update `production.md`** to document the 5-column `| # | delta | decision | why | codex_origin |` shape that the validator actually accepts. Cheapest fix; the validator already works.
2. **Update `validate-integration-log.sh`** to accept the 4-column form without a leading `#` column. Makes the validator match the documented spec. Requires updating field extraction (`$4` → `$3` for `decision`).

Option 1 is recommended (update the doc to match the working tool), unless the `#` column is genuinely unwanted overhead.

For the pipe-escape symptom, the fix is to add a note to both `production.md` and the validator's test fixtures documenting that literal `|` characters in cell values must be escaped as `\|`.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-27-b5601d38-c988-4f53-b34b-9ace12a55c25/`

## Related

- `skills/orchestration/workflow/production.md` — the doc whose Integration Log section is out of sync with the validator
