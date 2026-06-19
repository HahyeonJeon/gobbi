#!/usr/bin/env bash
# validate-frontmatter.sh — enforce the memory frontmatter standard (memory/rules.md §2).
#
# Purpose:
#   The single machine-readable gate for the memory frontmatter standard. memory/rules.md §2
#   IS the spec; this script enforces it. When §2 and this script disagree, §2 is the spec
#   and this script is the bug (see rules.md §2 lead note). It replaces the §4.5 grep-gate as
#   a strict superset: the no-stray-keys check below subsumes the old staging-key leak scan.
#
#   For each live memory .md file it checks:
#     - all 11 required base fields present (§2.1): name description type scope feature
#       status created session tags keywords author (keywords + author now required)
#     - type ∈ the 16-type enum (§2.3)
#     - status ∈ the per-type status enum (§2.2)
#     - scope ∈ {project, feature}; feature conditional on scope (§2.1)
#     - tags ⊆ the controlled vocabulary (§2.5); empty [] allowed
#     - keywords present (list; empty [] allowed) — REQUIRED escape-hatch overflow (§2.1)
#     - author ∈ {claude, codex, user} — REQUIRED coarse provider tag (§2.1)
#     - created matches YYYY-MM-DD
#     - extension enums valid where present: priority / ref_type / review_kind / verdict /
#       report_type (§2.2)
#     - name == filename stem (filename minus .md and any leading YYYY-MM-DD-)
#     - required per-type extensions present (§2.2): mistakes -> priority + domain;
#       backlogs -> priority + project-scope; references -> title + source + ref_type
#     - tags is an inline flow list [a, b] (§2.5); a block-style list (key: then '  - item')
#       is REJECTED with a clear message (gobbi convention is inline flow lists)
#     - slug-link value-shape (§2.1/§2.4): supersedes / superseded_by (scalar, null ok)
#       and each item of related[] must be a PLAIN SLUG (kebab-case), never a path
#       (no '/', no '.md', no spaces, no [[ ]])
#     - no-stray-keys: every frontmatter key ∈ base (the 11 required, incl. keywords +
#       author) + the global-optional slug-link fields (supersedes / superseded_by /
#       related, §2.1/§2.4 — global, NOT per-type extensions, so never double-counted)
#       + that type's declared §2.2 extensions
#     - slug uniqueness: no two live files share a name: — EXCEPT README.md files, which
#       carry the fixed identity name `README` (§2.4) and are exempt from uniqueness
#
# Scope of files (P_live, mirrors the §4.5 find-prune predicate):
#   under .gobbi/projects/gobbi/ EXCLUDING */archive/* */sessions/* */skills/*
#   */agents/* */tmp/* */worktrees/*. Optional [paths...] args validate specific files
#   instead; default is the whole P_live tree.
#
# Args:
#   [paths...]  Zero or more .md files to validate. Default: the whole P_live tree.
#
# Output: one line per violation — FILE:FIELD: message. A summary count on stderr.
#   Exit non-zero if any violation; exit 0 + "OK: N files validated" if clean.
#
# Self-contained bash — no Python, no node, no dependency. Frontmatter is flat YAML
# (key: value, flow lists [a, b]); block lists (key: then '  - item' lines) are tolerated
# (their continuation lines are not top-level keys, so key-collection skips them).
#
# SPEC NOTE — `decision_status` and `disposition` are REMOVED (§2.2):
#   §2.2 is the authoritative per-type extension table and it REMOVED both fields
#   (decision_status → folds into status; backlogs disposition → folds into status).
#   §4.4 has been reconciled: the keep set IS this validator's per-type allowlist
#   (base §2.1 + global slug-links + that type's §2.2 extensions) — there is no separate
#   hand-maintained keep-list. So a live file still carrying decision_status, or
#   disposition anywhere, is flagged as a stray key. The current tree is EXPECTED to fail
#   on these (and other legacy data) until the deferred data-fix task normalizes it.

set -euo pipefail

