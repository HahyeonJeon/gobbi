---
finding_id: USAGE-001
finding_source: T04-iter1-codex-usage + T04-iter1-claude-usage
type: general
domain: docs-sync
disposition: addressed
addressed_in: T04-iter2 (commit 5d2a7c6)
confidence: 100
severity: High (Codex) / Medium (Claude)
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
task: task-04
loop: execution
---

# Skill registration examples must mirror real settings.json command object shape

## Check

When a project skill teaches hook registration (e.g., `gobbi-hook-authoring`), every settings.json command object example MUST include all required fields from the real settings. As of this session:
- `"type": "command"` is required — skills must not omit it
- Commands must be bare paths (no `bash ` prefix) — skills must reflect the real convention

## Evidence

`gobbi-hook-authoring/SKILL.md` iter1 used `"command": "bash .claude/hooks/..."` without `"type": "command"`. The real `.claude/settings.json:35-36`, `:43-44`, `:51-52` use `{ "type": "command", "command": ".claude/hooks/..." }`. Resolved in iter2 by aligning the P1 examples and adding the SessionStart block that iter1 omitted.

## Scenario gap

For any future skill that teaches hook registration: include a verification check — "does the registration JSON block include every field from the real settings.json hook objects?" — before shipping.

## Addressed

Commit `5d2a7c6` corrected all examples. Regression grep: `grep '"command": "bash '` → NONE.
