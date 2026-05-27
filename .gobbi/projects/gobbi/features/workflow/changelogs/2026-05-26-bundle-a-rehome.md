---
name: bundle-a-rehome
description: Bundle A (gobbi-orchestration-workflow-improvements) durable artifacts re-homed into workflow during the memory-system redesign.
type: changelogs
scope: feature
feature: workflow
status: shipped
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-redesign, re-home, bundle-a]
plan: null
---

# Bundle A re-homed — workflow's share

**Task:** memory-redesign W3-T2 — re-home the `gobbi-orchestration-workflow-improvements` sprint's durable artifacts into the 7 capability value-features.

## Summary
The `gobbi-orchestration-workflow-improvements` work-sprint (Bundle A) was
re-homed into the 7 capability features during memory-system redesign W3-T2.
`workflow` is Bundle A's primary value-feature (§1.3) and received the
orchestration/wrap-up/setup-question artifacts plus the cross-cutting items.

## What changed
Re-homed (via `git mv`, history preserved) 10 artifacts into `workflow/`:
- 3 decisions: step-2-5-example-non-canonical-domain-value, wrap-up-step-2-5-anchor-placement, wrap-up-step-2-5-escalation-default
- 3 designs: drop-legacy-setup-questions, glossary-placement, wrap-up-step-2-5-compliance-check
- 2 discussions: scope-bundle-selection, wrap-up-step-2-5-escalation-shape
- 1 plan: `plans/2026-05-23-orch-workflow-improvements.md` (the whole Bundle A execution plan — spans all tasks)
- 1 archived decision bundle: `archive/decisions/2026-05-23-iter1-user-redirects.md` (superseded; spans codex + wrap-up)
- `feature:` frontmatter key updated to `workflow`; bodies untouched.

## Verification
`find features/gobbi-orchestration-workflow-improvements -name '*.md' ! -name README.md | wc -l` == 0.
`git status` shows all moves as renames (R).

## Deferred
- `gobbi-orchestration-workflow-improvements/README.md` retirement → W3-T5.

## Related
- Memory-system redesign design doc §1.2 (7-feature table), §1.3 (Bundle A → workflow primary), §8 LOW-16 routing heuristic.
- Origin sprint: Bundle A, PR #266 (b9970dc).
