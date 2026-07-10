#!/usr/bin/env bash
# check-eval-childdocs.sh — the evaluation child-doc split completeness + inclusion guard.
#
# Feature: "evaluation child-doc 3-way split" — each of the 5 loop skills'
# `evaluation.md` is split into `evaluation.md` (procedure) + `scenario.md` +
# `checklist.md`, and the evaluator gains a filled `checklist.md` as a real 9th
# output file under `evaluation/iter{n}/{system}/`. Every surface that
# authoritatively ENUMERATES or VALIDATES that eval-output directory as a
# structure ("Family-9") must therefore grow to include `checklist.md` (the
# per-system output count goes 8 -> 9).
#
# This guard runs in TWO strictly-separated modes:
#
#   classify-completeness mode (F1) — passes against the CURRENT / mid-rollout
#   tree (i.e. NOW, before the atomic flip). It SWEEPS the source tree for every
#   eval-output-shape surface, CLASSIFIES each genuine hit by the two-family class
#   predicate, and CORRECTNESS-spot-checks every verified-leave. Its `--classify-only`
#   output IS the certified Family-9 surface list the atomic-flip task consumes.
#     --self-test            smoke fixtures; a classification disagreement FAILS.
#     --classify-only        sweep the WHOLE tree, classify every hit, fail-closed.
#     --bundle {loop} --pre-flip   per-bundle classify-completeness for one loop.
#
#   inclusion-enforcement mode (F2) — passes ONLY AFTER the atomic flip, so it is
#   EXPECTED to fail while the rollout is mid-flight.
#     --enforce-inclusion    assert every Family-9 surface now references `checklist.md`.
#
# The two-family class predicate (authoritative source: the feature design D5/D6):
#   Family-9        — a surface that AUTHORITATIVELY ENUMERATES / VALIDATES the
#                     eval-output dir `evaluation/iter{n}/{system}/…` as a structure:
#                     a tree, a table row/cell, a path/file list, an exact-N dir
#                     count/validation, or a DONE-contract "one file per perspective
#                     + overall.md" phrasing. MUST include the filled `checklist.md`
#                     (8 -> 9). Closed under sibling-identity.
#   Family-8        — a finding-file COUNT (RECORD's "Σ systems × 8"). STAYS 8 —
#                     `checklist.md` is a coverage artifact RECORD does not read for
#                     findings.
#   verified-leave  — names an eval path as a single representative token, a
#                     naming-vocabulary rule, a single-file existence/verdict check,
#                     or a content description. NOT edited. Carries a checkable reason
#                     the gate spot-checks (it must NOT exhibit Family-9 structure).
#   not-applicable  — the sweep pattern matched, but the eval-output dir is NOT the
#                     subject (e.g. `wc -l` over promoted files or mirrored skills).
#
# Classification is role-based and structural, segmented by family, and FAIL-CLOSED:
# a genuine hit that fits no family rule is UNCLASSIFIED and blocks; a verified-leave
# that exhibits Family-9 structure is MIS-CLASSIFIED and blocks. The classifier is
# derived from the surface's structural role, not a hardcoded per-line baseline, so
# the guard does not become a third copy of the spec that drifts on every edit.
#
# Args:
#   --self-test                 run the fixed smoke fixtures; exit 0 iff all agree.
#   --classify-only             sweep + classify the whole tree; exit 0 iff every hit
#                               is classified and every verified-leave passes the
#                               correctness spot-check. Prints the certified Family-9
#                               surface list.
#   --bundle <loop> --pre-flip  classify-completeness scoped to one loop's surfaces
#                               (loop ∈ ideation|preparation|planning|execution|wrap-up).
#   --enforce-inclusion         assert every Family-9 surface references `checklist.md`
#                               (EXPECTED to fail pre-flip).
#   --root <dir>                override the gobbi project dir (the dir holding
#                               `skills/` + `agents/`); default resolves from git.
#   --help | -h                 usage.
#
# Exit: 0 = clean / all classified; 1 = violation (unclassified, mis-classified, or
#       missing-inclusion); 2 = bad args / environment.

set -uo pipefail
# Structural role words appear capitalised in the docs ("One per perspective per
# system", "Bare perspective name", "**DONE**"). Case-insensitive bash matching
# keeps the case/[[ ]] hot paths consistent with the case-insensitive grep helper.
shopt -s nocasematch

SELF="check-eval-childdocs.sh"
log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat <<'EOF'
usage:
  check-eval-childdocs.sh --self-test
      Run the smoke fixtures; a classification disagreement fails.
  check-eval-childdocs.sh --classify-only
      Sweep the whole source tree; classify every eval-output-shape hit
      (Family-9 / Family-8 / verified-leave / not-applicable), correctness-check
      every verified-leave, fail-closed on any unclassified/mis-classified hit.
      Prints the certified Family-9 surface list.
  check-eval-childdocs.sh --bundle <loop> --pre-flip
      Classify-completeness scoped to one loop (ideation|preparation|planning|
      execution|wrap-up).
  check-eval-childdocs.sh --enforce-inclusion
      Assert every Family-9 surface references `checklist.md`. EXPECTED to fail
      until the atomic-last parent-contract flip has run.
  check-eval-childdocs.sh [--root <dir>] <mode>
      --root overrides the gobbi project dir (holds skills/ + agents/).
  check-eval-childdocs.sh --help | -h

Exit 0 = clean, 1 = violation, 2 = bad args/environment.
EOF
}

# ---------------------------------------------------------------------------
# Resolve the gobbi project dir robustly, regardless of where this script lives
# (skills/orchestration/scripts/ in production, or a scratch path during dev).
# Precedence: explicit --root > git toplevel > path-relative from the script's
# own location (SCRIPT_DIR/../../.. — the canonical script is 3 dirs under the
# project root). The path-relative fallback keeps the guard working in a git-less
# checkout / tarball. Path-relative resolves to the tree the script physically
# lives in, so a self-referential-repo worktree copy stays anchored to its own
# worktree, never the main checkout.
# ---------------------------------------------------------------------------
ROOT_OVERRIDE=""

resolve_proj() {
    local proj top script_dir
    if [ -n "$ROOT_OVERRIDE" ]; then
        proj="$ROOT_OVERRIDE"
    else
        top="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel 2>/dev/null)"
        if [ -n "$top" ] && [ -d "$top/.gobbi/projects/gobbi/skills" ]; then
            proj="$top/.gobbi/projects/gobbi"
        else
            # path-relative fallback: <proj>/skills/orchestration/scripts/<self>
            script_dir="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
            proj="$(cd "$script_dir/../../.." 2>/dev/null && pwd)"
        fi
    fi
    if [ -z "$proj" ] || [ ! -d "$proj/skills" ] || [ ! -d "$proj/agents" ]; then
        log "cannot resolve the gobbi project dir (skills/ + agents/); pass --root <dir>"
        # RETURN, do not exit: resolve_proj runs inside `$(...)`, so an `exit` here
        # would terminate only the subshell and let main continue with PROJ="" —
        # a fail-OPEN vacuous PASS on an empty tree (F-RISK-1). The caller checks
        # the return status and aborts main with exit 2.
        return 2
    fi
    printf '%s' "$proj"
}

