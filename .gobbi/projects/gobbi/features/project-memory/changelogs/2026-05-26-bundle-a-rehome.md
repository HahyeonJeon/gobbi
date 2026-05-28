---
name: bundle-a-rehome
description: "Re-homed memorization-subsystem artifacts from Bundle A sprint into project-memory feature directory"
type: changelogs
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [rehome, bundle-a, memorization]
shipped_in: PR #266 (b9970dc)
---

# Bundle A re-homed — project-memory's share

**Task:** Artifact re-home (memory-system redesign) — route Bundle A's memorization-subsystem artifacts to their owning value-feature.

## Summary
During the memory-system redesign's artifact re-home task, the memorization-subsystem artifacts from
the `gobbi-orchestration-workflow-improvements` sprint (Bundle A) were re-homed into `project-memory`,
which owns the `memorization` skill, per the redesign's secondary-routing heuristic.

## What changed
Re-homed (via `git mv`, history preserved) 2 artifacts into `project-memory/`:
- 1 decision: [path-conventions-anchor-casing](../decisions/path-conventions-anchor-casing.md) (memorization `Path conventions` → H3)
- 1 design: [memorization-moment-of-capture](../design/memorization-moment-of-capture.md) (the moment-of-capture Core Principle)
- `feature:` frontmatter key updated to `project-memory`; bodies untouched.

## Verification
`find features/gobbi-orchestration-workflow-improvements -name '*.md' ! -name README.md | wc -l` == 0.
`git status` shows all moves as renames (R).

## Deferred
None — the re-home of project-memory's share completed in this task; other sprints' shares re-homed under their own changelog entries.

## Related
- [path-conventions-anchor-casing](../decisions/path-conventions-anchor-casing.md) — one of the two re-homed artifacts
- [memorization-moment-of-capture](../design/memorization-moment-of-capture.md) — the other re-homed artifact
- Origin sprint: Bundle A, PR #266 (b9970dc).
