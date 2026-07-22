---
name: README
description: Current plugin topology, manifest, marketplace, sync, and isolated installed-cache verification for both runtimes.
type: features
scope: feature
feature: deployment-hygiene
status: active
created: 2026-06-30
session: 0dc5cf75-54c5-4b52-82fa-b18750bdaade
tags: []
keywords: [deployment, plugin, install-runtime, fix-campaign]
author: claude
value_proposition: One bounded hook-free plugin package whose canonical topology and installed behavior are verified without changing the release version.
subsystems: [plugins/gobbi, scripts/sync-plugin-package.sh, scripts/test-sync-plugin-package.sh, scripts/check-codex-plugin-smoke.sh]
---

# deployment-hygiene

Deployment-readiness work from the adversarial-review fix campaign. Folds under the
`install-runtime` value-feature (the per-session runtime + plugin-package contract).

## Current contract (2026-07-20)

- `plugins/gobbi/` is the bounded shared package. It distributes canonical skills and agents and carries Claude Code and Codex manifests without a hooks component.
- The plugin version remains unchanged for this breaking workflow redesign. Manifest and marketplace structure change without an automatic version bump.
- `scripts/sync-plugin-package.sh --check` owns canonical source topology, manifests, marketplaces, runtime entry points, symlink topology, and agent-wrapper presence.
- `scripts/test-sync-plugin-package.sh` owns sync fixture coverage. `scripts/check-codex-plugin-smoke.sh` owns isolated installed-cache behavior. These are the three package commands in the ten-command workflow set.
- Source-package symlink behavior and installed-cache behavior are separate. An installed-cache limitation is reported; the source package is not materialized to hide it.
- Gobbi sessions use `session.json` version 5 and `state.json` version 3. Plugin checks do not create a second router, capture transcripts, or register operational telemetry.
- The final repository gate includes fresh dual-system EVALUATION of the actual implementation and plugin behavior.

## Historical G1 — shipped 2026-06-30

This dated account preserves the earlier package implementation. Its hook and version-cadence details are not current instructions.

The first fix cluster: the `.claude/skills` mirror root cause (C1) + manifest/version/install hygiene (C7).

**A3 (USER-DECIDED 2026-06-29) — `.claude/skills` mirror mechanism:** per-file real dirs, **tool-owned** by `sync-plugin-package.sh`, mirroring docs AND support dirs (`scripts/`/`templates/`/`workflow/`) with the inventory **DERIVED per skill** from the canonical tree. Whole-dir symlinks rejected (Claude Code skill discovery does not resolve symlinked directories). Position S over docs-only.

**A7 (USER-DECIDED 2026-06-29) — version cadence:** PATCH-only `0.5.x` on shipped-surface change (honors the standing no-v0.6.0 decision); all version-bearing files in lockstep; pre-publish gate with a derived (never hardcoded) baseline. Position P over full-semver.

**What shipped (7 commits):** sync owns `.claude/skills` (derived enum + bidirectional `--check` parity; false-green killed) · skill docs corrected to script-owned · fire-once validator derives events from `hooks.json` + covers `SessionEnd` + accepts `.codex-plugin` + **fail-closed** on broken source · Codex `SessionStart` matcher wildcard dropped · new `validate-plugin-publish-readiness.sh` (strict semver) · version `0.5.0→0.5.1` lockstep.

**Closed findings:** D2-015/010/030/031/032 + D6-002/003/004/006/007 + D6-007.

## Current open work

- Run sync check, sync fixtures, and isolated Codex smoke as part of the complete final gate.
- Review any surviving G2/G3 backlog claim against the current hook-free package before treating it as actionable; stale hook or old CLI work is superseded.
