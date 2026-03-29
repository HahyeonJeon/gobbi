#!/bin/bash
# Hook: Notification event — notify when Claude needs user attention.
# Matcher: permission_prompt|idle_prompt|elicitation_dialog

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
NOTIFICATION_TYPE=$(echo "$INPUT" | jq -r '.notification_type // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
PROJECT=$(basename "$CWD")

case "$NOTIFICATION_TYPE" in
  permission_prompt)
    MSG="Waiting for permission approval in ${PROJECT}."
    ;;
  idle_prompt)
    MSG="Session idle — waiting for your input in ${PROJECT}."
    ;;
  elicitation_dialog)
    MSG="MCP server needs your input in ${PROJECT}."
    ;;
  *)
    MSG="Needs attention in ${PROJECT} (${NOTIFICATION_TYPE})."
    ;;
esac

echo "$MSG Session \`${SESSION_ID:0:8}\`." | \
  bash "$SCRIPT_DIR/notify-send.sh" "Attention Needed"

exit 0
