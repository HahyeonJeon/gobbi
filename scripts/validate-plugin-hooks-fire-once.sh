#!/usr/bin/env bash
# validate-plugin-hooks-fire-once.sh
#
# AUTONOMOUS DELIVERABLE — operator-assisted validation script.
# This script validates, for an INSTALLED gobbi plugin, that:
#   (i)   Each registered hook fires EXACTLY ONCE per event trigger.
#         The expected event set is DERIVED from the installed hooks.json keys
#         (currently SessionStart, PostToolUse, PostToolUseFailure, SessionEnd) —
#         a future event added to hooks.json is auto-covered with no edit here.
#         Operator-triggered events (SessionStart, PostToolUse, PostToolUseFailure,
#         per PHASE 4) are asserted to fire exactly once. SessionEnd is allow-listed
#         and asserted-if-present — it is awkward to trigger deterministically once,
#         so its absence is informational, never a failure.
#   (ii)  The installed-cache top level holds only the allow-set:
#         {.claude-plugin, skills, agents, hooks} (+ optional .codex-plugin when
#         the package was installed via Codex) with no leaked repo/project-memory dirs.
#
# !! DO NOT RUN THIS SCRIPT BEFORE COMPLETING THE OPERATOR PROCEDURE BELOW !!
# The marker-dir must be populated by live hook fires before the assertions run.
#
# Usage (after completing the OPERATOR PROCEDURE):
#   GOBBI_HOOK_MARKER_DIR=/tmp/gobbi-hook-markers \
#   GOBBI_PLUGIN_CACHE_ID=<id>                    \
#     bash scripts/validate-plugin-hooks-fire-once.sh
#
# Required env vars:
#   GOBBI_HOOK_MARKER_DIR   — temp dir populated by instrumented hooks (markers)
#   GOBBI_PLUGIN_CACHE_ID   — the installed plugin's cache ID; used to locate
#                             ~/.claude/plugins/cache/<id>/
#
# ============================================================================
# OPERATOR PROCEDURE
# ============================================================================
# Follow this exact sequence before running the assertion section of this script.
#
# PHASE 0 — Prerequisites
# -------------------------
#   - jq (>= 1.6), bash (>= 4.0), and the claude CLI must be on $PATH.
#   - An isolated environment is strongly recommended (see ISOLATION note below).
#
#     ISOLATION: to avoid cross-contamination with your active dev registration
#     (DD-8: dev hooks in .claude/settings.json fire separately from installed
#     hooks), run the test from a directory that has NO .claude/settings.json
#     with dev hook registrations.  The simplest approach:
#
#       export CLAUDE_CONFIG_DIR="$(mktemp -d /tmp/gobbi-test-config-XXXXXX)"
#       mkdir -p "$CLAUDE_CONFIG_DIR"
#
#     This gives Claude a fresh config dir with no pre-existing registrations.
#     Remember to export CLAUDE_CONFIG_DIR for all subsequent claude CLI calls
#     in this session.
#
#   NOTE: No branch push is required.  The marketplace source is the ABSOLUTE
#   worktree path on this machine — no remote checkout needed.  A GitHub-repo
#   source would install the default branch (no per-branch flag exists); the
#   absolute local path is therefore preferred for testing an in-progress worktree.
#
# PHASE 1 — Add marketplace + install
# --------------------------------------
#   # Add the marketplace using the absolute worktree path as the source.
#   # The worktree root contains .claude-plugin/marketplace.json which
#   # indexes the gobbi plugin.  <source> is a positional argument (URL,
#   # local path, or GitHub repo).  No flag selects a specific remote branch.
#   #
#   # Optional: pass --sparse ".claude-plugin plugins" to limit the checkout
#   # to only the plugin-relevant dirs.
#   claude plugin marketplace add \
#     /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721
#
#   # List available plugins and identify the gobbi marketplace entry name:
#   claude plugin marketplace list
#   # (note the <marketplace-name> shown for "gobbi")
#
#   # Install using the marketplace-qualified name:
#   claude plugin install gobbi@<marketplace-name-from-list>
#
#   # Validate (strict):
#   claude plugin validate --strict ~/.claude/plugins/cache/<id>/
#   # This must exit 0 before proceeding.
#
#   # Record the cache ID (needed for the allow-set assertion):
#   export GOBBI_PLUGIN_CACHE_ID="<id>"
#
# PHASE 3 — Instrument the installed hook copies for marker emission
# ------------------------------------------------------------------
#   The CANONICAL packaged hook scripts do not emit markers by default.
#   We instrument the INSTALLED-CACHE copies (NOT the packaged source) with
#   a sed one-liner that appends an env-gated marker line.  This is safe because:
#     - The installed-cache is a copy, not the source; reinstall restores it.
#     - Only the marker append is added; the hook body is otherwise unchanged.
#
#   HOOK_ROOT="$HOME/.claude/plugins/cache/${GOBBI_PLUGIN_CACHE_ID}/hooks"
#   MARKER_INJECT='if [[ -n "${GOBBI_HOOK_MARKER_DIR:-}" ]]; then mkdir -p "${GOBBI_HOOK_MARKER_DIR}"; printf '"'"'%s\n'"'"' "$(date -u +%s%N)" >> "${GOBBI_HOOK_MARKER_DIR}/${hook_event_name:-UNKNOWN}"; fi'
#
#   # Inject into session-start.sh (after set -euo pipefail line):
#   sed -i '/^set -euo pipefail/a '"${MARKER_INJECT}" \
#     "${HOOK_ROOT}/session-start.sh"
#
#   # Inject into post-tool-use-agents.sh (after set -uo pipefail line):
#   sed -i '/^set -uo pipefail/a '"${MARKER_INJECT}" \
#     "${HOOK_ROOT}/post-tool-use-agents.sh"
#
#   NOTE: hook_event_name is populated from the Claude Code JSON payload; at
#   the point of injection (before the payload is read), it is not yet set.
#   The scripts read it later.  Use the event name from the hook payload
#   instead — see the refined inject pattern below:
#
#   REFINED INJECT for session-start.sh (reads payload after "payload=$(cat)"):
#   Insert AFTER the `payload="$(cat)"` line:
#
#     if [[ -n "${GOBBI_HOOK_MARKER_DIR:-}" ]]; then
#       mkdir -p "${GOBBI_HOOK_MARKER_DIR}"
#       _event=$(printf '%s' "$payload" | jq -r '.hook_event_name // "SessionStart"')
#       printf '%s\n' "$(date -u +%s)" >> "${GOBBI_HOOK_MARKER_DIR}/${_event}"
#     fi
#
#   Insert the above block via a patch file or manual edit of the installed copy.
#   Example with patch (recommended for reproducibility):
#
#     cat > /tmp/session-start-marker.patch << 'PATCH'
#     --- a/session-start.sh
#     +++ b/session-start.sh
#     @@ -45,6 +45,12 @@
#      payload="$(cat)"
#      [[ -n "$payload" ]] || { printf '%s\n' "session-start.sh: empty stdin — expected JSON payload" >&2; exit 1; }
#     +# GOBBI_HOOK_MARKER_DIR instrumentation (test-only, installed-cache copy only)
#     +if [[ -n "${GOBBI_HOOK_MARKER_DIR:-}" ]]; then
#     +  mkdir -p "${GOBBI_HOOK_MARKER_DIR}"
#     +  _event=$(printf '%s' "$payload" | jq -r '.hook_event_name // "SessionStart"')
#     +  printf '%s\n' "$(date -u +%s)" >> "${GOBBI_HOOK_MARKER_DIR}/${_event}"
#     +fi
#     PATCH
#     patch "${HOOK_ROOT}/session-start.sh" /tmp/session-start-marker.patch
#
#   REFINED INJECT for post-tool-use-agents.sh (reads payload after "payload=$(cat || true)"):
#
#     cat > /tmp/post-tool-use-marker.patch << 'PATCH'
#     --- a/post-tool-use-agents.sh
#     +++ b/post-tool-use-agents.sh
#     @@ -36,6 +36,12 @@
#      payload="$(cat || true)"
#      [[ -n "$payload" ]] || bail "empty stdin — nothing to do"
#     +# GOBBI_HOOK_MARKER_DIR instrumentation (test-only, installed-cache copy only)
#     +if [[ -n "${GOBBI_HOOK_MARKER_DIR:-}" ]]; then
#     +  mkdir -p "${GOBBI_HOOK_MARKER_DIR}"
#     +  _event=$(printf '%s' "$payload" | jq -r '.hook_event_name // "PostToolUse"')
#     +  printf '%s\n' "$(date -u +%s)" >> "${GOBBI_HOOK_MARKER_DIR}/${_event}"
#     +fi
#     PATCH
#     patch "${HOOK_ROOT}/post-tool-use-agents.sh" /tmp/post-tool-use-marker.patch
#
#   Export the marker dir for Claude subprocesses:
#     export GOBBI_HOOK_MARKER_DIR="/tmp/gobbi-hook-markers"
#     mkdir -p "$GOBBI_HOOK_MARKER_DIR"
#
# PHASE 4 — Trigger each hook event EXACTLY ONCE
# ------------------------------------------------
#   All triggers must run in a clean Claude session started with the isolated
#   CLAUDE_CONFIG_DIR.  No active dev .claude/settings.json registrations
#   may be present (DD-8: dev hooks and installed hooks are distinct).
#
#   Trigger 1 — SessionStart:
#     Start a fresh Claude Code session (or use `/clear`).
#     The session-start.sh hook fires once on SessionStart.
#     Expected marker file: $GOBBI_HOOK_MARKER_DIR/SessionStart (1 line)
#
#   Trigger 2 — PostToolUse (exit 0):
#     Inside the Claude session, run one Task/Agent call that exits 0.
#     Example prompt: "Run Task with a trivial shell command: echo ok"
#     (The task must complete successfully — exit 0 — so PostToolUse fires.)
#     Expected marker file: $GOBBI_HOOK_MARKER_DIR/PostToolUse (1 line)
#
#   Trigger 3 — PostToolUseFailure (exit non-zero):
#     Inside the same session, run one Task/Agent call ENGINEERED to fail.
#     Example prompt: "Run Task with: exit 1"
#     (The task must exit non-zero so PostToolUseFailure fires, not PostToolUse.)
#     Expected marker file: $GOBBI_HOOK_MARKER_DIR/PostToolUseFailure (1 line)
#
#   IMPORTANT: run exactly one trigger per event.  More than one trigger of the
#   same event type will produce multiple marker lines and the assertion will FAIL
#   with "expected exactly 1 marker, got N" — which is correct behaviour.
#
# PHASE 5 — Run this script
# --------------------------
#   GOBBI_HOOK_MARKER_DIR=/tmp/gobbi-hook-markers \
#   GOBBI_PLUGIN_CACHE_ID=<id>                    \
#     bash scripts/validate-plugin-hooks-fire-once.sh
#
# PHASE 6 — Cleanup / uninstall
# --------------------------------
#   # Remove the installed plugin and marketplace entry:
#   claude plugin uninstall gobbi
#   claude plugin marketplace remove <marketplace-id>
#
#   # If you used an isolated CLAUDE_CONFIG_DIR:
#   rm -rf "$CLAUDE_CONFIG_DIR"
#
#   # Clear the marker dir:
#   rm -rf "$GOBBI_HOOK_MARKER_DIR"
#
# ============================================================================
# END OF OPERATOR PROCEDURE
# ============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Colour helpers (degrade gracefully when not a tty)
# ---------------------------------------------------------------------------
if [[ -t 1 ]]; then
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RESET='\033[0m'
else
    RED=''; GREEN=''; YELLOW=''; RESET=''
