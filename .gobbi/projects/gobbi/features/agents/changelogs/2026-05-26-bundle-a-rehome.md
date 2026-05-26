---
date: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
scope: feature
feature: agents
task: memory-redesign W3-T2
status: shipped
plan: null
---

# Bundle A re-homed — agents' share

## Summary
During memory-system redesign W3-T2, the delegation-contract artifact from the
`gobbi-orchestration-workflow-improvements` sprint (Bundle A) was re-homed into
`agents` per content (§8 rule 1). `agents` owns the `delegation` subsystem;
Bundle A's T03 (delegation memorization hard gate) maps here per §1.3.

## What changed
Re-homed (via `git mv`, history preserved) 1 artifact into `agents/`:
- 1 design: memorization-delegation-hard-gate (delegation Load-Directive hard gate)
- `feature:` frontmatter key updated to `agents`; body untouched.

## Verification
`find features/gobbi-orchestration-workflow-improvements -name '*.md' ! -name README.md | wc -l` == 0.
`git status` shows all moves as renames (R).

## Related
- Memory-system redesign design doc §1.2 (agents owns delegation), §1.3 (T03 → agents), §8 LOW-16 routing heuristic.
- Origin sprint: Bundle A, PR #266 (b9970dc).
