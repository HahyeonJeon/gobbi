---
name: bundle-b-rehome
description: Bundle B (session-foundations-bundle-b) durable artifacts re-homed into evaluation during the memory-system redesign.
type: changelogs
scope: feature
feature: evaluation
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-redesign, re-home, bundle-b]
shipped_in: memory-redesign W3-T3
---

# Bundle B re-home into `evaluation`

**Task:** Re-home Bundle B's (`features/session-foundations-bundle-b`) durable evaluation-result and Codex-eval-dispatch discussion artifacts into the `evaluation` value-feature, during the memory-system redesign.

## Summary
Bundle B (`features/session-foundations-bundle-b`) was a work-sprint, not a value-feature. Its durable evaluation-result and Codex-eval-dispatch discussion artifacts were re-homed into `evaluation` by content per the memory-system redesign routing heuristic. Files moved via `git mv` (history-preserving); `feature:` frontmatter restamped to `evaluation` on each moved file. Bodies unchanged.

## What changed
- Bundle B discussion files about evaluation moved into `features/evaluation/discussions/`.
- `feature:` frontmatter on each moved file updated from `session-foundations-bundle-b` to `evaluation`.

## Verification
- `git status --short` shows the moves as renames (R), not delete+add.
- Source files removed from `features/session-foundations-bundle-b/`.

## Deferred
- Bundle B `README.md` retention/supersession handled by the bundle-rehome cleanup task (not this task).

## Related
- [`changelogs/2026-05-26-bundle-a-rehome.md`](2026-05-26-bundle-a-rehome.md) — the parallel Bundle A re-home into `evaluation`.
- [`discussions/2026-05-24-codex-iter2-blocked-aggregation.md`](../discussions/2026-05-24-codex-iter2-blocked-aggregation.md) — a Bundle B Codex-eval-dispatch discussion re-homed by this task.
