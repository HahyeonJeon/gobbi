---
name: _notification
description: Help users configure Claude Code notifications (Slack, Telegram, and others) through conversation. Use when the user wants to set up, modify, or troubleshoot notification settings.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Notification

Help users configure Claude Code notification credentials through conversation. Hooks and settings should already be installed in the project — this skill handles the credential setup that makes them work.

---

## Credential Setup

The goal is to collect notification credentials from the user, save them securely, and verify that at least one real notification arrives before confirming success.

**Constraints:**

- Use AskUserQuestion for all credential collection — never assume or prefill values
- Save credentials to `$CLAUDE_PROJECT_DIR/.claude/.env` — this file is read by `gobbi session load-env` at session start via the `$CLAUDE_ENV_FILE` mechanism
- Before finishing, verify that `$CLAUDE_PROJECT_DIR/.claude/.env` is listed in `.gitignore` — credentials must never be committed
- Test with a real notification before confirming setup is complete — a configuration that looks correct but never delivers is not set up

**Credentials needed per channel:**

- **Slack:** A bot token (starts with `xoxb-`) and a user ID or channel ID to receive messages. Obtain from https://api.slack.com/apps — create an app, add `chat:write` scope, install to workspace.
- **Telegram:** A bot token and a chat ID. Obtain by creating a bot via @BotFather on Telegram.
- **Desktop:** No credentials — set `NOTIFY_DESKTOP=true`. Requires `notify-send` (Linux) or `osascript` (macOS).
- **Custom webhook:** A URL and any required auth headers. Follow the same environment variable pattern as the other channels.

**Credentials file format:** One `KEY=value` per line, no `export` prefix — the hook script adds it. Blank lines and `#` comments are ignored. File permissions must be 600 (enforced at session start automatically).

---

## Events and Matchers

Claude Code hooks fire on named events. Each hook can be filtered by a `matcher` field — a regex pattern that limits when the hook fires. The full event and matcher reference is in the Claude Code hooks documentation — consult that as the authoritative source.

**Most useful events for notifications:**

- `Stop` — fires when Claude finishes responding; most common for "notify me when done"
- `SessionEnd` — fires when the session ends; useful for session tracking
- `Notification` — fires when Claude Code raises a notification (permission prompts, idle prompts); useful for "notify me when you need attention"

When configuring event hooks, ask the user which events they want, then ask per-event which matcher values to use and which channels to route to. For each event, also confirm whether the hook should run async (recommended) or blocking.

---

## Hook Scripts

All notification commands are available through the `gobbi notify` CLI. They use a shared sender (`gobbi notify send`) that routes to all configured channels based on environment variables loaded from `$CLAUDE_ENV_FILE`.

Hook scripts should already be installed in `$CLAUDE_PROJECT_DIR/.claude/hooks/`. Read the installed scripts and the hook configuration in `settings.json` for the current setup — these are the authoritative source for what is actually installed.

Message truncation limits are configurable via `$CLAUDE_PROJECT_DIR/.claude/.env`. Defaults are defined in the notification scripts.

---

## Verification

If a test notification fails to arrive: check that `$CLAUDE_PROJECT_DIR/.claude/.env` exists, values are correct, the hook scripts are executable, and `jq` is available (scripts depend on it for JSON parsing). Delivery failures are logged — check `~/.claude/notification-failures.log` if notifications stop arriving.

---

## Child Skills

| Skill | Covers |
|---|---|
| `_slack` | Slack notification channel setup — bot token, user ID, workspace configuration |
| `_telegram` | Telegram notification channel setup — bot creation via @BotFather, chat ID retrieval |
| `_discord` | Discord notification channel setup — webhook URL configuration |
