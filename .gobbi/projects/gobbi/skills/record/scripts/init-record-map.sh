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
#     - all four loop dirs (1-ideation … 4-wrap-up), by DELEGATING each loop's
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
#   Execution task dirs (3-execution/task-{NN}-{slug}) are NOT created here — their
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
  session.json.lock) + README index + all 4 loop dirs (via scaffold-session-dir.sh).
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

# --- Schema compatibility gate (read-only; MUST precede every mutation) ------
# Gobbi 0.5.3 starts a new session-record schema. Existing sessions belong to
# the code pinned in their original worktrees; this initializer does not migrate
# or operate on them. Derive expected versions from the shipped templates so the
# gate cannot silently drift from the files it will copy.
command -v jq >/dev/null 2>&1 || { log "jq not found — required for schema compatibility checks"; exit 1; }
preflight_schema() {
    local dest_name="$1" template_name="$2"
    local dest="$session_root/$dest_name" template="$templates/$template_name"
    [ -f "$template" ] || { log "missing template: $template"; exit 1; }
    local expected
    expected="$(jq -er '.schemaVersion | select(type == "number")' "$template")" || {
        log "template has no numeric schemaVersion: $template"
        exit 1
    }
    if [ -e "$dest" ]; then
        local actual
        actual="$(jq -er '.schemaVersion | select(type == "number")' "$dest" 2>/dev/null)" || {
            log "refusing to mutate session with invalid metadata: $dest"
            exit 1
        }
        if [ "$actual" != "$expected" ]; then
            log "refusing legacy session schema in $dest_name (found $actual, expected $expected); finish it in its pinned pre-0.5.3 worktree"
            exit 1
        fi
        local shape_filter
        case "$dest_name" in
            session.json)
                shape_filter='(keys == ["agents","feature","finishedAt","git","previousSessionId","project","schemaVersion","sessionId","startedAt","system","task","transcriptPath","usage","workflow"]) and
                    (.git | keys == ["baseBranch","branch","issue","pr","repo","worktreePath"]) and
                    (.workflow | keys == ["chat","configuration","execution","ideation","planning","wrap-up"]) and
                    (.workflow.configuration | keys == ["finishedAt","startedAt"]) and
                    all(.workflow.ideation,.workflow.planning,.workflow["wrap-up"];
                        (keys == ["finishedAt","integration","iter","iterations","startedAt","verdict"])) and
                    (.workflow.execution | keys == ["finishedAt","integration","iter","iterations","startedAt","verdict"]) and
                    all(.workflow.ideation.integration,.workflow.planning.integration,.workflow["wrap-up"].integration;
                        (keys == ["changing_rows","escalated_rows","kept_own_rows","total_rows"])) and
                    (.workflow.execution.integration | keys == ["changing_rows","escalated_rows","kept_own_rows","tasks","total_rows"]) and
                    (.workflow.chat | keys == ["tasks"]) and
                    (.agents | type == "array") and
                    all(.agents[];
                        (keys == ["continuationOf","finishedAt","id","iter","kind","model","name","phase","startedAt","status","step","sub_step","system","teammateName","tokensUsed","transcriptPath","turns","type"]) and
                        (.tokensUsed | keys == ["cacheCreation","cacheRead","input","output","total"])) and
                    (.usage | keys == ["codex","computedAt","grandTotal","sessionTotal"]) and
                    (.usage.codex | keys == ["cacheCreation","cacheRead","input","output","total"])'
                ;;
            state.json)
                shape_filter='(keys == ["activeNote","mode","schemaVersion","workflow"]) and
                    (.workflow | keys == ["chat","configuration","execution","ideation","planning","wrap-up"]) and
                    all(.workflow.configuration,.workflow.ideation,.workflow.planning,.workflow.execution,.workflow["wrap-up"];
                        (keys == ["iter","maxIterations","phase","state","verdict"])) and
                    (.workflow.chat | keys == ["tasks"]) and
                    (.workflow.planning.maxIterations >= 1)'
                ;;
            settings.json)
                shape_filter='(keys == ["compaction","git","mode","models","schemaVersion","workflow"]) and
                    (.workflow | keys == ["execution","ideation","planning","wrap-up"]) and
                    all(.workflow.ideation,.workflow.planning,.workflow.execution,.workflow["wrap-up"];
                        (keys == ["discuss","evaluate","maxIterations","propose","skip"])) and
                    (.models | keys == ["claude","codex"]) and
                    all(.models.claude,.models.codex;
                        (keys == ["assistant","evaluator","executor","leader","manager"])) and
                    (.git | keys == ["baseBranch","branch","issue","pr","repo","worktree"]) and
                    (.git.pr | keys == ["draft","open"]) and
                    (.git.issue | keys == ["create"]) and
                    (.git.worktree | keys == ["autoRemove"]) and
                    (.git.branch | keys == ["autoRemove"]) and
                    (.compaction | keys == ["enabled","maxAutoActions","note"]) and
                    (.workflow.planning.skip == false) and
                    (.workflow.planning.maxIterations >= 1)'
                ;;
        esac
        if ! jq -e "$shape_filter" "$dest" >/dev/null 2>&1; then
            log "refusing retired or malformed current-schema shape in $dest_name; finish legacy sessions in their pinned pre-0.5.3 worktree"
            exit 1
        fi
    fi
}
preflight_schema session.json session.template.json
preflight_schema state.json "state.$mode.json"
preflight_schema settings.json "settings.$mode.json"

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
for loop in 1-ideation 2-planning 3-execution 4-wrap-up; do
    "$scaffold" "$session_root" "$loop" >/dev/null 2>&1 || { log "scaffold failed for $loop"; exit 1; }
done

log "initialized session-record skeleton (mode=$mode) at $session_root"
exit 0
