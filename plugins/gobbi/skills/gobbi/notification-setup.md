# Notification Setup

Check notification configuration state at session start. Determines which channels are ready, which need setup, and what the orchestrator should offer the user.

---

## Core Principle

> **A session that knows its notification state upfront avoids mid-task setup interruptions.**

Detection before the first task means the orchestrator can offer credential setup during session start rather than discovering missing credentials when a notification tries to fire.

> **Both session flag AND credentials must be present for notifications to fire.**

Notification delivery requires two independent conditions: the session flag in `gobbi.json` is `true` for the channel, and the channel's credentials exist in `.env`. Missing either one suppresses delivery. This means credentials alone are not sufficient — the user must explicitly opt in per session during `/gobbi` setup.

> **Detection is read-only.**

Never modify credentials, hooks, or settings during detection. Report state; let the user decide what to fix.

---

## Setup Sequence

Runs automatically at session start, after the setup questions and before the first task.

### 1. Credential File

Check if `$CLAUDE_PROJECT_DIR/.claude/.env` exists. If it does, read it and identify which channel credentials are present:

- **Slack** — Look for `SLACK_BOT_TOKEN` and `SLACK_USER_ID` or `SLACK_CHANNEL_ID`
- **Telegram** — Look for `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
- **Discord** — Look for `DISCORD_WEBHOOK_URL` (note: Discord delivery is not yet implemented in the CLI — credential detection only)
- **Desktop** — Look for `NOTIFY_DESKTOP=true`

A channel is "configured" when all its required credentials are present and non-empty.

### 2. Hook Scripts

Check `settings.json` (and `settings.local.json`) for hook entries that invoke `gobbi notify` commands. There are no standalone shell scripts in `.claude/hooks/` — hooks are registered directly in the settings files and call the gobbi CLI.

- `gobbi notify send` — the shared sender invoked by hook entries
- Event-specific entries in `settings.json` hooks array

Missing hook entries indicate an incomplete installation. Verify `gobbi` is in PATH by running `which gobbi`.

### 3. Hook Configuration

Check `settings.json` for hook entries that reference the notification scripts. Hooks must be registered for the desired events (typically `Stop` and `Notification`).

### 4. Session Preferences in gobbi.json

The user's notification choices from `/gobbi` setup Q4 are persisted to `gobbi.json` via `gobbi config`. The `gobbi notify send` command reads these per-session flags before attempting delivery. Without a session entry, all channels default to `false` — no notifications fire until the user explicitly selects during setup.

Only Slack and Telegram have conditional session-level control in v0.3.2. Discord delivery is deferred to a future version. Desktop notifications (`NOTIFY_DESKTOP`) remain environment-level only — they are not gated by `gobbi.json` session flags.

### 5. Classify State

**Fully configured** — Credentials exist in `.env`, hooks are registered in `settings.json`, and session flags are set in `gobbi.json`. After the user selects channels at setup, the orchestrator persists session flags. Notifications fire for selected channels.

**Partially configured** — Some pieces are in place but others are missing (e.g., credentials exist but hooks aren't registered in `settings.json`). Report what's missing and offer to fix. Session flags alone are not sufficient — credentials and hook registration must also be present.

**Not configured** — No `$CLAUDE_PROJECT_DIR/.claude/.env` or no notification credentials. If the user selected notification channels at session start, load _notification and the relevant child skill (_slack, _telegram, _discord) to help set up. Session flags are still written to `gobbi.json` so that notifications activate immediately once credentials are added.

**Degraded** — Credentials exist but a dependency is missing (e.g., `gobbi` not in PATH, `notify-send` not available for Desktop). Report the dependency gap.

---

## Constraints

- Detection must be lightweight — reading a few files, not running network checks or sending test messages
- Never modify `$CLAUDE_PROJECT_DIR/.claude/.env`, hook scripts, or settings during detection
- Never send test notifications during detection — that belongs to the _notification setup flow
- If `$CLAUDE_PROJECT_DIR/.claude/.env` exists, check file permissions are 600 — warn if not, but do not change them during detection
