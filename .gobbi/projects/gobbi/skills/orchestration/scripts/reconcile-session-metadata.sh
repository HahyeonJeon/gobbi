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
usage: reconcile-session-metadata.sh [--codex-stdout <f>] [--codex-rollout <f>] \
                                     <session.json> <main-transcript>
  Reconciles agents[].tokensUsed + usage from the live transcripts. Idempotent.
  Re-keys any toolu_-prefixed agents[] entry to its real agentId (manual backfill).
  --codex-stdout <f>  : a `codex exec` stdout capture; parses the `tokens used\n<N>`
                        line (commas stripped) into usage.codex.total.
  --codex-rollout <f> : a codex rollout-*.jsonl; fallback source — uses the LAST
                        token_count event's payload.info.total_token_usage.total_tokens.
  When both are given, --codex-stdout wins; rollout is the fallback.
EOF
}

[ "${1:-}" = "-h" ] || [ "${1:-}" = "--help" ] && { usage; exit 0; }

codex_stdout=""
codex_rollout=""
positional=()
while [ "$#" -gt 0 ]; do
    case "$1" in
        --codex-stdout)  codex_stdout="${2:-}"; shift 2 || die "missing value for --codex-stdout" ;;
        --codex-rollout) codex_rollout="${2:-}"; shift 2 || die "missing value for --codex-rollout" ;;
        --) shift; while [ "$#" -gt 0 ]; do positional+=("$1"); shift; done ;;
        -*) usage; die "unknown option: $1" ;;
        *)  positional+=("$1"); shift ;;
    esac
done

session_json="${positional[0]:-}"
main_transcript="${positional[1]:-}"
[ -n "$session_json" ] && [ -n "$main_transcript" ] || { usage; die "missing args"; }
[ -f "$session_json" ]    || die "session.json not found: $session_json"
[ -f "$main_transcript" ] || die "main transcript not found: $main_transcript"

subagents_dir="${main_transcript%.jsonl}/subagents"
script_dir="$(cd "$(dirname "$0")" && pwd)"
unit="$script_dir/agent-token-usage.sh"
[ -x "$unit" ] || die "unit script not executable: $unit" 2

now="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# 1) Enumerate spawns from the main transcript.
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

# 2b) Build the tool_use_id -> agentId re-key map from the spawns. Used to
#     converge any stale toolu_-prefixed agents[] entry (seeded by an older hook)
#     onto its real agentId, so the upsert produces NO duplicate agentId rows.
rekey_map="$(jq -rc -s '
    map(select(.tool_use_id != null and .id != null) | { (.tool_use_id): .id })
    | add // {}
' <<<"$spawns")" || die "build rekey map failed" 3

# 3) Manager (agents[0]) tokensUsed from the main transcript (--main).
mgr_tok="$("$unit" --main "$main_transcript" 2>/dev/null)" || die "manager sum failed" 3

# 3b) Codex token capture. Primary: a `codex exec` stdout capture containing a
#     `tokens used\n<N>` line (N may carry thousands separators). Fallback: the
#     LAST token_count event in a codex rollout-*.jsonl
#     (.payload.info.total_token_usage.total_tokens).
codex_total=0
if [ -n "$codex_stdout" ] && [ -f "$codex_stdout" ]; then
    # Match the line after a line that is exactly "tokens used"; strip commas.
    _n="$(grep -A1 -iE '^[[:space:]]*tokens used[[:space:]]*$' "$codex_stdout" 2>/dev/null \
            | grep -m1 -E '[0-9]' | tr -d ', ' | grep -oE '[0-9]+' | head -n1 || true)"
    # Also accept an inline "tokens used: <N>" form as a secondary shape.
    if [ -z "$_n" ]; then
        _n="$(grep -m1 -iE 'tokens used[: ]+[0-9,]+' "$codex_stdout" 2>/dev/null \
                | grep -oE '[0-9,]+' | tail -n1 | tr -d ', ' || true)"
    fi
    [ -n "$_n" ] && codex_total="$_n"
fi
if [ "$codex_total" = "0" ] && [ -n "$codex_rollout" ] && [ -f "$codex_rollout" ]; then
    _r="$(jq -r '
        select((.payload.type? == "token_count")
               and (.payload.info.total_token_usage.total_tokens != null))
        | .payload.info.total_token_usage.total_tokens
    ' "$codex_rollout" 2>/dev/null | tail -n1 || true)"
    [ -n "$_r" ] && [ "$_r" != "null" ] && codex_total="$_r"
fi
# Guard: must be an integer; otherwise treat as 0.
case "$codex_total" in
    ''|*[!0-9]*) codex_total=0 ;;
esac

# 4) flock-serialized read-modify-write with atomic mv (mirrors post-tool-use-agents.sh).
lock_file="$session_json.lock"
tmp_file="$session_json.tmp.$$"
(
    flock -x 9 || die "flock failed on $lock_file" 3

    if ! jq \
        --argjson updates "$updates" \
        --argjson mgr "$mgr_tok" \
        --argjson rekey "$rekey_map" \
        --argjson codexTotal "$codex_total" \
        --arg now "$now" '
        # 0) Converge on agentId: re-key any toolu_-prefixed entry to its agentId
        #    via the rekey map. If an agentId entry already exists, fold the stale
        #    toolu_ entry into it (real fields win); else just rename the id.
        .agents = (
            (.agents // [])
            | map(.id = ( if (.id|type=="string") and (.id|startswith("toolu_")) and ($rekey[.id] != null)
                          then $rekey[.id] else .id end ))
        )
        # Collapse any duplicate ids the re-key produced. For each id, fold its
        # entries left-to-right keeping non-null fields (real entry wins over a
        # null-filled stale one); emit ids in first-seen order so positions hold.
        | .agents = (
            .agents as $rows
            | ( [ $rows[].id ] | reduce .[] as $i ([]; if any(.[]; . == $i) then . else . + [$i] end) ) as $order
            | [ $order[] as $id
                | ( reduce ($rows[] | select(.id == $id)) as $r ({};
                      . + ($r | with_entries(select(.value != null))) ) ) ]
          )
        # Upsert each update by id into agents[]; create if absent, else merge tokensUsed+transcriptPath.
        | reduce $updates[] as $u (.;
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
        # Refresh agents[0] (manager) tokensUsed from the main transcript.
        | (if (.agents | length) > 0
           then .agents[0].tokensUsed = $mgr
           else . end)
        # Recompute usage.
        | .usage.sessionTotal = ([ .agents[].tokensUsed.total // 0 ] | add)
        # Codex tokens (external system). Only total is known from stdout/rollout;
        # the breakdown stays 0 unless already populated. grandTotal spans systems.
        | .usage.codex = ({ input:0, output:0, cacheRead:0, cacheCreation:0, total:0 }
                          + (.usage.codex // {})
                          + { total: $codexTotal })
        | .usage.grandTotal = ((.usage.sessionTotal // 0) + (.usage.codex.total // 0))
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
