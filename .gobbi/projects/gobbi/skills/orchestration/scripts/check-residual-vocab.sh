#!/usr/bin/env bash
# check-residual-vocab.sh — residual stale-vocabulary gate for the
# memorization -> {memory, record} rename (decision D18, the hardened GATE-C).
#
# Purpose:
#   The task-11 GATE-C grepped only the SWEPT forms (path refs + storage prose +
#   word-boundary CAPS MEMORIZATION). It was BLIND to the same stale vocabulary in
#   OTHER syntactic forms — skill NAMES, agent-wrapper capability descriptions, and
#   the value-feature pipeline label — which produced 5 surviving gaps (task 07b
#   G1-G5). This guard keys verification to the renamed VOCABULARY (every form),
#   not to the form the editor happened to touch.
#
#   It is the lesson of mistakes/sweep-grep-literal-loop-name-blindspot.md baked
#   into a reusable gate: grep the WHOLE vocabulary, then trust an explicit
#   allowlist of known-legitimate retentions instead of a form-specific grep.
#
# What it matches (case-insensitive, the full rename vocabulary):
#   - "memorization"          — the old skill name / sub-phase / pipeline word
#   - "session memory" / "session-memory"   — old storage-tier prose
#   - "project memory" / "project-memory"   — old storage-tier prose
#   - word-boundary CAPS "MEMORIZATION"      — the all-caps sub-phase form
#
# What it EXCLUDES (never reports):
#   1. The 21 historical EXCLUDE files — frozen records whose old vocabulary is a
#      true historical fact at write time (features/workflow/**, the 2026-06-08
#      redesign note, the persist-session backlog, the sweep-grep-literal mistake,
#      the two layer2 sweep/verify mistakes, CHANGELOG.md). Same principle as
#      memory/rules.md sec.4.6: frozen history is not re-prosed.
#   2. The D7-LEGIT retentions — live files whose "memorization" / "Memorize" use
#      is a CORRECT, intentional reference (the Wrap-up promotion STAGE, a
#      historical-filename example, and the generic Study->...->Memorize lifecycle
#      verb shared by every role doc). Each is enumerated below with its reason.
#
# What it does NOT exclude (deliberately):
#   - .claude/CLAUDE.md and .codex/AGENTS.md still carry the old 5-step framing.
#     Those are task 10's sweep surface, NOT allowlisted here: allowlisting them
#     would MASK a task-10 miss. The default full-tree scan WILL flag them until
#     task 10 sweeps them; task 11 runs this gate AFTER task 10, when they are
#     clean. For a task-07b-scoped proof, pass the swept surfaces as path args.
#
# Args:
#   Zero or more files and/or directories. Directories are walked for text files.
#   With NO args, scans the default full live-rename surface (see DEFAULT_SCAN).
#
# Output:
#   stdout — "RESIDUAL: <file>:<line>: <match>" per non-allowlisted hit, then a
#            one-line summary. On a clean run, prints "NO RESIDUAL VOCAB".
# Exit: 0 = no residual vocab; 1 = at least one residual; 2 = bad args.

set -uo pipefail

SELF="check-residual-vocab.sh"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: check-residual-vocab.sh [<file-or-dir> ...]
  Greps the rename vocabulary (memorization / session(-)memory / project(-)memory
  / CAPS MEMORIZATION, case-insensitive) across the given paths (default: the full
  live-rename surface). Reports every NON-allowlisted hit as
  "RESIDUAL: <file>:<line>: <match>" and exits 1; prints "NO RESIDUAL VOCAB" and
  exits 0 when clean. Bad args -> exit 2.
EOF
}

# ---------------------------------------------------------------------------
# Resolve the canonical project root from this script's own location, so the
# default scan and the allowlist resolve correctly regardless of caller CWD.
# This script lives at <proj>/skills/orchestration/scripts/<self>.
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJ_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"          # <proj> = .gobbi/projects/gobbi
SK="$PROJ_DIR/skills"
# The repo root holds .claude / .codex / plugins; it is <proj>/../../.. .
REPO_ROOT="$(cd "$PROJ_DIR/../../.." && pwd)"

# ---------------------------------------------------------------------------
# The rename vocabulary — one alternation, every form. Case-insensitive (-i)
# covers "memorization" AND "MEMORIZATION"; the explicit CAPS \bMEMORIZATION\b
# alternative is redundant under -i but kept so the pattern documents the form.
# ---------------------------------------------------------------------------
VOCAB='memorization|session[- ]memory|project[- ]memory'

# ---------------------------------------------------------------------------
# EXCLUDE path patterns — the 21 historical EXCLUDE files (matched by path
# substring, so features/workflow/** is covered as a whole tree). A hit inside
# any of these is frozen history, never a residual.
# ---------------------------------------------------------------------------
is_excluded_path() {
    local f="$1"
    case "$f" in
        */features/workflow/*)                       return 0 ;;  # 9-file redesign feature tree (frozen)
        */notes/2026-06-08-*)                         return 0 ;;  # session-memory-redesign note (frozen)
        */backlogs/persist-session-*)                 return 0 ;;  # persist-session-memory backlog (frozen)
        */mistakes/sweep-grep-literal-*)              return 0 ;;  # the originating sweep mistake (quotes old vocab)
        */skills/mistake/layer2-sweep-grep-form-specific-*) return 0 ;;  # layer2 copy (quotes old vocab)
        */skills/mistake/layer2-verify-state-from-authoritative-*) return 0 ;;  # layer2 copy (quotes old vocab)
        */CHANGELOG.md)                               return 0 ;;  # changelog records the rename as history
        */skills/orchestration/scripts/check-residual-vocab.sh) return 0 ;;  # this gate's own source quotes the vocab it hunts
    esac
    return 1
}

