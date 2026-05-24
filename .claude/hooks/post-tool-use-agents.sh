#!/usr/bin/env bash
# PostToolUse / PostToolUseFailure hook for the Task tool.
# Upserts an entry in `session.json.agents[]` for every spawned subagent.
#
# Design anchors (Bundle B Ideation, 2026-05-23):
#   D-3-1  bash + jq stack, session-start.sh shape, two-tier extraction.
#   D-3-2  upsert-by-id (paired with T08 reconstructor).
#   D-3-3  single script handles BOTH PostToolUse and PostToolUseFailure.
#   D-3-3-resolver  session-dir resolver: (i) `.gobbi/project.json` DORMANT;
#                   (ii) directory scan fallback (active path).
#   D-3-4  metadata: `model` from `tool_input.model`; `step/phase/iter/sub-step`
#          from `tool_input.prompt` structured headers (`Your phase:` etc.).
#   D-3-5  POSIX `flock -x` on session.json for every read-modify-write.
#   D-3-6  correlation key: `tool_use_id`. Prefer `toolUseResult` from the
#          transcript JSONL; fall back to the documented `tool_result`.
#
# Stdin: Claude Code hook payload (JSON). Minimum fields used:
#   session_id, cwd, hook_event_name, transcript_path,
#   tool_name, tool_use_id, tool_input{...}, tool_result{...} (PostToolUse)
#   or error/stderr fields (PostToolUseFailure).
#
# Exit code: ALWAYS 0. A hook that blocks Claude is worse than a missed entry.
# Diagnostics (and bail conditions) go to stderr; the script never aborts the
# tool call.

set -uo pipefail

LOG_TAG="post-tool-use-agents.sh"

log() { printf '%s: %s\n' "$LOG_TAG" "$*" >&2; }
bail() { log "$*"; exit 0; }  # graceful: do not block Claude.

# ---------------------------------------------------------------------------
# Read stdin JSON payload.
# ---------------------------------------------------------------------------
payload="$(cat || true)"
[[ -n "$payload" ]] || bail "empty stdin — nothing to do"

# Defensive JSON parse — bail gracefully on garbage.
if ! printf '%s' "$payload" | jq -e . >/dev/null 2>&1; then
    bail "stdin is not valid JSON"
fi

tool_name=$(jq -r '.tool_name // ""'        <<<"$payload")
tool_use_id=$(jq -r '.tool_use_id // ""'    <<<"$payload")
hook_event=$(jq -r '.hook_event_name // ""' <<<"$payload")
session_id=$(jq -r '.session_id // ""'      <<<"$payload")
cwd=$(jq -r '.cwd // ""'                    <<<"$payload")
transcript_path=$(jq -r '.transcript_path // ""' <<<"$payload")

# Scope: only subagent-spawn tool fires. Claude Code presently surfaces the
# Task tool under tool_name "Agent" (empirically 2026-05-23 transcripts);
# the public docs and ideation refer to "Task". Accept both for forward and
# backward compatibility — other PostToolUse events are no-ops.
case "$tool_name" in
    Task|Agent) ;;
    *) exit 0 ;;
esac
[[ -n "$tool_use_id" ]]      || bail "missing tool_use_id"
[[ -n "$session_id" ]]       || bail "missing session_id"
[[ -n "$cwd" ]]              || bail "missing cwd"

