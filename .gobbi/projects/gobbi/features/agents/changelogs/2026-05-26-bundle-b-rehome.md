---
name: bundle-b-rehome
description: Bundle B (session-foundations-bundle-b) durable artifacts re-homed into agents during the memory-system redesign.
type: changelogs
scope: feature
feature: agents
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-redesign, re-home, bundle-b]
shipped_in: memory-redesign W3-T3
---

# Bundle B re-home into `agents`

**Task:** memory-redesign W3-T3 — re-home `features/session-foundations-bundle-b/` cluster md into the 7 capability value-features.

## Summary
Bundle B was a work-sprint, not a value-feature. Its durable artifacts (PostToolUse hook agents[] mutation diagnostics) were re-homed into `agents` by content (design §1.3 row 3 + §8 LOW-16 routing heuristic). Files moved via `git mv` (history-preserving); `feature:` frontmatter restamped to `agents` on each moved file. Bodies unchanged.

## What changed
- Bundle B subdir files whose content is about agents moved into `features/agents/{decisions,design,checklists,backlogs,references,discussions,scenarios,plans}/`.
- `feature:` frontmatter on each moved file updated from `session-foundations-bundle-b` (or `null`) to `agents`.

## Verification
- `git status --short` shows the moves as renames (R), not delete+add.
- Source files removed from `features/session-foundations-bundle-b/`.
- Full per-cluster routing logged in `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w3/staging/w3t3-cluster-manifest.md`.

## Deferred
- Bundle B `README.md` retention/supersession handled by W3-T5 (not this task).

## Related
- Design: `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md` §1.3, §8.
- Sibling re-homes: env-var-audit→install-runtime (W3-T1), Bundle A→workflow (W3-T2).
