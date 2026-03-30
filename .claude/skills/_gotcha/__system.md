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

### Session-scoped state in hooks
---
priority: low
---

**Priority:** Low

**What it is:** When a hook needs to persist state across invocations within the same session (e.g., tracking start time, accumulating counts, caching decisions), use the naming convention `~/.claude/{purpose}_state_{session_id}.json` or `/tmp/claude-{purpose}-{session_id}` for the state file. The `session_id` is available in every hook payload's stdin JSON.

**Why it matters:** Without session-scoped filenames, concurrent Claude sessions overwrite each other's hook state. The timing approach in "Stop hook has no duration field" (above) already uses this pattern with `/tmp/claude-start-{session_id}`. The security-guidance plugin also uses session-scoped state for caching scan results across hook invocations.

**How to use:** Read `session_id` from the hook payload JSON received on stdin. Incorporate it into the state filename. Implement cleanup — either a TTL-based probabilistic approach (each invocation has a small chance of deleting files older than N hours) or a dedicated cleanup in the Stop hook. The Stop hook is the natural place for session teardown since it fires when the session ends.

**Correct approach:** Always scope hook state files by session. Never use a single shared filename like `/tmp/claude-state.json` — it breaks under concurrent sessions.
