#!/usr/bin/env bash
# check-plugin-invocability.sh
#
# AUTONOMOUS DELIVERABLE — operator-assisted validation script.
# Tests the DD-9 auto-grant premise: when the gobbi plugin is installed, ALL
# skills and agents in its package are invocable without explicit allow-list
# entries in .claude/settings.json.
#
# The skill NOT listed in the dev .claude/settings.json allow-list is:
#   gobbi:codex              (skill)
# Plus one agent (also validated):
#   gobbi:leader             (agent — also in allow-list, but tested for symmetry)
#
# DD-9 says installed plugins auto-grant their full skill/agent set.
# If TRUE: the omitted skill loads without permission refusal.
# If FALSE: Claude shows a permission refusal for at least one.
#
# This script records the operator-observed TRUE/FALSE result and, given an
# explicit operator-supplied FALSE verdict, shows the conditional-edit command
# that would add the missing Skill() entry to .claude/settings.json.
#
# !! THE CONDITIONAL EDIT DOES NOT RUN AUTOMATICALLY !!
# It fires ONLY when the operator explicitly passes --apply-false to this script
# after confirming the observed result is FALSE.
#
# Usage:
#   # Observing (no edit):
#   AUTOGRANT_RESULT=TRUE   bash scripts/check-plugin-invocability.sh
#   AUTOGRANT_RESULT=FALSE  bash scripts/check-plugin-invocability.sh
#
#   # Applying the settings.json fix (only when result is FALSE and you have
#   # manually verified the observation):
#   AUTOGRANT_RESULT=FALSE  bash scripts/check-plugin-invocability.sh --apply-false
#
# ============================================================================
# OPERATOR PROCEDURE
# ============================================================================
# Follow this exact sequence to determine the TRUE/FALSE result.
#
# PREREQUISITES
# --------------
#   - The gobbi plugin must be installed (see validate-plugin-hooks-fire-once.sh
#     PHASE 1–2 for install procedure).
#   - Use the same isolated CLAUDE_CONFIG_DIR that was used for the install:
#       export CLAUDE_CONFIG_DIR="<the temp dir used during install>"
#   - Confirm the plugin is installed:
#       claude plugin list
#       # Must show: gobbi (installed)
#
# STEP 1 — Open a fresh Claude session
# --------------------------------------
#   Start Claude Code fresh (or use `/clear`) so the installed-plugin allow-list
#   is active.  Do NOT have the dev .claude/settings.json in scope — the test
#   is specifically for the installed-plugin auto-grant path (DD-8 split).
#
# STEP 2 — Invoke the omitted skill
# ----------------------------------------
#   In the Claude session, type the slash command and observe the result:
#
#     /gobbi:codex
#
#   Observe:
#     SUCCESS indicator: The skill loads — Claude reads the SKILL.md and responds
#       with its content or begins executing the skill. No warning about permissions.
#     REFUSAL indicator: Claude shows a message like "Permission denied",
#       "This skill is not allowed", "gobbi:codex is not in the allow list",
#       or similar. The exact text may vary but the key signal is that the skill
#       did NOT load its SKILL.md content.
#
# STEP 3 — Invoke one agent
# --------------------------
#   In the same session, also invoke the leader agent:
#
#     /gobbi:leader
#     (or: launch a Task using the leader agent)
#
#   Observe: does the agent load (TRUE) or show a refusal (FALSE)?
#
# STEP 4 — Determine overall result
# -----------------------------------
#   TRUE  = ALL of {gobbi:codex, gobbi:leader} load
#           without refusal.  DD-9 auto-grant is confirmed.
#   FALSE = ANY of the above shows a refusal.  DD-9 auto-grant is NOT active or
#           is incomplete.  The conditional-edit section of this script shows the
#           remediation command.
#
# STEP 5 — Run this script to record the result
# -----------------------------------------------
#   Record TRUE:
#     AUTOGRANT_RESULT=TRUE bash scripts/check-plugin-invocability.sh
#
#   Record FALSE (observation only — no edit):
#     AUTOGRANT_RESULT=FALSE bash scripts/check-plugin-invocability.sh
#
#   Apply FALSE fix (ONLY after manual confirmation the result is FALSE):
#     AUTOGRANT_RESULT=FALSE bash scripts/check-plugin-invocability.sh --apply-false
#
# ============================================================================
# END OF OPERATOR PROCEDURE
# ============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Colour helpers
# ---------------------------------------------------------------------------
if [[ -t 1 ]]; then
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RESET='\033[0m'
else
    RED=''; GREEN=''; YELLOW=''; CYAN=''; RESET=''
