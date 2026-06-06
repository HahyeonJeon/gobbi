#!/usr/bin/env bash
# reconcile-session-metadata.sh — bulk-reconcile agents[] + usage in session.json.
#
# Purpose:
#   The MEMORIZATION / Wrap-up safety net (orchestration/SKILL.md § Recording workflow
#   metadata, "bulk reconcile" row). Enumerates every spawn from the main transcript,
#   computes each agent's cumulative tokensUsed from its OWN transcript, computes the
#   manager's tokensUsed from the main transcript, upserts every agents[] entry by `id`
#   (idempotent, last-write-wins), recomputes usage.sessionTotal + usage.computedAt,
#   and writes session.json back atomically under flock (mirrors post-tool-use-agents.sh).
#
# Args:
#   $1  <session.json>      Path to the session.json to update in place.
#   $2  <main-transcript>   The main/manager transcript .jsonl ($CLAUDE_TRANSCRIPT_PATH).
#
# Derived:
#   subagent transcripts live at ${main-transcript%.jsonl}/subagents/agent-<agentId>.jsonl
#
# Output (stderr): a one-line summary; (stdout) nothing on success.
# Exit: 0 on success; 2 on bad args / missing inputs; 3 on jq/write failure.
#
# Example:
#   ./reconcile-session-metadata.sh \
#       .gobbi/projects/gobbi/sessions/2026-06-05-06668274-.../session.json \
#       "$CLAUDE_TRANSCRIPT_PATH"

set -uo pipefail

SELF="reconcile-session-metadata.sh"
log()  { printf '%s: %s\n' "$SELF" "$*" >&2; }
die()  { log "$*"; exit "${2:-2}"; }

usage() {
    cat >&2 <<'EOF'
usage: reconcile-session-metadata.sh <session.json> <main-transcript>
  Reconciles agents[].tokensUsed + usage from the live transcripts. Idempotent.
EOF
}

[ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ] && { usage; exit 0; }
session_json="${1:-}"
main_transcript="${2:-}"
[ -n "$session_json" ] && [ -n "$main_transcript" ] || { usage; die "missing args"; }
[ -f "$session_json" ]    || die "session.json not found: $session_json"
[ -f "$main_transcript" ] || die "main transcript not found: $main_transcript"

subagents_dir="${main_transcript%.jsonl}/subagents"
script_dir="$(cd "$(dirname "$0")" && pwd)"
unit="$script_dir/agent-token-usage.sh"
[ -x "$unit" ] || die "unit script not executable: $unit" 2

now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# 1) Enumerate spawns from the main transcript (fetch (a), bulk variant).
#    De-dup by id (last line wins per id is fine; we only need identity/role here).
spawns="$(jq -rc '
    select((.toolUseResult | type == "object") and .toolUseResult.agentId != null)
    | { id: .toolUseResult.agentId, type: .toolUseResult.agentType,
        tool_use_id: (.message.content[0].tool_use_id // null) }
' "$main_transcript" 2>/dev/null | jq -rc -s 'unique_by(.id) | .[]')" || die "enumerate failed" 3

# 2) Build an updates array: one object per agent with id/type/transcriptPath/tokensUsed.
updates="[]"
while IFS= read -r spawn; do
    [ -n "$spawn" ] || continue
    aid="$(printf '%s' "$spawn" | jq -r '.id')"
    atype="$(printf '%s' "$spawn" | jq -r '.type // empty')"
    atrans="$subagents_dir/agent-${aid}.jsonl"
    if [ -f "$atrans" ]; then
        tok="$("$unit" "$atrans" 2>/dev/null)" || { log "unit failed for $aid (skipped)"; continue; }
    else
        log "subagent transcript absent for $aid (skipped): $atrans"
        continue
    fi
    updates="$(jq -c --arg id "$aid" --arg type "$atype" --arg tp "$atrans" \
        --argjson tok "$tok" '. + [{ id:$id, type:$type, transcriptPath:$tp, tokensUsed:$tok }]' \
        <<<"$updates")" || die "build updates failed" 3
done <<<"$spawns"

# 3) Manager (agents[0]) tokensUsed from the main transcript (fetch (c)).
mgr_tok="$("$unit" --main "$main_transcript" 2>/dev/null)" || die "manager sum failed" 3

# 4) flock-serialized read-modify-write with atomic mv (mirrors post-tool-use-agents.sh).
lock_file="$session_json.lock"
tmp_file="$session_json.tmp.$$"
(
    flock -x 9 || die "flock failed on $lock_file" 3

    if ! jq \
        --argjson updates "$updates" \
        --argjson mgr "$mgr_tok" \
        --arg now "$now" '
        # Upsert each update by id into agents[]; create if absent, else merge tokensUsed+transcriptPath.
        reduce $updates[] as $u (.;
            .agents = (
                (.agents // [])
                | (map(.id) | index($u.id)) as $idx
                | if $idx == null
                  then . + [ { id:$u.id, name:null, type:$u.type, step:null, phase:null,
                               iter:null, sub_step:null, model:null, system:null,
                               transcriptPath:$u.transcriptPath, status:null,
                               tokensUsed:$u.tokensUsed, startedAt:null, finishedAt:null } ]
                  else .[0:$idx]
                       + [ .[$idx] + { transcriptPath:$u.transcriptPath, tokensUsed:$u.tokensUsed } ]
                       + .[$idx+1:]
                  end
            )
        )
        # Refresh agents[0] (manager) tokensUsed from fetch (c).
        | (if (.agents | length) > 0
           then .agents[0].tokensUsed = $mgr
           else . end)
        # Recompute usage.
        | .usage.sessionTotal = ([ .agents[].tokensUsed.total // 0 ] | add)
        | .usage.computedAt   = $now
        ' "$session_json" > "$tmp_file"; then
        log "jq reconcile failed"; rm -f "$tmp_file"; exit 3
    fi

    jq -e . "$tmp_file" >/dev/null 2>&1 || { log "tmp file failed JSON validation"; rm -f "$tmp_file"; exit 3; }
    mv -f "$tmp_file" "$session_json"
) 9>"$lock_file"
rc=$?
[ "$rc" -eq 0 ] || exit "$rc"

log "reconciled $(jq '.agents | length' "$session_json") agents; sessionTotal=$(jq '.usage.sessionTotal' "$session_json")"
exit 0
