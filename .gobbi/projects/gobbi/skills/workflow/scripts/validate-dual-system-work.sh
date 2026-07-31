#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/$(basename "${BASH_SOURCE[0]}")"
RECORD_DIR="$(cd "$SCRIPT_DIR/../../record" && pwd)"
DRAFT_SCHEMA="$RECORD_DIR/schemas/draft.schema.json"
CROSS_REVIEW_SCHEMA="$RECORD_DIR/schemas/cross-review.schema.json"
RECORD_TOOL="$RECORD_DIR/scripts/session-record.sh"
TEMP_ROOT=""

log() {
    printf 'validate-dual-system-work.sh: %s\n' "$*" >&2
}

die() {
    log "$*"
    exit 2
}

usage() {
    cat >&2 <<'EOF'
usage:
  validate-dual-system-work.sh --root ABS --step STEP --iteration N
      --assignment ID --runtime-system claude|codex [--task task-NN-slug]
  validate-dual-system-work.sh self-test

Validates one complete dual-system WORK package. Non-Execution packages are
rooted at {N}-{step}/working/iteration-{n}. Execution packages also require a
canonical --task value. Validation uses content and SHA-256 links only; file
timestamps are not evidence.
EOF
}

cleanup() {
    if [ -n "$TEMP_ROOT" ] && [ -d "$TEMP_ROOT" ]; then
        rm -rf -- "$TEMP_ROOT"
    fi
}
trap cleanup EXIT

temp_file() {
    mktemp "$TEMP_ROOT/file.XXXXXX"
}

temp_dir() {
    mktemp -d "$TEMP_ROOT/dir.XXXXXX"
}

require_dependencies() {
    local dependency
    for dependency in awk diff find grep jq jsonschema mktemp realpath sha256sum; do
        command -v "$dependency" >/dev/null 2>&1 || die "required dependency not found: $dependency"
    done
    [ -f "$DRAFT_SCHEMA" ] || die "draft schema not found: $DRAFT_SCHEMA"
    [ -f "$CROSS_REVIEW_SCHEMA" ] || die "cross-review schema not found: $CROSS_REVIEW_SCHEMA"
}

sha256_file() {
    sha256sum "$1" | awk '{print $1}'
}

is_sha256() {
    [[ "$1" =~ ^[0-9a-f]{64}$ ]]
}

header_value() {
    local file="$1" key="$2"
    awk -v key="$key" '
        NR == 1 && $0 == "---" {in_header = 1; next}
        in_header && $0 == "---" {exit}
        in_header && index($0, key ": ") == 1 {
            count++
            value = substr($0, length(key) + 3)
        }
        END {
            if (count != 1) exit 2
            print value
        }
    ' "$file" || die "frontmatter key must occur exactly once: $key in $file"
}

assert_header_keys() {
    local file="$1" expected="$2" actual
    actual="$(awk '
        NR == 1 && $0 == "---" {in_header = 1; next}
        in_header && $0 == "---" {closed = 1; exit}
        in_header {
            separator = index($0, ": ")
            if (separator == 0) exit 3
            print substr($0, 1, separator - 1)
        }
        END {if (!in_header || !closed) exit 4}
    ' "$file")" || die "malformed frontmatter in $file"
    [ "$actual" = "$expected" ] || die "frontmatter keys or order do not match the contract in $file"
}

assert_nonempty_body() {
    local file="$1"
    awk '
        NR == 1 && $0 == "---" {in_header = 1; next}
        in_header && $0 == "---" {in_header = 0; closed = 1; next}
        closed && $0 ~ /[^[:space:]]/ {content = 1}
        END {exit !(closed && content)}
    ' "$file" || die "artifact body is empty: $file"
}

extract_machine_json() {
    local source="$1" target="$2"
    awk '
        $0 == "<!-- gobbi-machine-json:v1:begin -->" {
            starts++
            if (starts != 1 || inside || closed) exit 10
            expect_open = 1
            next
        }
        expect_open {
            if ($0 != "```json") exit 11
            expect_open = 0
            inside = 1
            next
        }
        inside && $0 == "```" {
            inside = 0
            expect_end = 1
            next
        }
        expect_end {
            if ($0 != "<!-- gobbi-machine-json:v1:end -->") exit 12
            expect_end = 0
            closed = 1
            ends++
            next
        }
        inside {print}
        $0 == "<!-- gobbi-machine-json:v1:end -->" {exit 13}
        END {
            if (starts != 1 || ends != 1 || inside || expect_open || expect_end || !closed) exit 14
        }
    ' "$source" > "$target" || die "malformed machine JSON block in $source"
    jq -e . "$target" >/dev/null 2>&1 || die "malformed machine JSON in $source"
    local canonical
    canonical="$(temp_file)"
    jq -S . "$target" > "$canonical"
    diff -u "$canonical" "$target" >/dev/null || die "machine JSON is not canonical in $source"
}

