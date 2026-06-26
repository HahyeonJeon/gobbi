#!/usr/bin/env bash
# check-merge-ref-integrity.sh — memory-compaction MERGE ref-integrity gate.
#
# Purpose:
#   After a Wrap-up Stage-2c compaction MERGE folds several related records into
#   one Map-of-Content (MoC) "consolidated" file and `git mv`s the originals to
#   archive/, two whole-tree properties must hold:
#     (1) no LIVE inbound reference still resolves to a merged-away slug or to a
#         now-vacated active path (every such ref should have been repointed to
#         `consolidated_slug#source_anchor` or to the frozen `archived_path`);
#     (2) the supersession linkage is complete and exact — the consolidated
#         file's `supersedes:` set EQUALS its merge's source set, and each source
#         carries `superseded_by: consolidated`.
#   The three existing guards do NOT prove this (check-markdown-links.sh only
#   resolves `](path)` / `[label]: path` link PATHS; check-residual-vocab.sh is a
#   fixed-vocab grep with no manifest and no target resolution;
#   validate-frontmatter.sh only checks slug-link VALUE SHAPE, never whether a
#   target exists or is live). This gate is the real verification.
#
#   This is a NEW dedicated script, not a 3rd family of check-residual-vocab.sh:
#   that guard is a fixed-vocab grep; this gate is parameterized by a per-run
#   merge MANIFEST and RESOLVES reference targets. Different mechanism -> different
#   script (conflating the two is the guard-scope-model-wrong trap).
#
# Two families (see design.md "NEW ref-integrity gate"):
#   Family 1  (dangling-inbound)        -> DANGLING:      <file>:<line>: ...
#   Family 1b (dead-anchor)             -> STALE-ANCHOR:  <file>:<line>: ...
#   Family 2  (supersession-integrity)  -> SUPERSEDE-*:   ...
#   `supersedes:` / `superseded_by:` are EXCLUDED from Family 1 (they EXIST to
#   point at the merged-away/archived originals — that linkage IS supersession,
#   by design). Family 2 checks them POSITIVELY instead. Flagging them in
#   Family 1 would make the gate unsatisfiable on every legitimate merge.
#
# ---------------------------------------------------------------------------
# The dangling-class set is DERIVED from rules.md, not hand-picked (so it cannot
# drift narrower than the standard). Sources:
#
#   A — rules.md §2.4 global slug-link field (inbound): `related:` (list[slug]).
#       (`supersedes` / `superseded_by` are the §2.4 slug-links EXCLUDED here.)
#   B — rules.md §2.2 per-type slug-link EXTENSION fields (every frontmatter
#       field a type declares as a record reference), verified vs live templates/:
#         backlogs.shipped_in, changelogs.shipped_in,
#         reports.related_reports, reports.related_reviews, reports.related_decisions,
#         checklists.scenario, checklists.anchor, checklists.implemented_in
#       (excluded as non-record-refs: plans.task = label, references.source = external.)
#   C — rules.md §1.5 reference classes (refactor procedure, lines 147-154):
#         C1 path refs    — dead active path inside `](path)` / `[label]: path`
#         C2 prose refs   — the dead slug NAME in running text (bare-slug)
#         C3 required-mistakes: / layer2-source: PATH refs (skill/agent + memory
#                           frontmatter + prose; the skill-name-ref analog)
#         C4 inventory/list/table refs — a row/cell naming the dead slug (bare-slug)
#         C5 wrapper-description refs   — agent prompt blocks naming the slug (bare-slug)
#         C6 pipeline-label refs        — hook/label strings naming the slug (bare-slug)
#       PLUS the two label-rename classes: in-fence example paths + cross-doc
#       mentions (covered by the path + bare-slug scans).
#   D — rules.md §2.4 body `[[slug]]` wikilinks (the navigable graph links).
#
#   The complete dangling-class set = A ∪ B ∪ C ∪ D. When §2.2 gains a new
#   per-type slug-link extension, ADD it to SLUG_FIELDS below — the set is
#   "every §2.2/§2.4 record-reference field + §1.5 prose/path/inventory + body
#   [[slug]]", never a frozen subset.
# ---------------------------------------------------------------------------
#
# Scan root (DISTINCT from validate-frontmatter.sh's P_live — it ADDS skills/+agents/):
#   the project dir (arg 2), walked, with archive/ sessions/ tmp/ worktrees/
#   PRUNED. Everything else under it is scanned — that is exactly
#   P_live ∪ the skills/+agents/ inbound-ref surface (Layer-2 mistakes under
#   skills/mistake/layer2-*.md, required-mistakes:/layer2-source: refs, prose/
#   inventory mentions). archive/ is PRUNED (frozen history), NOT allowlisted.
#
# Allowlist (precise (file, source-set) predicate — never a whole-section pass):
#   a dead-slug S occurrence in file F is legitimate ONLY when F IS the
#   consolidated home of S's merge (S ∈ that file's manifest source set). This
#   exempts S's legitimate sites in its new home — the `## S` section anchor, the
#   `## Sources` `[[S]]` link, the `supersedes:` entry — while STILL flagging:
#     - S appearing in ANY OTHER file (a stale inbound ref), and
#     - a STRAY dead slug NOT in F's source set appearing inside F (the
#       same-file residual a whole-file allowlist would false-pass).
#   archive/ is out of scope (pruned), so archived originals never trip the gate.
#
# Manifest format (TSV, tab-separated; `#` comment + blank lines ignored):
#   MERGE record (7 fields, one per merged-away source):
#     merge<TAB>merged_away_slug<TAB>merged_away_active_path<TAB>archived_path<TAB>source_anchor<TAB>consolidated_slug<TAB>consolidated_path
#   SPLIT record (4 fields, one per split-out section, optional):
#     split<TAB>split_out_anchor<TAB>consolidated_slug<TAB>new_home_path
#   Paths are resolved relative to <resolve-base> (arg 3, default = <scan-root>);
#   markdown link targets resolve relative to their own linking file's directory.
#
# Args:
#   $1 <manifest>     the merge manifest (TSV above). Required.
#   $2 <scan-root>    project dir to walk for inbound refs (archive/ sessions/
#                     tmp/ worktrees/ pruned; skills/ + agents/ INCLUDED). Required.
#   $3 <resolve-base> base for manifest paths + required-mistakes:/layer2-source:
#                     path refs. Optional; defaults to <scan-root>.
#
# Output:
#   stdout — one `DANGLING:` / `STALE-ANCHOR:` / `SUPERSEDE-*:` line per
#            violation (sorted, de-duplicated), then a one-line summary.
#            On a clean run prints "REF-INTEGRITY OK".
# Exit: 0 = Families 1, 1b, 2 all clean; 1 = at least one violation;
#       2 = bad args (missing/unreadable manifest, scan-root not a dir).

