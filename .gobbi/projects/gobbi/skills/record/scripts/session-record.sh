#!/usr/bin/env bash

set -euo pipefail

SELF="session-record.sh"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RECORD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SESSION_SCHEMA="$RECORD_DIR/schemas/session.schema.json"
STATE_SCHEMA="$RECORD_DIR/schemas/state.schema.json"
DRAFT_SCHEMA="$RECORD_DIR/schemas/draft.schema.json"
CROSS_REVIEW_SCHEMA="$RECORD_DIR/schemas/cross-review.schema.json"
EVALUATION_REPORT_SCHEMA="$RECORD_DIR/schemas/evaluation-report.schema.json"
SESSION_TEMPLATE="$RECORD_DIR/templates/session.json"
STATE_TEMPLATE="$RECORD_DIR/templates/state.json"
DUAL_WORK_VALIDATOR="$RECORD_DIR/../orchestration/scripts/validate-dual-system-work.sh"
EVALUATION_VALIDATOR="$RECORD_DIR/../evaluation/scripts/validate-evaluation-report.sh"
CLEANUP_FILES=()
CLEANUP_DIRS=()

cleanup() {
    local path
    set +e
    for path in "${CLEANUP_FILES[@]}"; do
        [ -n "$path" ] && rm -f -- "$path"
    done
    for path in "${CLEANUP_DIRS[@]}"; do
        case "$path" in
            /tmp/*|${TMPDIR:-/tmp}/*) rm -rf -- "$path" ;;
        esac
    done
}

trap cleanup EXIT

cleanup_file_later() {
    CLEANUP_FILES+=("$1")
}

cleanup_dir_later() {
    CLEANUP_DIRS+=("$1")
}

log() {
    printf '%s: %s\n' "$SELF" "$*" >&2
}

die() {
    log "$*"
    exit 2
}

usage() {
    cat >&2 <<'EOF'
usage:
  session-record.sh init --root ABS --session-id UUID --project SLUG
      --runtime-system claude-code|codex --runtime-id ID --started-at TIMESTAMP
      --branch BRANCH --worktree ABS [--base-branch BRANCH] [--repo OWNER/REPO]
      [--settings FILE]
  session-record.sh scaffold-tasks --root ABS --tasks FILE
  session-record.sh transition --root ABS --patch FILE
  session-record.sh checkpoint --root ABS --patch FILE
  session-record.sh verify --root ABS [--tasks FILE]
  session-record.sh write-artifact --root ABS
      --kind draft|cross-review|evaluation-report --input FILE --target REL
      --expected-system claude|codex
      --expected-step ideation|planning|execution|wrap-up
      --expected-iteration N --expected-assignment ID
  session-record.sh self-test

Patch semantics for transition and checkpoint are Gobbi object merge:
objects merge recursively; arrays, scalars, and null replace the prior value.
Both commands validate the complete candidate before atomic replacement.

Task data format:
  {"tasks":[{"number":1,"slug":"record-foundation"}]}

write-artifact validates peer JSON against its kind-specific schema, verifies
the expected metadata and canonical target, renders deterministic Markdown, and
atomically replaces the target only after validating the rendered candidate.
EOF
}

require_dependencies() {
    local dependency
    for dependency in cmp git jq jsonschema realpath mktemp find diff sha256sum; do
        command -v "$dependency" >/dev/null 2>&1 || die "required dependency not found: $dependency"
    done
    [ -f "$SESSION_SCHEMA" ] || die "session schema not found: $SESSION_SCHEMA"
    [ -f "$STATE_SCHEMA" ] || die "state schema not found: $STATE_SCHEMA"
    [ -f "$DRAFT_SCHEMA" ] || die "draft schema not found: $DRAFT_SCHEMA"
    [ -f "$CROSS_REVIEW_SCHEMA" ] || die "cross-review schema not found: $CROSS_REVIEW_SCHEMA"
    [ -f "$EVALUATION_REPORT_SCHEMA" ] || die "evaluation-report schema not found: $EVALUATION_REPORT_SCHEMA"
    [ -f "$SESSION_TEMPLATE" ] || die "session template not found: $SESSION_TEMPLATE"
    [ -f "$STATE_TEMPLATE" ] || die "state template not found: $STATE_TEMPLATE"
    [ -x "$DUAL_WORK_VALIDATOR" ] || die "dual-work validator not executable: $DUAL_WORK_VALIDATOR"
    [ -x "$EVALUATION_VALIDATOR" ] || die "evaluation validator not executable: $EVALUATION_VALIDATOR"
}

validate_json() {
    local file="$1"
    jq -e . "$file" >/dev/null 2>&1 || die "invalid JSON: $file"
}

validate_schema() {
    local schema="$1" instance="$2" label="$3"
    if ! jsonschema -i "$instance" "$schema" >/dev/null 2>&1; then
        log "$label does not match its schema: $instance"
        jsonschema -i "$instance" "$schema" >&2 || true
        exit 2
    fi
}

validate_session_schema() {
    validate_schema "$SESSION_SCHEMA" "$1" "session manifest"
}

validate_state_schema() {
    validate_schema "$STATE_SCHEMA" "$1" "workflow state"
}

artifact_schema() {
    case "$1" in
        draft) printf '%s\n' "$DRAFT_SCHEMA" ;;
        cross-review) printf '%s\n' "$CROSS_REVIEW_SCHEMA" ;;
        evaluation-report) printf '%s\n' "$EVALUATION_REPORT_SCHEMA" ;;
        *) die "unknown artifact kind: $1" ;;
    esac
}

opposite_system() {
    case "$1" in
        claude) printf 'codex\n' ;;
        codex) printf 'claude\n' ;;
        *) die "unknown system: $1" ;;
    esac
}

assert_artifact_text() {
    local input="$1"
    jq -e '
        . as $document |
        [paths(scalars)] as $paths |
        all($paths[];
            . as $path | $document | getpath($path) as $value |
            if ($value | type) == "string" then ($value | test("\\S")) else true end)
    ' "$input" >/dev/null || die "artifact contains an empty or whitespace-only string: $input"
}

evaluation_findings() {
    jq -c '.perspectives[].findings[], .overall.findings[]' "$1"
}

finding_verdict_filter='def contributes: (.disposition == "open" or .disposition == "disputed");
def finding_verdict:
  if any(.[]; contributes and .severity == "Critical" and .confidence >= 75) then "FAIL"
  elif any(.[]; contributes and .severity == "High" and .confidence >= 50) then "REVISE"
  else "PASS" end;'

assert_finding_fingerprints() {
    local input="$1" finding declared calculated
    while IFS= read -r finding; do
        [ -n "$finding" ] || continue
        declared="$(jq -r '.fingerprint' <<<"$finding")"
        calculated="$(jq -cS '{symptom, rootCause}' <<<"$finding" | sha256sum | awk '{print $1}')"
        [ "$declared" = "$calculated" ] || die "finding fingerprint does not match its symptom and root cause: $(jq -r '.id' <<<"$finding")"
    done < <(evaluation_findings "$input")
}

assert_evaluation_semantics() {
    local input="$1"
    jq -e '
        . as $report |
        ([.perspectives[].name] == ["Project", "Structure", "Performance", "Aesthetics", "Usage", "Consistency", "Risk"]) and
        (all(.perspectives[];
            . as $perspective |
            all($perspective.findings[]; .perspective == $perspective.name))) and
        (all(.overall.findings[]; .perspective == "Overall")) and
        ([.perspectives[].findings[], .overall.findings[]] as $findings |
            ([ $findings[].id ] | length) == ([ $findings[].id ] | unique | length) and
            ([ $findings[].fingerprint ] | length) == ([ $findings[].fingerprint ] | unique | length) and
            all($findings[];
                (.type != "general" or .domain != "general") and
                (.provenance | length == 1) and
                (.provenance[0].system == $report.system) and
                (.provenance[0].runtimeIdentity == $report.runtimeIdentity) and
                (.provenance[0].findingId == .id))) and
        ([.checklist[].id] | length) == ([.checklist[].id] | unique | length) and
        ([.checklist[].perspective] | unique | sort) ==
          (["Project", "Structure", "Performance", "Aesthetics", "Usage", "Consistency", "Risk", "Overall"] | sort) and
        ([.perspectives[].findings[].id, .overall.findings[].id] as $ids |
            all(.checklist[];
                if .status == "FAIL" then
                    (.findingIds | length >= 1) and all(.findingIds[]; . as $id | $ids | index($id) != null)
                else (.findingIds | length == 0)
                end))
    ' "$input" >/dev/null || die "evaluation report violates perspective, finding, provenance, or checklist invariants"

    jq -e "$finding_verdict_filter
        all(.perspectives[]; .verdict == (.findings | finding_verdict)) and
        (.overall.verdict == (.overall.findings | finding_verdict)) and
        ([.perspectives[].verdict, .overall.verdict] |
            if any(.[]; . == \"FAIL\") then \"FAIL\"
            elif any(.[]; . == \"REVISE\") then \"REVISE\"
            else \"PASS\" end) == .verdict
    " "$input" >/dev/null || die "evaluation verdict contradicts its authoritative findings"
    assert_finding_fingerprints "$input"
}

assert_artifact_semantics() {
    local kind="$1" input="$2"
    assert_artifact_text "$input"
    case "$kind" in
        draft) ;;
        cross-review)
            jq -e '([.findings[].id] | length) == ([.findings[].id] | unique | length)' "$input" >/dev/null ||
                die "cross-review finding IDs must be unique"
            ;;
        evaluation-report) assert_evaluation_semantics "$input" ;;
    esac
}

artifact_prefix_from_target() {
    local target="$1" step="$2"
    case "$step" in
        ideation) printf '1-ideation\n' ;;
        planning) printf '2-planning\n' ;;
        wrap-up) printf '4-wrap-up\n' ;;
        execution)
            if [[ "$target" =~ ^(3-execution/task-[0-9]{2}-[a-z0-9]+(-[a-z0-9]+)*)/ ]]; then
                printf '%s\n' "${BASH_REMATCH[1]}"
            else
                die "Execution artifacts require a canonical task target"
            fi
            ;;
        *) die "unknown workflow step: $step" ;;
    esac
}

assert_artifact_target() {
    local root="$1" kind="$2" target="$3" system="$4" step="$5" iteration="$6"
    case "$target" in
        /*|*//*|../*|*/../*|*/..|./*|*/./*) die "artifact target must be a canonical root-relative path: $target" ;;
    esac
    [[ "$target" =~ ^[a-zA-Z0-9._/-]+$ ]] || die "artifact target contains unsupported characters: $target"
    local prefix expected other normalized
    prefix="$(artifact_prefix_from_target "$target" "$step")"
    other="$(opposite_system "$system")"
    case "$kind" in
        draft) expected="$prefix/working/iteration-$iteration/drafts/$system.md" ;;
        cross-review) expected="$prefix/working/iteration-$iteration/cross-reviews/$system-on-$other.md" ;;
        evaluation-report) expected="$prefix/evaluation/iteration-$iteration/$system.md" ;;
    esac
    [ "$target" = "$expected" ] || die "artifact target does not match kind and metadata: expected $expected, got $target"
    normalized="$(realpath -m -- "$root/$target")"
    [ "$normalized" = "$root/$target" ] || die "artifact target resolves through a symbolic link: $target"
    case "$normalized" in "$root"/*) ;; *) die "artifact target escapes the session root: $target" ;; esac
    [ -d "$(dirname "$normalized")" ] || die "artifact target directory is not scaffolded: $(dirname "$target")"
    [ ! -L "$normalized" ] || die "artifact target is a symbolic link: $target"
}

append_machine_json() {
    local input="$1" target="$2"
    {
        printf '\n<!-- gobbi-machine-json:v1:begin -->\n```json\n'
        jq -S . "$input"
        printf '```\n<!-- gobbi-machine-json:v1:end -->\n'
    } >> "$target"
}

render_draft() {
    local input="$1" target="$2"
    jq -r '
        [
          "---",
          "artifact-kind: draft",
          "schema-version: \(.schemaVersion)",
          "system: \(.system)",
          "step: \(.step)",
          "iteration: \(.iteration)",
          "assignment: \(.assignment)",
          "runtime-identity: \(.runtimeIdentity)",
          "contract-sha256: \(.contractSha256)",
          "---",
          "",
          "# \(.title)",
          "",
          "## Summary",
          "",
          .summary,
          "",
          "## Draft",
          "",
          .content
        ] | .[]
    ' "$input" > "$target"
    append_machine_json "$input" "$target"
}

render_cross_review() {
    local input="$1" target="$2"
    jq -r '
        def finding_lines:
          if length == 0 then ["_No findings._"]
          else map([
            "### `\(.id)` — \(.severity)",
            "",
            .summary,
            "",
            "- Evidence: \(.evidence)",
            "- Recommendation: \(.recommendation)",
            ""
          ]) | add end;
        ([
          "---",
          "artifact-kind: cross-review",
          "schema-version: \(.schemaVersion)",
          "system: \(.system)",
          "step: \(.step)",
          "iteration: \(.iteration)",
          "assignment: \(.assignment)",
          "runtime-identity: \(.runtimeIdentity)",
          "contract-sha256: \(.contractSha256)",
          "subject-system: \(.subjectSystem)",
          "subject-sha256: \(.subjectSha256)",
          "conclusion: \(.conclusion)",
          "---",
          "",
          "# \(.system | ascii_upcase) review of \(.subjectSystem)",
          "",
          "## Summary",
          "",
          .summary,
          "",
          "## Findings",
          ""
        ] + (.findings | finding_lines)) | .[]
    ' "$input" > "$target"
    append_machine_json "$input" "$target"
}

render_evaluation_report() {
    local input="$1" target="$2"
    jq -r '
        def finding_lines:
          if length == 0 then ["_No findings._", ""]
          else map([
            "### Finding `\(.id)`",
            "",
            "- Fingerprint: `\(.fingerprint)`",
            "- Perspective: \(.perspective)",
            "- Type: `\(.type)`",
            "- Domain: `\(.domain)`",
            "- Disposition: `\(.disposition)`",
            "- Confidence: \(.confidence)",
            "- Severity: \(.severity)",
            "- Symptom: \(.symptom)",
            "- Root cause: \(.rootCause)",
            "- Evidence: \(.evidence)",
            "- False-positive check: \(.falsePositiveCheck)",
            "- Recommendation: \(.recommendation)",
            "- Provenance: \(.provenance | map(.system + "/" + .runtimeIdentity + "/" + .findingId) | join(", "))",
            ""
          ]) | add end;
        def perspective_lines:
          ["## \(.name)", "", "VERDICT: \(.verdict)", "", .summary, "", "### Findings", ""] +
          (.findings | finding_lines);
        ([
          "---",
          "artifact-kind: evaluation-report",
          "schema-version: \(.schemaVersion)",
          "system: \(.system)",
          "step: \(.step)",
          "iteration: \(.iteration)",
          "assignment: \(.assignment)",
          "runtime-identity: \(.runtimeIdentity)",
          "subject-sha256: \(.subjectSha256)",
          "verdict: \(.verdict)",
          "---",
          "",
          "# \(.system | ascii_upcase) Evaluation Report",
          ""
        ] +
        ([.perspectives[] | perspective_lines] | add) +
        ["## Overall", "", "VERDICT: \(.overall.verdict)", "", .overall.summary, "", "### Findings", ""] +
        (.overall.findings | finding_lines) +
        ["### Preserve", ""] +
        [.overall.preserve[] | "- " + .] +
        ["", "## Evaluation Checklist", ""] +
        [.checklist[] |
          "- [x] `\(.id)` [\(.perspective)] \(.status): \(.description) — \(.evidence)" +
          (if (.findingIds | length) > 0 then " — findings: " + (.findingIds | join(", ")) else "" end)
        ]) | .[]
    ' "$input" > "$target"
    append_machine_json "$input" "$target"
}

render_artifact() {
    local kind="$1" input="$2" target="$3"
    case "$kind" in
        draft) render_draft "$input" "$target" ;;
        cross-review) render_cross_review "$input" "$target" ;;
        evaluation-report) render_evaluation_report "$input" "$target" ;;
    esac
}

header_value() {
    local file="$1" key="$2"
    awk -v key="$key" '
        NR == 1 && $0 == "---" {in_header = 1; next}
        in_header && $0 == "---" {exit}
        in_header && index($0, key ": ") == 1 {print substr($0, length(key) + 3)}
    ' "$file"
}

extract_machine_json() {
    local source="$1" target="$2"
    [ "$(grep -Fxc '<!-- gobbi-machine-json:v1:begin -->' "$source")" -eq 1 ] || die "rendered artifact must contain one machine JSON start marker"
    [ "$(grep -Fxc '<!-- gobbi-machine-json:v1:end -->' "$source")" -eq 1 ] || die "rendered artifact must contain one machine JSON end marker"
    awk '
        $0 == "<!-- gobbi-machine-json:v1:begin -->" {inside = 1; next}
        $0 == "<!-- gobbi-machine-json:v1:end -->" {inside = 0; done = 1; next}
        inside && $0 == "```json" {next}
        inside && $0 == "```" {next}
        inside {print}
        END {if (!done) exit 1}
    ' "$source" > "$target" || die "could not extract rendered machine JSON"
    validate_json "$target"
}

assert_rendered_candidate() {
    local kind="$1" input="$2" candidate="$3" system="$4" step="$5" iteration="$6" assignment="$7"
    [ -s "$candidate" ] || die "renderer produced an empty artifact"
    [ "$(header_value "$candidate" artifact-kind)" = "$kind" ] || die "rendered artifact kind header mismatch"
    [ "$(header_value "$candidate" system)" = "$system" ] || die "rendered system header mismatch"
    [ "$(header_value "$candidate" step)" = "$step" ] || die "rendered step header mismatch"
    [ "$(header_value "$candidate" iteration)" = "$iteration" ] || die "rendered iteration header mismatch"
    [ "$(header_value "$candidate" assignment)" = "$assignment" ] || die "rendered assignment header mismatch"
    local embedded expected_sorted embedded_sorted
    embedded="$(mktemp)"
    expected_sorted="$(mktemp)"
    embedded_sorted="$(mktemp)"
    cleanup_file_later "$embedded"
    cleanup_file_later "$expected_sorted"
    cleanup_file_later "$embedded_sorted"
    extract_machine_json "$candidate" "$embedded"
    validate_schema "$(artifact_schema "$kind")" "$embedded" "rendered $kind machine JSON"
    jq -S . "$input" > "$expected_sorted"
    jq -S . "$embedded" > "$embedded_sorted"
    diff -u "$expected_sorted" "$embedded_sorted" >/dev/null || die "rendered machine JSON differs from the validated input"
}

is_uuid() {
    [[ "$1" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$ ]]
}

is_timestamp() {
    [[ "$1" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]+)?(Z|[+-][0-9]{2}:[0-9]{2})$ ]]
}

is_project_slug() {
    [[ "$1" =~ ^[a-z0-9][a-z0-9-]{0,62}$ ]]
}

is_task_slug() {
    [[ "$1" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] && [ "${#1}" -le 50 ]
}

normalize_existing_dir() {
    local path="$1" label="$2"
    case "$path" in
        /*) ;;
        *) die "$label must be absolute: $path" ;;
    esac
    [ -d "$path" ] || die "$label is not a directory: $path"
    realpath -e -- "$path"
}

normalize_path() {
    local path="$1" label="$2"
    case "$path" in
        /*) ;;
        *) die "$label must be absolute: $path" ;;
    esac
    realpath -m -- "$path"
}

assert_session_root() {
    local root="$1" manifest="$2"
    local project session_id started_at worktree date logical expected normalized_root normalized_worktree
    project="$(jq -er '.project' "$manifest")"
    session_id="$(jq -er '.sessionId' "$manifest")"
    started_at="$(jq -er '.startedAt' "$manifest")"
    worktree="$(jq -er '.git.worktreePath' "$manifest")"
    is_project_slug "$project" || die "invalid project slug in manifest: $project"
    is_uuid "$session_id" || die "invalid Gobbi session UUID in manifest: $session_id"
    is_timestamp "$started_at" || die "invalid startedAt timestamp in manifest: $started_at"
    normalized_worktree="$(normalize_existing_dir "$worktree" "manifest worktreePath")"
    normalized_root="$(normalize_path "$root" "session root")"
    date="${started_at:0:10}"
    logical="$normalized_worktree/.gobbi/projects/$project/sessions/$date-$session_id"
    expected="$(realpath -m -- "$logical")"
    [ "$expected" = "$logical" ] || die "manifest session path contains a symbolic-link parent: $logical"
    case "$expected" in
        "$normalized_worktree"/*) ;;
        *) die "manifest session root resolves outside its worktree: $expected" ;;
    esac
    [ "$normalized_root" = "$expected" ] || die "session root is not the manifest-owned path: expected $expected, got $normalized_root"
}

assert_no_retired_surfaces() {
    local root="$1" retired
    if find "$root" -type l -print -quit 2>/dev/null | grep -q .; then
        die "symbolic links are forbidden inside the session record: $root"
    fi
    for retired in settings.json session.json.lock transcripts; do
        [ ! -e "$root/$retired" ] || die "retired session surface is forbidden: $root/$retired"
    done
    if find "$root" -type f -path '*/working/discussion-log.md' -print -quit 2>/dev/null | grep -q .; then
        die "retired discussion-log.md is forbidden under $root"
    fi
}

