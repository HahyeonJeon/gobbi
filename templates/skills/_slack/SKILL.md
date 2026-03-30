---
name: _slack
description: Configure Slack notifications for Claude Code sessions. Setup guide for webhook-based notification delivery.
---

# Slack Notifications

Slack notifications for Claude Code use incoming webhooks — a URL that accepts HTTP POST requests and delivers them to a specific channel or direct message. Understanding this model helps you configure, debug, and extend the integration.

---

## How Bot Delivery Works

An incoming webhook is a one-way pipe: your Claude Code hook script sends a JSON payload to a URL, and Slack delivers it to the target. The URL encodes both authentication and destination — anyone with the URL can post to that channel, so treat it as a credential.

Slack also supports bot tokens, which give more control: you can DM a user by ID rather than a fixed channel, and you can adjust the message format over time without rotating the webhook URL. The gobbi notification scripts use the bot token model so that messages arrive as direct messages to your user ID rather than a shared channel.

**What gets sent:** Each notification includes the event type, a short summary of what happened, and a timestamp. Long messages are truncated to stay within Slack's message size limits.

---

## Core Concepts

**Bot token** — a credential starting with `xoxb-` that identifies your app and grants `chat:write` permission. Obtained from the Slack app management UI after creating an app and installing it to your workspace.

**User ID** — your Slack member ID (not your username), used as the target for DMs. Found in your Slack profile settings. IDs start with `U` and are stable even if you rename your account.

**Workspace scope** — the token is scoped to one workspace. If you work across multiple Slack workspaces, you need a separate app and token for each.

**Channel targeting** — the bot can post to public channels it has been invited to, private channels it has been added to, or DM any user in the workspace. DM to self (via your user ID) is the lowest-friction setup.

---

## When to Use Slack

Slack works well when: you already have Slack open during development sessions, you want rich notification history searchable by date or project, or you want to share session notifications with a team channel.

Consider Telegram instead when: you want mobile push notifications that interrupt rather than accumulate, you do not have a Slack workspace, or you want a lower-friction personal setup without managing a bot app.

Consider desktop notifications instead when: you are at your machine and want zero-latency alerts without any external service dependency.

---

## Credential Storage

Store credentials as `SLACK_BOT_TOKEN` and `SLACK_USER_ID` in `.claude/.env`. This file is read by `load-notification-env.sh` at session start and must be listed in `.gitignore` — credentials committed to version control are compromised credentials.

The hook scripts check for both variables before attempting delivery. If either is absent, Slack delivery is silently skipped rather than causing an error.