SELF="validate-frontmatter.sh"
log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: validate-frontmatter.sh [paths...]
  Validates memory frontmatter against memory/rules.md §2.
  No args  -> validates the whole P_live tree under .gobbi/projects/gobbi/
              (excluding archive/ sessions/ skills/ agents/ tmp/ worktrees/).
  [paths]  -> validates only the given .md files.
  Prints one line per violation (FILE:FIELD: message); exits non-zero if any.
EOF
}

case "${1:-}" in
    -h|--help) usage; exit 0 ;;
esac

# --- Resolve the project memory root (relative to this script) ----------------
# Script lives at .gobbi/projects/gobbi/skills/memory/scripts/ ; the memory root
# is three levels up (skills/memory/scripts -> skills/memory -> skills -> gobbi).
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "$script_dir/../../.." && pwd)"   # .gobbi/projects/gobbi
[ -d "$project_root" ] || { log "project root not found: $project_root"; exit 2; }

# =============================================================================
# Controlled vocabularies (source of truth: memory/rules.md §2.3 / §2.5).
# If §2 changes, update these lists; §2 is the spec, this is its mirror.
# =============================================================================

# §2.3 — the 16 first-class types.
TYPES="features notes decisions design mistakes rules learnings backlogs references plans reviews reports changelogs discussions scenarios checklists"

# §2.5 — the closed controlled tags vocabulary.
TAG_VOCAB="process planning execution evaluation wrap-up ideation preparation docs-sync refactor rename-sweep verification vocabulary-sweep hooks codex security git memory frontmatter schema validation links design"

# §2.2 — extension enums.
PRIORITY_ENUM="critical high medium low"
REF_TYPE_ENUM="docs blog paper rfc code book other"
REVIEW_KIND_ENUM="adversarial-review ultrareview code-review retrospective security-audit license-audit dep-audit other"
VERDICT_ENUM="pass revise fail needs-attention n/a"
REPORT_TYPE_ENUM="status post-mortem analytics"
ITEM_STATUS_ENUM="pending implemented deferred"

# §2.1 — author enum (coarse provider tag, stable across model versions).
AUTHOR_ENUM="claude codex user"

# Base fields (§2.1) — 11 required (keywords + author are now required base fields).
BASE_REQUIRED="name description type scope feature status created session tags keywords author"
# Slug-link fields (§2.1/§2.4) — GLOBAL optional base fields, allowed on EVERY type.
# They are NOT per-type extensions (ext_fields_for never lists them), so they are
# counted exactly once — as global-optional — and never double-counted per type.
SLUG_LINK_FIELDS="supersedes superseded_by related"

# in_set <needle> <space-separated-set>  -> 0 if member, 1 otherwise.
in_set() {
    local needle="$1" set="$2" x
    for x in $set; do [ "$x" = "$needle" ] && return 0; done
    return 1
}

# is_plain_slug <value>  -> 0 if <value> is a plain kebab-case slug (§2.1/§2.4),
# 1 otherwise. A slug is the target file's `name` (= filename stem): lowercase
# alphanumerics + hyphens only, no path separator, no `.md`, no spaces, no `[[ ]]`.
# Quotes are stripped before the test. Used for supersedes / superseded_by / related.
is_plain_slug() {
    local v="$1"
    # strip surrounding quotes.
    v="$(printf '%s' "$v" | sed -E "s/^[\"']//; s/[\"']$//")"
    printf '%s' "$v" | grep -qE '^[a-z0-9][a-z0-9-]*$'
}

# status_enum_for <type>  -> echoes the allowed status values for that type (§2.2).
status_enum_for() {
    case "$1" in
        features)    echo "active retired" ;;
        notes)       echo "active" ;;
        decisions)   echo "proposed accepted superseded" ;;
        design)      echo "active superseded" ;;
        mistakes)    echo "active superseded" ;;
        rules)       echo "active superseded" ;;
        learnings)   echo "active superseded" ;;
        backlogs)    echo "open deferred closed" ;;
        references)  echo "active superseded" ;;
        plans)       echo "active superseded" ;;
        reviews)     echo "active" ;;
        reports)     echo "active" ;;
        changelogs)  echo "active" ;;
        discussions) echo "active" ;;
        scenarios)   echo "active" ;;
        checklists)  echo "active" ;;
        *)           echo "" ;;
    esac
}

