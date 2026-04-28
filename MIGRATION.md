# Migration Guide

This guide documents breaking changes and upgrade steps for major version bumps. See `CHANGELOG.md` for comprehensive release notes.

---

## PR-FIN-1a: gobbi config init verb + session-id resolution change

### Summary

PR-FIN-1a adds the `gobbi config init` verb and removes the `randomUUID()` fallback from `init.ts::resolveSessionId`. The session-id resolution ladder is now: `--session-id` flag → `$CLAUDE_SESSION_ID` env → exit 2 with remediation hint.

---

### Session directories from prior `randomUUID()` runs

Before PR-FIN-1a, `gobbi workflow init` called without `--session-id` or `$CLAUDE_SESSION_ID` silently created session directories with a random UUID name (e.g., `.gobbi/projects/<name>/sessions/3f7a1b2c-.../`). These directories are unreferenced — no subsequent command knows their names.

No automated cleanup is provided. Solo-user trust: manual removal is acceptable and encouraged:

```bash
# List session dirs under a project (all are legitimate if they match a real session id)
ls .gobbi/projects/<project-name>/sessions/

# Remove a specific orphan UUID session dir
rm -rf .gobbi/projects/<project-name>/sessions/<random-uuid>/

# Remove all session dirs older than 30 days (review the list before deleting)
find .gobbi/projects/*/sessions -maxdepth 1 -mindepth 1 -type d -mtime +30
```

---

### `gobbi config init` usage

The new verb scaffolds a minimum-valid `{schemaVersion: 1}` seed at the target level. It is the explicit alternative to the implicit "first `ensureSettingsCascade` run seeds the workspace file" behavior.

```bash
# Workspace level (default) — writes .gobbi/settings.json
gobbi config init

# Project level — writes .gobbi/projects/<basename>/settings.json
gobbi config init --level project

# Project level with explicit name
gobbi config init --level project --project myproject

# Session level — requires session id
gobbi config init --level session --session-id <id>

# Overwrite an existing file (adds stderr WARN line)
gobbi config init --force
gobbi config init --level project --force
```

The seed is `{schemaVersion: 1}` only — all other defaults are applied at resolve time by `resolveSettings`. Existing content is NOT merged into the seed; `--force` replaces the file completely.

---

### Session-id resolution ladder (updated)

| Priority | Source | Behavior |
|---|---|---|
| 1 | `--session-id <id>` flag | Use directly; takes priority over env |
| 2 | `$CLAUDE_SESSION_ID` env | Use directly |
| 3 | (none) | Exit 2 with remediation hint |

**Before PR-FIN-1a:** step 3 was `randomUUID()` — a silent UUID was generated.

**After PR-FIN-1a:** step 3 is a hard error with the message:

```
gobbi: cannot resolve session id.
  Tried: --session-id flag, CLAUDE_SESSION_ID env.
  Pass --session-id explicitly or set CLAUDE_SESSION_ID.
  (SessionStart hook integration arrives in PR-FIN-1b.)
```

For commands that accept `--level session` (e.g., `gobbi config get/set/init`), the error also includes: `(outside a session, use --level workspace or --level project to bypass)`. Closes #182.

---

## PR-FIN-1c: GitSettings reshape + ProjectsRegistry removal

### Summary

PR-FIN-1c removes the `mode`/`workflow`/`cleanup` sub-objects from `GitSettings` and replaces them with a flat shape where each concern owns its own sub-object. The `ProjectsRegistry` interface and `Settings.projects` field are deleted; project resolution is now `basename(repoRoot)` + `--project` flag.

Existing on-disk `settings.json` files are migrated automatically on the first `gobbi workflow init` after the upgrade. No manual action is required. The `project-config.json` T2-v1 path is also extended to produce the new shape directly.

---

### Who must migrate

Any caller that reads `git.workflow.mode`, `git.workflow.baseBranch`, `git.cleanup.*`, `git.pr.draft` (via the old `git.pr` sub-object under the Pass-3 shape), `projects.active`, or `projects.known` from a settings file or via `gobbi config get`. This includes skill files, agents, and scripts that reference those paths.

---

### Migration table