fi

info()  { printf "${CYAN}INFO${RESET}   %s\n" "$*"; }
pass()  { printf "${GREEN}PASS${RESET}   %s\n" "$*"; }
warn()  { printf "${YELLOW}WARN${RESET}   %s\n" "$*"; }
error() { printf "${RED}ERROR${RESET}  %s\n" "$*"; }

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
APPLY_FALSE=false
for arg in "$@"; do
    case "$arg" in
        --apply-false) APPLY_FALSE=true ;;
        *)
            error "Unknown argument: ${arg}"
            printf 'Usage: AUTOGRANT_RESULT=TRUE|FALSE bash %s [--apply-false]\n' "$0" >&2
            exit 2
            ;;
    esac
done

# ---------------------------------------------------------------------------
# Validate AUTOGRANT_RESULT env var
# ---------------------------------------------------------------------------
case "${AUTOGRANT_RESULT:-}" in
    TRUE|FALSE) ;;
    "")
        error "AUTOGRANT_RESULT is not set."
        printf 'Set it to TRUE or FALSE based on the observation in STEP 4.\n' >&2
        printf 'See the OPERATOR PROCEDURE at the top of this script.\n' >&2
        exit 2
        ;;
    *)
        error "AUTOGRANT_RESULT must be exactly 'TRUE' or 'FALSE'; got: '${AUTOGRANT_RESULT}'"
        exit 2
        ;;
esac

# ---------------------------------------------------------------------------
# Guard: --apply-false only makes sense when result is FALSE
# ---------------------------------------------------------------------------
if [[ "$APPLY_FALSE" == "true" && "$AUTOGRANT_RESULT" != "FALSE" ]]; then
    error "--apply-false was passed but AUTOGRANT_RESULT is '${AUTOGRANT_RESULT}', not FALSE."
    printf 'Only pass --apply-false when the observation confirmed a refusal (FALSE).\n' >&2
    exit 2
fi

# ---------------------------------------------------------------------------
# What is being tested (informational)
# ---------------------------------------------------------------------------
printf '\n=== check-plugin-invocability.sh ===\n'
printf 'DD-9 premise: installed plugins auto-grant their full skill/agent set.\n'
printf '\nSkill under test (omitted from dev .claude/settings.json allow-list):\n'
printf '  gobbi:codex\n'
printf '\nAgent under test (present in allow-list; validated for symmetry):\n'
printf '  gobbi:leader\n'
printf '\nObserved result: %s\n\n' "${AUTOGRANT_RESULT}"

# ---------------------------------------------------------------------------
# Section 1: Record the result
# ---------------------------------------------------------------------------
printf '%s\n' '--- Section 1: DD-9 auto-grant result ---'

if [[ "$AUTOGRANT_RESULT" == "TRUE" ]]; then
    pass "gobbi:codex loaded without refusal (operator-observed)"
    pass "gobbi:leader loaded without refusal (operator-observed)"
    pass "DD-9 auto-grant: TRUE — all tested skills/agents load when installed"
    printf '\n'
    info "No .claude/settings.json edit required."
    info "The omitted skill (codex) is auto-granted"
    info "by the installed plugin; no explicit Skill() entry is needed."
    printf '\n'
    printf '%s\n' '--- Summary ---'
    printf "${GREEN}AUTOGRANT = TRUE: DD-9 confirmed. No settings.json edit needed.${RESET}\n"
    exit 0
fi

# AUTOGRANT_RESULT == FALSE
warn "DD-9 auto-grant: FALSE — at least one skill/agent showed a refusal"
warn "The following may require an explicit allow-list entry:"
warn "  Skill(codex)                  [maps to gobbi:codex]"
printf '\n'

