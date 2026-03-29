# Gotcha: System

Environment, process management, hooks, and infrastructure mistakes that damage the user's setup.

---

### Blind-killing processes on ports

**Priority:** Critical

**What happened:** Agent needed to free a port (4040) and ran `kill` on the process occupying it without first identifying what the process was. The process turned out to be critical for the user's remote/network connection. The user lost connectivity and had to reconnect.

**User feedback:** "Never kill processes on ports without identifying them first."

**Correct approach:** Always `lsof -i :PORT` first to identify what's running. Show the user what the process is. Only kill after confirmation, or if it's obviously the intended target (e.g., a node process running Storybook). Never assume a process on a port is safe to kill.

---

### Stop hook has no duration field

**Priority:** Medium

**What happened:** Agent tried to implement a task-done Slack notification in the Stop hook by reading `duration_ms` from the hook payload. The Stop hook payload does not contain any duration field — it only has `session_id`, `transcript_path`, `cwd`, `permission_mode`, `hook_event_name`, `stop_hook_active`, and `last_assistant_message`. The notification never fired because the duration always defaulted to 0.

**User feedback:** Confirmed the fix works after implementing a two-hook approach.

**Correct approach:** Track timing with a two-hook approach. `UserPromptSubmit` hook records `date +%s` to `/tmp/claude-start-{session_id}`. `Stop` hook reads it and calculates elapsed time. Use `session_id` in filenames to avoid collisions between concurrent sessions.