assert_manifest_invariants() {
    local root="$1" manifest="$2"
    validate_session_schema "$manifest"
    assert_session_root "$root" "$manifest"
    jq -e '
        (.runtime.ids | length >= 1 and length == (unique | length)) and
        ((.finishedAt == null and .outcome == null) or
         (.finishedAt != null and .outcome != null)) and
        (if .outcome == null then true
         elif .outcome.status == "complete" then
           (.outcome.handoffPath != null and .outcome.steps["wrap-up"] != null)
         else true end)
    ' "$manifest" >/dev/null || die "session manifest invariant failed: $manifest"
}

assert_state_invariants() {
    local state="$1"
    validate_state_schema "$state"
    jq -e '
        (if .current.step == "configuration" then
           (.current.stage == null and .current.iteration == 1 and .current.task == null)
         elif .status == "active" then
           (.current.stage != null)
         else true end) and
        (if .current.step == "execution" then true else .current.task == null end) and
        (.completedSteps as $completed |
         ["configuration", "ideation", "planning", "execution", "wrap-up"]
         [0:($completed | length)] == $completed) and
        (if .status == "complete" then
           (.current.step == "wrap-up" and .current.stage == null and
            .completedSteps == ["configuration", "ideation", "planning", "execution", "wrap-up"])
         else true end) and
        (all(.activeDispatches[]; (.role != "evaluator" or .kind != "teammate"))) and
        (([.activeDispatches[] | [.system, .runtimeIdentity, .assignment] | @json] | length) ==
         ([.activeDispatches[] | [.system, .runtimeIdentity, .assignment] | @json] | unique | length))
    ' "$state" >/dev/null || die "workflow state invariant failed: $state"
}

assert_state_against_manifest() {
    local root="$1" state="$2" manifest="$3"
    local step iteration cap task task_dir
    step="$(jq -er '.current.step' "$state")"
    iteration="$(jq -er '.current.iteration' "$state")"
    if [ "$step" != "configuration" ]; then
        cap="$(jq -er --arg step "$step" '.settings.workflow[$step].maxIterations' "$manifest")"
        [ "$iteration" -le "$cap" ] || die "state iteration $iteration exceeds the manifest cap $cap for $step"
    fi
    task="$(jq -r '.current.task // empty' "$state")"
    if [ -n "$task" ]; then
        task_dir="$root/3-execution/task-$task"
        [ -d "$task_dir" ] || die "current task has no scaffolded directory: $task"
    fi
    while IFS= read -r task; do
        [ -d "$root/3-execution/task-$task" ] || die "completed task has no scaffolded directory: $task"
    done < <(jq -r '.completedTasks[]' "$state")
}

validate_existing_session() {
    local root="$1"
    [ -f "$root/session.json" ] || die "session manifest not found: $root/session.json"
    [ -f "$root/state.json" ] || die "workflow state not found: $root/state.json"
    assert_no_retired_surfaces "$root"
    assert_manifest_invariants "$root" "$root/session.json"
    assert_state_invariants "$root/state.json"
    assert_state_against_manifest "$root" "$root/state.json" "$root/session.json"
}

create_staging_dirs() {
    local target="$1" include_plans="$2"
    local directories=(
        scenarios checklists decisions references design discussions reviews reports
        changelogs learnings notes backlogs/feature backlogs/project
    )
    [ "$include_plans" -eq 1 ] && directories+=(plans)
    local directory
    for directory in "${directories[@]}"; do
        mkdir -p -- "$target/staging/$directory"
    done
}

create_iteration() {
    local target="$1" iteration="$2"
    mkdir -p -- \
        "$target/working/iteration-$iteration/drafts" \
        "$target/working/iteration-$iteration/cross-reviews" \
        "$target/working/iteration-$iteration/research" \
        "$target/evaluation/iteration-$iteration"
}

create_step_skeleton() {
    local root="$1" directory="$2" cap="$3" include_plans="$4"
    local target="$root/$directory" iteration
    mkdir -p -- "$target/outputs"
    create_staging_dirs "$target" "$include_plans"
    for ((iteration = 1; iteration <= cap; iteration++)); do
        create_iteration "$target" "$iteration"
    done
}

create_execution_root() {
    local root="$1"
    mkdir -p -- "$root/3-execution/outputs"
    create_staging_dirs "$root/3-execution" 0
}

create_full_skeleton() {
    local root="$1" manifest="$2"
    local ideation planning wrap_up
    ideation="$(jq -er '.settings.workflow.ideation.maxIterations' "$manifest")"
    planning="$(jq -er '.settings.workflow.planning.maxIterations' "$manifest")"
    wrap_up="$(jq -er '.settings.workflow["wrap-up"].maxIterations' "$manifest")"
    create_step_skeleton "$root" 1-ideation "$ideation" 0
    create_step_skeleton "$root" 2-planning "$planning" 1
    create_execution_root "$root"
    create_step_skeleton "$root" 4-wrap-up "$wrap_up" 0
}

create_readme_if_absent() {
    local root="$1"
    [ -e "$root/README.md" ] && return 0
    local temporary
    temporary="$(mktemp "$root/.README.md.XXXXXX")"
    cleanup_file_later "$temporary"
    {
        printf '# Session record — %s\n\n' "$(basename "$root")"
        printf 'Gobbi-owned working record for one isolated session. `session.json` is the\n'
        printf 'low-frequency lifecycle manifest. `state.json` is the only workflow router.\n\n'
        printf 'Canonical tree and command contract: `skills/record/record-map.md`.\n'
    } > "$temporary"
    mv -- "$temporary" "$root/README.md"
}

