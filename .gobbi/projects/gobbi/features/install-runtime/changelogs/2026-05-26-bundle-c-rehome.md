---
name: bundle-c-rehome
description: Bundle C (session-foundations-bundle-c) durable artifacts re-homed into install-runtime during the memory-system redesign.
type: changelogs
scope: feature
feature: install-runtime
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [memory-redesign, re-home, bundle-c]
shipped_in: memory-redesign W3-T4
---

# Bundle C re-home into `install-runtime`

**Task:** memory-redesign wave 3 — re-home `features/session-foundations-bundle-c/` cluster md into the 7 capability value-features.

## Summary
Bundle C was a work-sprint, not a value-feature. Its durable in-dir artifacts were the 5 files documenting the `gobbi-hook-authoring` skill: one shipped-changelog and four evaluation checklists (quality gates for the skill). Per design §1.3 row 4 + §8 LOW-16 routing heuristic rule 1 (destination = the capability the CONTENT is about), all five route to `install-runtime` — the value-feature that owns the `gobbi-hook-authoring` skill (design §10 RATIFY-1). Files moved via `git mv` (history-preserving); the changelog's `feature:` frontmatter restamped to `install-runtime`. Bodies unchanged.

## What changed
- `changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md` → `features/install-runtime/changelogs/` (`feature:` restamped to `install-runtime`).
- Four gobbi-hook-authoring checklists → `features/install-runtime/checklists/`:
  - `hook-skill-exit-behavior-must-enumerate-all-fatal-paths.md`
  - `skill-must-not-invent-json-field-paths-not-in-witnesses.md`
  - `skill-registration-must-mirror-real-settings-shape.md`
  - `smoke-test-payloads-must-include-all-required-env-vars.md`

## Routing notes (cross-cutting secondaries)
- Bundle C's §1.3 secondaries (guardrails: gobbi-mistake-promote fix + hooks-domain tag; project-memory: session-lifecycle + archive-model design) did NOT live inside `features/session-foundations-bundle-c/` — they shipped directly to `skills/`, `CLAUDE.md`, and project `design/`, so there were no in-dir files to re-home for those secondaries.
- The two project-root design docs (`design/archive-move-on-terminal-model.md`, `design/session-lifecycle-worktree-boundaries.md`) were LEFT at project `design/` per the §2.4 promote-up rule (cross-feature architecture stays project-level). See the W3-T4 report for the full reasoning.

## Verification
- `git status --short` shows the moves as renames (R), not delete+add.
- `find features/session-foundations-bundle-c -name '*.md' ! -name README.md | wc -l` == 0.
- Source files removed from `features/session-foundations-bundle-c/`.

## Deferred
- Bundle C `README.md` retirement to `archive/features/` handled by W3-T5 (not this task).

## Related
- Design: memory-system redesign design doc §1.3, §2.4, §8 (routing heuristics and promote-up rule).
- Sibling re-homes: env-var-audit→install-runtime (W3-T1), Bundle A→workflow (W3-T2), Bundle B→install-runtime+ (W3-T3).
