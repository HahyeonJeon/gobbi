---
name: _notification
description: Help users configure Claude Code notifications (Slack, Telegram, and others) through conversation. Use when the user wants to set up, modify, or troubleshoot notification settings.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Notification

Help users configure Claude Code notification credentials through conversation. Hooks and settings are already installed by `npx gobbi init` — this skill handles the credential setup that makes them work.

---

## When This Skill Loads

Guide the user through credential setup using AskUserQuestion. Follow these steps in order.

### Step 1: Ask which channels to configure

Use AskUserQuestion with multiSelect. Options:

- **Slack** (recommended first) — richest integration, supports threads and formatting
- **Telegram** — lightweight, good for mobile alerts
- **Desktop** — OS-native notifications, no account needed
- **Custom webhook** — any HTTP endpoint

Allow multiple selection. The user may want different channels for different event types (e.g., errors to Slack, completions to desktop).

### Step 2: Collect credentials for each selected channel

For each channel, walk the user through obtaining and providing credentials using AskUserQuestion.

**Slack (Bot API — DM to user):**
1. Guide: Go to https://api.slack.com/apps, Create New App, From Scratch
2. Go to OAuth & Permissions, add `chat:write` scope under Bot Token Scopes
3. Install App to Workspace, copy the Bot User OAuth Token (`xoxb-...`)
4. Get your Slack User ID: click your profile in Slack → three dots → Copy member ID
5. Ask user to paste `SLACK_BOT_TOKEN` and `SLACK_USER_ID`

**Telegram:**
1. Guide: Open Telegram, search @BotFather, send `/newbot`, follow prompts, copy the bot token
2. Guide: Start a chat with the new bot, send any message, then get chat ID via `curl https://api.telegram.org/bot<TOKEN>/getUpdates` and find `chat.id` in the response
3. Ask user to paste `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`

**Desktop:**
- No credentials needed. Set `NOTIFY_DESKTOP=true` in the credentials file.
- Requires `notify-send` on Linux or `osascript` on macOS (usually pre-installed).

**Custom webhook:**
- Ask for the webhook URL and any required auth headers. Store as environment variables following the same pattern.

### Step 3: Save credentials

Write the collected values to `.claude/.env` (must be gitignored). This file is read by `load-notification-env.sh` at SessionStart via the `$CLAUDE_ENV_FILE` mechanism.

**Format:** One `KEY=value` per line, no `export` prefix — the hook script adds it. Blank lines and lines starting with `#` are ignored.

Write credentials to `.claude/.env.tmp` first, then move to `.claude/.env` for an atomic update that avoids partial reads. File permissions are enforced to 600 at session start automatically.

After writing, check whether `.claude/.env` is in `.gitignore`. If not, remind the user to add it — credentials must never be committed.

### Step 4: Verify setup

Offer two verification options:
- **Quick test:** Run the `notify-send.sh` script directly with a test message to confirm the channel receives it
- **Live test:** Tell the user to trigger a notification event naturally (e.g., ask Claude something short that completes, which fires the Stop hook)

If the test fails, troubleshoot: check that the env file exists, values are correct, and the hook script is executable.

---

## Events and Matchers

After channel setup, ask the user which events they want notifications on. For each event, ask which matcher values to use via AskUserQuestion. The matcher is a regex pattern that filters when the hook fires.

### Events with matchers

For each event, ask the user which matcher values to include. Build the `matcher` field as a regex pipe (`value1|value2`). Matchers are case-sensitive.

**Notification** — matcher filters on notification type
- Values: `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`
- Ask: Which types? e.g., only `permission_prompt|elicitation_dialog` for attention-needed alerts

**PreToolUse / PostToolUse / PostToolUseFailure / PermissionRequest** — matcher filters on tool name
- Values: `Bash`, `Edit`, `Write`, `Read`, `Glob`, `Grep`, `WebFetch`, `WebSearch`, `Agent`, `ExitPlanMode`
- MCP tools: `mcp__<server>__<tool>` (e.g., `mcp__github__search_repositories`), regex `mcp__.*`
- Ask: Which tools? e.g., only `Edit|Write` for code change notifications

**SubagentStart / SubagentStop** — matcher filters on agent type
- Values: `Bash`, `Explore`, `Plan`, or custom agent names
- Ask: All subagents or specific types?

**StopFailure** — matcher filters on error type
- Values: `rate_limit`, `authentication_failed`, `billing_error`, `invalid_request`, `server_error`, `max_output_tokens`, `unknown`
- Ask: Which error types?