fi

pass() { printf "${GREEN}PASS${RESET}  %s\n" "$*"; }
fail() { printf "${RED}FAIL${RESET}  %s\n" "$*"; FAILURES=$(( FAILURES + 1 )); }
info() { printf "${YELLOW}INFO${RESET}  %s\n" "$*"; }

FAILURES=0

# ---------------------------------------------------------------------------
# Env var guards
# ---------------------------------------------------------------------------
if [[ -z "${GOBBI_HOOK_MARKER_DIR:-}" ]]; then
    printf 'ERROR: GOBBI_HOOK_MARKER_DIR is not set.\n' >&2
    printf 'Set it to the temp dir where the instrumented hooks wrote markers.\n' >&2
    printf 'See the OPERATOR PROCEDURE at the top of this script.\n' >&2
    exit 2
fi

if [[ -z "${GOBBI_PLUGIN_CACHE_ID:-}" ]]; then
    printf 'ERROR: GOBBI_PLUGIN_CACHE_ID is not set.\n' >&2
    printf 'Set it to the installed plugin'"'"'s cache ID shown by:\n' >&2
    printf '  claude plugin marketplace list\n' >&2
    printf 'See the OPERATOR PROCEDURE at the top of this script.\n' >&2
    exit 2
fi

MARKER_DIR="${GOBBI_HOOK_MARKER_DIR}"
CACHE_ROOT="${HOME}/.claude/plugins/cache/${GOBBI_PLUGIN_CACHE_ID}"