atomic_create_if_absent() {
    local candidate="$1" target="$2"
    [ -e "$target" ] && return 0
    local temporary
    temporary="$(mktemp "$(dirname "$target")/.${target##*/}.XXXXXX")"
    cleanup_file_later "$temporary"
    cp -- "$candidate" "$temporary"
    mv -- "$temporary" "$target"
}

atomic_replace() {
    local candidate="$1" target="$2"
    local temporary
    temporary="$(mktemp "$(dirname "$target")/.${target##*/}.XXXXXX")"
    cleanup_file_later "$temporary"
    cp -- "$candidate" "$temporary"
    mv -- "$temporary" "$target"
}

validate_patch_file() {
    local patch="$1"
    [ -f "$patch" ] || die "patch file not found: $patch"
    validate_json "$patch"
    jq -e 'type == "object"' "$patch" >/dev/null || die "patch root must be an object: $patch"
}

merge_candidate() {
    local source="$1" patch="$2" target="$3"
    jq -s '.[0] * .[1]' "$source" "$patch" > "$target"
    jq -e . "$target" >/dev/null || die "merged candidate is invalid JSON"
}

assert_allowed_patch_keys() {
    local patch="$1" allowed_json="$2" label="$3"
    jq -e --argjson allowed "$allowed_json" '
        (keys - $allowed) == []
    ' "$patch" >/dev/null || die "$label patch contains an unauthorized top-level field"
}

assert_init_field_matches() {
    local existing="$1" candidate="$2" jq_path="$3" field="$4"
    local existing_value candidate_value
    existing_value="$(jq -c "$jq_path" "$existing")" || die "cannot read existing session field: $field"
    candidate_value="$(jq -c "$jq_path" "$candidate")" || die "cannot read candidate session field: $field"
    [ "$existing_value" = "$candidate_value" ] ||
        die "init argument does not match existing session field: $field"
}

command_init() {
    local root="" session_id="" project="" runtime_system="" runtime_id=""
    local started_at="" branch="" worktree="" base_branch="develop" repo="" settings=""
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --root) root="${2:-}"; shift 2 ;;
            --session-id) session_id="${2:-}"; shift 2 ;;
            --project) project="${2:-}"; shift 2 ;;
            --runtime-system) runtime_system="${2:-}"; shift 2 ;;
            --runtime-id) runtime_id="${2:-}"; shift 2 ;;
            --started-at) started_at="${2:-}"; shift 2 ;;
            --branch) branch="${2:-}"; shift 2 ;;
            --worktree) worktree="${2:-}"; shift 2 ;;
            --base-branch) base_branch="${2:-}"; shift 2 ;;
            --repo) repo="${2:-}"; shift 2 ;;
            --settings) settings="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown init argument: $1" ;;
        esac
    done
    [ -n "$root" ] || die "init requires --root"
    [ -n "$session_id" ] || die "init requires --session-id"
    [ -n "$project" ] || die "init requires --project"
    [ -n "$runtime_system" ] || die "init requires --runtime-system"
    [ -n "$runtime_id" ] || die "init requires --runtime-id"
    [ -n "$started_at" ] || die "init requires --started-at"
    [ -n "$branch" ] || die "init requires --branch"
    [ -n "$worktree" ] || die "init requires --worktree"
    is_uuid "$session_id" || die "invalid Gobbi session UUID: $session_id"
    is_project_slug "$project" || die "invalid project slug: $project"
    case "$runtime_system" in claude-code|codex) ;; *) die "invalid runtime system: $runtime_system" ;; esac
    is_timestamp "$started_at" || die "invalid started-at timestamp: $started_at"
    [[ "$runtime_id" != *$'\n'* ]] || die "runtime ID must be one line"
    [[ "$branch" != *[[:space:]]* ]] || die "branch must not contain whitespace"
    [[ "$base_branch" != *[[:space:]]* ]] || die "base branch must not contain whitespace"
    local normalized_worktree normalized_root logical_root expected_root session_candidate state_candidate repo_json
    normalized_worktree="$(normalize_existing_dir "$worktree" "worktree")"
    normalized_root="$(normalize_path "$root" "session root")"
    logical_root="$normalized_worktree/.gobbi/projects/$project/sessions/${started_at:0:10}-$session_id"
    expected_root="$(realpath -m -- "$logical_root")"
    [ "$expected_root" = "$logical_root" ] || die "session path contains a symbolic-link parent: $logical_root"
    case "$expected_root" in
        "$normalized_worktree"/*) ;;
        *) die "session root resolves outside its worktree: $expected_root" ;;
    esac
    [ "$normalized_root" = "$expected_root" ] || die "root must be $expected_root"
    if [ -n "$settings" ]; then
        [ -f "$settings" ] || die "settings file not found: $settings"
        validate_json "$settings"
        jq -e 'type == "object"' "$settings" >/dev/null || die "settings file must contain an object"
    fi
    session_candidate="$(mktemp)"
    state_candidate="$(mktemp)"
    cleanup_file_later "$session_candidate"
    cleanup_file_later "$state_candidate"
    if [ -n "$repo" ]; then repo_json="$(jq -Rn --arg value "$repo" '$value')"; else repo_json="null"; fi
    if [ -n "$settings" ]; then
        jq \
            --arg session_id "$session_id" \
            --arg project "$project" \
            --arg runtime_system "$runtime_system" \
            --arg runtime_id "$runtime_id" \
            --arg started_at "$started_at" \
            --arg branch "$branch" \
            --arg worktree "$normalized_worktree" \
            --arg base_branch "$base_branch" \
            --argjson repo "$repo_json" \
            --slurpfile settings "$settings" '
                .sessionId = $session_id |
                .project = $project |
                .runtime = {system: $runtime_system, ids: [$runtime_id]} |
                .startedAt = $started_at |
                .git.repo = $repo |
                .git.baseBranch = $base_branch |
                .git.branch = $branch |
                .git.worktreePath = $worktree |
                .settings = $settings[0]
            ' "$SESSION_TEMPLATE" > "$session_candidate"
    else
        jq \
            --arg session_id "$session_id" \
            --arg project "$project" \
            --arg runtime_system "$runtime_system" \
            --arg runtime_id "$runtime_id" \
            --arg started_at "$started_at" \
            --arg branch "$branch" \
            --arg worktree "$normalized_worktree" \
            --arg base_branch "$base_branch" \
            --argjson repo "$repo_json" '
                .sessionId = $session_id |
                .project = $project |
                .runtime = {system: $runtime_system, ids: [$runtime_id]} |
                .startedAt = $started_at |
                .git.repo = $repo |
                .git.baseBranch = $base_branch |
                .git.branch = $branch |
                .git.worktreePath = $worktree
            ' "$SESSION_TEMPLATE" > "$session_candidate"
    fi
    cp -- "$STATE_TEMPLATE" "$state_candidate"
    assert_manifest_invariants "$normalized_root" "$session_candidate"
    assert_state_invariants "$state_candidate"
    if [ -e "$normalized_root/settings.json" ] || [ -e "$normalized_root/session.json.lock" ] || [ -e "$normalized_root/transcripts" ]; then
        die "refusing to initialize a root containing retired session surfaces"
    fi
    if [ -e "$normalized_root" ]; then
        [ -d "$normalized_root" ] || die "session root exists but is not a directory: $normalized_root"
        assert_no_retired_surfaces "$normalized_root"
        assert_root_entries "$normalized_root"
    fi
    if [ -e "$normalized_root/session.json" ]; then
        [ -f "$normalized_root/session.json" ] || die "session.json is not a regular file"
        assert_manifest_invariants "$normalized_root" "$normalized_root/session.json"
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.sessionId' sessionId
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.project' project
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.startedAt' startedAt
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.runtime.system' runtime.system
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.runtime.ids[0]' 'runtime.ids[0]'
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.git.repo' git.repo
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.git.baseBranch' git.baseBranch
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.git.branch' git.branch
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.git.worktreePath' git.worktreePath
        assert_init_field_matches "$normalized_root/session.json" "$session_candidate" '.settings' settings
    fi
    if [ -e "$normalized_root/state.json" ]; then
        [ -f "$normalized_root/state.json" ] || die "state.json is not a regular file"
        assert_state_invariants "$normalized_root/state.json"
    fi
    mkdir -p -- "$normalized_root"
    atomic_create_if_absent "$session_candidate" "$normalized_root/session.json"
    atomic_create_if_absent "$state_candidate" "$normalized_root/state.json"
    create_readme_if_absent "$normalized_root"
    create_full_skeleton "$normalized_root" "$normalized_root/session.json"
    validate_existing_session "$normalized_root"
    verify_shape "$normalized_root" ""
    log "initialized session $session_id at $normalized_root"
}

validate_tasks_file() {
    local tasks="$1"
    [ -f "$tasks" ] || die "tasks file not found: $tasks"
    validate_json "$tasks"
    jq -e '
        type == "object" and keys == ["tasks"] and
        (.tasks | type == "array" and length >= 1 and length <= 99) and
        all(.tasks[];
            type == "object" and keys == ["number", "slug"] and
            (.number | type == "number" and floor == . and . >= 1 and . <= 99) and
            (.slug | type == "string" and test("^[a-z0-9]+(-[a-z0-9]+)*$") and length <= 50)) and
        (([.tasks[].number] | length) == ([.tasks[].number] | unique | length)) and
        (([.tasks[].slug] | length) == ([.tasks[].slug] | unique | length))
    ' "$tasks" >/dev/null || die "tasks file has an invalid shape, duplicate, number, or slug: $tasks"
}

task_id_from_row() {
    local number="$1" slug="$2"
    printf '%02d-%s' "$number" "$slug"
}

create_task_skeleton() {
    local root="$1" task_id="$2" cap="$3" target="$root/3-execution/task-$task_id" iteration
    mkdir -p -- "$target/outputs"
    create_staging_dirs "$target" 0
    for ((iteration = 1; iteration <= cap; iteration++)); do
        create_iteration "$target" "$iteration"
    done
}

command_scaffold_tasks() {
    local root="" tasks=""
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --root) root="${2:-}"; shift 2 ;;
            --tasks) tasks="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown scaffold-tasks argument: $1" ;;
        esac
    done
    [ -n "$root" ] || die "scaffold-tasks requires --root"
    [ -n "$tasks" ] || die "scaffold-tasks requires --tasks"
    root="$(normalize_path "$root" "session root")"
    validate_existing_session "$root"
    validate_tasks_file "$tasks"
    local cap number slug task_id
    cap="$(jq -er '.settings.workflow.execution.maxIterations' "$root/session.json")"
    while IFS=$'\t' read -r number slug; do
        task_id="$(task_id_from_row "$number" "$slug")"
        create_task_skeleton "$root" "$task_id" "$cap"
    done < <(jq -r '.tasks[] | [.number, .slug] | @tsv' "$tasks")
    verify_shape "$root" "$tasks"
    log "scaffolded $(jq -r '.tasks | length' "$tasks") execution task(s) at $root"
}

command_transition() {
    local root="" patch=""
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --root) root="${2:-}"; shift 2 ;;
            --patch) patch="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown transition argument: $1" ;;
        esac
    done
    [ -n "$root" ] || die "transition requires --root"
    [ -n "$patch" ] || die "transition requires --patch"
    root="$(normalize_path "$root" "session root")"
    validate_existing_session "$root"
    validate_patch_file "$patch"
    assert_allowed_patch_keys "$patch" '["status","current","completedSteps","completedTasks","lastVerdict","activeDispatches"]' "transition"
    local candidate
    candidate="$(mktemp)"
    cleanup_file_later "$candidate"
    merge_candidate "$root/state.json" "$patch" "$candidate"
    assert_state_invariants "$candidate"
    assert_state_against_manifest "$root" "$candidate" "$root/session.json"
    [ "$(jq -r '.schemaVersion' "$candidate")" = "3" ] || die "transition cannot change schemaVersion"
    atomic_replace "$candidate" "$root/state.json"
    log "transitioned to $(jq -r '.current | [.step, (.stage // "-"), (.iteration|tostring), (.task // "-")] | join("/")' "$root/state.json")"
}

assert_checkpoint_invariants() {
    local old="$1" candidate="$2"
    jq -e --slurpfile old "$old" '
        .schemaVersion == $old[0].schemaVersion and
        .sessionId == $old[0].sessionId and
        .project == $old[0].project and
        .startedAt == $old[0].startedAt and
        .git.baseBranch == $old[0].git.baseBranch and
        .git.branch == $old[0].git.branch and
        .git.worktreePath == $old[0].git.worktreePath and
        (.runtime.ids | length) >= ($old[0].runtime.ids | length) and
        (.runtime.ids[0:($old[0].runtime.ids | length)] == $old[0].runtime.ids) and
        ((.runtime.ids | length) <= (($old[0].runtime.ids | length) + 1)) and
        (if .runtime.system != $old[0].runtime.system then
           (.runtime.ids | length) == (($old[0].runtime.ids | length) + 1)
         else true end) and
        (.settings.workflow.ideation.maxIterations >= $old[0].settings.workflow.ideation.maxIterations) and
        (.settings.workflow.planning.maxIterations >= $old[0].settings.workflow.planning.maxIterations) and
        (.settings.workflow.execution.maxIterations >= $old[0].settings.workflow.execution.maxIterations) and
        (.settings.workflow["wrap-up"].maxIterations >= $old[0].settings.workflow["wrap-up"].maxIterations)
    ' "$candidate" >/dev/null || die "checkpoint violates immutable identity, append-only runtime, or non-decreasing cap rules"
}

scaffold_cap_extensions() {
    local root="$1" old="$2" candidate="$3"
    local step directory include_plans old_cap new_cap iteration task_dir
    for step in ideation planning wrap-up; do
        old_cap="$(jq -er --arg step "$step" '.settings.workflow[$step].maxIterations' "$old")"
        new_cap="$(jq -er --arg step "$step" '.settings.workflow[$step].maxIterations' "$candidate")"
        [ "$new_cap" -gt "$old_cap" ] || continue
        case "$step" in
            ideation) directory="1-ideation"; include_plans=0 ;;
            planning) directory="2-planning"; include_plans=1 ;;
            wrap-up) directory="4-wrap-up"; include_plans=0 ;;
        esac
        create_staging_dirs "$root/$directory" "$include_plans"
        mkdir -p -- "$root/$directory/outputs"
        for ((iteration = old_cap + 1; iteration <= new_cap; iteration++)); do
            create_iteration "$root/$directory" "$iteration"
        done
    done
    old_cap="$(jq -er '.settings.workflow.execution.maxIterations' "$old")"
    new_cap="$(jq -er '.settings.workflow.execution.maxIterations' "$candidate")"
    if [ "$new_cap" -gt "$old_cap" ]; then
        while IFS= read -r task_dir; do
            [ -n "$task_dir" ] || continue
            for ((iteration = old_cap + 1; iteration <= new_cap; iteration++)); do
                create_iteration "$task_dir" "$iteration"
            done
        done < <(find "$root/3-execution" -mindepth 1 -maxdepth 1 -type d -name 'task-[0-9][0-9]-*' -print | LC_ALL=C sort)
    fi
}

command_checkpoint() {
    local root="" patch=""
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --root) root="${2:-}"; shift 2 ;;
            --patch) patch="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown checkpoint argument: $1" ;;
        esac
    done
    [ -n "$root" ] || die "checkpoint requires --root"
    [ -n "$patch" ] || die "checkpoint requires --patch"
    root="$(normalize_path "$root" "session root")"
    validate_existing_session "$root"
    validate_patch_file "$patch"
    assert_allowed_patch_keys "$patch" '["feature","task","runtime","finishedAt","git","settings","outcome"]' "checkpoint"
    local candidate old_copy
    candidate="$(mktemp)"
    old_copy="$(mktemp)"
    cleanup_file_later "$candidate"
    cleanup_file_later "$old_copy"
    cp -- "$root/session.json" "$old_copy"
    merge_candidate "$old_copy" "$patch" "$candidate"
    assert_manifest_invariants "$root" "$candidate"
    assert_checkpoint_invariants "$old_copy" "$candidate"
    atomic_replace "$candidate" "$root/session.json"
    if ! scaffold_cap_extensions "$root" "$old_copy" "$candidate"; then
        atomic_replace "$old_copy" "$root/session.json"
        die "cap-extension scaffold failed; prior manifest bytes restored"
    fi
    validate_existing_session "$root"
    log "checkpointed session manifest at $root/session.json"
}

command_write_artifact() {
    local root="" kind="" input="" target="" expected_system="" expected_step=""
    local expected_iteration="" expected_assignment=""
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --root) root="${2:-}"; shift 2 ;;
            --kind) kind="${2:-}"; shift 2 ;;
            --input) input="${2:-}"; shift 2 ;;
            --target) target="${2:-}"; shift 2 ;;
            --expected-system) expected_system="${2:-}"; shift 2 ;;
            --expected-step) expected_step="${2:-}"; shift 2 ;;
            --expected-iteration) expected_iteration="${2:-}"; shift 2 ;;
            --expected-assignment) expected_assignment="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown write-artifact argument: $1" ;;
        esac
    done
    [ -n "$root" ] || die "write-artifact requires --root"
    [ -n "$kind" ] || die "write-artifact requires --kind"
    [ -n "$input" ] || die "write-artifact requires --input"
    [ -n "$target" ] || die "write-artifact requires --target"
    [ -n "$expected_system" ] || die "write-artifact requires --expected-system"
    [ -n "$expected_step" ] || die "write-artifact requires --expected-step"
    [ -n "$expected_iteration" ] || die "write-artifact requires --expected-iteration"
    [ -n "$expected_assignment" ] || die "write-artifact requires --expected-assignment"
    case "$kind" in draft|cross-review|evaluation-report) ;; *) die "invalid artifact kind: $kind" ;; esac
    case "$expected_system" in claude|codex) ;; *) die "invalid expected system: $expected_system" ;; esac
    case "$expected_step" in ideation|planning|execution|wrap-up) ;; *) die "invalid expected step: $expected_step" ;; esac
    [[ "$expected_iteration" =~ ^[1-9][0-9]?$ ]] || die "expected iteration must be an integer from 1 through 99"
    [[ "$expected_assignment" =~ ^[a-z0-9][a-z0-9-]{0,127}$ ]] || die "invalid expected assignment: $expected_assignment"
    [ -f "$input" ] && [ ! -L "$input" ] || die "artifact input must be a regular non-symlink file: $input"
    [ -s "$input" ] || die "artifact input is empty: $input"

    root="$(normalize_path "$root" "session root")"
    validate_existing_session "$root"
    validate_json "$input"
    local schema other candidate normalized_target
    schema="$(artifact_schema "$kind")"
    validate_schema "$schema" "$input" "$kind input"
    assert_artifact_semantics "$kind" "$input"
    jq -e \
        --arg kind "$kind" \
        --arg system "$expected_system" \
        --arg step "$expected_step" \
        --argjson iteration "$expected_iteration" \
        --arg assignment "$expected_assignment" '
            .kind == $kind and
            .system == $system and
            .step == $step and
            .iteration == $iteration and
            .assignment == $assignment
        ' "$input" >/dev/null || die "artifact metadata does not match the expected contract"
    if [ "$kind" = "cross-review" ]; then
        other="$(opposite_system "$expected_system")"
        [ "$(jq -r '.subjectSystem' "$input")" = "$other" ] || die "cross-review subject system is not opposite its reviewer"
    fi
    assert_artifact_target "$root" "$kind" "$target" "$expected_system" "$expected_step" "$expected_iteration"
    normalized_target="$root/$target"
    candidate="$(mktemp)"
    cleanup_file_later "$candidate"
    render_artifact "$kind" "$input" "$candidate"
    assert_rendered_candidate "$kind" "$input" "$candidate" "$expected_system" "$expected_step" "$expected_iteration" "$expected_assignment"
    atomic_replace "$candidate" "$normalized_target"
    log "wrote $kind artifact $target ($(sha256sum "$normalized_target" | awk '{print $1}'))"
}

expected_staging_dirs() {
    local prefix="$1" include_plans="$2"
    printf '%s\n' \
        "$prefix/staging" \
        "$prefix/staging/scenarios" \
        "$prefix/staging/checklists" \
        "$prefix/staging/decisions" \
        "$prefix/staging/references" \
        "$prefix/staging/design" \
        "$prefix/staging/discussions" \
        "$prefix/staging/reviews" \
        "$prefix/staging/reports" \
        "$prefix/staging/changelogs" \
        "$prefix/staging/learnings" \
        "$prefix/staging/notes" \
        "$prefix/staging/backlogs" \
        "$prefix/staging/backlogs/feature" \
        "$prefix/staging/backlogs/project"
    [ "$include_plans" -eq 1 ] && printf '%s\n' "$prefix/staging/plans"
}

expected_iterated_dirs() {
    local prefix="$1" cap="$2" include_plans="$3" iteration
    printf '%s\n' "$prefix" "$prefix/working" "$prefix/evaluation" "$prefix/outputs"
    expected_staging_dirs "$prefix" "$include_plans"
    for ((iteration = 1; iteration <= cap; iteration++)); do
        printf '%s\n' \
            "$prefix/working/iteration-$iteration" \
            "$prefix/working/iteration-$iteration/drafts" \
            "$prefix/working/iteration-$iteration/cross-reviews" \
            "$prefix/working/iteration-$iteration/research" \
            "$prefix/evaluation/iteration-$iteration"
    done
}

expected_execution_dirs() {
    local root="$1" manifest="$2" tasks="$3" cap task_id number slug task_dir
    printf '%s\n' 3-execution 3-execution/outputs
    expected_staging_dirs 3-execution 0
    cap="$(jq -er '.settings.workflow.execution.maxIterations' "$manifest")"
    if [ -n "$tasks" ]; then
        while IFS=$'\t' read -r number slug; do
            task_id="$(task_id_from_row "$number" "$slug")"
            expected_iterated_dirs "3-execution/task-$task_id" "$cap" 0
        done < <(jq -r '.tasks[] | [.number, .slug] | @tsv' "$tasks")
    else
        while IFS= read -r task_dir; do
            [ -n "$task_dir" ] || continue
            expected_iterated_dirs "3-execution/${task_dir##*/}" "$cap" 0
        done < <(find "$root/3-execution" -mindepth 1 -maxdepth 1 -type d -name 'task-[0-9][0-9]-*' -print | LC_ALL=C sort)
    fi
}

