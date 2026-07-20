#!/usr/bin/env bash
# check-markdown-links.sh — relative-link resolution gate for markdown docs.
#
# Purpose:
#   Closes the gap a token-grep verify cannot see: when a markdown file MOVES,
#   its relative links still spell the same text but no longer resolve from the
#   file's new directory. This guard extracts every markdown relative link and
#   tests that each target resolves relative to the LINKING file's own directory.
#
#   It checks two link forms:
#     - inline:           [text](target)
#     - reference-style:  [label]: target
#   It IGNORES (never reports) links that are not local relative paths:
#     - absolute URLs:    http://… https://… mailto:… (any scheme://)
#     - pure anchors:     [text](#section)   (in-document fragment only)
#   For a checked link, any trailing #anchor or ?query is stripped before
#   resolving the path part (the path must exist; anchor validity is out of
#   scope — this guard verifies PATH resolution, not heading anchors).
#
# Args:
#   One or more files and/or directories. Directories are walked for *.md.
#   At least one arg is required.
#
# Output:
#   stdout — "BROKEN: <linking-file> -> <target>" per unresolved link, then a
#            one-line summary. On a clean run, prints "ALL LINKS RESOLVE".
# Exit: 0 = every relative link resolves; 1 = at least one broken link;
#       2 = bad args (no input, or a path that does not exist).

set -uo pipefail

SELF="check-markdown-links.sh"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: check-markdown-links.sh <file-or-dir> [<file-or-dir> ...]
  Verifies every markdown relative link (inline ](path) and reference ]: path)
  resolves relative to its linking file's directory. Ignores http(s)/mailto URLs
  and pure #anchor links; strips #anchor / ?query tails before resolving.
  Exit 0 = all resolve, 1 = broken link(s) found, 2 = bad args.
EOF
}

if [ "$#" -eq 0 ]; then
    usage
    exit 2
fi

# Collect the markdown files to scan from the given files/dirs.
files=()
for arg in "$@"; do
    if [ -d "$arg" ]; then
        while IFS= read -r f; do
            files+=("$f")
        done < <(find "$arg" -type f -name '*.md' | sort)
    elif [ -f "$arg" ]; then
        files+=("$arg")
    else
        log "no such file or directory: $arg"
        exit 2
    fi
done

if [ "${#files[@]}" -eq 0 ]; then
    log "no markdown files found in the given path(s)"
    exit 2
fi

broken=0
checked=0

# Emit the file with all CODE removed, so link extraction never sees code.
# WHY: extraction is a plain grep for ](target) and [label]: target. Code can
# contain the very same bytes — e.g. PEP 695 generics `def first[T](xs: Seq[T])`
# — so an x[y](z) form inside a fenced block or an inline `code` span is misread
# as a broken markdown link. Stripping code first makes the guard code-aware.
# The awk program is SINGLE-quoted: its backticks stay literal and never trigger
# shell command substitution.
strip_code() {
    local file="$1"
    awk '
        {
            line = $0
            # Fence toggle: a line whose trimmed content opens/closes a code
            # fence (``` or ~~~, optionally with a language tag like ```python).
            trimmed = line
            sub(/^[[:space:]]+/, "", trimmed)
            if (trimmed ~ /^(```|~~~)/) {
                in_fence = !in_fence
                next                       # drop the fence line itself
            }
            if (in_fence) next             # drop lines inside the fence
            # Strip inline code spans from prose. Double-backtick runs first
            # (they may wrap single backticks), then single-backtick spans.
            gsub(/``[^`]*``/, "", line)
            gsub(/`[^`]*`/, "", line)
            print line
        }
    ' "$file" 2>/dev/null
}

# Extract every link target of one form from one file (code stripped first).
#   form=inline    -> ](target)
#   form=reference -> [label]: target   (line-leading)
extract_targets() {
    local file="$1" form="$2"
    if [ "$form" = "inline" ]; then
        # Match ](...) up to the closing paren; emit the inner target.
        strip_code "$file" | grep -oE '\]\([^)]*\)' 2>/dev/null \
            | sed -E 's/^\]\(//; s/\)$//'
    else
        # Reference-style definition: line begins with [label]: target
        strip_code "$file" | grep -oE '^\[[^]]+\]:[[:space:]]*[^[:space:]]+' 2>/dev/null \
            | sed -E 's/^\[[^]]+\]:[[:space:]]*//'
    fi
}

for file in "${files[@]}"; do
    dir="$(dirname "$file")"
    for form in inline reference; do
        while IFS= read -r target; do
            [ -z "$target" ] && continue
            # Skip absolute URLs (any scheme://) and mailto:.
            case "$target" in
                *://*|mailto:*) continue ;;
            esac
            # Skip pure in-document anchors.
            case "$target" in
                '#'*) continue ;;
            esac
            # Strip a trailing #anchor and/or ?query — resolve the path part only.
            path="${target%%#*}"
            path="${path%%\?*}"
            [ -z "$path" ] && continue
            checked=$((checked + 1))
            # Resolve relative to the linking file's directory.
            if [ -e "$dir/$path" ]; then
                continue
            fi
            printf 'BROKEN: %s -> %s\n' "$file" "$target"
            broken=$((broken + 1))
        done < <(extract_targets "$file" "$form")
    done
done

if [ "$broken" -gt 0 ]; then
    printf '%s: %d broken link(s) across %d checked.\n' "$SELF" "$broken" "$checked"
    exit 1
fi

printf 'ALL LINKS RESOLVE (%d relative links checked across %d file(s))\n' "$checked" "${#files[@]}"
exit 0