assert_regular_artifact() {
    local file="$1"
    [ -f "$file" ] && [ ! -L "$file" ] || die "required artifact is missing or not a regular file: $file"
    [ -s "$file" ] || die "required artifact is empty: $file"
}

assert_rendered_artifact() {
    local file="$1" kind="$2" expected_system="$3" expected_step="$4"
    local expected_iteration="$5" expected_assignment="$6" schema embedded
    assert_regular_artifact "$file"
    case "$kind" in
        draft) schema="$DRAFT_SCHEMA" ;;
        cross-review) schema="$CROSS_REVIEW_SCHEMA" ;;
        *) die "unknown rendered artifact kind: $kind" ;;
    esac
    embedded="$(temp_file)"
    extract_machine_json "$file" "$embedded"
    jsonschema -i "$embedded" "$schema" >/dev/null 2>&1 || die "$kind schema validation failed: $file"
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
        ' "$embedded" >/dev/null || die "embedded metadata mismatch in $file"

    [ "$(header_value "$file" artifact-kind)" = "$kind" ] || die "artifact-kind header mismatch in $file"
    [ "$(header_value "$file" schema-version)" = "$(jq -r '.schemaVersion' "$embedded")" ] || die "schema-version header mismatch in $file"
    [ "$(header_value "$file" system)" = "$(jq -r '.system' "$embedded")" ] || die "system header mismatch in $file"
    [ "$(header_value "$file" step)" = "$(jq -r '.step' "$embedded")" ] || die "step header mismatch in $file"
    [ "$(header_value "$file" iteration)" = "$(jq -r '.iteration' "$embedded")" ] || die "iteration header mismatch in $file"
    [ "$(header_value "$file" assignment)" = "$(jq -r '.assignment' "$embedded")" ] || die "assignment header mismatch in $file"
    [ "$(header_value "$file" runtime-identity)" = "$(jq -r '.runtimeIdentity' "$embedded")" ] || die "runtime identity header mismatch in $file"
    [ "$(header_value "$file" contract-sha256)" = "$(jq -r '.contractSha256' "$embedded")" ] || die "contract digest header mismatch in $file"
    if [ "$kind" = "draft" ]; then
        assert_header_keys "$file" $'artifact-kind\nschema-version\nsystem\nstep\niteration\nassignment\nruntime-identity\ncontract-sha256'
    else
        assert_header_keys "$file" $'artifact-kind\nschema-version\nsystem\nstep\niteration\nassignment\nruntime-identity\ncontract-sha256\nsubject-system\nsubject-sha256\nconclusion'
        [ "$(header_value "$file" subject-system)" = "$(jq -r '.subjectSystem' "$embedded")" ] || die "subject system header mismatch in $file"
        [ "$(header_value "$file" subject-sha256)" = "$(jq -r '.subjectSha256' "$embedded")" ] || die "subject digest header mismatch in $file"
        [ "$(header_value "$file" conclusion)" = "$(jq -r '.conclusion' "$embedded")" ] || die "conclusion header mismatch in $file"
    fi
    printf '%s\n' "$embedded"
}

assert_exact_entries() {
    local directory="$1" expected="$2" actual
    actual="$(find "$directory" -mindepth 1 -maxdepth 1 -printf '%f\n' | LC_ALL=C sort)"
    expected="$(printf '%s\n' "$expected" | LC_ALL=C sort)"
    [ "$actual" = "$expected" ] || die "unexpected or missing package entries under $directory"
}