# ---------------------------------------------------------------------------
# D7-LEGIT allowlist — live (file:line) hits whose old-vocab use is CORRECT and
# intentional AFTER the task-07b G1-G5 fix. Each entry is "file-substring|regex
# the matched line must satisfy" so a future EDIT to that line (that drops the
# legit framing) re-exposes it as a residual. Keyed by the legitimate phrasing,
# not by line number, so the allowlist survives line drift.
#
#   1. memory/memory-map.md — "memorization stage": the Wrap-up promotion STAGE
#      is legitimately named the memorization stage (D7 lowercase-stage retention).
#   2. memory/templates/notes.md — "2026-05-11-memorization-skill-refactor.md":
#      a historical filename used as a notes-naming EXAMPLE (D7 retention).
#   3. agents/{manager,executor,leader,assistant}.md — "### Memorize": the generic
#      Study->Plan->Execute->Verify->Memorize lifecycle VERB heading shared by every
#      role doc; not the per-loop RECORD sub-phase (G5: leave).
#   4. delegation/templates/{leader,executor,assistant}.md — "...Verify -> Memorize
#      lifecycle": the same generic lifecycle-verb reference in the delegation
#      template body.
#   5. wrap-up/SKILL.md — the Wrap-up "Memorization" STAGE 2 name introduced by
#      task 09 (D7: "memorization" = the wrap-up stage-2 promotion stage). Five
#      legit phrasings tie the word to stage 2: the stage-table row 2 cell
#      ("Memorization** (promotion:"), the D7 defining statement
#      ('"Memorization" names stage 2'), the step-table Stage column
#      ("**2 — memorization**", 4 rows), the routing-table contract line
#      ("stage 2 (memorization)"), and the RECORD-vs-stage disambiguation
#      ("memorization** stage (stage 2 of the WORK"). Each binds the word to
#      stage 2, so a genuinely-stale bare "memorization" still fails the match.
#   6. wrap-up/evaluation.md — the same stage-2 name in the eval intro
#      ("Stage 2 (memorization) is the promotion under evaluation").
# ---------------------------------------------------------------------------
is_allowlisted() {
    local file="$1" line="$2"
    case "$file" in
        */skills/memory/memory-map.md)
            [[ "$line" == *'memorization** stage'* || "$line" == *'memorization* stage'* || "$line" == *'memorization stage'* ]] && return 0 ;;
        */skills/memory/templates/notes.md)
            [[ "$line" == *'memorization-skill-refactor'* ]] && return 0 ;;
        */agents/manager.md|*/agents/executor.md|*/agents/leader.md|*/agents/assistant.md)
            [[ "$line" == '### Memorize'* ]] && return 0 ;;
        */skills/delegation/templates/leader.md|*/skills/delegation/templates/executor.md|*/skills/delegation/templates/assistant.md)
            [[ "$line" == *'Memorize lifecycle'* ]] && return 0 ;;
        */skills/wrap-up/SKILL.md)
            [[ "$line" == *'Memorization** (promotion:'*       \
            || "$line" == *'"Memorization" names stage 2'*     \
            || "$line" == *'**2 — memorization**'*             \
            || "$line" == *'stage 2 (memorization)'*           \
            || "$line" == *'memorization** stage (stage 2 of the WORK'* ]] && return 0 ;;
        */skills/wrap-up/evaluation.md)
            [[ "$line" == *'Stage 2 (memorization)'* ]] && return 0 ;;
    esac
    return 1
}

# ---------------------------------------------------------------------------
# Resolve the scan targets. With no args, scan the full live-rename surface.
# ---------------------------------------------------------------------------
targets=()
if [ "$#" -eq 0 ]; then
    for d in \
        "$SK" \
        "$PROJ_DIR/agents" \
        "$PROJ_DIR/hooks" \
        "$REPO_ROOT/.claude" \
        "$REPO_ROOT/.codex" \
        "$REPO_ROOT/plugins"; do
        [ -e "$d" ] && targets+=("$d")
    done
else
    for arg in "$@"; do
        if [ -e "$arg" ]; then
            targets+=("$arg")
        else
            log "no such file or directory: $arg"
            exit 2
        fi
    done
fi

if [ "${#targets[@]}" -eq 0 ]; then
    log "no scan targets resolved"
    exit 2
fi

# ---------------------------------------------------------------------------
# Scan. grep -r is symlink-following-safe here: -r does NOT traverse symlinked
# dirs and skips symlinked files, so mirrored .claude/.codex/plugins symlinks are
# scanned once via their canonical target (whichever target dir is also in the
# list) and never double-counted. -I skips binary files. -n gives line numbers.
# ---------------------------------------------------------------------------
residual=0
scanned_hits=0

while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    # hit form: <file>:<lineno>:<line-content>
    file="${hit%%:*}"
    rest="${hit#*:}"
    lineno="${rest%%:*}"
    content="${rest#*:}"
    scanned_hits=$((scanned_hits + 1))

    if is_excluded_path "$file"; then
        continue
    fi
    if is_allowlisted "$file" "$content"; then
        continue
    fi
    printf 'RESIDUAL: %s:%s: %s\n' "$file" "$lineno" "$content"
    residual=$((residual + 1))
done < <(grep -rniE "$VOCAB" "${targets[@]}" 2>/dev/null | sort -u)

if [ "$residual" -gt 0 ]; then
    printf '%s: %d residual(s) found (%d total vocab hits scanned).\n' "$SELF" "$residual" "$scanned_hits"
    exit 1
fi

printf 'NO RESIDUAL VOCAB (%d vocab hits scanned, all excluded or allowlisted)\n' "$scanned_hits"
exit 0
