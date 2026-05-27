---
name: bundle-a-rehome
description: Changelog for re-homing git-workflow's share of Bundle A artifacts from the gobbi-orchestration-workflow-improvements sprint into this feature during the memory-system redesign.
type: changelogs
scope: feature
feature: git-workflow
status: shipped
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-redesign, re-home, bundle-a]
---

# Bundle A re-homed — git-workflow's share

**Task:** Re-home git-workflow's share of the Bundle A sprint artifacts into this feature (memory-system redesign re-home task).

## Summary
During the memory-system redesign, the diff-scope / bundled-PR semantics decision
from the `gobbi-orchestration-workflow-improvements` sprint (Bundle A) was re-homed
into `git-workflow` by content: `git-workflow` owns the branch/PR diff-scope
lifecycle, and the redesign's routing heuristic places artifacts in the feature
their content is about. The sprint was a work-unit, not a durable value-feature,
so its durable artifacts move into the capability features.

## What changed
Re-homed (via `git mv`, history preserved) 1 artifact into `git-workflow/`:
- 1 decision: `decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md` (`git diff develop...HEAD` semantics under a bundled PR).
- `feature:` frontmatter key updated to `git-workflow`; body untouched.

## Verification
- `find features/gobbi-orchestration-workflow-improvements -name '*.md' ! -name README.md | wc -l` == 0 (no durable artifacts left behind).
- `git status` shows all moves as renames (R), not delete+add — history preserved.

## Deferred
None — this re-home moved git-workflow's complete share of Bundle A.

## Related
- Memory-system redesign design doc §1.2 (git-workflow owns git), §1.3 (sprint → value-feature routing), §8 routing heuristic (content = PR diff-scope semantics).
- Origin sprint: Bundle A, PR #266 (b9970dc).
