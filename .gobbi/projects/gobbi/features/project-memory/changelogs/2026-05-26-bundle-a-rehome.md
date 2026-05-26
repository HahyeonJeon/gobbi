---
date: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
feature: project-memory
task: memory-redesign W3-T2
status: shipped
plan: null
---

# Bundle A re-homed — project-memory's share

## Summary
During memory-system redesign W3-T2, the memorization-subsystem artifacts from
the `gobbi-orchestration-workflow-improvements` sprint (Bundle A) were re-homed
into `project-memory` per content (§8 rule 1). `project-memory` owns the
`memorization` skill.

## What changed
Re-homed (via `git mv`, history preserved) 2 artifacts into `project-memory/`:
- 1 decision: path-conventions-anchor-casing (memorization Path conventions → H3)
- 1 design: memorization-moment-of-capture (the moment-of-capture Core Principle)
- `feature:` frontmatter key updated to `project-memory`; bodies untouched.

## Verification
`find features/gobbi-orchestration-workflow-improvements -name '*.md' ! -name README.md | wc -l` == 0.
`git status` shows all moves as renames (R).

## Related
- Memory-system redesign design doc §1.2 (project-memory owns memorization), §1.3 (T02/T04 project-memory secondary), §8 LOW-16 routing heuristic.
- Origin sprint: Bundle A, PR #266 (b9970dc).
