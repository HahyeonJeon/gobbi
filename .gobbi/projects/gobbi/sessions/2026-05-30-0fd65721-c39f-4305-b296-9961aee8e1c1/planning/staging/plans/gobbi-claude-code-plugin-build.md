---
name: gobbi-claude-code-plugin-build
description: 8-task ordered Execution plan for the fresh v0.5 gobbi Claude Code plugin package (skills+agents+hooks) + marketplace + sync/drift gate + fire-once validation + invocability check + claude-plugin skill + docs.
type: plans
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, plugin-package, marketplace, materialization, hooks, planning]
supersedes: null
superseded_by: null
related:
  - preparation/artifacts/preparation-readiness.md
  - preparation/staging/design/gobbi-plugin-component-inventory-and-layout.md
  - ideation/artifacts/gobbi-plugin-ideation.md
  - planning/staging/decisions/package-includes-claude-plugin-skill-resync-after-t7.md
---

# Plan — gobbi v0.5 Claude Code Plugin (install-runtime)

8 ordered, single-category Execution tasks (all `executor`, sonnet default), bottom-up. Full task records, dependency table, parallel lanes, agent assignments, self-review, and Principle-13 SPEC/CRUD for the doc tasks are in the canonical rawdata draft at `planning/rawdata/plan.md`. This staged copy carries the locked task set for Wrap-up promotion to `features/install-runtime/plans/`.

**Skill count:** 18 canonical skills materialized at T1; T7 authors a 19th canonical skill (`claude-plugin`) and re-runs the sync so the **final package ships 19 skills** (iter-2 auto-decision D-8).

## Tasks (ordered)

1. **01-materialize-package-and-sync-script** — `scripts/sync-plugin-package.sh` (materialize + `--check` diff gate + **allow-set membership guard**: assert `plugins/gobbi/` top level is EXACTLY `{.claude-plugin, skills, agents, hooks}`) + run it to produce `plugins/gobbi/{skills,agents,hooks}/` real copies (18 skill dirs, 5 `.md` agents, 2 hook scripts +x). deps: none.
2. **02-plugin-manifest** — `plugins/gobbi/.claude-plugin/plugin.json` (name gobbi; `skills: "./skills/"`; `agents: [5 .md]`; `hooks: "./hooks/hooks.json"`). deps: 01.
3. **03-plugin-hooks-json** — `plugins/gobbi/hooks/hooks.json` (3 registrations via `${CLAUDE_PLUGIN_ROOT}`, mirrors live settings.json shape). deps: 01.
4. **04-marketplace-json** — repo-root `.claude-plugin/marketplace.json` (Claude schema; `source: "./plugins/gobbi"`). deps: 02.
5. **05-fire-once-hook-validation (OPERATOR-ASSISTED)** — `scripts/validate-plugin-hooks-fire-once.sh` (AUTONOMOUS: script + marker instrumentation + installed-cache allow-set assertion + embedded operator procedure). LIVE install + clean session + per-event triggers = OPERATOR-RUN (DD-7 git-ref install from the SESSION branch + sentinel); assert exactly one marker per `hook_event_name` (PostToolUseFailure = non-zero-exit Task) + installed-cache top level == allow-set. Harness pinned (D-10): install CLI, marker file keyed on `hook_event_name`, deterministic triggers, temp-config/uninstall cleanup boundary. deps: 03, 04.
6. **06-invocability-check-and-conditional-permissions (OPERATOR-ASSISTED)** — `scripts/check-plugin-invocability.sh` (AUTONOMOUS: script + auto-grant TRUE/FALSE logic + operator procedure + conditional-edit logic). LIVE post-install invocation of `gobbi:codex` + `gobbi:gobbi-hook-authoring` + 1 agent = OPERATOR-RUN; add `Skill(codex)`+`Skill(gobbi-hook-authoring)` to `.claude/settings.json` ONLY IF operator returns auto-grant FALSE. deps: 05.
7. **07-claude-plugin-skill-and-mirror** — canonical `.gobbi/.../skills/claude-plugin/SKILL.md` (general guide + layered gobbi section) + `.claude/skills/claude-plugin/SKILL.md` mirror symlink + **re-run `scripts/sync-plugin-package.sh`** so `plugins/gobbi/skills/claude-plugin/` is materialized (package 18 → 19); `--check` still exits 0. deps: 01,02,03,04,05,06.
8. **08-feature-memory-docs-update** — update `features/install-runtime/README.md` (plugin package w/ 19 packaged skills, dev-vs-installed hook split, re-sync surface + allow-set guard, claude-plugin pointer; bump last_updated). deps: 07.

## Dependency shape

`01 → {02, 03}`; `02 → 04`; `{03, 04} → 05 → 06`; `{01..06} → 07 → 08`. Acyclic. No two tasks modify the same file (T7's resync ADDS the new `plugins/gobbi/skills/claude-plugin/` subtree — a monotonic addition, not a conflicting edit of T1's 18 dirs; conflict flags: none). Lanes (doc-only): L1 package-build 01→02→03→04; L2 runtime-verification (operator-assisted) 05→06; L3 documentation+resync 07→08. Execution runs all 8 sequentially.

## Frozen upstream decisions consumed (NOT re-opened)

Package root `plugins/gobbi/` + `source: "./plugins/gobbi"` + repo-root `.claude-plugin/`; materialized real copies (DD-2a); named re-sync trigger + sync-script diff gate; DD-8 Option C dev-vs-installed hook split; DD-7 Option (a) git-ref install + sentinel; DD-9 keep permissions project-local + verify empirically; 18 skills materialized at T1 / 5 `.md` agents / 2 scripts-3 registrations.

## iter-2 remediations (REVISE; both eval systems converged)

- **Cache allow-set membership** asserted in BOTH halves: T1 `--check` allow-set clause (f, AUTONOMOUS, source-package) + T5 installed-cache assertion (OPERATOR-RUN). (RK-1 / COD-PROJ-001 / COD-OVERALL-001)
- **T5/T6 OPERATOR-ASSISTED:** executor authors script + harness + operator procedure (autonomous); operator runs the live install/invocation and returns evidence. No autonomous claim of installed-state verification. (OV-1 / ST-2 / US-1 / COD-RISK-001)
- **T5 harness mechanics pinned + cleanup/isolation boundary** (D-10). (COD-USAGE-001 + COD-RISK-001)
- **Package SHIPS `claude-plugin` (→ 19):** T7 re-runs the sync; T1 verifier reworded off the hard-coded "18". (D-8; COD-CONS-001)