printf '\n=== validate-plugin-hooks-fire-once.sh ===\n'
printf 'Marker dir : %s\n' "$MARKER_DIR"
printf 'Cache root : %s\n' "$CACHE_ROOT"
printf '\n'

# ---------------------------------------------------------------------------
# Derive the registered hook-event set from the installed plugin's own
# hooks.json. The events this plugin registers ARE the top-level keys of
# hooks/hooks.json, so deriving them (instead of hardcoding a 3-event list)
# means a future event added to hooks.json — e.g. SessionEnd — is covered here
# automatically, with no edit to this script.
# ---------------------------------------------------------------------------
HOOKS_JSON="${CACHE_ROOT}/hooks/hooks.json"
declare -a REGISTERED_EVENTS=()
if [[ -f "$HOOKS_JSON" ]] && jq -e . "$HOOKS_JSON" >/dev/null 2>&1; then
    readarray -t REGISTERED_EVENTS < <(jq -r '.hooks | keys[]' "$HOOKS_JSON")
    printf 'Registered events (from hooks.json keys): %s\n\n' "${REGISTERED_EVENTS[*]}"
else
    info "installed hooks.json not found or invalid at ${HOOKS_JSON}; cannot derive registered events"
    printf '\n'
fi

# Events the OPERATOR PROCEDURE (PHASE 4) triggers exactly once and that this
# script asserts fire-once on (a missing marker means a skipped trigger -> FAIL).
# This is the operator-exercised subset, bound to PHASE 4 — NOT the registered
# set. Registered events outside this subset (SessionEnd, future events) are
# allow-listed and asserted-if-present (lenient), never required to be triggered.
OPERATOR_TRIGGERED_EVENTS=( "SessionStart" "PostToolUse" "PostToolUseFailure" )

