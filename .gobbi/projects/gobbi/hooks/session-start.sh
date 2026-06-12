#!/usr/bin/env bash
# SessionStart hook — persists Claude Code hook-only env vars to $CLAUDE_ENV_FILE.
#
# Claude Code pipes a JSON object to stdin on every SessionStart event
# (startup / resume / clear / compact).  This script reads that payload and
# appends shell-safe `export VAR=value` lines to $CLAUDE_ENV_FILE so that
# subsequent Bash subprocesses (tool calls, subagents) can read the vars.
#
# Values are serialized via `jq -r @sh` (POSIX-shell single-quote quoting)
# so sourcing the env file is robust against paths with spaces, single quotes,
# shell metacharacters, empty strings, and Unicode.  (FIX C)
#
# Exported vars:
#   REQUIRED (always present in stdin JSON):
#     session_id        -> CLAUDE_CODE_SESSION_ID  (NOT CLAUDE_SESSION_ID — FIX 1)
#     transcript_path   -> CLAUDE_TRANSCRIPT_PATH
#     cwd               -> CLAUDE_CWD
#     hook_event_name   -> CLAUDE_HOOK_EVENT_NAME
#     source            -> CLAUDE_HOOK_SOURCE       (FIX 5; distinct from hook_event_name)
#   OPTIONAL (emitted only when present and non-null in stdin JSON):
#     agent_id          -> CLAUDE_AGENT_ID
#     agent_type        -> CLAUDE_AGENT_TYPE
#     permission_mode   -> CLAUDE_PERMISSION_MODE
#   PASSTHROUGH (re-exported only if already set in this process's env):
#     CLAUDE_PROJECT_DIR, CLAUDE_PLUGIN_ROOT, CLAUDE_PLUGIN_DATA

set -euo pipefail

# ---------------------------------------------------------------------------
# Guard: $CLAUDE_ENV_FILE must be set and writable.
# ---------------------------------------------------------------------------
if [[ -z "${CLAUDE_ENV_FILE:-}" ]]; then
    if [[ -n "${CODEX_THREAD_ID:-}${CODEX_CI:-}" ]]; then
        exit 0
    fi
    printf '%s\n' "session-start.sh: \$CLAUDE_ENV_FILE is unset — cannot persist env vars" >&2
    exit 1
fi

if ! touch "${CLAUDE_ENV_FILE}" 2>/dev/null; then
    printf '%s\n' "session-start.sh: \$CLAUDE_ENV_FILE ('${CLAUDE_ENV_FILE}') is not writable" >&2
    exit 1
fi

# ---------------------------------------------------------------------------
# Read stdin JSON payload.
# ---------------------------------------------------------------------------
payload="$(cat)"
[[ -n "$payload" ]] || { printf '%s\n' "session-start.sh: empty stdin — expected JSON payload" >&2; exit 1; }

# ---------------------------------------------------------------------------
# REQUIRED fields — always present; emit one export line each via @sh.
# ---------------------------------------------------------------------------
jq -r '@sh "export CLAUDE_CODE_SESSION_ID=\(.session_id)"'    <<<"$payload" >> "${CLAUDE_ENV_FILE}"
jq -r '@sh "export CLAUDE_TRANSCRIPT_PATH=\(.transcript_path)"' <<<"$payload" >> "${CLAUDE_ENV_FILE}"
jq -r '@sh "export CLAUDE_CWD=\(.cwd)"'                        <<<"$payload" >> "${CLAUDE_ENV_FILE}"
jq -r '@sh "export CLAUDE_HOOK_EVENT_NAME=\(.hook_event_name)"' <<<"$payload" >> "${CLAUDE_ENV_FILE}"
jq -r '@sh "export CLAUDE_HOOK_SOURCE=\(.source)"'              <<<"$payload" >> "${CLAUDE_ENV_FILE}"

# ---------------------------------------------------------------------------
# OPTIONAL fields — emit only when present and non-null in the payload.
# ---------------------------------------------------------------------------
jq -r 'if .agent_id != null then @sh "export CLAUDE_AGENT_ID=\(.agent_id)" else empty end' \
    <<<"$payload" >> "${CLAUDE_ENV_FILE}"

jq -r 'if .agent_type != null then @sh "export CLAUDE_AGENT_TYPE=\(.agent_type)" else empty end' \
    <<<"$payload" >> "${CLAUDE_ENV_FILE}"

jq -r 'if .permission_mode != null then @sh "export CLAUDE_PERMISSION_MODE=\(.permission_mode)" else empty end' \
    <<<"$payload" >> "${CLAUDE_ENV_FILE}"

# ---------------------------------------------------------------------------
# PASSTHROUGH re-exports — re-export only if already in this process's env.
# Uses bash %q for shell-safe quoting (safe here: shebang is bash).
# ---------------------------------------------------------------------------
for _var in CLAUDE_PROJECT_DIR CLAUDE_PLUGIN_ROOT CLAUDE_PLUGIN_DATA; do
    if [[ -n "${!_var:-}" ]]; then
        printf 'export %s=%q\n' "${_var}" "${!_var}" >> "${CLAUDE_ENV_FILE}"
    fi
done

exit 0
