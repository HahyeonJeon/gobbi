---
name: gobbi-notification
description: Help users configure Claude Code notifications (Slack, Telegram, and others) through conversation. Use when the user wants to set up, modify, or troubleshoot notification settings.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Notification

Help users configure Claude Code notifications through conversation. Users must not study notification setup — gobbi handles it by asking what they need and configuring it for them.

---

## When This Skill Loads

Guide the user through notification setup using AskUserQuestion:
1. Ask which channel they want (Slack, Telegram, desktop, custom webhook)
2. Walk them through the channel's auth setup step by step
3. Ask which events should trigger notifications
4. Write the hook scripts and settings configuration

---

## Supported Channels

### Slack

**Setup requirements:**
- Slack Incoming Webhook URL (from Slack App → Incoming Webhooks)
- Channel name (optional, defaults to webhook's channel)

**Guide the user:**
1. Go to https://api.slack.com/apps → Create New App → From Scratch
2. Enable Incoming Webhooks → Add New Webhook to Workspace
3. Select the target channel → Copy the Webhook URL
4. Store the webhook URL in environment variable `SLACK_WEBHOOK_URL`

**Hook type:** `http` hook pointing to the webhook URL, or `command` hook using curl script.

### Telegram

**Setup requirements:**
- Telegram Bot Token (from @BotFather)
- Chat ID (from @userinfobot or the bot's getUpdates API)

**Guide the user:**
1. Open Telegram → search @BotFather → `/newbot` → follow prompts
2. Copy the bot token
3. Start a chat with the bot, send any message
4. Get chat ID: `curl https://api.telegram.org/bot<TOKEN>/getUpdates` → find `chat.id`
5. Store as environment variables `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`

**Hook type:** `command` hook using curl script.

### Desktop (Native)

**Setup requirements:** None — uses OS-native notification.

**Linux:** `notify-send`
**macOS:** `osascript -e 'display notification ...'`
**Windows:** PowerShell toast notification

**Hook type:** `command` hook with OS-specific command.

### Custom Webhook

**Setup requirements:**
- Webhook URL
- Auth headers (if any)

**Hook type:** `http` hook with custom URL and headers.

---

## Notification Events and Matchers

After channel setup, ask the user which events they want notifications on. For each event, ask which matcher values to use via AskUserQuestion. The matcher is a regex pattern in the hook config that filters when the hook fires.

### Events with matchers

For each event below, must ask the user which matcher values to include. Build the `matcher` field as a regex pipe (`value1|value2`). Matchers are case-sensitive regex patterns.

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

These events have no matcher support — the hook fires on every occurrence.

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

## Setup

### Make scripts executable

After writing or installing hook scripts, must run:

```
chmod +x .claude/hooks/*.sh
```

### Load API keys via `$CLAUDE_ENV_FILE`

API keys and tokens must not be hardcoded. Use a `SessionStart` hook to write credentials into `$CLAUDE_ENV_FILE`, which makes them available as environment variables to all subsequent hooks in the session.

Create `.claude/hooks/load-notification-env.sh`:

```bash
#!/bin/bash
# SessionStart hook — loads notification credentials into the session.
# Reads from a local .env file (gitignored) and writes to $CLAUDE_ENV_FILE.

ENV_FILE="$CLAUDE_PROJECT_DIR/.claude/.notification-env"

if [ -n "$CLAUDE_ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
  while IFS= read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    echo "export $line" >> "$CLAUDE_ENV_FILE"
  done < "$ENV_FILE"
fi

exit 0
```

The user stores their credentials in `.claude/.notification-env` (must be gitignored):

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../xxx
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=987654321
NOTIFY_DESKTOP=true
```

Add the SessionStart hook to settings:

```json
"SessionStart": [
  {
    "matcher": "startup|resume",
    "hooks": [
      {
        "type": "command",
        "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/load-notification-env.sh",
        "timeout": 5
      }
    ]
  }
]
```

This ensures credentials are loaded at every session start and resume, and available to all notification scripts.

---

## Hook Scripts

All scripts must be in `.claude/hooks/` and executable (`chmod +x`). They use a shared sender (`notify-send.sh`) that routes to all configured channels via environment variables loaded from `$CLAUDE_ENV_FILE`.

### Shared sender: `notify-send.sh`

Routes messages to all configured channels. Channels are enabled by environment variables (loaded via `$CLAUDE_ENV_FILE` at session start):
- `SLACK_WEBHOOK_URL` — enables Slack
- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` — enables Telegram
- `NOTIFY_DESKTOP=true` — enables native desktop notifications (Linux notify-send, macOS osascript)

### User case scripts

| Script | Hook Event | Matcher | Use Case |
|--------|-----------|---------|----------|
| `notify-completion.sh` | `Stop` | (none) | "Notify me when Claude is done" |
| `notify-attention.sh` | `Notification` | `permission_prompt\|idle_prompt\|elicitation_dialog` | "Notify me when Claude needs my input" |
| `notify-error.sh` | `StopFailure` | `rate_limit\|authentication_failed\|billing_error\|server_error` | "Notify me when something goes wrong" |
| `notify-subagent.sh` | `SubagentStop` | (all) | "Notify me when a subagent finishes" |
| `notify-session.sh` | `SessionStart` / `SessionEnd` | `startup\|resume` / `logout\|prompt_input_exit` | "Notify me on session start/end" |

---

## Settings Configuration

Notification hooks go in `.claude/settings.local.json`. Combine user cases by adding multiple events to the `hooks` object.

### Example: all user cases enabled

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-completion.sh",
            "timeout": 10,
            "async": true
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "permission_prompt|idle_prompt|elicitation_dialog",
        "hooks": [
          {
            "type": "command",
            "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-attention.sh",
            "timeout": 5,
            "async": true
          }
        ]
      }
    ],
    "StopFailure": [
      {
        "matcher": "rate_limit|authentication_failed|billing_error|server_error",
        "hooks": [
          {
            "type": "command",
            "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-error.sh",
            "timeout": 5,
            "async": true
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-subagent.sh",
            "timeout": 5,
            "async": true
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-session.sh",
            "timeout": 5,
            "async": true
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "logout|prompt_input_exit",
        "hooks": [
          {
            "type": "command",
            "command": "bash $CLAUDE_PROJECT_DIR/.claude/hooks/notify-session.sh",
            "timeout": 5,
            "async": true
          }
        ]
      }
    ]
  }
}
```

The skill must ask the user which cases they want, then write only those events into settings. Different matcher values per event can be customized based on user answers.

---

## Gotchas

- **Stop hook infinite loop** — always check `stop_hook_active` in the input JSON and exit early if `true`
- **Missing jq** — scripts depend on `jq` for JSON parsing. Check availability and guide install
- **Script not executable** — always `chmod +x` after writing hook scripts
- **Credentials in code** — never hardcode tokens. Use environment variables and `allowedEnvVars` for http hooks
- **Shell profile noise** — `.bashrc` or `.zshrc` echo statements can corrupt JSON output. Scripts should use `#!/bin/bash` without sourcing profile
