---
name: _telegram
description: Configure Telegram notifications for Claude Code sessions. Setup guide for bot-based notification delivery.
---

# Telegram Notifications

Telegram notifications for Claude Code use a bot token and a chat ID. Understanding the bot model helps you set up the integration correctly and troubleshoot delivery issues.

---

## How Bot Delivery Works

A Telegram bot is a program-controlled account created through @BotFather. Your Claude Code hook script calls the Telegram Bot API directly, sending a message to a specific chat. The bot must have been started by the target user — a bot cannot initiate contact with a user who has never messaged it.

The most common setup is a personal bot that messages you: you create the bot, start a conversation with it, then capture the chat ID that identifies your conversation with it. This chat ID is then stored as a credential alongside the bot token.

**What gets sent:** Each notification includes the event type, a short summary, and a timestamp. Telegram supports basic Markdown formatting, but the notification scripts send plain text by default to avoid parsing issues with special characters in event data.

---

## Core Concepts

**Bot token** — a credential in the format `123456789:ABCdef...` that authenticates your bot with the Telegram API. Issued by @BotFather when you create a bot. Treat it as a password — anyone with the token can send messages as your bot.

**Chat ID** — a numeric identifier for a specific conversation. For a direct message to yourself, this is your personal chat ID with the bot. For a group, it is the group's chat ID. Chat IDs are stable and do not change when group names or user names change.

**Getting your chat ID** — after starting a conversation with your bot, query `https://api.telegram.org/bot<TOKEN>/getUpdates`. The response includes a `chat.id` field in the most recent message. This is the value to store.

**Group delivery** — bots can also post to groups where they are a member. The chat ID for a group is negative. Add the bot to the group, send a message mentioning it, then query `getUpdates` to retrieve the group chat ID.

---

## When to Use Telegram

Telegram works well when: you want mobile push notifications that interrupt rather than accumulate, you do not have a Slack workspace, or you want a lightweight personal setup with no team overhead.

Consider Slack instead when: you already use Slack for development and want notification history alongside your work communication, or you want to share notifications with a team.

Consider desktop notifications instead when: you are at your machine and want zero-latency alerts without any external service dependency.

---

## Credential Storage

Store credentials as `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.claude/.env`. This file is read by `load-notification-env.sh` at session start and must be listed in `.gitignore` — credentials committed to version control are compromised credentials.

The hook scripts check for both variables before attempting delivery. If either is absent, Telegram delivery is silently skipped rather than causing an error.
