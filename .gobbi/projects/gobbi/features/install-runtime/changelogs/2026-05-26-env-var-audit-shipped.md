---
name: env-var-audit-shipped
description: env-var-audit work-sprint artifacts re-homed into install-runtime capability feature during memory-system redesign wave 3 — 8 markdown artifacts moved via git mv.
type: changelogs
scope: feature
feature: install-runtime
status: shipped
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [env-var-audit, memory-redesign, re-home]
plan: null
---

# env-var-audit re-homed into install-runtime

**Task:** re-home the `env-var-audit` work-sprint's durable artifacts into the `install-runtime` capability feature during the memory-system redesign.

## Summary
The `env-var-audit` work-sprint's durable artifacts were re-homed into the
`install-runtime` capability feature during the memory-system redesign (Wave 3).
`env-var-audit` was a sprint — its content (the `$CLAUDE_SESSION_ID`
→ `$CLAUDE_CODE_SESSION_ID` rename, the SessionStart hook, and the
`session.json.transcriptPath` field) is all about gobbi's session-runtime
contract, which `install-runtime` owns per design §1.2 / §1.3.

## What changed
- Re-homed (via `git mv`, history preserved) 8 markdown artifacts:
  - 4 decisions → `install-runtime/decisions/` (env-file-load-semantics,
    pre-planning-readiness, session-start-hook-script, task-decomposition)
  - 1 discussion → `install-runtime/discussions/` (env-var-audit-scope)
  - 2 references → `install-runtime/references/` (CCSI-version changelog,
    hooks-stdin-contract)
  - 1 superseded references bundle → `install-runtime/archive/references/`
    (2026-05-22-ideation-references)
- Updated the `feature:` frontmatter key on the 5 files that carried it
  (env-var-audit → install-runtime); bodies untouched.
- The `env-var-audit/README.md` is left in place for retirement by a subsequent memory-redesign wave task.

## Verification
`find features/env-var-audit -name '*.md' ! -name README.md | wc -l` == 0
(all non-README artifacts moved). `git status` shows all moves as renames (R).

## Deferred
- `env-var-audit/README.md` retirement → subsequent memory-redesign wave task.
- Frontmatter normalization of the 3 ad-hoc decision files → subsequent migration task.

## Related
- Memory-system redesign design doc §1.2 (7-feature table), §1.3 (env-var-audit
  → install-runtime primary), §8 LOW-16 routing heuristic.
- Origin sprint: `notes/` env-var-audit session note; original PR #265 (159eb21).