assert_directory_shape() {
    local root="$1" tasks="$2" manifest="$root/session.json"
    local expected actual cap
    expected="$(
        printf '%s\n' .
        cap="$(jq -er '.settings.workflow.ideation.maxIterations' "$manifest")"
        expected_iterated_dirs 1-ideation "$cap" 0
        cap="$(jq -er '.settings.workflow.planning.maxIterations' "$manifest")"
        expected_iterated_dirs 2-planning "$cap" 1
        expected_execution_dirs "$root" "$manifest" "$tasks"
        cap="$(jq -er '.settings.workflow["wrap-up"].maxIterations' "$manifest")"
        expected_iterated_dirs 4-wrap-up "$cap" 0
    )"
    actual="$(cd "$root" && find . 1-ideation 2-planning 3-execution 4-wrap-up -type d -print | sed 's#^./##' | LC_ALL=C sort -u)"
    expected="$(printf '%s\n' "$expected" | LC_ALL=C sort -u)"
    if ! diff -u <(printf '%s\n' "$expected") <(printf '%s\n' "$actual") >&2; then
        die "session directory shape does not match the authorized manifest/task set"
    fi
}

assert_root_entries() {
    local root="$1" entry
    while IFS= read -r entry; do
        case "$entry" in
            README.md|session.json|state.json|1-ideation|2-planning|3-execution|4-wrap-up) ;;
            *) die "unexpected session-root entry: $entry" ;;
        esac
    done < <(find "$root" -mindepth 1 -maxdepth 1 -printf '%f\n' | LC_ALL=C sort)
}

step_output_is_accepted() {
    local state="$1" step="$2"
    jq -e --arg step "$step" '
        (.completedSteps | index($step) != null) or
        (.current.step == $step and
         .current.stage == "RECORD" and
         .lastVerdict == "PASS")
    ' "$state" >/dev/null
}

task_output_is_accepted() {
    local state="$1" task_id="$2"
    jq -e --arg task "$task_id" '
        (.completedTasks | index($task) != null) or
        (.current.step == "execution" and
         .current.stage == "RECORD" and
         .current.task == $task and
         .lastVerdict == "PASS")
    ' "$state" >/dev/null
}

execution_step_output_is_accepted() {
    local state="$1" tasks="$2" number slug final_task_id required_tasks
    if jq -e '.completedSteps | index("execution") != null' "$state" >/dev/null; then
        return 0
    fi
    [ -n "$tasks" ] || return 1
    IFS=$'\t' read -r number slug < <(jq -r '.tasks | max_by(.number) | [.number, .slug] | @tsv' "$tasks")
    [ -n "$number" ] && [ -n "$slug" ] || return 1
    final_task_id="$(task_id_from_row "$number" "$slug")"
    required_tasks="$(jq -c --arg final "$final_task_id" '
        [.tasks[] |
          ((if .number < 10 then "0" else "" end) + (.number | tostring) + "-" + .slug)
        ] - [$final]
    ' "$tasks")"
    jq -e --arg task "$final_task_id" --argjson required "$required_tasks" '
        .current.step == "execution" and
        .current.stage == "RECORD" and
        .current.task == $task and
        .lastVerdict == "PASS" and
        ((($required - .completedTasks) | length) == 0)
    ' "$state" >/dev/null
}

assert_artifact_placement() {
    local root="$1" tasks="$2" state="$root/state.json" file relative top task_id
    while IFS= read -r file; do
        [ -n "$file" ] || continue
        relative="${file#$root/}"
        case "$relative" in
            README.md|session.json|state.json) ;;
            1-ideation/outputs/*)
                step_output_is_accepted "$state" ideation || die "Ideation output lacks matching RECORD/PASS or completed-step evidence: $relative"
                ;;
            2-planning/outputs/*)
                step_output_is_accepted "$state" planning || die "Planning output lacks matching RECORD/PASS or completed-step evidence: $relative"
                ;;
            3-execution/outputs/*)
                execution_step_output_is_accepted "$state" "$tasks" || die "Execution step output lacks final-task RECORD/PASS or completed-step evidence: $relative"
                ;;
            4-wrap-up/outputs/*)
                step_output_is_accepted "$state" wrap-up || die "Wrap-up output lacks matching RECORD/PASS or completed-step evidence: $relative"
                ;;
            3-execution/task-*/outputs/*)
                top="${relative#3-execution/task-}"
                task_id="${top%%/outputs/*}"
                task_output_is_accepted "$state" "$task_id" || die "Execution task output lacks matching RECORD/PASS or completed-task evidence: $relative"
                ;;
            */outputs/*)
                die "output artifact is not in a recognized PASS location: $relative"
                ;;
            */working/iteration-*/drafts/claude.md|*/working/iteration-*/drafts/codex.md|*/working/iteration-*/cross-reviews/claude-on-codex.md|*/working/iteration-*/cross-reviews/codex-on-claude.md|*/working/iteration-*/synthesis.md|*/working/iteration-*/open-decisions.md|*/working/iteration-*/research/*.md|*/evaluation/iteration-*/claude.md|*/evaluation/iteration-*/codex.md|*/staging/*.md|*/staging/*/*.md|*/staging/*/*/*.md)
                ;;
            *) die "artifact is outside the record placement contract: $relative" ;;
        esac
    done < <(find "$root" -type f -print | LC_ALL=C sort)
}

