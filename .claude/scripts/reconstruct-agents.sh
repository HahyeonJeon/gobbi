#!/usr/bin/env bash
# Verify-and-fix reconstructor for `session.json.agents[]`.
# Walks the session's transcript JSONL, finds every Task spawn, and upserts
# the corresponding agents[] entry. Idempotent: re-running on a converged
# session.json produces zero diff. Orphan-report-only: entries already in
# agents[] that have no transcript match are LISTED on stderr but never
# deleted or mutated.
#
# Design anchors (Bundle B Ideation, 2026-05-23):
#   D-3-2  verify-and-fix; upsert-by-id; idempotent; orphan-report-only.
#   D-3-3-resolver  resolver (i) `.gobbi/project.json` DORMANT;
#                   (ii) directory scan fallback (active).
#   D-3-4  metadata: `model` from `tool_input.model`; `step/phase/iter/sub-step`
#          from `tool_input.prompt` structured headers.
#   D-3-5  POSIX `flock -x` on session.json for the read-modify-write.
#   D-3-6  correlation key: `tool_use_id`; transcript carries `tool_use` line
#          and a subsequent `tool_result` line with `toolUseResult` payload.
#
# Usage:
#   reconstruct-agents.sh                       # auto-resolve from $PWD
#   reconstruct-agents.sh <session.json>        # explicit target
#   reconstruct-agents.sh <session.json> <transcript.jsonl>
#
# Exit code: 0 on success (including "nothing to do"); non-zero only on
# argument / IO errors before any write is attempted.

set -uo pipefail

LOG_TAG="reconstruct-agents.sh"

log()  { printf '%s: %s\n' "$LOG_TAG" "$*" >&2; }
die()  { log "$*"; exit 1; }

# ---------------------------------------------------------------------------
# Argument / resolver setup. Mirrors the hook's D-3-3-resolver so behavior is
# consistent across both entry points.
# ---------------------------------------------------------------------------
session_json="${1:-}"
transcript_path="${2:-}"

resolve_project_name() {
    local _cwd="$1"
    local pjson="$_cwd/.gobbi/project.json"
    if [[ -f "$pjson" ]]; then
        local _name
        _name=$(jq -r '.name // empty' "$pjson" 2>/dev/null || true)
        if [[ -n "$_name" ]]; then
            printf '%s' "$_name"
            return 0
        fi
    fi
    local projects_dir="$_cwd/.gobbi/projects"
    [[ -d "$projects_dir" ]] || { log "resolver: $projects_dir absent"; return 1; }
    local dirs=()
    local d
    for d in "$projects_dir"/*/; do
        [[ -d "$d" ]] && dirs+=("$d")
    done
    local n=${#dirs[@]}
    if [[ $n -ne 1 ]]; then
        log "session-dir resolver: cannot disambiguate project name (n=$n)"
        return 1
    fi
    basename "${dirs[0]}"
}

if [[ -z "$session_json" ]]; then
    cwd="$(pwd)"
    project_name=$(resolve_project_name "$cwd") \
        || die "no session.json argument and project resolver failed"
    # Pick newest session dir as the default target.
    sessions_dir="$cwd/.gobbi/projects/$project_name/sessions"
    [[ -d "$sessions_dir" ]] || die "$sessions_dir absent"
    latest=$(ls -1d "$sessions_dir"/*/ 2>/dev/null | sort | tail -n1)
    [[ -n "$latest" ]] || die "no session dirs under $sessions_dir"
    session_json="${latest%/}/session.json"
fi

[[ -f "$session_json" ]] || die "session.json not found: $session_json"

# Resolve transcriptPath from session.json when not given on argv.
if [[ -z "$transcript_path" ]]; then
    transcript_path=$(jq -r '.transcriptPath // ""' "$session_json")
    # session.json stores ~-form; expand $HOME prefix.
    if [[ "$transcript_path" == "~/"* ]]; then
        transcript_path="${HOME}/${transcript_path#\~/}"
    fi
fi

if [[ -z "$transcript_path" || ! -f "$transcript_path" ]]; then
    log "transcript not found ($transcript_path); nothing to reconcile"
    exit 0
fi

# ---------------------------------------------------------------------------
# Walk the transcript: collect (tool_use_id, tool_input, toolUseResult) tuples
# for every Task spawn. The transcript stores the tool_use input line and a
# later message containing `toolUseResult` with the result-side telemetry.
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Build the desired agents[] payload in a single jq pass over the transcript.
# Done in-jq (not in bash) because:
#   - per-line bash invocations of jq are slow for ~50+ Task spawns;
#   - argv is bounded — passing a megabyte-scale results_map via --argjson
#     overflows ARG_MAX.
# Output is written to a temp file consumed via --slurpfile below.
# ---------------------------------------------------------------------------
desired_file="$(mktemp -t reconstruct-agents.desired.XXXXXX.json)"
trap 'rm -f "$desired_file"' EXIT

