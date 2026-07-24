---
name: memory-baseline-check-keys-stale
description: gobbi/SKILL.md's sparse-memory check keys on filenames that no longer exist in the post-PR-314 memory layout, so it false-fires every session.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, docs-sync]
keywords: [sparse-memory-check, gobbi-skill, memory-layout, pr-314, stale-key, false-fire]
author: claude
priority: medium
domain: docs-sync
---

# The gobbi/SKILL.md sparse-memory check keys on filenames the current layout no longer has

## What happened

`gobbi/SKILL.md` § 5's sparse-memory check tests for the presence of `README.md` and `design/` directly under `.gobbi/projects/{project-name}/`. Since the memory-migration-executed PR #314 (see `project_memory_migration_executed` — 108 files moved to `{type}/{area}/`), design content lives under `features/{f}/design/`, not a project-root `design/` directory, and there is no project-root `README.md` in the current layout. The check's key set predates that migration and was never updated after it landed.

## Why it happens

A structural check that hardcodes a set of expected paths becomes stale the moment the structure it checks changes, unless the check itself is updated in the same change that moves the structure — the same class of defect as `hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards` (that mistake covers a drift-gate's hardcoded baseline; this is the sibling case of an onboarding/health check's hardcoded key set). The PR #314 migration changed WHERE design content and the project identity doc live, but the sparse-memory check's key list was not in that PR's own change-set, so it was never revisited.

## Correct approach

Update `gobbi/SKILL.md` § 5's sparse-memory check to key on the current post-PR-314 layout: check for `features/{f}/design/` (per-feature) rather than a project-root `design/`, and drop or replace the `README.md` existence check with whatever the current layout's actual project-identity artifact is (verify against the live `memory-map.md` before fixing, per `verify-dont-assert-taught-facts`). This fix is explicitly OUT OF SCOPE for the current session (a planning-skill-split task) — it is staged here as a mistake-candidate + should also be filed as a project backlog item so it does not recur silently on the next session that touches `gobbi/SKILL.md`.

## How to detect

Any session-start or health-check output that reports "sparse memory" or a similar warning for a project whose memory tree is known to be populated (has `features/{f}/design/`, `mistakes/`, `rules/`, etc.) is a candidate false-fire. Confirm by reading `gobbi/SKILL.md` § 5's exact checked paths against the live tree structure documented in `memory/memory-map.md` — a mismatch between the check's hardcoded keys and the current layout is the root cause, not an actually-sparse project.

## Related

- [[hardcoded-baseline-guard-is-an-edit-target-of-the-structure-it-guards]] — the sibling trap: any check with a hardcoded expectation of a structure is itself an edit target of that structure
