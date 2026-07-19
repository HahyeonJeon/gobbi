#!/usr/bin/env bash
# verify-record-map.sh — drift gate for the record-map spec-to-script binding.
#
# Purpose:
#   The runnable --check gate for the session-record tree. Scaffolds throwaway
#   step-dirs with scaffold-session-dir.sh, then diffs ONLY the script-created
#   loop/task subtree against the tree declared in
#   record/record-map.md. Also runs the scaffold script's
#   path-validation negative cases and asserts each exits non-zero and creates
#   nothing. Mirrors the scripts/sync-plugin-package.sh --check precedent.
#
#   Also runs the TEMPLATE cap-parity gate: for each mode (auto, chat), every
#   productive loop's maxIterations DEFAULT in state.{mode}.json must equal the
#   same loop's maxIterations in settings.{mode}.json (the authoritative cap
#   source), so the two mode-template families cannot drift. It checks TEMPLATE
#   defaults only — a live per-session state.json may legitimately carry
#   customize-gate overrides, so the gate never reads session state.
#
#   COD-STRUCTURE-2 narrowing: the diff covers only the <step-dir> subtree the
#   scaffold script materializes. It NEVER diffs the manager-created session-root
#   invariants (transcripts/, session.json, state.json, settings.json,
#   session.json.lock) — the scaffold script does not create those, so diffing
#   them would always fail.
#
# Args:
#   --check   Run the drift gate. Exit 0 on pass, non-zero on drift.
#
# Output (stderr): drift detail on failure; (stdout) a one-line pass summary.
# Exit: 0 = pass (no drift); 1 = drift / negative-case regression / cap-parity
#       drift; 2 = bad args or jq unavailable.

set -euo pipefail

SELF="verify-record-map.sh"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
scaffold="$script_dir/../../orchestration/scripts/scaffold-session-dir.sh"
initializer="$script_dir/init-record-map.sh"
spec_doc="$script_dir/../record-map.md"

log() { printf '%s: %s\n' "$SELF" "$*" >&2; }

usage() {
    cat >&2 <<'EOF'
usage: verify-record-map.sh --check
  Diffs scaffold-session-dir.sh output against record/record-map.md
  for the script-created step-dir subtree only (COD-STRUCTURE-2 narrowing), runs
  the path-validation negative cases, and asserts state.{mode}.json cap-parity
  with settings.{mode}.json. Exit 0 = pass, 1 = drift, 2 = bad args / no jq.
EOF
}

if [ "${1:-}" != "--check" ]; then
    usage
    exit 2
fi
if [ "$#" -ne 1 ]; then
    usage
    log "unexpected extra args"
    exit 2
fi

[ -x "$scaffold" ] || { log "scaffold script not executable: $scaffold"; exit 1; }
[ -x "$initializer" ] || { log "initializer script not executable: $initializer"; exit 1; }
[ -f "$spec_doc" ] || { log "spec doc not found: $spec_doc"; exit 1; }

# --- Expected step-dir subtree (baseline) ------------------------------------
# Baseline derives from record-map.md: the 4-slot interior + the per-loop
# staging vocabulary. We assert the doc still declares each staging subdir so a
# silent edit to the doc that drops a subdir is caught here, then diff the
# scaffold output against the baseline the doc describes.

# Base staging vocabulary the doc's "Per-loop staging-subdir vocabulary" section
# declares as shared by every loop.
base_staging=(
    scenarios checklists decisions references design discussions
    backlogs/feature backlogs/project reviews reports changelogs learnings notes
)

# Assert the spec doc still mentions each base staging subdir name. A doc edit
# that drops one is drift the gate must report.
doc_missing=()
for sub in "${base_staging[@]}"; do
    # backlogs/feature and backlogs/project appear as "backlogs/{feature,project}"
    # in the ASCII tree; check the leaf token.
    leaf="${sub##*/}"
    grep -qF "$leaf" "$spec_doc" || doc_missing+=("$sub")
done
# Loop-specific subdirs the doc declares.
grep -qF "plans (2-planning only)" "$spec_doc" || doc_missing+=("plans(planning)")
# working/ slot addition the doc must still declare (drift-gated with the scaffold).
grep -qF "proposals/codex" "$spec_doc" || doc_missing+=("proposals/codex")
if [ "${#doc_missing[@]}" -gt 0 ]; then
    log "spec doc no longer declares: ${doc_missing[*]}"
    log "record-map.md drifted from the scaffold manifest"
    exit 1
