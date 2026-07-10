#!/usr/bin/env bash
# check-workflow-pointer-drift.sh — Genre-A compaction drift guard for the
# orchestration/workflow/*.md docs.
#
# Purpose:
#   The workflow docs are compacted with explicit doc-kind markers
#   (features/workflow/design/workflow/workflow-compaction-two-doc-kind.md). A
#   compacted doc replaces a duplicated block (a peer procedure, the session-tree
#   ASCII, the no-commit git mechanics, the dual-production paragraph, the
#   perspective table) with ONE typed owner pointer. This guard prevents a later
#   edit from silently RE-introducing the duplicated block. It implements checks
#   1-7 of the design's Part 2 "Drift prevention" ONLY; the DEFERRED
#   "Gate-protection" machinery (gate IDs / gate-manifest / snapshots) is NOT built.
#
# Baseline lives in a reviewed data file, not in the script:
#   The doc set, each doc's expected doc-kind, and each doc's role flags come from
#   the co-located pointer-drift-manifest.txt (a doc row is `doc|file|kind|flags`).
#   Per mistakes/verification/hardcoded-baseline-guard-*, an in-script expected list
#   is a hidden third copy of the spec; the external manifest is the reviewed
#   baseline instead. The guard hardcodes NO doc name — every doc-specific role is a
#   manifest flag (compacted / nocommit-owner / no-perspective-table).
#
# Check scope (partial-migration aware, to stay committable mid-migration):
#   #1 doc-kind marker          — EVERY manifest doc (exact-line match).
#   #2 all-5 typed pointers     — each COMPACTED loop doc.
#   #3/#7 no session-tree redraw — each COMPACTED or TREE-FREE doc (loop OR gate;
#                                 #7 == #3 on a compacted record.md).
#   #4 no no-commit restatement — every doc EXCEPT the nocommit-owner (BROAD,
#                                 line-scoped with a pointer-block allowlist).
#   #5 no Dual-system heading   — every loop-orchestration doc (BROAD).
#   #6 no 7-perspective table   — each no-perspective-table doc.
#   A doc that is neither compacted nor tree-free legitimately still carries its
#   ASCII tree / long procedure, so #3/#7 does NOT run on it. #2 (all-5 pointers)
#   runs only on COMPACTED loop docs — a tree-free doc has had its tree removed but
#   is NOT required to carry all five pointers. #4 and #5 are broad because their
#   migrations are already complete tree-wide (verified 0 restatements / 0
#   headings), so a broad check both passes today and catches a future regrowth in
#   any doc.
#
# Correctness / portability disciplines:
#   - fail-CLOSED (exit 2): a missing/unreadable manifest or required doc, a
#     malformed manifest row, a bad kind/flag, a duplicate doc, or an on-disk
#     workflow/*.md not listed in the manifest. Never a silent pass
#     (mistakes/verification/clean-verdict-unreliable-without-edge-case-stress).
#   - NO `\b` ERE anywhere (BSD/macOS grep incompatibility).
#   - context-aware, not body-wide literal grep: the tree check flags only a line
#     INSIDE a code fence with a box-drawing char AND a session-dir segment; the
#     no-commit check allowlists pointer-block / negative mentions
#     (mistakes/verification/literal-grep-gate-false-fails-legitimate-usage).
#   - gitignore-safe: scans the tracked canonical workflow/*.md only, never sessions/
#     (mistakes/verification/gitignore-aware-residual-gate).
#   - all awk programs are SINGLE-quoted so a backtick in a fence regex is literal,
#     never shell command substitution (tooling/shell-backticks-in-double-quoted-pattern).
#
# Usage:
#   check-workflow-pointer-drift.sh                       live run (self-located dir + manifest)
#   check-workflow-pointer-drift.sh --dir D --manifest M  run against an explicit pair
#   check-workflow-pointer-drift.sh --self-test           temp-dir fixture suite (run before trusting)
#   check-workflow-pointer-drift.sh -h | --help
#
# Exit: 0 = no drift; 1 = a violation; 2 = bad args / missing structure / bad manifest.