# ---------------------------------------------------------------------------
# Section 2: Conditional-edit helper (fires ONLY if --apply-false is passed)
# ---------------------------------------------------------------------------
printf '%s\n' '--- Section 2: conditional settings.json edit ---'

# Locate the settings.json in the active project (dev registration file)
# This is the worktree-local .claude/settings.json (DD-8 dev-side file).
WORKTREE_ROOT="$(git -C "$(dirname "$(realpath "$0")")" rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$WORKTREE_ROOT" ]]; then
    # Fallback: compute relative to script location
    WORKTREE_ROOT="$(cd "$(dirname "$(realpath "$0")")/.." && pwd)"
fi
SETTINGS_JSON="${WORKTREE_ROOT}/.claude/settings.json"

if [[ "$APPLY_FALSE" == "false" ]]; then
    info "Observation mode only (--apply-false not passed)."
    info "No .claude/settings.json edit will be performed."
    printf '\n'
    info "If you have confirmed AUTOGRANT=FALSE and want to apply the fix, run:"
    printf '\n'
    printf '  AUTOGRANT_RESULT=FALSE bash scripts/check-plugin-invocability.sh --apply-false\n\n'
    info "The fix adds this entry to .claude/settings.json permissions.allow:"
    printf '  "Skill(codex)"\n'
    printf '\n'
    printf '%s\n' '--- Summary ---'
    printf "${YELLOW}AUTOGRANT = FALSE: settings.json edit needed but not applied.${RESET}\n"
    printf 'Re-run with --apply-false after manual confirmation to apply.\n'
    exit 0
fi

# --apply-false: perform the conditional edit now
printf '\n'
warn "--apply-false is set. Applying settings.json edit NOW."
printf '\n'

if [[ ! -f "$SETTINGS_JSON" ]]; then
    error "settings.json not found at: ${SETTINGS_JSON}"
    error "Cannot apply edit. Create the file or set WORKTREE_ROOT correctly."
    exit 1
fi

# Verify jq is available
if ! command -v jq &>/dev/null; then
    error "jq not found on PATH — required to edit settings.json"
    exit 1
fi

# Read current allow list
CURRENT_ALLOW=$(jq -r '.permissions.allow // [] | .[]' "$SETTINGS_JSON")

# Check if already present (idempotent)
CODEX_PRESENT=false

if printf '%s\n' "$CURRENT_ALLOW" | grep -qxF 'Skill(codex)'; then
    CODEX_PRESENT=true
fi

if [[ "$CODEX_PRESENT" == "true" ]]; then
    pass "Skill(codex) already present in allow-list — no edit needed"
    printf '\n%s\n' '--- Summary ---'
    printf 'AUTOGRANT = FALSE but the entry is already in the allow-list. No change made.\n'
    exit 0
fi

# Back up settings.json before editing
BACKUP="${SETTINGS_JSON}.bak.$(date -u +%Y%m%dT%H%M%SZ)"
cp "$SETTINGS_JSON" "$BACKUP"
info "Backed up settings.json to: ${BACKUP}"

# Build the updated JSON: append missing Skill() entries
UPDATED=$(jq '
    .permissions.allow = (
        (.permissions.allow // [])
        | (if (index("Skill(codex)") == null)
           then . + ["Skill(codex)"]
           else . end)
    )
' "$SETTINGS_JSON")

# Validate the updated JSON before writing
if ! printf '%s' "$UPDATED" | jq -e . >/dev/null 2>&1; then
    error "jq produced invalid JSON — aborting edit. Backup at: ${BACKUP}"
    exit 1
fi

printf '%s\n' "$UPDATED" > "$SETTINGS_JSON"

if [[ "$CODEX_PRESENT" == "false" ]]; then
    pass "Added 'Skill(codex)' to .claude/settings.json permissions.allow"
fi

printf '\nVerify the updated allow-list:\n'
jq '.permissions.allow' "$SETTINGS_JSON"

printf '\n%s\n' '--- Summary ---'
printf "${GREEN}AUTOGRANT = FALSE: settings.json patched. Backup at: %s${RESET}\n" "$BACKUP"
printf 'Restart Claude Code or run /clear for the new permissions to take effect.\n'
exit 0
