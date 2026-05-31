---
name: drift-sync-resync-trigger-unnamed
description: Materialized-copy drift surface documented but no mechanical sync/diff gate or named trigger event
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, drift-sync, plugin-package, materialization]
supersedes: null
superseded_by: null
decision_status: proposed
---

# Materialized-copy drift/sync surface needs a named trigger and a mechanical gate

## Context

The iter-2 design decision DD-2a ratified that the `gobbi` Claude Code plugin package contains REAL file copies of the canonical skills, agents, and hooks — not symlinks. This is the correct choice (prior art #251 proved escaping symlinks produce empty published installs), but it explicitly creates a drift surface: "Editing on main now requires editing in two places" (verbatim from #251).

The iter-2 draft names this drift surface and requires the `claude-plugin` skill to document it. However, two evaluators (Claude F-S1 and Codex CONS-1) independently flagged that the draft does not state WHAT triggers a re-sync, nor does it require any mechanical enforcement (diff/checksum gate, build script, etc.).

This is the same root failure that caused PR #260→#261 (broken mirror after canonical edit without re-syncing the `.claude/` mirror). The project's history demonstrates that "keep in sync" without a defined trigger condition is reliably violated.

## Decision

**OPEN — Planning must resolve.** Two sub-questions:

1. **Trigger condition:** What event requires a package re-sync? Candidate: any edit to a file under `.gobbi/projects/gobbi/skills/`, `.gobbi/projects/gobbi/agents/*.md`, or `.claude/hooks/*.sh` triggers a required package re-sync + version bump.
2. **Mechanical enforcement:** Should a build/sync step verify that the package files match their canonical sources? Options: (a) manual obligation documented in the skill; (b) a build script that materializes from canonical sources and asserts no divergence; (c) a CI/diff check.

## Rationale

Without a named trigger, Planning may produce a skill section that says "keep in sync" without specifying the event — repeating the recurring-mirror-repair root cause the plugin is meant to eliminate. Without mechanical enforcement, the allow-set cache-contents gate (which only checks that real files exist) will PASS even when the package copies are stale.

## Alternatives considered

- **Document-only (no mechanical gate):** Risk is known and accepted — same failure mode as `.claude/` mirror. Not recommended given project history.
- **Require a mechanical gate at Planning:** Adds a build step (e.g., `scripts/sync-plugin-package.sh`); makes the sync obligation enforceable and auditable. Preferred.

## Consequences

If this decision is left as "document only," the package will silently diverge from the canonical tree whenever canonical skills/agents/hooks are edited without a corresponding package re-sync. The #258 drift-detector (backlog) is the future consumer; the named re-sync trigger is what the drift-detector would enforce.

## Related

- `ideation/evaluation/iter2/claude/structure.md` F-S1
- `ideation/evaluation/iter2/codex/consistency.md` CONS-1
- `ideation/staging/design/gobbi-plugin-bounded-package.md`
- `ideation/staging/references/prior-gobbi-core-plugin-package-history.md` (#251 two-places trade-off)
