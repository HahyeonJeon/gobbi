#!/bin/bash
# Outputs session metadata as key=value pairs on stdout.
# Requires CLAUDE_SESSION_ID to be set by the session-metadata hook.

if [ -z "$CLAUDE_SESSION_ID" ]; then
  echo "Error: CLAUDE_SESSION_ID not set. Is the session-metadata hook configured?" >&2
  exit 1
fi

session_id="$CLAUDE_SESSION_ID"
datetime=$(date +%Y%m%d-%H%M)
git_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
cwd=$(pwd)
claude_model="$CLAUDE_MODEL"
transcript_path="$CLAUDE_TRANSCRIPT_PATH"

echo "session_id=$session_id"
echo "datetime=$datetime"
echo "git_branch=$git_branch"
echo "cwd=$cwd"
echo "claude_model=$claude_model"
echo "transcript_path=$transcript_path"
