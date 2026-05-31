---
name: 2026-05-31-gobbi-claude-code-plugin
description: Session journal — built the bounded gobbi Claude Code plugin (install-runtime feature)
type: notes
scope: project
feature: install-runtime
status: active
created: 2026-05-31
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, install-runtime, plugin-package, hooks, materialization, claude-plugin-skill]
features_touched: [install-runtime]
---

# Session 2026-05-30/31 — gobbi Claude Code Plugin

Session ID: `0fd65721-c39f-4305-b296-9961aee8e1c1`
Branch: `chore/session-2026-05-30-0fd65721`
Worktree: `.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721`

## What happened

The session built the bounded `gobbi` Claude Code plugin from scratch — the feature is `install-runtime`. The session ran through all 5 workflow phases (Ideation, Preparation, Planning, Execution, Wrap-up) with dual-system (Claude + Codex) evaluation at each loop.

**Ideation (iter-2 PASS):** The leader framed the problem: gobbi's prior plugin (`plugins/gobbi-core`, commit 62b95a0, PR #6) was wiped in the v0.5 reset. The iter-1 design proposed pointing the plugin at the repo root — Codex evaluation overturned this with two High-severity findings (R1: repo-root would copy 77M of session memory into the global plugin cache; S1: the `agents` manifest key is a file-path array, not a directory pointer). The user decided to build a fresh `gobbi` plugin (not a resurrection of `gobbi-core`) using a dedicated bounded package at `plugins/gobbi/`. The core design ratified: materialized real copies only (no escaping symlinks — proven broken at #251); `plugins/gobbi/` subtree; 3 open issues deferred to Preparation.

**Preparation (iter-2 PASS):** The leader resolved the 3 open Ideation issues: (a) package root named (`plugins/gobbi/`, marketplace `source: "./plugins/gobbi"`); (b) drift re-sync trigger named (any canonical skills/agents/hooks edit → re-materialize in same commit; `scripts/sync-plugin-package.sh` with `--check`); (c) permissions auto-grant tagged as assumption_risk; DD-7 worktree install path resolved (Option (a) positional-arg worktree path + sentinel). A major user-contribution point arose on DD-8 (hook double-registration): the leader recommended Option A (plugin replaces project-local); the user chose Option C (dev-vs-installed split — settings.json keeps dev registration, hooks.json serves installed users). Codex evaluation REVISE caught 8 consistency gaps; all fixed in iter-2.

**Planning (iter-2 PASS):** The leader decomposed the work into 8 ordered tasks: T1 (sync script + materialize), T2 (plugin.json), T3 (hooks.json), T4 (marketplace.json), T5 (fire-once hook validation — OPERATOR-ASSISTED), T6 (invocability check + conditional permissions — OPERATOR-ASSISTED), T7 (claude-plugin skill + resync → 19), T8 (feature README update). A key auto-decision (D-8) resolved an iter-1 inconsistency: the package ships the `claude-plugin` skill itself (19th skill), requiring T7 to re-run the sync script after authoring it. Codex evaluation REVISE caught 3 gaps: (i) cache allow-set gate missing from executable verifiers; (ii) T5/T6 not marked operator-assisted; (iii) T7 19-skill count inconsistency. All fixed in iter-2.

**Execution (iter-2 PASS):** 5 executor dispatches covered all 8 tasks (task-01, task-02-04, task-05-06, task-07-08, and a remediation pass). Key outputs:
- `plugins/gobbi/` — bounded package, 19 real-copy skill dirs, 5 `.md` agents, 2 hook scripts, `hooks.json` with 3 registrations
- `.claude-plugin/marketplace.json` — Claude schema at repo root; `source: "./plugins/gobbi"`
- `scripts/sync-plugin-package.sh` — materialize + `--check` diff/freshness + exact allow-set gate
- `scripts/validate-plugin-hooks-fire-once.sh` — operator-assisted; embedded fire-once procedure (live run deferred)
- `scripts/check-plugin-invocability.sh` — operator-assisted; conditional `--apply-false` settings edit (live run deferred)
- `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` + `.claude/skills/claude-plugin/SKILL.md` mirror — 19th canonical skill
- `features/install-runtime/README.md` — updated with plugin package info, DD-8 split, re-sync trigger, claude-plugin pointer

