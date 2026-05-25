---
finding_id: CONSISTENCY-002 / CONSISTENCY-002-R
finding_source: T04-iter1-codex-consistency + T04-iter2-codex-consistency
type: general
domain: docs-sync
disposition: addressed
addressed_in: T04-iter2 (partial: core principle) + T04-iter3 (full: P7 testing section) (commits 5d2a7c6 + a7ac0d7)
confidence: 100
severity: Medium
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
task: task-04
loop: execution
---

# Hook skill must enumerate all fatal exit paths, split by hook event class

## Check

When a project skill documents hook exit behavior, ALL fatal exit conditions must be listed — not just the most common one. Additionally, testing-section failure-path expectations must be split by hook event class (e.g., SessionStart is fatal on malformed JSON; PostToolUse uses `bail()` and always exits 0).

## Evidence

`gobbi-hook-authoring/SKILL.md` iter1 stated `session-start.sh` exits 1 "only if `$CLAUDE_ENV_FILE` is unset or unwritable" — omitting empty-stdin and strict-mode export failures. iter2 fixed the core principle statement but left P7 with a generic malformed-JSON expectation that contradicted the corrected principle. iter3 split P7 by hook class: SessionStart malformed JSON → non-zero exit; PostToolUse malformed JSON → exit 0 via `bail()`.

## Scenario gap

For any future hook-documentation skill: (1) enumerate ALL fatal paths (not "only" the env guard); (2) ensure the testing section's failure-path expectations match the corrected documentation, split by hook event class where behavior differs.

## Addressed

Commit `a7ac0d7` (iter3) completed the fix. Live smoke tests verified: malformed JSON exits non-zero on SessionStart, exit 0 on PostToolUse (via bail).
