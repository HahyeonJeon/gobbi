#!/usr/bin/env bash
# SessionEnd hook — the AUTHORITATIVE session-metadata reconciler.
#
# Fires once at session termination (SessionEnd event). Runs LAST, after every
# subagent transcript is complete, so it is the single authoritative writer of
# cumulative agents[].tokensUsed + usage.*. The PostToolUse hook
# (post-tool-use-agents.sh) is only a best-effort SEED; this hook reconciles
# every agents[] entry from the complete transcripts.
#
# What it does (LEAN — no transcript copy here; that is task 07's memorization step):
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
# Invoke the reconciler. It is non-fatal: a non-zero exit logs but never aborts
# session shutdown. The reconciler holds its own flock on session.json.
# ---------------------------------------------------------------------------
if bash "$reconcile" "$session_json" "$transcript_path"; then
    log "reconciled session.json at $session_json"
else
    rc=$?
    log "reconcile-session-metadata.sh exited non-zero (rc=$rc) — session shutdown not blocked"
fi

exit 0