| Old field | New location | Mapping |
|---|---|---|
| `git.mode === 'worktree-pr'` | `git.pr.open` | `true` |
| `git.mode === 'direct-commit'` | `git.pr.open` | `false` |
| `git.mode === 'auto'` | `git.pr.open` | `true` |
| `git.workflow.mode === 'worktree-pr'` | `git.pr.open` | `true` |
| `git.workflow.mode === 'direct-commit'` | `git.pr.open` | `false` |
| `git.workflow.mode === 'auto'` | `git.pr.open` | `true` |
| `git.baseBranch` | `git.baseBranch` | (preserved) |
| `git.workflow.baseBranch` | `git.baseBranch` | (preserved) |
| `git.pr.draft` | `git.pr.draft` | (preserved) |
| `git.cleanup.worktree` | `git.worktree.autoRemove` | (preserved) |
| `git.cleanup.branch` | `git.branch.autoRemove` | (preserved) |
| (no equivalent) | `git.issue.create` | default `false` |
| `projects.active` | (removed) | dropped silently |
| `projects.known` | (removed) | dropped silently |

---

### Automatic on-disk migration

`ensureSettingsCascade` (called by `gobbi workflow init`) detects legacy fields and upgrades files automatically:

- `.gobbi/project-config.json` (T2-v1 legacy) → upgraded to PR-FIN-1c shape, written to `.gobbi/projects/<name>/settings.json`. Legacy file kept in place.
- `.gobbi/projects/<name>/settings.json` with Pass-3 shape (contains `git.workflow.*` or `projects.*`) → upgraded in place. Idempotent.
- `.gobbi/settings.json` with Pass-3 shape → upgraded in place. Idempotent.
- Workspace seed, if absent, is written as `{schemaVersion: 1}` (no `projects` block).

---

### Cross-field check change

The cross-field invariant changed:

- **Before PR-FIN-1c:** `git.workflow.mode === 'worktree-pr'` requires `git.workflow.baseBranch !== null`
- **After PR-FIN-1c:** `git.pr.open === true` (explicitly set by user) requires `git.baseBranch !== null`

The new check only fires when the user has explicitly set `pr.open=true` in a file — DEFAULTS alone do not trigger it. Fresh repos with no git config are not flagged.

---

### `gobbi project` commands

| v0.4.x / Pass-3 | PR-FIN-1c |
|---|---|
| `gobbi project switch <name>` | Removed — no `projects.active` to set |
| `gobbi project list` | Reads `.gobbi/projects/` via filesystem scan — no registry needed |
| `gobbi project create <name>` | Creates directory only — no `projects.known` mutation |

---

## v0.4.x → v0.5.0

### Summary

v0.5.0 replaces skill-based orchestration with a CLI-driven state machine. The `_orchestration` skill's 7-step prose cycle is retired; the v0.5.0 CLI takes over workflow initialization, step sequencing, guard enforcement, and session capture via five registered hook events. This is a major bump because the hook surface, directory layout, and orchestration model all change in ways that require user action.

Three things change for every v0.4.x user: (1) the plugin's auto-registered hooks fire different commands, (2) the `_orchestration` skill is deprecated, and (3) a new `.gobbi/` runtime directory sits alongside `.claude/`. Each is a breaking change described below.

---

### Who must migrate

All v0.4.x users must read this guide. If you customized your notification hooks, you must act before upgrading — see Breaking change 1 below.

v0.4.5 remains installable from npm for archival purposes: `npm install -g @gobbitools/cli@0.4.5`. The 0.4.x branch is frozen and receives no further updates. Only v0.4.5 is supported for archival.

---

### Upgrade path at a glance

| v0.4.x | v0.5.0 | Action required | Data compat |
|---|---|---|---|
| Skill-based orchestration (`_orchestration` skill) | CLI state machine (`gobbi workflow init`) | Plugin auto-registers new hooks on install | n/a — conceptual change |
| 8 v0.4.x hook entries (3×SessionStart + Stop + Notification + StopFailure + SubagentStop + SessionEnd — calling `gobbi notify *` and `gobbi session *`) | 5 `gobbi workflow *` hook entries (SessionStart, PreToolUse, PostToolUse, SubagentStop, Stop) | Breaking — see below | n/a — hook wiring |
| Notes in `.claude/project/{name}/note/` (retrospective archive) | Active sessions in `.gobbi/projects/<name>/sessions/<id>/` (runtime state) | Both coexist; no migration needed | Existing note archives remain valid |
| 7-step cycle (ideation → plan → research → execute → collect → memorize → review) | 6-step workflow (Configuration → Ideation → Planning → Execution → Memorization → Handoff) | Conceptual; no user action needed | n/a |
| `_orchestration` skill as workflow entry | Deprecated — banner + `ARCHIVED.md` | Skill remains on disk for reference; no deletion | n/a |

