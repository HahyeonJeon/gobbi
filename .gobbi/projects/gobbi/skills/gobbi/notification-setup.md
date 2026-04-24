# Notification Setup

> Status: v0.5.0 stable — updated 2026-04-19

Check notification configuration state at session start. Determines which channels are ready, which need setup, and what the orchestrator should offer the user.

---

## Core Principle

> **A session that knows its notification state upfront avoids mid-task setup interruptions.**

Detection before the first task means the orchestrator can offer credential setup during session start rather than discovering missing credentials when a notification tries to fire.

> **Both `notify.{channel}.enabled: true` AND credentials must be present for notifications to fire.**

Notification delivery requires two independent conditions: `notify.{channel}.enabled` is `true` in the resolved cascade (`settings.json` at workspace / project / session level), and the channel's credentials exist in `.claude/.env`. Missing either one suppresses delivery. This means credentials alone are not sufficient — the user must explicitly opt in per session during the setup questions in FIFTH.

> **Detection is read-only.**

Never modify credentials, hooks, or settings during detection. Report state; let the user decide what to fix.

---

## How Notifications Work in v0.5.0

In v0.5.0, the four-channel setup question (Slack / Telegram / Discord / Skip) runs during `/gobbi` FIFTH step. The FIFTH step writes `notify.{channel}.enabled: true` (or `false`) to the session-level `settings.json` via `gobbi config set --level session`. When `gobbi workflow init` fires at SessionStart, it reads session flags from the resolved cascade (`lib/notify.ts::resolveSettings`) and calls `gobbi notify send` inline at workflow boundaries (session open, step transitions, completion).

No plugin hook is registered for notifications: CP3 and L-F3 removed the auto-registered `gobbi notify *` hook entries from the plugin. If you want notifications to auto-fire independently of the workflow CLI (for example, on Stop events outside an active session), see the "Restoring auto-fire notifications" section below.

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

### 2. Session Preferences in `settings.json`

The user's notification choices from the setup questions (FIFTH) are persisted to `.gobbi/sessions/{id}/settings.json` via `gobbi config set --level session`. The `gobbi notify send` command reads these per-session flags via the cascade (`resolveSettings`) before attempting delivery. Without a session-level setting, channels default to `enabled: false` from the built-in defaults — no notifications fire until the user explicitly selects during setup.

Slack, Telegram, and Discord have `enabled` flags at all three levels (workspace / project / session). Desktop notifications also use `notify.desktop.enabled`. The `events` field (per channel) controls which gobbi workflow events trigger delivery — absent `events` means all events fire; `events: []` means none. Credentials remain in `.claude/.env` only — never in `settings.json`.

### 3. Classify State

**Fully configured** — Credentials exist in `.claude/.env` and `notify.{channel}.enabled: true` is set at session level in `.gobbi/sessions/{id}/settings.json`. After the user selects channels at setup, the orchestrator persists `enabled: true` via `gobbi config set`. Notifications fire via `gobbi notify send` at workflow boundaries.

**Partially configured** — Credentials exist but `enabled` flag is missing or false, or the flag is set but credentials are absent. Report what's missing and offer to fix. Both conditions must be true for delivery.

**Not configured** — No `$CLAUDE_PROJECT_DIR/.claude/.env` or no notification credentials. If the user selected notification channels at session start, load `_notification` and read the relevant channel doc (`slack.md`, `telegram.md`, `discord.md`) to help set up. The `enabled: true` flag can be written now via `gobbi config set notify.slack.enabled true --level session` so notifications activate immediately once credentials are added.

**Degraded** — Credentials exist but a dependency is missing (e.g., `gobbi` not in PATH, `notify-send` not available for Desktop). Report the dependency gap.

---

## Restoring Auto-Fire Notifications

V0.5.0 removes the plugin's automatic `gobbi notify *` hook registrations (per L-F3). If you want notifications to fire automatically on Claude Code session events — independent of the workflow CLI — add your own hook entries to your user-level `~/.claude/settings.json`. The `gobbi notify` subcommand continues to work in v0.5.0.

For the exact hook entries to copy into your `~/.claude/settings.json` and the three restoration paths (keep v0.4.5 alongside, wire your own hooks, or wait for Phase 3), see `MIGRATION.md` — Breaking change 1. The migration guide has copy-paste-ready command strings and explains which restoration path fits which usage pattern.

---

## Constraints

- Detection must be lightweight — reading a few files, not running network checks or sending test messages
- Never modify `$CLAUDE_PROJECT_DIR/.claude/.env`, hook scripts, or settings during detection
- Never send test notifications during detection — that belongs to the `_notification` setup flow
- If `$CLAUDE_PROJECT_DIR/.claude/.env` exists, check file permissions are 600 — warn if not, but do not change them during detection
