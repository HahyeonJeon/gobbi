#!/bin/bash
# Extracts subagent delegation prompt and final result from Claude Code JSONL transcripts.
# Usage: bash subtask-collect.sh <agent-id> <subtask-number> <subtask-slug> <note-dir-path>
#
# The agent-id is returned in the Agent tool result after the subagent completes:
#   agentId: a74edda5b7f076239 (use SendMessage with to: 'a74edda5b7f076239' to continue this agent)
# The orchestrator extracts this ID from the tool result and passes it as the first argument.

set -e

if [ $# -ne 4 ]; then
  echo "Usage: $0 <agent-id> <subtask-number> <subtask-slug> <note-dir-path>" >&2
  echo "  agent-id:        Agent ID without 'agent-' prefix (e.g., a9dc37447d97115d3)" >&2
  echo "  subtask-number:  Zero-padded two-digit number (e.g., 01, 02)" >&2
  echo "  subtask-slug:    Hyphenated slug (e.g., skill-md)" >&2
  echo "  note-dir-path:   Absolute path to the note directory" >&2
  exit 1
fi

agent_id="$1"
subtask_number="$2"
subtask_slug="$3"
note_dir="$4"

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

# Derive paths to transcript files
subagent_dir="$(dirname "$CLAUDE_TRANSCRIPT_PATH")/$CLAUDE_SESSION_ID/subagents"
meta_file="${subagent_dir}/agent-${agent_id}.meta.json"
jsonl_file="${subagent_dir}/agent-${agent_id}.jsonl"

# Validate transcript files exist
if [ ! -f "$meta_file" ]; then
  echo "Error: Meta file not found: ${meta_file}" >&2
  exit 1
fi

if [ ! -f "$jsonl_file" ]; then
  echo "Error: JSONL file not found: ${jsonl_file}" >&2
  exit 1
fi

# Validate subtasks directory exists
subtasks_dir="${note_dir}/subtasks"
if [ ! -d "$subtasks_dir" ]; then
  echo "Error: subtasks/ directory not found: ${subtasks_dir}" >&2
  exit 1
fi

# Extract task metadata from note directory name
# Format: {YYYYMMDD-HHMM}-{slug}-{session_id}
note_basename=$(basename "$note_dir")
task_datetime="${note_basename:0:13}"
task_slug="${note_basename:14}"
task_slug="${task_slug%-"$CLAUDE_SESSION_ID"}"

# Extract fields from transcript files
first_line=$(head -1 "$jsonl_file")
last_line=$(tail -1 "$jsonl_file")

# Sum token usage across all assistant messages in the transcript
usage=$(cat "$jsonl_file" | jq -s '[.[] | select(.message.usage) | .message.usage] | {
  input_tokens: (map(.input_tokens) | add),
  output_tokens: (map(.output_tokens) | add),
  cache_creation_input_tokens: (map(.cache_creation_input_tokens) | add),
  cache_read_input_tokens: (map(.cache_read_input_tokens) | add)
}')

# Write output JSON using jq for safe construction
output_file="${subtasks_dir}/${subtask_number}-${subtask_slug}.json"

jq -n \
  --arg sessionId "$CLAUDE_SESSION_ID" \
  --arg taskDatetime "$task_datetime" \
  --arg taskSlug "$task_slug" \
  --arg agentId "$agent_id" \
  --arg agentType "$(jq -r '.agentType' "$meta_file")" \
  --arg description "$(jq -r '.description' "$meta_file")" \
  --arg timestamp "$(echo "$first_line" | jq -r '.timestamp')" \
  --arg model "$(echo "$last_line" | jq -r '.message.model')" \
  --arg delegationPrompt "$(echo "$first_line" | jq -r '.message.content | if type == "string" then . else (map(select(.type == "text")) | .[0].text // "") end')" \
  --arg finalResult "$(echo "$last_line" | jq -r '.message.content | if type == "string" then . else (map(select(.type == "text")) | .[0].text // "") end')" \
  --argjson usage "$usage" \
  '{
    sessionId: $sessionId,
    taskDatetime: $taskDatetime,
    taskSlug: $taskSlug,
    agentId: $agentId,
    agentType: $agentType,
    description: $description,
    timestamp: $timestamp,
    model: $model,
    usage: $usage,
    delegationPrompt: $delegationPrompt,
    finalResult: $finalResult
  }' > "$output_file"

# Validate extraction produced non-empty values for key fields
final_result_value=$(jq -r '.finalResult' "$output_file")
if [ -z "$final_result_value" ] || [ "$final_result_value" = "null" ]; then
  echo "Warning: finalResult is empty or null for agent ${agent_id}" >&2
fi

# Output absolute path of the written file
echo "$(cd "$(dirname "$output_file")" && pwd)/$(basename "$output_file")"