---

### Breaking change 1 — Notification hooks replaced

**What changed.** v0.4.x registered 8 hook entries in `plugins/gobbi/hooks/hooks.json` and `.claude/settings.json`: three SessionStart handlers (`gobbi session metadata`, `gobbi session load-env`, `gobbi notify session`), plus one each for Stop (`gobbi notify completion`), Notification (`gobbi notify attention`), StopFailure (`gobbi notify error`), SubagentStop (`gobbi notify subagent`), and SessionEnd (`gobbi notify session`). The 6 `gobbi notify *` entries auto-fired Slack, Telegram, Discord, and Desktop notifications at workflow boundaries; the 2 `gobbi session *` entries handled session metadata bootstrapping (now subsumed by `gobbi workflow init`).

v0.5.0 removes all 8 v0.4.x entries and replaces them with 5 `gobbi workflow *` entries (see `design/v050-hooks.md:172-180`):

| Hook event | v0.5.0 command |
|---|---|
| SessionStart | `gobbi workflow init` |
| PreToolUse | `gobbi workflow guard` |
| PostToolUse (ExitPlanMode) | `gobbi workflow capture-planning` |
| SubagentStop | `gobbi workflow capture-subagent` |
| Stop | `gobbi workflow stop` |

**Consumer impact.** If you relied on auto-fired notifications (Slack/Telegram/Discord/Desktop), they no longer fire after upgrading the plugin. The `gobbi notify` subcommand itself remains in the CLI — only the plugin's automatic registration is removed.

**Restoration paths.** Choose the path that fits your situation:

**Path A — Keep v0.4.5 installed alongside v0.5.0.**
Best for: users who depend heavily on notification automation and cannot tolerate a lag in notification coverage.

Install the archival version under a separate binary: `npm install -g @gobbitools/cli@0.4.5`. Then manually add the v0.4.x notify entries back into your user-level `~/.claude/settings.json` under the appropriate hook events. Both CLI versions coexist on your PATH under their respective binary names.

**Path B — Wire your own notification hooks in `~/.claude/settings.json`.**
Best for: users who want the v0.5.0 workflow core and are willing to configure custom notifications.

The `gobbi notify` subcommand (`gobbi notify session`, `gobbi notify completion`, `gobbi notify attention`, `gobbi notify error`, `gobbi notify subagent`) continues to work in v0.5.0. Add hook entries calling these commands to your user-level `~/.claude/settings.json` under the hook events that matter to you (SessionStart, Stop, Notification, SubagentStop). User-level settings are not overwritten by the plugin.

**Path C — Wait for Phase 3.**
Best for: users who want the canonical gobbi notification setup restored and can tolerate a gap.

Phase 3 may restore notification events over the v0.5.0 hook surface. No timeline is committed. See `CHANGELOG.md` for release history and the Phase 3 backlog doc at `.gobbi/projects/gobbi/design/v050-phase3-backlog.md` for the tracked item.

---

### Breaking change 2 — `_orchestration` skill deprecated

**What changed.** The `_orchestration` skill's SKILL.md, which contained the 7-step prose orchestration cycle, is deprecated in v0.5.0. The skill directory remains on disk (per CP6 locked decision — no deletion) and is marked with a deprecation banner. The authoritative deprecation context, including the 7-step → v0.5.0 mapping, lives in `.claude/skills/_orchestration/ARCHIVED.md`.

**Consumer impact.** If you have muscle memory loading the `_orchestration` skill or following its 7-step cycle, read `ARCHIVED.md` first. The new entry point for v0.5.0 orchestration is the `gobbi` skill (`/gobbi`), which now bootstraps a `gobbi workflow init` session instead of driving the 7-step prose cycle. The `_orchestration` skill remains on disk for reference; you will see a deprecation banner if you load it directly.

