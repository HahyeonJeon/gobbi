#!/bin/bash
# SessionStart hook — loads notification credentials into the session.
# Reads from a local .env file (gitignored) and writes to $CLAUDE_ENV_FILE.

ENV_FILE="$CLAUDE_PROJECT_DIR/.claude/.env"

if [ -n "$CLAUDE_ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
  chmod 600 "$ENV_FILE" 2>/dev/null || true
  while IFS= read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
      echo "export $line" >> "$CLAUDE_ENV_FILE"
    else
      echo "load-notification-env: skipping malformed line: $line" >&2
    fi
  done < "$ENV_FILE"
fi

exit 0