fi

# expected_subtree <step-dir> <pass:0|1> — emit the sorted relative dir list the
# scaffold script must produce for this step-dir, per record-map.md.
expected_subtree() {
    local step="$1" pass="$2"
    local loop="$step"
    case "$step" in
        3-execution/task-*) loop="3-execution" ;;
    esac
    local dirs=( "$step" "$step/working" "$step/working/research" "$step/working/proposals" "$step/working/proposals/codex" "$step/evaluation" "$step/staging" )
    # backlogs/{feature,project} implies the intermediate backlogs/ parent dir
    # that `find -type d` enumerates; include it in the baseline.
    dirs+=( "$step/staging/backlogs" )
    local sub
    for sub in "${base_staging[@]}"; do
        dirs+=( "$step/staging/$sub" )
    done
    case "$loop" in
        2-planning) dirs+=( "$step/staging/plans" ) ;;
    esac
    [ "$pass" -eq 1 ] && dirs+=( "$step/outputs" )
    printf '%s\n' "${dirs[@]}" | LC_ALL=C sort -u
}

# --- Diff scaffold output vs baseline, per step-dir --------------------------
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

drift=0
check_step() {
    local step="$1" pass="$2"
    local args=( "$tmp" "$step" )
    [ "$pass" -eq 1 ] && args+=( --pass )
    "$scaffold" "${args[@]}" >/dev/null 2>&1 || { log "scaffold failed for valid step-dir: $step"; drift=1; return; }
    # COD-STRUCTURE-2: diff ONLY the script-created <step-dir> subtree.
    local actual
    actual="$( cd "$tmp" && find "$step" -type d | LC_ALL=C sort -u )"
    local expected
    expected="$(expected_subtree "$step" "$pass")"
    if ! diff <(printf '%s\n' "$expected") <(printf '%s\n' "$actual") >&2; then
        log "DRIFT: scaffold output for '$step' (pass=$pass) does not match record-map.md"
        drift=1
    fi
}

check_step 1-ideation 0
check_step 2-planning 1
check_step 3-execution 0
check_step 4-wrap-up 1
check_step 3-execution/task-01-verify-gate 0

# Assert the scaffold never created the manager-owned root transcripts/ dir.
if [ -d "$tmp/transcripts" ]; then
    log "DRIFT: scaffold created session-root transcripts/ (manager-owned)"
    drift=1
fi

# --- Path-validation negative cases ------------------------------------------
# Each must exit non-zero and create nothing under a fresh root.
neg_check() {
    local desc="$1" step="$2"
    local nroot; nroot="$(mktemp -d)"
    local rc=0
    "$scaffold" "$nroot" "$step" >/dev/null 2>&1 || rc=$?
    local created; created="$(find "$nroot" -mindepth 1 | wc -l | tr -d ' ')"
    rm -rf "$nroot"
    if [ "$rc" -eq 0 ]; then
        log "NEGATIVE-CASE REGRESSION: '$desc' (step=$step) exited 0; expected non-zero"
        drift=1
    elif [ "$created" -ne 0 ]; then
        log "NEGATIVE-CASE REGRESSION: '$desc' (step=$step) created $created paths; expected none"
        drift=1
    fi
}

neg_check "path traversal"       "../1-ideation"
neg_check "embedded traversal"   "3-execution/../etc"
neg_check "leading slash"        "/1-ideation"
neg_check "stray double slash"   "3-execution//task-01-x"
neg_check "trailing slash"       "1-ideation/"
neg_check "unknown loop"         "6-cleanup"
neg_check "startup rejected"     "startup"
neg_check "bad task ordinal"     "3-execution/task-1-x"
neg_check "bad task slug case"   "3-execution/task-01-Bad"

# Relative session-root must also be rejected with nothing created.
rel_root_rc=0
( cd "$tmp" && "$scaffold" relative/root 1-ideation >/dev/null 2>&1 ) || rel_root_rc=$?
if [ "$rel_root_rc" -eq 0 ]; then
    log "NEGATIVE-CASE REGRESSION: relative session-root exited 0; expected non-zero"
    drift=1
