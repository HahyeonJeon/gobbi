#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/$(basename "${BASH_SOURCE[0]}")"
RECORD_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
EVALUATION_SCHEMA="$RECORD_DIR/schemas/evaluation-report.schema.json"
TEMP_ROOT=""
FINDING_VERDICT_FILTER='def contributes: (.disposition == "open" or .disposition == "disputed");
def finding_verdict:
  if any(.[]; contributes and .severity == "Critical" and .confidence >= 75) then "FAIL"
  elif any(.[]; contributes and .severity == "High" and .confidence >= 50) then "REVISE"
  else "PASS" end;'

log() {
    printf 'validate-evaluation-report.sh: %s\n' "$*" >&2
}

die() {
    log "$*"
    exit 2
}

usage() {
    cat >&2 <<'EOF'
usage:
  validate-evaluation-report.sh one --report FILE --expected-system claude|codex
      --expected-step STEP --expected-iteration N --expected-assignment ID
      --expected-subject-sha256 SHA256
  validate-evaluation-report.sh pair --claude-report FILE --codex-report FILE
      --expected-step STEP --expected-iteration N --expected-assignment ID
      --expected-subject-sha256 SHA256
  validate-evaluation-report.sh self-test

`one` validates one complete independent report and emits pairComplete:false with
no aggregate verdict. `pair` requires one Claude report and one Codex report,
distinct evaluator identities, exact shared metadata, and the same subject. It
emits the pessimistic aggregate verdict and a provenance-preserving deduplicated
finding ledger. There is no missing-system waiver in this command.
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
    for dependency in awk diff grep jq jsonschema mktemp realpath sha256sum; do
        command -v "$dependency" >/dev/null 2>&1 || die "required dependency not found: $dependency"
    done
    [ -f "$EVALUATION_SCHEMA" ] || die "evaluation report schema not found: $EVALUATION_SCHEMA"
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
    [ "$actual" = "$expected" ] || die "frontmatter keys or order do not match the evaluation contract in $file"
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

evaluation_findings() {
    jq -c '.perspectives[].findings[], .overall.findings[]' "$1"
}

assert_nonempty_text() {
    local input="$1"
    jq -e '
        . as $document |
        [paths(scalars)] as $paths |
        all($paths[];
            . as $path | $document | getpath($path) as $value |
            if ($value | type) == "string" then ($value | test("\\S")) else true end)
    ' "$input" >/dev/null || die "evaluation report contains a whitespace-only string"
}

assert_finding_fingerprints() {
    local input="$1" finding declared calculated
    while IFS= read -r finding; do
        [ -n "$finding" ] || continue
        declared="$(jq -r '.fingerprint' <<<"$finding")"
        calculated="$(jq -cS '{symptom, rootCause}' <<<"$finding" | sha256sum | awk '{print $1}')"
        [ "$declared" = "$calculated" ] || die "finding fingerprint mismatch: $(jq -r '.id' <<<"$finding")"
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
    ' "$input" >/dev/null || die "perspective, finding, provenance, or checklist invariants failed"
    jq -e "$FINDING_VERDICT_FILTER
        all(.perspectives[]; .verdict == (.findings | finding_verdict)) and
        (.overall.verdict == (.overall.findings | finding_verdict)) and
        ([.perspectives[].verdict, .overall.verdict] |
            if any(.[]; . == \"FAIL\") then \"FAIL\"
            elif any(.[]; . == \"REVISE\") then \"REVISE\"
            else \"PASS\" end) == .verdict
    " "$input" >/dev/null || die "report verdict contradicts its authoritative findings"
    assert_finding_fingerprints "$input"
}

section_verdict() {
    local file="$1" section="$2"
    awk -v heading="## $section" '
        $0 == "<!-- gobbi-machine-json:v1:begin -->" {exit}
        $0 == heading {sections++; in_section = 1; next}
        in_section && /^## / {in_section = 0}
        in_section && /^VERDICT: / {
            verdicts++
            verdict = substr($0, 10)
        }
        END {
            if (sections != 1 || verdicts != 1) exit 2
            print verdict
        }
    ' "$file" || die "section $section must occur exactly once with one verdict in $file"
}

assert_human_report_shape() {
    local file="$1" embedded="$2" name expected checked_count unchecked_count findings_headings
    while IFS= read -r name; do
        expected="$(jq -r --arg name "$name" '.perspectives[] | select(.name == $name) | .verdict' "$embedded")"
        [ "$(section_verdict "$file" "$name")" = "$expected" ] || die "$name human verdict contradicts machine JSON"
    done < <(printf '%s\n' Project Structure Performance Aesthetics Usage Consistency Risk)
    [ "$(section_verdict "$file" Overall)" = "$(jq -r '.overall.verdict' "$embedded")" ] || die "Overall human verdict contradicts machine JSON"
    findings_headings="$(awk '$0 == "### Findings" {count++} END {print count + 0}' "$file")"
    [ "$findings_headings" -eq 8 ] || die "evaluation report must contain eight Findings ledgers"
    [ "$(awk '$0 == "## Evaluation Checklist" {count++} END {print count + 0}' "$file")" -eq 1 ] || die "evaluation checklist section must occur exactly once"
    checked_count="$(awk '/^- \[x\] / {count++} END {print count + 0}' "$file")"
    unchecked_count="$(awk '/^- \[ \] / {count++} END {print count + 0}' "$file")"
    [ "$unchecked_count" -eq 0 ] || die "evaluation checklist contains an incomplete item"
    [ "$checked_count" -eq "$(jq '.checklist | length' "$embedded")" ] || die "human checklist count differs from machine JSON"
}

validate_report() {
    local report="$1" expected_system="$2" expected_step="$3" expected_iteration="$4"
    local expected_assignment="$5" expected_subject="$6" embedded
    [ -f "$report" ] && [ ! -L "$report" ] || die "evaluation report is missing or not a regular file: $report"
    [ -s "$report" ] || die "evaluation report is empty: $report"
    report="$(realpath -e -- "$report")"
    embedded="$(temp_file)"
    extract_machine_json "$report" "$embedded"
    jsonschema -i "$embedded" "$EVALUATION_SCHEMA" >/dev/null 2>&1 || die "evaluation report schema validation failed: $report"
    assert_nonempty_text "$embedded"
    jq -e \
        --arg system "$expected_system" \
        --arg step "$expected_step" \
        --argjson iteration "$expected_iteration" \
        --arg assignment "$expected_assignment" \
        --arg subject "$expected_subject" '
            .kind == "evaluation-report" and
            .system == $system and
            .step == $step and
            .iteration == $iteration and
            .assignment == $assignment and
            .subjectSha256 == $subject
        ' "$embedded" >/dev/null || die "evaluation report metadata does not match the expected contract"
    assert_header_keys "$report" $'artifact-kind\nschema-version\nsystem\nstep\niteration\nassignment\nruntime-identity\nsubject-sha256\nverdict'
    [ "$(header_value "$report" artifact-kind)" = "$(jq -r '.kind' "$embedded")" ] || die "artifact-kind header mismatch"
    [ "$(header_value "$report" schema-version)" = "$(jq -r '.schemaVersion' "$embedded")" ] || die "schema-version header mismatch"
    [ "$(header_value "$report" system)" = "$(jq -r '.system' "$embedded")" ] || die "system header mismatch"
    [ "$(header_value "$report" step)" = "$(jq -r '.step' "$embedded")" ] || die "step header mismatch"
    [ "$(header_value "$report" iteration)" = "$(jq -r '.iteration' "$embedded")" ] || die "iteration header mismatch"
    [ "$(header_value "$report" assignment)" = "$(jq -r '.assignment' "$embedded")" ] || die "assignment header mismatch"
    [ "$(header_value "$report" runtime-identity)" = "$(jq -r '.runtimeIdentity' "$embedded")" ] || die "runtime identity header mismatch"
    [ "$(header_value "$report" subject-sha256)" = "$(jq -r '.subjectSha256' "$embedded")" ] || die "subject digest header mismatch"
    [ "$(header_value "$report" verdict)" = "$(jq -r '.verdict' "$embedded")" ] || die "verdict header mismatch"
    assert_evaluation_semantics "$embedded"
    assert_human_report_shape "$report" "$embedded"
    printf '%s\n' "$embedded"
}

validate_common_args() {
    local step="$1" iteration="$2" assignment="$3" subject="$4"
    case "$step" in ideation|planning|execution|wrap-up) ;; *) die "invalid expected step: $step" ;; esac
    [[ "$iteration" =~ ^[1-9][0-9]?$ ]] || die "expected iteration must be an integer from 1 through 99"
    [[ "$assignment" =~ ^[a-z0-9][a-z0-9-]{0,127}$ ]] || die "invalid expected assignment: $assignment"
    is_sha256 "$subject" || die "expected subject digest must be lowercase SHA-256"
}

command_one() {
    local report="" system="" step="" iteration="" assignment="" subject="" embedded
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --report) report="${2:-}"; shift 2 ;;
            --expected-system) system="${2:-}"; shift 2 ;;
            --expected-step) step="${2:-}"; shift 2 ;;
            --expected-iteration) iteration="${2:-}"; shift 2 ;;
            --expected-assignment) assignment="${2:-}"; shift 2 ;;
            --expected-subject-sha256) subject="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown one argument: $1" ;;
        esac
    done
    [ -n "$report" ] || die "one requires --report"
    case "$system" in claude|codex) ;; *) die "one requires a valid --expected-system" ;; esac
    validate_common_args "$step" "$iteration" "$assignment" "$subject"
    embedded="$(validate_report "$report" "$system" "$step" "$iteration" "$assignment" "$subject")"
    jq -n \
        --arg system "$system" \
        --arg verdict "$(jq -r '.verdict' "$embedded")" \
        '{schemaVersion:1, kind:"evaluation-validation", pairComplete:false, system:$system, reportVerdict:$verdict, aggregateVerdict:null}'
}