validate_synthesis() {
    local file="$1" step="$2" iteration="$3" assignment="$4"
    local claude_draft="$5" codex_draft="$6" claude_review="$7" codex_review="$8"
    local expected_system="$9" system runtime
    assert_regular_artifact "$file"
    assert_header_keys "$file" $'artifact-kind\nprotocol-stage\nsystem\nstep\niteration\nassignment\nruntime-identity\nclaude-draft-sha256\ncodex-draft-sha256\nclaude-on-codex-sha256\ncodex-on-claude-sha256'
    [ "$(header_value "$file" artifact-kind)" = synthesis ] || die "synthesis artifact-kind mismatch"
    [ "$(header_value "$file" protocol-stage)" = synthesis ] || die "synthesis protocol-stage mismatch"
    system="$(header_value "$file" system)"
    case "$system" in claude|codex) ;; *) die "invalid synthesis system: $system" ;; esac
    [ "$system" = "$expected_system" ] ||
        die "synthesis system $system does not match session runtime owner $expected_system"
    runtime="$(header_value "$file" runtime-identity)"
    [ -n "${runtime//[[:space:]]/}" ] || die "synthesis runtime identity is empty"
    [ "$(header_value "$file" step)" = "$step" ] || die "synthesis step mismatch"
    [ "$(header_value "$file" iteration)" = "$iteration" ] || die "synthesis iteration mismatch"
    [ "$(header_value "$file" assignment)" = "$assignment" ] || die "synthesis assignment mismatch"
    [ "$(header_value "$file" claude-draft-sha256)" = "$(sha256_file "$claude_draft")" ] || die "synthesis Claude draft digest mismatch"
    [ "$(header_value "$file" codex-draft-sha256)" = "$(sha256_file "$codex_draft")" ] || die "synthesis Codex draft digest mismatch"
    [ "$(header_value "$file" claude-on-codex-sha256)" = "$(sha256_file "$claude_review")" ] || die "synthesis Claude cross-review digest mismatch"
    [ "$(header_value "$file" codex-on-claude-sha256)" = "$(sha256_file "$codex_review")" ] || die "synthesis Codex cross-review digest mismatch"
    assert_nonempty_body "$file"
}

validate_open_decisions() {
    local file="$1" step="$2" iteration="$3" assignment="$4" synthesis="$5"
    assert_regular_artifact "$file"
    assert_header_keys "$file" $'artifact-kind\nprotocol-stage\nstep\niteration\nassignment\nsynthesis-sha256\nstatus\nunresolved-count'
    [ "$(header_value "$file" artifact-kind)" = open-decisions ] || die "open-decisions artifact-kind mismatch"
    [ "$(header_value "$file" protocol-stage)" = decisions-resolved ] || die "open-decisions protocol-stage mismatch"
    [ "$(header_value "$file" step)" = "$step" ] || die "open-decisions step mismatch"
    [ "$(header_value "$file" iteration)" = "$iteration" ] || die "open-decisions iteration mismatch"
    [ "$(header_value "$file" assignment)" = "$assignment" ] || die "open-decisions assignment mismatch"
    [ "$(header_value "$file" synthesis-sha256)" = "$(sha256_file "$synthesis")" ] || die "open-decisions synthesis digest mismatch"
    [ "$(header_value "$file" status)" = resolved ] || die "open decisions are not resolved"
    [ "$(header_value "$file" unresolved-count)" = 0 ] || die "open decisions remain unresolved"
    assert_nonempty_body "$file"
}

validate_peer_ephemerality() {
    local synthesis_owner="$1" claude_draft_json="$2" codex_draft_json="$3"
    local claude_review_json="$4" codex_review_json="$5"
    case "$synthesis_owner" in
        claude)
            [ "$(jq -r '.runtimeIdentity' "$codex_draft_json")" != "$(jq -r '.runtimeIdentity' "$codex_review_json")" ] ||
                die "Codex peer draft and cross-review must use distinct ephemeral runtime identities"
            ;;
        codex)
            [ "$(jq -r '.runtimeIdentity' "$claude_draft_json")" != "$(jq -r '.runtimeIdentity' "$claude_review_json")" ] ||
                die "Claude peer draft and cross-review must use distinct ephemeral runtime identities"
            ;;
        *) die "invalid validated synthesis owner: $synthesis_owner" ;;
    esac
}

package_prefix() {
    local step="$1" task="$2"
    case "$step" in
        ideation) [ -z "$task" ] || die "--task is only valid for Execution"; printf '1-ideation\n' ;;
        planning) [ -z "$task" ] || die "--task is only valid for Execution"; printf '2-planning\n' ;;
        wrap-up) [ -z "$task" ] || die "--task is only valid for Execution"; printf '4-wrap-up\n' ;;
        execution)
            [[ "$task" =~ ^task-[0-9]{2}-[a-z0-9]+(-[a-z0-9]+)*$ ]] || die "Execution requires canonical --task task-NN-slug"
            printf '3-execution/%s\n' "$task"
            ;;
        *) die "invalid workflow step: $step" ;;
    esac
}