# Membership test, robust to an empty argument list.
in_list() {
    local needle="$1"; shift
    local item
    for item in "$@"; do
        [[ "$item" == "$needle" ]] && return 0
    done
    return 1
}

# ---------------------------------------------------------------------------
# Section 1: Per-event one-marker assertion
# Events: SessionStart, PostToolUse, PostToolUseFailure
# ---------------------------------------------------------------------------
printf '%s\n' '--- Section 1: hook fire-once markers ---'

# check_marker <event> [strict|lenient]
#   strict  (default): a missing marker is a FAIL (operator-triggered event).
#   lenient          : a missing marker is INFO, not FAIL (registered but awkward
#                      to trigger, e.g. SessionEnd) — but a present marker is still
#                      asserted to be exactly-once.
check_marker() {
    local event="$1"
    local mode="${2:-strict}"
    local marker_file="${MARKER_DIR}/${event}"

    if [[ ! -f "$marker_file" ]]; then
        if [[ "$mode" == "lenient" ]]; then
            info "event '${event}' registered but not exercised this run; fires-once not asserted"
        else
            fail "marker file absent for event '${event}': ${marker_file}"
            info "  Trigger missing? See PHASE 4 in the operator procedure."
        fi
        return
    fi

    local count
    count=$(grep -c '' "$marker_file" || true)

    if [[ "$count" -eq 1 ]]; then
        pass "event '${event}' fired exactly once (1 marker line)"
    elif [[ "$count" -eq 0 ]]; then
        fail "event '${event}' marker file exists but is empty"
    else
        fail "event '${event}' fired ${count} times; expected exactly 1"
        info "  Check that only ONE trigger was run per event (PHASE 4)."
    fi
}