fi

# --- Template cap-parity gate (state.{mode}.json vs settings.{mode}.json) -----
# For each mode, every productive loop's maxIterations DEFAULT in state.{mode}.json
# must equal the same loop's maxIterations in settings.{mode}.json (the
# authoritative cap source), so the two mode-template families cannot drift.
# TEMPLATE defaults only — a live per-session state.json may carry customize-gate
# overrides, so this never reads session state. Fail-closed: no jq ⇒ exit 2.
templates_dir="$script_dir/../../orchestration/templates"
command -v jq >/dev/null 2>&1 || { log "jq not found — required for the template cap-parity gate"; exit 2; }
session_tmpl="$templates_dir/session.template.json"
if ! jq -e '
    .schemaVersion == 4 and
    (.workflow | keys == ["chat", "configuration", "execution", "ideation", "planning", "wrap-up"]) and
    (.workflow | has("preparation") | not)
' "$session_tmpl" >/dev/null; then
    log "SCHEMA DRIFT: session.template.json must be schema 4 with the five-step workflow key set"
    drift=1
fi
parity_loops="ideation planning execution wrap-up"
for mode in auto chat; do
    state_tmpl="$templates_dir/state.$mode.json"
    settings_tmpl="$templates_dir/settings.$mode.json"
    tmpl_ok=1
    for tmpl in "$state_tmpl" "$settings_tmpl"; do
        if [ ! -f "$tmpl" ]; then
            log "PARITY: missing template: $tmpl"; drift=1; tmpl_ok=0
        elif ! jq -e . "$tmpl" >/dev/null 2>&1; then
            log "PARITY: invalid JSON: $tmpl"; drift=1; tmpl_ok=0
        fi
    done
    [ "$tmpl_ok" -eq 1 ] || continue
    if ! jq -e '
        .schemaVersion == 2 and
        (.workflow | keys == ["execution", "ideation", "planning", "wrap-up"]) and
        (.workflow | has("preparation") | not) and
        (.workflow.planning.skip == false) and
        (.workflow.planning.maxIterations >= 1)
    ' "$settings_tmpl" >/dev/null; then
        log "SCHEMA DRIFT: settings.$mode.json must be schema 2 and keep Planning non-skippable"
        drift=1
    fi
    if ! jq -e '
        .schemaVersion == 2 and
        (.workflow | keys == ["chat", "configuration", "execution", "ideation", "planning", "wrap-up"]) and
        (.workflow | has("preparation") | not) and
        (.workflow.planning.maxIterations >= 1)
    ' "$state_tmpl" >/dev/null; then
        log "SCHEMA DRIFT: state.$mode.json must be schema 2 with the five-step workflow key set"
        drift=1
    fi
    for loop in $parity_loops; do
        state_cap="$(jq -r --arg l "$loop" '.workflow[$l].maxIterations' "$state_tmpl")"
        settings_cap="$(jq -r --arg l "$loop" '.workflow[$l].maxIterations' "$settings_tmpl")"
        if [ "$state_cap" != "$settings_cap" ]; then
            log "PARITY DRIFT ($mode/$loop): state.$mode.json maxIterations=$state_cap != settings.$mode.json maxIterations=$settings_cap"
            drift=1
        fi
    done
done

# --- Initializer compatibility + resume gates -------------------------------
# Legacy session metadata must be rejected before any path or byte is mutated.
legacy_root="$(mktemp -d)"
printf '{"schemaVersion":3,"sentinel":"unchanged"}\n' > "$legacy_root/session.json"
legacy_before="$(sha256sum "$legacy_root/session.json" | cut -d' ' -f1)"
legacy_rc=0
"$initializer" "$legacy_root" auto >/dev/null 2>&1 || legacy_rc=$?
legacy_after="$(sha256sum "$legacy_root/session.json" | cut -d' ' -f1)"
legacy_paths="$(find "$legacy_root" -mindepth 1 | wc -l | tr -d ' ')"
if [ "$legacy_rc" -eq 0 ] || [ "$legacy_before" != "$legacy_after" ] || [ "$legacy_paths" -ne 1 ]; then
    log "SCHEMA REGRESSION: legacy session was not rejected before mutation"
    drift=1
fi
rm -rf "$legacy_root"