aggregate_pair() {
    local claude_json="$1" codex_json="$2" output="$3"
    local claude_verdict codex_verdict aggregate
    claude_verdict="$(jq -r '.verdict' "$claude_json")"
    codex_verdict="$(jq -r '.verdict' "$codex_json")"
    if [ "$claude_verdict" = FAIL ] || [ "$codex_verdict" = FAIL ]; then
        aggregate=FAIL
    elif [ "$claude_verdict" = REVISE ] || [ "$codex_verdict" = REVISE ]; then
        aggregate=REVISE
    else
        aggregate=PASS
    fi
    jq -e -n --slurpfile claude "$claude_json" --slurpfile codex "$codex_json" '
        [$claude[0], $codex[0]] |
        [ .[] as $report |
          ($report.perspectives[].findings[], $report.overall.findings[]) |
          {reportSystem:$report.system, reportRuntimeIdentity:$report.runtimeIdentity, finding:.}
        ] |
        sort_by(.finding.fingerprint) |
        group_by(.finding.fingerprint) |
        all(.[];
            ([.[].finding.symptom] | unique | length) == 1 and
            ([.[].finding.rootCause] | unique | length) == 1)
    ' >/dev/null || die "matching fingerprints disagree on symptom or root cause"
    jq -n -S \
        --slurpfile claude "$claude_json" \
        --slurpfile codex "$codex_json" \
        --arg aggregate "$aggregate" '
        [$claude[0], $codex[0]] as $reports |
        [ $reports[] as $report |
          ($report.perspectives[].findings[], $report.overall.findings[]) |
          {reportSystem:$report.system, reportRuntimeIdentity:$report.runtimeIdentity, finding:.}
        ] |
        sort_by(.finding.fingerprint) |
        group_by(.finding.fingerprint) |
        map({
          fingerprint: .[0].finding.fingerprint,
          symptom: .[0].finding.symptom,
          rootCause: .[0].finding.rootCause,
          provenance: ([.[].finding.provenance[]] | sort_by(.system, .runtimeIdentity, .findingId) | unique_by(.system, .runtimeIdentity, .findingId)),
          records: .
        }) as $findings |
        {
          schemaVersion: 1,
          kind: "evaluation-aggregate",
          pairComplete: true,
          aggregateVerdict: $aggregate,
          reportVerdicts: {claude:$claude[0].verdict, codex:$codex[0].verdict},
          findings: $findings
        }
    ' > "$output"
}

