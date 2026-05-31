# Planning — gobbi v0.5 Claude Code Plugin (install-runtime)

**Loop:** planning · iter-2 (REVISE) · **Session:** 0fd65721-c39f-4305-b296-9961aee8e1c1
**Feature:** install-runtime
**Inputs:** `ideation/artifacts/gobbi-plugin-ideation.md`, `preparation/artifacts/preparation-readiness.md` (CANONICAL), 5 staged decisions, `preparation/staging/design/gobbi-plugin-component-inventory-and-layout.md`.
**Mode:** worktree-pr · Worktree root: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721/` (`$WT` below)

This plan decomposes two coupled, ratified deliverables (A: the bounded `gobbi` plugin package; B: distribution + tooling + docs) into 8 ordered, single-category Execution tasks. All design decisions (DD-1..DD-9 + the 5 resolved design-details + the 5-agent / 2-script-3-registration inventory) are RATIFIED upstream and are NOT re-opened here.

**Skill-count note (iter-2):** the canonical skill set at the start of the build is **18** dirs (T1 materializes those 18 into the package). T7 then authors a **new 19th canonical skill** (`claude-plugin`); per the iter-2 auto-decision D-8, the plugin SHIPS its own `claude-plugin` skill, so T7 re-runs the sync script to capture it, and the **FINAL package contains 19 skills**. "18" therefore refers to materialization time at T1; "19" to the final shipped package after the T7 resync. See § Decisions log D-8.

**iter-2 REVISE scope:** this iteration applies 4 focused remediations from the dual-system eval (Claude PASS / Codex REVISE, both converged): (1) explicit cache allow-set membership assertion at T1 source-package time AND T5 installed-cache time; (2) T5/T6 relabelled OPERATOR-ASSISTED with the autonomous script-authoring portion separated from the operator-run install portion; (3) T5 harness mechanics pinned (CLI, marker format, per-event triggers, cleanup/isolation boundary); (4) the T7-adds-a-19th-skill consistency fix (sync re-run + verifier reworded off the hard-coded "18"). The 8-task graph, ordering, layout, dev-vs-installed split, materialization-real-copies, and the already-correct verification anchors are PRESERVED.

---

## Scope reference

Locked Ideation Scope Contract: `ideation/artifacts/gobbi-plugin-ideation.md` § Scope Contract (verbatim triplet):
- **Project:** gobbi
- **Feature:** install-runtime
- **Goal:** Package gobbi as a self-contained installable Claude Code plugin (skills + agents + hooks only) and codify plugin authoring as a reusable skill.

Two coupled deliverables, both in scope this session:
- **A.** Bounded `gobbi` plugin package at `plugins/gobbi/` = `.claude-plugin/plugin.json` + `skills/` (18 real-copy dirs at T1; 19 after the T7 resync) + `agents/` (5 real-copy `.md`) + `hooks/` (2 real-copy scripts + `hooks.json`), nothing else (the package top level is exactly `{.claude-plugin/, skills/, agents/, hooks/}` — the cache allow-set).
- **B.** Repo-root `.claude-plugin/marketplace.json` (Claude schema) + `scripts/sync-plugin-package.sh` (materialization + drift gate + allow-set membership guard) + fire-exactly-once hook validation + post-install invocability check + conditional `.claude/settings.json` permission entries + `claude-plugin` skill (+ `.claude/skills/` mirror symlink) + feature-memory doc updates.

Ratified resolutions consumed (do NOT re-open):
- Package root `plugins/gobbi/`; marketplace `source: "./plugins/gobbi"`; marketplace at repo-root `.claude-plugin/` (`bounded-package-root-and-marketplace-source-resolved.md`).
- Materialized REAL copies, not symlinks (DD-2a; `c79d28e`/#251).
- Named re-sync trigger + `scripts/sync-plugin-package.sh` diff gate (`drift-resync-trigger-and-mechanical-gate-resolved.md`).
- Hook DD-8 = Option C dev-vs-installed split (`hook-double-registration-steady-state-dev-vs-installed-split.md`).
- DD-7 = Option (a) commit/push + git-ref source + worktree sentinel (`worktree-test-default-git-ref-source-with-sentinel.md`).
- DD-9 = keep permissions project-local + verify auto-grant empirically (`permissions-disposition-keep-project-local-verify-empirically.md`).
- 18 skills materialized at T1 (incl. `gobbi-hook-authoring`); 5 `.md` agents only (exclude `.toml`); 2 scripts / 3 registrations.

**iter-2 auto-decision (D-8) — package SHIPS the `claude-plugin` skill (→ 19 final).** Logical consequence of "ship gobbi's skills" + the sync-on-skill-edit trigger: the new `claude-plugin` canonical skill authored at T7 is a packaged skill, so T7 re-runs `scripts/sync-plugin-package.sh` to materialize it into `plugins/gobbi/skills/claude-plugin/`. Recorded at § Decisions log D-8 and staged decision `package-includes-claude-plugin-skill-resync-after-t7.md`.

---

## File map (grouped by feature concern)

### Concern 1 — Materialization tooling + package component trees (T1)
| File | Op | Responsibility |
|---|---|---|
| `scripts/sync-plugin-package.sh` | Create | Re-materialize `plugins/gobbi/{skills,agents,hooks}/` from canonical sources as REAL copies; `--check` diff/checksum gate that exits non-zero on divergence; **allow-set membership guard** that asserts the `plugins/gobbi/` top level is EXACTLY `{.claude-plugin/, skills/, agents/, hooks/}` and nothing else. |
| `plugins/gobbi/skills/**` | Create | 18 real-copy skill dirs (every file under each) at T1 — output of the sync script. (T7 resync raises this to 19 by adding `claude-plugin/`.) |
| `plugins/gobbi/agents/{manager,leader,executor,evaluator,assistant}.md` | Create | 5 real-copy role `.md` (exclude `.toml`), output of the sync script. |
| `plugins/gobbi/hooks/session-start.sh`, `plugins/gobbi/hooks/post-tool-use-agents.sh` | Create | 2 real-copy hook scripts, bodies unchanged, `+x` preserved, output of the sync script. |

### Concern 2 — Plugin manifest (T2)
| File | Op | Responsibility |
|---|---|---|
| `plugins/gobbi/.claude-plugin/plugin.json` | Create | Manifest: `name: gobbi`, metadata, `skills: "./skills/"`, `agents: [5 .md paths]`, `hooks: "./hooks/hooks.json"`. |

### Concern 3 — Plugin hooks registration (T3)
| File | Op | Responsibility |
|---|---|---|
| `plugins/gobbi/hooks/hooks.json` | Create | 3 event registrations via `${CLAUDE_PLUGIN_ROOT}`, mirroring the live `.claude/settings.json` shape. |

### Concern 4 — Marketplace catalog (T4)
| File | Op | Responsibility |
|---|---|---|
| `.claude-plugin/marketplace.json` | Create | Repo-root Claude-schema marketplace: `name`/`owner`/`plugins[]` with the gobbi entry `source: "./plugins/gobbi"`. |

### Concern 5 — Fire-exactly-once hook validation + installed-cache allow-set (T5, OPERATOR-ASSISTED)
| File | Op | Responsibility |
|---|---|---|
| `scripts/validate-plugin-hooks-fire-once.sh` | Create | **(Autonomous executor deliverable)** Installed-case fire-once validator + installed-cache allow-set assertion: per-fire marker keyed on `hook_event_name`; deterministic per-event triggers; assert exactly one marker per event; locate the installed cache dir and assert its top level is EXACTLY the package allow-set with negative checks for `.gobbi`/`sessions`/repo content. The LIVE install + clean-session run is an OPERATOR-ASSISTED step (see task record). |

### Concern 6 — Post-install invocability check + conditional permissions (T6, OPERATOR-ASSISTED)
| File | Op | Responsibility |
|---|---|---|
| `scripts/check-plugin-invocability.sh` | Create | **(Autonomous executor deliverable)** Post-install check that invokes `gobbi:codex` + `gobbi:gobbi-hook-authoring` + one agent; reports auto-grant TRUE/FALSE. The LIVE invocation is OPERATOR-ASSISTED. |
| `.claude/settings.json` | Modify (CONDITIONAL, operator-confirmed) | Add `Skill(codex)` + `Skill(gobbi-hook-authoring)` to `permissions.allow` ONLY IF the operator-run check proves auto-grant FALSE. |

### Concern 7 — `claude-plugin` skill + mirror + package resync (T7)
| File | Op | Responsibility |
|---|---|---|
| `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` | Create | Canonical `claude-plugin` skill (19th canonical skill): general Claude-Code-plugin authoring/update guide + layered gobbi-specific section. |
| `.claude/skills/claude-plugin/SKILL.md` | Create (symlink) | Per-file mirror symlink into the canonical SKILL.md. |
| `plugins/gobbi/skills/claude-plugin/**` | Create (via resync) | The new skill materialized into the package by re-running `scripts/sync-plugin-package.sh` (package skills: 18 → 19). |

### Concern 8 — Feature-memory documentation (T8)
| File | Op | Responsibility |
|---|---|---|
| `.gobbi/projects/gobbi/features/install-runtime/README.md` | Modify | Document the new plugin package, dev-vs-installed hook split, and the materialization/re-sync surface in the feature overview. |

> **All paths above are repo-relative; the executor MUST prefix every write with the worktree-absolute root `$WT` (`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721/`).** See Decisions log D-W and the worktree-write-path mistakes.

---

## Tasks

```yaml
id: 01-materialize-package-and-sync-script
what: Author scripts/sync-plugin-package.sh (materialize + --check diff gate + allow-set membership guard) and run it to produce the plugins/gobbi/{skills,agents,hooks}/ real-copy component trees (18 skill dirs, 5 .md agents, 2 hook scripts +x).
traces-to:
  - "Materialize REAL copies of current skills + 5 role .md agents + 2 hook scripts into the package (mechanism = Execution's; DD-2a + prior-art #251)"
  - "Named re-sync trigger ... + recommend scripts/sync-plugin-package.sh diff gate (F-S1/CONS-1)"
  - "Post-install cache gate: after a real install the cached plugin dir must contain ONLY plugin payload — no .gobbi/.../sessions, project memory, or repo content (R1 regression guard) — source-package half asserted here at --check time"
requires: []
files:
  - {path: "scripts/sync-plugin-package.sh", op: create}
  - {path: "plugins/gobbi/skills/**", op: create}
  - {path: "plugins/gobbi/agents/manager.md", op: create}
  - {path: "plugins/gobbi/agents/leader.md", op: create}
  - {path: "plugins/gobbi/agents/executor.md", op: create}
  - {path: "plugins/gobbi/agents/evaluator.md", op: create}
  - {path: "plugins/gobbi/agents/assistant.md", op: create}
  - {path: "plugins/gobbi/hooks/session-start.sh", op: create}
  - {path: "plugins/gobbi/hooks/post-tool-use-agents.sh", op: create}
inputs: []
outputs: [sync-script, materialized-skills-tree, materialized-agents-tree, materialized-hook-scripts]
verifies: >
  Run scripts/sync-plugin-package.sh then: (a) plugins/gobbi/skills/ contains all canonical packaged-skill dirs present at materialization time
  (18 at T1) matching the canonical set; (b) plugins/gobbi/agents/ has exactly the 5 .md and zero .toml; (c) the 2 hook scripts are real files
  (test ! -L), +x preserved, bodies byte-identical to canonical (diff -r returns empty); (d) every file under plugins/gobbi/{skills,agents,hooks}
  is a real file, find -type l returns empty; (e) scripts/sync-plugin-package.sh --check exits 0 immediately after a sync and exits non-zero after
  a deliberate single-byte tamper; (f) ALLOW-SET MEMBERSHIP — the top level of plugins/gobbi/ is EXACTLY {.claude-plugin, skills, agents, hooks}
  (no stray top-level file or dir; no .gobbi, sessions, node_modules, .git, repo docs, or session memory). The --check gate FAILS non-zero if any
  out-of-allow-set entry appears under plugins/gobbi/. This is the AUTONOMOUS source-package half of the R1 cache allow-set guard (runs with no install).
```

```yaml
id: 02-plugin-manifest
what: Author plugins/gobbi/.claude-plugin/plugin.json — name gobbi + metadata + skills "./skills/" (ADDS-to dir pointer) + agents array of the 5 .md paths (REPLACES) + hooks "./hooks/hooks.json".
traces-to:
  - "Author plugin.json: name: gobbi, metadata, skills dir pointer (ADDS-to), agents = ARRAY of 5 .md paths (exclude .toml), hooks -> ./hooks/hooks.json (DD-2 + manifest-schema + ba8aa42)"
requires: [01-materialize-package-and-sync-script]
files:
  - {path: "plugins/gobbi/.claude-plugin/plugin.json", op: create}
inputs: [materialized-skills-tree, materialized-agents-tree]
outputs: [plugin-manifest]
verifies: >
  python3 -m json.tool plugins/gobbi/.claude-plugin/plugin.json parses; the file has name=="gobbi",
  skills=="./skills/", agents is an array of exactly the 5 ./agents/<role>.md paths (no .toml), hooks=="./hooks/hooks.json";
  every agents[] path resolves to an existing real file under plugins/gobbi/agents/.
```

```yaml
id: 03-plugin-hooks-json
what: Author plugins/gobbi/hooks/hooks.json registering the 2 scripts across 3 events (SessionStart startup|resume|clear|compact; PostToolUse Task|Agent; PostToolUseFailure Task|Agent) with ${CLAUDE_PLUGIN_ROOT} command paths, mirroring the live .claude/settings.json shape.
traces-to:
  - "Author hooks/hooks.json reproducing ALL THREE event registrations with ${CLAUDE_PLUGIN_ROOT} paths; bodies unchanged; do NOT over-narrow matchers (#256 lesson) (DD-3 + settings.json)"
requires: [01-materialize-package-and-sync-script]
files:
  - {path: "plugins/gobbi/hooks/hooks.json", op: create}
inputs: [materialized-hook-scripts]
outputs: [plugin-hooks-json]
verifies: >
  python3 -m json.tool plugins/gobbi/hooks/hooks.json parses; it has exactly the 3 event keys
  SessionStart/PostToolUse/PostToolUseFailure; SessionStart matcher == "startup|resume|clear|compact" -> ${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh;
  PostToolUse AND PostToolUseFailure matcher == "Task|Agent" -> ${CLAUDE_PLUGIN_ROOT}/hooks/post-tool-use-agents.sh;
  no matcher is narrower than the live .claude/settings.json equivalents (diff the matcher/command tuples against settings.json hooks block).
```

```yaml
id: 04-marketplace-json
what: Author repo-root .claude-plugin/marketplace.json (Claude schema) cataloging the gobbi plugin with source "./plugins/gobbi".
traces-to:
  - "Author Claude-schema .claude-plugin/marketplace.json (name/owner/plugins[] with name+source) (DD-5 + marketplace-schema reference) — Planning must name the exact source value (STRUCT-1)"
requires: [02-plugin-manifest]
files:
  - {path: ".claude-plugin/marketplace.json", op: create}
inputs: [plugin-manifest]
outputs: [marketplace-catalog]
verifies: >
  python3 -m json.tool .claude-plugin/marketplace.json parses; it has top-level name + owner.name + plugins[];
  plugins[0].name=="gobbi" and plugins[0].source=="./plugins/gobbi"; it is the Claude object schema
  (NOT the Codex object-source schema); claude plugin validate --strict ./plugins/gobbi exits 0 (manifest+package now resolvable).
```

```yaml
id: 05-fire-once-hook-validation
what: >
  Author scripts/validate-plugin-hooks-fire-once.sh (AUTONOMOUS executor deliverable) AND a documented step-by-step operator procedure; the LIVE
  install + clean-session run is an OPERATOR-ASSISTED step. The script must assert each of the 3 registrations fires EXACTLY once (keyed on
  hook_event_name) and that the installed-cache top level equals the package allow-set.
execution-model: >
  OPERATOR-ASSISTED. A spawned executor CANNOT install a plugin out-of-process, start a fresh clean Claude session, or trigger live hook events.
  AUTONOMOUS PORTION (executor, this task): author scripts/validate-plugin-hooks-fire-once.sh + the marker-instrumentation + the assertion/extraction
  logic + a written OPERATOR PROCEDURE (the exact command sequence below). OPERATOR-RUN PORTION (manager/user): perform the install + clean session +
  event triggers and return the marker log + cache-listing to the executor, OR run the procedure as a documented post-build verification. The task
  MUST NOT claim autonomous executor verification of the installed state.
traces-to:
  - "DECIDE hook double-registration steady state (DD-8 — Planning blocker) + fire-exactly-once validation (R2 + settings.json)"
  - "Post-install cache gate: installed cache must contain ONLY plugin payload — installed-cache half of the R1 allow-set guard asserted here"
requires: [03-plugin-hooks-json, 04-marketplace-json]
files:
  - {path: "scripts/validate-plugin-hooks-fire-once.sh", op: create}
inputs: [plugin-hooks-json, marketplace-catalog]
outputs: [fire-once-validator, fire-once-result, installed-cache-allow-set-result]
verifies: >
  AUTONOMOUS (executor, in this dev session): scripts/validate-plugin-hooks-fire-once.sh exists, is +x, passes bash -n (syntax),
  contains (i) a marker-file mechanism whose path is a per-event file under an isolated marker dir (e.g. $MARKER_DIR/$hook_event_name) appended
  once per fire, (ii) a parser that asserts EXACTLY one marker line/file per hook_event_name (SessionStart, PostToolUse, PostToolUseFailure),
  (iii) an installed-cache allow-set assertion that lists the installed cache top level and FAILS if it is not exactly {.claude-plugin, skills,
  agents, hooks} or if any of .gobbi/sessions/project-memory/repo-doc entries appear, and (iv) an embedded OPERATOR PROCEDURE block (see HARNESS
  MECHANICS below) plus a cleanup/uninstall step. The autonomous gate is: script present + syntactically valid + the embedded procedure documents
  every operator command.  OPERATOR-RUN (manager/user, returns evidence): run the procedure — assert the marker log contains EXACTLY one line per
  hook_event_name (PostToolUseFailure triggered by a Task engineered to exit non-zero), assert the worktree-only sentinel is present in
  ~/.claude/plugins/cache/<id>/ (DD-7 falsifier), and assert the installed-cache allow-set holds. The operator pastes the marker log + cache listing
  back; the executor (or this task's record) asserts them against the script's pass rule.
harness-mechanics: >
  Pinned per Codex COD-USAGE-001. (1) INSTALL SOURCE: from the worktree-faithful git-ref marketplace (DD-7) — commit & push the SESSION branch
  (chore/session-2026-05-30-0fd65721; NOT develop/main — see RK-2 gate), then `claude plugin marketplace add <git-ref-source pointing at that branch>`
  followed by `claude plugin install gobbi@<marketplace>`; confirm with `claude plugin validate`. (2) MARKER FILE: each packaged hook script writes
  one line to "$GOBBI_HOOK_MARKER_DIR/${hook_event_name}" (env var the operator sets to a temp dir) on each fire; format = one timestamped line per
  fire; the parser counts lines per file and asserts exactly 1. (3) PER-EVENT DETERMINISTIC TRIGGERS: SessionStart = start a fresh session / run
  `/clear`; PostToolUse = issue one Task/Agent tool call that exits 0; PostToolUseFailure = issue one Task/Agent tool call ENGINEERED to exit
  non-zero. (4) CLEANUP / ISOLATION BOUNDARY: run against an ISOLATED Claude config/HOME when possible (e.g. a temp CLAUDE_CONFIG_DIR/HOME) so the
  validation does not pollute the dev environment; if the real user config must be used, record pre-state and run `claude plugin uninstall gobbi`
  + `claude plugin marketplace remove <id>` + clear the install cache afterward, leaving the registry restored. The clean installed-only run must
  have NO active in-repo .claude/settings.json dev registrations (DD-8 split).
```

```yaml
id: 06-invocability-check-and-conditional-permissions
what: >
  Author scripts/check-plugin-invocability.sh (AUTONOMOUS executor deliverable) + a documented operator procedure; the LIVE post-install invocation is
  OPERATOR-ASSISTED. The check invokes gobbi:codex + gobbi:gobbi-hook-authoring + one agent to test the auto-grant premise, and — only if the
  operator-run check proves auto-grant FALSE — adds Skill(codex)+Skill(gobbi-hook-authoring) to .claude/settings.json permissions.allow.
execution-model: >
  OPERATOR-ASSISTED. A spawned executor cannot interactively invoke skills/agents in a live installed session. AUTONOMOUS PORTION (executor):
  author scripts/check-plugin-invocability.sh + the auto-grant TRUE/FALSE extraction logic + the written OPERATOR PROCEDURE (which skills/agent to
  invoke, how to read load success/refusal) + the conditional-edit logic guarded on the operator-returned finding. OPERATOR-RUN PORTION
  (manager/user): perform the post-install invocations and return auto-grant TRUE or FALSE. The conditional .claude/settings.json edit fires ONLY
  on an operator-confirmed FALSE. The task MUST NOT claim autonomous executor verification of the installed invocation.
traces-to:
  - "DECIDE permissions disposition (DD-9 / U2): ship vs project-local; post-install invocability check"
requires: [05-fire-once-hook-validation]
files:
  - {path: "scripts/check-plugin-invocability.sh", op: create}
  - {path: ".claude/settings.json", op: modify}
inputs: [marketplace-catalog]
outputs: [invocability-checker, auto-grant-finding, conditional-permission-entries]
verifies: >
  AUTONOMOUS (executor, this dev session): scripts/check-plugin-invocability.sh exists, +x, passes bash -n; it targets the 2 skills OMITTED from the
  live allow-list (gobbi:codex, gobbi:gobbi-hook-authoring) + one of the 5 agents (e.g. leader); it records auto-grant TRUE (all load) or FALSE (any
  refused); it contains an embedded OPERATOR PROCEDURE block; the conditional .claude/settings.json edit is guarded on an operator-supplied
  auto-grant=FALSE.  OPERATOR-RUN (manager/user, with the plugin installed from T5's worktree-faithful install): run the script's invocations and
  return TRUE/FALSE.  CONDITIONAL OUTCOME — IF operator returns FALSE: python3 -m json.tool .claude/settings.json parses AND permissions.allow now
  contains both Skill(codex) and Skill(gobbi-hook-authoring), and no other allow entry changed (diff the allow array against the pre-edit snapshot —
  exactly +2). IF TRUE: .claude/settings.json is UNCHANGED (the conditional Modify does not fire).
```

```yaml
id: 07-claude-plugin-skill-and-mirror
what: >
  Author the canonical .gobbi/projects/gobbi/skills/claude-plugin/SKILL.md (the 19th canonical skill; general Claude-Code-plugin authoring/update
  guide + layered gobbi section), create the .claude/skills/claude-plugin/SKILL.md mirror symlink, AND re-run scripts/sync-plugin-package.sh so the
  new skill is materialized into the package (plugins/gobbi/skills/: 18 -> 19).
traces-to:
  - "Author claude-plugin/SKILL.md (general guide + layered gobbi section incl. drift/sync DD-2a + ADDS-vs-REPLACES footgun + named re-sync trigger) + create .claude/skills/claude-plugin/SKILL.md symlink (DD-6 + F-S1/CONS-1)"
  - "Package SHIPS the claude-plugin skill (iter-2 D-8): re-run the sync trigger after authoring so the new packaged skill is captured (final package = 19 skills)"
requires: [01-materialize-package-and-sync-script, 02-plugin-manifest, 03-plugin-hooks-json, 04-marketplace-json, 05-fire-once-hook-validation, 06-invocability-check-and-conditional-permissions]
files:
  - {path: ".gobbi/projects/gobbi/skills/claude-plugin/SKILL.md", op: create}
  - {path: ".claude/skills/claude-plugin/SKILL.md", op: create}
  - {path: "plugins/gobbi/skills/claude-plugin/**", op: create}
inputs: [sync-script, plugin-manifest, plugin-hooks-json, marketplace-catalog, fire-once-result, auto-grant-finding]
outputs: [claude-plugin-skill, claude-plugin-mirror-symlink, resynced-package-with-19-skills]
verifies: >
  The canonical SKILL.md exists with valid skill frontmatter (name: claude-plugin, description, allowed-tools) and contains BOTH a
  general authoring/update guide AND a "## gobbi" (layered) section that documents: the bounded-package layout, materialization + the
  re-sync trigger/gate + the allow-set membership guard, the dev-vs-installed hook split + double-fire caveat, the agents-REPLACES vs skills-ADDS-to
  asymmetry, the symlink-skip footgun, version cadence, and the validate/install/update flow. readlink .claude/skills/claude-plugin/SKILL.md resolves
  to the canonical target and `test -e` on the resolved path succeeds (symlink not dangling). RESYNC: after re-running scripts/sync-plugin-package.sh,
  plugins/gobbi/skills/claude-plugin/ exists as a real-copy dir (test -d, find -type l empty under it), plugins/gobbi/skills/ now has 19 dirs, AND
  scripts/sync-plugin-package.sh --check exits 0 (the allow-set + freshness gate still passes with the 19th skill present).
```

```yaml
id: 08-feature-memory-docs-update
what: Update the install-runtime feature README to reflect the new gobbi plugin package, the dev-vs-installed hook split, and the materialization/re-sync surface.
traces-to:
  - "Documentation (Principle 8): update the install-runtime feature memory / README and any doc that must reflect the new plugin"
requires: [07-claude-plugin-skill-and-mirror]
files:
  - {path: ".gobbi/projects/gobbi/features/install-runtime/README.md", op: modify}
inputs: [claude-plugin-skill, plugin-manifest, plugin-hooks-json, marketplace-catalog]
outputs: [updated-feature-readme]
verifies: >
  features/install-runtime/README.md now references: (a) the gobbi plugin package at plugins/gobbi/ + repo-root marketplace.json (final 19 packaged skills);
  (b) the DD-8 Option-C dev-vs-installed hook split (settings.json dev + plugin hooks.json installed); (c) the materialized-copy
  re-sync trigger + scripts/sync-plugin-package.sh gate (incl. the allow-set membership guard + the T7 resync that ships claude-plugin); (d) a pointer
  to the new claude-plugin skill. last_updated bumped to 2026-05-30.
  Spec + CRUD plan honored (see § Principle-13 SPEC for T8). No other feature-memory file edited.
```

---

## Dependency table

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| 01 materialize + sync script | — | 02, 03, 07 | `scripts/sync-plugin-package.sh`, `plugins/gobbi/{skills,agents,hooks/*.sh}` |
| 02 plugin manifest | 01 | 04, 07 | `plugins/gobbi/.claude-plugin/plugin.json` |
| 03 plugin hooks.json | 01 | 05, 07 | `plugins/gobbi/hooks/hooks.json` |
| 04 marketplace.json | 02 | 05, 07 | `.claude-plugin/marketplace.json` |
| 05 fire-once validation (operator-assisted) | 03, 04 | 06, 07 | `scripts/validate-plugin-hooks-fire-once.sh` |
| 06 invocability + perms (operator-assisted) | 05 | 07 | `scripts/check-plugin-invocability.sh`, `.claude/settings.json` (conditional) |
| 07 claude-plugin skill + mirror + resync | 01,02,03,04,05,06 | 08 | `.gobbi/.../skills/claude-plugin/SKILL.md`, `.claude/skills/claude-plugin/SKILL.md`, `plugins/gobbi/skills/claude-plugin/**` (resync) |
| 08 feature README | 07 | — | `features/install-runtime/README.md` |

T7 re-touches `plugins/gobbi/skills/` (adding ONLY the new `claude-plugin/` subtree via resync) — this is a monotonic addition of a NEW path, not a conflicting edit of T1's materialized files; T1's 18 dirs are unchanged. No two tasks create or modify the SAME file. The only shared parent dirs (`plugins/gobbi/`, `scripts/`) hold disjoint files per task. Acyclic; bottom-up (package base → manifest/hooks → catalog → runtime checks → skill+resync → docs).

Rationale for ordering choices:
- **01 first** — the manifest (`agents[]` paths), `hooks.json` (script copies), and `claude plugin validate` all reference materialized real files; they must exist first.
- **04 after 02** — the marketplace catalogs the plugin; `claude plugin validate --strict` (the T4 verifier) needs the manifest present.
- **05 after 03+04** — fire-once validation requires both the registered `hooks.json` and an installable marketplace.
- **06 after 05** — both run against the same installed plugin; sequencing avoids two parallel installs and lets 06 reuse 05's installed cache.
- **07 near-last** — the `claude-plugin` skill documents the *finished* package shape including the empirically-resolved hook double-fire behavior (T5) and auto-grant finding (T6); writing it earlier would document unverified premises (Principle 7). T7 also performs the package resync that ships the new skill (D-8), so it must run after T1's sync script exists.
- **08 last** — Principle 8: docs ship reflecting the final, verified implementation (final package = 19 skills).

---

## Parallel lanes

| Lane | Tasks | Order |
|---|---|---|
| L1 (package build) | 01 → 02 → 03 → 04 | sequential |
| L2 (runtime verification, operator-assisted) | 05 → 06 | sequential, after L1 |
| L3 (documentation + resync) | 07 → 08 | sequential, after L1+L2 |

Lanes are documentation only — the Execution Loop runs all 8 tasks strictly sequentially (01→08). 02 and 03 both depend only on 01 and touch disjoint files, so they are parallel-safe in principle, but Execution sequences them. **Conflict flags: none** — no two tasks touch the same file (T7's resync adds the NEW `plugins/gobbi/skills/claude-plugin/` subtree; it does not modify any file T1 created).

---

## Agent assignments

All tasks default to **executor** (single-category implementation; the plan fully decomposes each, so no `leader` sub-planning is warranted; none is trivial-enough for `assistant`). Model: executor default (sonnet) for all — no override; T7 is doc-heavy but bounded and reference-grounded, not a complexity override case.

**Operator-assist note (T5, T6):** these two tasks are OPERATOR-ASSISTED. The executor's autonomous deliverable is the validation script + assert harness + a documented step-by-step operator procedure (and, for T6, the conditional-edit logic guarded on an operator-supplied finding). The LIVE plugin install, fresh clean Claude session, deterministic hook-event triggers, and interactive skill/agent invocation are run by the operator (manager/user), who returns the marker log / cache listing / auto-grant result. The executor does NOT claim autonomous verification of the installed state — doing so would stall Execution or fabricate evidence (cf. `reproducing-a-bugged-command-is-not-validation`, `leader-iter2-verification-claim-without-evidence`).

| Task | Agent | Model | Required skills | Required mistakes |
|---|---|---|---|---|
| 01 | executor | sonnet (default) | `principles`, `execution`, `git` | `skills-mirror-symlinks-not-copies`, `executor-mirror-path-vs-worktree-physical-copy`, `subagent-relative-write-paths-stray-cd-doesnt-persist`, `worktree-physical-file-missing-when-checked-out` |
| 02 | executor | sonnet | `principles`, `execution` | `subagent-relative-write-paths-stray-cd-doesnt-persist` |
| 03 | executor | sonnet | `principles`, `execution`, `gobbi-hook-authoring` | `subagent-relative-write-paths-stray-cd-doesnt-persist` |
| 04 | executor | sonnet | `principles`, `execution`, `git` | `subagent-relative-write-paths-stray-cd-doesnt-persist`, `executor-cwd-reset-commits-task-to-wrong-branch` |
| 05 | executor (operator-assisted) | sonnet | `principles`, `execution`, `gobbi-hook-authoring`, `git` | `executor-cwd-reset-commits-task-to-wrong-branch`, `reproducing-a-bugged-command-is-not-validation`, `subagent-relative-write-paths-stray-cd-doesnt-persist`, `leader-iter2-verification-claim-without-evidence` |
| 06 | executor (operator-assisted) | sonnet | `principles`, `execution`, `git` | `executor-cwd-reset-commits-task-to-wrong-branch`, `subagent-relative-write-paths-stray-cd-doesnt-persist`, `reproducing-a-bugged-command-is-not-validation` |
| 07 | executor | sonnet | `principles`, `execution`, `claude` (doc-authoring standard — see note), `gobbi-hook-authoring` | `skills-mirror-symlinks-not-copies`, `edit-tool-refuses-symlink-paths`, `symlink-restore-depth-wrong`, `executor-mirror-path-vs-worktree-physical-copy` |
| 08 | executor | sonnet | `principles`, `execution` | `wrap-up-promotion-must-strip-staging-frontmatter` (awareness only — this is session-staging-vs-project-memory; T8 edits feature memory which Wrap-up promotes), `subagent-relative-write-paths-stray-cd-doesnt-persist` |

**Note on the `claude` skill (T7):** the `claude` skill is referenced in `CLAUDE.md` but the dir is a known dangling reference (FLAG-2; readiness doc Sub-step C). The executor should follow the `.claude/`-doc-authoring conventions evident in sibling SKILL.md files and the project rules; if no `claude` skill loads, that is expected — it is NOT a blocker (readiness confirmed it is not a gap). Listed here so the Execution manager knows the reference may not resolve.

Justifications for non-obvious skill choices:
- T1/T7 carry the symlink/mirror + worktree-copy mistakes because they are the two tasks that touch the materialize-vs-symlink distinction (T1 makes real copies; T7 makes a mirror symlink AND re-runs the sync to add a real-copy skill) — the exact surface `skills-mirror-symlinks-not-copies` and `executor-mirror-path-vs-worktree-physical-copy` warn about conflating.
- T3/T5 carry `gobbi-hook-authoring` because they author/validate hook registration shape.
- T4/T5/T6 carry `git` + `executor-cwd-reset-commits-task-to-wrong-branch` because DD-7's install-test requires commit/push of the worktree SESSION branch — the highest-risk cwd/branch surface.
- T5/T6 additionally carry `reproducing-a-bugged-command-is-not-validation` (and T5 `leader-iter2-verification-claim-without-evidence`) because they are operator-assisted; the failure mode is fabricating an installed-state pass without operator-returned evidence.
- Every task carries `subagent-relative-write-paths-stray-cd-doesnt-persist` because every write must use the worktree-absolute path.

---

## Self-review report

**Spec-coverage check (Ideation directional checklist → task):**
| Ideation checklist item | Task |
|---|---|
| Lay out bounded package dir | 01 (trees) + 02 (manifest) |
| Materialize REAL copies | 01 |
| Author plugin.json | 02 |
| Author hooks/hooks.json (3 registrations, ${CLAUDE_PLUGIN_ROOT}) | 03 |
| DECIDE hook double-registration + fire-exactly-once validation | RATIFIED (Option C) upstream; validation = 05 (operator-assisted) |
| DECIDE permissions disposition + invocability check | RATIFIED upstream; check + conditional entries = 06 (operator-assisted) |
| Author marketplace.json (name source value) | 04 (`source: "./plugins/gobbi"`) |
| DECIDE worktree-faithful install/test path + sentinel | RATIFIED (Option a) upstream; exercised in 05 operator-run portion |
| Post-install cache-contents gate (allow-set skills/agents/hooks only) | AUTONOMOUS source-package half = 01 `--check` allow-set membership clause (f); installed-cache half = 05 installed-cache allow-set assertion (operator-run) |
| Author claude-plugin skill + mirror symlink | 07 |
| Package SHIPS claude-plugin skill (iter-2 D-8) | 07 resync (package 18 → 19) |
| Verify: validate --strict / install / cache allow-set / fire-once / readlink + section-presence | distributed across task `verifies` (04 validate, 01 source allow-set, 05 fire-once+installed allow-set+sentinel, 06 invocability, 07 readlink+sections+resync) |

Every checklist item maps to a task or to a RATIFIED upstream decision exercised by a task. Every task anchors to ≥1 Ideation checklist item via `traces-to`. No unmatched item; no anchor-less task.

**Cache allow-set gate placement note (iter-2 — RK-1 / COD-PROJ-001 / COD-OVERALL-001 remediated):** the R1 cache allow-set guard now has an EXPLICIT executable assertion in BOTH halves: (1) AUTONOMOUS source-package half — T1 `verifies` clause (f): `--check` asserts the `plugins/gobbi/` top level is EXACTLY `{.claude-plugin, skills, agents, hooks}` with negative checks for `.gobbi`/`sessions`/repo content; this runs with NO install. (2) OPERATOR-RUN installed-cache half — T5's script locates the installed cache dir and asserts its top level equals the package allow-set. The autonomous half closes the R1 guard pre-install regardless of whether the operator-run T5 install executes; it is no longer deferred to the non-autonomous step.

**Placeholder scan:** zero `TBD`/`TODO`/`<...>`/`XXX`/`FIXME` in any task description or acceptance criterion.

**Type/name consistency check:**
- Path `plugins/gobbi/` and `source: "./plugins/gobbi"` consistent across T1/T2/T4 and the ratified decision.
- `${CLAUDE_PLUGIN_ROOT}` literal consistent T3/T7.
- Skill identifiers `gobbi:codex`, `gobbi:gobbi-hook-authoring` consistent T6/T7 and DD-9 decision.
- `Skill(codex)`, `Skill(gobbi-hook-authoring)` allow-entry strings consistent T6 and live settings.json (verified omitted).
- Script names `scripts/sync-plugin-package.sh`, `scripts/validate-plugin-hooks-fire-once.sh`, `scripts/check-plugin-invocability.sh` each defined once and referenced consistently.
- Hook matchers `startup|resume|clear|compact` and `Task|Agent` consistent T3/T5 and live settings.json.
- The 5 agent `.md` names (manager/leader/executor/evaluator/assistant) consistent T1/T2 and inventory.
- Skill count: "18 at materialization (T1)" and "19 final after T7 resync" used consistently in the intro, file map, T1 verifies (f), T7 verifies (resync), and T8 verifies; the cache allow-set `{.claude-plugin, skills, agents, hooks}` string is identical at T1(f) and T5.

**Result: zero findings.** No drift, full coverage, no placeholders. All four iter-1 eval gaps (cache allow-set membership, T5/T6 operator-assisted labelling + autonomous/operator separation, T5 harness mechanics, T7-skill-count consistency) are remediated.

---

## Principle-13 SPEC + CRUD for the documentation tasks (T7, T8)

### T7 — `claude-plugin` skill + mirror symlink + package resync
**SPEC:** Create a new project skill that (a) teaches general Claude-Code-plugin authoring/update and (b) carries a layered gobbi-specific section documenting this package's bounded layout, materialization re-sync trigger/gate + allow-set membership guard, DD-8 dev-vs-installed hook split + double-fire caveat, the `agents`-REPLACES vs `skills`-ADDS-to asymmetry, the escaping-symlink-skip footgun, version cadence, and validate/install/update flow. Then re-run the sync script so the new skill ships in the package (D-8). Memory type: **skill** (canonical under `.gobbi/.../skills/`, workspace-visible via `.claude/skills/` mirror symlink, AND packaged under `plugins/gobbi/skills/` as a real copy). Must NOT bleed into: a feature `design` doc (this is reusable cross-feature authoring guidance, not install-runtime design) or a `mistake` (it is a how-to, not a correction record).
**CRUD:**
- **Create** `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` (canonical real file; skill frontmatter `name`/`description`/`allowed-tools`).
- **Create** `.claude/skills/claude-plugin/SKILL.md` as a relative symlink into the canonical target (per the established per-file mirror pattern; depth must match sibling skills — verify with `readlink` against an existing mirror like `.claude/skills/git/SKILL.md`; cf. `symlink-restore-depth-wrong`).
- **Create** `plugins/gobbi/skills/claude-plugin/**` by re-running `scripts/sync-plugin-package.sh` (real-copy materialization of the new packaged skill; package skills 18 → 19). This is the D-8 resync.
- **Read** sibling `SKILL.md` files (e.g. `git`, `gobbi-hook-authoring`) for the authoring standard + the exact symlink relative depth; the 5 staged decisions + readiness doc for the gobbi-section content; `mistakes/skills-mirror-symlinks-not-copies.md` for the footgun wording.
- **Update** none of T1's existing files (the resync ADDS the new skill dir; it must not mutate the 18 already-materialized dirs).
- **Delete** none.
- **Blast radius:** the canonical skill has TWO downstream copies kept in sync mechanically — the `.claude/skills/` symlink (a symlink layer: ONE canonical edit reflects automatically) AND the `plugins/gobbi/skills/claude-plugin/` real copy (refreshed by the sync script — re-run after any canonical edit, per the named re-sync trigger). It is NOT auto-listed in `CLAUDE.md` navigation; the readiness doc explicitly scopes adding it to a follow-up (the FLAG-2 `claude` dangling-reference observation is separate). **Do NOT add this skill to `.claude/settings.json` permissions.allow** — that is T6's conditional surface and out of scope for T7. Verify the resync with `scripts/sync-plugin-package.sh --check` (must still exit 0 with 19 skills present).

### T8 — feature README update
**SPEC:** Update the `install-runtime` feature README so the feature overview reflects the shipped plugin. Memory type: **feature README** (overview/index of feature memory). Must contain: a short subsection or Recent-activity row noting the gobbi plugin package (final 19 packaged skills), the dev-vs-installed hook split, the materialization re-sync surface + allow-set guard, and a pointer to the new `claude-plugin` skill. Must NOT bleed into: re-deriving design decisions (those live in `decisions/`), or duplicating the skill body.
**CRUD:**
- **Update** `.gobbi/projects/gobbi/features/install-runtime/README.md` — add the plugin to the Subsystems/Overview prose (1 subsystem line + 1-2 overview sentences), add a Recent-activity row (`2026-05-30 | 0fd65721 | gobbi v0.5 Claude Code plugin package shipped (19 packaged skills)`), bump `last_updated: 2026-05-30`.
- **Read** the current README (already read this loop), the 5 staged decisions, the component-inventory design doc.
- **Create/Delete:** none.
- **Blast radius:** the README is a per-feature index; no other file mirrors it. The new `claude-plugin` skill (T7) and the 5 staged decisions are Wrap-up's promotion targets (`features/install-runtime/decisions/`), NOT T8's job — T8 only edits the README. CLAUDE.md is NOT a co-update (it indexes skills/principles, not feature READMEs). Confirmed single-file co-update.

---

## NOT in scope (explicit deferrals)

- **Implementing the `scripts/sync-plugin-package.sh` mechanism choice** beyond what T1 produces — T1 ships a working script + gate + allow-set guard; build-vs-CI-vs-tracked is the executor's mechanism call within T1.
- **Codex `.agents/plugins/marketplace.json` ↔ Claude manifest reconciliation** — backlogged (`ideation/staging/backlogs/feature/reconcile-codex-plugin-and-claude-plugin-manifests.md`).
- **Public/hosted marketplace publishing** — backlogged (`publish-gobbi-to-public-marketplace.md`).
- **`claude` skill dangling reference (FLAG-2)** — pre-existing project-wide observation; a planner may file a follow-up; NOT absorbed here.
- **`gobbi-hook-authoring` `.claude/skills/` mirror-coverage gap** — pre-existing; NOT absorbed.
- **Adding `CLAUDE.md` navigation entry for `claude-plugin`** — follow-up; out of this scope (no ratified decision to touch CLAUDE.md).
- **CI wiring of the drift gate (#258 drift-detector)** — T1 ships the gate as a runnable script (the enforcement POINT); CI integration is the #258 backlog.
- **MCP/LSP/themes/commands/output-styles/userConfig in the manifest** — out per Scope Contract.

> **iter-2 note:** "Packaging the new `claude-plugin` skill" is NO LONGER deferred — the iter-2 auto-decision D-8 SHIPS it (T7 resync, final package 19 skills). The old iter-1 deferral of this item is superseded by D-8.

---

## Decisions log

| # | Topic | Resolution | Authorizing source |
|---|---|---|---|
| D-1 | Task count + ordering | 8 sequential tasks, bottom-up (package base → manifest/hooks → catalog → runtime checks → skill+resync → docs) | leader decomposition (this plan) |
| D-2 | Sync script + materialization = ONE task (T1) | The script IS the materialization mechanism; its output is the package trees — single category | drift-resync decision (mechanism = Execution) |
| D-3 | Cache-contents allow-set gate has no standalone task, but IS explicitly task-verified (iter-2) | No independent deliverable file; asserted as T1 `--check` allow-set membership clause (f, AUTONOMOUS, source-package) + T5 installed-cache assertion (OPERATOR-RUN) | readiness doc + Ideation checklist; iter-2 remediation of RK-1 / COD-PROJ-001 / COD-OVERALL-001 |
| D-4 | T7 placed near-last (after T5/T6) | The skill documents the empirically-resolved hook double-fire (T5) + auto-grant finding (T6); writing earlier would document unverified premises (P7) | DD-8 + DD-9 ratified decisions |
| D-5 | T6 permissions edit is CONDITIONAL (and operator-confirmed) | DD-9 ratified: only add Skill() entries IF the operator-run invocability check proves auto-grant FALSE; if TRUE, settings.json is left unchanged | `permissions-disposition-keep-project-local-verify-empirically.md` |
| D-6 | All tasks → executor, no model override | Each task is single-category implementation, fully decomposed; none needs sub-planning or is trivial | planning/SKILL.md Sub-step D defaults |
| D-7 | DD-7 install-test exercised inside T5 (not a standalone task), as the OPERATOR-RUN portion | The git-ref-source + sentinel install is the precondition for fire-once + invocability; no separate deliverable; the live install is operator-run | `worktree-test-default-git-ref-source-with-sentinel.md` |
| D-8 | Package SHIPS the `claude-plugin` skill → final 19 (iter-2 AUTO-DECISION) | Logical consequence of "ship gobbi's skills" + the sync-on-skill-edit trigger: the T7-authored `claude-plugin` is a packaged skill. T1 materializes 18; T7 re-runs the sync to capture the 19th. T1 verifier reworded off the hard-coded "18" to "all canonical packaged-skill dirs present at materialization time (18 at T1)". | iter-2 remediation of COD-CONS-001; staged decision `package-includes-claude-plugin-skill-resync-after-t7.md` |
| D-9 | T5/T6 are OPERATOR-ASSISTED (iter-2) | A spawned executor cannot install out-of-process, start a clean session, trigger live hook events, or interactively invoke skills/agents. Executor authors script + harness + operator procedure (AUTONOMOUS); operator runs the live install + invocation and returns evidence (OPERATOR-RUN). The task does NOT claim autonomous verification of the installed state. | iter-2 remediation of OV-1 / ST-2 / US-1 / COD-RISK-001 / COD-OVERALL-002 |
| D-10 | T5 harness mechanics pinned + cleanup/isolation boundary (iter-2) | Pinned: git-ref marketplace install CLI from the SESSION branch; per-event marker file keyed on `hook_event_name`; deterministic triggers (SessionStart=fresh/`clear`; PostToolUse=Task exit 0; PostToolUseFailure=Task exit non-zero); isolated temp Claude config/HOME OR record-pre-state + uninstall/marketplace-remove/cache-clear cleanup so the dev env is not polluted. | iter-2 remediation of COD-USAGE-001 + COD-RISK-001 |
| D-W | Worktree-absolute write paths mandatory | Every executor write MUST prefix `$WT`; never bare `.gobbi/...` or relative (cd does not persist across tool boundaries) | `subagent-relative-write-paths-stray-cd-doesnt-persist`, `executor-mirror-path-vs-worktree-physical-copy` |

**USER CHALLENGE escalations:** none — the leader's decomposition does not substantively disagree with any ratified Ideation/Preparation decision. (The iter-2 auto-decision D-8 was directed by the manager as a logical consequence of ratified decisions, not a disagreement.)

**NEEDS_CONTEXT:** none — every design choice required to plan was already ratified upstream or auto-decided (D-8) per the iter-2 remediation brief.
