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
#   For a checked link, any query is ignored. The path must exist and every
#   fragment must match a GitHub-style Markdown heading anchor or explicit HTML
#   id in the target document. Pure in-document anchors are checked too.
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
  and query strings. Validates pure and cross-document heading fragments.
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
anchors_checked=0

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

# Emit the anchors GitHub-style Markdown rendering assigns to ATX headings,
# including the numeric suffix used for duplicate headings. Explicit HTML ids
# are accepted because Markdown renderers expose them as navigable fragments.
extract_anchors() {
    local file="$1"
    awk '
        function heading_slug(text, base, count) {
            gsub(/<[^>]*>/, "", text)
            gsub(/`/, "", text)
            text = tolower(text)
            gsub(/[^[:alnum:] _-]/, "", text)
            # GitHub removes punctuation before replacing each remaining space.
            # Two spaces left around a removed dash or plus therefore become
            # two hyphens; collapsing whitespace would reject valid anchors.
            gsub(/[[:space:]]/, "-", text)
            sub(/^-+/, "", text)
            sub(/-+$/, "", text)
            base = text
            count = seen[base]++
            if (count > 0) text = base "-" count
            print text
        }
        {
            line = $0
            trimmed = line
            sub(/^[[:space:]]+/, "", trimmed)
            if (trimmed ~ /^(```|~~~)/) {
                in_fence = !in_fence
                next
            }
            if (in_fence) next
            if (line ~ /^#{1,6}[[:space:]]+/) {
                sub(/^#{1,6}[[:space:]]+/, "", line)
                sub(/[[:space:]]+#+[[:space:]]*$/, "", line)
                heading_slug(line)
            }
            remainder = $0
            while (match(remainder, /id=["\047][^"\047]+["\047]/)) {
                explicit_id = substr(remainder, RSTART + 4, RLENGTH - 5)
                print explicit_id
                remainder = substr(remainder, RSTART + RLENGTH)
            }
        }
    ' "$file" 2>/dev/null
}

anchor_exists() {
    local target_file="$1" fragment="$2" anchor
    [ -f "$target_file" ] || return 1
    while IFS= read -r anchor; do
        [ "$anchor" = "$fragment" ] && return 0
    done < <(extract_anchors "$target_file")
    return 1
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
            fragment=""
            case "$target" in
                *'#'*)
                    fragment="${target#*#}"
                    fragment="${fragment%%\?*}"
                    ;;
            esac
            # Strip a trailing #anchor and/or ?query before resolving the path.
            path="${target%%#*}"
            path="${path%%\?*}"
            if [ -z "$path" ]; then
                target_file="$file"
            else
                target_file="$dir/$path"
                checked=$((checked + 1))
                if [ ! -e "$target_file" ]; then
                    printf 'BROKEN: %s -> %s\n' "$file" "$target"
                    broken=$((broken + 1))
                    continue
                fi
            fi
            if [ -n "$fragment" ]; then
                anchors_checked=$((anchors_checked + 1))
                if ! anchor_exists "$target_file" "$fragment"; then
                    printf 'BROKEN-ANCHOR: %s -> %s\n' "$file" "$target"
                    broken=$((broken + 1))
                fi
            fi
        done < <(extract_targets "$file" "$form")
    done
done

if [ "$broken" -gt 0 ]; then
    printf '%s: %d broken link(s) across %d checked.\n' "$SELF" "$broken" "$checked"
    exit 1
fi

printf 'ALL LINKS RESOLVE (%d relative paths and %d anchors checked across %d file(s))\n' \
    "$checked" "$anchors_checked" "${#files[@]}"
exit 0
