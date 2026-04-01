# Gotcha: _notification

Mistakes in configuring Claude Code notification hooks and credentials.

---

### Stop hook infinite loop

**Priority:** Critical

**What happened:** A hook registered on the `Stop` event called back into Claude Code without checking whether it was already inside a Stop hook. This caused the hook to fire again on its own completion, looping indefinitely.

**User feedback:** Always check `stop_hook_active` in the input JSON and exit early if `true`.

**Correct approach:** At the start of any Stop hook script, parse the input JSON and check the `stop_hook_active` field. If it is `true`, exit immediately without taking any action.

---

### Missing jq breaks all notification scripts

**Priority:** High

**What happened:** Notification scripts depend on `jq` for JSON parsing of hook input. On systems without `jq` installed, every hook silently failed. The failures were not obvious because the scripts exited without output.

**User feedback:** Check for `jq` availability before assuming scripts will work.

**Correct approach:** When setting up notifications, verify that `jq` is available. If not, guide the user to install it before testing hooks. Delivery failures are logged to `~/.claude/notification-failures.log` — check this file when notifications stop arriving.

---

### Script not executable

**Priority:** High

**What happened:** Hook scripts were written to `.claude/hooks/` but never had `chmod +x` applied. Claude Code silently skipped them. The configuration looked correct but no notifications arrived.

**User feedback:** Always verify hook scripts are executable after writing them.

**Correct approach:** After writing or updating any hook script, confirm it is executable. The gobbi installation process handles this, but manually added scripts need explicit `chmod +x`.

---

### Credentials committed to version control

**Priority:** Critical

**What happened:** Credentials were saved to `$CLAUDE_PROJECT_DIR/.claude/.env` but `.env` was not in `.gitignore`. The file was committed to the repository, exposing bot tokens and chat IDs.

**User feedback:** Credentials must never be committed. Always verify `.gitignore` protects `.env` before finishing setup.

**Correct approach:** Before confirming setup complete, verify that `$CLAUDE_PROJECT_DIR/.claude/.env` is listed in `.gitignore`. If it is not, add it immediately and do not proceed until this is confirmed.

---

### Shell profile noise corrupts hook JSON output

**Priority:** High

**What happened:** Hook scripts sourced the user's shell profile (`.bashrc` or `.zshrc`). Profile files with `echo` statements or other output wrote to stdout, corrupting the JSON output that Claude Code reads from the hook.

**User feedback:** Scripts should not source shell profiles.

**Correct approach:** Hook scripts must use `#!/bin/bash` without sourcing any profile. All needed environment variables come from `$CLAUDE_ENV_FILE`, not from the shell environment.

---

### export prefix in .env file breaks loading

**Priority:** Medium

**What happened:** Credentials were saved with `export KEY=value` format in `$CLAUDE_PROJECT_DIR/.claude/.env`. The `load-notification-env.sh` hook adds the `export` prefix when writing to `$CLAUDE_ENV_FILE` — the double prefix caused a syntax error, silently breaking credential loading.

**User feedback:** The `.env` file uses bare `KEY=value` format without `export`.

**Correct approach:** Write credentials to `$CLAUDE_PROJECT_DIR/.claude/.env` as bare `KEY=value` lines. The hook script handles the `export` wrapping. Lines starting with `#` and blank lines are safely ignored.

---

### Delivery failures disappear silently

**Priority:** Medium

**What happened:** After initial setup, notifications stopped arriving. There was no obvious error — the hooks ran, scripts executed, but messages never arrived at Slack or Telegram. The failure was being logged but no one was checking the log.

**User feedback:** Check `~/.claude/notification-failures.log` when notifications stop arriving.

**Correct approach:** When troubleshooting missing notifications, read `~/.claude/notification-failures.log` first. This file captures failures that would otherwise be invisible. Note that the log grows without bound — advise the user to delete it periodically if it becomes large.
