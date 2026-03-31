#!/bin/bash
# SessionStart hook — extracts session metadata and exports to environment.
# Reads JSON from stdin, writes env vars to $CLAUDE_ENV_FILE.

# Read stdin JSON
input=$(cat)

# Extract fields — prefer jq, fall back to python3
if command -v jq &>/dev/null; then
  session_id=$(echo "$input" | jq -r '.session_id // empty')
  transcript_path=$(echo "$input" | jq -r '.transcript_path // empty')
  model=$(echo "$input" | jq -r '.model // empty')
  source=$(echo "$input" | jq -r '.source // empty')
elif command -v python3 &>/dev/null; then
  session_id=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('session_id',''))")
  transcript_path=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('transcript_path',''))")
  model=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('model',''))")
  source=$(echo "$input" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('source',''))")
else
  # No JSON parser available — exit silently
  exit 0
fi

# Write to CLAUDE_ENV_FILE if set
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo "export CLAUDE_SESSION_ID=$session_id" >> "$CLAUDE_ENV_FILE"
  echo "export CLAUDE_TRANSCRIPT_PATH=$transcript_path" >> "$CLAUDE_ENV_FILE"
  echo "export CLAUDE_MODEL=$model" >> "$CLAUDE_ENV_FILE"
  echo "export CLAUDE_SESSION_SOURCE=$source" >> "$CLAUDE_ENV_FILE"
  echo "export CLAUDE_PROJECT_DIR=$CLAUDE_PROJECT_DIR" >> "$CLAUDE_ENV_FILE"
fi

exit 0