# ext_fields_for <type>  -> echoes the type's declared §2.2 extension fields
# (NOT including the slug-link fields, which are added separately for every type).
# The §2.2 "Note" row keeps the richer set for notes and reports.
ext_fields_for() {
    case "$1" in
        features)    echo "value_proposition subsystems" ;;
        notes)       echo "features_touched loops_completed shipped" ;;
        decisions)   echo "" ;;                       # supersedes/superseded_by are slug-link
        design)      echo "" ;;                       # related is slug-link
        mistakes)    echo "priority domain" ;;
        rules)       echo "priority established" ;;
        learnings)   echo "" ;;                       # related is slug-link
        backlogs)    echo "priority project-scope shipped_in" ;;
        references)  echo "title source accessed ref_type" ;;
        plans)       echo "task task_count" ;;
        reviews)     echo "review_kind subject verdict" ;;
        reports)     echo "report_type related_reports generated_by subject related_reviews related_decisions" ;;
        changelogs)  echo "shipped_in" ;;
        discussions) echo "outcome" ;;
        scenarios)   echo "" ;;
        checklists)  echo "scenario item_status anchor implemented_in" ;;
        *)           echo "" ;;
    esac
}

# required_ext_for <type>  -> echoes the type's REQUIRED §2.2 extension fields.
# A file of that type missing any of these FAILS. Optional extensions are not listed.
# (§2.2 "Required vs optional extensions": mistakes -> priority + domain;
#  backlogs -> priority + project-scope; references -> title + source + ref_type.)
required_ext_for() {
    case "$1" in
        mistakes)    echo "priority domain" ;;
        backlogs)    echo "priority project-scope" ;;
        references)  echo "title source ref_type" ;;
        *)           echo "" ;;
    esac
}

# =============================================================================
# Frontmatter extraction helpers.
# =============================================================================

# fm_block <file>  -> prints the lines between the first two '---' fences.
fm_block() {
    awk '
        /^---[[:space:]]*$/ { c++; if (c==1) next; if (c==2) exit }
        c==1 { print }
    ' "$1"
}

# fm_keys <file>  -> prints the top-level frontmatter key names (one per line).
# A top-level key matches ^<key>: at column 0. Block-list continuation lines
# ('  - item') start with whitespace and are correctly skipped.
fm_keys() {
    fm_block "$1" | sed -n -E 's/^([A-Za-z][A-Za-z0-9_-]*):.*$/\1/p'
}

# fm_value <file> <key>  -> prints the raw scalar value of a top-level key
# (everything after 'key:'), trimmed of surrounding whitespace. Empty if absent
# or if the key has no inline value (block list / empty).
fm_value() {
    fm_block "$1" \
      | sed -n -E "s/^$2:[[:space:]]*(.*)$/\1/p" \
      | head -n1 \
      | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//'
}

# fm_is_block_list <file> <key>  -> exit 0 if <key> is written as a block-style
# YAML list (a bare 'key:' line with NO inline value, immediately followed by one
# or more '  - item' continuation lines). Exit 1 otherwise. gobbi convention is
# inline flow lists [a, b]; this catches the block form so it is not silently
# skipped (a bare 'key:' yields an empty fm_value and would otherwise pass unseen).
fm_is_block_list() {
    fm_block "$1" | awk -v k="$2" '
        $0 ~ "^"k":[[:space:]]*$" { seen=1; next }   # bare "key:" with no inline value
        seen==1 {
            if ($0 ~ /^[[:space:]]+-[[:space:]]/) { found=1 }
            exit
        }
        END { exit (found ? 0 : 1) }
    '
}

# stem_of <file>  -> filename without .md and without a leading YYYY-MM-DD- prefix.
stem_of() {
    local b
    b="$(basename "$1" .md)"
    printf '%s' "$b" | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-//'
}

