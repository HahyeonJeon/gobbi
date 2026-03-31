---
name: _discord
description: Configure Discord notifications for Claude Code sessions. Setup guide for webhook-based notification delivery.
---

# Discord Notifications

Discord notifications for Claude Code use incoming webhooks — a URL that accepts HTTP POST requests and delivers them to a specific channel. Understanding this model helps you configure, debug, and extend the integration.

---

## How Webhook Delivery Works

A Discord webhook is a one-way pipe attached to a specific channel: your Claude Code hook script sends a JSON payload to the URL, and Discord posts it as a message in that channel. The URL encodes both authentication and destination — anyone with the URL can post to that channel, so treat it as a credential.

Unlike Slack's bot token model, Discord webhooks do not require a bot account or OAuth flow. You create the webhook directly from the channel settings, which makes setup faster but ties delivery to that specific channel — changing the destination requires creating a new webhook.

**What gets sent:** Each notification includes the event type, a short summary, and a timestamp. Discord supports rich embeds with color coding, titles, and fields, but the notification scripts send plain text content to maximize compatibility across Discord client versions.

---

## Core Concepts

**Webhook URL** — a URL in the format `https://discord.com/api/webhooks/{id}/{token}` that authenticates the delivery and targets the channel. Created from the channel's Integrations settings. Rotate this URL if it is exposed, as rotation immediately revokes the old URL.

**Channel targeting** — each webhook is bound to one channel at creation time. To deliver to multiple channels, create one webhook per channel. There is no equivalent to Slack's user ID model — Discord webhooks post to channels, not DMs.

**Server membership** — the webhook is scoped to the server (guild) and channel where it was created. If you leave the server or the channel is deleted, the webhook stops working.

**Embed formatting** — Discord supports structured embed objects with color, title, description, and field arrays. These are optional. Plain text `content` fields work in all contexts including mobile and accessibility tools; embeds do not render in some notification previews.

---

## When to Use Discord

Discord works well when: you already use Discord for development or gaming communities and want notifications visible there, you want a fast no-OAuth webhook setup, or you want to share session notifications with a server community.

Consider Slack instead when: you use Slack for professional development work and want notification history alongside work communication, or you need DM delivery rather than channel posting.

Consider Telegram instead when: you want personal mobile push notifications without any server or channel involved.

---

## Credential Storage

Store the webhook URL as `DISCORD_WEBHOOK_URL` in `.claude/.env`. This file is read by `load-notification-env.sh` at session start and must be listed in `.gitignore` — credentials committed to version control are compromised credentials.

The hook scripts check for the variable before attempting delivery. If it is absent, Discord delivery is silently skipped rather than causing an error.
