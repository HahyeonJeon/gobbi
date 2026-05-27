---
name: hook-skill-exit-behavior-must-enumerate-all-fatal-paths
description: Hook skill docs must enumerate all fatal exit paths, split by hook event class
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [hook, exit-behavior, checklist, docs-sync, consistency]
---

# Hook skill must enumerate all fatal exit paths, split by hook event class

## Check

When a project skill documents hook exit behavior, ALL fatal exit conditions must be listed — not just the most common one. Additionally, testing-section failure-path expectations must be split by hook event class (e.g., SessionStart is fatal on malformed JSON; PostToolUse uses `bail()` and always exits 0).

## Evidence

`gobbi-hook-authoring/SKILL.md` originally stated `session-start.sh` exits 1 "only if `$CLAUDE_ENV_FILE` is unset or unwritable" — omitting empty-stdin and strict-mode export failures. A follow-up evaluation round fixed the core principle statement but left the testing section (P7) with a generic malformed-JSON expectation that contradicted the corrected principle. A second remediation split P7 by hook class: SessionStart malformed JSON → non-zero exit; PostToolUse malformed JSON → exit 0 via `bail()`.

## Scenario gap

For any future hook-documentation skill: (1) enumerate ALL fatal paths (not "only" the env guard); (2) ensure the testing section's failure-path expectations match the corrected documentation, split by hook event class where behavior differs.

## Addressed

Commits `5d2a7c6` + `a7ac0d7` completed the fix. Live smoke tests verified: malformed JSON exits non-zero on SessionStart, exit 0 on PostToolUse (via bail).
