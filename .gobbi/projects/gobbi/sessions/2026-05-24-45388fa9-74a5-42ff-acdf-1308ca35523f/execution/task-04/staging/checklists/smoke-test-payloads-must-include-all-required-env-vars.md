---
finding_id: USAGE-002 / USAGE-002-R
finding_source: T04-iter1-codex-usage + T04-iter2-codex-usage
type: checklist_gap
domain: docs-sync
disposition: addressed
addressed_in: T04-iter2 (partial: removed `...`) + T04-iter3 (full: added CLAUDE_ENV_FILE) (commits 5d2a7c6 + a7ac0d7)
confidence: 95
severity: Low
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
task: task-04
loop: execution
---

# Smoke-test examples must include all required runtime prerequisites (env vars, etc.)

## Check

When a skill provides a smoke-test or verification command, the example must be directly runnable — including all required environment variables. An example that omits a required env var will fail on a step unrelated to the code under test, creating misleading friction.

## Evidence

`gobbi-hook-authoring/SKILL.md` iter1 P7 used `...` placeholder in the payload — not a runnable example. iter2 replaced with concrete JSON payloads (SessionStart + PostToolUse) but the SessionStart success test still omitted `CLAUDE_ENV_FILE`, causing it to exit 1 before testing the payload at all. iter3 added `CLAUDE_ENV_FILE=/tmp/...` to make the SessionStart success test directly runnable.

## Scenario gap

For any skill with a smoke-test section: before shipping, run the exact command verbatim in a clean shell and verify it exits as documented. If it fails on a prerequisite rather than the code under test, the example is incomplete.

## Addressed

Commit `a7ac0d7` (iter3) completed the fix. Verified: SessionStart exits 0 with CLAUDE_ENV_FILE set.
