#!/usr/bin/env bash
# validate-integration-log.sh — structural validator for a production Integration Log.
#
# Purpose:
#   Confirms a dual-system Integration Log (working/reconciliation-iter{n}.md)
#   meets the structural contract from `orchestration/workflow/production.md`
#   § Integration Log BEFORE the manager spawns evaluators:
#     1. Every data row's `decision` value is in the enum
#        {took-codex, kept-own, merged-selective, escalated}.
#     2. Every `merged-selective` row NAMES BOTH SIDES — it is a real selection
#        between the producer's own element and the Codex element, not a disguised
#        third synthesized draft.
#
# Why a COLUMN check, not a body-wide grep (COD-STRUCT-1):
#   The decision must be read from the `decision` COLUMN, never a body-wide
#   substring grep. A correct log contains anti-synthesis prose like
#   "SELECT, never blend"; a body grep for `blend` would false-fail it. This
#   validator extracts the decision column (awk field $4 of the pipe-delimited
#   row) so explanatory prose in other columns is never reached. See
#   `mistakes/verification/whole-file-allowlist-false-passes-same-file-residual.md`
#   and the session decision `literal-grep-gate-false-fails-legitimate-usage`.
#
# Table shape (the Integration Log delta table):
#   | # | delta | decision | why | codex_origin |
#   Under awk -F'|' / bash IFS='|': field $1 is empty (before the leading pipe),
#   so $2=# , $3=delta , $4=decision , $5=why , $6=codex_origin. The `decision`
#   column is field $4 (bash array index 3).
#
# Escaped pipes (the SAME false-fail class, one level deeper):
#   A cell may legitimately contain an ESCAPED pipe `\|` — a LITERAL pipe in
#   markdown, not a column boundary (e.g. a delta cell quoting a shell pipeline
#   `cmd \| grep …`). A naive `IFS='|'` split treats `\|` as a boundary and
#   shifts the columns, so the wrong field is read as `decision` (a false fail
#   on a legitimately-authored log — F-C4-1). The split below first protects
#   `\|` as SOH (\x01), splits, then restores it in each extracted cell.
#
# Table location:
#   A file may hold OTHER pipe tables (e.g. a "Decision counts" summary whose
#   cells look like enum values). The validator only validates rows under the
#   Integration Log HEADER — a row whose trimmed column $3 == "delta" AND
#   column $4 == "decision". Rows of any other table are ignored. The header /
#   separator rows themselves are skipped. A non-table line ends the table region.
#
# "Names both sides" heuristic (documented, defensible):
#   For a `merged-selective` row, the combined `delta` + `why` text MUST mention
#   BOTH the producer's own side AND the Codex side (case-insensitive whole-word):
#     - own side  : kept | keep | mine | my | own | claude | producer
#     - codex side : codex | took | proposer | proposal
#   A merged-selective row that names only one side (e.g. "changed text / chose
#   better wording") fails — it cannot be audited as a genuine two-sided selection.
#   This is a heuristic, not a proof: it catches the un-auditable single-side log
#   the gate exists to reject, while passing real selection rows that credit both
#   the kept-own element and the took-codex element.
#
# Args:
#   Exactly one path to an Integration Log markdown file.
#
# Output:
#   stdout — one "INVALID: <reason>" line per structural failure (with the row #),
#            then a one-line summary. On a clean run, prints "VALID".
# Exit: 0 = structurally valid; 1 = at least one structural failure (or no
#       Integration Log table found); 2 = bad args (missing/over-many args, or a
#       path that does not exist).

set -uo pipefail

SELF="validate-integration-log.sh"
SOH=$'\x01'   # placeholder for an escaped pipe `\|` while splitting columns
ENUM_RE='^(took-codex|kept-own|merged-selective|escalated)$'
OWN_RE='\b(kept|keep|mine|my|own|claude|producer)\b'
CODEX_RE='\b(codex|took|proposer|proposal)\b'

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: validate-integration-log.sh <integration-log.md>
  Validates the Integration Log delta table: every decision value is in
  {took-codex, kept-own, merged-selective, escalated}, and every merged-selective
  row names both sides. Reads the decision COLUMN (field $4), never a body grep.
  Exit 0 = valid, 1 = structural failure / no table, 2 = bad args.
EOF
}

if [ "$#" -ne 1 ]; then
    usage
    exit 2
