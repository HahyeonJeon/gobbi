---
name: drift-resync-trigger-and-mechanical-gate-resolved
description: Named re-sync trigger (canonical skills/agents/hooks edit → package re-materialize in same commit) + recommended scripts/sync-plugin-package.sh diff gate — resolves F-S1/CONS-1
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, drift-sync, materialization, fs1, cons-1]
supersedes: null
superseded_by: null
decision_status: ratified
related:
  - features/install-runtime/decisions/2026-05-30-drift-sync-resync-trigger-unnamed.md
---

# Materialized-copy drift trigger + mechanical gate — RESOLVED (direction)

## Context

DD-2a ships REAL file copies of canonical skills/agents/hooks inside `plugins/gobbi/` (escaping symlinks are dropped on install — proven by #251). This creates a genuine second copy (distinct from the `.claude/skills/` symlink mirror, which is one-edit). F-S1 (Claude) + CONS-1 (Codex) flagged that the drift surface was named but had no trigger and no mechanical gate — the same root failure as PR #260→#261 (#258 drift-detector backlog).

## Decision (leader recommendation; accepted as-is — discussion-log "Resolved (leader recommendations accepted)" 2026-05-30; mechanism = Execution)

- **Named re-sync trigger:** any commit touching a file under `.gobbi/projects/gobbi/skills/`, `.gobbi/projects/gobbi/agents/*.md`, or `.claude/hooks/*.sh` REQUIRES re-materializing `plugins/gobbi/{skills,agents,hooks}/` in the **same commit** (and a `plugin.json.version` bump when version is pinned).
- **Mechanical gate (recommended direction):** a `scripts/sync-plugin-package.sh` that (a) re-materializes the package from canonical sources and (b) a diff/checksum check that fails on divergence — the future #258 drift-detector's enforcement point. Mechanism choice (build script vs git-tracked copies vs CI check) is Execution-level; the trigger + the existence of a gate are direction and are pinned here.
- **Coherence scope includes the DD-8 Option-C hook split:** the in-repo `.claude/settings.json` hook block and the packaged `plugins/gobbi/hooks/hooks.json` must stay coherent under the SAME trigger (a `.claude/hooks/*.sh` edit re-materializes both the script copy and any matcher/shape change).

## Rationale

A bare "keep in sync" note repeats the project's recurring-mirror-repair failure. The cache-contents allow-set gate only checks files *exist*, not that they are *current*, so a separate freshness gate is required. The `claude-plugin` skill's gobbi section must document the trigger + the ADDS-to-vs-REPLACES footgun + the drift surface.

## Evidence

- Prior mistake `mistakes/skills-mirror-symlinks-not-copies.md` (mirror = one edit; package copy = genuine second copy — do not conflate the two surfaces).
- Prior art `c79d28e` (#251): "Editing on main now requires editing in two places."

## Alternatives considered

- **Document-only (no mechanical gate):** Known failure mode — repeated project history proves "keep in sync" prose is unreliable. Rejected.
- **CI-only gate:** Possible future state; Execution chose a build script (`scripts/sync-plugin-package.sh`) with `--check` mode as the immediate enforcement.

## Consequences

If left document-only, `plugins/gobbi/...` silently diverges whenever canonical skills/agents/hooks are edited without re-materialization; the gate makes the obligation auditable. The `scripts/sync-plugin-package.sh --check` must exit 0 before any commit touching a packaged canonical source passes review.