set -uo pipefail

SELF="check-merge-ref-integrity.sh"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: check-merge-ref-integrity.sh <manifest> <scan-root> [<resolve-base>]
  Verifies a memory-compaction MERGE left no dangling inbound reference
  (Family 1), no dead post-split anchor (Family 1b), and a complete + exact
  supersession linkage (Family 2). <manifest> is the TSV merge manifest;
  <scan-root> is the project dir to walk (archive/ sessions/ tmp/ worktrees/
  pruned, skills/ + agents/ included); <resolve-base> (default <scan-root>)
  resolves manifest + required-mistakes:/layer2-source: paths.
  Exit 0 = clean, 1 = violation(s), 2 = bad args.
EOF
}

# ---------------------------------------------------------------------------
# Args.
# ---------------------------------------------------------------------------
if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]; then
    log "expected 2 or 3 args, got $#"
    usage
    exit 2
fi

MANIFEST="$1"
SCAN_ROOT="$2"
RESOLVE_BASE="${3:-$2}"

if [ ! -f "$MANIFEST" ]; then
    log "manifest not a readable file: $MANIFEST"
    exit 2
fi
if [ ! -d "$SCAN_ROOT" ]; then
    log "scan-root not a directory: $SCAN_ROOT"
    exit 2
fi
if [ ! -d "$RESOLVE_BASE" ]; then
    log "resolve-base not a directory: $RESOLVE_BASE"
    exit 2
