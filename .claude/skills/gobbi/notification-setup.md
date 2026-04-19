# Notification Setup

> Status: v0.5.0 stable — updated 2026-04-19

Check notification configuration state at session start. Determines which channels are ready, which need setup, and what the orchestrator should offer the user.

---

## Core Principle

> **A session that knows its notification state upfront avoids mid-task setup interruptions.**

Detection before the first task means the orchestrator can offer credential setup during session start rather than discovering missing credentials when a notification tries to fire.

> **Both session flag AND credentials must be present for notifications to fire.**

Notification delivery requires two independent conditions: the session flag in `gobbi.json` is `true` for the channel, and the channel's credentials exist in `.env`. Missing either one suppresses delivery. This means credentials alone are not sufficient — the user must explicitly opt in per session during the setup questions in FIFTH.

> **Detection is read-only.**

Never modify credentials, hooks, or settings during detection. Report state; let the user decide what to fix.

---

## How Notifications Work in v0.5.0

In v0.5.0, the four-channel setup question (Slack / Telegram / Discord / Skip) runs inside `gobbi workflow init` — not as a separate `/gobbi` step. When `gobbi workflow init` fires at SessionStart, it reads the session flags from `gobbi.json` and calls `gobbi notify send` inline at workflow boundaries (session open, step transitions, completion). No plugin hook is registered for notifications: CP3 and L-F3 removed the auto-registered `gobbi notify *` hook entries from the plugin.

If you want notifications to auto-fire independently of the workflow CLI (for example, on Stop events outside an active session), see the "Restoring auto-fire notifications" section below.

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

### 2. Session Preferences in gobbi.json

The user's notification choices from the setup questions (FIFTH) are persisted to `gobbi.json` via `gobbi config`. The `gobbi notify send` command reads these per-session flags before attempting delivery. Without a session entry, all channels default to `false` — no notifications fire until the user explicitly selects during setup.

Slack and Telegram have conditional session-level control. Discord delivery is deferred to a future version. Desktop notifications (`NOTIFY_DESKTOP`) remain environment-level only — they are not gated by `gobbi.json` session flags.

### 3. Classify State

**Fully configured** — Credentials exist in `.env` and session flags are set in `gobbi.json` for the selected channels. After the user selects channels at setup, the orchestrator persists session flags. Notifications fire via `gobbi notify send` at workflow boundaries.

**Partially configured** — Credentials exist but session flags are missing, or flags are set but credentials are absent. Report what's missing and offer to fix. Both conditions must be true for delivery.

**Not configured** — No `$CLAUDE_PROJECT_DIR/.claude/.env` or no notification credentials. If the user selected notification channels at session start, load `_notification` and read the relevant channel doc (`slack.md`, `telegram.md`, `discord.md`) to help set up. Session flags are still written to `gobbi.json` so that notifications activate immediately once credentials are added.

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