Removal is not scheduled. The deprecated skill will remain in v0.5.x as an archived pointer.

---

### Breaking change 3 — Directory split

**What changed.** v0.5.0 introduces a hard split between two directories (per `design/v050-overview.md:119-136`):

- `.claude/` — static knowledge layer. Skills, rules, agents, gotchas, CLAUDE.md, settings. Read-only during an active workflow session. A PreToolUse guard blocks writes to `.claude/` while a session is running.

- `.gobbi/` — runtime layer. Active sessions (`.gobbi/projects/<name>/sessions/<id>/`), per-session event store (`sessions/<id>/gobbi.db`), workspace memories projection (`.gobbi/gobbi.db`, git-tracked), workspace prompt-patch journal (`.gobbi/state.db`, gitignored), and mid-session gotchas. Agents write freely here. Writing to `.gobbi/` does not trigger Claude Code context reload.

**Consumer impact.** The gobbi repo itself already has `.gobbi/` in `.gitignore` (line 7). If you are adopting the gobbi plugin in your own project, add `.gobbi/` to your project's `.gitignore`. The `.gobbi/` directory is created on first `gobbi workflow init` run.

Gotchas recorded mid-session land in `.gobbi/projects/gobbi/learnings/gotchas/` and must be promoted to workspace-level skill storage via `gobbi gotcha promote` — run this outside an active session. The promotion step is a deliberate gate that prevents mid-session noise from polluting the permanent gotcha store.

---

### Verification after upgrade

Run these commands to confirm v0.5.0 is active after installing:

```bash
# 1. Version confirms 0.5.0
gobbi --version
# → 0.5.0

# 2. Workflow CLI is available
gobbi workflow init --help
# → prints usage

# 3. Hook events are the 5 v0.5.0 entries (no gobbi notify entries)
jq '.hooks | keys' plugins/gobbi/hooks/hooks.json
# → ["PostToolUse","PreToolUse","SessionStart","Stop","SubagentStop"]

# 4. No v0.4.x notify entries remain
grep -n "gobbi notify" plugins/gobbi/hooks/hooks.json
# → 0 hits

# 5. Session directory is created on init
cd /tmp && mkdir test-gobbi && cd test-gobbi
gobbi workflow init --session-id smoke-test --task "verify install"
ls .gobbi/projects/gobbi/sessions/smoke-test/
# → metadata.json  gobbi.db
```

---

### Event store schema evolution

The `events` table in `gobbi.db` (per-session) and `state.db` (workspace) uses lazy read-time migration. Events are never rewritten on disk; migration runs in memory at replay time. The `schema_version` column on each row records the version at write time.

| Version | Shipped | Key changes |
|---|---|---|
| v1 | v0.5.0 | Initial schema — `events`, `state_snapshots`, `idempotency_key` unique constraint |
| v2 | v0.5.0 | `guard.warn` event type |
| v3 | v0.5.0 | `metadata.json` schema v3 shape |
| v4 | v0.5.0 | Error-compiler pathway fields in event data |
| v5 | v0.5.0 | `session_id` and `project_id` columns on `events` |
| v6 | Wave A.1 | `tool_calls` and `config_changes` tables; `step.advancement.observed` audit event; WAL checkpoint after `step.exit` |
| v7 | Wave C.1 | `prompt_patches` table (`id`, `prompt_id`, `patch_id`, `patch_json`, `applied_at`, `applied_by`); `prompt.patch.applied` audit event written to workspace `state.db` |

Run `gobbi maintenance migrate-state-db` to apply pending migrations. Run `gobbi maintenance restore-state-db` to revert. Both commands are idempotent.

---

### Keeping v0.4.x

If you need to stay on v0.4.x, install the archival version:

```bash
npm install -g @gobbitools/cli@0.4.5
```

v0.4.5 will remain installable from npm indefinitely. Gobbi does not unpublish releases. The 0.4.x branch is frozen — no further updates, no security patches. Only v0.4.5 is supported for archival.

See `CHANGELOG.md` for the full v0.4.x history.
