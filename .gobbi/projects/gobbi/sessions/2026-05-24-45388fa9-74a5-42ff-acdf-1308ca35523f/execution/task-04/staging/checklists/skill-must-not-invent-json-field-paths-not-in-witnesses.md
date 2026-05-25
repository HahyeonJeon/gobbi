---
finding_id: CONSISTENCY-001
finding_source: T04-iter1-codex-consistency + T04-iter1-claude-consistency
type: general
domain: docs-sync
disposition: addressed
addressed_in: T04-iter2 (commit 5d2a7c6)
confidence: 100
severity: Medium
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
task: task-04
loop: execution
---

# Skills must not invent JSON field paths that don't exist in the witness payload

## Check

When a project skill documents hook payload fields, every field path reference must be verified against the real hook script. No nested paths may be documented unless the witness actually uses them.

## Evidence

`gobbi-hook-authoring/SKILL.md` iter1 described the SessionStart matcher as matched against `hook_event_name.source` — a nested path that does not exist. The real witnesses have top-level `hook_event_name` and top-level `source` as separate fields (exported separately at `session-start.sh:54-55`). Resolved in iter2 by replacing with real top-level `source` field and clarifying the distinction.

## Scenario gap

For any future hook-documentation skill: add a check — "does every documented payload field path correspond to a real top-level (or nested, if so) field in the witness script?" — before shipping.

## Addressed

Commit `5d2a7c6` corrected the field path. Regression grep: `grep 'hook_event_name\.source'` → NONE.
