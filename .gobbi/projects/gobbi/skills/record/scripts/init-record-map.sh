#!/usr/bin/env bash
# init-record-map.sh — one-shot bootstrap of a full session-record skeleton.
#
# Purpose:
#   The Configuration-time initializer for the per-session working tree (the
#   "session record") at sessions/{date}-{session-id}/. In ONE call it materializes
#   the complete skeleton the manager then stamps:
#     - session-root invariants: the transcripts/ dir + metadata STUBS
#       (session.json, state.json, settings.json, session.json.lock)
#     - a session-root README.md index stub pointing at record-map.md
#     - all five loop dirs (1-ideation … 5-wrap-up), by DELEGATING each loop's
#       4-slot interior to scaffold-session-dir.sh — the single dir-materializer —
#       so the per-loop dir + staging vocabulary stays defined in exactly one place.
#
#   The manager calls this FIRST in Configuration (after worktree creation), then
#   stamps session.json / state.json / settings.json with real values. record-map.md
#   is the human-readable source of truth for the shape this produces.
#
#   Metadata + README stubs are copied from orchestration/templates/ CREATE-IF-ABSENT:
#   an existing file is never overwritten, so re-running on a resumed / cleared /
#   compacted session preserves the manager's stamped values. Dirs use mkdir -p.
#   The whole script is therefore idempotent and safe on every Configuration entry.
#
#   Execution task dirs (4-execution/task-{NN}-{slug}) are NOT created here — their
#   names are unknown at init; they stay lazy via scaffold-session-dir.sh per task.
#   startup/ owns its own session shape (not a loop) and is out of scope here too.
#
# Args:
#   $1  <session-root>  Absolute path to sessions/{date}-{session-id}/ (created if absent).
#   $2  <mode>          chat | auto — selects the settings template to stub.
#
# Path-validation (fail-closed): <session-root> absolute; <mode> in {chat, auto}.
#   On any validation failure: exit 2 and create NOTHING.
#
# Output (stderr): a one-line summary. Exit: 0 ok; 1 scaffold/template failure; 2 bad args.

set -euo pipefail

SELF="init-record-map.sh"
log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: init-record-map.sh <session-root> <mode>
  Bootstraps the full session-record skeleton at <session-root>:
  transcripts/ + metadata stubs (session.json state.json settings.json
  session.json.lock) + README index + all 5 loop dirs (via scaffold-session-dir.sh).
  Stubs are create-if-absent (never clobber stamped values). Idempotent.
  <session-root> must be absolute; <mode> is chat|auto.
EOF
}

# --- Parse + validate args (fail-closed; create nothing before checks pass) ---
case "${1:-}" in
    -h|--help) usage; exit 0 ;;
esac
session_root="${1:-}"
mode="${2:-}"
[ -n "$session_root" ] && [ -n "$mode" ] || { usage; log "missing args"; exit 2; }
case "$session_root" in
    /*) : ;;
    *) usage; log "session-root must be an absolute path: $session_root"; exit 2 ;;
esac
case "$mode" in
    chat|auto) : ;;
    *) usage; log "mode must be chat or auto: $mode"; exit 2 ;;
esac

# --- Resolve sibling scripts + templates (relative to this script) -----------
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
scaffold="$script_dir/../../orchestration/scripts/scaffold-session-dir.sh"
templates="$script_dir/../../orchestration/templates"
[ -x "$scaffold" ] || { log "scaffold script not executable: $scaffold"; exit 1; }
[ -d "$templates" ] || { log "templates dir not found: $templates"; exit 1; }

# --- Session-root invariants -------------------------------------------------
mkdir -p "$session_root" "$session_root/transcripts"

# stub <template-basename> <dest-basename> — copy create-if-absent (never clobber).
stub() {
    local src="$templates/$1" dest="$session_root/$2"
    [ -f "$src" ] || { log "missing template: $src"; exit 1; }
    [ -e "$dest" ] || cp "$src" "$dest"
}
stub session.template.json session.json
stub "state.$mode.json"    state.json
stub "settings.$mode.json" settings.json

# advisory write-lock marker (empty); create-if-absent.
[ -e "$session_root/session.json.lock" ] || : > "$session_root/session.json.lock"

# session-root README index stub; create-if-absent.
if [ ! -e "$session_root/README.md" ]; then
    cat > "$session_root/README.md" <<EOF
# Session record — $(basename "$session_root")

Working memory for this gobbi session. Gitignored, worktree-local, and removed at
worktree cleanup — nothing here is durable until Wrap-up promotes \`staging/\` to memory.

Canonical tree spec: \`skills/record/record-map.md\`. Materialized by
\`skills/record/scripts/init-record-map.sh\` (this skeleton) +
\`skills/orchestration/scripts/scaffold-session-dir.sh\` (per-loop interiors).
EOF
fi

# --- Loop dirs: delegate each interior to the single dir-materializer ---------
for loop in 1-ideation 2-preparation 3-planning 4-execution 5-wrap-up; do
    "$scaffold" "$session_root" "$loop" >/dev/null 2>&1 || { log "scaffold failed for $loop"; exit 1; }
done

log "initialized session-record skeleton (mode=$mode) at $session_root"
exit 0
