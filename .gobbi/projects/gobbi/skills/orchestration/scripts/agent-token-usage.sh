#!/usr/bin/env bash
# agent-token-usage.sh — cumulative token usage for ONE agent transcript.
#
# Purpose:
#   Sum an agent's per-turn token usage across its OWN transcript and print the
#   {input, output, cacheRead, cacheCreation, total} object that becomes an
#   `agents[].tokensUsed` entry in session.json. This is the source-of-truth
#   fetch (orchestration/SKILL.md § Recording workflow metadata, fetch (b)/(c)).
#
# Args:
#   $1  <agent-transcript-path>  Path to the transcript .jsonl to sum.
#                                 - Subagent: ${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl
#                                 - Manager:  the main transcript $CLAUDE_TRANSCRIPT_PATH (pass --main)
#   --main                       Also filter `.isSidechain == false`. Use ONLY for the
#                                 main transcript, where subagent sidechain turns are interleaved
#                                 with the manager's own turns. Omit for a subagent file
#                                 (a subagent transcript holds only that agent's turns).
#
# Output (stdout): one JSON object, e.g.
#   {"input":4954,"output":26469,"cacheRead":6867697,"cacheCreation":241592,"total":7140712}
#
# Example:
#   ./agent-token-usage.sh "${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-a7363717821bc156d.jsonl"
#   ./agent-token-usage.sh --main "$CLAUDE_TRANSCRIPT_PATH"
#
# Exit: 0 on success; 2 on bad args / missing file (message to stderr).

set -uo pipefail

usage() {
    cat >&2 <<'EOF'
usage: agent-token-usage.sh [--main] <agent-transcript-path>
  Prints cumulative {input,output,cacheRead,cacheCreation,total} for one transcript.
  --main : also filter `.isSidechain == false` (use for the main/manager transcript).
EOF
}

main_filter=""
transcript=""
for arg in "$@"; do
    case "$arg" in
        --main) main_filter=" and .isSidechain == false" ;;
        -h|--help) usage; exit 0 ;;
        -*) printf 'agent-token-usage.sh: unknown option: %s\n' "$arg" >&2; usage; exit 2 ;;
        *) transcript="$arg" ;;
    esac
done

[ -n "$transcript" ] || { printf 'agent-token-usage.sh: missing <agent-transcript-path>\n' >&2; usage; exit 2; }
[ -f "$transcript" ] || { printf 'agent-token-usage.sh: transcript not found: %s\n' "$transcript" >&2; exit 2; }

# Real pipeline. The --main flag selects whether to constrain to isSidechain==false.
if [ -n "$main_filter" ]; then
    jq -s '[ .[] | select(.type == "assistant" and .isSidechain == false) | .message.usage ]
      | { input:         (map(.input_tokens                // 0) | add),
          output:        (map(.output_tokens               // 0) | add),
          cacheRead:     (map(.cache_read_input_tokens      // 0) | add),
          cacheCreation: (map(.cache_creation_input_tokens  // 0) | add) }
      | . + { total: (.input + .output + .cacheRead + .cacheCreation) }
    ' "$transcript"
else
    jq -s '[ .[] | select(.type == "assistant") | .message.usage ]
      | { input:         (map(.input_tokens                // 0) | add),
          output:        (map(.output_tokens               // 0) | add),
          cacheRead:     (map(.cache_read_input_tokens      // 0) | add),
          cacheCreation: (map(.cache_creation_input_tokens  // 0) | add) }
      | . + { total: (.input + .output + .cacheRead + .cacheCreation) }
    ' "$transcript"
fi
