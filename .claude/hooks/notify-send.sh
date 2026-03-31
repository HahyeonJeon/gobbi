#!/bin/bash
# Shared notification sender. Called by case-specific hooks.
# Reads channel config from environment variables and sends to all configured channels.
#
# Usage: echo "message" | bash notify-send.sh "Title"
# Required env: at least one of SLACK_BOT_TOKEN+SLACK_USER_ID, TELEGRAM_BOT_TOKEN+TELEGRAM_CHAT_ID
# Optional env: NOTIFY_DESKTOP=true
# Optional env: TELEGRAM_MAX_CHARS (default 3900), SLACK_MAX_CHARS (default 3500), DESKTOP_MAX_CHARS (default 250)

TITLE="${1:-Claude Code}"
MESSAGE=$(cat)

if [ -z "$MESSAGE" ]; then
  exit 0
fi

# Configurable platform limits (SP2)
TELEGRAM_MAX_CHARS="${TELEGRAM_MAX_CHARS:-3900}"
SLACK_MAX_CHARS="${SLACK_MAX_CHARS:-3500}"
DESKTOP_MAX_CHARS="${DESKTOP_MAX_CHARS:-250}"

# truncate_msg <text> <max_chars>
# Returns text truncated to max_chars with "... [truncated]" suffix if needed.
truncate_msg() {
  local text="$1"
  local max="$2"
  local suffix="... [truncated]"
  if [ "${#text}" -gt "$max" ]; then
    local keep=$(( max - ${#suffix} ))
    printf '%s%s' "${text:0:$keep}" "$suffix"
  else
    printf '%s' "$text"
  fi
}

# Failure log helper
# log_failure <channel> <details>
log_failure() {
  local channel="$1"
  local details="$2"
  mkdir -p "$HOME/.claude"
  printf '%s %s_FAIL: %s\n' \
    "$(date '+%Y-%m-%d %H:%M:%S')" \
    "$channel" \
    "$details" \
    >> "$HOME/.claude/notification-failures.log"
}

# Slack (Bot API — DM to user)
if [ -n "$SLACK_BOT_TOKEN" ] && [ -n "$SLACK_USER_ID" ]; then
  RAW_TEXT="*${TITLE}*\n${MESSAGE}"
  TEXT=$(truncate_msg "$RAW_TEXT" "$SLACK_MAX_CHARS")
  PAYLOAD=$(jq -n \
    --arg channel "$SLACK_USER_ID" \
    --arg text "$TEXT" \
    '{channel: $channel, text: $text}')
  (
    RESPONSE=$(curl -s -X POST "https://slack.com/api/chat.postMessage" \
      -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
      -H 'Content-Type: application/json' \
      -d "$PAYLOAD")
    if printf '%s' "$RESPONSE" | grep -q '"ok":false'; then
      log_failure "SLACK" "$RESPONSE"
    fi
  ) &
fi

# Telegram
if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  RAW_TEXT=$(printf "<b>%s</b>\n%s" "$TITLE" "$MESSAGE")
  TEXT=$(truncate_msg "$RAW_TEXT" "$TELEGRAM_MAX_CHARS")
  (
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
      "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d chat_id="$TELEGRAM_CHAT_ID" \
      --data-urlencode text="$TEXT" \
      -d parse_mode="HTML")
    if [ "$HTTP_CODE" != "200" ]; then
      log_failure "TELEGRAM" "HTTP $HTTP_CODE"
    fi
  ) &
fi

# Desktop
if [ "$NOTIFY_DESKTOP" = "true" ]; then
  case "$(uname -s)" in
    Linux*)
      DESK_MSG=$(truncate_msg "$MESSAGE" "$DESKTOP_MAX_CHARS")
      notify-send "$TITLE" "$DESK_MSG" 2>/dev/null &
      ;;
    Darwin*)
      DESK_MSG=$(truncate_msg "$MESSAGE" "$DESKTOP_MAX_CHARS")
      osascript -e "display notification \"$DESK_MSG\" with title \"$TITLE\"" 2>/dev/null &
      ;;
  esac
fi

wait
exit 0