# =============================================================================
# Collect the file list (P_live tree by default, or explicit args).
# =============================================================================
files=()
if [ "$#" -gt 0 ]; then
    for p in "$@"; do
        case "$p" in
            *.md) ;;
            *) log "skipping non-.md arg: $p"; continue ;;
        esac
        [ -f "$p" ] || { log "file not found: $p"; exit 2; }
        files+=("$p")
    done
    [ "${#files[@]}" -gt 0 ] || { usage; log "no .md files to validate"; exit 2; }
else
    # Run find FROM INSIDE project_root so the prune patterns match only segments
    # BELOW the root. The project root itself can live under a path containing
    # `worktrees/` (a session worktree) or `skills/` — pruning on the absolute path
    # would then exclude everything. Anchoring with a leading `./` keeps the prune
    # relative to the root. Paths are re-prefixed with $project_root for reporting.
    while IFS= read -r -d '' f; do
        files+=("$project_root/${f#./}")
    done < <(cd "$project_root" && find . -name '*.md' \
        -not -path '*/archive/*' \
        -not -path '*/sessions/*' \
        -not -path '*/skills/*' \
        -not -path '*/agents/*' \
        -not -path '*/tmp/*' \
        -not -path '*/worktrees/*' \
        -print0 | sort -z)
fi

# =============================================================================
# Validate.
# =============================================================================
violations=0
report() { printf '%s:%s: %s\n' "$1" "$2" "$3"; violations=$((violations + 1)); }

# slug-uniqueness accumulator: maps name -> first file seen (newline-delimited records).
declare -A seen_name

