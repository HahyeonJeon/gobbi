#!/bin/bash
# Extracts plan content from the session transcript's ExitPlanMode tool_use.
# Usage: bash write-plan.sh <note-dir-path>
#
# The plan is captured in the ExitPlanMode tool_use block within the main session
# transcript at $CLAUDE_TRANSCRIPT_PATH. If the orchestrator called ExitPlanMode
# multiple times (plan revisions), the last one is used.

set -e

if [ $# -ne 1 ]; then
  echo "Usage: $0 <note-dir-path>" >&2
  echo "  note-dir-path:   Absolute path to the note directory" >&2
  exit 1
fi

note_dir="$1"

# Validate environment variables
if [ -z "$CLAUDE_SESSION_ID" ]; then
  echo "Error: CLAUDE_SESSION_ID is not set." >&2
  exit 1
fi

if [ -z "$CLAUDE_TRANSCRIPT_PATH" ]; then
  echo "Error: CLAUDE_TRANSCRIPT_PATH is not set." >&2
  exit 1
fi

# Validate jq is available
if ! command -v jq &>/dev/null; then
  echo "Error: jq is required but not found in PATH." >&2
  exit 1
fi

# Validate transcript file exists
if [ ! -f "$CLAUDE_TRANSCRIPT_PATH" ]; then
  echo "Error: Transcript file not found: ${CLAUDE_TRANSCRIPT_PATH}" >&2
  exit 1
fi

# Validate note directory exists
if [ ! -d "$note_dir" ]; then
  echo "Error: Note directory not found: ${note_dir}" >&2
  exit 1
fi

# Extract task metadata from note directory name
# Format: {YYYYMMDD-HHMM}-{slug}-{session_id}
note_basename=$(basename "$note_dir")
task_datetime="${note_basename:0:13}"
task_slug="${note_basename:14}"
task_slug="${task_slug%-"$CLAUDE_SESSION_ID"}"

# Extract the last ExitPlanMode tool_use from the session transcript.
# Uses python3 because jq cannot search across JSONL lines for a specific tool_use name
# nested inside a content array.
plan_data=$(python3 -c "
import json, sys

plan = None
plan_file_path = None
timestamp = None

with open(sys.argv[1]) as f:
    for line in f:
        obj = json.loads(line)
        msg = obj.get('message', {})
        content = msg.get('content', [])
        if isinstance(content, list):
            for block in content:
                if isinstance(block, dict) and block.get('type') == 'tool_use' and block.get('name') == 'ExitPlanMode':
                    inp = block.get('input', {})
                    plan = inp.get('plan', '')
                    plan_file_path = inp.get('planFilePath', '')
                    timestamp = obj.get('timestamp', '')

if plan is None:
    sys.exit(1)

# Output as JSON for safe handling of special characters
json.dump({
    'plan': plan,
    'planFilePath': plan_file_path,
    'timestamp': timestamp
}, sys.stdout)
" "$CLAUDE_TRANSCRIPT_PATH" 2>/dev/null) || {
  echo "Error: No ExitPlanMode found in transcript" >&2
  exit 1
}

# Sum token usage across all assistant messages in the main session transcript
usage=$(cat "$CLAUDE_TRANSCRIPT_PATH" | jq -s '[.[] | select(.message.usage) | .message.usage] | {
  input_tokens: (map(.input_tokens) | add),
  output_tokens: (map(.output_tokens) | add),
  cache_creation_input_tokens: (map(.cache_creation_input_tokens) | add),
  cache_read_input_tokens: (map(.cache_read_input_tokens) | add)
}')

# Write output JSON using jq for safe construction
output_file="${note_dir}/plan.json"

echo "$plan_data" | jq \
  --arg sessionId "$CLAUDE_SESSION_ID" \
  --arg taskDatetime "$task_datetime" \
  --arg taskSlug "$task_slug" \
  --argjson usage "$usage" \
  '{
    sessionId: $sessionId,
    taskDatetime: $taskDatetime,
    taskSlug: $taskSlug,
    timestamp: .timestamp,
    planFilePath: .planFilePath,
    usage: $usage,
    plan: .plan
  }' > "$output_file"

# Validate extraction
plan_value=$(jq -r '.plan' "$output_file")
if [ -z "$plan_value" ] || [ "$plan_value" = "null" ]; then
  echo "Warning: plan content is empty or null" >&2
fi

# Output absolute path of the written file
echo "$(cd "$(dirname "$output_file")" && pwd)/$(basename "$output_file")"
