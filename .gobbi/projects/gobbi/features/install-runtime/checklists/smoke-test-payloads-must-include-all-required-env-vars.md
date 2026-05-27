---
name: smoke-test-payloads-must-include-all-required-env-vars
description: Smoke-test commands in skills must include all required env vars to be directly runnable
type: checklists
scope: feature
feature: install-runtime
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [smoke-test, env-vars, checklist, docs-sync, usage]
---

# Smoke-test examples must include all required runtime prerequisites (env vars, etc.)

## Check

When a skill provides a smoke-test or verification command, the example must be directly runnable — including all required environment variables. An example that omits a required env var will fail on a step unrelated to the code under test, creating misleading friction.

## Evidence

`gobbi-hook-authoring/SKILL.md` originally used a `...` placeholder in the smoke-test payload — not a runnable example. A first fix replaced the placeholder with concrete JSON payloads (SessionStart + PostToolUse) but the SessionStart success test still omitted `CLAUDE_ENV_FILE`, causing it to exit 1 before testing the payload at all. A second fix added `CLAUDE_ENV_FILE=/tmp/...` to make the SessionStart success test directly runnable.

## Scenario gap

For any skill with a smoke-test section: before shipping, run the exact command verbatim in a clean shell and verify it exits as documented. If it fails on a prerequisite rather than the code under test, the example is incomplete.

## Addressed

Commits `5d2a7c6` + `a7ac0d7` completed the fix. Verified: SessionStart exits 0 with CLAUDE_ENV_FILE set.