verify_shape() {
    local root="$1" tasks="$2"
    [ -d "$root" ] || die "session root not found: $root"
    validate_existing_session "$root"
    if [ -n "$tasks" ]; then validate_tasks_file "$tasks"; fi
    assert_root_entries "$root"
    assert_directory_shape "$root" "$tasks"
    assert_artifact_placement "$root" "$tasks"
}

command_verify() {
    local root="" tasks=""
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --root) root="${2:-}"; shift 2 ;;
            --tasks) tasks="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown verify argument: $1" ;;
        esac
    done
    [ -n "$root" ] || die "verify requires --root"
    root="$(normalize_path "$root" "session root")"
    verify_shape "$root" "$tasks"
    log "verified session record at $root"
}

self_test_fail() {
    log "SELF-TEST FAILURE: $*"
    return 1
}

expect_failure_preserving_file() {
    local target="$1" label="$2"
    shift 2
    local before after rc=0
    before="$(sha256sum "$target")"
    "$@" >/dev/null 2>&1 || rc=$?
    after="$(sha256sum "$target")"
    [ "$rc" -ne 0 ] || self_test_fail "$label unexpectedly succeeded"
    [ "$before" = "$after" ] || self_test_fail "$label changed $target"
}

expect_init_failure_preserving_record() {
    local root="$1" label="$2"
    shift 2
    local before_session before_state before_tree after_session after_state after_tree rc=0
    before_session="$(sha256sum "$root/session.json")"
    before_state="$(sha256sum "$root/state.json")"
    before_tree="$(find "$root" -printf '%P %y\n' | LC_ALL=C sort)"
    "$@" >/dev/null 2>&1 || rc=$?
    after_session="$(sha256sum "$root/session.json")"
    after_state="$(sha256sum "$root/state.json")"
    after_tree="$(find "$root" -printf '%P %y\n' | LC_ALL=C sort)"
    [ "$rc" -ne 0 ] || self_test_fail "$label unexpectedly succeeded"
    [ "$before_session" = "$after_session" ] || self_test_fail "$label changed session.json"
    [ "$before_state" = "$after_state" ] || self_test_fail "$label changed state.json"
    [ "$before_tree" = "$after_tree" ] || self_test_fail "$label changed the session tree"
}

expect_verify_failure_preserving_record() {
    local root="$1" tasks="$2" label="$3" before_state before_session after_state after_session rc=0
    before_state="$(sha256sum "$root/state.json")"
    before_session="$(sha256sum "$root/session.json")"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null 2>&1 || rc=$?
    after_state="$(sha256sum "$root/state.json")"
    after_session="$(sha256sum "$root/session.json")"
    [ "$rc" -ne 0 ] || self_test_fail "$label unexpectedly verified"
    [ "$before_state" = "$after_state" ] || self_test_fail "$label changed state.json"
    [ "$before_session" = "$after_session" ] || self_test_fail "$label changed session.json"
}

verify_preserving_record() {
    local root="$1" tasks="$2" label="$3" before_state before_session after_state after_session
    before_state="$(sha256sum "$root/state.json")"
    before_session="$(sha256sum "$root/session.json")"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null
    after_state="$(sha256sum "$root/state.json")"
    after_session="$(sha256sum "$root/session.json")"
    [ "$before_state" = "$after_state" ] || self_test_fail "$label changed state.json"
    [ "$before_session" = "$after_session" ] || self_test_fail "$label changed session.json"
}

make_pass_evaluation_fixture() {
    local target="$1" system="$2" runtime_identity="$3" subject_sha256="$4"
    local step="$5" iteration="$6" assignment="$7"
    jq -n -S \
        --arg system "$system" \
        --arg runtime "$runtime_identity" \
        --arg subject "$subject_sha256" \
        --arg step "$step" \
        --argjson iteration "$iteration" \
        --arg assignment "$assignment" '
        ["Project", "Structure", "Performance", "Aesthetics", "Usage", "Consistency", "Risk"] as $perspectives |
        {
          schemaVersion: 1,
          kind: "evaluation-report",
          system: $system,
          step: $step,
          iteration: $iteration,
          assignment: $assignment,
          runtimeIdentity: $runtime,
          subjectSha256: $subject,
          perspectives: ($perspectives | map({
            name: ., summary: (. + " perspective completed."), findings: [], verdict: "PASS"
          })),
          overall: {
            summary: "Overall evaluation completed.",
            findings: [],
            preserve: ["Preserve the verified digest chain."],
            verdict: "PASS"
          },
          checklist: (["Project", "Structure", "Performance", "Aesthetics", "Usage", "Consistency", "Risk", "Overall"] | map({
            id: ("CHECK-" + (ascii_upcase | gsub("[^A-Z0-9]"; "-"))),
            perspective: ., description: (. + " check completed."), status: "PASS",
            evidence: (. + " evidence inspected."), findingIds: []
          })),
          verdict: "PASS"
        }
    ' > "$target"
}

write_runtime_work_fixture() {
    local temporary="$1" root="$2" prefix="$3" step="$4" assignment="$5"
    local runtime_system="$6" task="$7" package owner contract
    local claude_draft_json codex_draft_json claude_review_json codex_review_json
    local claude_draft codex_draft claude_review codex_review
    local -a validator_args
    package="$root/$prefix/working/iteration-1"
    case "$runtime_system" in
        claude-code) owner=claude ;;
        codex) owner=codex ;;
        *) self_test_fail "unknown runtime fixture system: $runtime_system" ;;
    esac
    contract="$(printf '%s' "$runtime_system:$step:$assignment:contract" | sha256sum | awk '{print $1}')"
    claude_draft_json="$temporary/$runtime_system-$step-claude-draft.json"
    codex_draft_json="$temporary/$runtime_system-$step-codex-draft.json"
    claude_review_json="$temporary/$runtime_system-$step-claude-review.json"
    codex_review_json="$temporary/$runtime_system-$step-codex-review.json"
    claude_draft="$package/drafts/claude.md"
    codex_draft="$package/drafts/codex.md"
    claude_review="$package/cross-reviews/claude-on-codex.md"
    codex_review="$package/cross-reviews/codex-on-claude.md"

    jq -n -S --arg contract "$contract" --arg step "$step" --arg assignment "$assignment" \
        --arg runtime "$runtime_system-$step-claude-draft" \
        '{schemaVersion:1,kind:"draft",system:"claude",step:$step,iteration:1,assignment:$assignment,runtimeIdentity:$runtime,contractSha256:$contract,title:"Claude compatibility draft",summary:"Independent Claude-labeled fixture draft.",content:"Complete fixture candidate for the locked step contract."}' > "$claude_draft_json"
    jq -n -S --arg contract "$contract" --arg step "$step" --arg assignment "$assignment" \
        --arg runtime "$runtime_system-$step-codex-draft" \
        '{schemaVersion:1,kind:"draft",system:"codex",step:$step,iteration:1,assignment:$assignment,runtimeIdentity:$runtime,contractSha256:$contract,title:"Codex compatibility draft",summary:"Independent Codex-labeled fixture draft.",content:"Complete fixture candidate for the locked step contract."}' > "$codex_draft_json"
    "$0" write-artifact --root "$root" --kind draft --input "$claude_draft_json" \
        --target "$prefix/working/iteration-1/drafts/claude.md" --expected-system claude \
        --expected-step "$step" --expected-iteration 1 --expected-assignment "$assignment" >/dev/null
    "$0" write-artifact --root "$root" --kind draft --input "$codex_draft_json" \
        --target "$prefix/working/iteration-1/drafts/codex.md" --expected-system codex \
        --expected-step "$step" --expected-iteration 1 --expected-assignment "$assignment" >/dev/null

    jq -n -S --arg contract "$contract" --arg step "$step" --arg assignment "$assignment" \
        --arg runtime "$runtime_system-$step-claude-review" --arg subject "$(sha256sum "$codex_draft" | awk '{print $1}')" \
        '{schemaVersion:1,kind:"cross-review",system:"claude",step:$step,iteration:1,assignment:$assignment,runtimeIdentity:$runtime,contractSha256:$contract,subjectSystem:"codex",subjectSha256:$subject,conclusion:"accept",summary:"Claude-labeled fixture review of the frozen Codex draft.",findings:[]}' > "$claude_review_json"
    jq -n -S --arg contract "$contract" --arg step "$step" --arg assignment "$assignment" \
        --arg runtime "$runtime_system-$step-codex-review" --arg subject "$(sha256sum "$claude_draft" | awk '{print $1}')" \
        '{schemaVersion:1,kind:"cross-review",system:"codex",step:$step,iteration:1,assignment:$assignment,runtimeIdentity:$runtime,contractSha256:$contract,subjectSystem:"claude",subjectSha256:$subject,conclusion:"accept",summary:"Codex-labeled fixture review of the frozen Claude draft.",findings:[]}' > "$codex_review_json"
    "$0" write-artifact --root "$root" --kind cross-review --input "$claude_review_json" \
        --target "$prefix/working/iteration-1/cross-reviews/claude-on-codex.md" --expected-system claude \
        --expected-step "$step" --expected-iteration 1 --expected-assignment "$assignment" >/dev/null
    "$0" write-artifact --root "$root" --kind cross-review --input "$codex_review_json" \
        --target "$prefix/working/iteration-1/cross-reviews/codex-on-claude.md" --expected-system codex \
        --expected-step "$step" --expected-iteration 1 --expected-assignment "$assignment" >/dev/null

    printf '%s\n' \
        '---' 'artifact-kind: synthesis' 'protocol-stage: synthesis' "system: $owner" \
        "step: $step" 'iteration: 1' "assignment: $assignment" \
        "runtime-identity: $runtime_system-$step-synthesis" \
        "claude-draft-sha256: $(sha256sum "$claude_draft" | awk '{print $1}')" \
        "codex-draft-sha256: $(sha256sum "$codex_draft" | awk '{print $1}')" \
        "claude-on-codex-sha256: $(sha256sum "$claude_review" | awk '{print $1}')" \
        "codex-on-claude-sha256: $(sha256sum "$codex_review" | awk '{print $1}')" \
        '---' '' '# Canonical fixture synthesis' '' \
        'The runtime owner synthesized both frozen drafts and reciprocal reviews.' > "$package/synthesis.md"
    printf '%s\n' \
        '---' 'artifact-kind: open-decisions' 'protocol-stage: decisions-resolved' \
        "step: $step" 'iteration: 1' "assignment: $assignment" \
        "synthesis-sha256: $(sha256sum "$package/synthesis.md" | awk '{print $1}')" \
        'status: resolved' 'unresolved-count: 0' '---' '' '# Open decisions' '' \
        'No unresolved material fixture decisions.' > "$package/open-decisions.md"

    validator_args=(--root "$root" --step "$step" --iteration 1 --assignment "$assignment")
    [ -z "$task" ] || validator_args+=(--task "$task")
    "$DUAL_WORK_VALIDATOR" "${validator_args[@]}" >/dev/null
}

write_runtime_evaluation_fixture() {
    local temporary="$1" root="$2" prefix="$3" step="$4" assignment="$5"
    local subject_sha256="$6" runtime_system="$7"
    local claude_json codex_json claude_target codex_target
    claude_json="$temporary/$runtime_system-$step-claude-evaluation.json"
    codex_json="$temporary/$runtime_system-$step-codex-evaluation.json"
    claude_target="$root/$prefix/evaluation/iteration-1/claude.md"
    codex_target="$root/$prefix/evaluation/iteration-1/codex.md"
    make_pass_evaluation_fixture "$claude_json" claude "$runtime_system-$step-claude-evaluator" \
        "$subject_sha256" "$step" 1 "$assignment"
    make_pass_evaluation_fixture "$codex_json" codex "$runtime_system-$step-codex-evaluator" \
        "$subject_sha256" "$step" 1 "$assignment"
    "$0" write-artifact --root "$root" --kind evaluation-report --input "$claude_json" \
        --target "$prefix/evaluation/iteration-1/claude.md" --expected-system claude \
        --expected-step "$step" --expected-iteration 1 --expected-assignment "$assignment" >/dev/null
    "$0" write-artifact --root "$root" --kind evaluation-report --input "$codex_json" \
        --target "$prefix/evaluation/iteration-1/codex.md" --expected-system codex \
        --expected-step "$step" --expected-iteration 1 --expected-assignment "$assignment" >/dev/null
    "$EVALUATION_VALIDATOR" pair --claude-report "$claude_target" --codex-report "$codex_target" \
        --expected-step "$step" --expected-iteration 1 --expected-assignment "$assignment" \
        --expected-subject-sha256 "$subject_sha256" >/dev/null
}

