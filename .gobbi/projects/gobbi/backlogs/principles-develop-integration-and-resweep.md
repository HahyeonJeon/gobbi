---
name: principles-develop-integration-and-resweep
description: Branch docs/principles-skill-improvements (PR #291 draft) diverged from develop; must integrate current develop (#290) and re-verify the principles sweep against the merged result before merging.
type: backlogs
scope: project
status: active
created: 2026-06-05
session: ca2231b3-9567-4cf9-b0d6-f9bd3e2e78ee
tags: [principles, integration, rebase, docs-sync, blocks-merge]
priority: high
disposition: open
---

# Principles sweep branch must integrate develop (#290) and re-verify before merging

## Context

Develop advanced to `f35f939` via PR #290 (feat orchestration: step-level skip key, maxIterations→5, evaluator models→opus/gpt-5.5). The merge-base with `docs/principles-skill-improvements` is now `e981ae0`; the branch is 27 commits ahead and diverged. PR #291 is open as a DRAFT and merge is HELD.

## Overlap files (7 files edited by both #290 and this branch)

PR #290 touched 7 of the 17 files this branch edited:

- `.codex/AGENTS.md`
- `agents/executor.md`
- `skills/delegation/SKILL.md`
- `skills/gobbi/SKILL.md`
- `skills/orchestration/SKILL.md`
- `skills/orchestration/auto-mode.md`
- `skills/orchestration/chat-mode.md`

These 7 files will have conflicts or near-conflicts on integration. PR #290's edits to orchestration files may themselves carry principle references that require reconciliation.

## Steps before merging PR #291

1. Merge `origin/develop` into the branch (or rebase — note rebase needs force-push approval since the branch is already pushed).
2. Resolve conflicts in the 7 overlap files. For each resolved file, verify the principles sweep edits (count=8, cross-refs re-pointed, 3-strike removed) survived the merge correctly.
3. Re-run the sweep verification on the merged result:
   - Count grep: `grep -iE "([0-9]+|twelve|thirteen|fourteen|eight) (iron laws?|principles|behavioral|laws)"` — expect only 8.
   - Stale Principle-N grep: `grep -E "Principle (9|10|11|12|13|14)"` across live instruction docs — expect zero.
   - Discipline audit: confirm 3-strike rule is absent from all live docs.
4. Re-run dual-system evaluation (Claude + Codex) on the merged result.
5. Mark PR #291 ready for review only after steps 1-4 pass.

## BLOCKS

This backlog BLOCKS the merge of PR #291 into develop.
