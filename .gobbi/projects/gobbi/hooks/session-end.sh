#!/usr/bin/env bash
# SessionEnd hook — the AUTHORITATIVE session-metadata reconciler.
#
# Fires once at session termination (SessionEnd event). Runs LAST, after every
# subagent transcript is complete, so it is the single authoritative writer of
# cumulative agents[].tokensUsed + usage.*. The PostToolUse hook
# (post-tool-use-agents.sh) is only a best-effort SEED; this hook reconciles
# every agents[] entry from the complete transcripts.
#
# What it does (LEAN — no transcript copy here; the RECORD sub-phase does that):
#   1. Read the SessionEnd payload defensively (jq '.field // empty').
#   2. Resolve the WORKTREE session.json deterministically from session_id + cwd
#      (same resolver shape as post-tool-use-agents.sh).
#   3. Invoke reconcile-session-metadata.sh (task 03) with the session.json and
#      the MAIN transcript. The reconciler does the heavy lifting — REUSED, not
#      reimplemented:
#        - manager rollup: agents[0].tokensUsed summed from the main transcript
#          (isSidechain==false) via agent-token-usage.sh --main;
#        - every agents[] entry reconciled from its own complete subagent
#          transcript (toolu_ ids re-keyed to agentId);
#        - codex token capture; usage.sessionTotal/codex/grandTotal recomputed.
#
# Stdin: Claude Code SessionEnd payload (JSON). Fields used (all read defensively):
#   session_id, transcript_path, cwd, hook_event_name, reason
#   (empirically confirmed — execution/rawdata/sessionend-payload-capture.md, task 01).
#
# Exit code: ALWAYS 0. A hook that blocks Claude is worse than a missed record.
# Every error path logs to stderr and exits 0; the reconcile failure never aborts
# session shutdown.

set -uo pipefail

LOG_TAG="session-end.sh"

log()  { printf '%s: %s\n' "$LOG_TAG" "$*" >&2; }
bail() { log "$*"; exit 0; }  # graceful: never block session shutdown.

# ---------------------------------------------------------------------------
# Read stdin JSON payload once.
# ---------------------------------------------------------------------------
payload="$(cat || true)"
[[ -n "$payload" ]] || bail "empty stdin — nothing to reconcile"

# Defensive JSON parse — bail gracefully on garbage.
if ! printf '%s' "$payload" | jq -e . >/dev/null 2>&1; then
    bail "stdin is not valid JSON"
fi

if [[ -n "${CODEX_THREAD_ID:-}${CODEX_CI:-}" && -z "${CLAUDE_CODE_SESSION_ID:-}${CLAUDECODE:-}" ]]; then
    bail "native Codex hook event — Claude metadata reconcile skipped"
fi

# All fields read defensively: any missing field -> empty (schema variance safe).
session_id=$(jq -r      '.session_id      // empty' <<<"$payload")
cwd=$(jq -r             '.cwd             // empty' <<<"$payload")
transcript_path=$(jq -r '.transcript_path // empty' <<<"$payload")
hook_event=$(jq -r      '.hook_event_name // empty' <<<"$payload")
reason=$(jq -r          '.reason          // empty' <<<"$payload")

log "SessionEnd fired (event=${hook_event:-?} reason=${reason:-?} sid=${session_id:-?})"

[[ -n "$session_id" ]]      || bail "missing session_id — cannot resolve session.json"
[[ -n "$cwd" ]]             || bail "missing cwd — cannot resolve session.json"
[[ -n "$transcript_path" ]] || bail "missing transcript_path — nothing to reconcile from"
[[ -f "$transcript_path" ]] || bail "main transcript not found at $transcript_path"

