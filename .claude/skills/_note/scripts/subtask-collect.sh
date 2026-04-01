#!/bin/bash
# Extracts subagent delegation prompt and final result from Claude Code JSONL transcripts.
# Usage: bash subtask-collect.sh <agent-id> <subtask-number> <subtask-slug> <note-dir-path>

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

# Extract fields from transcript files
first_line=$(head -1 "$jsonl_file")
last_line=$(tail -1 "$jsonl_file")

# Write output JSON using jq for safe construction
output_file="${subtasks_dir}/${subtask_number}-${subtask_slug}.json"

jq -n \
  --arg agentId "$agent_id" \
  --arg agentType "$(jq -r '.agentType' "$meta_file")" \
  --arg description "$(jq -r '.description' "$meta_file")" \
  --arg timestamp "$(echo "$first_line" | jq -r '.timestamp')" \
  --arg model "$(echo "$last_line" | jq -r '.message.model')" \
  --arg delegationPrompt "$(echo "$first_line" | jq -r '.message.content')" \
  --arg finalResult "$(echo "$last_line" | jq -r '.message.content[0].text')" \
  '{
    agentId: $agentId,
    agentType: $agentType,
    description: $description,
    timestamp: $timestamp,
    model: $model,
    delegationPrompt: $delegationPrompt,
    finalResult: $finalResult
  }' > "$output_file"

# Output absolute path of the written file
echo "$(cd "$(dirname "$output_file")" && pwd)/$(basename "$output_file")"
