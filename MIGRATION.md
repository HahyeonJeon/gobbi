# Migration Guide

This guide documents breaking changes and upgrade steps for major version bumps. See `CHANGELOG.md` for comprehensive release notes.

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
| 6 `gobbi notify *` hook entries (SessionStart, PreToolUse, Notification, Stop, StopFailure, SubagentStop) | 5 `gobbi workflow *` hook entries (SessionStart, PreToolUse, PostToolUse, SubagentStop, Stop) | Breaking — see below | n/a — hook wiring |
| Notes in `.claude/project/{name}/note/` (retrospective archive) | Active sessions in `.gobbi/sessions/{id}/` (runtime state) | Both coexist; no migration needed | Existing note archives remain valid |
| 7-step cycle (ideation → plan → research → execute → collect → memorize → review) | 5-step cycle (Ideation → Plan → Execution → Evaluation → Memorization) | Conceptual; no user action needed | n/a |
| `_orchestration` skill as workflow entry | Deprecated — banner + `ARCHIVED.md` | Skill remains on disk for reference; no deletion | n/a |

---

### Breaking change 1 — Notification hooks replaced

**What changed.** v0.4.x registered 6 `gobbi notify *` hook entries in `plugins/gobbi/hooks/hooks.json` and `.claude/settings.json`, covering SessionStart, PreToolUse, Notification, Stop, StopFailure, and SubagentStop events. These entries auto-fired Slack, Telegram, Discord, and Desktop notifications at workflow boundaries.

v0.5.0 removes all 6 `gobbi notify *` entries and replaces them with 5 `gobbi workflow *` entries (see `design/v050-hooks.md:172-180`):

| Hook event | v0.5.0 command |
|---|---|
| SessionStart | `gobbi workflow init` |
| PreToolUse | `gobbi workflow guard` |
| PostToolUse (ExitPlanMode) | `gobbi workflow capture-plan` |
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

Phase 3 may restore notification events over the v0.5.0 hook surface. No timeline is committed. See `CHANGELOG.md` for release history and the Phase 3 backlog doc at `.claude/project/gobbi/design/v050-phase3-backlog.md` for the tracked item.

---

### Breaking change 2 — `_orchestration` skill deprecated

**What changed.** The `_orchestration` skill's SKILL.md, which contained the 7-step prose orchestration cycle, is deprecated in v0.5.0. The skill directory remains on disk (per CP6 locked decision — no deletion) and is marked with a deprecation banner. The authoritative deprecation context, including the 7-step → 5-step mapping, lives in `.claude/skills/_orchestration/ARCHIVED.md`.

**Consumer impact.** If you have muscle memory loading the `_orchestration` skill or following its 7-step cycle, read `ARCHIVED.md` first. The new entry point for v0.5.0 orchestration is the `gobbi` skill (`/gobbi`), which now bootstraps a `gobbi workflow init` session instead of driving the 7-step prose cycle. The `_orchestration` skill remains on disk for reference; you will see a deprecation banner if you load it directly.

Removal is not scheduled. The deprecated skill will remain in v0.5.x as an archived pointer.

---

### Breaking change 3 — Directory split

**What changed.** v0.5.0 introduces a hard split between two directories (per `design/v050-overview.md:119-136`):

- `.claude/` — static knowledge layer. Skills, rules, agents, gotchas, CLAUDE.md, settings. Read-only during an active workflow session. A PreToolUse guard blocks writes to `.claude/` while a session is running.

- `.gobbi/` — runtime layer. Active sessions (`sessions/{id}/`), event store (`gobbi.db`), heartbeats, and mid-session gotchas. Agents write freely here. Writing to `.gobbi/` does not trigger Claude Code context reload.

**Consumer impact.** The gobbi repo itself already has `.gobbi/` in `.gitignore` (line 7). If you are adopting the gobbi plugin in your own project, add `.gobbi/` to your project's `.gitignore`. The `.gobbi/` directory is created on first `gobbi workflow init` run.

Gotchas recorded mid-session land in `.gobbi/project/gotchas/` and must be promoted to `.claude/skills/_gotcha/` via `gobbi gotcha promote` — run this outside an active session. The promotion step is a deliberate gate that prevents mid-session noise from polluting the permanent gotcha store.

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
ls .gobbi/sessions/smoke-test/
# → metadata.json  gobbi.db
```

---

### Keeping v0.4.x

If you need to stay on v0.4.x, install the archival version:

```bash
npm install -g @gobbitools/cli@0.4.5
```

v0.4.5 will remain installable from npm indefinitely. Gobbi does not unpublish releases. The 0.4.x branch is frozen — no further updates, no security patches. Only v0.4.5 is supported for archival.

See `CHANGELOG.md` for the full v0.4.x history.
