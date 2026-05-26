---
date: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
scope: feature
feature: git-workflow
task: memory-redesign W3-T2
status: shipped
plan: null
---

# Bundle A re-homed — git-workflow's share

## Summary
During memory-system redesign W3-T2, the diff-scope / bundled-PR semantics
decision from the `gobbi-orchestration-workflow-improvements` sprint (Bundle A)
was re-homed into `git-workflow` per content (§8 rule 1). `git-workflow` owns
the branch/PR diff-scope lifecycle.

## What changed
Re-homed (via `git mv`, history preserved) 1 artifact into `git-workflow/`:
- 1 decision: plan-diff-scope-gate-semantics-under-bundled-pr (`git diff develop...HEAD` semantics under a bundled PR)
- `feature:` frontmatter key updated to `git-workflow`; body untouched.

## Verification
`find features/gobbi-orchestration-workflow-improvements -name '*.md' ! -name README.md | wc -l` == 0.
`git status` shows all moves as renames (R).

## Related
- Memory-system redesign design doc §1.2 (git-workflow owns git), §1.3, §8 LOW-16 routing heuristic (content = PR diff-scope semantics).
- Origin sprint: Bundle A, PR #266 (b9970dc).