fi

path="$1"
if [ ! -f "$path" ]; then
    log "no such file: $path"
    exit 2
fi

# Trim leading/trailing whitespace from a string.
trim() {
    local s="$1"
    s="${s#"${s%%[![:space:]]*}"}"
    s="${s%"${s##*[![:space:]]}"}"
    printf '%s' "$s"
}

# Restore escaped-pipe placeholders (\x01) back to the literal `\|` after split.
restore() {
    printf '%s' "${1//$SOH/\\|}"
}

# A markdown table separator row: only pipes / dashes / colons / spaces, with a dash.
is_separator() {
    local s="$1"
    local stripped="${s//[|:-]/}"
    stripped="${stripped//[[:space:]]/}"
    if [ -z "$stripped" ]; then
        case "$s" in *-*) return 0 ;; esac
    fi
    return 1
}

# merged-selective auditability: combined delta+why names BOTH sides.
names_both_sides() {
    local text="$1"
    printf '%s' "$text" | grep -iqE "$OWN_RE" || return 1
    printf '%s' "$text" | grep -iqE "$CODEX_RE" || return 1
    return 0
}

in_table=0       # 1 while inside the Integration Log delta table region
seen_header=0    # 1 once the Integration Log header has been found
data_rows=0
violations=0

while IFS= read -r line || [ -n "$line" ]; do
    # Is this a table row? (first non-space char is a pipe)
    trimmed_line="$(trim "$line")"
    case "$trimmed_line" in
        '|'*) ;;                       # table row candidate
        *) in_table=0; continue ;;     # any non-table line ends the table region
    esac

    # Skip a separator row.
    if is_separator "$trimmed_line"; then
        continue
    fi

    # Split into columns by the pipe delimiter. First protect any escaped pipe
    # `\|` (a LITERAL pipe in a markdown cell, not a column boundary) as SOH, so
    # the split does NOT treat it as a boundary; restore it in each extracted
    # cell. Without this, an escaped pipe shifts the columns and the wrong field
    # is read as `decision` (the F-C4-1 false-fail on a legitimate log).
    protected="${line//\\|/$SOH}"
    IFS='|' read -ra cols <<< "$protected"
    # cols[0] empty (before leading pipe); cols[2]=delta, cols[3]=decision, cols[4]=why
    delta="$(restore "$(trim "${cols[2]:-}")")"
    decision="$(restore "$(trim "${cols[3]:-}")")"
    why="$(restore "$(trim "${cols[4]:-}")")"

    # Integration Log header row → enter the table region.
    if [ "$delta" = "delta" ] && [ "$decision" = "decision" ]; then
        in_table=1
        seen_header=1
        continue
    fi

    # Only validate rows that belong to the Integration Log delta table.
    [ "$in_table" -eq 1 ] || continue

    data_rows=$((data_rows + 1))
    row_id="${cols[1]:+$(trim "${cols[1]}")}"
    [ -n "$row_id" ] || row_id="?"

    # (1) decision ∈ enum
    if ! printf '%s' "$decision" | grep -qE "$ENUM_RE"; then
        printf 'INVALID: row %s — decision "%s" is not in {took-codex, kept-own, merged-selective, escalated}\n' "$row_id" "$decision"
        violations=$((violations + 1))
        continue
    fi

    # (2) merged-selective must name both sides
    if [ "$decision" = "merged-selective" ]; then
        if ! names_both_sides "$delta $why"; then
            printf 'INVALID: row %s — merged-selective does not name both sides (own + codex) in delta/why\n' "$row_id"
            violations=$((violations + 1))
        fi
    fi
done < "$path"

if [ "$seen_header" -eq 0 ]; then
    printf 'INVALID: no Integration Log delta table found (expected a header row with `delta` and `decision` columns)\n'
    printf '%s: invalid.\n' "$SELF"
    exit 1
fi

if [ "$data_rows" -eq 0 ]; then
    printf 'INVALID: Integration Log table has no data rows\n'
    printf '%s: invalid.\n' "$SELF"
    exit 1
fi

if [ "$violations" -gt 0 ]; then
    printf '%s: %d structural failure(s) across %d data row(s).\n' "$SELF" "$violations" "$data_rows"
    exit 1
fi

printf 'VALID (%d data row(s) checked)\n' "$data_rows"
exit 0
