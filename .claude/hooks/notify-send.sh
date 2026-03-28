#!/bin/bash
# Shared notification sender. Called by case-specific hooks.
# Reads channel config from environment variables and sends to all configured channels.
#
# Usage: echo "message" | bash notify-send.sh "Title"
# Required env: at least one of SLACK_WEBHOOK_URL, TELEGRAM_BOT_TOKEN+TELEGRAM_CHAT_ID
# Optional env: NOTIFY_DESKTOP=true

TITLE="${1:-Claude Code}"
MESSAGE=$(cat)

if [ -z "$MESSAGE" ]; then
  exit 0
fi

# Slack
if [ -n "$SLACK_WEBHOOK_URL" ]; then
  PAYLOAD=$(jq -n --arg text "*${TITLE}*\n${MESSAGE}" '{text: $text}')
  curl -s -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-Type: application/json' \
    -d "$PAYLOAD" > /dev/null 2>&1 &
fi

# Telegram
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  TEXT=$(printf "<b>%s</b>\n%s" "$TITLE" "$MESSAGE")
  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="$TELEGRAM_CHAT_ID" \
    -d text="$TEXT" \
    -d parse_mode="HTML" > /dev/null 2>&1 &
fi

# Desktop
if [ "$NOTIFY_DESKTOP" = "true" ]; then
  case "$(uname -s)" in
    Linux*)
      notify-send "$TITLE" "$MESSAGE" 2>/dev/null &
      ;;
    Darwin*)
      osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\"" 2>/dev/null &
      ;;
  esac
fi

wait
exit 0
