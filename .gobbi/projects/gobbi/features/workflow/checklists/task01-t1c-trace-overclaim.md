---
name: task01-t1c-trace-overclaim
description: Task 01 traces-to field overclaims T1.c anchor whose actual edit lives in Task 02 — checklist item to align traces-to with actual task assignments.
type: checklists
scope: feature
feature: workflow
status: open
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, traces-to, task-accuracy, checklist]
domain: docs-sync
last_updated: 2026-05-24
---

# Task 01 traces-to overclaim — T1.c edit assigned to Task 02

## Situation

Task 01's `traces-to` field at `draft-iter2.md:132` includes `T1-I-T1.c` (git/SKILL.md P2 invocation note). However, the actual P2 invocation note edit is assigned to Task 02 (`02-git-skill-worktree-path-qualifier`), as stated in Task 02's `traces-to` at `draft-iter2.md:154` and confirmed in the Self-review spec-coverage table at `draft-iter2.md:572`.

The Task 01 heading also still reads "T1.a + T1.d (partial)" but traces-to shows T1.a and T1.c.

## Checklist Item

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Task 01 `traces-to` must only include anchors whose actual implementation work happens in Task 01 | novel | pending | Review traces-to fields vs file-map assignments before finalizing any future plan revision |
| 2 | Task heading must match the primary traces-to anchors (not drift to stale anchor names) | novel | pending | Cross-check heading vs traces-to on every plan task before PASS |

## Notes

Low severity — the executor reads `traces-to:` fields and the task `what`, not the heading. The heading mismatch is cosmetic. However, accurate traces-to fields matter for post-execution audit (linking what was implemented to what was planned).

Not addressed in iter2 (out of surgical scope). Carry to iter3 or fix in Execution brief prep.
