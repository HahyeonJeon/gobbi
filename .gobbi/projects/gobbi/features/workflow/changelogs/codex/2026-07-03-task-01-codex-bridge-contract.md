---
name: task-01-codex-bridge-contract
description: Created the Codex bridge prompt-file contract child doc.
type: changelogs
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: []
keywords: [codex, bridge, prompt-file]
author: codex
shipped_in: 9a7ebe525180fef787e56d20cf90d21610fa3c1e
---

# Task 01 Codex Bridge Contract

**Task:** `01-author-codex-bridge-contract`

## Summary

Task 01 shipped the canonical `codex/delegation.md` child doc. It defines the prompt-file contract for Claude wrapper agents that invoke Codex through `codex exec`.

## What changed

- Added `.gobbi/projects/gobbi/skills/codex/delegation.md`.
- Documented prompt-file lifecycle, required prompt sections, proposer and evaluator output contracts, wrapper verification gates, and failure behavior.
- Standardized full prompt files on `codex exec ... - < "$prompt_file"`.
- Preserved the known failure rules for empty output, timeout, wrong-root writes, source-write violations, and wrapper self-authoring.

## Verification

- Task commit `9a7ebe525180fef787e56d20cf90d21610fa3c1e` contains exactly one committed source file.
- Markdown links in the new child doc resolve.
- Required headings and stale-pattern absence checks passed.
- Codex-only evaluation returned `PASS` across all seven perspectives plus Overall.

## Deferred

- Task 02 owns Claude mirror exposure for `codex/delegation.md`.
- Task 03 owns parent-doc routing updates.

## Related

- [[bounded-codex-bridge-orchestration-contract]]