# ---------------------------------------------------------------------------
# Token detectors — one grep -qiE per structural signal. Kept as small named
# predicates so the classifier reads as a decision table. Matching is
# case-insensitive: prose role words appear capitalised ("One per perspective per
# system", "Bare perspective name") and the structural role, not the case, is
# what matters.
# ---------------------------------------------------------------------------
m() { printf '%s' "$1" | grep -qiE "$2"; }       # m <line> <ere>  → match? (ci)
mF() { printf '%s' "$1" | grep -qF "$2"; }       # mF <line> <fixed> → match?

# The bare 7 perspective filenames (used inside fully-expanded trees).
BARE_PERSP='(project|structure|performance|aesthetics|usage|consistency|risk)\.md'

# eval-output-dir path token: the {perspective}.md output-file path token.
has_persptok() { m "$1" '\{perspective\}\.md'; }
# the overall.md output-file token.
has_overall()  { m "$1" 'overall\.md'; }
# the eval-output directory path.
has_iterpath() { m "$1" 'evaluation/iter'; }
# the "per-perspective file(s)" prose vocabulary.
has_ppfiles()  { m "$1" 'per-perspective files?'; }
has_perspword(){ m "$1" 'per-perspective'; }
# a bare per-file tree node (performance.md etc.) or "(same N files)".
has_barefile() { m "$1" "$BARE_PERSP"; }
has_samefiles(){ m "$1" 'same [0-9]+ (well-formed )?files'; }
# count / validation shapes.
has_wcl()      { m "$1" 'wc -l'; }
has_mustben()  { m "$1" 'must be [0-9]'; }
has_nfiles()   { m "$1" '[0-9]+ (well-formed )?files|exactly [a-z ]*[0-9]+ files'; }
# a FINDING-HIT count — a finding-vocab file-glob piped to wc -l (counts grep hits
# across the finding-bearing files, e.g. `… codex/{project,…,overall}.md | wc -l  # >= 1
# hit per file`). This is a Family-8-class count that STAYS a finding count: the task-10
# flip EXCLUDES checklist.md from the glob by naming the 8 finding-bearing files
# explicitly (checklist.md carries no finding vocab), it does NOT go 8→9. The `hit per
# file` comment token is the on-line signal `has_findingcount` keys on post-flip.
# Distinct from a dir file-count (`ls …/codex/ | wc -l  # must be 9`), which IS Family-9.
has_findingcount() { m "$1" '\*\.md.*wc -l|hit per file'; }
# DONE-contract enumeration phrasings.
has_done()     { m "$1" 'one( output)? file per perspective|seven per-perspective files? \+ one overall|per perspective \+ overall\.md'; }
# any eval-output vocabulary at all (the subject signal).
has_evalvocab() {
    has_persptok "$1" || has_overall "$1" || has_iterpath "$1" \
        || has_ppfiles "$1" || has_perspword "$1" || has_done "$1"
}

# --- role signals -----------------------------------------------------------
# the "one-per-system" quantifier — the distinctive discriminator of an OUTPUT
# declaration (the evaluator writes one file per system × perspective). Input-read
# rows, access-matrix rows, and content-description prose never carry it.
has_persystem() { m "$1" 'one (output )?(file )?per system|per system . perspective|one per system|one per perspective per system'; }

# a precise PATH-PAIR — {perspective}.md and overall.md joined as a path LIST by a
# `+` / `,` list-joiner (optionally with each token carrying its full path prefix,
# e.g. `…/{perspective}.md` + `…/overall.md`). This is the Family-9 set-enumeration
# form. The joiner MUST sit immediately after {perspective}.md (only backticks /
# spaces between), so the two tokens separated by naming-vocabulary PROSE
# ("…{perspective}.md where {system} ∈ {claude, codex} … plus overall.md") do NOT
# match — that prose is verified-leave.
has_pathpair() { m "$1" '\{perspective\}\.md`? *[,+] *`?[^ |]*overall\.md'; }

# first cell of a markdown table row is an eval-output PATH (a path-valued
# Output-paths / path-catalog row). Distinguishes an output-declaration row
# (path in cell 1) from an input-read / access-matrix / field-name row (cell 1
# is a step number, a prose description, or a field name).
first_cell_is_evalpath() {
    local l="$1" c1
    m "$l" '^\|' || return 1
    c1="$(printf '%s' "$l" | sed -E 's/^\|[[:space:]]*//; s/[[:space:]]*\|.*$//')"
    m "$c1" 'evaluation/iter' && { m "$c1" '\{perspective\}\.md|overall\.md'; }
}

# output-path DECLARATION → Family-9 (enumerates the output contract):
#   - a "**Output path**: …{perspective}.md" prose declaration, OR
#   - an Outputs bullet / Output-paths table row that states an eval-output path
#     WITH the one-per-system quantifier (which distinguishes a written-output
#     declaration from an input-read / access-matrix / divergence-description row), OR
#   - a table row whose FIRST cell is an eval-output path (path-catalog / Output-paths).
role_outputdecl() {
    local l="$1"
    m "$l" 'Output path' && { has_persptok "$l" || has_overall "$l"; } && return 0
    if m "$l" '^[-*|]' && has_iterpath "$l" && { has_persptok "$l" || has_overall "$l"; } \
        && has_persystem "$l"; then
        return 0
    fi
    # word-count Output-reminder enumerations: "- Seven per-perspective files at
    # …/{project,…,risk}.md" / "- One overall file at …/overall.md" (the two-line
    # bullet form of the output reminder). The count-in-words + eval-output path
    # enumerates the output set.
    m "$l" 'seven per-perspective files|one overall file' && has_iterpath "$l" && return 0
    first_cell_is_evalpath "$l" && return 0
    return 1
}

# dispatch prompt / representative single token: a prompt line or an in-tree
# "write to …/{perspective}.md" instruction — a single representative token, VL.
role_dispatch() {
    local l="$1"
    m "$l" 'prompt:|Agent\(|write to ' && { has_persptok "$l" || has_overall "$l"; }
}

# single-file existence / verdict check: `test -f …/overall.md`, `grep … overall.md`.
role_singlecheck() {
    local l="$1"
    m "$l" 'test -f|grep ' && has_overall "$l" && ! has_persptok "$l"
}

# naming-vocabulary rule: names the bare perspective/system vocabulary, not the set.
role_namingvocab() {
    local l="$1"
    m "$l" 'bare .*perspective|perspective name|\{system\} . \{claude, ?codex\}|where .\{system\}|named .*\{perspective\}\.md'
}

# content-description: describes what the files CONTAIN, not the dir structure.
role_contentdesc() {
    local l="$1"
    m "$l" 'file contains|files? contain|contains:' && ! role_outputdecl "$l"
}