command_pair() {
    local claude_report="" codex_report="" step="" iteration="" assignment="" subject=""
    local claude_json codex_json output
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --claude-report) claude_report="${2:-}"; shift 2 ;;
            --codex-report) codex_report="${2:-}"; shift 2 ;;
            --expected-step) step="${2:-}"; shift 2 ;;
            --expected-iteration) iteration="${2:-}"; shift 2 ;;
            --expected-assignment) assignment="${2:-}"; shift 2 ;;
            --expected-subject-sha256) subject="${2:-}"; shift 2 ;;
            -h|--help) usage; exit 0 ;;
            *) die "unknown pair argument: $1" ;;
        esac
    done
    [ -n "$claude_report" ] || die "pair requires --claude-report"
    [ -n "$codex_report" ] || die "pair requires --codex-report"
    validate_common_args "$step" "$iteration" "$assignment" "$subject"
    claude_json="$(validate_report "$claude_report" claude "$step" "$iteration" "$assignment" "$subject")"
    codex_json="$(validate_report "$codex_report" codex "$step" "$iteration" "$assignment" "$subject")"
    [ "$(jq -r '.runtimeIdentity' "$claude_json")" != "$(jq -r '.runtimeIdentity' "$codex_json")" ] || die "evaluator runtime identities must be distinct"
    output="$(temp_file)"
    aggregate_pair "$claude_json" "$codex_json" "$output"
    cat "$output"
}

