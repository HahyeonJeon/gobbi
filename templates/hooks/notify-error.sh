#!/bin/bash
# Hook: StopFailure event — notify when an error ends the session.
# Matcher: rate_limit|authentication_failed|billing_error|server_error

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT=$(cat)

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
ERROR_TYPE=$(echo "$INPUT" | jq -r '.error_type // "unknown"')
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
PROJECT=$(basename "$CWD")

case "$ERROR_TYPE" in
  rate_limit)
    MSG="Rate limited. Session paused in ${PROJECT}."
    ;;
  authentication_failed)
    MSG="Authentication failed in ${PROJECT}. Check your API key."
    ;;
  billing_error)
    MSG="Billing error in ${PROJECT}. Check your account."
    ;;
  server_error)
    MSG="API server error in ${PROJECT}. Try again later."
    ;;
  max_output_tokens)
    MSG="Output token limit reached in ${PROJECT}."
    ;;
  *)
    MSG="Error (${ERROR_TYPE}) in ${PROJECT}."
    ;;
esac

echo "$MSG Session \`${SESSION_ID:0:8}\`." | \
  bash "$SCRIPT_DIR/notify-send.sh" "Error Alert"

exit 0