# ---------------------------------------------------------------------------
# classify <line> <in_eval_tree:0|1> <overall_neighbor:0|1> <relpath> <near_evalset:0|1>
#   → prints one of: FAMILY-9 | FAMILY-8 | VERIFIED-LEAVE | NOT-APPLICABLE | UNCLASSIFIED
# Role-based, segmented by family, fail-closed. `near_evalset` = the ±6-line window
# names the 7-perspectives + overall.md output SET (a section-scoped subject signal).
# ---------------------------------------------------------------------------
classify() {
    local l="$1" tree="$2" nbr="$3" rel="$4" near="${5:-0}"

    # STEP A — SUBJECT filter. A count/wc-l/N-files hit with NO eval-output
    # vocabulary is about some other subject (promoted files, mirrored skills,
    # task span). Not a genuine eval-output hit.
    if ! has_evalvocab "$l" && [ "$tree" != "1" ]; then
        # Count-in-eval-section recovery: a bare exact-N / wc -l / must-be-N count
        # with no LOCAL eval vocab but sitting inside an eval-output enumeration
        # section (±6 window names "N files (7 perspectives + overall.md)") is a
        # genuine exact-N validation of the output set → Family-9. This is the one
        # place a section-scoped subject signal is needed; every NON-count NA hit
        # (and every count outside such a section) stays not-applicable.
        if [ "$near" = "1" ] && ! has_findingcount "$l" \
            && { has_wcl "$l" || has_mustben "$l" || has_nfiles "$l"; }; then
            printf 'FAMILY-9'; return 0
        fi
        printf 'NOT-APPLICABLE'; return 0
    fi

    # STEP B — FAMILY-8 (a count that STAYS 8, NOT an eval-output-set inclusion
    # surface). Two shapes:
    #   - RECORD's finding-file count "Σ systems × 8" (checklist.md is not a finding
    #     file), pinned to record.md's Σ×N shape; and
    #   - a finding-HIT `*.md`-glob count (e.g. `codex/SKILL.md:387`
    #     `… codex/*.md | wc -l  # >= 1 hit per file`). Its task-10 edit is to EXCLUDE
    #     checklist.md from the finding-vocab glob (checklist.md carries no finding
    #     vocab), NOT to add a checklist.md reference / go 8→9 — so it must NOT be in
    #     the enforce inclusion set. Closed under sibling-identity via has_findingcount.
    if { [ "${rel##*/}" = "record.md" ] && m "$l" '(Σ|systems?).*×[[:space:]]*[0-9]'; } \
        || has_findingcount "$l"; then
        printf 'FAMILY-8'; return 0
    fi

    # STEP C — FAMILY-9 (SET enumeration / validation of the eval-output dir).
    # C1: tree node under an evaluation/iter subtree.
    if [ "$tree" = "1" ]; then printf 'FAMILY-9'; return 0; fi
    # C2: a precise PATH-PAIR — {perspective}.md and overall.md JOINED as a path list.
    #     Runs before the VL-guard so a genuine path-list row wins even when it also
    #     carries naming words (e.g. `orchestration/SKILL.md:199`).
    if has_pathpair "$l"; then printf 'FAMILY-9'; return 0; fi

    # VL-GUARD: a naming-vocabulary rule or a content-description names the eval
    # filenames / describes file contents WITHOUT enumerating the output dir as a
    # structure — verified-leave, even if both tokens co-occur. This separates
    # `record/SKILL.md:166` / `orchestration/SKILL.md:248` (naming-vocab, VL) from
    # `record-map.md:42` (a joined path list, F9). It runs after C1/C2 so a genuine
    # tree node or joined path list still wins.
    if role_namingvocab "$l" || role_contentdesc "$l"; then printf 'VERIFIED-LEAVE'; return 0; fi

    # C3: an Output-paths table PAIR — a perspective-path row adjacent to an
    #     overall-path row; the pair enumerates the set.
    if role_outputdecl "$l" && [ "$nbr" = "1" ]; then printf 'FAMILY-9'; return 0; fi
    # C4: exact-N count / validation naming the output set.
    if { has_wcl "$l" || has_mustben "$l" || has_nfiles "$l"; } \
        && { has_persptok "$l" || has_overall "$l" || has_iterpath "$l" || has_barefile "$l" || has_samefiles "$l" || has_perspword "$l"; }; then
        printf 'FAMILY-9'; return 0
    fi
    # C5: DONE-contract enumeration phrasing.
    if has_done "$l"; then printf 'FAMILY-9'; return 0; fi
    # C5b: an evaluator DONE-STATUS line that reports writing the per-perspective
    #      output files ("**DONE** — … per-perspective files written") — the
    #      output-completion contract that must gain "+ the filled checklist.md".
    #      Precise: requires the `**DONE**` marker, so it catches the DONE template
    #      (`delegation/templates/evaluator.md:139`) without over-matching the
    #      evaluator-topology / example-report lines that merely say "7 perspectives
    #      + Overall" (verified-leave).
    if m "$l" '\*\*done\*\*' && has_ppfiles "$l"; then printf 'FAMILY-9'; return 0; fi
    # C6: an output-path declaration (Output path prose / a path-first Output-paths
    #     or path-catalog table row) — enumerates the output contract.
    if role_outputdecl "$l"; then printf 'FAMILY-9'; return 0; fi

    # STEP D — VERIFIED-LEAVE (genuine eval-output vocabulary, but a single
    # representative / naming rule / single-file check / content description /
    # broad wording — NOT a set enumeration).
    if role_dispatch "$l"    ; then printf 'VERIFIED-LEAVE'; return 0; fi
    if role_singlecheck "$l" ; then printf 'VERIFIED-LEAVE'; return 0; fi
    if role_namingvocab "$l" ; then printf 'VERIFIED-LEAVE'; return 0; fi
    if role_contentdesc "$l" ; then printf 'VERIFIED-LEAVE'; return 0; fi
    # broad "per-perspective files" prose, or a single {perspective}.md / overall.md
    # reference that is neither an output declaration nor a set enumeration.
    if has_ppfiles "$l" || has_perspword "$l" || has_persptok "$l" || has_overall "$l" || has_iterpath "$l"; then
        printf 'VERIFIED-LEAVE'; return 0
    fi

    # STEP E — fail-closed: a genuine hit that matches no family rule blocks.
    printf 'UNCLASSIFIED'; return 0
}

# The independent Family-9 structure probe used by the correctness spot-check on a
# verified-leave surface. It is deliberately BROADER than the classifier's F9 rules
# — it fires on the LOOSE both-tokens co-occurrence, not only the precise joined
# path-pair — so it catches a verified-leave that carries latent set structure. A
# genuine naming-vocabulary / content-description reason EXEMPTS the line (that is
# the checkable reason the spot-check honours); any other verified-leave that
# exhibits Family-9 structure is MIS-CLASSIFIED and blocks.
f9_structure_probe() {
    local l="$1" tree="$2" nbr="$3"
    # honour the verified-leave reason: naming-vocabulary / content-description
    # legitimately names the filenames without enumerating the dir.
    role_namingvocab "$l" && return 1
    role_contentdesc "$l" && return 1
    [ "$tree" = "1" ] && return 0
    { has_persptok "$l" && has_overall "$l"; } && return 0
    { has_wcl "$l" || has_mustben "$l" || has_nfiles "$l"; } \
        && { has_persptok "$l" || has_overall "$l"; } && return 0
    has_done "$l" && return 0
    { role_outputdecl "$l" && [ "$nbr" = "1" ]; } && return 0
    return 1
}