# Current schema numbers do not legitimize a retired or hybrid workflow shape.
# Inject the removed key into otherwise-current metadata and prove the initializer
# rejects it before creating any session-tree path or changing any existing byte.
hybrid_root="$(mktemp -d)"
cp "$templates_dir/session.template.json" "$hybrid_root/session.json"
cp "$templates_dir/state.auto.json" "$hybrid_root/state.json"
cp "$templates_dir/settings.auto.json" "$hybrid_root/settings.json"
hybrid_tmp="$(mktemp)"
jq '.workflow.preparation = {"retired": true}' "$hybrid_root/session.json" > "$hybrid_tmp"
mv "$hybrid_tmp" "$hybrid_root/session.json"
hybrid_before="$(find "$hybrid_root" -maxdepth 1 -type f -printf '%f ' -exec sha256sum {} \; | sort)"
hybrid_rc=0
"$initializer" "$hybrid_root" auto >/dev/null 2>&1 || hybrid_rc=$?
hybrid_after="$(find "$hybrid_root" -maxdepth 1 -type f -printf '%f ' -exec sha256sum {} \; | sort)"
hybrid_paths="$(find "$hybrid_root" -mindepth 1 | wc -l | tr -d ' ')"
if [ "$hybrid_rc" -eq 0 ] || [ "$hybrid_before" != "$hybrid_after" ] || [ "$hybrid_paths" -ne 3 ]; then
    log "SCHEMA REGRESSION: current-version retired workflow shape was not rejected before mutation"
    drift=1
fi
rm -rf "$hybrid_root"

# Exact-shape means an extra retired top-level field is rejected too, even when
# the nested workflow keys and all three schema numbers are current.
extra_root="$(mktemp -d)"
cp "$templates_dir/session.template.json" "$extra_root/session.json"
cp "$templates_dir/state.auto.json" "$extra_root/state.json"
cp "$templates_dir/settings.auto.json" "$extra_root/settings.json"
extra_tmp="$(mktemp)"
jq '.preparation = {"retired": true}' "$extra_root/session.json" > "$extra_tmp"
mv "$extra_tmp" "$extra_root/session.json"
extra_before="$(find "$extra_root" -maxdepth 1 -type f -printf '%f ' -exec sha256sum {} \; | sort)"
extra_rc=0
"$initializer" "$extra_root" auto >/dev/null 2>&1 || extra_rc=$?
extra_after="$(find "$extra_root" -maxdepth 1 -type f -printf '%f ' -exec sha256sum {} \; | sort)"
extra_paths="$(find "$extra_root" -mindepth 1 | wc -l | tr -d ' ')"
if [ "$extra_rc" -eq 0 ] || [ "$extra_before" != "$extra_after" ] || [ "$extra_paths" -ne 3 ]; then
    log "SCHEMA REGRESSION: extra current-version root field was not rejected before mutation"
    drift=1
fi
rm -rf "$extra_root"

# A current-schema session remains resumable and create-if-absent metadata is
# preserved across repeated initialization.
resume_root="$(mktemp -d)"
if ! "$initializer" "$resume_root" auto >/dev/null 2>&1; then
    log "RESUME REGRESSION: current-schema initialization failed"
    drift=1
else
    stamped="$(mktemp)"
    jq '.sessionId = "resume-sentinel" |
        .workflow.ideation.iterations = [{
            "iter": 1,
            "verdict": "PASS",
            "finishedAt": "2026-07-19T00:00:00Z",
            "evaluation_dir": "evaluation/iter1/"
        }]' "$resume_root/session.json" > "$stamped"
    mv "$stamped" "$resume_root/session.json"
    if ! "$initializer" "$resume_root" auto >/dev/null 2>&1 ||
       [ "$(jq -r '.sessionId' "$resume_root/session.json")" != "resume-sentinel" ] ||
       [ "$(jq -r '.workflow.ideation.iterations[0].evaluation_dir' "$resume_root/session.json")" != "evaluation/iter1/" ]; then
        log "RESUME REGRESSION: repeated initialization clobbered current metadata"
        drift=1
    fi
fi
rm -rf "$resume_root"

if [ "$drift" -ne 0 ]; then
    log "record-map verification FAILED"
    exit 1
fi

printf 'record map, schema compatibility, scaffold, and template parity checks pass\n'
exit 0
