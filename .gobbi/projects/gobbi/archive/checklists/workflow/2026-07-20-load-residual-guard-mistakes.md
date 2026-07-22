---
name: load-residual-guard-mistakes
description: "Load the four project traps that directly govern residual and absence checks in Task 02."
type: checklists
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, validation, verification]
keywords: [residual-guard, exact-pattern, gitignore, allowlist]
author: codex
scenario: classify-every-residual-scan-hit
item_status: pending
anchor: novel
implemented_in: null
archived_at: 2026-07-20
archive_reason: addressed
---

# Load residual-guard mistakes

## What

Task 02 loads `grep-absence-claim-needs-exact-pattern`, `literal-grep-gate-false-fails-legitimate-usage`, `gitignore-aware-residual-gate`, and `whole-file-allowlist-false-passes-same-file-residual`.

## Why

The iter2 task edited the exact validation surface governed by these project traps but did not declare them.

## Verification

All four exact project-mistake paths appear in Task 02's assignment and resolve to existing files.

## Status notes

Codex `CDEX-PLAN-I2-STR-002` was open in iter2 and mechanically addressed in iter3.

## Related

- [[deterministic-codex-model-policy]] - the Task 02 assignment.
