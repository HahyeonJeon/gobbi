---
name: package-includes-claude-plugin-skill-resync-after-t7
description: iter-2 auto-decision — the gobbi plugin package SHIPS its own claude-plugin skill, so T7 re-runs the sync script to materialize the new 19th canonical skill into plugins/gobbi/skills/ (package 18 → 19); T1's verifier is reworded off the hard-coded "18".
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, packaging, sync-trigger, skill-count, planning, iter-2]
decision_status: ratified
mistake-candidate: false
supersedes: null
superseded_by: null
related:
  - planning/staging/plans/gobbi-claude-code-plugin-build.md
  - planning/staging/decisions/plugin-plan-decomposition-and-ordering.md
---

# Package includes the `claude-plugin` skill — resync after T7

## Decision (iter-2 manager AUTO-DECISION)

The gobbi plugin package **SHIPS its own `claude-plugin` skill.** The final shipped package therefore contains **19 skills**, not 18.

This is the logical consequence of two ratified facts:
1. "Ship gobbi's skills" — the package materializes gobbi's canonical skill set.
2. The named **re-sync trigger** — *any commit touching the packaged canonical skills requires re-materialization of `plugins/gobbi/{skills,agents,hooks}/`.*

T7 authors a NEW canonical skill (`.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md`) — the 19th canonical skill. Because it is a packaged skill, the re-sync trigger fires: T7 must re-run `scripts/sync-plugin-package.sh` so the new skill is captured into `plugins/gobbi/skills/claude-plugin/` as a real copy.

## Why this resolves the iter-1 inconsistency (COD-CONS-001)

iter-1 had a contradiction: T1's verifier hard-coded "exactly 18 skill dirs" matching the canonical set, but T7 then created a 19th canonical skill AFTER T1 — while the iter-1 plan also said the package must NOT include `claude-plugin` (frozen 18-skill inventory). A sync script globbing the canonical skill root would either start failing after T7 or package an out-of-scope skill; a fixed-allowlist script could be correct but the plan did not require it. The contradiction is removed by deciding the package DOES ship `claude-plugin`.

## Mechanics (folded into the plan)

- **T1** materializes the 18 canonical skills present at materialization time. Its verifier is reworded from the hard-coded "18 skill dirs" to **"all canonical packaged-skill dirs present at materialization time (18 at T1)"** — so it does not contradict the later 19-skill state.
- **T7** re-runs `scripts/sync-plugin-package.sh` after authoring the canonical `claude-plugin` skill, then verifies: `plugins/gobbi/skills/claude-plugin/` exists as a real-copy dir, `plugins/gobbi/skills/` now has 19 dirs, and `scripts/sync-plugin-package.sh --check` still exits 0 (the allow-set + freshness gate passes with the 19th skill present).
- **Sync-trigger wording** is made explicit: the trigger is *any commit touching a packaged canonical skill* (which now includes `claude-plugin`), requiring a re-run of the sync script. The package skill set tracks the packaged canonical skill set, not a frozen count.
- **T8** docs reference the final package as shipping 19 packaged skills.

## Supersedes (within this session)

This supersedes the iter-1 deferral "Packaging the new `claude-plugin` skill into `plugins/gobbi/skills/` — the 18-skill inventory is frozen and excludes it; follow-up if desired." That deferral no longer holds: D-8 ships it in this plan.

## Note on the Codex suggested-direction divergence

Codex COD-CONS-001's suggested direction was the OPPOSITE (pin a fixed allowlist that EXCLUDES `claude-plugin`, keeping the package at 18). The manager auto-decided the inverse (ship it → 19) because shipping gobbi's authoring guidance with the plugin is the coherent product shape and aligns with the sync-on-skill-edit trigger. Both resolutions remove the inconsistency; the manager chose to include rather than exclude.
