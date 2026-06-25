#!/usr/bin/env bash
# check-layer2-source.sh — layer2-source target-resolution gate for the
# memory-tree migration (ideation insight I5).
#
# Purpose:
#   A Layer-2 mistake copy under skills/mistake/ records its origin in a
#   `layer2-source:` frontmatter field — the path(s) of the Layer-1 project
#   mistake it was promoted from. The three named link guards
#   (check-markdown-links.sh etc.) do NOT check this YAML field, so a moved or
#   renamed Layer-1 mistake silently DANGLES its layer2-source ref. This guard
#   closes that gap: it finds every `layer2-source:` field, SPLITS ` + `-joined
#   multi-target values (one field can name two sources), and asserts each
#   target path resolves on disk.
#
# Why the split matters (I5 / adversarial A2):
#   skills/mistake/layer2-verify-state-from-authoritative-source-not-proxy.md
#   carries a multi-target field:
#     layer2-source: <pathA> + <pathB>
#   A naive "does the field's value resolve?" check would test the whole
#   "<pathA> + <pathB>" string as one path and miss both. This guard splits on
#   " + " and resolves EACH target independently.
#
# Path resolution:
#   layer2-source values are REPO-RELATIVE paths (they start with
#   ".gobbi/projects/<name>/..."). They resolve against the worktree root passed
#   as the first arg: <WT>/<target>. Pass the worktree absolute root.
#
# Args:
#   <WT> — the worktree (or repo) root to scan AND to resolve targets against.
#          Required. With no arg the script errors (exit 2) — the resolution base
#          is never guessed.
#
# Output:
#   stdout — "LIVE:     <field-file>: <target>" for each target that resolves,
#            "DANGLING: <field-file>: <target>" for each that does not, then a
#            one-line summary "N LIVE / M DANGLING".
# Exit: 0 = every target resolves (0 dangling); 1 = at least one dangling target;
#       2 = bad args.

set -uo pipefail

SELF="check-layer2-source.sh"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: check-layer2-source.sh <worktree-root>
  Finds every `layer2-source:` frontmatter field under <worktree-root>, splits
  ` + `-joined multi-target values, and resolves each target path against
  <worktree-root> (the values are repo-relative). Prints "LIVE: ..." /
  "DANGLING: ..." per target and a "N LIVE / M DANGLING" summary. Exits 0 when
  every target resolves, 1 when any dangles, 2 on bad args.
EOF
}

# ---------------------------------------------------------------------------
# Resolve the worktree root (scan surface + resolution base).
# ---------------------------------------------------------------------------
if [ "$#" -ne 1 ]; then
    log "exactly one arg required: the worktree root"
    usage
    exit 2
fi

WT="$1"
if [ ! -d "$WT" ]; then
    log "not a directory: $WT"
    exit 2
fi
# Normalize to an absolute path so target resolution is CWD-independent.
WT="$(cd "$WT" && pwd)"

# ---------------------------------------------------------------------------
# Scan. The `layer2-source:` field is a frontmatter line, so anchor at line
# start (`^layer2-source:`) to ignore prose mentions of the word in document
# bodies. -I skips binary files; grep -r does not follow symlinked dirs, so
# mirrored copies are not double-scanned.
# ---------------------------------------------------------------------------
live=0
dangling=0

while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    # hit form: <file>:<line-content>   (grep -H, no -n)
    file="${hit%%:*}"
    value="${hit#*:}"
    # Strip the leading "layer2-source:" key, leaving the value string.
    value="${value#layer2-source:}"

    # Split the value on " + " into one-or-more targets. Trim surrounding
    # whitespace from each side. A field with no " + " yields a single target.
    # Use a literal " + " delimiter (sed) then read each non-empty token.
    targets_str="$(printf '%s' "$value" | sed 's/ + /\n/g')"
    while IFS= read -r target; do
        # Trim leading/trailing whitespace.
        target="${target#"${target%%[![:space:]]*}"}"
        target="${target%"${target##*[![:space:]]}"}"
        [ -z "$target" ] && continue
        if [ -e "$WT/$target" ]; then
            printf 'LIVE:     %s: %s\n' "$file" "$target"
            live=$((live + 1))
        else
            printf 'DANGLING: %s: %s\n' "$file" "$target"
            dangling=$((dangling + 1))
        fi
    done <<< "$targets_str"
done < <(grep -rHI '^layer2-source:' --include='*.md' "$WT" 2>/dev/null | sort -u)

printf '%s: %d LIVE / %d DANGLING\n' "$SELF" "$live" "$dangling"

if [ "$dangling" -gt 0 ]; then
    exit 1
fi
exit 0