fi
SCAN_ROOT="$(cd "$SCAN_ROOT" && pwd)"
RESOLVE_BASE="$(cd "$RESOLVE_BASE" && pwd)"

# ---------------------------------------------------------------------------
# Helpers.
# ---------------------------------------------------------------------------

# canon <path> <base> — canonical absolute path (existence NOT required, -m).
canon() {
    local p="$1" base="$2"
    case "$p" in
        /*) : ;;
        *)  p="$base/$p" ;;
    esac
    realpath -m -- "$p" 2>/dev/null
}

# slugify <text> — GitHub-style anchor slug: lowercase, drop punctuation except
# hyphen, spaces -> hyphen, squeeze + trim hyphens. A heading `## guard-x` -> guard-x.
slugify() {
    printf '%s' "$1" \
        | tr '[:upper:]' '[:lower:]' \
        | sed -E 's/[^a-z0-9 -]//g; s/[[:space:]]+/-/g; s/-+/-/g; s/^-+//; s/-+$//'
}

# fm_dump <file> — emit `key<TAB>lineno<TAB>value` for each frontmatter field
# value. Handles inline lists `[a, b]`, scalars, and block `- item` lists.
fm_dump() {
    awk '
        NR==1 && $0=="---" { infm=1; next }
        infm && $0=="---"  { exit }
        !infm { next }
        {
            line=$0
            if (match(line, /^[A-Za-z0-9_-]+:/)) {
                key=substr(line,1,RLENGTH-1)
                val=substr(line,RLENGTH+1)
                sub(/^[ \t]+/,"",val); sub(/[ \t]+$/,"",val)
                if (val ~ /^\[.*\]$/) {
                    inner=val; sub(/^\[/,"",inner); sub(/\]$/,"",inner)
                    n=split(inner,arr,",")
                    for (i=1;i<=n;i++){ t=arr[i]; gsub(/^[ \t]+|[ \t]+$/,"",t); if(t!="") print key"\t"NR"\t"t }
                    curkey=""
                } else if (val=="") {
                    curkey=key
                } else {
                    print key"\t"NR"\t"val
                    curkey=""
                }
                next
            }
            if (curkey!="" && match(line, /^[ \t]+-[ \t]+/)) {
                item=substr(line, RLENGTH+1)
                gsub(/^[ \t]+|[ \t]+$/,"",item)
                if (item!="") print curkey"\t"NR"\t"item
                next
            }
            curkey=""
        }
    ' "$1"
}

# clean_val <value> — strip surrounding quotes and a trailing " # comment".
clean_val() {
    local v="$1"
    v="$(printf '%s' "$v" | sed -E 's/[[:space:]]+#.*$//')"
    v="${v#\"}"; v="${v%\"}"
    v="${v#\'}"; v="${v%\'}"
    printf '%s' "$v"
}

# ---------------------------------------------------------------------------
# Reference-field sets (DERIVED — see header).
#   SLUG_FIELDS = A ∪ B  (supersedes / superseded_by EXCLUDED — Family 2).
#   PATH_FIELDS = C3 frontmatter path refs.
# ---------------------------------------------------------------------------
SLUG_FIELDS="related shipped_in related_reports related_reviews related_decisions scenario anchor implemented_in"
PATH_FIELDS="required-mistakes layer2-source"

# ---------------------------------------------------------------------------
# Parse the manifest.
# ---------------------------------------------------------------------------
declare -A DEAD_SLUGS=()          # merged_away_slug -> 1
declare -A DEAD_PATHS=()          # canon(merged_away_active_path) -> 1
declare -A DEAD_PATH_RAW=()       # canon -> raw (for messages)
declare -A OK_SLUGS=()            # consolidated_slug -> 1
declare -A OK_PATHS=()            # canon(consolidated_path|archived_path) -> 1
declare -A CONS_PATH=()           # consolidated_slug -> consolidated_path (raw)
declare -A CONS_SOURCES_BY_CANON=()   # canon(consolidated_path) -> " s1 s2 s3 "
declare -A CONS_SOURCES_BY_SLUG=()    # consolidated_slug -> " s1 s2 s3 "
declare -A SRC_ARCHIVE=()         # source_slug -> archived_path (raw)
declare -A CANON_TO_CONSSLUG=()   # canon(consolidated_path) -> consolidated_slug
declare -A SPLIT_NEWHOME=()       # consolidated_slug \x1f anchor -> new_home_path

manifest_rows=0
while IFS=$'\t' read -r kind f2 f3 f4 f5 f6 f7 || [ -n "${kind:-}" ]; do
    # Skip comments / blank lines.
    case "$kind" in ''|'#'*) continue ;; esac
    case "$kind" in
        merge)
            local_src="$f2"; local_active="$f3"; local_arch="$f4"
            local_anchor="$f5"; local_cons="$f6"; local_conspath="$f7"
            if [ -z "$local_src" ] || [ -z "$local_cons" ] || [ -z "$local_conspath" ]; then
                log "malformed merge row (need >=6 non-empty fields): $kind $f2 $f3 $f4 $f5 $f6 $f7"
                exit 2
            fi
            manifest_rows=$((manifest_rows + 1))
            DEAD_SLUGS["$local_src"]=1
            if [ -n "$local_active" ]; then
                c="$(canon "$local_active" "$RESOLVE_BASE")"
                DEAD_PATHS["$c"]=1; DEAD_PATH_RAW["$c"]="$local_active"
            fi
            OK_SLUGS["$local_cons"]=1
            cc="$(canon "$local_conspath" "$RESOLVE_BASE")"
            OK_PATHS["$cc"]=1
            CONS_PATH["$local_cons"]="$local_conspath"
            CANON_TO_CONSSLUG["$cc"]="$local_cons"
            CONS_SOURCES_BY_CANON["$cc"]="${CONS_SOURCES_BY_CANON[$cc]:- } $local_src "
            CONS_SOURCES_BY_SLUG["$local_cons"]="${CONS_SOURCES_BY_SLUG[$local_cons]:- } $local_src "
            if [ -n "$local_arch" ]; then
                OK_PATHS["$(canon "$local_arch" "$RESOLVE_BASE")"]=1
                SRC_ARCHIVE["$local_src"]="$local_arch"
            fi
            ;;
        split)
            sa="$f2"; sc="$f3"; nh="$f4"
            if [ -z "$sa" ] || [ -z "$sc" ]; then
                log "malformed split row (need split_out_anchor + consolidated_slug): $kind $f2 $f3 $f4"
                exit 2
            fi
            SPLIT_NEWHOME["$sc"$'\x1f'"$sa"]="$nh"
            ;;
        *)
            log "unknown manifest record kind: '$kind' (expected 'merge' or 'split')"
            exit 2
            ;;
    esac
done < "$MANIFEST"

if [ "$manifest_rows" -eq 0 ]; then
    log "manifest has no 'merge' records: $MANIFEST"
    exit 2
fi

# ---------------------------------------------------------------------------
# LIVE_ANCHORS per consolidated file (headings actually present, slugified).
# ---------------------------------------------------------------------------
declare -A LIVE_ANCHORS=()         # canon(consolidated_path) \x1f anchor -> 1
for cc in "${!CANON_TO_CONSSLUG[@]}"; do
    if [ -f "$cc" ]; then
        while IFS= read -r h; do
            a="$(slugify "$h")"
            [ -n "$a" ] && LIVE_ANCHORS["$cc"$'\x1f'"$a"]=1
        done < <(grep -hE '^#{1,6}[[:space:]]+' "$cc" 2>/dev/null | sed -E 's/^#{1,6}[[:space:]]+//')
    fi
done

# ---------------------------------------------------------------------------
# Collect markdown files to scan (prune archive/ sessions/ tmp/ worktrees/).
# ---------------------------------------------------------------------------
mapfile -t FILES < <(
    find "$SCAN_ROOT" \
        \( -type d \( -name archive -o -name sessions -o -name tmp -o -name worktrees \) -prune \) \
        -o \( -type f -name '*.md' -print \) | sort
)

# ---------------------------------------------------------------------------
# Violation accumulator.
# ---------------------------------------------------------------------------
violations=()
add() { violations+=("$1"); }

# allowlisted <file-canon> <slug> — true if file IS slug's consolidated home.
allowlisted() {
    local fc="$1" slug="$2" srcs
    srcs="${CONS_SOURCES_BY_CANON[$fc]:-}"
    [ -z "$srcs" ] && return 1
    case "$srcs" in *" $slug "*) return 0 ;; esac
    return 1
}

# is_dead_slug / is_ok_slug / is_dead_path / is_ok_path
is_dead_slug() { [ -n "${DEAD_SLUGS[$1]:-}" ]; }
is_ok_slug()   { [ -n "${OK_SLUGS[$1]:-}" ]; }
is_dead_path() { [ -n "${DEAD_PATHS[$1]:-}" ]; }
is_ok_path()   { [ -n "${OK_PATHS[$1]:-}" ]; }

# flag_slug <file> <fc> <line> <kind> <slug> — Family-1 slug check + allowlist.
flag_slug() {
    local file="$1" fc="$2" line="$3" kind="$4" slug="$5"
    [ -z "$slug" ] && return 0
    [ "$slug" = "null" ] && return 0
    is_dead_slug "$slug" || return 0
    is_ok_slug "$slug" && return 0
    allowlisted "$fc" "$slug" && return 0
    add "DANGLING: $file:$line: [$kind] $slug -> merged-away slug"
}

# ---------------------------------------------------------------------------
# Family 1 + 1b: scan every file.
# ---------------------------------------------------------------------------
for file in "${FILES[@]}"; do
    [ -f "$file" ] || continue
    fc="$(realpath -m -- "$file" 2>/dev/null)"
    dir="$(dirname "$file")"

    # --- Frontmatter slug fields (A ∪ B) + path fields (C3) ---
    # Process substitution keeps this loop in the MAIN shell, so `add` persists.
    while IFS=$'\t' read -r key lineno raw; do
        [ -z "$key" ] && continue
        val="$(clean_val "$raw")"
        [ -z "$val" ] && continue
        case " $SLUG_FIELDS " in
            *" $key "*)
                flag_slug "$file" "$fc" "$lineno" "fm:$key" "$val"
                ;;
        esac
        case " $PATH_FIELDS " in
            *" $key "*)
                # values may be ` + `-joined (layer2-source multi-target). Split
                # into a bash array (no pipe-into-while) so `add` stays in-shell.
                _split="$(printf '%s' "$val" | sed 's/ + /\n/g')"
                while IFS= read -r tgt; do
                    tgt="${tgt#"${tgt%%[![:space:]]*}"}"; tgt="${tgt%"${tgt##*[![:space:]]}"}"
                    [ -z "$tgt" ] && continue
                    [ "$tgt" = "null" ] && continue
                    pc="$(canon "${tgt%%#*}" "$RESOLVE_BASE")"
                    if is_dead_path "$pc" && ! is_ok_path "$pc"; then
                        add "DANGLING: $file:$lineno: [fm:$key] $tgt -> merged-away path ${DEAD_PATH_RAW[$pc]:-$tgt}"
                    fi
                done <<< "$_split"
                ;;
        esac
    done < <(fm_dump "$file")

    # --- D: body [[slug]] wikilinks (+ 1b anchor) ---
    while IFS= read -r hit; do
        [ -z "$hit" ] && continue
        lineno="${hit%%:*}"; rest="${hit#*:}"
        inner="${rest#\[\[}"; inner="${inner%\]\]}"
        slug="${inner%%#*}"; anchor=""
        case "$inner" in *#*) anchor="${inner#*#}" ;; esac
        slug="${slug#"${slug%%[![:space:]]*}"}"; slug="${slug%"${slug##*[![:space:]]}"}"
        if [ -n "$anchor" ] && is_ok_slug "$slug" && [ -n "${CONS_SOURCES_BY_SLUG[$slug]:-}" ]; then
            cc="$(canon "${CONS_PATH[$slug]}" "$RESOLVE_BASE")"
            if [ -z "${LIVE_ANCHORS[$cc$'\x1f'$anchor]:-}" ]; then
                nh="${SPLIT_NEWHOME[$slug$'\x1f'$anchor]:-}"
                add "STALE-ANCHOR: $file:$lineno: [[${slug}#${anchor}]] -> anchor absent from ${CONS_PATH[$slug]}${nh:+ (split to $nh)}"
            fi
        else
            flag_slug "$file" "$fc" "$lineno" "wikilink" "$slug"
        fi
    done < <(grep -onE '\[\[[^]]+\]\]' "$file" 2>/dev/null)

    # --- C1: inline + reference link path targets (+ 1b anchor) ---
    while IFS= read -r hit; do
        [ -z "$hit" ] && continue
        lineno="${hit%%:*}"; m="${hit#*:}"
        # m is `](target)` (inline) or `[label]: target` (reference-style)
        if [ "${m:0:2}" = "](" ]; then
            target="${m#\](}"; target="${target%)}"
        else
            target="$(printf '%s' "$m" | sed -E 's/^\[[^]]+\]:[[:space:]]*//')"
        fi
        [ -z "$target" ] && continue
        case "$target" in *://*|mailto:*|'#'*) continue ;; esac
        path="${target%%#*}"; path="${path%%\?*}"
        anchor=""; case "$target" in *#*) anchor="${target#*#}"; anchor="${anchor%%\?*}" ;; esac
        [ -z "$path" ] && continue
        pc="$(canon "$path" "$dir")"
        if is_dead_path "$pc" && ! is_ok_path "$pc"; then
            add "DANGLING: $file:$lineno: [link-path] $target -> merged-away path ${DEAD_PATH_RAW[$pc]:-$path}"
        elif [ -n "$anchor" ] && [ -n "${CANON_TO_CONSSLUG[$pc]:-}" ]; then
            if [ -z "${LIVE_ANCHORS[$pc$'\x1f'$anchor]:-}" ]; then
                cslug="${CANON_TO_CONSSLUG[$pc]}"
                nh="${SPLIT_NEWHOME[$cslug$'\x1f'$anchor]:-}"
                add "STALE-ANCHOR: $file:$lineno: $target -> anchor absent from $path${nh:+ (split to $nh)}"
            fi
        fi
    done < <(grep -onE '\]\([^)]*\)|^\[[^]]+\]:[[:space:]]*[^[:space:]]+' "$file" 2>/dev/null)

    # --- C2/C4/C5/C6: bare-slug prose / inventory / table / label refs ---
    # For each dead slug not allowlisted in THIS file, match it as a discriminating
    # kebab token. Exclude preceding [#/_-] (anchors `#S`, path segs `/S`, longer
    # slugs) and trailing [_-] (slug continuation). `grep -absence` discipline:
    # the pattern is exact per slug.
    for slug in "${!DEAD_SLUGS[@]}"; do
        is_ok_slug "$slug" && continue
        allowlisted "$fc" "$slug" && continue
        while IFS= read -r hit; do
            [ -z "$hit" ] && continue
            lineno="${hit%%:*}"
            add "DANGLING: $file:$lineno: [prose/inventory] $slug -> merged-away slug"
        done < <(grep -nE "(^|[^A-Za-z0-9#/_-])${slug}([^A-Za-z0-9_-]|\$)" "$file" 2>/dev/null)
    done

    # --- 1b: bare `consolidated_slug#anchor` (prose / [[ ]] forms) ---
    for cslug in "${!CONS_SOURCES_BY_SLUG[@]}"; do
        cc="$(canon "${CONS_PATH[$cslug]}" "$RESOLVE_BASE")"
        while IFS= read -r hit; do
            [ -z "$hit" ] && continue
            lineno="${hit%%:*}"; mm="${hit#*:}"
            anchor="$(printf '%s' "$mm" | sed -E "s/.*${cslug}#([A-Za-z0-9._-]+).*/\1/")"
            anchor="${anchor%%.*}"   # drop a trailing .md-ish tail if any
            [ -z "$anchor" ] && continue
            if [ -z "${LIVE_ANCHORS[$cc$'\x1f'$anchor]:-}" ]; then
                nh="${SPLIT_NEWHOME[$cslug$'\x1f'$anchor]:-}"
                add "STALE-ANCHOR: $file:$lineno: ${cslug}#${anchor} -> anchor absent from ${CONS_PATH[$cslug]}${nh:+ (split to $nh)}"
            fi
        done < <(grep -nE "${cslug}#[A-Za-z0-9._-]+" "$file" 2>/dev/null)
    done
done

# ---------------------------------------------------------------------------
# Family 2: supersession-linkage integrity.
# ---------------------------------------------------------------------------
for cslug in "${!CONS_SOURCES_BY_SLUG[@]}"; do
    conspath="${CONS_PATH[$cslug]}"
    cc="$(canon "$conspath" "$RESOLVE_BASE")"
    # expected source set for this consolidation
    expected=" ${CONS_SOURCES_BY_SLUG[$cslug]} "
    expected="$(printf '%s' "$expected" | tr -s ' ')"

    # actual `supersedes:` set from the consolidated file
    declare -A actual=()
    if [ -f "$cc" ]; then
        while IFS=$'\t' read -r key lineno raw; do
            [ "$key" = "supersedes" ] || continue
            v="$(clean_val "$raw")"; [ -z "$v" ] && continue
            [ "$v" = "null" ] && continue
            actual["$v"]=1
        done < <(fm_dump "$cc")
    else
        add "SUPERSEDE-MISSING-FILE: consolidated $cslug -> $conspath not found"
    fi

    # missing: expected source not present in supersedes
    for src in ${CONS_SOURCES_BY_SLUG[$cslug]}; do
        if [ -z "${actual[$src]:-}" ]; then
            add "SUPERSEDE-MISSING: $conspath supersedes: is missing source '$src'"
        fi
    done
    # stray: supersedes entry not in the manifest source set
    for s in "${!actual[@]}"; do
        case "$expected" in
            *" $s "*) : ;;
            *) add "SUPERSEDE-STRAY: $conspath supersedes: lists '$s' not in manifest source set" ;;
        esac
    done
    unset actual

    # reciprocal: each archived source must carry superseded_by: consolidated
    for src in ${CONS_SOURCES_BY_SLUG[$cslug]}; do
        arch="${SRC_ARCHIVE[$src]:-}"
        if [ -z "$arch" ]; then
            add "SUPERSEDE-NO-ARCHIVE: source '$src' has no archived_path in manifest"
            continue
        fi
        ap="$(canon "$arch" "$RESOLVE_BASE")"
        if [ ! -f "$ap" ]; then
            add "SUPERSEDE-NO-ARCHIVE: source '$src' archived_path not found: $arch"
            continue
        fi
        sb=""
        while IFS=$'\t' read -r key lineno raw; do
            [ "$key" = "superseded_by" ] || continue
            sb="$(clean_val "$raw")"
        done < <(fm_dump "$ap")
        if [ "$sb" != "$cslug" ]; then
            add "SUPERSEDE-RECIPROCAL: $arch superseded_by: '${sb:-<absent>}' != consolidated '$cslug'"
        fi
    done
done

# ---------------------------------------------------------------------------
# Report.
# ---------------------------------------------------------------------------
if [ "${#violations[@]}" -gt 0 ]; then
    printf '%s\n' "${violations[@]}" | sort -u
    n="$(printf '%s\n' "${violations[@]}" | sort -u | wc -l | tr -d ' ')"
    printf '%s: %s ref-integrity violation(s) across %d scanned file(s).\n' \
        "$SELF" "$n" "${#FILES[@]}"
    exit 1
fi

printf 'REF-INTEGRITY OK (%d merge record(s), %d scanned file(s); Families 1, 1b, 2 clean)\n' \
    "$manifest_rows" "${#FILES[@]}"
exit 0