set -uo pipefail

SELF="check-workflow-pointer-drift.sh"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: check-workflow-pointer-drift.sh [--dir <workflow-dir>] [--manifest <file>]
       check-workflow-pointer-drift.sh --self-test
       check-workflow-pointer-drift.sh -h | --help

  Genre-A compaction drift guard for orchestration/workflow/*.md. With no args it
  self-locates its canonical workflow dir (../workflow) and manifest
  (pointer-drift-manifest.txt beside this script). --dir / --manifest override the
  pair (used by --self-test against temp fixtures, and for adversarial probing).
  --self-test runs the fixture suite and MUST pass before a live run is trusted.

  Exit 0 = no drift; 1 = a violation; 2 = bad args / missing structure / bad manifest.
EOF
}

# ---------------------------------------------------------------------------
# Self-locate the canonical workflow dir and the co-located manifest.
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_WF="$(cd "$SCRIPT_DIR/../workflow" 2>/dev/null && pwd || true)"  # skills/orchestration/workflow
DEFAULT_MANIFEST="$SCRIPT_DIR/pointer-drift-manifest.txt"

# Parsed-manifest state (reset per load_manifest call).
DOC_NAMES=()
DOC_KINDS=()
DOC_FLAGS=()

# The seven evaluation perspective slugs (#6) and the five typed pointer labels (#2).
PERSPECTIVE_SLUGS='project structure performance aesthetics usage consistency risk'
POINTER_LABELS='Procedure Production Evaluation Record Path'

# ===========================================================================
# Manifest helpers.
# ===========================================================================
name_seen() {
    local needle="$1" existing
    for existing in ${DOC_NAMES[@]+"${DOC_NAMES[@]}"}; do
        [ "$existing" = "$needle" ] && return 0
    done
    return 1
}

valid_doc_name() {
    case "$1" in
        ""|*/*|*..*|*" "*) return 1 ;;
        *.md) return 0 ;;
        *) return 1 ;;
    esac
}

# Every comma-separated flag must be a known flag; "-" means none.
valid_flags() {
    local flags="$1" old_ifs flag
    [ "$flags" = "-" ] && return 0
    [ -z "$flags" ] && return 1
    old_ifs=$IFS; IFS=','; set -- $flags; IFS=$old_ifs
    for flag in "$@"; do
        case "$flag" in
            compacted|tree-free|nocommit-owner|no-perspective-table) ;;
            *) return 1 ;;
        esac
    done
    return 0
}

has_flag() {
    case ",$1," in
        *",$2,"*) return 0 ;;
        *) return 1 ;;
    esac
}

