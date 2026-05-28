---
name: bundle-b-rehome
description: Bundle B (session-foundations-bundle-b) durable artifacts re-homed into install-runtime during the memory-system redesign.
type: changelogs
scope: feature
feature: install-runtime
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-redesign, re-home, bundle-b]
shipped_in: memory-redesign W3-T3
---

# Bundle B re-home into `install-runtime`

**Task:** memory-redesign wave 3 — re-home `features/session-foundations-bundle-b/` cluster md into the 7 capability value-features.

## Summary
Bundle B was a work-sprint, not a value-feature. Its durable artifacts (skill mirror/symlink topology and the workspace-vs-mirror canonical policy) were re-homed into `install-runtime` by content (design §1.3 row 3 + §8 LOW-16 routing heuristic). Files moved via `git mv` (history-preserving); `feature:` frontmatter restamped to `install-runtime` on each moved file. Bodies unchanged.

## What changed
- Bundle B subdir files whose content is about install-runtime moved into `features/install-runtime/{decisions,design,checklists,backlogs,references,discussions,scenarios,plans}/`.
- `feature:` frontmatter on each moved file updated from `session-foundations-bundle-b` (or `null`) to `install-runtime`.

## Verification
- `git status --short` shows the moves as renames (R), not delete+add.
- Source files removed from `features/session-foundations-bundle-b/`.
- Full per-cluster routing logged in the memory-redesign wave 3 cluster manifest (session artifact).

## Deferred
- Bundle B `README.md` retention/supersession handled by W3-T5 (not this task).

## Related
- Design: memory-system redesign design doc §1.3, §8 (routing heuristics).
- Sibling re-homes: env-var-audit→install-runtime (W3-T1), Bundle A→workflow (W3-T2).