# ---------------------------------------------------------------------------
# Scan-surface discovery. Source-of-truth tree only: skills/ (minus the frozen
# skill-surface mistakes.md files, which are historical-leave, never edited) +
# agents/. sessions/ worktrees/ tmp/ archive/ pruned.
# ---------------------------------------------------------------------------
list_scan_files() {
    local proj="$1"
    find "$proj/skills" \
        \( -type d \( -name sessions -o -name worktrees -o -name tmp -o -name archive \) -prune \) \
        -o \( -type f -name '*.md' ! -name 'mistakes.md' -print \)
    find "$proj/agents" -type f \( -name '*.md' -o -name '*.toml' \) 2>/dev/null
}

# The union sweep pattern — every eval-output-shape family (output-shape, N-file,
# exact-N dir validation, DONE-contract). Tree nodes are picked up via overall.md
# / {perspective}.md / "(same N files)". `evaluation/iter` and the per-system
# output-declaration token are included (F-CONSIST-1) so a line carrying ONLY
# those tokens — which `has_iterpath` / `has_persystem` consume downstream — still
# reaches the fail-closed classifier instead of silently escaping the sweep; the
# classifier then correctly lands them verified-leave / not-applicable.
SWEEP_RE='\{perspective\}\.md|overall\.md|per-perspective files?|one( output)? file per perspective|per perspective \+ overall|[0-9]+ (well-formed )?files|exactly [a-z ]*[0-9]+ files|wc -l|must be [0-9]|evaluation/iter|one( output)?( file)? per system|one per perspective per system|per system . perspective'

# ---------------------------------------------------------------------------
# Sweep + classify one file. Emits, on stdout, one record per genuine hit:
#   <relpath>:<lineno>\t<FAMILY>\t<line-excerpt>
# Tracks fenced code blocks and eval-output subtree context so tree nodes classify
# Family-9. Uses a ±2-line neighbour probe for Output-paths table pairs.
# ---------------------------------------------------------------------------
PROJ=""            # set in main
VERBOSE="${VERBOSE:-0}"    # VERBOSE=1 prints every hit's family (audit aid)
declare -a EMIT_F9=()      # relpath:line of Family-9 hits (certified output)
declare -a EMIT_F8=()      # relpath:line of Family-8 (stays-8) surfaces — surfaced
                           # for task 10 (record.md count stays 8; a finding-hit
                           # glob count must EXCLUDE checklist.md). Not enforced.
EMIT_UNCLASSIFIED=0
EMIT_MISCLASSIFIED=0
SCANNED_FILES=0            # files actually scanned this run (0 = broken scan surface)
TOTAL_HITS=0               # sweep hits classified this run (0 = empty inventory)

# Per-file context, loaded once per file and shared by the sweep and the faithful
# single-line classifier used by --self-test.
declare -a FL=()           # 1-indexed file lines
declare -a FTREE=()        # 1-indexed eval-tree flags
FTOTAL=0