promotion_manifest_has_typed_source() {
    local manifest="$1"
    jq -e '
        (.source | test("^(1-ideation|2-planning|3-execution|4-wrap-up)(/task-[0-9]{2}-[a-z0-9-]+)?/staging/(scenarios|checklists|decisions|references|design|discussions|reviews|reports|changelogs|learnings|notes|plans|backlogs/(feature|project))/[^/]+[.]md$")) and
        (.source | contains("..") | not) and
        (.destination | test("^[.]gobbi/projects/[a-z0-9-]+/notes/[a-z0-9-]+/[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9-]+[.]md$")) and
        (.destination | contains("..") | not) and
        (.preimage == "absent") and
        (.sourceSha256 | test("^[0-9a-f]{64}$")) and
        (.destinationSha256 | test("^[0-9a-f]{64}$")) and
        (.bodySha256 | test("^[0-9a-f]{64}$"))
    ' "$manifest" >/dev/null
}

extract_frontmatter_body() {
    awk '
        NR == 1 && $0 == "---" {in_header = 1; next}
        in_header && $0 == "---" {in_header = 0; closed = 1; next}
        closed && !started && $0 ~ /^# / {started = 1}
        started {print}
    ' "$1"
}

prepare_runtime_promotion_fixture() {
    local temporary="$1" worktree="$2" root="$3" runtime_system="$4"
    local source_relative destination_relative source destination body manifest wrong_manifest source_before
    local promoted_candidate promoted_sha256 author session_id
    source_relative="4-wrap-up/staging/notes/runtime-fixture-handoff.md"
    destination_relative=".gobbi/projects/project/notes/workflow/2026-07-20-runtime-fixture-handoff.md"
    source="$root/$source_relative"
    destination="$worktree/$destination_relative"
    body="$root/4-wrap-up/working/iteration-1/research/handoff-body.md"
    manifest="$root/4-wrap-up/working/iteration-1/research/promotion-manifest.md"
    wrong_manifest="$temporary/$runtime_system-wrong-promotion-manifest.json"
    promoted_candidate="$temporary/$runtime_system-promoted-handoff.md"
    session_id="$(jq -r '.sessionId' "$root/session.json")"
    case "$runtime_system" in
        claude-code) author=claude ;;
        codex) author=codex ;;
        *) self_test_fail "unknown runtime fixture system: $runtime_system" ;;
    esac

    printf '%s\n' \
        '# Runtime fixture handoff' '' \
        '## 1. Outcome and agreed scope' 'The complete deterministic runtime fixture passed its locked scope.' '' \
        '## 2. Completed work and evidence' 'Creation, evaluation, promotion, handoff, and local Git gates produced direct evidence.' '' \
        '## 3. Evaluation and dispositions' 'Both fixture reports returned PASS with no findings or waivers.' '' \
        '## 4. Decisions to respect' 'Keep session identity distinct from runtime identity.' '' \
        '## 5. Durable memory' 'The typed Wrap-up note is the sole promotion source.' '' \
        '## 6. Pre-finalization Git state' 'The isolated fixture worktree is ready for a local commit only.' '' \
        '## 7. Unresolved or deferred items' 'None.' '' \
        '## 8. Known risks and exceptions' 'None in the deterministic fixture.' '' \
        '## 9. Exact next-session start point' 'Read this handoff, inspect the retained local branch, and begin with the next authorized objective.' \
        > "$body"
    printf '%s\n' \
        '---' 'name: runtime-fixture-handoff' 'description: Durable handoff produced by the integrated runtime fixture.' \
        'type: notes' 'scope: project' 'feature: null' 'status: active' 'created: 2026-07-20' \
        "session: $session_id" 'tags: [process, validation]' \
        'keywords: [runtime-fixture, handoff, promotion]' "author: $author" 'area: workflow' \
        'features_touched: []' 'steps_completed: [ideation, planning, execution, wrap-up]' \
        'shipped: [runtime-fixture-handoff]' \
        '---' '' > "$source"
    sed -n '1,$p' "$body" >> "$source"
    awk '$0 != "area: workflow" {print}' "$source" > "$promoted_candidate"
    [ ! -e "$destination" ] || self_test_fail "$runtime_system promotion destination preimage was not absent"
    printf '%s\n' absent > "$root/4-wrap-up/working/iteration-1/research/destination-preimage.md"
    source_before="$(sha256sum "$source" | awk '{print $1}')"
    promoted_sha256="$(sha256sum "$promoted_candidate" | awk '{print $1}')"
    jq -n -S --arg source "$source_relative" --arg destination "$destination_relative" \
        --arg source_sha "$source_before" --arg destination_sha "$promoted_sha256" \
        --arg body_sha "$(sha256sum "$body" | awk '{print $1}')" \
        '{schemaVersion:1,source:$source,destination:$destination,preimage:"absent",sourceSha256:$source_sha,destinationSha256:$destination_sha,bodySha256:$body_sha}' \
        > "$manifest"
    promotion_manifest_has_typed_source "$manifest" || self_test_fail "$runtime_system valid promotion manifest was rejected"
    jq '.source = "4-wrap-up/working/iteration-1/research/handoff-body.md"' "$manifest" > "$wrong_manifest"
    if promotion_manifest_has_typed_source "$wrong_manifest"; then
        self_test_fail "$runtime_system non-staging promotion source was accepted"
    fi

    mkdir -p -- "$(dirname "$destination")"
    cp -- "$promoted_candidate" "$destination"
    [ "$source_before" = "$(sha256sum "$source" | awk '{print $1}')" ] ||
        self_test_fail "$runtime_system promotion mutated its staging source"
    [ "$(jq -r '.destinationSha256' "$manifest")" = "$(sha256sum "$destination" | awk '{print $1}')" ] ||
        self_test_fail "$runtime_system promoted destination digest mismatch"
    cmp -s "$body" <(extract_frontmatter_body "$destination") ||
        self_test_fail "$runtime_system durable handoff body mismatch"
}

verify_runtime_handoff_equality() {
    local temporary="$1" worktree="$2" root="$3" runtime_system="$4"
    local output durable backup
    output="$root/4-wrap-up/outputs/handoff.md"
    durable="$worktree/.gobbi/projects/project/notes/workflow/2026-07-20-runtime-fixture-handoff.md"
    backup="$temporary/$runtime_system-handoff.backup"
    cmp -s "$output" <(extract_frontmatter_body "$durable") ||
        self_test_fail "$runtime_system session and durable handoff bodies differ"
    cp -- "$output" "$backup"
    printf '%s\n' 'cosmetic but wrong mutation' >> "$output"
    if cmp -s "$output" <(extract_frontmatter_body "$durable"); then
        self_test_fail "$runtime_system handoff equality guard accepted a wrong body"
    fi
    mv -- "$backup" "$output"
    cmp -s "$output" <(extract_frontmatter_body "$durable") ||
        self_test_fail "$runtime_system handoff restore failed"
}

exercise_runtime_workflow_fixture() {
    local temporary="$1" runtime_system="$2" session_id="$3" runtime_id="$4"
    local worktree root patch tasks assignment subject commit receipt
    worktree="$temporary/full-$runtime_system-worktree"
    root="$worktree/.gobbi/projects/project/sessions/2026-07-20-$session_id"
    patch="$temporary/full-$runtime_system-patch.json"
    tasks="$temporary/full-$runtime_system-tasks.json"
    mkdir -p -- "$worktree"
    git -C "$worktree" init -q -b "full-$runtime_system-fixture"
    git -C "$worktree" config user.name 'Gobbi Runtime Fixture'
    git -C "$worktree" config user.email 'gobbi-fixture@example.invalid'

    "$0" init \
        --root "$root" \
        --session-id "$session_id" \
        --project project \
        --runtime-system "$runtime_system" \
        --runtime-id "$runtime_id" \
        --started-at 2026-07-20T00:00:00Z \
        --branch "full-$runtime_system-fixture" \
        --worktree "$worktree" >/dev/null
    printf '%s\n' '{"tasks":[{"number":1,"slug":"runtime-fixture"}]}' > "$tasks"

    printf '%s\n' '{"current":{"step":"ideation","stage":"DISCUSSION","iteration":1,"task":null},"completedSteps":["configuration"],"lastVerdict":null}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    "$0" verify --root "$root" >/dev/null
    assignment="$runtime_system-ideation-fixture"
    printf '%s\n' '{"current":{"stage":"WORK"}}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    write_runtime_work_fixture "$temporary" "$root" 1-ideation ideation "$assignment" "$runtime_system" ""
    subject="$(sha256sum "$root/1-ideation/working/iteration-1/synthesis.md" | awk '{print $1}')"
    printf '%s\n' '{"current":{"stage":"EVALUATION"}}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    write_runtime_evaluation_fixture "$temporary" "$root" 1-ideation ideation "$assignment" "$subject" "$runtime_system"
    printf '%s\n' '{"current":{"stage":"RECORD"},"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    printf '%s\n' '# Ideation fixture output' > "$root/1-ideation/outputs/ideation.md"
    "$0" verify --root "$root" >/dev/null

    printf '%s\n' '{"current":{"step":"planning","stage":"DISCUSSION","iteration":1,"task":null},"completedSteps":["configuration","ideation"],"lastVerdict":null}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    assignment="$runtime_system-planning-fixture"
    printf '%s\n' '{"current":{"stage":"WORK"}}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    write_runtime_work_fixture "$temporary" "$root" 2-planning planning "$assignment" "$runtime_system" ""
    subject="$(sha256sum "$root/2-planning/working/iteration-1/synthesis.md" | awk '{print $1}')"
    printf '%s\n' '{"current":{"stage":"EVALUATION"}}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    write_runtime_evaluation_fixture "$temporary" "$root" 2-planning planning "$assignment" "$subject" "$runtime_system"
    printf '%s\n' '{"current":{"stage":"RECORD"},"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    printf '%s\n' '# Planning fixture output' > "$root/2-planning/outputs/plan.md"
    "$0" scaffold-tasks --root "$root" --tasks "$tasks" >/dev/null
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null

    printf '%s\n' '{"current":{"step":"execution","stage":"DISCUSSION","iteration":1,"task":"01-runtime-fixture"},"completedSteps":["configuration","ideation","planning"],"completedTasks":[],"lastVerdict":null}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    assignment="$runtime_system-execution-fixture"
    printf '%s\n' '{"current":{"stage":"WORK"}}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    write_runtime_work_fixture "$temporary" "$root" 3-execution/task-01-runtime-fixture execution "$assignment" "$runtime_system" task-01-runtime-fixture
    subject="$(sha256sum "$root/3-execution/task-01-runtime-fixture/working/iteration-1/synthesis.md" | awk '{print $1}')"
    printf '%s\n' '{"current":{"stage":"EVALUATION"}}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    write_runtime_evaluation_fixture "$temporary" "$root" 3-execution/task-01-runtime-fixture execution "$assignment" "$subject" "$runtime_system"
    printf '%s\n' '{"current":{"stage":"RECORD"},"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    printf '%s\n' '# Execution task fixture output' > "$root/3-execution/task-01-runtime-fixture/outputs/result.md"
    printf '%s\n' '# Execution fixture output' > "$root/3-execution/outputs/execution.md"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null

    printf '%s\n' '{"current":{"step":"wrap-up","stage":"DISCUSSION","iteration":1,"task":null},"completedSteps":["configuration","ideation","planning","execution"],"completedTasks":["01-runtime-fixture"],"lastVerdict":null}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    assignment="$runtime_system-wrap-up-fixture"
    printf '%s\n' '{"current":{"stage":"WORK"}}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    write_runtime_work_fixture "$temporary" "$root" 4-wrap-up wrap-up "$assignment" "$runtime_system" ""
    prepare_runtime_promotion_fixture "$temporary" "$worktree" "$root" "$runtime_system"
    subject="$(sha256sum \
        "$root/4-wrap-up/working/iteration-1/synthesis.md" \
        "$root/4-wrap-up/working/iteration-1/research/promotion-manifest.md" \
        "$root/4-wrap-up/working/iteration-1/research/handoff-body.md" \
        "$worktree/.gobbi/projects/project/notes/workflow/2026-07-20-runtime-fixture-handoff.md" | sha256sum | awk '{print $1}')"
    printf '%s\n' '{"current":{"stage":"EVALUATION"}}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    write_runtime_evaluation_fixture "$temporary" "$root" 4-wrap-up wrap-up "$assignment" "$subject" "$runtime_system"
    printf '%s\n' '{"current":{"stage":"RECORD"},"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    cp -- "$root/4-wrap-up/working/iteration-1/research/handoff-body.md" "$root/4-wrap-up/outputs/handoff.md"
    verify_runtime_handoff_equality "$temporary" "$worktree" "$root" "$runtime_system"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null

    jq -n -S '{finishedAt:"2026-07-20T01:00:00Z",outcome:{status:"complete",steps:{ideation:{verdict:"PASS",artifact:"1-ideation/outputs/ideation.md"},planning:{verdict:"PASS",artifact:"2-planning/outputs/plan.md"},execution:{verdict:"PASS",artifact:"3-execution/outputs/execution.md"},"wrap-up":{verdict:"PASS",artifact:"4-wrap-up/outputs/handoff.md"}},handoffPath:"4-wrap-up/outputs/handoff.md",waivers:[],reason:null}}' > "$patch"
    "$0" checkpoint --root "$root" --patch "$patch" >/dev/null
    printf '%s\n' '{"status":"complete","current":{"step":"wrap-up","stage":null,"iteration":1,"task":null},"completedSteps":["configuration","ideation","planning","execution","wrap-up"],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null
    [ "$(jq -r '.runtime.system' "$root/session.json")" = "$runtime_system" ] || self_test_fail "$runtime_system fixture changed runtime system"
    [ "$(jq -r '.status' "$root/state.json")" = "complete" ] || self_test_fail "$runtime_system fixture did not complete"
    [ "$(jq -r '.outcome.handoffPath' "$root/session.json")" = '4-wrap-up/outputs/handoff.md' ] ||
        self_test_fail "$runtime_system fixture did not checkpoint its handoff"

    git -C "$worktree" add .
    git -C "$worktree" commit -q -m "test: complete $runtime_system workflow fixture"
    commit="$(git -C "$worktree" rev-parse HEAD)"
    git -C "$worktree" diff --quiet HEAD -- || self_test_fail "$runtime_system fixture worktree is dirty after finalization"
    [ -z "$(git -C "$worktree" status --porcelain)" ] || self_test_fail "$runtime_system fixture has untracked finalization residue"
    receipt="$temporary/full-$runtime_system-finalization-receipt.txt"
    printf '%s\n' \
        "commit: $commit" 'push: not configured' 'pull-request: not configured' \
        'merge: not authorized' "worktree: $worktree" 'cleanup: retained local fixture worktree' > "$receipt"
    grep -q "^commit: $commit$" "$receipt" || self_test_fail "$runtime_system finalization receipt omitted the commit"
}

