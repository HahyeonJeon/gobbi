# Notification Setup

Check notification configuration state at session start. Determines which channels are ready, which need setup, and what the orchestrator should offer the user.

---

## Core Principle

> **A session that knows its notification state upfront avoids mid-task setup interruptions.**

Detection before the first task means the orchestrator can offer credential setup during session start rather than discovering missing credentials when a notification tries to fire.

> **Detection is read-only.**

Never modify credentials, hooks, or settings during detection. Report state; let the user decide what to fix.

---

## Setup Sequence

Runs automatically at session start, after the setup questions and before the first task.

### 1. Credential File

Check if `.claude/.env` exists. If it does, read it and identify which channel credentials are present:

- **Slack** — Look for `SLACK_BOT_TOKEN` and `SLACK_USER_ID` or `SLACK_CHANNEL_ID`
- **Telegram** — Look for `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
- **Discord** — Look for `DISCORD_WEBHOOK_URL`
- **Desktop** — Look for `NOTIFY_DESKTOP=true`

A channel is "configured" when all its required credentials are present and non-empty.

### 2. Hook Scripts

Check if notification hook scripts exist in `.claude/hooks/` and are executable. The key scripts:
- `notify-send.sh` — the shared sender that routes to configured channels
- Event-specific hook scripts that invoke the sender

Missing or non-executable scripts indicate an incomplete installation.

### 3. Hook Configuration

Check `settings.json` for hook entries that reference the notification scripts. Hooks must be registered for the desired events (typically `Stop` and `Notification`).

### 4. Classify State

**Fully configured** — Credentials exist, scripts are executable, hooks are registered. The orchestrator enables notifications for the configured channels without user action.

**Partially configured** — Some pieces are in place but others are missing (e.g., credentials exist but hooks aren't registered, or scripts exist but aren't executable). Report what's missing and offer to fix.

**Not configured** — No `.claude/.env` or no notification credentials. If the user selected notification channels at session start, load _notification and the relevant child skill to help set up.

**Degraded** — Credentials exist but a dependency is missing (e.g., `jq` not installed, `notify-send` not available for Desktop). Report the dependency gap.

---

## Constraints

- Detection must be lightweight — reading a few files, not running network checks or sending test messages
- Never modify `.claude/.env`, hook scripts, or settings during detection
- Never send test notifications during detection — that belongs to the _notification setup flow
- If `.claude/.env` exists, check file permissions are 600 — warn if not, but do not change them during detection
