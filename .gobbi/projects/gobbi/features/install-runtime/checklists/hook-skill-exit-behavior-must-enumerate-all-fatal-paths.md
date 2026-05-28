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

## What

When a project skill documents hook exit behavior, it must list ALL fatal exit conditions — not just the most common one — and its testing-section failure-path expectations must be split by hook event class wherever behavior differs. For gobbi's hooks: SessionStart is fatal (non-zero exit) on malformed JSON; PostToolUse uses `bail()` and always exits 0.

## Why

`gobbi-hook-authoring/SKILL.md` originally stated that `session-start.sh` exits 1 "only if `$CLAUDE_ENV_FILE` is unset or unwritable," omitting the empty-stdin and strict-mode export failures that are also fatal. A later fix corrected the core principle statement but left the testing section with a generic malformed-JSON expectation that contradicted the corrected principle — so the doc described two different exit behaviors in two places. The lesson: enumerate every fatal path (not "only" the env guard), and keep the testing section's failure expectations consistent with the principle, split by hook class because SessionStart and PostToolUse exit differently on the same bad input.

## Verification

Live smoke tests confirm the documented behavior: malformed JSON exits non-zero on SessionStart and exits 0 on PostToolUse (via `bail()`). A future hook-documentation skill verifies by running each hook class against malformed input and checking the exit code matches the documented per-class expectation.

## Status notes

Addressed — commits `5d2a7c6` and `a7ac0d7` completed the fix (corrected the principle statement and split the testing-section expectations by hook class). Live smoke tests verified both exit behaviors.
