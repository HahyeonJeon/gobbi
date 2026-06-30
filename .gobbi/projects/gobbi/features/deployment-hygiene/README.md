---
name: deployment-hygiene
description: "The gobbi fix campaign's deployment-readiness cluster — plugin mirror integrity, manifest/version/install-validation hygiene (G1 done; G2/G3 pending)."
type: features
scope: project
status: active
created: 2026-06-30
tags: [deployment, plugin, install-runtime, fix-campaign]
---

# deployment-hygiene

Deployment-readiness work from the adversarial-review fix campaign. Folds under the
`install-runtime` value-feature (the per-session runtime + plugin-package contract).

## G1 — SHIPPED 2026-06-30 (PR off develop, session 0dc5cf75)
The first fix cluster: the `.claude/skills` mirror root cause (C1) + manifest/version/install hygiene (C7).

**A3 (USER-DECIDED 2026-06-29) — `.claude/skills` mirror mechanism:** per-file real dirs, **tool-owned** by `sync-plugin-package.sh`, mirroring docs AND support dirs (`scripts/`/`templates/`/`workflow/`) with the inventory **DERIVED per skill** from the canonical tree. Whole-dir symlinks rejected (Claude Code skill discovery does not resolve symlinked directories). Position S over docs-only.

**A7 (USER-DECIDED 2026-06-29) — version cadence:** PATCH-only `0.5.x` on shipped-surface change (honors the standing no-v0.6.0 decision); all version-bearing files in lockstep; pre-publish gate with a derived (never hardcoded) baseline. Position P over full-semver.

**What shipped (7 commits):** sync owns `.claude/skills` (derived enum + bidirectional `--check` parity; false-green killed) · skill docs corrected to script-owned · fire-once validator derives events from `hooks.json` + covers `SessionEnd` + accepts `.codex-plugin` + **fail-closed** on broken source · Codex `SessionStart` matcher wildcard dropped · new `validate-plugin-publish-readiness.sh` (strict semver) · version `0.5.0→0.5.1` lockstep.

**Closed findings:** D2-015/010/030/031/032 + D6-002/003/004/006/007 + D6-007.

## Remaining
- **G2** (doc consistency: C2 links + C3 terms/counts + C6 stale CLI refs) and **G3** (structural: C4 dead-end-handoff + C5 staging-ownership) — see the fix-phase handoff plan.
- See `backlogs/evaluation/g1-eval-low-followups.md` for the 3 Low eval follow-ups.
