#!/usr/bin/env bash
# check-skill-mistakes.sh — conformance gate for skill-surface `mistakes.md` files.
#
# Purpose:
#   A skill-owned trap lives as one `## ` section inside skills/{skill}/mistakes.md
#   (the skill-surface schema in skills/memory/templates/mistakes.md). That surface
#   is OUTSIDE the memory frontmatter standard (memory/rules.md §scope-boundary),
#   so validate-frontmatter.sh never sees it. This guard restores the structural
#   validation that the memory validator would otherwise provide, PLUS a reference-
#   resolution class the markdown-link guard cannot see.
#
# What it checks (per file):
#   STRUCTURE
#     - the file carries a light frontmatter header with `type: mistakes` + `skill:`.
#     - every ACTIVE `## ` section (one before the `## Archived` heading) carries all
#       4 mandatory elements: **What happened** / **Why it happens** /
#       **How to detect** / **Correct approach**.
#     - every active section carries a well-formed one-line metadata strip — a line
#       holding all of `priority:` `domain:` `added:` `status:` `tags:`.
#     - section ANCHORS (slugified `## ` headings) are unique within the file.
#     - the `## Archived` heading is recognized; every `## ` section AT OR BELOW it is
#       NON-active and EXEMPT from the 4-element + strip checks (it keeps its anchor in
#       the uniqueness check, and its refs are still resolved).
#   REF-RESOLUTION (the class check-markdown-links.sh CANNOT see — it scans only
#   `](path)` / `[label]: path`)
#     - every body `[[slug]]` wikilink resolves: the slug names an existing memory-tree
#       record (a `{slug}.md` file, with or without a `YYYY-MM-DD-` date prefix) OR a
#       `## ` section anchor in some skill `mistakes.md` (incl. the file being checked).
#       A trailing `#anchor` on a `[[slug#anchor]]` is stripped — only the slug is
#       resolved (anchor validity is out of scope, matching check-markdown-links.sh).
#     - every backtick BARE-PATH (a `` `path/...` `` token that contains `/` and ends in
#       a file extension or `/`, with no `{}<>* ` placeholder/glob/space) resolves on
#       disk against the linking file's dir, the project dir, or the repo root.
#
# Anchor model:
#   A section's anchor is its GitHub-style slugified heading (the slugify() below),
#   so an inbound `[[slug]]` / `#anchor` reference resolves to that slug. The guard
#   does NOT (and cannot) enforce that a heading's slug equals a record's prior
#   `name` — it treats the slugified heading AS the anchor.
#
# Args:
#   --help | -h          print this usage and exit 0.
#   --all                check every skills/{skill}/mistakes.md (one dir level under
#                        skills/; the skills/memory/templates/mistakes.md schema doc is
#                        a deeper path and is NOT included).
#   <file> [<file> ...]  check each given mistakes.md path.
#   (no args)            error — the scan surface is never guessed (exit 2).
#
# Output:
#   stdout — one `STRUCTURE:` / `REF:` line per violation (sorted, de-duplicated),
#            then a one-line summary. On a clean run prints "ALL SKILL MISTAKES CONFORM".
# Exit: 0 = every checked file conforms; 1 = at least one violation; 2 = bad args.

set -uo pipefail

SELF="check-skill-mistakes.sh"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat <<'EOF'
usage:
  check-skill-mistakes.sh --all
      Check every skills/{skill}/mistakes.md (one level under skills/).
  check-skill-mistakes.sh <file> [<file> ...]
      Check each given skill-surface mistakes.md.
  check-skill-mistakes.sh --help | -h
      Print this usage.

Verifies skill-surface mistakes.md conformance: each active `## ` section has the
4 mandatory elements (**What happened** / **Why it happens** / **How to detect** /
**Correct approach**) + a well-formed `priority:`/`domain:`/`added:`/`status:`/`tags:`
metadata strip; section anchors are unique; `## Archived` sections are exempt from
the active checks; and every body `[[slug]]` wikilink AND backtick bare-path resolves
(the reference class check-markdown-links.sh does not see).

