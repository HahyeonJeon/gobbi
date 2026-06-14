#!/usr/bin/env bash
# git-posture-probe.sh — read-only report of the runtime git posture.
#
# Purpose:
#   Report the effective runtime git posture — the sandbox / network / approval
#   state that decides whether networked git ops (git push, gh) can run. The
#   manager reads this BEFORE attempting a push, not after the wall is hit
#   (git/SKILL.md § Runtime git environment). Locked by Ideation DD-3 +
#   Planning PIN-1; the runtime-posture concept name is locked by OQ-7.
#
#   HONESTY CONTRACT (PIN-1): report only what is reliably detectable. The one
#   reliable field is network (via CODEX_SANDBOX_NETWORK_DISABLED on Codex).
#   sandbox-mode and approval-policy are NOT exposed by any env var or by
#   `codex sandbox --help` introspection (empirically confirmed in Ideation), so
#   the probe prints the literal `unknown` for them rather than guessing. The
#   manager treats every `unknown` field as "ask before assuming push will work."
#
#   READ-ONLY: this script reads env vars only. It NEVER writes a file, mutates
#   git / network / config state, or enables anything. It is informational; it
#   does not fail the session.
#
# Args:
#   --json          Emit a single JSON object instead of human-readable lines.
#   -h | --help     Print usage and exit 0.
#   (no args)       Emit human-readable field lines + an interpretation line.
#
# Fields (each value is one of the listed states; never a guess):
#   runtime          claude-code | codex | unknown
#   network          disabled | enabled | unknown   (reliable only when disabled
#                    via CODEX_SANDBOX_NETWORK_DISABLED=1; unset => unknown, NOT
#                    enabled — an unset var is not a positive "enabled" signal)
#   sandbox_mode     unknown   (not introspectable — PIN-1)
#   approval_policy  unknown   (not introspectable — PIN-1)
#
# Output: human-readable lines (default) or one JSON object (--json) on stdout.
# Exit: 0 on success; 2 on bad args. The probe never fails the session.

set -euo pipefail

SELF="git-posture-probe.sh"
log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: git-posture-probe.sh [--json]
  Read-only report of the runtime git posture (runtime / network / sandbox_mode
  / approval_policy). Reports the literal 'unknown' for any field that is not
  reliably detectable. Never writes, mutates, or enables anything.
    --json        emit a single JSON object instead of human-readable lines
    -h, --help    show this help and exit
EOF
}

# --- Parse args (fail-closed on anything unrecognized) -----------------------
want_json=0
for arg in "$@"; do
    case "$arg" in
        --json)    want_json=1 ;;
        -h|--help) usage; exit 0 ;;
        *)         usage; log "unknown argument: $arg"; exit 2 ;;
    esac
done

# --- Detect runtime (read-only) ----------------------------------------------
# Codex:       CODEX_THREAD_ID set.
# Claude Code: CLAUDE_CODE_SESSION_ID or CLAUDECODE set.
# Otherwise:   unknown — do not guess.
# Check CODEX_THREAD_ID FIRST: gobbi runs Codex agents via `codex exec` launched
# from a Claude Code session, so BOTH marker sets can be present at once. An
# active Codex process is under Codex's sandbox even when launched from Claude
# Code, so the Codex marker takes precedence — otherwise the probe would label a
# Codex-sandboxed task `claude-code` and misroute the runtime remediation menu.
if [ -n "${CODEX_THREAD_ID:-}" ]; then
    runtime="codex"
elif [ -n "${CLAUDE_CODE_SESSION_ID:-}" ] || [ -n "${CLAUDECODE:-}" ]; then
    runtime="claude-code"
else
    runtime="unknown"
fi

# --- Detect network (read-only) ----------------------------------------------
# RELIABLE positive-for-disabled signal: CODEX_SANDBOX_NETWORK_DISABLED=1.
# An unset (or non-1) var is NOT a reliable "enabled" signal — report unknown.
# On Claude Code there is no simple env signal at all => unknown.
if [ "${CODEX_SANDBOX_NETWORK_DISABLED:-}" = "1" ]; then
    network="disabled"
else
    network="unknown"
fi

# --- Sandbox mode + approval policy (PIN-1: not introspectable) --------------
# No env var or CLI introspection exposes these reliably. Report literal unknown.
sandbox_mode="unknown"
approval_policy="unknown"

# --- Interpretation line -----------------------------------------------------
# A short, plain reading of what the network state means for networked git ops.
case "$network" in
    disabled) net_reading="network disabled -> 'git push' / 'gh' will be blocked or escalated" ;;
    enabled)  net_reading="network enabled -> 'git push' / 'gh' may proceed" ;;
    *)        net_reading="network unknown -> do not assume 'git push' / 'gh' will work" ;;
esac
interpretation="$net_reading; treat every 'unknown' field as 'ask before assuming push will work'."

# --- Emit --------------------------------------------------------------------
if [ "$want_json" -eq 1 ]; then
    printf '{"runtime":"%s","network":"%s","sandbox_mode":"%s","approval_policy":"%s","interpretation":"%s"}\n' \
        "$runtime" "$network" "$sandbox_mode" "$approval_policy" "$interpretation"
else
    printf 'runtime:         %s\n' "$runtime"
    printf 'network:         %s\n' "$network"
    printf 'sandbox_mode:    %s\n' "$sandbox_mode"
    printf 'approval_policy: %s\n' "$approval_policy"
    printf 'interpretation:  %s\n' "$interpretation"
fi

exit 0