finding_fingerprint() {
    local symptom="$1" root_cause="$2"
    jq -cnS --arg symptom "$symptom" --arg rootCause "$root_cause" '{symptom:$symptom,rootCause:$rootCause}' | sha256sum | awk '{print $1}'
}

make_report_json() {
    local target="$1" system="$2" runtime="$3" verdict="$4" subject="$5"
    local severity confidence id fingerprint symptom root_cause
    symptom='The canonical artifact violates the shared obligation.'
    root_cause='The required invariant is not enforced.'
    fingerprint="$(finding_fingerprint "$symptom" "$root_cause")"
    if [ "$system" = claude ]; then id=CLAUDE-F1; else id=CODEX-F1; fi
    case "$verdict" in
        PASS) severity=Low; confidence=25 ;;
        REVISE) severity=High; confidence=75 ;;
        FAIL) severity=Critical; confidence=75 ;;
        *) die "invalid fixture verdict: $verdict" ;;
    esac
    jq -n -S \
        --arg system "$system" \
        --arg runtime "$runtime" \
        --arg verdict "$verdict" \
        --arg subject "$subject" \
        --arg id "$id" \
        --arg fingerprint "$fingerprint" \
        --arg symptom "$symptom" \
        --arg rootCause "$root_cause" \
        --arg severity "$severity" \
        --argjson confidence "$confidence" '
        ["Project", "Structure", "Performance", "Aesthetics", "Usage", "Consistency", "Risk"] as $names |
        (if $verdict == "PASS" then [] else [{
          id:$id,
          fingerprint:$fingerprint,
          perspective:"Project",
          type:"design_flaw",
          domain:"process",
          disposition:"open",
          confidence:$confidence,
          severity:$severity,
          symptom:$symptom,
          rootCause:$rootCause,
          evidence:"Frozen artifact evidence demonstrates the violation.",
          falsePositiveCheck:"The evaluator checked the governing contract and confirmed the mismatch.",
          recommendation:"Restore and verify the required invariant.",
          provenance:[{system:$system,runtimeIdentity:$runtime,findingId:$id}]
        }] end) as $project_findings |
        {
          schemaVersion:1,
          kind:"evaluation-report",
          system:$system,
          step:"ideation",
          iteration:1,
          assignment:"evaluation-contract",
          runtimeIdentity:$runtime,
          subjectSha256:$subject,
          perspectives:($names | map({
            name:.,
            summary:(. + " perspective completed against the full evidence package."),
            findings:(if . == "Project" then $project_findings else [] end),
            verdict:(if . == "Project" then $verdict else "PASS" end)
          })),
          overall:{summary:"Overall review completed across all required evidence.",findings:[],preserve:["Preserve the verified digest chain."],verdict:"PASS"},
          checklist:(["Project", "Structure", "Performance", "Aesthetics", "Usage", "Consistency", "Risk", "Overall"] | map({
            id:("CHECK-" + (ascii_upcase | gsub("[^A-Z0-9]"; "-"))),
            perspective:.,
            description:(. + " evaluation obligation completed."),
            status:(if . == "Project" and $verdict != "PASS" then "FAIL" else "PASS" end),
            evidence:(. + " evidence inspected."),
            findingIds:(if . == "Project" and $verdict != "PASS" then [$id] else [] end)
          })),
          verdict:$verdict
        }
    ' > "$target"
}

