#!/bin/bash
# SessionStart hook — loads notification credentials into the session.
# Reads from a local .env file (gitignored) and writes to $CLAUDE_ENV_FILE.

ENV_FILE="$CLAUDE_PROJECT_DIR/.claude/.env"

if [ -n "$CLAUDE_ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
  while IFS= read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    echo "export $line" >> "$CLAUDE_ENV_FILE"
  done < "$ENV_FILE"
fi

exit 0