Exit 0 = all conform, 1 = violation(s), 2 = bad args.
EOF
}

# ---------------------------------------------------------------------------
# Resolve the canonical project root from this script's own location, so the
# slug universe + path bases resolve correctly regardless of caller CWD. This
# script lives at <proj>/skills/orchestration/scripts/<self>.
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJ_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"          # <proj> = .gobbi/projects/gobbi
SK="$PROJ_DIR/skills"
REPO_ROOT="$(cd "$PROJ_DIR/../../.." && pwd)"           # repo root holds .gobbi / .claude / .codex

# ---------------------------------------------------------------------------
# Helpers.
# ---------------------------------------------------------------------------

# slugify <text> — GitHub-style anchor slug (identical convention to
# check-merge-ref-integrity.sh): lowercase, drop punctuation except hyphen,
# spaces -> hyphen, squeeze + trim hyphens. `## Guard X` -> guard-x.
slugify() {
    printf '%s' "$1" \
        | tr '[:upper:]' '[:lower:]' \
        | sed -E 's/[^a-z0-9 -]//g; s/[[:space:]]+/-/g; s/-+/-/g; s/^-+//; s/-+$//'
}

# trim <text> — strip leading + trailing whitespace.
trim() {
    local s="$1"
    s="${s#"${s%%[![:space:]]*}"}"
    s="${s%"${s##*[![:space:]]}"}"
    printf '%s' "$s"
}

# is_bare_path <token> — true if the token looks like a concrete filesystem path:
# contains `/`, has no `{}<>* ` placeholder/glob/space char, and ends in a known
# file extension OR a trailing `/` (a directory). Prose like `and/or` (no
# extension) and placeholders like `skills/{skill}/mistakes.md` are skipped, so a
# legitimate non-path backtick token never false-fails.
is_bare_path() {
    local t="$1"
    case "$t" in
        *' '*|*'{'*|*'}'*|*'<'*|*'>'*|*'*'*) return 1 ;;
    esac
    case "$t" in */*) : ;; *) return 1 ;; esac
    case "$t" in
        *.md|*.sh|*.json|*.toml|*.ts|*.js|*.yaml|*.yml|*.txt|*/) return 0 ;;
        *) return 1 ;;
    esac
}

