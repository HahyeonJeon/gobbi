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

if [[ -n "${CODEX_THREAD_ID:-}${CODEX_CI:-}" && -z "${CLAUDE_CODE_SESSION_ID:-}${CLAUDECODE:-}" ]]; then
    bail "native Codex hook event — Claude metadata hook skipped"
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
# Resolve the WORKTREE session.json deterministically from session_id.
#
# Under the always-worktree model the live session.json lives inside the
# session's worktree (e.g. .../worktrees/<branch>/.gobbi/.../sessions/*-<sid>/),
# NOT in the main tree. The old cwd-only scan silently bailed whenever the hook
# fired with the main-tree cwd — which left every subagent seeded with a toolu_
# id and zero tokens. Resolve by GLOBBING for the unique session.json whose path
# ends in *-<sid>/session.json across the candidate roots, then prefer the one
# whose own `.git.worktreePath` matches its physical worktree location.
#
# Search roots, in order:
#   1) $cwd (covers a worktree cwd)
#   2) $CLAUDE_PROJECT_DIR (repo root; worktrees live under it)
#   3) `git rev-parse --show-toplevel` from $cwd (fallback when env is unset)
# ---------------------------------------------------------------------------
resolve_session_json() {
    local _cwd="$1" _sid="$2"
    local roots=() r
    [[ -n "$_cwd" ]]                  && roots+=("$_cwd")
    [[ -n "${CLAUDE_PROJECT_DIR:-}" ]] && roots+=("$CLAUDE_PROJECT_DIR")
    local _top
    _top=$(git -C "$_cwd" rev-parse --show-toplevel 2>/dev/null || true)
    [[ -n "$_top" ]]                  && roots+=("$_top")

    # Collect unique candidate session.json paths ending in *-<sid>/session.json.
    local cands=() seen=" "
    for r in "${roots[@]}"; do
        [[ -d "$r" ]] || continue
        # Bounded-depth find avoids walking node_modules etc.; -L not needed.
        local f
        while IFS= read -r f; do
            [[ -n "$f" ]] || continue
            case "$seen" in *" $f "*) continue ;; esac
            seen="$seen$f "
            cands+=("$f")
        done < <(find "$r" -maxdepth 8 -type f -path "*/sessions/*-${_sid}/session.json" 2>/dev/null)
    done

    local n=${#cands[@]}
    if [[ $n -eq 0 ]]; then
        log "session-json resolver: no candidate for sid=$_sid under roots=${roots[*]}"
        return 1
    fi
    if [[ $n -eq 1 ]]; then
        printf '%s' "${cands[0]}"
        return 0
    fi

    # Multiple candidates (e.g. main-tree stale copy + live worktree copy).
    # Prefer the one whose own session.json declares a worktreePath that the
    # candidate physically lives under — that is the live worktree writer.
    local c best="" hits=0
    for c in "${cands[@]}"; do
        local wt
        wt=$(jq -r '.git.worktreePath // empty' "$c" 2>/dev/null || true)
        if [[ -n "$wt" && "$c" == "$wt"/* ]]; then
            best="$c"; hits=$((hits + 1))
        fi
    done
    if [[ $hits -eq 1 ]]; then
        printf '%s' "$best"
        return 0
    fi
    log "session-json resolver: cannot disambiguate sid=$_sid (n=$n, wt-matches=$hits)"
    return 1
}

session_json=$(resolve_session_json "$cwd" "$session_id") \
    || bail "resolver failed (session json)"
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
# Resolve the REAL agentId from the main transcript (D-3-6).
#
# The main transcript carries a `toolUseResult` line for each spawn whose
# `tool_use_id` correlates to this Agent call; `.toolUseResult.agentId` is the
# short id (e.g. acfaed3f977c0b4de) that names the subagent's own transcript at
# ${transcript_path%.jsonl}/subagents/agent-<agentId>.jsonl.
#
# CRITICAL: this hook MUST NEVER seed an entry keyed by the toolu_ tool_use_id.
# If the real agentId cannot be resolved yet (e.g. the toolUseResult line is not
# flushed at fire time), bail gracefully — SessionEnd is the authoritative
# reconciler and will backfill the entry from the completed transcripts.
# (Supersede-note: features/agents/decisions/2026-06-06-session-operation-
#  metadata-recording-from-agent-transcripts.md rejected this hook for token
#  recording; this fix makes the hook a best-effort SEED. Task 08 amends that
#  decision doc formally.)
# ---------------------------------------------------------------------------
agent_id=""
agent_type=""
if [[ -n "$transcript_path" && -f "$transcript_path" ]]; then
    # Last matching line wins (retries supersede earlier attempts).
    tur=$(jq -c --arg tuid "$tool_use_id" '
        select((.toolUseResult | type == "object") and (.toolUseResult.agentId != null))
        | select((.message.content[]?.tool_use_id // empty) == $tuid)
        | { agentId: .toolUseResult.agentId, agentType: .toolUseResult.agentType }
    ' "$transcript_path" 2>/dev/null | tail -n1 || true)
    if [[ -n "$tur" ]]; then
        agent_id=$(jq -r '.agentId // ""'   <<<"$tur" 2>/dev/null || true)
        agent_type=$(jq -r '.agentType // ""' <<<"$tur" 2>/dev/null || true)
    fi
fi

# NEVER seed a toolu_ id. Bail if the real agentId is not resolvable yet.
[[ -n "$agent_id" ]] || bail "agentId unresolved for tool_use_id=$tool_use_id (SessionEnd reconciles)"
case "$agent_id" in
    toolu_*) bail "refusing to seed toolu_ id ($agent_id) for tool_use_id=$tool_use_id" ;;
esac

# agentType from the transcript, else the delegation prompt's subagent_type.
[[ -n "$agent_type" ]] || agent_type="$subagent_type"

# ---------------------------------------------------------------------------
# Cumulative tokens summed from the agent's OWN transcript (NOT final-turn
# toolUseResult.usage). Reuse the orchestration unit script so the figure
# matches the MEMORIZATION/Wrap-up reconciler exactly.
# ---------------------------------------------------------------------------
agent_transcript="${transcript_path%.jsonl}/subagents/agent-${agent_id}.jsonl"
unit_script="$cwd/.gobbi/projects/gobbi/skills/orchestration/scripts/agent-token-usage.sh"
[[ -f "$unit_script" ]] || unit_script="${CLAUDE_PROJECT_DIR:-}/.gobbi/projects/gobbi/skills/orchestration/scripts/agent-token-usage.sh"

tokens_json="null"
if [[ -f "$agent_transcript" && -f "$unit_script" ]]; then
    _tok=$(bash "$unit_script" "$agent_transcript" 2>/dev/null || true)
    if [[ -n "$_tok" ]] && jq -e . <<<"$_tok" >/dev/null 2>&1; then
        tokens_json="$_tok"
    fi
fi

# Compose the upsert input JSON for the jq pipeline.
status="ok"
[[ "$hook_event" == "PostToolUseFailure" ]] && status="failed"

upsert_input=$(jq -n \
    --arg aid      "$agent_id" \
    --arg tuid     "$tool_use_id" \
    --arg model    "$model" \
    --arg step     "$step" \
    --arg phase    "$phase" \
    --arg iter     "$iter" \
    --arg sub_step "$sub_step" \
    --arg atype    "$agent_type" \
    --arg status   "$status" \
    --arg event    "$hook_event" \
    --arg atrans   "$agent_transcript" \
    --argjson tok  "$tokens_json" \
    '
    ($tok // {}) as $u
    | {
        id:        $aid,
        tool_use_id: $tuid,
        name:      (if $atype == "" then null else $atype end),
        type:      (if $atype == "" then null else $atype end),
        step:      (if $step     == "" then null else $step     end),
        phase:     (if $phase    == "" then null else $phase    end),
        iter:      (if $iter     == "" then null else $iter     end),
        sub_step:  (if $sub_step == "" then null else $sub_step end),
        model:     (if $model    == "" then null else $model    end),
        status:    $status,
        hook_event: $event,
        transcriptPath: $atrans,
        # Cumulative-from-own-transcript. SessionEnd is the authoritative
        # reconciler of agents[].tokensUsed totals and usage.* — this is a seed.
        tokensUsed: {
          input:         ($u.input         // 0),
          output:        ($u.output        // 0),
          cacheRead:     ($u.cacheRead     // 0),
          cacheCreation: ($u.cacheCreation // 0),
          total:         ($u.total         // 0)
        },
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