Codex evaluation REVISE (iter-1) caught 3 gaps: P1 (fire-once script used nonexistent `--url`/`--branch` CLI flags); S1 (allow-set gate was subset-not-exact); C1 (README missing Recent-activity row). All fixed in iter-2. Verification: `claude plugin validate --strict ./plugins/gobbi` → exit 0; `sync-plugin-package.sh --check` → exit 0; injection-tested.

## What shipped

Commits (all on `chore/session-2026-05-30-0fd65721`, HEAD at session close):
- `7af2dde` — T1: sync script + materialize (18 skills)
- `40d7de2` — T2-T4: plugin.json + hooks.json + marketplace.json
- `c021ea2` — T5-T6: operator-assisted validation scripts
- `07fbe1a` — T7-T8: claude-plugin skill (19th) + resync + README update

Notable scope facts:
- `.claude/settings.json` UNCHANGED (Option C honored; DD-9 honored)
- 19 skill dirs in `plugins/gobbi/skills/` (verified: all byte-identical to canonical; 0 symlinks)
- `claude plugin validate --strict` exits 0

## What got stuck

- **T5 fire-once live run** (OPERATOR-ASSISTED): `scripts/validate-plugin-hooks-fire-once.sh` is ready; the live install + clean session + per-event triggers require the operator to run interactively. Scripts and procedures are embedded. Deferred post-merge.
- **T6 invocability live run** (OPERATOR-ASSISTED): `scripts/check-plugin-invocability.sh` is ready; the auto-grant finding + conditional settings edit require the operator. Deferred post-merge.
- **FLAG-2** (pre-existing): `skills/claude/SKILL.md` referenced in `CLAUDE.md` is a known dangling reference; not introduced this session.
- **Codex manifest reconciliation**: The `reconcile-codex-plugin-and-claude-plugin-manifests` backlog was staged and is now promoted. Out of scope this session.

## What shifted

- The plugin will be named `gobbi` (not `gobbi-core`) — fresh build, not a resurrection
- Hook split design: Option C (dev-vs-installed) — user chose dev-mode hooks stay in settings.json
- Skill count: 19 (not 18) — the `claude-plugin` skill ships with the package as skill 19
- Iter-2 auto-decision: T1 verifier reworded off the hard-coded "18" to accommodate T7's resync

## Decisions to respect

- **DD-2 (REPLACED in iter-2):** plugin uses bounded package, NOT repo-root. Do not re-litigate.
- **DD-2a:** materialized real copies. Escaping symlinks will be skipped on install-time copy.
- **Named re-sync trigger:** any canonical skills/agents/hooks edit → `scripts/sync-plugin-package.sh` in same commit.
- **DD-8 Option C:** settings.json keeps dev registration; hooks.json serves installed users. Do not merge them.
- **DD-9:** permissions.allow stays project-local; auto-grant pending empirical test (T6 live run).
- **Allow-set:** `plugins/gobbi/` top level EXACTLY `{.claude-plugin, skills, agents, hooks}` — `--check` must exit 0.

## Next session

1. Run `scripts/validate-plugin-hooks-fire-once.sh` (operator-assisted T5 — fire-once for all 3 hook events when plugin is installed in a clean session).
2. Run `scripts/check-plugin-invocability.sh` (operator-assisted T6 — auto-grant finding + conditional settings.json edit).
3. Open a PR from `chore/session-2026-05-30-0fd65721` to `develop`.
4. Post-merge: close the `reconcile-codex-plugin-and-claude-plugin-manifests` backlog or defer it.
