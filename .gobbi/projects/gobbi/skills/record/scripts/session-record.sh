#!/usr/bin/env bash

set -euo pipefail

SELF="session-record.sh"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RECORD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SESSION_SCHEMA="$RECORD_DIR/schemas/session.schema.json"
STATE_SCHEMA="$RECORD_DIR/schemas/state.schema.json"
SESSION_TEMPLATE="$RECORD_DIR/templates/session.json"
STATE_TEMPLATE="$RECORD_DIR/templates/state.json"
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
  session-record.sh write-artifact ...
  session-record.sh self-test

Patch semantics for transition and checkpoint are Gobbi object merge:
objects merge recursively; arrays, scalars, and null replace the prior value.
Both commands validate the complete candidate before atomic replacement.

Task data format:
  {"tasks":[{"number":1,"slug":"record-foundation"}]}

write-artifact is reserved for the peer-artifact implementation task and fails
closed in this foundation version.
EOF
}

require_dependencies() {
    local dependency
    for dependency in jq jsonschema realpath mktemp find diff sha256sum; do
        command -v "$dependency" >/dev/null 2>&1 || die "required dependency not found: $dependency"
    done
    [ -f "$SESSION_SCHEMA" ] || die "session schema not found: $SESSION_SCHEMA"
    [ -f "$STATE_SCHEMA" ] || die "state schema not found: $STATE_SCHEMA"
    [ -f "$SESSION_TEMPLATE" ] || die "session template not found: $SESSION_TEMPLATE"
    [ -f "$STATE_TEMPLATE" ] || die "state template not found: $STATE_TEMPLATE"
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
        jq -e \
            --arg session_id "$session_id" \
            --arg project "$project" \
            --arg started_at "$started_at" \
            --arg branch "$branch" \
            --arg worktree "$normalized_worktree" \
            --arg runtime_id "$runtime_id" '
                .sessionId == $session_id and
                .project == $project and
                .startedAt == $started_at and
                .git.branch == $branch and
                .git.worktreePath == $worktree and
                .runtime.ids[0] == $runtime_id
            ' "$normalized_root/session.json" >/dev/null || die "init arguments do not match the existing session identity"
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

assert_artifact_placement() {
    local root="$1" state="$root/state.json" file relative top task_id
    while IFS= read -r file; do
        [ -n "$file" ] || continue
        relative="${file#$root/}"
        case "$relative" in
            README.md|session.json|state.json) ;;
            1-ideation/outputs/*)
                jq -e '.completedSteps | index("ideation") != null' "$state" >/dev/null || die "Ideation output exists before PASS: $relative"
                ;;
            2-planning/outputs/*)
                jq -e '.completedSteps | index("planning") != null' "$state" >/dev/null || die "Planning output exists before PASS: $relative"
                ;;
            3-execution/outputs/*)
                jq -e '.completedSteps | index("execution") != null' "$state" >/dev/null || die "Execution output exists before PASS: $relative"
                ;;
            4-wrap-up/outputs/*)
                jq -e '.completedSteps | index("wrap-up") != null' "$state" >/dev/null || die "Wrap-up output exists before PASS: $relative"
                ;;
            3-execution/task-*/outputs/*)
                top="${relative#3-execution/task-}"
                task_id="${top%%/outputs/*}"
                jq -e --arg task "$task_id" '.completedTasks | index($task) != null' "$state" >/dev/null || die "Execution output exists before task PASS: $relative"
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
    assert_artifact_placement "$root"
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

command_self_test() {
    local temporary worktree session_id root tasks patch target_count before_tree after_tree
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

    printf '%s\n' '# premature' > "$root/1-ideation/outputs/premature.md"
    if "$0" verify --root "$root" --tasks "$tasks" >/dev/null 2>&1; then self_test_fail "PASS-only output placement failed open"; fi
    rm -f -- "$root/1-ideation/outputs/premature.md"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null
    printf '%s\n' '{"current":{"step":"planning","stage":"DISCUSSION","iteration":1},"completedSteps":["configuration","ideation"],"lastVerdict":"PASS"}' > "$patch"
    "$0" transition --root "$root" --patch "$patch" >/dev/null
    printf '%s\n' '# canonical Ideation artifact' > "$root/1-ideation/outputs/canonical.md"
    "$0" verify --root "$root" --tasks "$tasks" >/dev/null

    printf '%s\n' '# sentinel' > "$root/1-ideation/working/iteration-1/synthesis.md"
    expect_failure_preserving_file \
        "$root/1-ideation/working/iteration-1/synthesis.md" \
        "unavailable renderer" \
        "$0" write-artifact --root "$root" --input "$tasks" \
        --target 1-ideation/working/iteration-1/synthesis.md
    if "$0" write-artifact --root "$root" --input "$tasks" --target 1-ideation/outputs/test.md >/dev/null 2>&1; then self_test_fail "unavailable renderer succeeded"; fi
    [ ! -e "$root/1-ideation/outputs/test.md" ] || self_test_fail "unavailable renderer created a target"
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
        write-artifact) die "write-artifact is unavailable until peer artifact schemas and renderers are installed" ;;
        self-test) command_self_test "$@" ;;
        -h|--help|help) usage ;;
        *) usage; die "unknown command: $command" ;;
    esac
}

main "$@"
