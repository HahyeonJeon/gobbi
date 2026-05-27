---
name: archive-glob-scope-leak
description: "Design flaw: plan's bare ** globs for files: patterns match archive/ subdirs that are explicitly out of scope; fix by adding archive-exclusion predicates."
tags: [archive, glob, scope, conformance]
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: design_flaw
domain: docs-sync
addressed-in-iter: 2
addressed-how: "Every `**` `files:` glob made archive-safe by adding `exclude: \"**/archive/**\"` in `files:` AND `-not -path '*/archive/*'` in `verifies`. T3/T4/T6/T7/T9b/T9c already enumerate subdirs (archive-clean by construction). Re-verified: workflow naive/archive-safe = 27/26; install-runtime = 45/44; READMEs = 23/18 — all match the count predicate."
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# Archive glob scope leak in plan's `**` `files:` globs

## Context

The iter1 plan's `files:` globs for T1, T2, T5, T8, T9a, P5, P6, N1 used bare `**` patterns (e.g., `features/workflow/**/*.md`). The project memory tree includes frozen `archive/` subdirs that D10 and the scope-contract Out-of-Scope section explicitly exclude from every wave. The naive `**` glob would have matched those frozen docs.

## Decision

Confirmed as a design flaw. Every `**` glob must carry `exclude: "**/archive/**"` in `files:` AND `-not -path '*/archive/*'` in the `verifies` gate, so the edit-glob matches the count predicate exactly.

## Rationale

The 7 frozen docs (2 content + 5 READMEs) are enumerated in the plan's Counts note. The `verifies` git-diff check does not detect archive edits — the edit-glob exclusion is the structural fix. Three independent perspectives (Project, Consistency, Risk — DOC-PROJECT-1 / DOC-CONS-1 / DOC-RISK-2) converged on this root.

## Alternatives considered

Explicit `not-path` in `verifies` only (no glob exclusion) — rejected: the edit-glob would still touch the frozen docs even if the verify caught it post-hoc.

## Consequences

All `**` globs in the plan now carry `exclude: "**/archive/**"`. Typed-subdir enumeration (T3/T4/T6/T7/T9b/T9c) is archive-clean by construction. The conformance-wave counts now match the count predicate (workflow 26, install-runtime 44, READMEs 18).

## Related

- `planning/evaluation/iter1/claude/project.md` (DOC-PROJECT-1)
- `planning/evaluation/iter1/claude/consistency.md` (DOC-CONS-1)
- `planning/evaluation/iter1/claude/risk.md` (DOC-RISK-2)
- `planning/evaluation/iter1/codex/overall.md` (implied by F1)
- `planning/rawdata/draft-iter2.md` §DL-I
