#!/bin/bash
# Hook: SubagentStop event — notify when a subagent finishes work.
# Useful for long-running delegated tasks.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
PROJECT=$(basename "$CWD")

echo "Subagent (${AGENT_TYPE}) finished in ${PROJECT}. Session \`${SESSION_ID:0:8}\`." | \
  bash "$SCRIPT_DIR/notify-send.sh" "Subagent Done"

exit 0
