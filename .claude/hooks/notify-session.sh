#!/bin/bash
# Hook: SessionStart/SessionEnd events — notify on session lifecycle.
# SessionStart matcher: startup|resume
# SessionEnd matcher: logout|prompt_input_exit

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
PROJECT=$(basename "$CWD")

case "$EVENT" in
  SessionStart)
    SOURCE=$(echo "$INPUT" | jq -r '.source // "unknown"')
    echo "Session started (${SOURCE}) in ${PROJECT}. Session \`${SESSION_ID:0:8}\`." | \
      bash "$SCRIPT_DIR/notify-send.sh" "Session Started"
    ;;
  SessionEnd)
    echo "Session ended in ${PROJECT}. Session \`${SESSION_ID:0:8}\`." | \
      bash "$SCRIPT_DIR/notify-send.sh" "Session Ended"
    ;;
esac

exit 0