for f in "${files[@]}"; do
    keys="$(fm_keys "$f")"

    # --- required base fields present -----------------------------------------
    for req in $BASE_REQUIRED; do
        if ! printf '%s\n' "$keys" | grep -qx "$req"; then
            report "$f" "$req" "missing required base field"
        fi
    done

    ftype="$(fm_value "$f" type)"
    fstatus="$(fm_value "$f" status)"
    fscope="$(fm_value "$f" scope)"
    ffeature="$(fm_value "$f" feature)"
    fcreated="$(fm_value "$f" created)"
    fname="$(fm_value "$f" name)"

    # --- type ∈ 16-enum -------------------------------------------------------
    if [ -z "$ftype" ]; then
        :  # already reported as missing above
    elif ! in_set "$ftype" "$TYPES"; then
        report "$f" "type" "'$ftype' is not one of the 16 types (§2.3)"
    fi

    # --- status ∈ per-type enum ----------------------------------------------
    if [ -n "$ftype" ] && in_set "$ftype" "$TYPES"; then
        senum="$(status_enum_for "$ftype")"
        if [ -n "$fstatus" ] && ! in_set "$fstatus" "$senum"; then
            report "$f" "status" "'$fstatus' not in $ftype status enum {${senum// /, }} (§2.2)"
        fi
    fi

    # --- scope ∈ {project, feature} ; feature conditional --------------------
    case "$fscope" in
        project)
            if [ -n "$ffeature" ] && [ "$ffeature" != "null" ]; then
                report "$f" "feature" "must be null when scope: project (is '$ffeature') (§2.1)"
            fi
            ;;
        feature)
            if [ -z "$ffeature" ] || [ "$ffeature" = "null" ]; then
                report "$f" "feature" "must be a non-null slug when scope: feature (§2.1)"
            fi
            ;;
        "")
            : ;;  # missing scope already reported
        *)
            report "$f" "scope" "'$fscope' not in {project, feature} (§2.1)"
            ;;
    esac

    # --- created matches YYYY-MM-DD ------------------------------------------
    if [ -n "$fcreated" ] && ! printf '%s' "$fcreated" | grep -qE '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'; then
        report "$f" "created" "'$fcreated' is not YYYY-MM-DD (§2.1)"
    fi

    # --- name == filename stem -----------------------------------------------
    stem="$(stem_of "$f")"
    if [ -n "$fname" ] && [ "$fname" != "$stem" ]; then
        report "$f" "name" "'$fname' != filename stem '$stem' (§2.1)"
    fi

    # --- tags ⊆ controlled vocabulary ----------------------------------------
    # tags MUST be an inline flow list [a, b, c] (or [] empty) — gobbi convention.
    # A block-style list (bare 'tags:' then '  - item' lines) is REJECTED so its
    # items are not skipped unvalidated (a bare 'tags:' yields an empty fm_value).
    tags_raw="$(fm_value "$f" tags)"
    if printf '%s' "$tags_raw" | grep -qE '^\[.*\]$'; then
        body="$(printf '%s' "$tags_raw" | sed -E 's/^\[//; s/\]$//')"
        # split on commas; trim each.
        IFS=',' read -r -a tag_arr <<< "$body"
        for t in "${tag_arr[@]}"; do
            t="$(printf '%s' "$t" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//; s/^["'\'']//; s/["'\'']$//')"
            [ -z "$t" ] && continue
            if ! in_set "$t" "$TAG_VOCAB"; then
                report "$f" "tags" "'$t' not in controlled vocabulary (§2.5)"
            fi
        done
    elif [ -z "$tags_raw" ] && fm_is_block_list "$f" tags; then
        report "$f" "tags" "must be an inline [..] flow list, not a block-style list (§2.5)"
    elif [ -n "$tags_raw" ]; then
        report "$f" "tags" "must be a flow list [..] (got '$tags_raw') (§2.1)"
    fi

    # --- keywords: same inline-flow-list convention (optional, freeform values) --
    # keywords shares the tags parser convention: it must be inline [..] when present.
    # A block-style keywords list is rejected so it is not silently skipped (§2.1).
    kw_raw="$(fm_value "$f" keywords)"
    if [ -z "$kw_raw" ] && fm_is_block_list "$f" keywords; then
        report "$f" "keywords" "must be an inline [..] flow list, not a block-style list (§2.1)"
    elif [ -n "$kw_raw" ] && ! printf '%s' "$kw_raw" | grep -qE '^\[.*\]$'; then
        report "$f" "keywords" "must be a flow list [..] (got '$kw_raw') (§2.1)"
    fi

    # --- author ∈ {claude, codex, user} (§2.1) -------------------------------
    # author is a REQUIRED base field (presence checked above); its value must be
    # one of the three coarse provider tags. Empty is already reported as missing.
    fauthor="$(fm_value "$f" author)"
    if [ -n "$fauthor" ] && ! in_set "$fauthor" "$AUTHOR_ENUM"; then
        report "$f" "author" "'$fauthor' not in {${AUTHOR_ENUM// /, }} (§2.1)"
    fi

    # --- extension enums where present ---------------------------------------
    v="$(fm_value "$f" priority)"
    if [ -n "$v" ] && ! in_set "$v" "$PRIORITY_ENUM"; then
        report "$f" "priority" "'$v' not in {${PRIORITY_ENUM// /, }} (§2.2)"
    fi
    v="$(fm_value "$f" ref_type)"
    if [ -n "$v" ] && ! in_set "$v" "$REF_TYPE_ENUM"; then
        report "$f" "ref_type" "'$v' not in {${REF_TYPE_ENUM// /, }} (§2.2)"
    fi
    v="$(fm_value "$f" review_kind)"
    if [ -n "$v" ] && ! in_set "$v" "$REVIEW_KIND_ENUM"; then
        report "$f" "review_kind" "'$v' not in {${REVIEW_KIND_ENUM// /, }} (§2.2)"
    fi
    v="$(fm_value "$f" verdict)"
    if [ -n "$v" ] && ! in_set "$v" "$VERDICT_ENUM"; then
        report "$f" "verdict" "'$v' not in {${VERDICT_ENUM// /, }} (§2.2)"
    fi
    v="$(fm_value "$f" report_type)"
    if [ -n "$v" ] && ! in_set "$v" "$REPORT_TYPE_ENUM"; then
        report "$f" "report_type" "'$v' not in {${REPORT_TYPE_ENUM// /, }} (§2.2)"
    fi
    if [ "$ftype" = "checklists" ]; then
        v="$(fm_value "$f" item_status)"
        if [ -n "$v" ] && ! in_set "$v" "$ITEM_STATUS_ENUM"; then
            report "$f" "item_status" "'$v' not in {${ITEM_STATUS_ENUM// /, }} (§2.2)"
        fi
    fi

    # --- required per-type extensions present (§2.2) -------------------------
    # A file of a type with required extensions FAILS if any is absent. Presence
    # is keyed off the top-level key list (a required key must appear as a key).
    if [ -n "$ftype" ] && in_set "$ftype" "$TYPES"; then
        for req_ext in $(required_ext_for "$ftype"); do
            if ! printf '%s\n' "$keys" | grep -qx "$req_ext"; then
                report "$f" "$req_ext" "missing required $ftype extension (§2.2)"
            fi
        done
    fi

    # --- slug-link value-shape (§2.1/§2.4) -----------------------------------
    # supersedes / superseded_by / related carry PLAIN SLUGS — the target file's
    # name (= filename stem), never a path and never `[[ ]]`. A scalar slug-link
    # may be null/empty; otherwise it must be a plain slug. `related` is a flow
    # list whose every item must be a plain slug. Reject any path / `.md` / spaced
    # value with a clear message.
    for sl in supersedes superseded_by; do
        v="$(fm_value "$f" "$sl")"
        if [ -n "$v" ] && [ "$v" != "null" ] && ! is_plain_slug "$v"; then
            report "$f" "$sl" "'$v' must be a plain slug, not a path (§2.1/§2.4)"
        fi
    done
    rel_raw="$(fm_value "$f" related)"
    if printf '%s' "$rel_raw" | grep -qE '^\[.*\]$'; then
        rel_body="$(printf '%s' "$rel_raw" | sed -E 's/^\[//; s/\]$//')"
        IFS=',' read -r -a rel_arr <<< "$rel_body"
        for r in "${rel_arr[@]}"; do
            r="$(printf '%s' "$r" | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//')"
            [ -z "$r" ] && continue
            if ! is_plain_slug "$r"; then
                report "$f" "related" "'$r' must be a plain slug, not a path (§2.1/§2.4)"
            fi
        done
    elif [ -z "$rel_raw" ] && fm_is_block_list "$f" related; then
        report "$f" "related" "must be an inline [..] flow list of plain slugs (§2.1/§2.4)"
    elif [ -n "$rel_raw" ] && [ "$rel_raw" != "null" ]; then
        report "$f" "related" "must be a flow list [..] of plain slugs (got '$rel_raw') (§2.1/§2.4)"
    fi

    # --- no-stray-keys --------------------------------------------------------
    # Allowed set = base(11, incl. keywords + author) + slug-link(3) + §2.2 extensions.
    if [ -n "$ftype" ] && in_set "$ftype" "$TYPES"; then
        allowed="$BASE_REQUIRED $SLUG_LINK_FIELDS $(ext_fields_for "$ftype")"
        while IFS= read -r k; do
            [ -z "$k" ] && continue
            if ! in_set "$k" "$allowed"; then
                report "$f" "$k" "stray key — not allowed for type '$ftype' (§2.2/§2.6)"
            fi
        done <<< "$keys"
    fi

    # --- slug uniqueness accumulation ----------------------------------------
    # README.md files are EXEMPT (§2.4): a feature README carries the FIXED identity
    # name `README`, so every feature README shares the same name on purpose — a
    # fixed identity doc, not a unique wikilink-addressed slug. Skip uniqueness for
    # them (the name == stem check above still applies: `README` == `README`).
    if [ "$(basename "$f")" = "README.md" ]; then
        :  # exempt from slug-uniqueness
    elif [ -n "$fname" ]; then
        if [ -n "${seen_name[$fname]:-}" ]; then
            report "$f" "name" "duplicate slug '$fname' — also in ${seen_name[$fname]} (§2.4)"
        else
            seen_name[$fname]="$f"
        fi
    fi
done

# =============================================================================
# Summary + exit.
# =============================================================================
if [ "$violations" -gt 0 ]; then
    log "FAIL: $violations violation(s) across ${#files[@]} file(s)"
    exit 1
fi
log "OK: ${#files[@]} files validated"
exit 0