# path_resolves <token> <linking-dir> — true if the bare-path exists against the
# linking file's dir, the project dir, or the repo root (or as an absolute path).
path_resolves() {
    local t="$1" dir="$2" base
    case "$t" in /*) [ -e "$t" ] && return 0 || return 1 ;; esac
    for base in "$dir" "$PROJ_DIR" "$REPO_ROOT"; do
        [ -e "$base/$t" ] && return 0
    done
    return 1
}

# ---------------------------------------------------------------------------
# Build the slug-resolution universe ONCE: every memory-tree record stem (with
# and without a YYYY-MM-DD- date prefix) + every skill mistakes.md section anchor.
# sessions/ worktrees/ tmp/ are pruned (transient, not durable memory).
# ---------------------------------------------------------------------------
declare -A SLUG_UNIVERSE=()

register_anchors() {           # add a file's `## ` heading slugs to the universe
    local f="$1" h a
    [ -f "$f" ] || return 0
    while IFS= read -r h; do
        a="$(slugify "$h")"
        [ -n "$a" ] && SLUG_UNIVERSE["$a"]=1
    done < <(grep -hE '^##[[:space:]]+' "$f" 2>/dev/null | sed -E 's/^##[[:space:]]+//')
}

build_universe() {
    local f bn stripped mf
    while IFS= read -r f; do
        bn="$(basename "$f" .md)"
        SLUG_UNIVERSE["$bn"]=1
        stripped="${bn#20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]-}"
        [ "$stripped" != "$bn" ] && SLUG_UNIVERSE["$stripped"]=1
    done < <(
        find "$PROJ_DIR" \
            \( -type d \( -name sessions -o -name worktrees -o -name tmp \) -prune \) \
            -o \( -type f -name '*.md' -print \)
    )
    while IFS= read -r mf; do
        register_anchors "$mf"
    done < <(find "$SK" -mindepth 2 -maxdepth 2 -name 'mistakes.md' 2>/dev/null)
}

slug_exists() { [ -n "${SLUG_UNIVERSE["$1"]:-}" ]; }

# ---------------------------------------------------------------------------
# Violation accumulator.
# ---------------------------------------------------------------------------
violations=()
add() { violations+=("$1"); }
refs_checked=0

# ---------------------------------------------------------------------------
# STRUCTURE check for one file.
# ---------------------------------------------------------------------------
check_structure() {
    local file="$1"

    # --- frontmatter header ---
    if [ "$(sed -n '1p' "$file")" != "---" ]; then
        add "STRUCTURE: $file:1: missing frontmatter header (file must start with '---')"
    else
        local fm
        fm="$(awk 'NR==1&&$0=="---"{f=1;next} f&&$0=="---"{exit} f{print}' "$file")"
        printf '%s\n' "$fm" | grep -qE '^type:[[:space:]]*mistakes[[:space:]]*$' \
            || add "STRUCTURE: $file: frontmatter header missing 'type: mistakes'"
        printf '%s\n' "$fm" | grep -qE '^skill:[[:space:]]*[^[:space:]]' \
            || add "STRUCTURE: $file: frontmatter header missing 'skill:'"
    fi

    # --- gather `## ` headings (line number + title) ---
    local total hnum=() htitle=() e n t
    total="$(wc -l < "$file")"
    while IFS= read -r e; do
        [ -z "$e" ] && continue
        n="${e%%:*}"; t="${e#*:}"
        t="${t#\#\#}"                       # drop the leading ##
        t="$(trim "$t")"
        hnum+=("$n"); htitle+=("$t")
    done < <(grep -nE '^##[[:space:]]+' "$file" 2>/dev/null)

    local nsec=${#hnum[@]}
    [ "$nsec" -eq 0 ] && return 0           # no sections yet — a valid empty home

    # --- find the `## Archived` boundary (first heading titled exactly "Archived") ---
    local arch_idx=-1 i
    for i in "${!htitle[@]}"; do
        if [ "${htitle[$i]}" = "Archived" ]; then arch_idx=$i; break; fi
    done

    # --- anchor uniqueness (all headings, incl. the Archived marker) ---
    local -A seen=()
    for i in "${!htitle[@]}"; do
        local a; a="$(slugify "${htitle[$i]}")"
        if [ -n "${seen[$a]:-}" ]; then
            add "STRUCTURE: $file:${hnum[$i]}: duplicate section anchor '$a' (heading '${htitle[$i]}')"
        fi
        seen[$a]=1
    done

    # --- per ACTIVE section: 4 elements + metadata strip ---
    for i in "${!hnum[@]}"; do
        # skip the Archived marker and every section at/after it (non-active)
        if [ "$arch_idx" -ge 0 ] && [ "$i" -ge "$arch_idx" ]; then continue; fi
        local start end body el strip k
        start="${hnum[$i]}"
        if [ $((i + 1)) -lt "$nsec" ]; then end=$(( ${hnum[$((i + 1))]} - 1 )); else end="$total"; fi
        body="$(sed -n "${start},${end}p" "$file")"

        for el in "What happened" "Why it happens" "How to detect" "Correct approach"; do
            printf '%s\n' "$body" | grep -qF "**$el**" \
                || add "STRUCTURE: $file:$start: active section '${htitle[$i]}' missing element '**$el**'"
        done

        strip="$(printf '%s\n' "$body" | grep -F 'priority:' | head -n1)"
        if [ -z "$strip" ]; then
            add "STRUCTURE: $file:$start: active section '${htitle[$i]}' missing metadata strip (no 'priority:' line)"
        else
            for k in 'domain:' 'added:' 'status:' 'tags:'; do
                printf '%s' "$strip" | grep -qF "$k" \
                    || add "STRUCTURE: $file:$start: active section '${htitle[$i]}' metadata strip missing '$k'"
            done
        fi
    done
}

# ---------------------------------------------------------------------------
# REF-RESOLUTION check for one file (whole file — both zones).
# ---------------------------------------------------------------------------
check_refs() {
    local file="$1" dir hit lineno m inner slug tok
    dir="$(dirname "$file")"

    # body [[slug]] wikilinks
    while IFS= read -r hit; do
        [ -z "$hit" ] && continue
        lineno="${hit%%:*}"; m="${hit#*:}"
        inner="${m#\[\[}"; inner="${inner%\]\]}"
        slug="${inner%%#*}"                  # strip any #anchor tail
        slug="$(trim "$slug")"
        [ -z "$slug" ] && continue
        refs_checked=$((refs_checked + 1))
        slug_exists "$slug" \
            || add "REF: $file:$lineno: unresolved [[${inner}]] -> no such slug/anchor '$slug'"
    done < <(grep -onE '\[\[[^]]+\]\]' "$file" 2>/dev/null)

    # backtick bare-paths
    while IFS= read -r hit; do
        [ -z "$hit" ] && continue
        lineno="${hit%%:*}"; tok="${hit#*:}"
        tok="${tok#\`}"; tok="${tok%\`}"
        is_bare_path "$tok" || continue
        refs_checked=$((refs_checked + 1))
        path_resolves "$tok" "$dir" \
            || add "REF: $file:$lineno: unresolved bare-path \`$tok\` -> not found (file-dir / project / repo bases)"
    done < <(grep -onE '`[^`]+`' "$file" 2>/dev/null)
}

# ---------------------------------------------------------------------------
# Arg parsing.
# ---------------------------------------------------------------------------
case "${1:-}" in
    -h|--help) usage; exit 0 ;;
    '') log "no input: pass one or more mistakes.md paths, or --all"; usage >&2; exit 2 ;;
esac

targets=()
if [ "$1" = "--all" ]; then
    while IFS= read -r f; do targets+=("$f"); done \
        < <(find "$SK" -mindepth 2 -maxdepth 2 -name 'mistakes.md' 2>/dev/null | sort)
    if [ "${#targets[@]}" -eq 0 ]; then
        printf '%s: no skills/*/mistakes.md found under %s (nothing to check)\n' "$SELF" "$SK"
        exit 0
    fi
else
    for arg in "$@"; do
        if [ -f "$arg" ]; then
            targets+=("$arg")
        else
            log "not a readable file: $arg"
            exit 2
        fi
    done
fi

# ---------------------------------------------------------------------------
# Run.
# ---------------------------------------------------------------------------
build_universe
# Also register each target's OWN anchors (covers a file not under skills/ — e.g.
# a temp test fixture — so a self-referential [[slug]] still resolves).
for f in "${targets[@]}"; do register_anchors "$f"; done

for f in "${targets[@]}"; do
    check_structure "$f"
    check_refs "$f"
done

# ---------------------------------------------------------------------------
# Report.
# ---------------------------------------------------------------------------
if [ "${#violations[@]}" -gt 0 ]; then
    printf '%s\n' "${violations[@]}" | sort -u
    n="$(printf '%s\n' "${violations[@]}" | sort -u | wc -l | tr -d ' ')"
    printf '%s: %s violation(s) across %d file(s).\n' "$SELF" "$n" "${#targets[@]}"
    exit 1
fi

printf 'ALL SKILL MISTAKES CONFORM (%d file(s) checked, %d reference(s) resolved)\n' \
    "${#targets[@]}" "$refs_checked"
exit 0