**SessionStart** — matcher filters on session source
- Values: `startup`, `resume`, `clear`, `compact`
- Ask: Which session events?

**SessionEnd** — matcher filters on end reason
- Values: `clear`, `resume`, `logout`, `prompt_input_exit`, `bypass_permissions_disabled`, `other`
- Ask: Which end reasons?

**ConfigChange** — matcher filters on config source
- Values: `user_settings`, `project_settings`, `local_settings`, `policy_settings`, `skills`
- Ask: Which config changes?

**FileChanged** — matcher filters on filename (basename)
- Values: any filename (e.g., `.env`, `.envrc`, `package.json`)
- Ask: Which files to watch?

**InstructionsLoaded** — matcher filters on load reason
- Values: `session_start`, `nested_traversal`, `path_glob_match`, `include`, `compact`
- Ask: Which load events?

**PreCompact / PostCompact** — matcher filters on compaction trigger
- Values: `manual`, `auto`
- Ask: Both or specific trigger?

**Elicitation / ElicitationResult** — matcher filters on MCP server name
- Values: configured MCP server names
- Ask: Which MCP servers?

### Events without matchers

These events fire on every occurrence — no matcher filtering.

| Event | When It Fires |
|-------|---------------|
| `Stop` | Claude finishes responding |
| `TaskCreated` | A tracked task is created |
| `TaskCompleted` | A tracked task is marked done |
| `UserPromptSubmit` | Before Claude processes input |
| `TeammateIdle` | Before teammate goes idle |
| `CwdChanged` | Working directory changes |
| `WorktreeCreate` | A git worktree is created |
| `WorktreeRemove` | A git worktree is removed |

### For each event the user selects, must ask:

1. Which matcher values to include (build as regex pipe for the `matcher` field)
2. Which channel(s) to send to (may differ per event — errors to Slack, completions to desktop)
3. Whether the hook should run async (`"async": true`, recommended) or blocking

---

## Hook Scripts

All scripts live in `.claude/hooks/` and must be executable (`chmod +x`). They use a shared sender (`notify-send.sh`) that routes to all configured channels via environment variables loaded from `$CLAUDE_ENV_FILE`.

### Shared sender: `notify-send.sh`

Routes messages to all configured channels. Channels are enabled by environment variables (loaded via `$CLAUDE_ENV_FILE` at session start):
- `SLACK_BOT_TOKEN` + `SLACK_USER_ID` — enables Slack (Bot API, DMs to user)
- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` — enables Telegram
- `NOTIFY_DESKTOP=true` — enables native desktop notifications (Linux notify-send, macOS osascript)

Messages are automatically truncated at per-platform limits. Override defaults via `.claude/.env`: `TELEGRAM_MAX_CHARS` (default 3900), `SLACK_MAX_CHARS` (default 3500), `DESKTOP_MAX_CHARS` (default 250).

### Installed hook scripts

| Script | Hook Event | Matcher | Use Case |
|--------|-----------|---------|----------|
| `notify-completion.sh` | `Stop` | (none) | "Notify me when Claude is done" |
| `notify-attention.sh` | `Notification` | `permission_prompt\|idle_prompt\|elicitation_dialog` | "Notify me when Claude needs my input" |
| `notify-error.sh` | `StopFailure` | `rate_limit\|authentication_failed\|billing_error\|server_error` | "Notify me when something goes wrong" |
| `notify-subagent.sh` | `SubagentStop` | (all) | "Notify me when a subagent finishes" |
| `notify-session.sh` | `SessionStart` / `SessionEnd` | `startup\|resume` / `logout\|prompt_input_exit` | "Notify me on session start/end" |

---

## Gotchas

- **Stop hook infinite loop** — always check `stop_hook_active` in the input JSON and exit early if `true`
- **Missing jq** — scripts depend on `jq` for JSON parsing. Check availability and guide install
- **Script not executable** — always `chmod +x` after writing hook scripts
- **Credentials in code** — never hardcode tokens. Use environment variables and `.claude/.env`
- **Shell profile noise** — `.bashrc` or `.zshrc` echo statements can corrupt JSON output. Scripts should use `#!/bin/bash` without sourcing profile
- **No `export` in env file** — `.env` uses bare `KEY=value` format. The `load-notification-env.sh` hook adds the `export` prefix when writing to `$CLAUDE_ENV_FILE`
- **Delivery failures silently disappear** — failures are logged to `~/.claude/notification-failures.log`. Check this file if notifications stop arriving. The log grows unboundedly — delete it periodically if it gets large.