command_self_test() {
    local temporary worktree session_id root tasks patch target_count before_tree after_tree
    local artifact_contract claude_draft_json codex_draft_json claude_draft_target codex_draft_target
    local claude_review_json codex_review_json claude_review_target codex_review_target
    local claude_eval_json codex_eval_json claude_eval_target codex_eval_target subject_digest
    local bad_artifact linked_input external_target artifact_backup conflicting_settings
    temporary="$(mktemp -d)"
    cleanup_dir_later "$temporary"
    worktree="$temporary/worktree"
    mkdir -p -- "$worktree"
    session_id="11111111-1111-4111-8111-111111111111"
    root="$worktree/.gobbi/projects/project/sessions/2026-07-20-$session_id"
    "$0" init \
        --root "$root" \
        --session-id "$session_id" \
        --project project \
        --runtime-system codex \
        --runtime-id runtime-one \
        --started-at 2026-07-20T00:00:00Z \
        --branch test-session \
        --worktree "$worktree" >/dev/null
    [ ! -e "$root/settings.json" ] || self_test_fail "init created settings.json"
    [ ! -e "$root/session.json.lock" ] || self_test_fail "init created session.json.lock"
    [ ! -e "$root/transcripts" ] || self_test_fail "init created transcripts"
    [ -d "$root/1-ideation/working/iteration-3/drafts" ] || self_test_fail "Ideation eager iteration 3 missing"
    [ -d "$root/2-planning/staging/plans" ] || self_test_fail "Planning staging/plans missing"
    [ -d "$root/4-wrap-up/evaluation/iteration-3" ] || self_test_fail "Wrap-up eager iteration 3 missing"
    [ -z "$(find "$root/1-ideation/staging" -type f -print -quit)" ] || self_test_fail "clean staging is not empty"
    before_tree="$(find "$root" -printf '%P %y\n' | LC_ALL=C sort)"
    "$0" init \
        --root "$root" \
        --session-id "$session_id" \
        --project project \
        --runtime-system codex \
        --runtime-id runtime-one \
        --started-at 2026-07-20T00:00:00Z \
        --branch test-session \
        --worktree "$worktree" >/dev/null
    after_tree="$(find "$root" -printf '%P %y\n' | LC_ALL=C sort)"
    [ "$before_tree" = "$after_tree" ] || self_test_fail "repeated init changed the tree"

    expect_init_failure_preserving_record "$root" "conflicting runtime system" "$0" init \
        --root "$root" --session-id "$session_id" --project project \
        --runtime-system claude-code --runtime-id runtime-one \
        --started-at 2026-07-20T00:00:00Z --branch test-session --worktree "$worktree"
    expect_init_failure_preserving_record "$root" "conflicting base branch" "$0" init \
        --root "$root" --session-id "$session_id" --project project \
        --runtime-system codex --runtime-id runtime-one \
        --started-at 2026-07-20T00:00:00Z --branch test-session --worktree "$worktree" \
        --base-branch main
    expect_init_failure_preserving_record "$root" "conflicting repository" "$0" init \
        --root "$root" --session-id "$session_id" --project project \
        --runtime-system codex --runtime-id runtime-one \
        --started-at 2026-07-20T00:00:00Z --branch test-session --worktree "$worktree" \
        --repo owner/project
    conflicting_settings="$temporary/conflicting-settings.json"
    jq '.settings | .git.publication = "push"' "$SESSION_TEMPLATE" > "$conflicting_settings"
    expect_init_failure_preserving_record "$root" "conflicting resolved settings" "$0" init \
        --root "$root" --session-id "$session_id" --project project \
        --runtime-system codex --runtime-id runtime-one \
        --started-at 2026-07-20T00:00:00Z --branch test-session --worktree "$worktree" \
        --settings "$conflicting_settings"
    "$0" verify --root "$root" >/dev/null

    patch="$temporary/runtime-append.json"
    printf '%s\n' '{"runtime":{"system":"claude-code","ids":["runtime-one","runtime-two"]}}' > "$patch"
    "$0" checkpoint --root "$root" --patch "$patch" >/dev/null
    [ "$(jq -r '.runtime.ids | join(",")' "$root/session.json")" = "runtime-one,runtime-two" ] || self_test_fail "runtime append/order failed"

    printf '%s\n' '{"runtime":{"system":"codex","ids":["runtime-two","runtime-one"]}}' > "$patch"
    expect_failure_preserving_file "$root/session.json" "runtime reorder" "$0" checkpoint --root "$root" --patch "$patch"
    printf '%s\n' '{bad json' > "$patch"
    expect_failure_preserving_file "$root/session.json" "invalid checkpoint JSON" "$0" checkpoint --root "$root" --patch "$patch"
    printf '%s\n' '{"schemaVersion":4}' > "$patch"
    expect_failure_preserving_file "$root/session.json" "unauthorized old manifest schema" "$0" checkpoint --root "$root" --patch "$patch"
    printf '%s\n' '{"runtime":null}' > "$patch"
    expect_failure_preserving_file "$root/session.json" "missing required runtime" "$0" checkpoint --root "$root" --patch "$patch"
    printf '%s\n' '{"settings":{"git":{"publication":"silent-fallback"}}}' > "$patch"
    expect_failure_preserving_file "$root/session.json" "unknown publication enum" "$0" checkpoint --root "$root" --patch "$patch"
    printf '%s\n' '{"git":{"branch":"changed-branch"}}' > "$patch"
    expect_failure_preserving_file "$root/session.json" "immutable branch" "$0" checkpoint --root "$root" --patch "$patch"

    printf '%s\n' '{"current":{"step":"ideation","stage":"DISCUSSION","iteration":1},"completedSteps":["configuration"]}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    [ "$(jq -r '.current.step + "/" + .current.stage' "$root/state.json")" = "ideation/DISCUSSION" ] || self_test_fail "valid transition failed"
    printf '%s\n' '{"current":{"stage":"BUILD"}}' > "$patch"
    expect_failure_preserving_file "$root/state.json" "unknown stage enum" "$0" transition --root "$root" --patch "$patch"
    printf '%s\n' '{"completedSteps":["ideation"]}' > "$patch"
    expect_failure_preserving_file "$root/state.json" "non-prefix completed steps" "$0" transition --root "$root" --patch "$patch"
    printf '%s\n' '{"current":{"iteration":4}}' > "$patch"
    expect_failure_preserving_file "$root/state.json" "iteration above manifest cap" "$0" transition --root "$root" --patch "$patch"
    printf '%s\n' '{"activeDispatches":[{"role":"evaluator","system":"claude","kind":"teammate","runtimeIdentity":"bad-evaluator","assignment":"evaluate-ideation-1","status":"running"}]}' > "$patch"
    expect_failure_preserving_file "$root/state.json" "teammate evaluator dispatch" "$0" transition --root "$root" --patch "$patch"
    printf '%s\n' '{"schemaVersion":2}' > "$patch"
    expect_failure_preserving_file "$root/state.json" "old state schema" "$0" transition --root "$root" --patch "$patch"
    printf '%s\n' '{"settings":{"workflow":{}}}' > "$patch"
    expect_failure_preserving_file "$root/state.json" "transition settings mutation" "$0" transition --root "$root" --patch "$patch"

    tasks="$temporary/tasks.json"
    printf '%s\n' '{"tasks":[{"number":1,"slug":"record-foundation"},{"number":2,"slug":"atomic-updates"}]}' > "$tasks"
    "$0" scaffold-tasks --root "$root" --tasks "$tasks" >/dev/null
    [ -d "$root/3-execution/task-01-record-foundation/working/iteration-3/cross-reviews" ] || self_test_fail "task eager iteration 3 missing"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null
    target_count="$(find "$root/3-execution" -mindepth 1 -maxdepth 1 -type d -name 'task-*' | wc -l | tr -d ' ')"
    printf '%s\n' '{"tasks":[{"number":1,"slug":"../escape"}]}' > "$temporary/bad-tasks.json"
    if "$0" scaffold-tasks --root "$root" --tasks "$temporary/bad-tasks.json" >/dev/null 2>&1; then self_test_fail "path-traversal task succeeded"; fi
    [ "$target_count" = "$(find "$root/3-execution" -mindepth 1 -maxdepth 1 -type d -name 'task-*' | wc -l | tr -d ' ')" ] || self_test_fail "bad task created a path"
    printf '%s\n' '{"tasks":[{"number":1,"slug":"one"},{"number":1,"slug":"two"}]}' > "$temporary/bad-tasks.json"
    if "$0" scaffold-tasks --root "$root" --tasks "$temporary/bad-tasks.json" >/dev/null 2>&1; then self_test_fail "duplicate task number succeeded"; fi

    printf '%s\n' '{"settings":{"workflow":{"execution":{"maxIterations":4}}}}' > "$patch"
    "$0" checkpoint --root "$root" --patch "$patch" >/dev/null
    [ -d "$root/3-execution/task-01-record-foundation/working/iteration-4/drafts" ] || self_test_fail "cap extension did not scaffold task iteration 4"
    [ ! -d "$root/1-ideation/working/iteration-4" ] || self_test_fail "execution cap extension scaffolded Ideation iteration 4"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null

    printf '%s\n' '# canonical Ideation artifact' > "$root/1-ideation/outputs/ideation.md"
    expect_verify_failure_preserving_record "$root" "$tasks" "Ideation output during DISCUSSION"
    printf '%s\n' '{"current":{"step":"ideation","stage":"RECORD","iteration":1,"task":null},"lastVerdict":"REVISE"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    expect_verify_failure_preserving_record "$root" "$tasks" "Ideation output during non-PASS RECORD"
    printf '%s\n' '{"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Ideation output during matching RECORD/PASS"
    printf '%s\n' '{"current":{"step":"planning","stage":"DISCUSSION","iteration":1,"task":null},"completedSteps":["configuration","ideation"],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Ideation output after completed-step transition"

    printf '%s\n' '# canonical Planning artifact' > "$root/2-planning/outputs/plan.md"
    expect_verify_failure_preserving_record "$root" "$tasks" "Planning output during DISCUSSION"
    printf '%s\n' '{"current":{"stage":"RECORD"},"lastVerdict":"FAIL"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    expect_verify_failure_preserving_record "$root" "$tasks" "Planning output during non-PASS RECORD"
    printf '%s\n' '{"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Planning output during matching RECORD/PASS"
    printf '%s\n' '{"current":{"step":"execution","stage":"DISCUSSION","iteration":1,"task":"01-record-foundation"},"completedSteps":["configuration","ideation","planning"],"completedTasks":[],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Planning output after completed-step transition"

    printf '%s\n' '{"current":{"step":"execution","stage":"RECORD","iteration":1,"task":"02-atomic-updates"},"completedTasks":[],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    printf '%s\n' '# premature final-task Execution step artifact' > "$root/3-execution/outputs/execution.md"
    expect_verify_failure_preserving_record "$root" "$tasks" "Execution step output with incomplete earlier locked tasks"
    rm -f -- "$root/3-execution/outputs/execution.md"
    printf '%s\n' '{"current":{"step":"execution","stage":"DISCUSSION","iteration":1,"task":"01-record-foundation"},"completedTasks":[],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null

    printf '%s\n' '# task 1 result' > "$root/3-execution/task-01-record-foundation/outputs/result.md"
    expect_verify_failure_preserving_record "$root" "$tasks" "Execution task 1 output during DISCUSSION"
    printf '%s\n' '{"current":{"stage":"RECORD"},"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Execution task 1 output during matching RECORD/PASS"
    printf '%s\n' '# future task result' > "$root/3-execution/task-02-atomic-updates/outputs/result.md"
    expect_verify_failure_preserving_record "$root" "$tasks" "future Execution task output"
    rm -f -- "$root/3-execution/task-02-atomic-updates/outputs/result.md"
    printf '%s\n' '# premature Execution step artifact' > "$root/3-execution/outputs/execution.md"
    expect_verify_failure_preserving_record "$root" "$tasks" "Execution step output before final task"
    rm -f -- "$root/3-execution/outputs/execution.md"
    printf '%s\n' '{"current":{"step":"execution","stage":"DISCUSSION","iteration":1,"task":"02-atomic-updates"},"completedTasks":["01-record-foundation"],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Execution task 1 output after completed-task transition"

    printf '%s\n' '# task 2 result' > "$root/3-execution/task-02-atomic-updates/outputs/result.md"
    expect_verify_failure_preserving_record "$root" "$tasks" "Execution task 2 output during DISCUSSION"
    printf '%s\n' '{"current":{"stage":"RECORD"},"lastVerdict":"FAIL"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    expect_verify_failure_preserving_record "$root" "$tasks" "Execution task 2 output during non-PASS RECORD"
    printf '%s\n' '{"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Execution task 2 output during matching RECORD/PASS"
    printf '%s\n' '# canonical Execution step artifact' > "$root/3-execution/outputs/execution.md"
    verify_preserving_record "$root" "$tasks" "Execution step output during final-task RECORD/PASS"
    printf '%s\n' '{"current":{"step":"wrap-up","stage":"DISCUSSION","iteration":1,"task":null},"completedSteps":["configuration","ideation","planning","execution"],"completedTasks":["01-record-foundation","02-atomic-updates"],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Execution outputs after completed-step transition"

    printf '%s\n' '# evaluated handoff' > "$root/4-wrap-up/outputs/handoff.md"
    expect_verify_failure_preserving_record "$root" "$tasks" "Wrap-up output during DISCUSSION"
    printf '%s\n' '{"current":{"stage":"RECORD"},"lastVerdict":"FAIL"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    expect_verify_failure_preserving_record "$root" "$tasks" "Wrap-up output during non-PASS RECORD"
    printf '%s\n' '{"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Wrap-up output during matching RECORD/PASS"
    printf '%s\n' '{"status":"complete","current":{"step":"wrap-up","stage":null,"iteration":1,"task":null},"completedSteps":["configuration","ideation","planning","execution","wrap-up"],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    verify_preserving_record "$root" "$tasks" "Wrap-up output after completed-step transition"

    artifact_contract="$(printf '%s' 'artifact-contract-v1' | sha256sum | awk '{print $1}')"
    claude_draft_json="$temporary/claude-draft.json"
    codex_draft_json="$temporary/codex-draft.json"
    claude_draft_target="$root/1-ideation/working/iteration-1/drafts/claude.md"
    codex_draft_target="$root/1-ideation/working/iteration-1/drafts/codex.md"
    jq -n --arg contract "$artifact_contract" '{schemaVersion:1,kind:"draft",system:"claude",step:"ideation",iteration:1,assignment:"artifact-contract",runtimeIdentity:"claude-draft-self-test",contractSha256:$contract,title:"Claude draft",summary:"Independent Claude draft.",content:"Complete Claude candidate."}' > "$claude_draft_json"
    jq -n --arg contract "$artifact_contract" '{schemaVersion:1,kind:"draft",system:"codex",step:"ideation",iteration:1,assignment:"artifact-contract",runtimeIdentity:"codex-draft-self-test",contractSha256:$contract,title:"Codex draft",summary:"Independent Codex draft.",content:"Complete Codex candidate."}' > "$codex_draft_json"
    "$0" write-artifact --root "$root" --kind draft --input "$claude_draft_json" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract >/dev/null
    "$0" write-artifact --root "$root" --kind draft --input "$codex_draft_json" --target 1-ideation/working/iteration-1/drafts/codex.md --expected-system codex --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract >/dev/null

    claude_review_json="$temporary/claude-review.json"
    codex_review_json="$temporary/codex-review.json"
    claude_review_target="$root/1-ideation/working/iteration-1/cross-reviews/claude-on-codex.md"
    codex_review_target="$root/1-ideation/working/iteration-1/cross-reviews/codex-on-claude.md"
    jq -n --arg contract "$artifact_contract" --arg subject "$(sha256sum "$codex_draft_target" | awk '{print $1}')" '{schemaVersion:1,kind:"cross-review",system:"claude",step:"ideation",iteration:1,assignment:"artifact-contract",runtimeIdentity:"claude-review-self-test",contractSha256:$contract,subjectSystem:"codex",subjectSha256:$subject,conclusion:"accept",summary:"Claude reviewed the frozen Codex draft.",findings:[]}' > "$claude_review_json"
    jq -n --arg contract "$artifact_contract" --arg subject "$(sha256sum "$claude_draft_target" | awk '{print $1}')" '{schemaVersion:1,kind:"cross-review",system:"codex",step:"ideation",iteration:1,assignment:"artifact-contract",runtimeIdentity:"codex-review-self-test",contractSha256:$contract,subjectSystem:"claude",subjectSha256:$subject,conclusion:"accept",summary:"Codex reviewed the frozen Claude draft.",findings:[]}' > "$codex_review_json"
    "$0" write-artifact --root "$root" --kind cross-review --input "$claude_review_json" --target 1-ideation/working/iteration-1/cross-reviews/claude-on-codex.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract >/dev/null
    "$0" write-artifact --root "$root" --kind cross-review --input "$codex_review_json" --target 1-ideation/working/iteration-1/cross-reviews/codex-on-claude.md --expected-system codex --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract >/dev/null

    subject_digest="$(printf '%s' 'canonical-synthesis' | sha256sum | awk '{print $1}')"
    claude_eval_json="$temporary/claude-evaluation.json"
    codex_eval_json="$temporary/codex-evaluation.json"
    claude_eval_target="$root/1-ideation/evaluation/iteration-1/claude.md"
    codex_eval_target="$root/1-ideation/evaluation/iteration-1/codex.md"
    make_pass_evaluation_fixture "$claude_eval_json" claude claude-evaluator-self-test "$subject_digest" ideation 1 artifact-contract
    make_pass_evaluation_fixture "$codex_eval_json" codex codex-evaluator-self-test "$subject_digest" ideation 1 artifact-contract
    "$0" write-artifact --root "$root" --kind evaluation-report --input "$claude_eval_json" --target 1-ideation/evaluation/iteration-1/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract >/dev/null
    "$0" write-artifact --root "$root" --kind evaluation-report --input "$codex_eval_json" --target 1-ideation/evaluation/iteration-1/codex.md --expected-system codex --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract >/dev/null

    expect_failure_preserving_file "$claude_draft_target" "draft wrong assignment" "$0" write-artifact --root "$root" --kind draft --input "$claude_draft_json" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment wrong-assignment
    expect_failure_preserving_file "$claude_review_target" "cross-review wrong assignment" "$0" write-artifact --root "$root" --kind cross-review --input "$claude_review_json" --target 1-ideation/working/iteration-1/cross-reviews/claude-on-codex.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment wrong-assignment
    expect_failure_preserving_file "$claude_eval_target" "evaluation wrong assignment" "$0" write-artifact --root "$root" --kind evaluation-report --input "$claude_eval_json" --target 1-ideation/evaluation/iteration-1/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment wrong-assignment

    bad_artifact="$temporary/bad-artifact.json"
    printf '%s\n' '{bad json' > "$bad_artifact"
    expect_failure_preserving_file "$claude_draft_target" "malformed artifact JSON" "$0" write-artifact --root "$root" --kind draft --input "$bad_artifact" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract
    : > "$bad_artifact"
    expect_failure_preserving_file "$claude_draft_target" "empty artifact JSON" "$0" write-artifact --root "$root" --kind draft --input "$bad_artifact" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract
    expect_failure_preserving_file "$claude_draft_target" "wrong artifact kind" "$0" write-artifact --root "$root" --kind cross-review --input "$claude_draft_json" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract
    expect_failure_preserving_file "$claude_draft_target" "wrong expected system" "$0" write-artifact --root "$root" --kind draft --input "$claude_draft_json" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system codex --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract
    expect_failure_preserving_file "$claude_draft_target" "wrong expected step" "$0" write-artifact --root "$root" --kind draft --input "$claude_draft_json" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step planning --expected-iteration 1 --expected-assignment artifact-contract
    expect_failure_preserving_file "$claude_draft_target" "wrong expected iteration" "$0" write-artifact --root "$root" --kind draft --input "$claude_draft_json" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 2 --expected-assignment artifact-contract

    linked_input="$temporary/linked-artifact.json"
    ln -s -- "$claude_draft_json" "$linked_input"
    expect_failure_preserving_file "$claude_draft_target" "symbolic artifact input" "$0" write-artifact --root "$root" --kind draft --input "$linked_input" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract
    if "$0" write-artifact --root "$root" --kind draft --input "$claude_draft_json" --target ../escape.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract >/dev/null 2>&1; then self_test_fail "artifact target traversal succeeded"; fi
    [ ! -e "$worktree/.gobbi/projects/project/sessions/escape.md" ] || self_test_fail "artifact target traversal created a file"

    external_target="$temporary/external-target.md"
    artifact_backup="$temporary/claude-draft.md"
    printf '%s\n' 'external sentinel' > "$external_target"
    cp -- "$claude_draft_target" "$artifact_backup"
    rm -- "$claude_draft_target"
    ln -s -- "$external_target" "$claude_draft_target"
    expect_failure_preserving_file "$external_target" "symbolic artifact target" "$0" write-artifact --root "$root" --kind draft --input "$claude_draft_json" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract
    rm -- "$claude_draft_target"
    cp -- "$artifact_backup" "$claude_draft_target"

    jq '.subjectSystem = "claude"' "$claude_review_json" > "$bad_artifact"
    expect_failure_preserving_file "$claude_review_target" "same-system cross-review" "$0" write-artifact --root "$root" --kind cross-review --input "$bad_artifact" --target 1-ideation/working/iteration-1/cross-reviews/claude-on-codex.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract
    jq '.verdict = "REVISE"' "$claude_eval_json" > "$bad_artifact"
    expect_failure_preserving_file "$claude_eval_target" "contradictory evaluation verdict" "$0" write-artifact --root "$root" --kind evaluation-report --input "$bad_artifact" --target 1-ideation/evaluation/iteration-1/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment artifact-contract
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null

    ln -s -- "$temporary" "$root/1-ideation/working/iteration-1/research/escape"
    if "$0" verify --root "$root" --tasks "$tasks" >/dev/null 2>&1; then self_test_fail "session-tree symlink succeeded"; fi
    rm -f -- "$root/1-ideation/working/iteration-1/research/escape"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null

    local old_root old_before old_after old_count
    old_root="$worktree/.gobbi/projects/project/sessions/2026-07-20-22222222-2222-4222-8222-222222222222"
    mkdir -p -- "$old_root"
    printf '%s\n' '{"schemaVersion":4,"sentinel":"unchanged"}' > "$old_root/session.json"
    old_before="$(sha256sum "$old_root/session.json")"
    if "$0" init --root "$old_root" --session-id 22222222-2222-4222-8222-222222222222 --project project --runtime-system codex --runtime-id old --started-at 2026-07-20T00:00:00Z --branch old --worktree "$worktree" >/dev/null 2>&1; then self_test_fail "old schema init succeeded"; fi
    old_after="$(sha256sum "$old_root/session.json")"
    old_count="$(find "$old_root" -mindepth 1 | wc -l | tr -d ' ')"
    [ "$old_before" = "$old_after" ] && [ "$old_count" = "1" ] || self_test_fail "old schema init mutated the root"

    local escape_root
    escape_root="$temporary/escape"
    if "$0" init --root "$escape_root" --session-id 33333333-3333-4333-8333-333333333333 --project project --runtime-system codex --runtime-id escape --started-at 2026-07-20T00:00:00Z --branch escape --worktree "$worktree" >/dev/null 2>&1; then self_test_fail "out-of-root init succeeded"; fi
    [ ! -e "$escape_root" ] || self_test_fail "out-of-root init created a path"

    local linked_worktree linked_root linked_target
    linked_worktree="$temporary/linked-worktree"
    linked_target="$temporary/linked-sessions"
    mkdir -p -- "$linked_worktree/.gobbi/projects/project" "$linked_target"
    ln -s -- "$linked_target" "$linked_worktree/.gobbi/projects/project/sessions"
    linked_root="$linked_worktree/.gobbi/projects/project/sessions/2026-07-20-44444444-4444-4444-8444-444444444444"
    if "$0" init --root "$linked_root" --session-id 44444444-4444-4444-8444-444444444444 --project project --runtime-system codex --runtime-id linked --started-at 2026-07-20T00:00:00Z --branch linked --worktree "$linked_worktree" >/dev/null 2>&1; then self_test_fail "symlinked session parent succeeded"; fi
    [ ! -e "$linked_target/2026-07-20-44444444-4444-4444-8444-444444444444" ] || self_test_fail "symlinked parent escaped the worktree"

    exercise_runtime_workflow_fixture "$temporary" codex 55555555-5555-4555-8555-555555555555 codex-native-runtime
    exercise_runtime_workflow_fixture "$temporary" claude-code 66666666-6666-4666-8666-666666666666 claude-code-runtime

    printf 'session-record self-test: PASS\n'
}

main() {
    require_dependencies
    local command="${1:-}"
    [ -n "$command" ] || { usage; exit 2; }
    shift
    case "$command" in
        init) command_init "$@" ;;
        scaffold-tasks) command_scaffold_tasks "$@" ;;
        transition) command_transition "$@" ;;
        checkpoint) command_checkpoint "$@" ;;
        verify) command_verify "$@" ;;
        write-artifact) command_write_artifact "$@" ;;
        self-test) command_self_test "$@" ;;
        -h|--help|help) usage ;;
        *) usage; die "unknown command: $command" ;;
    esac
}

main "$@"
