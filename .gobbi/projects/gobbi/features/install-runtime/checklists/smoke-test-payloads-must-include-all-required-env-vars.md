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

## What

When a skill provides a smoke-test or verification command, the example must be directly runnable — including all required environment variables. An example that omits a required env var fails on a step unrelated to the code under test, creating misleading friction for the reader who copies it verbatim.

## Why

`gobbi-hook-authoring/SKILL.md` originally used a `...` placeholder in the smoke-test payload — not a runnable example. Replacing the placeholder with concrete JSON payloads (SessionStart + PostToolUse) was not enough: the SessionStart success test still omitted `CLAUDE_ENV_FILE`, so it exited 1 (the env guard) before the payload was ever exercised. The example looked complete but failed on a prerequisite rather than on the code under test — exactly the misleading-friction failure this checklist exists to prevent.

## Verification

For any skill with a smoke-test section, run the exact command verbatim in a clean shell before shipping and confirm it exits as documented. If it fails on a prerequisite (e.g. a missing env var) rather than on the code under test, the example is incomplete. After the fix here, the SessionStart success test exits 0 with `CLAUDE_ENV_FILE` set.

## Status notes

Addressed — commits `5d2a7c6` and `a7ac0d7` replaced the placeholder with concrete payloads and added `CLAUDE_ENV_FILE=/tmp/...` to the SessionStart success test. Verified: SessionStart exits 0 with `CLAUDE_ENV_FILE` set.
