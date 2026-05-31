---
name: gobbi-claude-code-plugin-build
description: 8-task ordered Execution plan for the fresh v0.5 gobbi Claude Code plugin package (skills+agents+hooks) + marketplace + sync/drift gate + fire-once validation + invocability check + claude-plugin skill + docs. PASS at iter-2 (2026-05-31).
type: plans
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-package, marketplace, materialization, hooks, planning]
supersedes: null
superseded_by: null
task_count: 8
related:
  - features/install-runtime/design/gobbi-plugin-component-inventory-and-layout.md
  - features/install-runtime/decisions/plugin-plan-decomposition-and-ordering.md
  - features/install-runtime/decisions/package-includes-claude-plugin-skill-resync-after-t7.md
---

# Plan — gobbi v0.5 Claude Code Plugin (install-runtime)

8 ordered, single-category Execution tasks (all `executor`, sonnet default), bottom-up. Executed in session 0fd65721 (2026-05-30/31). Dual-system eval PASS at iter-2.

**Skill count:** 18 canonical skills materialized at T1; T7 authors a 19th canonical skill (`claude-plugin`) and re-runs the sync so the **final package ships 19 skills** (iter-2 auto-decision D-8).

## Tasks (ordered)

1. **01-materialize-package-and-sync-script** — `scripts/sync-plugin-package.sh` (materialize + `--check` diff gate + **allow-set membership guard**: assert `plugins/gobbi/` top level is EXACTLY `{.claude-plugin, skills, agents, hooks}`) + run it to produce `plugins/gobbi/{skills,agents,hooks}/` real copies (18 skill dirs at T1, 5 `.md` agents, 2 hook scripts +x). deps: none.
2. **02-plugin-manifest** — `plugins/gobbi/.claude-plugin/plugin.json` (name gobbi; `skills: "./skills/"`; `agents: [5 .md]`; `hooks: "./hooks/hooks.json"`). deps: 01.
3. **03-plugin-hooks-json** — `plugins/gobbi/hooks/hooks.json` (3 registrations via `${CLAUDE_PLUGIN_ROOT}`, mirrors live settings.json shape). deps: 01.
4. **04-marketplace-json** — repo-root `.claude-plugin/marketplace.json` (Claude schema; `source: "./plugins/gobbi"`). deps: 02.
5. **05-fire-once-hook-validation (OPERATOR-ASSISTED)** — `scripts/validate-plugin-hooks-fire-once.sh` (AUTONOMOUS: script + marker instrumentation + installed-cache allow-set assertion + embedded operator procedure). LIVE install + clean session + per-event triggers = OPERATOR-RUN (worktree-faithful absolute-path install + sentinel); assert exactly one marker per `hook_event_name` (PostToolUseFailure = non-zero-exit Task) + installed-cache top level == allow-set. Harness pinned (D-10). deps: 03, 04.
6. **06-invocability-check-and-conditional-permissions (OPERATOR-ASSISTED)** — `scripts/check-plugin-invocability.sh` (AUTONOMOUS: script + auto-grant TRUE/FALSE logic + operator procedure + conditional-edit logic). LIVE post-install invocation of `gobbi:codex` + `gobbi:gobbi-hook-authoring` + 1 agent = OPERATOR-RUN; add `Skill(codex)`+`Skill(gobbi-hook-authoring)` to `.claude/settings.json` ONLY IF operator returns auto-grant FALSE. deps: 05.
7. **07-claude-plugin-skill-and-mirror** — canonical `.gobbi/.../skills/claude-plugin/SKILL.md` (general guide + layered gobbi section) + `.claude/skills/claude-plugin/SKILL.md` mirror symlink + **re-run `scripts/sync-plugin-package.sh`** so `plugins/gobbi/skills/claude-plugin/` is materialized (package 18 → 19); `--check` still exits 0. deps: 01,02,03,04,05,06.
8. **08-feature-memory-docs-update** — update `features/install-runtime/README.md` (plugin package w/ 19 packaged skills, dev-vs-installed hook split, re-sync surface + allow-set guard, claude-plugin pointer; bump last_updated). deps: 07.

## Dependency shape

`01 → {02, 03}`; `02 → 04`; `{03, 04} → 05 → 06`; `{01..06} → 07 → 08`. Acyclic. No two tasks modify the same file. Execution ran all 8 sequentially.

## Frozen upstream decisions consumed (NOT re-opened)

Package root `plugins/gobbi/` + `source: "./plugins/gobbi"` + repo-root `.claude-plugin/`; materialized real copies (DD-2a); named re-sync trigger + sync-script diff gate; DD-8 Option C dev-vs-installed hook split; DD-7 Option (a) positional-arg worktree-path install + sentinel; DD-9 keep permissions project-local + verify empirically; 18 skills materialized at T1 / 5 `.md` agents / 2 scripts-3 registrations.

## Iter-2 remediations

- **Cache allow-set membership** asserted in BOTH halves: T1 `--check` allow-set clause (AUTONOMOUS) + T5 installed-cache assertion (OPERATOR-RUN).
- **T5/T6 OPERATOR-ASSISTED:** executor authors script + harness + operator procedure (autonomous); operator runs the live install/invocation and returns evidence.
- **T5 harness mechanics pinned + cleanup/isolation boundary** (D-10).
- **Package SHIPS `claude-plugin` (→ 19):** T7 re-runs the sync; T1 verifier reworded off the hard-coded "18".
- **Fire-once script operator procedure fixed:** positional `claude plugin marketplace add <worktree-path>` install (NOT non-existent `--url`/`--branch` flags).
- **Allow-set exact-membership gate:** the `--check` clause tests EXACT membership (fails on extras AND missing members), not subset.
- **README Recent-activity row added** by T8.

## Execution result

All 8 tasks shipped (PASS at iter-2, 2026-05-31). Operator-assisted live verification (T5/T6) deferred. See `execution/artifacts/execution-summary.md` for the full verification evidence.
