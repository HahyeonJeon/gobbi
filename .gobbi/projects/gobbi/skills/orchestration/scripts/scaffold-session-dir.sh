#!/usr/bin/env bash
# scaffold-session-dir.sh — idempotently materialize one session step-dir's interior.
#
# Purpose:
#   The deterministic materializer for the per-session working tree. Creates a
#   loop (or execution-task) step-dir's 4-slot interior — working/, evaluation/,
#   staging/ (with the loop's typed staging subdirs), and, only with --pass,
#   outputs/. This is the script half of the spec-to-script binding; the
#   human-readable source of truth is record/record-map.md.
#   The verify script (verify-record-map.sh) diffs this script's output against
#   that doc and fails on drift.
#
# Args:
#   $1  <session-root>   Absolute path to sessions/{date}-{session-id}/.
#   $2  <step-dir>       One of the fixed loop set — 1-ideation 2-planning
#                        3-execution 4-wrap-up — OR an execution task
#                        dir of the form 3-execution/task-{NN}-{slug} where
#                        {NN} is [0-9]{2} and {slug} matches [a-z0-9-]{1,40}.
#   --pass               Also create the PASS-only outputs/ dir.
#
# Never creates transcripts/ — that single session-root dir is the manager's,
# created in Configuration alongside the root JSON files.
#
# Path-validation contract (fail-closed): <session-root> must be absolute;
# <step-dir> must match the fixed allowed set; reject .., leading /, stray
# slashes, and any step-dir outside the set (including startup). On any failure
# exit non-zero and create NOTHING.
#
# Idempotency: pure mkdir -p — re-run is a no-op; two scaffolds of the same valid
# step-dir are byte-identical.
#
# Output (stderr): a one-line summary; (stdout) nothing on success.
# Exit: 0 on success; 2 on bad args / path-validation failure.
#
# Example:
#   ./scaffold-session-dir.sh /abs/sessions/2026-06-08-.../  1-ideation
#   ./scaffold-session-dir.sh /abs/sessions/2026-06-08-.../  2-planning --pass
#   ./scaffold-session-dir.sh /abs/sessions/2026-06-08-.../  3-execution/task-01-scaffold-script

set -euo pipefail

SELF="scaffold-session-dir.sh"
log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: scaffold-session-dir.sh <session-root> <step-dir> [--pass]
  Materializes one step-dir's 4-slot interior (working/ evaluation/ staging/),
  plus the loop's typed staging subdirs. --pass also creates outputs/.
  Never creates transcripts/ (manager-owned session-root dir).
  <session-root> must be absolute. <step-dir> is one of:
    1-ideation 2-planning 3-execution 4-wrap-up
    3-execution/task-{NN}-{slug}   ({NN}=[0-9]{2}, {slug}=[a-z0-9-]{1,40})
EOF
}

# --- Parse args (fail-closed; create nothing before all checks pass) ---------
session_root=""
step_dir=""
want_outputs=0
for arg in "$@"; do
    case "$arg" in
        --pass) want_outputs=1 ;;
        -h|--help) usage; exit 0 ;;
        -*) usage; log "unknown option: $arg"; exit 2 ;;
        *)
            if [ -z "$session_root" ]; then
                session_root="$arg"
            elif [ -z "$step_dir" ]; then
                step_dir="$arg"
            else
                usage; log "too many positional args"; exit 2
            fi
            ;;
    esac
done

[ -n "$session_root" ] && [ -n "$step_dir" ] || { usage; log "missing args"; exit 2; }

# --- Path-validation contract ------------------------------------------------
# <session-root> must be absolute.
case "$session_root" in
    /*) : ;;
    *) log "session-root must be an absolute path: $session_root"; exit 2 ;;
esac

# <step-dir>: reject traversal, leading slash, and stray/duplicate slashes.
case "$step_dir" in
    *..*)  log "step-dir must not contain '..': $step_dir"; exit 2 ;;
    /*)    log "step-dir must not be absolute: $step_dir"; exit 2 ;;
    *//*)  log "step-dir must not contain stray slashes: $step_dir"; exit 2 ;;
    */)    log "step-dir must not end with a slash: $step_dir"; exit 2 ;;
esac

# <step-dir> must match the fixed loop set OR a single execution task dir.
# step_loop is the loop name used to key the staging-vocabulary manifest below.
step_loop=""
case "$step_dir" in
    1-ideation|2-planning|3-execution|4-wrap-up)
        step_loop="$step_dir"
        ;;
    3-execution/task-*)
        task_seg="${step_dir#3-execution/}"
        # task-{NN}-{slug}: {NN}=[0-9]{2}, {slug}=[a-z0-9-]{1,40}.
        if [[ "$task_seg" =~ ^task-[0-9]{2}-[a-z0-9-]{1,40}$ ]]; then
            step_loop="3-execution"
        else
            log "invalid execution task dir: $step_dir"; exit 2
        fi
        ;;
    *)
        log "step-dir not in the allowed set: $step_dir"; exit 2
        ;;
esac

# --- Per-loop staging-subdir manifest (mirrors record-map.md) --------------
# Base vocabulary shared by every loop; Planning adds one extra subdir.
base_staging=(
    scenarios checklists decisions references design discussions
    backlogs/feature backlogs/project reviews reports changelogs learnings notes
)
staging_subdirs=("${base_staging[@]}")
case "$step_loop" in
    2-planning) staging_subdirs+=(plans) ;;
esac

# --- Materialize (idempotent; only reached after all validation passes) ------
target="$session_root/$step_dir"

mkdir -p \
    "$target/working/research" \
    "$target/working/proposals/codex" \
    "$target/evaluation"
for sub in "${staging_subdirs[@]}"; do
    mkdir -p "$target/staging/$sub"
done
if [ "$want_outputs" -eq 1 ]; then
    mkdir -p "$target/outputs"
fi

log "scaffolded $step_dir (outputs=$want_outputs) under $session_root"
exit 0
