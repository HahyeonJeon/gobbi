---
name: bundle-b-rehome
description: Bundle B (session-foundations-bundle-b) durable artifacts re-homed into git-workflow during the memory-system redesign.
type: changelogs
scope: feature
feature: git-workflow
status: shipped
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-redesign, re-home, bundle-b]
shipped_in: memory-redesign W3-T3
---

# Bundle B re-home into `git-workflow`

**Task:** Re-home the durable artifacts of the `session-foundations-bundle-b` sprint into the capability value-features (memory-system redesign re-home task).

## Summary
Bundle B was a work-sprint, not a value-feature. Its durable artifacts (worktree-first session architecture, branch-naming, rollback semantics, per-iteration commit storage bounds) were re-homed into `git-workflow` by content, following the redesign's rule that an artifact lives in the feature its content is about. Files moved via `git mv` (history-preserving); the `feature:` frontmatter was restamped to `git-workflow` on each moved file. Bodies were left unchanged.

## What changed
- Bundle B subdir files whose content is about git-workflow moved into `features/git-workflow/{decisions,design,checklists,backlogs,references,discussions,scenarios,plans}/`.
- `feature:` frontmatter on each moved file updated from `session-foundations-bundle-b` (or `null`) to `git-workflow`.

## Verification
- `git status --short` shows the moves as renames (R), not delete+add.
- Source files removed from `features/session-foundations-bundle-b/`.
- Full per-cluster routing logged in the originating session's per-cluster manifest at `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w3/staging/w3t3-cluster-manifest.md`.

## Deferred
- Bundle B `README.md` retention/supersession was handled by a separate re-home task, not this one.

## Related
- Design: the memory-system redesign design doc (`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md`), §1.3 and §8.
- Sibling re-homes: the env-var-audit artifacts to `install-runtime`, and Bundle A to `git-workflow` (changelog `2026-05-26-bundle-a-rehome.md`).