# 1a. Operator-triggered events: strict fire-once (a missing marker is a FAIL).
for event in "${OPERATOR_TRIGGERED_EVENTS[@]}"; do
    check_marker "$event" strict
done

# 1b. Registered events NOT in the operator-triggered subset (SessionEnd, and any
#     future hooks.json event): allow-listed + asserted-if-present (lenient).
for event in ${REGISTERED_EVENTS[@]+"${REGISTERED_EVENTS[@]}"}; do
    in_list "$event" "${OPERATOR_TRIGGERED_EVENTS[@]}" && continue
    check_marker "$event" lenient
done

# Also assert no unexpected marker files (extra hook events or double-fires
# from dev .claude/settings.json registrations polluting the marker dir)
printf '\nChecked marker dir contents:\n'
for f in "${MARKER_DIR}"/*; do
    [[ -f "$f" ]] || continue
    basename_f=$(basename "$f")
    lines=$(grep -c '' "$f" || true)
    printf '  %s: %d line(s)\n' "$basename_f" "$lines"
done

# A marker is allowed iff it names a REGISTERED event (derived from hooks.json
# keys) or an operator-triggered event. A SessionEnd marker is therefore allowed
# — SessionEnd is a hooks.json key — and never flagged a dev-registration leak.
UNEXPECTED_MARKERS=0
for f in "${MARKER_DIR}"/*; do
    [[ -f "$f" ]] || continue
    basename_f=$(basename "$f")
    if in_list "$basename_f" "${OPERATOR_TRIGGERED_EVENTS[@]}" ${REGISTERED_EVENTS[@]+"${REGISTERED_EVENTS[@]}"}; then
        :
    else
        fail "unexpected marker file: ${basename_f} — not a registered hooks.json event (dev registration leak?)"
        UNEXPECTED_MARKERS=$(( UNEXPECTED_MARKERS + 1 ))
    fi
done
if [[ "$UNEXPECTED_MARKERS" -eq 0 ]]; then
    pass "no unexpected marker files in marker dir"
fi

printf '\n'

# ---------------------------------------------------------------------------
# Section 2: Installed-cache allow-set assertion
# Expected top-level entries ONLY: .claude-plugin  skills  agents  hooks
# FAIL if any of the following leak-indicator patterns appear:
#   .gobbi/  sessions/  backlogs/  design/  mistakes/  rules/  features/
#   *.md files at the top level (repo docs, README, CHANGELOG etc.)
#   node_modules/  dist/  src/  scripts/
# ---------------------------------------------------------------------------
printf '%s\n' '--- Section 2: installed-cache allow-set ---'

if [[ ! -d "$CACHE_ROOT" ]]; then
    fail "installed-cache dir not found: ${CACHE_ROOT}"
    info "  Is GOBBI_PLUGIN_CACHE_ID correct? Run: claude plugin marketplace list"
    printf '\n--- Summary ---\n'
    printf 'Failures: %d\n' "$FAILURES"
    exit $(( FAILURES > 0 ? 1 : 0 ))
fi

ALLOW_SET=( ".claude-plugin" "skills" "agents" "hooks" )
ALLOW_SET_JOINED=$(printf '%s\n' "${ALLOW_SET[@]}")

# .codex-plugin ships only when the package was installed via Codex; on a Claude
# install it is absent. It is allow-listed (presence must NOT fail) but NOT
# required (absence is informational, not a failure).
OPTIONAL_ALLOW_SET=( ".codex-plugin" )

# Enumerate actual top-level entries
declare -a ACTUAL_ENTRIES=()
for entry in "${CACHE_ROOT}"/*; do
    [[ -e "$entry" ]] || continue
    ACTUAL_ENTRIES+=( "$(basename "$entry")" )
done
# Also check hidden entries (.claude-plugin is hidden)
for entry in "${CACHE_ROOT}"/.*; do
    [[ -e "$entry" ]] || continue
    base="$(basename "$entry")"
    [[ "$base" == "." || "$base" == ".." ]] && continue
    ACTUAL_ENTRIES+=( "$base" )
done

# Deduplicate (allow-set items that appeared in both glob passes)
readarray -t ACTUAL_ENTRIES < <(printf '%s\n' "${ACTUAL_ENTRIES[@]}" | sort -u)

printf 'Installed-cache top-level entries:\n'
for e in "${ACTUAL_ENTRIES[@]}"; do
    printf '  %s\n' "$e"
done
printf '\n'

# Check every actual entry is in the allow-set
ALLOW_VIOLATIONS=0
for e in "${ACTUAL_ENTRIES[@]}"; do
    if printf '%s\n' "${ALLOW_SET[@]}" | grep -qx "$e"; then
        pass "allow-set member present: ${e}"
    elif printf '%s\n' "${OPTIONAL_ALLOW_SET[@]}" | grep -qx "$e"; then
        pass "optional allow-set member present: ${e}"
    else
        fail "UNEXPECTED entry in installed-cache: '${e}' — not in allow-set"
        ALLOW_VIOLATIONS=$(( ALLOW_VIOLATIONS + 1 ))
    fi
done

# Check every REQUIRED allow-set member is actually present
for expected in "${ALLOW_SET[@]}"; do
    if printf '%s\n' "${ACTUAL_ENTRIES[@]}" | grep -qx "$expected"; then
        pass "required allow-set entry present: ${expected}"
    else
        fail "required allow-set entry MISSING: ${expected}"
    fi
done

# Optional members: present -> info, absent -> info. Never a failure.
for opt in "${OPTIONAL_ALLOW_SET[@]}"; do
    if printf '%s\n' "${ACTUAL_ENTRIES[@]}" | grep -qx "$opt"; then
        info "optional allow-set entry present: ${opt} (Codex-installed cache)"
    else
        info "optional allow-set entry absent: ${opt} (not a failure; Claude-only install)"
    fi
done

# Extra leak-indicator scan (belt-and-suspenders against nested leaks)
LEAK_PATTERNS=( ".gobbi" "sessions" "backlogs" "design" "mistakes" "rules" "features" "node_modules" "dist" "src" "scripts" )
for pat in "${LEAK_PATTERNS[@]}"; do
    if [[ -e "${CACHE_ROOT}/${pat}" ]]; then
        fail "LEAK: '${pat}' exists in installed-cache (must not appear)"
    fi
done

# Check for .md files at cache root (leaked repo docs)
MD_LEAKS=0
for f in "${CACHE_ROOT}"/*.md; do
    [[ -f "$f" ]] || continue
    fail "LEAK: .md file at installed-cache root: $(basename "$f")"
    MD_LEAKS=$(( MD_LEAKS + 1 ))
done
if [[ "$MD_LEAKS" -eq 0 ]]; then
    pass "no .md files leaked to installed-cache root"
fi

printf '\n'

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
printf '%s\n' '--- Summary ---'
if [[ "$FAILURES" -eq 0 ]]; then
    printf "${GREEN}ALL ASSERTIONS PASSED${RESET}\n"
    printf 'Hooks fire exactly once per event; installed-cache allow-set is clean.\n'
    exit 0
else
    printf "${RED}%d ASSERTION(S) FAILED${RESET} — review FAIL lines above.\n" "$FAILURES"
    exit 1
fi
