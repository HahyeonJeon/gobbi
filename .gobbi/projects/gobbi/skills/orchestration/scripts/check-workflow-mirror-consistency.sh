#!/usr/bin/env bash
# check-workflow-mirror-consistency.sh — orchestration/workflow .claude/ mirror gate.
#
# Purpose:
#   The orchestration/workflow/ docs live canonically under
#   .gobbi/projects/<name>/skills/orchestration/workflow/. The Claude Code runtime
#   surface mirrors each doc as a PER-FILE symlink at
#   .claude/skills/orchestration/workflow/<f>. When a new workflow doc lands in the
#   canonical dir but its .claude/ mirror symlink does not (or the symlink dangles),
#   the runtime cannot resolve the doc — the F1 defect: production.md was added to
#   the canonical dir, the .claude/ symlink was missing. This guard sources the
#   canonical filename list and confirms every doc has a RESOLVING entry in the
#   .claude/ mirror.
#
#   It checks ONLY the .claude/ per-file mirror. It deliberately does NOT require
#   per-file entries under .agents/skills/orchestration/..., because
#   .agents/skills/orchestration is a DIRECTORY-level symlink that resolves every
#   child automatically — treating it as a per-file mirror would false-fail.
#
# Self-location:
#   The script self-locates its canonical source (the same pattern as
#   check-residual-vocab.sh): the canonical workflow dir is the script's
#   `../workflow` sibling, so the source of truth is fixed regardless of CWD or arg.
#
# Args:
#   [<WT>] — OPTIONAL worktree root whose .claude/ mirror to check. Defaults to the
#            self-located worktree root (three levels above the project dir). The
#            canonical filename list is ALWAYS sourced from this script's own
#            project workflow dir, so passing a <WT> only redirects WHICH .claude/
#            mirror is checked — useful for an adversarial probe against a scratch
#            copy without mutating the real tree.
#
# Output:
#   stdout — "MISSING <f>" per canonical doc with no resolving mirror entry, then a
#            one-line summary. On a clean run prints "ALL <N> WORKFLOW DOCS MIRRORED".
# Exit: 0 = every canonical workflow doc resolves in the .claude/ mirror;
#       1 = at least one missing / dangling; 2 = bad args or structure not found.

set -uo pipefail

SELF="check-workflow-mirror-consistency.sh"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: check-workflow-mirror-consistency.sh [<worktree-root>]
  Confirms every orchestration/workflow/*.md canonical doc has a resolving per-file
  entry in .claude/skills/orchestration/workflow/. With no arg, uses the script's
  own worktree root. Checks ONLY the .claude/ per-file mirror (the .agents/ mirror
  is a directory-level symlink and resolves automatically). Prints "MISSING <f>"
  per gap + a summary. Exit 0 = all mirrored, 1 = gap found, 2 = bad args.
EOF
}

# ---------------------------------------------------------------------------
# Self-locate the canonical source of truth (the project's own workflow dir) and
# the project dir — the same self-location pattern as check-residual-vocab.sh.
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CANON_DIR="$(cd "$SCRIPT_DIR/../workflow" 2>/dev/null && pwd || true)"  # skills/orchestration/workflow
PROJ_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"                          # .gobbi/projects/<name>

# ---------------------------------------------------------------------------
# Resolve the worktree root whose .claude/ mirror to check.
# ---------------------------------------------------------------------------
if [ "$#" -gt 1 ]; then
    log "at most one arg: the worktree root"
    usage
    exit 2
fi

if [ "$#" -eq 1 ]; then
    WT="$1"
    if [ ! -d "$WT" ]; then
        log "not a directory: $WT"
        exit 2
    fi
    WT="$(cd "$WT" && pwd)"
else
    # Default: the worktree root is three levels above the project dir
    # (<WT>/.gobbi/projects/<name> -> <WT>).
    WT="$(cd "$PROJ_DIR/../../.." && pwd)"
fi

MIRROR_DIR="$WT/.claude/skills/orchestration/workflow"

if [ -z "$CANON_DIR" ] || [ ! -d "$CANON_DIR" ]; then
    log "canonical workflow dir not found: $SCRIPT_DIR/../workflow"
    exit 2
fi

# ---------------------------------------------------------------------------
# For every canonical workflow doc, confirm a resolving entry exists in the
# .claude/ mirror. `test -e` follows symlinks, so a dangling mirror symlink
# (wrong target depth) is reported MISSING just like an absent one.
# ---------------------------------------------------------------------------
missing=0
checked=0
for path in "$CANON_DIR"/*.md; do
    [ -e "$path" ] || continue            # guard the no-match glob
    f="$(basename "$path")"
    checked=$((checked + 1))
    if [ -e "$MIRROR_DIR/$f" ]; then
        continue
    fi
    printf 'MISSING %s\n' "$f"
    missing=$((missing + 1))
done

if [ "$checked" -eq 0 ]; then
    log "no canonical workflow docs found under $CANON_DIR"
    exit 2
fi

if [ "$missing" -gt 0 ]; then
    printf '%s: %d MISSING / %d canonical workflow doc(s) — .claude/ mirror incomplete\n' "$SELF" "$missing" "$checked"
    exit 1
fi

printf '%s: ALL %d WORKFLOW DOCS MIRRORED in .claude/\n' "$SELF" "$checked"
exit 0
