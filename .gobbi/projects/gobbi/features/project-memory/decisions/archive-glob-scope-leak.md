---
name: archive-glob-scope-leak
description: "Design flaw: plan's bare ** globs for files: patterns match archive/ subdirs that are explicitly out of scope; fix by adding archive-exclusion predicates."
tags: [archive, glob, scope, conformance]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: decisions
domain: docs-sync
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# Archive glob scope leak in plan's `**` `files:` globs

## Context

An early version of the retrofit plan used bare `**` `files:` globs (e.g., `features/workflow/**/*.md`) for several conformance and prose tasks. The project-memory tree includes frozen `archive/` subdirs that the scope contract's Out-of-Scope section explicitly excludes from every wave. The naive `**` glob would have matched those frozen docs.

## Decision

Confirmed as a design flaw. Every `**` glob must carry `exclude: "**/archive/**"` in `files:` AND `-not -path '*/archive/*'` in the `verifies` gate, so the edit-glob matches the count predicate exactly.

## Rationale

The 7 frozen docs (2 content + 5 READMEs) are enumerated in the plan's counts note. The `verifies` git-diff check does not detect archive edits — the edit-glob exclusion is the structural fix. Three independent evaluation perspectives (Project, Consistency, Risk) converged on this root.

## Alternatives considered

Explicit `not-path` in `verifies` only (no glob exclusion) — rejected: the edit-glob would still touch the frozen docs even if the verify caught it post-hoc.

## Consequences

All `**` globs in the plan now carry `exclude: "**/archive/**"`. The tasks that enumerate typed subdirs explicitly are archive-clean by construction. The conformance-wave counts now match the count predicate (workflow 26, install-runtime 44, READMEs 18).

## Related

- [`memorization/rules.md` §4.6](../../../skills/memorization/rules.md) — the standard's archive-exclusion scope edge this glob fix enforces
- [`plans/2026-05-26-dev-doc-standard-retrofit`](../plans/2026-05-26-dev-doc-standard-retrofit.md) — the plan whose globs were made archive-safe

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Planning review, Project / Consistency / Risk perspectives + Codex F1.
