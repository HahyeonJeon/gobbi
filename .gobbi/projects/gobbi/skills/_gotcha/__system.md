# Gotcha: System

Environment, process management, hooks, and infrastructure mistakes that damage the user's setup.

---

### Blind-killing processes on ports
---
priority: critical
enforcement: hook
event: bash
pattern: "kill\\s+|pkill\\s+|killall\\s+"
---

**Priority:** Critical

**What happened:** Agent needed to free a port (4040) and ran `kill` on the process occupying it without first identifying what the process was. The process turned out to be critical for the user's remote/network connection. The user lost connectivity and had to reconnect.

**User feedback:** "Never kill processes on ports without identifying them first."

**Correct approach:** Always `lsof -i :PORT` first to identify what's running. Show the user what the process is. Only kill after confirmation, or if it's obviously the intended target (e.g., a node process running Storybook). Never assume a process on a port is safe to kill.

---

### Stop hook has no duration field
---
priority: medium
---

**Priority:** Medium

**What happened:** Agent tried to implement a task-done Slack notification in the Stop hook by reading `duration_ms` from the hook payload. The Stop hook payload does not contain any duration field — it only has `session_id`, `transcript_path`, `cwd`, `permission_mode`, `hook_event_name`, `stop_hook_active`, and `last_assistant_message`. The notification never fired because the duration always defaulted to 0.

**User feedback:** Confirmed the fix works after implementing a two-hook approach.

**Correct approach:** Track timing with a two-hook approach. `UserPromptSubmit` hook records `date +%s` to `/tmp/claude-start-{session_id}`. `Stop` hook reads it and calculates elapsed time. Use `session_id` in filenames to avoid collisions between concurrent sessions.

---

### Plugin hooks in settings.json are silently ignored
---
priority: high
---

**Priority:** High

**What happened:** Gobbi's plugin distribution put all hook configuration (SessionStart, Stop, Notification, etc.) in `plugins/gobbi/settings.json`. Plugin users reported hooks not firing — the SessionStart hook script showed its usage message instead of executing automatically. Investigation revealed that Claude Code's plugin system only supports **agent settings** in plugin `settings.json`. Hooks, permissions, and other config in `settings.json` are silently ignored.

**User feedback:** Confirmed via the official Claude Code plugin reference at `https://code.claude.com/docs/en/plugins-reference`.

**Correct approach:** Plugin hooks must be in `hooks/hooks.json` at the plugin root. Claude Code auto-loads this standard location unconditionally — declaring `skills` or `agents` in `plugin.json` does NOT disable hook auto-discovery. Do NOT add `"hooks": "./hooks/hooks.json"` to `plugin.json`: the `hooks` field is for additional hook files only, and pointing it at the standard path triggers a duplicate-detection warning recorded against the plugin. Plugin `settings.json` is only for agent settings — do not put hooks or permissions there.

**Empirical verification:** See `.claude/project/gobbi/reference/plugin-hook-registration-v050.md` for the 4-cell matrix and evidence from Claude Code 2.1.87–2.1.110.

---

### Session-scoped state in hooks
---
priority: low
---

**Priority:** Low

**What happened:** Agent stored runtime state in a global variable within a hook script, expecting it to persist across hook invocations. The state was lost because each hook invocation runs in a fresh shell process. A related pattern: agent wrote hook state to `/tmp/claude-state.json` (a fixed filename) expecting it to persist within the session, but a second concurrent Claude session overwrote the file mid-run, corrupting the first session's state.

**User feedback:** Hook state must be persisted to disk with session-scoped filenames. In-memory state and shared filenames both fail under real usage conditions.

**Correct approach:** When a hook needs to persist state across invocations within the same session (e.g., tracking start time, accumulating counts, caching decisions), write it to disk using the naming convention `~/.claude/{purpose}_state_{session_id}.json` or `/tmp/claude-{purpose}-{session_id}`. The `session_id` is available in every hook payload's stdin JSON — read it with `jq .session_id`. Implement cleanup: either a TTL-based probabilistic approach (each invocation has a small chance of deleting files older than N hours) or a dedicated cleanup in the Stop hook. Never use a single shared filename like `/tmp/claude-state.json` — it breaks under concurrent sessions.