# ---------------------------------------------------------------------------
# D-3-3-resolver — derive session.json path from (session_id, cwd).
# Step (i) DORMANT: read `.gobbi/project.json` if it exists (currently absent).
# Step (ii) ACTIVE: scan `.gobbi/projects/` for a single project directory.
# ---------------------------------------------------------------------------
resolve_project_name() {
    local _cwd="$1"
    # Step (i) — DORMANT. Honored when the file materializes.
    local pjson="$_cwd/.gobbi/project.json"
    if [[ -f "$pjson" ]]; then
        local _name
        _name=$(jq -r '.name // empty' "$pjson" 2>/dev/null || true)
        if [[ -n "$_name" ]]; then
            printf '%s' "$_name"
            return 0
        fi
    fi
    # Step (ii) — directory scan; require exactly one project.
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

resolve_session_dir() {
    local _cwd="$1" _project="$2" _sid="$3"
    local sessions_dir="$_cwd/.gobbi/projects/$_project/sessions"
    [[ -d "$sessions_dir" ]] || { log "resolver: $sessions_dir absent"; return 1; }
    local matches=()
    local d
    for d in "$sessions_dir"/*-"$_sid"; do
        [[ -d "$d" ]] && matches+=("$d")
    done
    local n=${#matches[@]}
    if [[ $n -ne 1 ]]; then
        log "session-dir resolver: cannot disambiguate session dir (n=$n)"
        return 1
    fi
    printf '%s' "${matches[0]}"
}

project_name=$(resolve_project_name "$cwd")       || bail "resolver failed (project)"
session_dir=$(resolve_session_dir "$cwd" "$project_name" "$session_id") \
    || bail "resolver failed (session dir)"
session_json="$session_dir/session.json"
[[ -f "$session_json" ]] || bail "session.json not found at $session_json"

# ---------------------------------------------------------------------------
# Extract input-side metadata (D-3-4).
#   model           ← tool_input.model
#   step / phase    ← tool_input.prompt structured headers
#   iter / sub-step ← tool_input.prompt structured headers
# Headers convention: `^Your (phase|iteration|sub-step|step): (.+)$`.
# ---------------------------------------------------------------------------
prompt_text=$(jq -r '.tool_input.prompt // ""' <<<"$payload")
model=$(jq -r       '.tool_input.model  // ""' <<<"$payload")
subagent_type=$(jq -r '.tool_input.subagent_type // ""' <<<"$payload")

extract_header() {
    # $1 = key (phase|iteration|step|sub-step). Match case-insensitively.
    local _key="$1"
    printf '%s\n' "$prompt_text" \
        | grep -m1 -iE "^Your[[:space:]]+${_key}:[[:space:]]+.+" \
        | sed -E "s/^Your[[:space:]]+${_key}:[[:space:]]+//I" \
        | head -c 200 || true
}

step=$(extract_header "step")
phase=$(extract_header "phase")
iter=$(extract_header "iteration")
sub_step=$(extract_header "sub-step")

# ---------------------------------------------------------------------------
# Two-tier extraction of result-side telemetry (D-3-1, D-3-6).
# Tier 1 (preferred): rich `toolUseResult` from the transcript JSONL,
#                     correlated by tool_use_id.
# Tier 2 (fallback): the documented `tool_result` already on stdin.
# Failure event has no useful result payload — synthesize a "failed" record.
# ---------------------------------------------------------------------------
tier1=""
if [[ -n "$transcript_path" && -f "$transcript_path" ]]; then
    # Last matching line wins (retries supersede earlier attempts).
    tier1=$(jq -c --arg tuid "$tool_use_id" '
        select(.toolUseResult != null)
        | select(
            (.message.content[]?.tool_use_id // empty) == $tuid
            or (.toolUseResult.agentId // empty) != null
              and ((.message.content[]?.tool_use_id // empty) == $tuid)
          )
    ' "$transcript_path" 2>/dev/null | tail -n1 || true)
fi

# Compose the upsert input JSON for the jq pipeline.
status="ok"
[[ "$hook_event" == "PostToolUseFailure" ]] && status="failed"

upsert_input=$(jq -n \
    --arg tuid     "$tool_use_id" \
    --arg model    "$model" \
    --arg step     "$step" \
    --arg phase    "$phase" \
    --arg iter     "$iter" \
    --arg sub_step "$sub_step" \
    --arg sub_type "$subagent_type" \
    --arg status   "$status" \
    --arg event    "$hook_event" \
    --argjson tier1 "${tier1:-null}" \
    --argjson tier2 "$(jq -c '.tool_result // null' <<<"$payload")" \
    '
    # Pick agentId/agentType/usage from tier1 (toolUseResult) when present;
    # fall back to tier2 (tool_result) shape; finally synthesize from tuid.
    ($tier1.toolUseResult // {})                       as $r1
    | ($tier2 // {})                                   as $r2
    | (($r1.agentId   // $r2.agentId   // null))       as $aid
    | (($r1.agentType // $r2.agentType // $sub_type))  as $atype
    | (($r1.usage     // $r2.usage     // {}))         as $usage
    | (($r1.totalDurationMs // null))                  as $dur
    | {
        id:        ($aid // $tuid),
        tool_use_id: $tuid,
        name:      ($atype // null),
        type:      ($atype // null),
        step:      (if $step     == "" then null else $step     end),
        phase:     (if $phase    == "" then null else $phase    end),
        iter:      (if $iter     == "" then null else $iter     end),
        sub_step:  (if $sub_step == "" then null else $sub_step end),
        model:     (if $model    == "" then null else $model    end),
        status:    $status,
        hook_event: $event,
        transcriptPath: null,
        tokensUsed: {
          input:         ($usage.input_tokens                // 0),
          output:        ($usage.output_tokens               // 0),
          cacheRead:     ($usage.cache_read_input_tokens     // 0),
          cacheCreation: ($usage.cache_creation_input_tokens // 0)
        },
        totalDurationMs: $dur,
        finishedAt: (now | todate)
      }
    ')

# ---------------------------------------------------------------------------
# D-3-5 — flock-serialized read-modify-write with atomic mv.
# ---------------------------------------------------------------------------
lock_file="$session_json.lock"
tmp_file="$session_json.tmp.$$"

(
    flock -x 9 || { log "flock failed on $lock_file"; exit 0; }

    # upsert by id; first-write-wins for `id` + `startedAt`; last-write-wins
    # for everything else (retries supersede). Preserve unknown fields.
    if ! jq --argjson new "$upsert_input" '
        .agents = (
            (.agents // [])
            | (map(.id) | index($new.id)) as $idx
            | if $idx == null
              then . + [ $new + { startedAt: ($new.finishedAt) } ]
              else (.[$idx] | (.startedAt // $new.finishedAt)) as $kept_started
                   | .[0:$idx]
                     + [ .[$idx] + $new + { startedAt: $kept_started } ]
                     + .[$idx+1:]
              end
        )
    ' "$session_json" > "$tmp_file"; then
        log "jq upsert failed"
        rm -f "$tmp_file"
        exit 0
    fi

    if ! jq -e . "$tmp_file" >/dev/null 2>&1; then
        log "tmp file failed JSON validation"
        rm -f "$tmp_file"
        exit 0
    fi

    mv -f "$tmp_file" "$session_json"
) 9>"$lock_file"

exit 0