# is_eval_pathnode <line> — a genuine directory-tree PATH node (not a dispatch /
# topology diagram node). Excludes lines carrying dispatch words so the codex
# `manager ├── Agent(...) prompt:` diagram is NOT mistaken for an eval-output tree.
# Hot-path: bash builtins only (no grep fork) — called for every in-fence line.
is_eval_pathnode() {
    local l="$1"
    # exclude dispatch / topology diagram nodes
    case "$l" in
        *prompt:*|*'Agent('*|*manager*|*waits*|*'report DONE'*|*'→'*|*'↑'*) return 1 ;;
    esac
    # must carry a tree-drawing prefix or be an indented path node
    case "$l" in
        *'├'*|*'└'*|*'│'*) : ;;
        *) [[ $l =~ ^[[:space:]]+(claude|codex|iter) ]] || return 1 ;;
    esac
    # the node names an eval-output path component
    case "$l" in
        *'{perspective}.md'*|*overall.md*|*claude/*|*codex/*|*'iter{'*) return 0 ;;
    esac
    [[ $l =~ (project|structure|performance|aesthetics|usage|consistency|risk)\.md ]] && return 0
    [[ $l =~ same[[:space:]][0-9]+[[:space:]]("well-formed"[[:space:]])?files ]] && return 0
    return 1
}

# load_file_ctx <file> — read the file into FL[] (1-indexed) and compute the
# per-line eval-tree flag FTREE[]. The per-line context scan is the hot path
# (every line of every file), so it uses bash builtins (case / [[ ]]) rather than
# a grep fork per line.
load_file_ctx() {
    local file="$1"
    FL=(); FTREE=(); FTOTAL=0
    local ln=0 line trimmed
    while IFS= read -r line || [ -n "$line" ]; do
        ln=$((ln + 1)); FL[$ln]="$line"
    done < "$file"
    FTOTAL=$ln
    local in_fence=0 block_eval=0 block_iter=0 i
    for ((i = 1; i <= FTOTAL; i++)); do
        line="${FL[$i]}"
        FTREE[$i]=0
        trimmed="${line#"${line%%[![:space:]]*}"}"
        if [[ $trimmed == '```'* ]]; then
            if [ "$in_fence" = "0" ]; then in_fence=1; else in_fence=0; fi
            block_eval=0; block_iter=0
            continue
        fi
        [ "$in_fence" = "1" ] || continue
        case "$line" in *evaluation/iter*) block_eval=1; block_iter=1 ;; esac
        case "$line" in *evaluation/*) block_eval=1 ;; esac
        # an iter node in any form — brace `iter{n}/`, or literal `iter1/`/`itern/`.
        case "$line" in *'iter{'*) block_iter=1 ;; *iter[0-9n]*) block_iter=1 ;; esac
        if [ "$block_eval" = "1" ] && [ "$block_iter" = "1" ] && is_eval_pathnode "$line"; then
            FTREE[$i]=1
        fi
    done
}

# overall.md eval-path within ±2 lines of <lineno> (Output-paths table pairs).
# Bash-builtin (no grep) — called per hit.
overall_neighbor() {
    local i="$1" j l
    for ((j = i - 2; j <= i + 2; j++)); do
        [ "$j" -ge 1 ] && [ "$j" -le "$FTOTAL" ] && [ "$j" -ne "$i" ] || continue
        l="${FL[$j]}"
        [[ $l == *overall.md* && $l == *evaluation/iter* ]] && { printf 1; return; }
    done
    printf 0
}

# near_evalset <lineno> — does the ±6-line window name the eval-output SET (a line
# carrying both `overall.md` and a "perspective(s)" word, i.e. the
# "N files (7 perspectives + overall.md)" enumeration signature)? Used only to
# recover a bare exact-N count that sits in an eval-output section but names no
# eval token on its own line (e.g. `evaluation.md:189` "Exactly 8 files …", whose
# section header `:184` carries "8 well-formed files (7 perspectives + overall.md)").
near_evalset() {
    local i="$1" j l
    for ((j = i - 6; j <= i + 6; j++)); do
        [ "$j" -ge 1 ] && [ "$j" -le "$FTOTAL" ] || continue
        l="${FL[$j]}"
        [[ $l == *overall.md* && $l == *perspective* ]] && { printf 1; return; }
    done
    printf 0
}

# classify_file_line <file> <lineno> — classify a single line using the SAME
# per-file context (tree + neighbour) the sweep uses, so --self-test is faithful.
classify_file_line() {
    local file="$1" lineno="$2" rel
    rel="${file#"$PROJ"/}"
    load_file_ctx "$file"
    local nbr near
    nbr="$(overall_neighbor "$lineno")"
    near="$(near_evalset "$lineno")"
    classify "${FL[$lineno]}" "${FTREE[$lineno]}" "$nbr" "$rel" "$near"
}

sweep_file() {
    local file="$1" rel="$2" mode="$3"   # mode: print | quiet
    load_file_ctx "$file"
    # One grep per file yields the candidate hit line numbers; classify only those
    # (classify is grep-heavy, so restricting it to real hits keeps the sweep fast).
    local i line fam nbr near hitline
    while IFS= read -r hitline; do
        i="${hitline%%:*}"
        [ -n "$i" ] || continue
        line="${FL[$i]}"
        nbr="$(overall_neighbor "$i")"
        near="$(near_evalset "$i")"
        fam="$(classify "$line" "${FTREE[$i]}" "$nbr" "$rel" "$near")"
        TOTAL_HITS=$((TOTAL_HITS + 1))
        [ "$VERBOSE" = "1" ] && printf '%-14s %s:%d | %s\n' "$fam" "$rel" "$i" "$(printf '%s' "$line" | cut -c1-80)"
        case "$fam" in
            FAMILY-9)
                EMIT_F9+=("$rel:$i")
                [ "$mode" = "print" ] && [ "$VERBOSE" != "1" ] && printf 'FAMILY-9      %s:%d\n' "$rel" "$i"
                ;;
            UNCLASSIFIED)
                EMIT_UNCLASSIFIED=$((EMIT_UNCLASSIFIED + 1))
                printf 'UNCLASSIFIED  %s:%d  | %s\n' "$rel" "$i" "$(printf '%s' "$line" | cut -c1-90)"
                ;;
            VERIFIED-LEAVE)
                if f9_structure_probe "$line" "${FTREE[$i]}" "$nbr"; then
                    EMIT_MISCLASSIFIED=$((EMIT_MISCLASSIFIED + 1))
                    printf 'MIS-CLASSIFIED %s:%d  (verified-leave exhibits Family-9 structure) | %s\n' \
                        "$rel" "$i" "$(printf '%s' "$line" | cut -c1-70)"
                fi
                ;;
            FAMILY-8)
                EMIT_F8+=("$rel:$i")
                ;;
            NOT-APPLICABLE) : ;;
        esac
    done < <(grep -nE "$SWEEP_RE" "$file" 2>/dev/null)
}

# ---------------------------------------------------------------------------
# classify-completeness driver over a set of files.
# ---------------------------------------------------------------------------
run_classify() {
    local mode="$1"; shift
    local -a files=("$@")
    EMIT_F9=(); EMIT_F8=(); EMIT_UNCLASSIFIED=0; EMIT_MISCLASSIFIED=0
    SCANNED_FILES=0; TOTAL_HITS=0
    local f rel
    for f in "${files[@]}"; do
        [ -f "$f" ] || continue
        SCANNED_FILES=$((SCANNED_FILES + 1))
        rel="${f#"$PROJ"/}"
        sweep_file "$f" "$rel" "$mode"
    done
}

# Fail-closed empty-inventory guard (F-RISK-1 second layer): a run that scanned no
# files, or found no eval-output-shape hit at all, is an ERROR — never a vacuous
# PASS. The real source tree always carries eval-output surfaces; a zero here means
# a mis-resolved / broken scan surface. Deliberately NOT a hardcoded "expect 59"
# baseline (that would be the hardcoded-baseline anti-pattern) — it keys on zero.
assert_nonempty_scan() {
    if [ "$SCANNED_FILES" -eq 0 ]; then
        log "FAIL: 0 files scanned — broken or mis-resolved scan surface (not a PASS)"
        return 2
    fi
    if [ "$TOTAL_HITS" -eq 0 ]; then
        log "FAIL: 0 eval-output-shape hits found — empty inventory (not a PASS)"
        return 2
    fi
    return 0
}

# ---------------------------------------------------------------------------
# Modes.
# ---------------------------------------------------------------------------
mode_classify_only() {
    local -a files=()
    while IFS= read -r f; do files+=("$f"); done < <(list_scan_files "$PROJ" | sort)
    run_classify print "${files[@]}"
    assert_nonempty_scan || return $?

    # Machine-readable, per-path:line certified Family-9 list — the atomic-flip task
    # consumes it with: `... --classify-only | awk -F'\t' '$1=="FAMILY9"{print $2}'`.
    printf '\n--- certified Family-9 surfaces (%d) ---\n' "${#EMIT_F9[@]}"
    printf '%s\n' "${EMIT_F9[@]}" | sort | while IFS= read -r loc; do
        [ -n "$loc" ] && printf 'FAMILY9\t%s\n' "$loc"
    done
    # Family-8 "stays-8" surfaces — surfaced so task 10 does not lose them. They are
    # NOT in the checklist.md-inclusion set: record.md's Σ×8 stays 8 (no edit), and a
    # finding-hit `*.md`-glob count must EXCLUDE checklist.md from its glob.
    if [ "${#EMIT_F8[@]}" -gt 0 ]; then
        printf '\n--- Family-8 stays-8 surfaces (%d) — NOT enforced; exclude/keep-8 co-touch ---\n' "${#EMIT_F8[@]}"
        printf '%s\n' "${EMIT_F8[@]}" | sort | while IFS= read -r loc; do
            [ -n "$loc" ] && printf 'FAMILY8\t%s\n' "$loc"
        done
    fi
    printf '\n'
    if [ "$EMIT_UNCLASSIFIED" -gt 0 ] || [ "$EMIT_MISCLASSIFIED" -gt 0 ]; then
        log "FAIL: $EMIT_UNCLASSIFIED unclassified, $EMIT_MISCLASSIFIED mis-classified hit(s) (fail-closed)"
        return 1
    fi
    printf '%s: classify-completeness PASS — every genuine hit classified, every verified-leave correctness-checked (%d Family-9)\n' \
        "$SELF" "${#EMIT_F9[@]}"
    return 0
}

mode_bundle() {
    local loop="$1"
    case "$loop" in
        ideation|preparation|planning|execution|wrap-up) : ;;
        *) log "unknown loop '$loop' (ideation|preparation|planning|execution|wrap-up)"; exit 2 ;;
    esac
    local -a files=()
    local c
    for c in \
        "$PROJ/skills/$loop/SKILL.md" \
        "$PROJ/skills/$loop/evaluation.md" \
        "$PROJ/skills/$loop/scenario.md" \
        "$PROJ/skills/$loop/checklist.md" \
        "$PROJ/skills/orchestration/workflow/$loop.md"; do
        [ -f "$c" ] && files+=("$c")
    done
    if [ "${#files[@]}" -eq 0 ]; then
        log "no bundle surfaces found for loop '$loop'"; exit 2
    fi
    run_classify print "${files[@]}"
    assert_nonempty_scan || return $?
    printf '\n%s: bundle=%s Family-9=%d unclassified=%d mis-classified=%d\n' \
        "$SELF" "$loop" "${#EMIT_F9[@]}" "$EMIT_UNCLASSIFIED" "$EMIT_MISCLASSIFIED"
    if [ "$EMIT_UNCLASSIFIED" -gt 0 ] || [ "$EMIT_MISCLASSIFIED" -gt 0 ]; then return 1; fi
    return 0
}

# --- inclusion (F2) association helpers ------------------------------------
# A line whose subject is an eval-output-set COUNT (the count the flip takes 8→9).
is_count_line() {
    m "$1" '[0-9]+ (well-formed )?files|exactly [a-z ]*[0-9]+ files|same [0-9]+ files|wc -l|must be [0-9]'
}
# A numeric count line's OWN count now shows the new set size 9 (the design's 8→9
# contract). This is the ONLY on-line satisfaction signal for a numeric count — a
# `checklist.md` TOKEN merely appearing on a still-`must be 8` line is NOT evidence
# the count flipped (N-USAGE-4).
count_incremented() {
    m "$1" '(^|[^0-9])9( well-formed)? files|same 9 files|must be 9|exactly [a-z ]*9 files'
}
# option (b): a stays-N count is legitimately flipped by an ADJACENT existence check
# — `test -f …/checklist.md` / `[ -f …/checklist.md ]` (design D5 §L, "keep the 8
# finding-bearing count + add an explicit test -f …/checklist.md"). The count line
# ITSELF is EXCLUDED, and only an existence-CHECK (not a bare checklist.md token)
# counts, so it cannot be satisfied by a stray token or a distant tree node. Reads
# the caller's (inclusion_present's) local L[] via bash dynamic scope.
adjacent_testf_checklist() {  # <lineno> <lo> <hi>
    local ln="$1" lo="$2" hi="$3" j s e
    s=$((ln - 4)); e=$((ln + 4))
    [ "$s" -lt "$lo" ] && s="$lo"; [ "$e" -gt "$hi" ] && e="$hi"
    for ((j = s; j <= e; j++)); do
        [ "$j" -eq "$ln" ] && continue
        [[ ${L[$j]} == *checklist.md* ]] && m "${L[$j]}" 'test -f|test -e|\[ -f|\[ -e' && return 0
    done
    return 1
}
# A numeric count line is SATISFIED iff (a) its own count incremented 8→9, OR
# (b) an adjacent existence check asserts checklist.md. NOT by an on-line token.
count_satisfied() {  # <line> <lineno> <lo> <hi>
    count_incremented "$1" && return 0
    adjacent_testf_checklist "$2" "$3" "$4" && return 0
    return 1
}
# is_genuine_table_row <lineno> — is L[lineno] a GENUINE markdown table row? True iff
# it is table-row-SHAPED (starts with optional whitespace then `|`) AND its contiguous
# `|`-block contains a `|---|`-style separator row (all-dash/colon cells). This is the
# STRUCTURAL discriminator between a real table and a count line: a count line has a
# shell `|` (pipe) but no separator (and a count BULLET starts with `-`, not `|`), so
# it is never a genuine table; a genuine table row always is — even when a cell holds
# a count phrase (its F9 flip is adding a checklist.md ROW, not incrementing a cell).
# Reads inclusion_present's local L[] / n via bash dynamic scope.
# table_row_shaped <line> — a markdown table-ROW line: after stripping leading
# whitespace it starts with `|`. A pipe-bearing PROSE line (`… | …`) or a count
# bullet (`- \`ls … | wc -l\``) is NOT table-row-shaped (its `|` is mid-line).
table_row_shaped() {
    local t="${1#"${1%%[![:space:]]*}"}"   # strip leading whitespace
    [[ $t == '|'* ]]
}
# table_block <lineno> — set TBL_S/TBL_E to the maximal run of CONSECUTIVE
# table-row-shaped lines around <lineno>. The extend STOPS at the first blank line
# or any non-table-row line, so an adjacent prose line (even glued with no blank
# line, even containing a `|` and `checklist.md`) is OUTSIDE the block (N-RISK-5).
# ONE helper, used by both the separator check and the checklist.md-row scan, so
# the boundary rule cannot drift between the two sites (N-STRUCT-7).
TBL_S=0; TBL_E=0
table_block() {
    local ln="$1"
    TBL_S=$ln; TBL_E=$ln
    while [ "$TBL_S" -gt 1 ] && table_row_shaped "${L[$((TBL_S - 1))]}"; do TBL_S=$((TBL_S - 1)); done
    while [ "$TBL_E" -lt "$n" ] && table_row_shaped "${L[$((TBL_E + 1))]}"; do TBL_E=$((TBL_E + 1)); done
}
is_genuine_table_row() {
    local ln="$1"
    table_row_shaped "${L[$ln]}" || return 1
    table_block "$ln"
    local j t
    for ((j = TBL_S; j <= TBL_E; j++)); do
        t="${L[$j]//|/}"; t="${t//-/}"; t="${t//:/}"; t="${t// /}"; t="${t//$'\t'/}"
        [ -z "$t" ] && [[ ${L[$j]} == *-* ]] && return 0   # a |---| separator row
    done
    return 1
}
# The system dir a tree node belongs to, from the node's own text (claude|codex|"").
node_system() {
    case "$1" in *codex*) printf codex ;; *claude*) printf claude ;; *) printf '' ;; esac
}

# inclusion_present <rel> <lineno> — is the Family-9 surface at <lineno> flipped, per
# its OWN structural unit (F-USAGE-2)? Per-unit association, so a partial flip that
# updates ONE sibling but leaves this surface stale is caught:
#   - NUMERIC COUNT line              → satisfied ONLY by (a) its OWN count
#     incrementing 8→9, OR (b) an adjacent `test -f …/checklist.md` existence check
#     (design D5 §L stays-8+test-f form). NOT by a checklist.md token on the stale
#     count line, and never by a distant one (N-USAGE-3 / N-USAGE-4).
#   - tree node naming a SYSTEM (claude/codex) → a `checklist.md` line naming the SAME
#     system must exist in the fenced block (per-branch: a partial flip of only one
#     system leaves the other system's node failing).
#   - other tree node / NON-count prose (overall.md, an Output-path / DONE
#     declaration) → a `checklist.md` on THIS line or an ADJACENT sibling (±2 lines);
#     naming checklist.md on a prose declaration IS its legitimate flip signal.
#   - GENUINE markdown table row (table-row-shaped AND a `|---|` separator in its
#     block) → a `checklist.md` ROW in the CONTIGUOUS table (a table's output set is
#     flipped as one unit). Count-vs-table is a STRUCTURAL, mutually-exclusive
#     distinction (is_genuine_table_row), so a count cell inside a real table uses
#     the table rule and a pipe-bearing count line uses the count rule (R-USAGE-6).
inclusion_present() {
    local rel="$1" lineno="$2" file="$PROJ/$rel"
    local -a L=(); local n=0 line
    while IFS= read -r line || [ -n "$line" ]; do n=$((n + 1)); L[$n]="$line"; done < "$file"
    [ "$lineno" -ge 1 ] && [ "$lineno" -le "$n" ] || return 1
    local i t hit="${L[$lineno]}"

    # 1) enclosing fenced code block? → tree / code-block node.
    local in_fence=0 cur_start=0 fstart=0 fend=0
    for ((i = 1; i <= n; i++)); do
        t="${L[$i]#"${L[$i]%%[![:space:]]*}"}"
        if [[ $t == '```'* ]]; then
            if [ "$in_fence" = "0" ]; then in_fence=1; cur_start=$i
            else
                in_fence=0
                if [ "$lineno" -gt "$cur_start" ] && [ "$lineno" -lt "$i" ]; then fstart=$cur_start; fend=$i; break; fi
            fi
        fi
    done
    if [ "$fstart" -gt 0 ]; then
        local sys; sys="$(node_system "$hit")"
        if is_count_line "$hit"; then
            # A numeric count is satisfied ONLY by (a) its own count incrementing
            # 8→9, or (b) an ADJACENT `test -f …/checklist.md` existence check (the
            # design's stays-8 + test-f form). NOT by a checklist.md token on the
            # stale count line, and NOT by a distant/same-system checklist.md
            # (N-USAGE-3 / N-USAGE-4). Finding-HIT counts are Family-8, not enforced.
            count_satisfied "$hit" "$lineno" "$fstart" "$fend" && return 0
            return 1
        fi
        if [ -n "$sys" ]; then
            # per-system branch: a partial flip of only one system leaves the other
            # system's node with no same-system checklist.md → correctly fails.
            for ((i = fstart; i <= fend; i++)); do
                [[ ${L[$i]} == *checklist.md* ]] && [[ ${L[$i]} == *"$sys"* ]] && return 0
            done
            return 1
        fi
        # non-system, non-count node (e.g. `overall.md`) → checklist.md must be an
        # ADJACENT sibling (±2), not anywhere in the fence.
        for ((i = lineno - 2; i <= lineno + 2; i++)); do
            [ "$i" -ge "$fstart" ] && [ "$i" -le "$fend" ] && [[ ${L[$i]} == *checklist.md* ]] && return 0
        done
        return 1
    fi

    # STRUCTURAL dispatch (mutually exclusive) — a line is EITHER a genuine markdown
    # table row OR a count line, never both, so order-independence is guaranteed:
    #
    # 2) GENUINE markdown table row (table-row-shaped AND a `|---|` separator in its
    #    contiguous block) → the TABLE rule: a checklist.md ROW anywhere in the table
    #    satisfies it. This holds EVEN when a cell contains a count phrase (`must be 9
    #    files`) — a genuine table's F9 flip is adding a checklist.md row, never
    #    incrementing a cell count (R-USAGE-6 A2/A3).
    if is_genuine_table_row "$lineno"; then
        # scan ONLY the bounded genuine-table block (table_block sets TBL_S/TBL_E) —
        # an adjacent pipe-bearing prose line that mentions checklist.md is outside it.
        table_block "$lineno"
        for ((i = TBL_S; i <= TBL_E; i++)); do [[ ${L[$i]} == *checklist.md* ]] && return 0; done
        return 1
    fi

    # 3) NUMERIC COUNT line (a `wc -l` / `# must be N` count that is NOT a genuine
    #    table — a fenced tree count node or an inline count bullet; it may carry a
    #    shell `|` but has no `|---|` separator) → satisfied ONLY by its own count
    #    incrementing 8→9 OR an adjacent test-f checklist.md, never an on-line token.
    if is_count_line "$hit"; then count_satisfied "$hit" "$lineno" 1 "$n" && return 0; return 1; fi

    # 4) prose declaration (Output-path / DONE, NON-count, NON-table) → naming
    #    checklist.md on this line or an immediate ±2 neighbour IS its flip signal.
    local s=$((lineno - 2)) e=$((lineno + 2))
    [ "$s" -lt 1 ] && s=1; [ "$e" -gt "$n" ] && e=$n
    for ((i = s; i <= e; i++)); do [[ ${L[$i]} == *checklist.md* ]] && return 0; done
    return 1
}

# inclusion-enforcement (F2): every Family-9 surface must reference checklist.md in
# its enclosing structure (see inclusion_present). Pre-flip this fails on every
# Family-9 surface; it passes only after the atomic-last flip.
mode_enforce_inclusion() {
    local -a files=()
    while IFS= read -r f; do files+=("$f"); done < <(list_scan_files "$PROJ" | sort)
    run_classify quiet "${files[@]}"
    assert_nonempty_scan || return $?
    # N-RISK-1: a swept tree with ZERO Family-9 surfaces cannot be "all flipped" —
    # the real tree always carries Family-9 surfaces, so 0 here is a broken/empty
    # run, never a vacuous inclusion PASS. Keyed on zero (not a hardcoded count).
    if [ "${#EMIT_F9[@]}" -eq 0 ]; then
        log "FAIL: 0 Family-9 surfaces found — nothing to enforce (broken/empty run, not a PASS)"
        return 2
    fi

    local missing=0 hit rel lineno
    for hit in "${EMIT_F9[@]}"; do
        rel="${hit%:*}"; lineno="${hit##*:}"
        if ! inclusion_present "$rel" "$lineno"; then
            missing=$((missing + 1))
            printf 'MISSING-CHECKLIST %s:%s\n' "$rel" "$lineno"
        fi
    done
    if [ "$missing" -gt 0 ]; then
        log "FAIL: $missing of ${#EMIT_F9[@]} Family-9 surface(s) do not yet reference checklist.md"
        log "(EXPECTED before the atomic-last parent-contract flip; this is task 10's acceptance gate.)"
        return 1
    fi
    printf '%s: inclusion-enforcement PASS — all %d Family-9 surfaces reference checklist.md\n' \
        "$SELF" "${#EMIT_F9[@]}"
    return 0
}

# ---------------------------------------------------------------------------
# Self-test — the four named smoke fixtures. Located by CONTENT (line numbers
# drift), and classified against the expected family. A disagreement fails.
# ---------------------------------------------------------------------------
selftest_one() {
    # selftest_one <label> <file> <grep-ere-to-locate-line> <expected-family>
    local label="$1" file="$2" locate="$3" expect="$4"
    local hit lineno line rel
    rel="${file#"$PROJ"/}"
    if [ ! -f "$file" ]; then
        printf 'SELF-TEST FAIL [%s]: file not found: %s\n' "$label" "$rel"; return 1
    fi
    hit="$(grep -nE "$locate" "$file" 2>/dev/null | head -n1)"
    if [ -z "$hit" ]; then
        printf 'SELF-TEST FAIL [%s]: fixture line not found (/%s/) in %s\n' "$label" "$locate" "$rel"; return 1
    fi
    lineno="${hit%%:*}"; line="${hit#*:}"
    # Classify via the SAME per-file context the sweep uses (tree + neighbour), so
    # a self-test PASS proves the real sweep classifies the fixture identically.
    local got
    got="$(classify_file_line "$file" "$lineno")"
    if [ "$got" != "$expect" ]; then
        printf 'SELF-TEST FAIL [%s]: %s:%s classified %s, expected %s\n  line: %s\n' \
            "$label" "$rel" "$lineno" "$got" "$expect" "$(printf '%s' "$line" | cut -c1-90)"
        return 1
    fi
    printf 'SELF-TEST ok   [%s]: %s:%s → %s\n' "$label" "$rel" "$lineno" "$got"
    return 0
}

mode_selftest() {
    local fails=0
    # Fixture 1 — codex dispatch prompt naming {perspective}.md → verified-leave.
    selftest_one "codex-dispatch" "$PROJ/skills/codex/SKILL.md" \
        'prompt:.*evaluation/iter\{n\}/claude/\{perspective\}\.md' 'VERIFIED-LEAVE' || fails=$((fails+1))
    # Fixture 2 — loop-skill exit-checklist "both systems produced per-perspective
    # files" broad wording → verified-leave.
    selftest_one "exit-checklist-ppfiles" "$PROJ/skills/execution/SKILL.md" \
        'Both systems produced per-perspective files' 'VERIFIED-LEAVE' || fails=$((fails+1))
    # Fixture 3 — skill-writing mirrored-skills `wc -l` → not-applicable.
    selftest_one "mirrored-skills-wcl" "$PROJ/skills/skill-writing/SKILL.md" \
        'ls \.claude/skills \| wc -l' 'NOT-APPLICABLE' || fails=$((fails+1))
    # Fixture 4 — wrap-up promoted-file bloat `wc -l` → not-applicable.
    selftest_one "promoted-file-wcl" "$PROJ/skills/wrap-up/evaluation.md" \
        '`wc -l` on each promoted file' 'NOT-APPLICABLE' || fails=$((fails+1))
    # Fixture 5 — codex eval-dir count `.../codex/ | wc -l  # must be 9` → Family-9.
    selftest_one "codex-dir-count" "$PROJ/skills/codex/SKILL.md" \
        'codex/ \| wc -l' 'FAMILY-9' || fails=$((fails+1))
    # Fixture 6 — RECORD's finding-file "Expected path count = Σ … × 8" → Family-8
    #   (checklist.md is a coverage artifact, not a finding file → stays 8).
    selftest_one "record-finding-count" "$PROJ/skills/orchestration/workflow/record.md" \
        'Expected path count' 'FAMILY-8' || fails=$((fails+1))
    # Fixture 7 — bare exact-N count inside an eval-output section → Family-9 via the
    #   count-in-eval-section recovery (the section header names 7 perspectives +
    #   overall.md). Regression-locks the Codex-integrated ±6 recovery. FLIP-ROBUST
    #   (F-STRUCT-1): the locator drops the pre-flip "Exactly 8" count so task 10's
    #   8→9 rewrite of this line does not break the fixture; the surface still
    #   classifies Family-9 post-flip (count + ±6 overall.md+perspective section).
    selftest_one "count-in-eval-section" "$PROJ/skills/orchestration/workflow/evaluation.md" \
        'files written at the expected paths' 'FAMILY-9' || fails=$((fails+1))
    # Fixture 8 — evaluator DONE-status output-completion contract → Family-9 via the
    #   precise `**DONE**` + per-perspective-files rule (regression-locks the
    #   Codex-flagged :139 case WITHOUT the topology false-positives). FLIP-ROBUST
    #   (F-STRUCT-1): the locator anchors on `**DONE**` + "per-perspective files" so
    #   task 10 inserting "+ the filled checklist.md" between "files" and "written"
    #   does not break it; the surface still classifies Family-9 post-flip.
    selftest_one "done-status-contract" "$PROJ/skills/delegation/templates/evaluator.md" \
        '\*\*DONE\*\*.*per-perspective files' 'FAMILY-9' || fails=$((fails+1))
    # Fixture 9 — codex finding-HIT vocab-glob count
    #   `codex/{project,…,overall}.md | wc -l  # >= 1 hit per file` → Family-8 (a finding
    #   count that STAYS 8; its task-10 flip EXCLUDES checklist.md from the glob by naming
    #   the 8 finding-bearing files explicitly). Regression-locks the :387 reclassification
    #   so it never re-enters the checklist.md-inclusion enforce set. Locator re-derived
    #   from the flipped brace-set line; `has_findingcount` still fires via `hit per file`.
    selftest_one "codex-finding-hit-count" "$PROJ/skills/codex/SKILL.md" \
        'codex/\{project,structure,performance,aesthetics,usage,consistency,risk,overall\}\.md \| wc -l' 'FAMILY-8' || fails=$((fails+1))

    if [ "$fails" -gt 0 ]; then
        log "SELF-TEST FAIL: $fails fixture(s) disagreed"
        return 1
    fi
    printf '%s: SELF-TEST PASS — all 9 fixtures classify as expected\n' "$SELF"
    return 0
}

# ---------------------------------------------------------------------------
# Arg parsing + dispatch.
# ---------------------------------------------------------------------------
MODE=""
BUNDLE_LOOP=""
PRE_FLIP=0
# set_mode <name> — modes are mutually exclusive; a second mode flag is an error.
set_mode() {
    [ -z "$MODE" ] || { log "modes are mutually exclusive ($MODE + $1)"; usage >&2; exit 2; }
    MODE="$1"
}
while [ "$#" -gt 0 ]; do
    case "$1" in
        -h|--help) usage; exit 0 ;;
        --root) ROOT_OVERRIDE="${2:-}"; shift 2 || { log "--root needs a dir"; exit 2; } ;;
        --self-test)        set_mode selftest; shift ;;
        --classify-only)    set_mode classify; shift ;;
        --enforce-inclusion) set_mode enforce; shift ;;
        --bundle)           set_mode bundle; BUNDLE_LOOP="${2:-}"; shift 2 || { log "--bundle needs a loop"; exit 2; } ;;
        --pre-flip)         PRE_FLIP=1; shift ;;
        *) log "unknown arg: $1"; usage >&2; exit 2 ;;
    esac
done

if [ -z "$MODE" ]; then
    log "no mode given"; usage >&2; exit 2
fi
# Strict run-mode separation: --pre-flip is the classify-completeness marker for a
# bundle, and only valid there; --bundle without it is a contract slip.
if [ "$MODE" = "bundle" ] && [ "$PRE_FLIP" != "1" ]; then
    log "--bundle requires --pre-flip (it is a classify-completeness / pre-flip mode)"; exit 2
fi
if [ "$MODE" != "bundle" ] && [ "$PRE_FLIP" = "1" ]; then
    log "--pre-flip is only valid with --bundle"; exit 2
fi

# Abort main (not just the subshell) when resolution fails — closes F-RISK-1.
PROJ="$(resolve_proj)" || exit 2
if [ -z "$PROJ" ]; then log "internal: empty project dir after resolution"; exit 2; fi

case "$MODE" in
    selftest) mode_selftest ;;
    classify) mode_classify_only ;;
    bundle)   mode_bundle "$BUNDLE_LOOP" ;;
    enforce)  mode_enforce_inclusion ;;
    *) log "internal: bad mode $MODE"; exit 2 ;;
esac
exit $?