render_report_fixture() {
    local input="$1" target="$2"
    jq -r '
        def perspective_lines:
          ["## \(.name)", "", "VERDICT: \(.verdict)", "", .summary, "", "### Findings", "", "_Ledger is authoritative in machine JSON._", ""];
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
        ["## Overall", "", "VERDICT: \(.overall.verdict)", "", .overall.summary, "", "### Findings", "", "_Ledger is authoritative in machine JSON._", "", "## Evaluation Checklist", ""] +
        [.checklist[] | "- [x] `\(.id)` [\(.perspective)] \(.status): \(.description) — \(.evidence)"]
        ) | .[]
    ' "$input" > "$target"
    {
        printf '\n<!-- gobbi-machine-json:v1:begin -->\n```json\n'
        jq -S . "$input"
        printf '```\n<!-- gobbi-machine-json:v1:end -->\n'
    } >> "$target"
}

self_test_fail() {
    printf 'self-test failure: %s\n' "$*" >&2
    exit 1
}

run_one() {
    local report="$1" system="$2" subject="$3"
    "$SCRIPT_PATH" one --report "$report" --expected-system "$system" --expected-step ideation \
        --expected-iteration 1 --expected-assignment evaluation-contract --expected-subject-sha256 "$subject"
}

run_pair() {
    local claude="$1" codex="$2" subject="$3"
    "$SCRIPT_PATH" pair --claude-report "$claude" --codex-report "$codex" --expected-step ideation \
        --expected-iteration 1 --expected-assignment evaluation-contract --expected-subject-sha256 "$subject"
}

expect_one_failure() {
    local label="$1" report="$2" system="$3" subject="$4"
    if run_one "$report" "$system" "$subject" >/dev/null 2>&1; then
        self_test_fail "$label was accepted"
    fi
}

expect_pair_failure() {
    local label="$1" claude="$2" codex="$3" subject="$4"
    if run_pair "$claude" "$codex" "$subject" >/dev/null 2>&1; then
        self_test_fail "$label was accepted"
    fi
}

