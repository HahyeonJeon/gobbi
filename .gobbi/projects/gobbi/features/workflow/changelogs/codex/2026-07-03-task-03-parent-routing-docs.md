---
name: task-03-parent-routing-docs
description: Routed parent Codex, delegation, production, and evaluation docs to the Codex bridge prompt-file contract.
type: changelogs
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: []
keywords: [codex, delegation, prompt-file, workflow]
author: codex
shipped_in: 3167b58df663ed5553939d15aa3b65bd71efc0dc
---

# Task 03 Parent Routing Docs

**Task:** `03-align-parent-routing-docs`

## Summary

Task 03 shipped the parent routing updates that connect the Gobbi Codex, delegation, production, and evaluation docs to the new Codex bridge prompt-file contract.

## What changed

- Added `codex/delegation.md` ownership routing to `codex/SKILL.md`.
- Replaced parent examples that standardized `@prompt-file` with `prompt_file=...` plus `codex exec ... - < "$prompt_file"`.
- Clarified that `delegation/SKILL.md` owns producer delegation brief shape, while Codex prompt-file transport lives in `codex/delegation.md`.
- Linked `workflow/production.md` and `workflow/evaluation.md` to `codex/delegation.md` for proposer/evaluator wrapper prompt-file lifecycle and failure behavior.

## Verification

- Markdown link guard passed across the four touched parent docs plus `codex/delegation.md`.
- `git diff --check` passed.
- `scripts/sync-plugin-package.sh --check` passed.
- Stale prompt/vocabulary gate scan passed.
- `.claude`, `.agents`, and plugin skill paths resolve to the same canonical child doc.
- Codex-only evaluation returned `PASS` across all seven perspectives plus Overall.

## Deferred

None for the locked execution scope.

## Related

- [[task-01-codex-bridge-contract]]
- [[task-02-claude-child-doc-exposure]]