# ---------------------------------------------------------------------------
# Resolve the WORKTREE session.json deterministically from session_id + cwd.
#
# Mirrors post-tool-use-agents.sh: under the always-worktree model the live
# session.json lives inside the session's worktree, not the main tree. Glob for
# the unique session.json whose path ends in *-<sid>/session.json across the
# candidate roots, then prefer the one whose own `.git.worktreePath` matches its
# physical worktree location.
# ---------------------------------------------------------------------------
resolve_session_json() {
    local _cwd="$1" _sid="$2"
    local roots=() r
    [[ -n "$_cwd" ]]                   && roots+=("$_cwd")
    [[ -n "${CLAUDE_PROJECT_DIR:-}" ]] && roots+=("$CLAUDE_PROJECT_DIR")
    local _top
    _top=$(git -C "$_cwd" rev-parse --show-toplevel 2>/dev/null || true)
    [[ -n "$_top" ]]                   && roots+=("$_top")

    local cands=() seen=" "
    for r in "${roots[@]}"; do
        [[ -d "$r" ]] || continue
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

    # Multiple candidates: prefer the one whose own session.json declares a
    # worktreePath that the candidate physically lives under (the live writer).
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
    || bail "resolver failed (session.json) — nothing reconciled"
[[ -f "$session_json" ]] || bail "session.json not found at $session_json"

# ---------------------------------------------------------------------------
# Locate the reconciler (task 03) next to the orchestration scripts. Resolve
# relative to the worktree the session.json lives in, so it stays branch-local;
# fall back to $cwd / $CLAUDE_PROJECT_DIR. The reconciler does the manager
# rollup + per-agent reconcile + codex + usage recompute — REUSED, not redone.
# ---------------------------------------------------------------------------
# The session.json lives at <root>/.gobbi/projects/<proj>/sessions/...; the
# reconciler lives at <root>/.gobbi/projects/<proj>/skills/orchestration/scripts/.
# Derive <root>/.gobbi/projects/<proj> by stripping /sessions/... from the path.
proj_dir="${session_json%/sessions/*}"
reconcile=""
for cand in \
    "$proj_dir/skills/orchestration/scripts/reconcile-session-metadata.sh" \
    "$cwd/.gobbi/projects/gobbi/skills/orchestration/scripts/reconcile-session-metadata.sh" \
    "${CLAUDE_PROJECT_DIR:-}/.gobbi/projects/gobbi/skills/orchestration/scripts/reconcile-session-metadata.sh"; do
    if [[ -n "$cand" && -f "$cand" ]]; then
        reconcile="$cand"
        break
    fi
done
[[ -n "$reconcile" ]] || bail "reconcile-session-metadata.sh not found (proj_dir=$proj_dir)"

# ---------------------------------------------------------------------------
# Live Codex token capture (D6 / Preparation Spike 2).
#
# Codex `exec` writes a rollout per run under ~/.codex/sessions/YYYY/MM/DD/
# rollout-*.jsonl. Each rollout's LAST `event_msg` of type "token_count" carries
# payload.info.total_token_usage.total_tokens — the cumulative tokens for THAT
# Codex run. This session may have spawned several Codex runs (e.g. dual-system
# evaluators), so we SUM the last token_count of every rollout that belongs to
# THIS session.
#
# Correlation heuristic (defensible, conservative):
#   - mtime within the session window: startedAt (from session.json) .. now; AND
#   - cwd match: the rollout's session_meta.payload.cwd equals the session
#     worktree OR the main tree (both are valid Codex launch dirs for a session).
# A rollout must satisfy BOTH to count. If correlation finds nothing, we pass NO
# --codex-total, and the reconciler PRESERVES any existing usage.codex.* (1a) —
# never zeroes it. Any error here is swallowed: capture is best-effort, the hook
# stays non-blocking (exit 0).
#
# Limitation / backlog: cwd+mtime correlation can miss a Codex run launched from
# an unrelated dir, or over-count if two sessions overlap in the same worktree at
# the same time. A robust correlation would stamp the gobbi session_id into the
# Codex run (e.g. via env or originator). Tracked as a follow-up; see the task-03
# revise artifact. The preserve-on-empty fallback keeps this safe meanwhile.
# ---------------------------------------------------------------------------
codex_total_arg=()
capture_codex_total() {
    local _sj="$1" _cwd="$2"
    local codex_root="${HOME}/.codex/sessions"
    [[ -d "$codex_root" ]] || { log "codex capture: no $codex_root (skipped)"; return 0; }
    command -v jq >/dev/null 2>&1 || return 0

    # Session window: startedAt (epoch) .. now. Missing startedAt -> 0 (no lower bound).
    local started_iso started_epoch now_epoch
    started_iso=$(jq -r '.startedAt // empty' "$_sj" 2>/dev/null || true)
    started_epoch=0
    if [[ -n "$started_iso" ]]; then
        started_epoch=$(date -u -d "$started_iso" +%s 2>/dev/null || echo 0)
    fi
    now_epoch=$(date -u +%s 2>/dev/null || echo 0)

    # Acceptable launch dirs: the session worktree and the main tree.
    local worktree main_tree
    worktree=$(jq -r '.git.worktreePath // empty' "$_sj" 2>/dev/null || true)
    main_tree=$(git -C "$_cwd" rev-parse --show-toplevel 2>/dev/null || true)

    local sum=0 matched=0 f
    while IFS= read -r f; do
        [[ -n "$f" ]] || continue
        # mtime window gate.
        local mt
        mt=$(stat -c %Y "$f" 2>/dev/null || echo 0)
        [[ "$mt" -ge "$started_epoch" ]] || continue
        [[ "$now_epoch" -eq 0 || "$mt" -le "$now_epoch" ]] || continue
        # cwd gate: the rollout's session_meta cwd MUST equal the worktree or the
        # main tree. An empty/unknown cwd is rejected when we have either path to
        # compare against (mtime alone is too weak to claim ownership).
        local rcwd
        rcwd=$(jq -r 'select(.type=="session_meta") | .payload.cwd // empty' "$f" 2>/dev/null | head -n1 || true)
        if [[ -n "$worktree" || -n "$main_tree" ]]; then
            if [[ -n "$worktree" && "$rcwd" == "$worktree" ]] \
               || [[ -n "$main_tree" && "$rcwd" == "$main_tree" ]]; then
                : # passes cwd gate
            else
                continue
            fi
        fi
        # Sum this rollout's LAST token_count total.
        local last
        last=$(jq -r '
            select((.payload.type? == "token_count")
                   and (.payload.info.total_token_usage.total_tokens != null))
            | .payload.info.total_token_usage.total_tokens
        ' "$f" 2>/dev/null | tail -n1 || true)
        case "$last" in
            ''|*[!0-9]*) : ;;
            *) sum=$((sum + last)); matched=$((matched + 1)) ;;
        esac
    done < <(find "$codex_root" -type f -name 'rollout-*.jsonl' 2>/dev/null)

    if [[ "$matched" -gt 0 && "$sum" -gt 0 ]]; then
        log "codex capture: $matched rollout(s) matched, total_tokens=$sum"
        codex_total_arg=(--codex-total "$sum")
    else
        log "codex capture: no matching rollout (preserving existing usage.codex.*)"
    fi
    return 0
}
capture_codex_total "$session_json" "$cwd" || true

# ---------------------------------------------------------------------------
# Invoke the reconciler. It is non-fatal: a non-zero exit logs but never aborts
# session shutdown. The reconciler holds its own flock on session.json.
# ---------------------------------------------------------------------------
if bash "$reconcile" ${codex_total_arg[@]+"${codex_total_arg[@]}"} "$session_json" "$transcript_path"; then
    log "reconciled session.json at $session_json"
else
    rc=$?
    log "reconcile-session-metadata.sh exited non-zero (rc=$rc) — session shutdown not blocked"
fi

exit 0
