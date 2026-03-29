#!/bin/bash
# Hook: Stop event — notify when Claude finishes responding.
# Prevents infinite loop by checking stop_hook_active.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT=$(cat)

# Prevent infinite loop
STOP_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
if [ "$STOP_ACTIVE" = "true" ]; then
  exit 0
fi

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
PROJECT=$(basename "$CWD")

echo "Session \`${SESSION_ID:0:8}\` finished in ${PROJECT}." | \
  bash "$SCRIPT_DIR/notify-send.sh" "Task Complete"

exit 0
