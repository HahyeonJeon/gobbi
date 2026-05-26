---
name: bundle-a-rehome
description: Bundle A (gobbi-orchestration-workflow-improvements) evaluation artifacts re-homed into the evaluation feature during the memory-system redesign.
type: changelogs
scope: feature
feature: evaluation
status: shipped
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-redesign, re-home, bundle-a]
---

# Bundle A re-homed — evaluation's share

## Summary
During memory-system redesign W3-T2, the codex / dual-system-evaluation
artifacts from the `gobbi-orchestration-workflow-improvements` sprint (Bundle A)
were re-homed into `evaluation` per content (§8 rule 1). `evaluation` owns the
`codex` subsystem and the Coverage Ownership Matrix.

## What changed
Re-homed (via `git mv`, history preserved) 9 artifacts into `evaluation/`:
- 5 decisions: codex-exec-universal-invocation-pattern, codex-skill-assistant-wrapper-pattern-for-dual-system-eval, constraints-body-block-convention-deferred-to-planning, constraints-body-block-kept-per-h2-lock, coverage-ownership-matrix-row-text
- 2 designs: codex-skill-structure, naming-convention-enforcement (Coverage Ownership Matrix evaluator-check row)
- 1 discussion: codex-invocation-priority-redirect
- 1 reference: five-type-vocabulary (canonical from evaluation/SKILL.md)
- `feature:` frontmatter key updated to `evaluation`; bodies untouched.

## Verification
`find features/gobbi-orchestration-workflow-improvements -name '*.md' ! -name README.md | wc -l` == 0.
`git status` shows all moves as renames (R).

## Related
- Memory-system redesign design doc §1.2 (evaluation owns codex), §1.3, §8 LOW-16 routing heuristic.
- Origin sprint: Bundle A, PR #266 (b9970dc).