# load_manifest <manifest> <workflow-dir> : strict, fail-closed. Fills DOC_* arrays.
load_manifest() {
    local manifest="$1" workflow_dir="$2"
    local raw tag name kind flags extra doc_path count

    DOC_NAMES=(); DOC_KINDS=(); DOC_FLAGS=(); count=0

    if [ -z "$manifest" ] || [ ! -r "$manifest" ]; then
        log "manifest missing or unreadable: $manifest"; return 2
    fi
    if [ -z "$workflow_dir" ] || [ ! -d "$workflow_dir" ]; then
        log "workflow dir missing: $workflow_dir"; return 2
    fi

    while IFS= read -r raw || [ -n "$raw" ]; do
        case "$raw" in
            ""|\#*) continue ;;
        esac

        IFS='|' read -r tag name kind flags extra <<< "$raw"

        if [ "$tag" != "doc" ] || [ -n "${extra:-}" ]; then
            log "malformed manifest row: $raw"; return 2
        fi
        if ! valid_doc_name "$name"; then
            log "bad manifest doc name: $name"; return 2
        fi
        case "$kind" in
            loop-orchestration|gate-orchestration|reference-orchestration) ;;
            *) log "bad manifest doc kind for $name: $kind"; return 2 ;;
        esac
        if ! valid_flags "$flags"; then
            log "bad manifest flags for $name: $flags"; return 2
        fi
        if has_flag "$flags" "compacted" && [ "$kind" != "loop-orchestration" ] \
           && [ "$kind" != "gate-orchestration" ]; then
            log "compacted flag not allowed on reference doc: $name"; return 2
        fi
        if name_seen "$name"; then
            log "duplicate manifest doc: $name"; return 2
        fi

        doc_path="$workflow_dir/$name"
        if [ ! -r "$doc_path" ] || [ ! -f "$doc_path" ]; then
            log "required workflow doc missing or unreadable: $doc_path"; return 2
        fi

        DOC_NAMES+=("$name"); DOC_KINDS+=("$kind"); DOC_FLAGS+=("$flags")
        count=$((count + 1))
    done < "$manifest"

    if [ "$count" -eq 0 ]; then
        log "manifest lists no docs: $manifest"; return 2
    fi

    # Closed set: every on-disk workflow doc must be declared (fail-closed).
    shopt -s nullglob
    for doc_path in "$workflow_dir"/*.md; do
        name="$(basename "$doc_path")"
        if ! name_seen "$name"; then
            shopt -u nullglob
            log "workflow doc not listed in manifest: $name"; return 2
        fi
    done
    shopt -u nullglob
    return 0
}

# ===========================================================================
# Individual checks. Each prints VIOLATION lines to stdout and returns non-zero
# when it found a violation. All awk programs are single-quoted.
# ===========================================================================

# #1 — exact doc-kind marker line (fixed string, no regex escaping).
check_doc_kind_marker() {
    local path="$1" name="$2" kind="$3"
    if grep -Fxq "**Doc kind:** $kind." "$path"; then
        return 0
    fi
    printf 'VIOLATION [#1] %s: missing exact line: **Doc kind:** %s.\n' "$name" "$kind"
    return 1
}

# #2 — one typed owner pointer present.
check_pointer() {
    local path="$1" name="$2" label="$3"
    if grep -Eq "^[[:space:]]*>[[:space:]]*\*\*$label owner:" "$path"; then
        return 0
    fi
    printf 'VIOLATION [#2] %s: missing typed pointer: %s owner\n' "$name" "$label"
    return 1
}

# #2 — all five typed owner pointers present.
check_compacted_pointers() {
    local path="$1" name="$2" label failed=0
    for label in $POINTER_LABELS; do
        check_pointer "$path" "$name" "$label" || failed=1
    done
    return "$failed"
}

# #3 / #7 — no fenced session-tree redraw. Flags a line INSIDE a code fence that
# has a box-drawing char AND a session-dir segment. Broad session-segment set so a
# fence lacking a `sessions/` root line (e.g. evaluation.md's iter-tree) is still
# caught; an inline path outside a fence, or a box-char fence with no session
# segment, passes.
# KNOWN BOUNDED LIMITATION: this catches box-char (├└│) / fenced trees only; a
# plain-indent redraw (2-space indent, no box chars) is NOT detected — literal grep
# is not semantic proof, so a plain-indent tree is an accepted residual gap here.
check_fenced_session_tree() {
    local path="$1" name="$2"
    awk -v name="$name" '
        function is_session_seg(s,   p) {
            p = "sessions/|session\\.json|transcripts/|staging/|outputs/|working/|evaluation/|iter[0-9{]|task-[0-9{]|[1-5]-(ideation|preparation|planning|execution|wrap-up)|[{]perspective[}]|[{]slug[}]|[{]role[}]|[{]free-filename|(claude|codex)/"
            return (s ~ p)
        }
        /^[[:space:]]*```/ { in_fence = !in_fence; next }
        {
            if (in_fence && (index($0, "├") || index($0, "└") || index($0, "│")) && is_session_seg($0)) {
                printf "VIOLATION [#3] %s:%d: fenced session-tree redraw: %s\n", name, NR, $0
                found = 1
            }
        }
        END { exit (found ? 1 : 0) }
    ' "$path"
}

# #4 — no no-commit restatement outside a pointer block. Pointer-block state
# machine: a line is exempt if it is inside a typed owner blockquote block, or names
# "owned by" / "do not restate" / "commit boundary".
check_no_commit_restatement() {
    local path="$1" name="$2"
    awk -v name="$name" '
        function has_no_commit_phrase(line,   ll) {
            ll = tolower(line)
            # First three: the command/output phrasings (lowercased). Last two: the
            # ORIGINAL removed-block heading + first line, matched CASE-SENSITIVELY
            # (the uppercase NOT is the distinctive heading token), so a re-paste of
            # the removed no-commit block by its own wording is caught too — not only
            # by the command phrasings above.
            return (index(ll, "chore(session): record") \
                    || (index(ll, "git add") && index(ll, "sessions/")) \
                    || index(ll, "nothing to commit, working tree clean") \
                    || index(line, "session record is NOT committed") \
                    || index(line, "no per-iteration session-record commit"))
        }
        function starts_pointer(line) {
            return line ~ /^[[:space:]]*>[[:space:]]*\*\*(Procedure|Production|Evaluation|Record|Path) owner:/
        }
        function is_blockquote(line) { return line ~ /^[[:space:]]*>/ }
        {
            if (starts_pointer($0)) in_pointer = 1
            else if (!is_blockquote($0)) in_pointer = 0

            if (has_no_commit_phrase($0)) {
                ll = tolower($0)
                allowed = (in_pointer || index(ll, "owned by") || index(ll, "do not restate") || index(ll, "commit boundary"))
                if (!allowed) {
                    printf "VIOLATION [#4] %s:%d: no-commit restatement outside a pointer: %s\n", name, NR, $0
                    found = 1
                }
            }
        }
        END { exit (found ? 1 : 0) }
    ' "$path"
}

# #5 — no `### Dual-system production` heading line (use the Production-owner pointer).
check_dual_system_heading() {
    local path="$1" name="$2"
    awk -v name="$name" '
        /^###[[:space:]]+Dual-system production/ {
            printf "VIOLATION [#5] %s:%d: Dual-system production heading (use the Production-owner pointer): %s\n", name, NR, $0
            found = 1
        }
        END { exit (found ? 1 : 0) }
    ' "$path"
}

# #6 — no horizontal seven-perspective table. Structural: split a pipe-row into
# cells, trim markdown decoration, count cells that ARE exactly a perspective slug;
# 3+ is a table. Prose "all seven perspectives + Overall" and a vertical one-slug-
# per-row table pass.
check_perspective_table() {
    local path="$1" name="$2"
    awk -v name="$name" -v slug_list="$PERSPECTIVE_SLUGS" '
        BEGIN { n = split(slug_list, a, " "); for (i = 1; i <= n; i++) slugs[a[i]] = 1 }
        function clean_cell(cell) {
            gsub(/^[[:space:]*`_]+/, "", cell)
            gsub(/[[:space:]*`_]+$/, "", cell)
            return tolower(cell)
        }
        /\|/ {
            count = 0
            m = split($0, cells, "|")
            for (j = 1; j <= m; j++) if (clean_cell(cells[j]) in slugs) count++
            if (count >= 3) {
                printf "VIOLATION [#6] %s:%d: seven-perspective table row (point at the list instead): %s\n", name, NR, $0
                found = 1
            }
        }
        END { exit (found ? 1 : 0) }
    ' "$path"
}

# ===========================================================================
# run_check <manifest> <workflow-dir> : the full gate. 0 clean / 1 violation /
# 2 bad structure.
# ===========================================================================
run_check() {
    local manifest="$1" workflow_dir="$2"
    local i name kind flags path violations=0

    load_manifest "$manifest" "$workflow_dir" || return 2

    printf '%s: checking %s (%d manifest doc(s))\n' "$SELF" "$workflow_dir" "${#DOC_NAMES[@]}" >&2

    for i in "${!DOC_NAMES[@]}"; do
        name="${DOC_NAMES[$i]}"
        kind="${DOC_KINDS[$i]}"
        flags="${DOC_FLAGS[$i]}"
        path="$workflow_dir/$name"

        # #1 — marker, every doc.
        check_doc_kind_marker "$path" "$name" "$kind" || violations=1

        # #2 — pointers, compacted LOOP docs only (gate docs have no 5 pointers).
        if has_flag "$flags" "compacted" && [ "$kind" = "loop-orchestration" ]; then
            check_compacted_pointers "$path" "$name" || violations=1
        fi

        # #3/#7 — tree redraw, any compacted OR tree-free doc (loop or gate). A
        # tree-free doc has had its tree removed, so a re-added tree must FAIL too.
        if has_flag "$flags" "compacted" || has_flag "$flags" "tree-free"; then
            check_fenced_session_tree "$path" "$name" || violations=1
        fi

        # #4 — no-commit restatement, BROAD: every doc except the owner.
        if ! has_flag "$flags" "nocommit-owner"; then
            check_no_commit_restatement "$path" "$name" || violations=1
        fi

        # #5 — Dual-system heading, BROAD: every loop-orchestration doc.
        if [ "$kind" = "loop-orchestration" ]; then
            check_dual_system_heading "$path" "$name" || violations=1
        fi

        # #6 — perspective table, the tagged doc(s).
        if has_flag "$flags" "no-perspective-table"; then
            check_perspective_table "$path" "$name" || violations=1
        fi
    done

    if [ "$violations" -ne 0 ]; then
        printf '%s: POINTER DRIFT DETECTED — see VIOLATION lines above\n' "$SELF" >&2
        return 1
    fi
    printf '%s: NO POINTER DRIFT — all compaction invariants hold\n' "$SELF"
    return 0
}

# ===========================================================================
# --self-test : temp-dir fixture suite (recursive subprocess invocation, so each
# fixture is isolated and the real CLI dispatch is exercised). Fail-closed proofs,
# false-POSITIVE proofs (must PASS), CATCH proofs (must FAIL). MUST pass before a
# live run is trusted.
# ===========================================================================
self_test() {
    local tmp; tmp="$(mktemp -d)"
    # shellcheck disable=SC2064
    trap "rm -rf '$tmp'" RETURN
    local self_path="$SCRIPT_DIR/$SELF"
    local fails=0 total=0

    assert_exit() {
        local expected="$1" label="$2" dir="$3" man="$4" got
        total=$((total + 1))
        "$self_path" --dir "$dir" --manifest "$man" >/dev/null 2>&1
        got=$?
        if [ "$got" -eq "$expected" ]; then
            printf '  PASS  %-54s (exit %d)\n' "$label" "$got"
        else
            printf '  FAIL  %-54s (want %d, got %d)\n' "$label" "$expected" "$got"
            fails=$((fails + 1))
        fi
    }

    # ---- fixture writers --------------------------------------------------
    # A clean, fully-compacted ideation-style loop doc bundling every false-positive
    # case: negative "do not restate" no-commit mention, off-limits `working/proposals/`
    # prose mention, inline path outside a fence, nested markdown link, anchored
    # pointer blocks, and a harmless non-session box-char code fence.
    write_clean_ideation() {
        cat > "$1" <<'DOC'
# Workflow — Ideation (Orchestration)

**Doc kind:** loop-orchestration.
**Purpose:** the manager drives Ideation. Loop dir `1-ideation/` (inline path
outside a fence — legitimate). Peer procedure [`ideation/SKILL.md`](../../ideation/SKILL.md)
(nested markdown link — legitimate).

> **Procedure owner:** [`ideation/SKILL.md`](../../ideation/SKILL.md). Keeps only spawn.
> **Production owner:** [`workflow/production.md`](production.md). Do not restate.
> **Evaluation owner:** [`workflow/evaluation.md`](evaluation.md) for spawn.
> **Record owner:** [`workflow/record.md`](record.md) for the session-record commit boundary.
> **Path owner:** [`record/record-map.md`](../../record/record-map.md). Do not redraw the tree.

The no-commit git mechanics are owned by record.md and must not be restated here;
do not restate the `chore(session): record` commit (negative mention — allowlisted).

The Codex proposal at `working/proposals/` is off-limits to the evaluator (off-limits
prose mention outside a fence — legitimate).

A harmless non-session diagram inside a fence (box chars, no session segment — passes):

```
root
├── foo
└── bar
```

## ITER / EXIT

Normal orchestration prose.
DOC
    }

    # A non-compacted loop stub: doc-kind marker + Record-owner pointer, no 5 pointers,
    # no tree (legitimately pre-migration).
    write_loop_stub() {
        cat > "$1" <<DOC
# Workflow — $2

**Doc kind:** loop-orchestration.

> **Record owner:** [\`workflow/record.md\`](record.md) for the session-record commit boundary.

Inline \`1-ideation/working/draft-iter1.md\` mention outside a fence is allowed.
DOC
    }

    write_gate_stub() {
        cat > "$1" <<DOC
# Workflow — $2

**Doc kind:** gate-orchestration.

Gate orchestration prose.
DOC
    }

    write_reference_stub() {
        cat > "$1" <<DOC
# Workflow — $2

**Doc kind:** reference-orchestration.

Reference orchestration prose.
DOC
    }

    # record.md as the nocommit-owner + a legitimate session tree (non-compacted).
    write_record_owner() {
        cat > "$1" <<'DOC'
# Workflow — Record

**Doc kind:** gate-orchestration.

The manager does not run a `chore(session): record ...` commit; `git add` of a
`sessions/` path is refused and prints `nothing to commit, working tree clean`.

```
sessions/{date}-{session-id}/
├── transcripts/
└── session.json
```
DOC
    }

    # evaluation.md as no-perspective-table + a compliant VERTICAL table (passes).
    write_eval_vertical() {
        cat > "$1" <<'DOC'
# Workflow — Evaluation

**Doc kind:** gate-orchestration.

Covers all seven perspectives + Overall.

| Perspective | Focus |
|---|---|
| Project | value? |
| Structure | shape? |
| Performance | speed? |
DOC
    }

    # Build the full 9-doc clean fixture tree under $1/wf + manifest at $1/manifest.txt.
    build_clean_tree() {
        local root="$1"
        mkdir -p "$root/wf"
        write_clean_ideation "$root/wf/ideation.md"
        write_loop_stub "$root/wf/preparation.md" "Preparation"
        write_loop_stub "$root/wf/planning.md" "Planning"
        write_loop_stub "$root/wf/execution.md" "Execution"
        write_loop_stub "$root/wf/wrap-up.md" "Wrap-up"
        write_eval_vertical "$root/wf/evaluation.md"
        write_gate_stub "$root/wf/production.md" "Production"
        write_record_owner "$root/wf/record.md"
        write_reference_stub "$root/wf/metadata.md" "Metadata"
        cat > "$root/manifest.txt" <<'DOC'
doc|ideation.md|loop-orchestration|compacted
doc|preparation.md|loop-orchestration|-
doc|planning.md|loop-orchestration|-
doc|execution.md|loop-orchestration|-
doc|wrap-up.md|loop-orchestration|-
doc|evaluation.md|gate-orchestration|no-perspective-table
doc|production.md|gate-orchestration|-
doc|record.md|gate-orchestration|nocommit-owner
doc|metadata.md|reference-orchestration|-
DOC
    }

    # === A: clean full partial-compaction tree (exit 0) ====================
    build_clean_tree "$tmp/A"
    assert_exit 0 "clean 9-doc partial-compaction (all FP cases pass)" "$tmp/A/wf" "$tmp/A/manifest.txt"

    # === B: fail-closed — a manifest doc absent on disk (exit 2) ============
    build_clean_tree "$tmp/B"
    rm -f "$tmp/B/wf/production.md"
    assert_exit 2 "fail-closed: manifest doc absent on disk" "$tmp/B/wf" "$tmp/B/manifest.txt"

    # === C: fail-closed — missing manifest file (exit 2) ===================
    build_clean_tree "$tmp/C"
    assert_exit 2 "fail-closed: manifest file missing" "$tmp/C/wf" "$tmp/C/nope.txt"

    # === D: fail-closed — malformed manifest row (exit 2) ==================
    build_clean_tree "$tmp/D"
    printf 'doc|stray.md|bogus-kind|-\n' >> "$tmp/D/manifest.txt"
    # stray.md is not on disk AND kind is bogus -> strict validation fails closed.
    assert_exit 2 "fail-closed: malformed manifest row (bad kind)" "$tmp/D/wf" "$tmp/D/manifest.txt"

    # === E: fail-closed — on-disk doc not in manifest (exit 2) =============
    build_clean_tree "$tmp/E"
    printf '# stray\n' > "$tmp/E/wf/stray.md"
    assert_exit 2 "fail-closed: unmanifested on-disk workflow doc" "$tmp/E/wf" "$tmp/E/manifest.txt"

    # === F: CATCH — planted session-tree fence in the compacted doc (=#3) ==
    build_clean_tree "$tmp/F"
    {
        printf '\n%s\n' '```'
        printf 'sessions/{date}-{session-id}/\n'
        printf '%s\n' '├── 1-ideation/'
        printf '%s\n' '└── transcripts/'
        printf '%s\n' '```'
    } >> "$tmp/F/wf/ideation.md"
    assert_exit 1 "CATCH: planted session-tree fence in compacted doc" "$tmp/F/wf" "$tmp/F/manifest.txt"

    # === G: CATCH — BROAD #4 no-commit restatement in a NON-compacted loop doc =
    build_clean_tree "$tmp/G"
    printf '\nThe manager runs a `chore(session): record ...` commit after RECORD.\n' >> "$tmp/G/wf/planning.md"
    assert_exit 1 "CATCH: broad #4 no-commit in a NON-compacted loop doc" "$tmp/G/wf" "$tmp/G/manifest.txt"

    # === H: CATCH — BROAD #5 Dual-system heading in a NON-compacted loop doc =
    build_clean_tree "$tmp/H"
    printf '\n### Dual-system production\n\nBody.\n' >> "$tmp/H/wf/execution.md"
    assert_exit 1 "CATCH: broad #5 Dual-system heading (non-compacted loop)" "$tmp/H/wf" "$tmp/H/manifest.txt"

    # === I: CATCH — compacted record.md still draws the tree (=#7) ==========
    build_clean_tree "$tmp/I"
    # Mark record.md compacted (gate doc allowed): its tree must now trip #3/#7.
    sed 's/^doc|record.md|gate-orchestration|nocommit-owner$/doc|record.md|gate-orchestration|nocommit-owner,compacted/' \
        "$tmp/I/manifest.txt" > "$tmp/I/manifest2.txt"
    assert_exit 1 "CATCH: compacted record.md keeps its tree (#7)" "$tmp/I/wf" "$tmp/I/manifest2.txt"

    # === J: CATCH — horizontal seven-perspective table (=#6) ===============
    build_clean_tree "$tmp/J"
    cat >> "$tmp/J/wf/evaluation.md" <<'DOC'

| project | structure | performance | aesthetics | usage | consistency | risk |
|---|---|---|---|---|---|---|
| a | b | c | d | e | f | g |
DOC
    assert_exit 1 "CATCH: horizontal seven-perspective table (#6)" "$tmp/J/wf" "$tmp/J/manifest.txt"

    # === K: CATCH — dropped Production owner pointer (COD-CONS-001) =========
    build_clean_tree "$tmp/K"
    grep -v 'Production owner:' "$tmp/K/wf/ideation.md" > "$tmp/K/wf/ideation.tmp"
    mv "$tmp/K/wf/ideation.tmp" "$tmp/K/wf/ideation.md"
    assert_exit 1 "CATCH: dropped Production owner pointer (4-only)" "$tmp/K/wf" "$tmp/K/manifest.txt"

    # === L: CATCH — wrong doc-kind marker (=#1) ============================
    build_clean_tree "$tmp/L"
    # production.md marked gate in manifest but its body says loop -> marker mismatch.
    printf '# Workflow — Production\n\n**Doc kind:** loop-orchestration.\n\nprose\n' > "$tmp/L/wf/production.md"
    assert_exit 1 "CATCH: wrong doc-kind marker" "$tmp/L/wf" "$tmp/L/manifest.txt"

    # === M: CATCH — re-pasted removed-block heading/prose in a NON-compacted loop doc (#4) =
    # The removed no-commit block's OWN heading + first line must trip broad #4 even
    # when re-added by their original wording (case-sensitive), not just the command
    # phrasings. Plant into a NON-compacted loop doc (not the nocommit-owner record.md).
    build_clean_tree "$tmp/M"
    printf '\n### Per-iteration session record is NOT committed\n\nThere is no per-iteration session-record commit. The whole sessions/ tree is gitignored.\n' >> "$tmp/M/wf/wrap-up.md"
    assert_exit 1 "CATCH: re-pasted removed-block heading/prose (#4)" "$tmp/M/wf" "$tmp/M/manifest.txt"

    # === N: FALSE-POSITIVE PROOF — a tree-free doc with NO tree still passes (exit 0) =
    # Marking a loop doc tree-free must NOT false-positive on its own: the clean stub
    # has no fenced session-tree, so #3/#7 finds nothing and #2 stays compacted-only
    # (a tree-free doc is NOT required to carry all five pointers).
    build_clean_tree "$tmp/N"
    sed 's/^doc|preparation.md|loop-orchestration|-$/doc|preparation.md|loop-orchestration|tree-free/' \
        "$tmp/N/manifest.txt" > "$tmp/N/manifest2.txt"
    assert_exit 0 "FP-PASS: tree-free doc with no tree (no 5-pointer demand)" "$tmp/N/wf" "$tmp/N/manifest2.txt"

    # === O: CATCH — a tree-free doc with a RE-ADDED fenced session-tree (=#3 via tree-free) =
    # This is the whole point of the tree-free tier: once a doc's tree is removed, a
    # later edit that re-adds one must FAIL (before this tier it was a non-compacted
    # doc and #3/#7 did not run — a silently re-grown tree).
    build_clean_tree "$tmp/O"
    sed 's/^doc|preparation.md|loop-orchestration|-$/doc|preparation.md|loop-orchestration|tree-free/' \
        "$tmp/O/manifest.txt" > "$tmp/O/manifest2.txt"
    {
        printf '\n%s\n' '```'
        printf 'sessions/{date}-{session-id}/\n'
        printf '%s\n' '├── 2-preparation/'
        printf '%s\n' '└── transcripts/'
        printf '%s\n' '```'
    } >> "$tmp/O/wf/preparation.md"
    assert_exit 1 "CATCH: tree-free doc with a re-added session-tree (#3)" "$tmp/O/wf" "$tmp/O/manifest2.txt"

    printf '\n%s --self-test: %d/%d scenarios passed\n' "$SELF" "$((total - fails))" "$total" >&2
    [ "$fails" -eq 0 ]
}

# ===========================================================================
# Arg parsing + dispatch.
# ===========================================================================
MODE="live"
WF="$DEFAULT_WF"
MANIFEST="$DEFAULT_MANIFEST"

while [ "$#" -gt 0 ]; do
    case "$1" in
        --self-test) MODE="selftest"; shift ;;
        --dir)       [ "$#" -ge 2 ] || { log "--dir needs a value"; usage; exit 2; }; WF="$2"; shift 2 ;;
        --manifest)  [ "$#" -ge 2 ] || { log "--manifest needs a value"; usage; exit 2; }; MANIFEST="$2"; shift 2 ;;
        -h|--help)   usage; exit 0 ;;
        *)           log "unknown argument: $1"; usage; exit 2 ;;
    esac
done

if [ "$MODE" = "selftest" ]; then
    self_test && exit 0 || exit 1
fi

run_check "$MANIFEST" "$WF"
exit "$?"