command_validate() {
    local root="" step="" iteration="" assignment="" task="" runtime_system=""
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --root) root="${2:-}"; shift 2 ;;
            --step) step="${2:-}"; shift 2 ;;
            --iteration) iteration="${2:-}"; shift 2 ;;
            --assignment) assignment="${2:-}"; shift 2 ;;
            --runtime-system) runtime_system="${2:-}"; shift 2 ;;
            --task) task="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown argument: $1" ;;
        esac
    done
    [ -n "$root" ] || die "--root is required"
    [ -n "$step" ] || die "--step is required"
    [[ "$iteration" =~ ^[1-9][0-9]?$ ]] || die "--iteration must be an integer from 1 through 99"
    [[ "$assignment" =~ ^[a-z0-9][a-z0-9-]{0,127}$ ]] || die "invalid --assignment: $assignment"
    case "$runtime_system" in claude|codex) ;; *) die "--runtime-system must be claude or codex" ;; esac
    case "$root" in /*) ;; *) die "--root must be absolute" ;; esac
    [ -d "$root" ] && [ ! -L "$root" ] || die "session root is missing or symbolic: $root"
    root="$(realpath -e -- "$root")"

    local prefix package claude_draft codex_draft claude_review codex_review synthesis decisions
    local claude_json codex_json claude_review_json codex_review_json contract synthesis_owner
    synthesis_owner="$runtime_system"
    prefix="$(package_prefix "$step" "$task")"
    package="$root/$prefix/working/iteration-$iteration"
    [ -d "$package" ] && [ ! -L "$package" ] || die "WORK package directory is missing: $package"
    [ "$(realpath -e -- "$package")" = "$package" ] || die "WORK package resolves through a symbolic link"
    if find "$package" -type l -print -quit | grep -q .; then
        die "symbolic links are forbidden in the WORK package"
    fi
    assert_exact_entries "$package" $'cross-reviews\ndrafts\nopen-decisions.md\nresearch\nsynthesis.md'
    assert_exact_entries "$package/drafts" $'claude.md\ncodex.md'
    assert_exact_entries "$package/cross-reviews" $'claude-on-codex.md\ncodex-on-claude.md'
    [ -d "$package/research" ] || die "research directory is missing"

    claude_draft="$package/drafts/claude.md"
    codex_draft="$package/drafts/codex.md"
    claude_review="$package/cross-reviews/claude-on-codex.md"
    codex_review="$package/cross-reviews/codex-on-claude.md"
    synthesis="$package/synthesis.md"
    decisions="$package/open-decisions.md"
    claude_json="$(assert_rendered_artifact "$claude_draft" draft claude "$step" "$iteration" "$assignment")"
    codex_json="$(assert_rendered_artifact "$codex_draft" draft codex "$step" "$iteration" "$assignment")"
    claude_review_json="$(assert_rendered_artifact "$claude_review" cross-review claude "$step" "$iteration" "$assignment")"
    codex_review_json="$(assert_rendered_artifact "$codex_review" cross-review codex "$step" "$iteration" "$assignment")"

    contract="$(jq -r '.contractSha256' "$claude_json")"
    is_sha256 "$contract" || die "invalid shared contract digest"
    [ "$(jq -r '.contractSha256' "$codex_json")" = "$contract" ] || die "draft contract digests differ"
    [ "$(jq -r '.contractSha256' "$claude_review_json")" = "$contract" ] || die "Claude review contract digest differs"
    [ "$(jq -r '.contractSha256' "$codex_review_json")" = "$contract" ] || die "Codex review contract digest differs"
    [ "$(jq -r '.runtimeIdentity' "$claude_json")" != "$(jq -r '.runtimeIdentity' "$codex_json")" ] || die "draft runtime identities are not independent"
    [ "$(jq -r '.subjectSystem' "$claude_review_json")" = codex ] || die "Claude review does not review Codex"
    [ "$(jq -r '.subjectSha256' "$claude_review_json")" = "$(sha256_file "$codex_draft")" ] || die "Claude review does not bind the frozen Codex draft"
    [ "$(jq -r '.subjectSystem' "$codex_review_json")" = claude ] || die "Codex review does not review Claude"
    [ "$(jq -r '.subjectSha256' "$codex_review_json")" = "$(sha256_file "$claude_draft")" ] || die "Codex review does not bind the frozen Claude draft"

    validate_synthesis "$synthesis" "$step" "$iteration" "$assignment" "$claude_draft" "$codex_draft" "$claude_review" "$codex_review" "$synthesis_owner"
    validate_peer_ephemerality "$synthesis_owner" "$claude_json" "$codex_json" "$claude_review_json" "$codex_review_json"
    validate_open_decisions "$decisions" "$step" "$iteration" "$assignment" "$synthesis"
    log "PASS $step iteration $iteration assignment $assignment"
}

write_synthesis_fixture() {
    local package="$1" system="$2" runtime="$3" step="$4" iteration="$5" assignment="$6"
    printf '%s\n' \
        '---' \
        'artifact-kind: synthesis' \
        'protocol-stage: synthesis' \
        "system: $system" \
        "step: $step" \
        "iteration: $iteration" \
        "assignment: $assignment" \
        "runtime-identity: $runtime" \
        "claude-draft-sha256: $(sha256_file "$package/drafts/claude.md")" \
        "codex-draft-sha256: $(sha256_file "$package/drafts/codex.md")" \
        "claude-on-codex-sha256: $(sha256_file "$package/cross-reviews/claude-on-codex.md")" \
        "codex-on-claude-sha256: $(sha256_file "$package/cross-reviews/codex-on-claude.md")" \
        '---' '' '# Synthesis' '' 'Canonical candidate from both drafts and both reciprocal reviews.' \
        > "$package/synthesis.md"
}

write_decisions_fixture() {
    local package="$1" step="$2" iteration="$3" assignment="$4"
    printf '%s\n' \
        '---' \
        'artifact-kind: open-decisions' \
        'protocol-stage: decisions-resolved' \
        "step: $step" \
        "iteration: $iteration" \
        "assignment: $assignment" \
        "synthesis-sha256: $(sha256_file "$package/synthesis.md")" \
        'status: resolved' \
        'unresolved-count: 0' \
        '---' '' '# Open decisions' '' 'No unresolved material decisions.' \
        > "$package/open-decisions.md"
}

self_test_fail() {
    printf 'self-test failure: %s\n' "$*" >&2
    exit 1
}

expect_validation_failure() {
    local label="$1" root="$2" runtime_system="$3"
    if "$SCRIPT_PATH" --root "$root" --step ideation --iteration 1 --assignment dual-package \
        --runtime-system "$runtime_system" >/dev/null 2>&1; then
        self_test_fail "$label was accepted"
    fi
}

command_self_test() {
    local sandbox worktree uuid root package contract claude_digest codex_digest evidence_root
    local claude_worktree claude_uuid claude_root claude_package
    local backup target
    sandbox="$(temp_dir)"
    worktree="$sandbox/worktree"
    uuid=22222222-2222-4222-8222-222222222222
    root="$worktree/.gobbi/projects/gobbi/sessions/2026-07-20-$uuid"
    mkdir -p "$worktree"
    "$RECORD_TOOL" init --root "$root" --session-id "$uuid" --project gobbi \
        --runtime-system codex --runtime-id dual-work-self-test --started-at 2026-07-20T00:00:00Z \
        --branch dual-work-self-test --worktree "$worktree" >/dev/null
    package="$root/1-ideation/working/iteration-1"
    contract="$(printf '%s' 'dual-package-contract' | sha256sum | awk '{print $1}')"

    jq -n --arg contract "$contract" '{schemaVersion:1,kind:"draft",system:"claude",step:"ideation",iteration:1,assignment:"dual-package",runtimeIdentity:"claude-draft-self-test",contractSha256:$contract,title:"Claude draft",summary:"Independent Claude draft.",content:"Claude candidate content."}' > "$sandbox/claude-draft.json"
    jq -n --arg contract "$contract" '{schemaVersion:1,kind:"draft",system:"codex",step:"ideation",iteration:1,assignment:"dual-package",runtimeIdentity:"codex-draft-self-test",contractSha256:$contract,title:"Codex draft",summary:"Independent Codex draft.",content:"Codex candidate content."}' > "$sandbox/codex-draft.json"
    "$RECORD_TOOL" write-artifact --root "$root" --kind draft --input "$sandbox/claude-draft.json" --target 1-ideation/working/iteration-1/drafts/claude.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment dual-package >/dev/null
    "$RECORD_TOOL" write-artifact --root "$root" --kind draft --input "$sandbox/codex-draft.json" --target 1-ideation/working/iteration-1/drafts/codex.md --expected-system codex --expected-step ideation --expected-iteration 1 --expected-assignment dual-package >/dev/null
    claude_digest="$(sha256_file "$package/drafts/claude.md")"
    codex_digest="$(sha256_file "$package/drafts/codex.md")"
    jq -n --arg contract "$contract" --arg subject "$codex_digest" '{schemaVersion:1,kind:"cross-review",system:"claude",step:"ideation",iteration:1,assignment:"dual-package",runtimeIdentity:"claude-review-self-test",contractSha256:$contract,subjectSystem:"codex",subjectSha256:$subject,conclusion:"accept",summary:"Claude review of the frozen Codex draft.",findings:[]}' > "$sandbox/claude-review.json"
    jq -n --arg contract "$contract" --arg subject "$claude_digest" '{schemaVersion:1,kind:"cross-review",system:"codex",step:"ideation",iteration:1,assignment:"dual-package",runtimeIdentity:"codex-review-self-test",contractSha256:$contract,subjectSystem:"claude",subjectSha256:$subject,conclusion:"accept",summary:"Codex review of the frozen Claude draft.",findings:[]}' > "$sandbox/codex-review.json"
    "$RECORD_TOOL" write-artifact --root "$root" --kind cross-review --input "$sandbox/claude-review.json" --target 1-ideation/working/iteration-1/cross-reviews/claude-on-codex.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment dual-package >/dev/null
    "$RECORD_TOOL" write-artifact --root "$root" --kind cross-review --input "$sandbox/codex-review.json" --target 1-ideation/working/iteration-1/cross-reviews/codex-on-claude.md --expected-system codex --expected-step ideation --expected-iteration 1 --expected-assignment dual-package >/dev/null
    write_synthesis_fixture "$package" codex codex-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$package" ideation 1 dual-package
    command_validate --root "$root" --step ideation --iteration 1 --assignment dual-package --runtime-system codex

    write_synthesis_fixture "$package" claude claude-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$package" ideation 1 dual-package
    expect_validation_failure codex-session-claude-owner "$root" codex

    write_synthesis_fixture "$package" codex codex-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$package" ideation 1 dual-package
    jq '.runtimeIdentity = "claude-draft-self-test"' "$sandbox/claude-review.json" > "$sandbox/reused-claude-review.json"
    "$RECORD_TOOL" write-artifact --root "$root" --kind cross-review --input "$sandbox/reused-claude-review.json" --target 1-ideation/working/iteration-1/cross-reviews/claude-on-codex.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment dual-package >/dev/null
    write_synthesis_fixture "$package" codex codex-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$package" ideation 1 dual-package
    expect_validation_failure codex-owned-reused-claude-peer-identity "$root" codex
    "$RECORD_TOOL" write-artifact --root "$root" --kind cross-review --input "$sandbox/claude-review.json" --target 1-ideation/working/iteration-1/cross-reviews/claude-on-codex.md --expected-system claude --expected-step ideation --expected-iteration 1 --expected-assignment dual-package >/dev/null

    claude_worktree="$sandbox/claude-worktree"
    claude_uuid=33333333-3333-4333-8333-333333333333
    claude_root="$claude_worktree/.gobbi/projects/gobbi/sessions/2026-07-20-$claude_uuid"
    mkdir -p "$claude_worktree"
    "$RECORD_TOOL" init --root "$claude_root" --session-id "$claude_uuid" --project gobbi \
        --runtime-system claude-code --runtime-id dual-work-claude-self-test --started-at 2026-07-20T00:00:00Z \
        --branch dual-work-claude-self-test --worktree "$claude_worktree" >/dev/null
    claude_package="$claude_root/1-ideation/working/iteration-1"
    cp -- "$package/drafts/claude.md" "$claude_package/drafts/claude.md"
    cp -- "$package/drafts/codex.md" "$claude_package/drafts/codex.md"
    cp -- "$package/cross-reviews/claude-on-codex.md" "$claude_package/cross-reviews/claude-on-codex.md"
    cp -- "$package/cross-reviews/codex-on-claude.md" "$claude_package/cross-reviews/codex-on-claude.md"
    write_synthesis_fixture "$claude_package" claude claude-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$claude_package" ideation 1 dual-package
    command_validate --root "$claude_root" --step ideation --iteration 1 --assignment dual-package --runtime-system claude

    write_synthesis_fixture "$claude_package" codex codex-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$claude_package" ideation 1 dual-package
    expect_validation_failure claude-session-codex-owner "$claude_root" claude

    write_synthesis_fixture "$claude_package" claude claude-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$claude_package" ideation 1 dual-package
    jq '.runtimeIdentity = "codex-draft-self-test"' "$sandbox/codex-review.json" > "$sandbox/reused-codex-review.json"
    "$RECORD_TOOL" write-artifact --root "$claude_root" --kind cross-review --input "$sandbox/reused-codex-review.json" --target 1-ideation/working/iteration-1/cross-reviews/codex-on-claude.md --expected-system codex --expected-step ideation --expected-iteration 1 --expected-assignment dual-package >/dev/null
    write_synthesis_fixture "$claude_package" claude claude-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$claude_package" ideation 1 dual-package
    expect_validation_failure claude-owned-reused-codex-peer-identity "$claude_root" claude

    write_synthesis_fixture "$package" codex codex-synthesis-self-test ideation 1 dual-package
    write_decisions_fixture "$package" ideation 1 dual-package

    backup="$sandbox/artifact.backup"
    target="$package/drafts/claude.md"
    cp -- "$target" "$backup"
    : > "$target"
    expect_validation_failure empty "$root" codex
    cp -- "$backup" "$target"

    mv -- "$package/drafts/codex.md" "$sandbox/codex.md"
    expect_validation_failure missing "$root" codex
    mv -- "$sandbox/codex.md" "$package/drafts/codex.md"

    printf 'unexpected\n' > "$package/drafts/extra.md"
    expect_validation_failure extra "$root" codex
    rm -- "$package/drafts/extra.md"

    target="$package/drafts/claude.md"
    cp -- "$target" "$backup"
    sed -i 's/^system: claude$/system: codex/' "$target"
    expect_validation_failure mislabeled "$root" codex
    cp -- "$backup" "$target"

    target="$package/cross-reviews/claude-on-codex.md"
    cp -- "$target" "$backup"
    sed -i 's/^iteration: 1$/iteration: 2/' "$target"
    expect_validation_failure stale-iteration "$root" codex
    cp -- "$backup" "$target"

    cp -- "$target" "$backup"
    sed -i 's/subject-system: codex/subject-system: claude/; s/"subjectSystem": "codex"/"subjectSystem": "claude"/' "$target"
    expect_validation_failure same-author "$root" codex
    cp -- "$backup" "$target"

    target="$package/synthesis.md"
    cp -- "$target" "$backup"
    sed -i 's/^claude-draft-sha256: ./claude-draft-sha256: 0/' "$target"
    expect_validation_failure wrong-digest "$root" codex
    cp -- "$backup" "$target"

    target="$package/open-decisions.md"
    cp -- "$target" "$backup"
    sed -i 's/^status: resolved$/status: open/' "$target"
    expect_validation_failure unresolved "$root" codex
    cp -- "$backup" "$target"

    mv -- "$package/cross-reviews/claude-on-codex.md" "$sandbox/claude-on-codex.md"
    mv -- "$package/cross-reviews/codex-on-claude.md" "$sandbox/codex-on-claude.md"
    expect_validation_failure synthesis-before-cross-reviews "$root" codex
    mv -- "$sandbox/claude-on-codex.md" "$package/cross-reviews/claude-on-codex.md"
    mv -- "$sandbox/codex-on-claude.md" "$package/cross-reviews/codex-on-claude.md"

    command_validate --root "$root" --step ideation --iteration 1 --assignment dual-package --runtime-system codex
    evidence_root="$sandbox/evidence-root"
    mkdir -p "$evidence_root/1-ideation/working"
    cp -R -- "$package" "$evidence_root/1-ideation/working/iteration-1"
    command_validate --root "$evidence_root" --step ideation --iteration 1 \
        --assignment dual-package --runtime-system codex
    printf 'validate-dual-system-work self-test: PASS\n'
}

main() {
    require_dependencies
    TEMP_ROOT="$(mktemp -d)"
    if [ "${1:-}" = self-test ]; then
        shift
        [ "$#" -eq 0 ] || die "self-test accepts no arguments"
        command_self_test
    else
        command_validate "$@"
    fi
}

main "$@"