if ! jq -s --arg manager_type "manager" '
    # All transcript lines slurped into an array .
    # Tier-A: extract Task / Agent tool_use lines.
    (map(.message.content[]?
         | select(.type == "tool_use" and (.name == "Task" or .name == "Agent"))
         | { id: .id, input: (.input // {}) }
        )) as $tool_uses
    # Tier-B: build a map of tool_use_id -> toolUseResult (last write wins).
    | (map(select(.toolUseResult != null)
           | { tuid: (.message.content[]?.tool_use_id // null),
               result: .toolUseResult }
           | select(.tuid != null))
        | (reduce .[] as $x ({}; .[$x.tuid] = $x.result))) as $rmap
    # Compose each desired agents[] entry.
    | $tool_uses
    | map(
        . as $tu
        | ($rmap[$tu.id] // null)                      as $r
        | (($tu.input.prompt // ""))                   as $prompt
        | (($tu.input.model // ""))                    as $model
        | (($tu.input.subagent_type // ""))            as $sub_type
        | (($r.agentId   // null))                     as $aid
        | (($r.agentType // $sub_type // null))        as $atype
        | (($r.usage     // {}))                       as $usage
        # Header extraction in pure jq — capture line content after the colon.
        | def header($key):
            ($prompt | capture("(?im)^Your[[:space:]]+" + $key
                               + ":[[:space:]]+(?<v>.+)$") // null)
            | if . == null then null
              else .v | gsub("[[:space:]]+$"; "") | .[0:200]
              end;
        {
            id:          ($aid // $tu.id),
            tool_use_id: $tu.id,
            name:        ($atype // null),
            type:        ($atype // null),
            step:        header("step"),
            phase:       header("phase"),
            iter:        header("iteration"),
            sub_step:    header("sub-step"),
            system:      header("system"),
            model:       (if $model == "" then null else $model end),
            status:      (if $r == null then "unknown" else "ok" end),
            transcriptPath: null,
            tokensUsed: {
              input:         ($usage.input_tokens                // 0),
              output:        ($usage.output_tokens               // 0),
              cacheRead:     ($usage.cache_read_input_tokens     // 0),
              cacheCreation: ($usage.cache_creation_input_tokens // 0)
            },
            totalDurationMs: ($r.totalDurationMs // null)
        })
' "$transcript_path" > "$desired_file" 2>/dev/null; then
    die "jq pipeline over transcript failed"
fi

desired_count=$(jq 'length' "$desired_file")
log "transcript reconciled: $desired_count subagent-spawn entries"

# ---------------------------------------------------------------------------
# Orphan report (read-only): list existing agents[] entries (excluding the
# manager seed) whose id is NOT present in the desired set. NEVER mutate.
# ---------------------------------------------------------------------------
orphans=$(jq -r --slurpfile desired "$desired_file" '
    ($desired[0] | map(.id)) as $known
    | (.agents // [])
    | map(select(.type != "manager"))
    | map(select((.id // empty) as $id | ($known | index($id)) == null))
    | .[]?.id // empty
' "$session_json")

if [[ -n "$orphans" ]]; then
    log "ORPHAN agents[] entries (not deleted; informational only):"
    while IFS= read -r oid; do
        [[ -n "$oid" ]] && log "  orphan id=$oid"
    done <<<"$orphans"
fi

# ---------------------------------------------------------------------------
# D-3-5 — flock-serialized read-modify-write with atomic mv.
# Upsert each desired entry by id. Preserve manager + orphans untouched.
# First-write-wins for `startedAt` per id; last-write-wins otherwise.
# Idempotency: when the file already converged, jq output equals input.
# ---------------------------------------------------------------------------
lock_file="$session_json.lock"
tmp_file="$session_json.tmp.$$"
now_iso=$(date -u +%Y-%m-%dT%H:%M:%SZ)

(
    flock -x 9 || { log "flock failed on $lock_file"; exit 1; }

    if ! jq --slurpfile desired_arr "$desired_file" --arg now "$now_iso" '
        ($desired_arr[0]) as $desired
        | . as $root
        | (.agents // []) as $existing
        | reduce $desired[] as $new ($existing;
            (map(.id) | index($new.id)) as $idx
            | if $idx == null
              then . + [ $new + { startedAt: $now, finishedAt: $now } ]
              else .[$idx] as $cur
                   | ($cur.startedAt // $now) as $kept_started
                   | .[0:$idx]
                     + [ $cur + $new + { startedAt: $kept_started,
                                         finishedAt: ($cur.finishedAt // $now) } ]
                     + .[$idx+1:]
              end
          )
        | . as $merged
        | $root | .agents = $merged
    ' "$session_json" > "$tmp_file"; then
        log "jq reconcile failed"
        rm -f "$tmp_file"
        exit 1
    fi

    if ! jq -e . "$tmp_file" >/dev/null 2>&1; then
        log "tmp file failed JSON validation"
        rm -f "$tmp_file"
        exit 1
    fi

    # Idempotency-friendly: only mv if content actually changed.
    if cmp -s "$tmp_file" "$session_json"; then
        rm -f "$tmp_file"
        log "no changes (already converged)"
    else
        mv -f "$tmp_file" "$session_json"
        log "session.json updated"
    fi
) 9>"$lock_file"

exit 0