command_self_test() {
    local sandbox subject claude_json codex_json claude_report codex_report output aggregate
    local claude_verdict codex_verdict expected combo_json backup
    sandbox="$(temp_dir)"
    subject="$(printf '%s' 'canonical-synthesis' | sha256sum | awk '{print $1}')"
    claude_json="$sandbox/claude.json"
    codex_json="$sandbox/codex.json"
    claude_report="$sandbox/claude.md"
    codex_report="$sandbox/codex.md"
    output="$sandbox/aggregate.json"
    make_report_json "$claude_json" claude claude-evaluator-pass PASS "$subject"
    make_report_json "$codex_json" codex codex-evaluator-pass PASS "$subject"
    render_report_fixture "$claude_json" "$claude_report"
    render_report_fixture "$codex_json" "$codex_report"
    run_one "$claude_report" claude "$subject" | jq -e '.pairComplete == false and .aggregateVerdict == null and .reportVerdict == "PASS"' >/dev/null || self_test_fail "single Claude validation output"
    run_one "$codex_report" codex "$subject" | jq -e '.pairComplete == false and .aggregateVerdict == null and .reportVerdict == "PASS"' >/dev/null || self_test_fail "single Codex validation output"
    run_pair "$claude_report" "$codex_report" "$subject" > "$output"
    jq -e '.pairComplete and .aggregateVerdict == "PASS" and .findings == []' "$output" >/dev/null || self_test_fail "PASS/PASS aggregation"

    make_report_json "$claude_json" claude claude-evaluator-step-mismatch REVISE "$subject"
    jq '.perspectives[0].findings[0].domain = "step-mismatch"' "$claude_json" > "$sandbox/step-mismatch.json"
    render_report_fixture "$sandbox/step-mismatch.json" "$sandbox/step-mismatch.md"
    run_one "$sandbox/step-mismatch.md" claude "$subject" | jq -e '.reportVerdict == "REVISE"' >/dev/null || self_test_fail "step-mismatch domain was rejected"
    jq '.perspectives[0].findings[0].domain = "phase-mismatch"' "$claude_json" > "$sandbox/phase-mismatch.json"
    render_report_fixture "$sandbox/phase-mismatch.json" "$sandbox/phase-mismatch.md"
    expect_one_failure retired-phase-mismatch-domain "$sandbox/phase-mismatch.md" claude "$subject"

    for combo_json in 'PASS REVISE REVISE' 'FAIL PASS FAIL' 'PASS FAIL FAIL' 'FAIL REVISE FAIL' 'REVISE FAIL FAIL' 'FAIL FAIL FAIL'; do
        read -r claude_verdict codex_verdict expected <<<"$combo_json"
        make_report_json "$claude_json" claude "claude-evaluator-$claude_verdict" "$claude_verdict" "$subject"
        make_report_json "$codex_json" codex "codex-evaluator-$codex_verdict" "$codex_verdict" "$subject"
        render_report_fixture "$claude_json" "$claude_report"
        render_report_fixture "$codex_json" "$codex_report"
        run_pair "$claude_report" "$codex_report" "$subject" > "$output"
        aggregate="$(jq -r '.aggregateVerdict' "$output")"
        [ "$aggregate" = "$expected" ] || self_test_fail "$claude_verdict/$codex_verdict expected $expected, got $aggregate"
    done

    make_report_json "$claude_json" claude claude-evaluator-dedup REVISE "$subject"
    make_report_json "$codex_json" codex codex-evaluator-dedup REVISE "$subject"
    render_report_fixture "$claude_json" "$claude_report"
    render_report_fixture "$codex_json" "$codex_report"
    run_pair "$claude_report" "$codex_report" "$subject" > "$output"
    jq -e '(.findings | length) == 1 and (.findings[0].records | length) == 2' "$output" >/dev/null || self_test_fail "finding dedup records"
    jq -e '(.findings[0].provenance | length) == 2 and ([.findings[0].provenance[].system] | sort) == ["claude", "codex"]' "$output" >/dev/null || self_test_fail "finding provenance preservation"

    make_report_json "$claude_json" claude shared-evaluator PASS "$subject"
    make_report_json "$codex_json" codex shared-evaluator PASS "$subject"
    render_report_fixture "$claude_json" "$claude_report"
    render_report_fixture "$codex_json" "$codex_report"
    expect_pair_failure same-evaluator "$claude_report" "$codex_report" "$subject"

    make_report_json "$claude_json" claude claude-evaluator-negative PASS "$subject"
    render_report_fixture "$claude_json" "$claude_report"
    backup="$sandbox/backup.md"
    : > "$sandbox/empty.md"
    expect_one_failure empty "$sandbox/empty.md" claude "$subject"
    printf 'not markdown\n' > "$sandbox/malformed.md"
    expect_one_failure malformed "$sandbox/malformed.md" claude "$subject"
    expect_pair_failure missing-system "$claude_report" "$sandbox/missing.md" "$subject"

    cp -- "$claude_report" "$backup"
    sed -i 's/^system: claude$/system: codex/' "$claude_report"
    expect_one_failure header-system-mismatch "$claude_report" claude "$subject"
    cp -- "$backup" "$claude_report"

    cp -- "$claude_report" "$backup"
    sed -i 's/^step: ideation$/step: planning/' "$claude_report"
    expect_one_failure header-step-mismatch "$claude_report" claude "$subject"
    cp -- "$backup" "$claude_report"

    cp -- "$claude_report" "$backup"
    sed -i 's/^iteration: 1$/iteration: 2/' "$claude_report"
    expect_one_failure header-iteration-mismatch "$claude_report" claude "$subject"
    cp -- "$backup" "$claude_report"

    cp -- "$claude_report" "$backup"
    sed -i 's/^assignment: evaluation-contract$/assignment: wrong-assignment/' "$claude_report"
    expect_one_failure header-assignment-mismatch "$claude_report" claude "$subject"
    cp -- "$backup" "$claude_report"

    cp -- "$claude_report" "$backup"
    sed -i '0,/^## Project$/s//## Structure/' "$claude_report"
    expect_one_failure missing-duplicate-human-perspective "$claude_report" claude "$subject"
    cp -- "$backup" "$claude_report"

    cp -- "$claude_report" "$backup"
    sed -i '0,/^- \[x\] /s//- [ ] /' "$claude_report"
    expect_one_failure incomplete-human-checklist "$claude_report" claude "$subject"
    cp -- "$backup" "$claude_report"

    jq '.extra = true' "$claude_json" > "$sandbox/invalid.json"
    render_report_fixture "$sandbox/invalid.json" "$sandbox/invalid.md"
    expect_one_failure extra-schema-field "$sandbox/invalid.md" claude "$subject"

    jq '.verdict = "REVISE"' "$claude_json" > "$sandbox/invalid.json"
    render_report_fixture "$sandbox/invalid.json" "$sandbox/invalid.md"
    expect_one_failure contradictory-root-verdict "$sandbox/invalid.md" claude "$subject"

    make_report_json "$claude_json" claude claude-evaluator-negative REVISE "$subject"
    jq '.perspectives[0].findings[0].provenance[0].system = "codex"' "$claude_json" > "$sandbox/invalid.json"
    render_report_fixture "$sandbox/invalid.json" "$sandbox/invalid.md"
    expect_one_failure provenance-mismatch "$sandbox/invalid.md" claude "$subject"

    jq '.perspectives[0].findings[0].fingerprint = ("0" * 64)' "$claude_json" > "$sandbox/invalid.json"
    render_report_fixture "$sandbox/invalid.json" "$sandbox/invalid.md"
    expect_one_failure fingerprint-mismatch "$sandbox/invalid.md" claude "$subject"

    jq '.checklist[0].findingIds = []' "$claude_json" > "$sandbox/invalid.json"
    render_report_fixture "$sandbox/invalid.json" "$sandbox/invalid.md"
    expect_one_failure incomplete-machine-checklist "$sandbox/invalid.md" claude "$subject"

    make_report_json "$codex_json" codex codex-evaluator-negative PASS "$(printf '%s' different-subject | sha256sum | awk '{print $1}')"
    render_report_fixture "$codex_json" "$codex_report"
    make_report_json "$claude_json" claude claude-evaluator-negative PASS "$subject"
    render_report_fixture "$claude_json" "$claude_report"
    expect_pair_failure subject-mismatch "$claude_report" "$codex_report" "$subject"

    printf 'validate-evaluation-report self-test: PASS\n'
}

main() {
    require_dependencies
    TEMP_ROOT="$(mktemp -d)"
    case "${1:-}" in
        one) shift; command_one "$@" ;;
        pair) shift; command_pair "$@" ;;
        self-test) shift; [ "$#" -eq 0 ] || die "self-test accepts no arguments"; command_self_test ;;
        -h|--help) usage ;;
        *) usage; exit 2 ;;
    esac
}

main "$@"
