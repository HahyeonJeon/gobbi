#!/usr/bin/env bash

set -euo pipefail

readonly SELF="scripts/check-startup-contract.sh"
readonly STARTUP_REL=".gobbi/projects/gobbi/skills/startup"
readonly EXPECTED_LEDGER_HEADER=$'old_level\told_phase\told_alias\tdisposition\tnew_phase\tnew_level\tnew_alias\towner\tpurpose\toracle\treason'

failures=()

fail() {
    failures+=("FAIL: $1: $2: $3")
}

fatal() {
    printf 'FAIL: %s: %s: %s\n' "$1" "$2" "$3"
    exit 2
}

relative_path() {
    local path="$1"
    if [[ "$path" == "$repo_root" ]]; then
        printf '.'
    elif [[ "$path" == "$repo_root/"* ]]; then
        printf '%s' "${path#"$repo_root/"}"
    else
        printf '%s' "$path"
    fi
}

trim() {
    local value="$1"
    value="${value#"${value%%[![:space:]]*}"}"
    value="${value%"${value##*[![:space:]]}"}"
    printf '%s' "$value"
}

if (( $# != 0 )); then
    fatal "$SELF" "arguments" "positional arguments are not supported"
fi

if [[ ${GOBBI_STARTUP_CHECK_REPO_ROOT+x} == x ]]; then
    [[ -n "$GOBBI_STARTUP_CHECK_REPO_ROOT" ]] || \
        fatal 'GOBBI_STARTUP_CHECK_REPO_ROOT' 'repository root' 'injected root is absent'
    [[ "$GOBBI_STARTUP_CHECK_REPO_ROOT" == /* ]] || \
        fatal "$GOBBI_STARTUP_CHECK_REPO_ROOT" 'repository root' 'injected root must be absolute'
    repo_root="${GOBBI_STARTUP_CHECK_REPO_ROOT%/}"
else
    script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)" || \
        fatal "$SELF" 'repository root' 'cannot resolve checker directory'
    repo_root="$(cd -- "$script_dir/.." && pwd -P)" || \
        fatal "$SELF" 'repository root' 'cannot resolve repository root'
fi

[[ -d "$repo_root" ]] || fatal "$repo_root" 'repository root' 'directory is absent'

startup_root="$repo_root/$STARTUP_REL"
skill_file="$startup_root/SKILL.md"
topics_root="$startup_root/topics"
templates_root="$startup_root/templates"
ledger_file="$topics_root/alias-migration.tsv"
working_template="$templates_root/startup.tmp.md"
synthesis_template="$templates_root/startup.md"
link_checker="$repo_root/scripts/check-markdown-links.sh"

[[ -r "$skill_file" ]] || fatal "$(relative_path "$skill_file")" 'registry owner' 'Startup SKILL.md is absent or unreadable'
[[ -d "$topics_root" && -r "$topics_root" ]] || fatal "$(relative_path "$topics_root")" 'topic owner' 'topic directory is absent or unreadable'
[[ -d "$templates_root" && -r "$templates_root" ]] || fatal "$(relative_path "$templates_root")" 'template owner' 'template directory is absent or unreadable'
[[ -r "$link_checker" ]] || fatal "$(relative_path "$link_checker")" 'Markdown link owner' 'checker is absent or unreadable'

registry_rows=()
while IFS= read -r row; do
    registry_rows+=("$row")
done < <(
    awk -F '|' '
        /^\| Order \| Stable key \| Title \| Direct topic entry \| Aggregate template \| Durable artifact \| Direct dependencies \|$/ {
            in_registry = 1
            next
        }
        in_registry && /^\|---/ { next }
        in_registry && /^\|/ {
            order = $2
            key = $3
            title = $4
            topic = $5
            template = $6
            durable = $7
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", order)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", key)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", title)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", topic)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", template)
            gsub(/^[[:space:]]+|[[:space:]]+$/, "", durable)
            gsub(/`/, "", order)
            gsub(/`/, "", key)
            gsub(/`/, "", durable)
            if (match(topic, /\]\([^)]*\)/)) {
                topic = substr(topic, RSTART + 2, RLENGTH - 3)
            } else {
                topic = ""
            }
            if (match(template, /\]\([^)]*\)/)) {
                template = substr(template, RSTART + 2, RLENGTH - 3)
            } else {
                template = ""
            }
            print order "\t" key "\t" title "\t" topic "\t" template "\t" durable
            next
        }
        in_registry { exit }
    ' "$skill_file"
)

(( ${#registry_rows[@]} > 0 )) || \
    fatal "$(relative_path "$skill_file")" 'static phase registry' 'registry is absent or cannot be parsed'

declare -a registry_orders=() registry_keys=() registry_titles=() registry_topics=() registry_templates=() registry_durables=()
declare -A seen_orders=() seen_keys=() seen_durables=() active_aliases=() active_triples=() ledger_aliases=()

for row in "${registry_rows[@]}"; do
    IFS=$'\t' read -r order key title topic template durable <<< "$row"
    registry_orders+=("$order")
    registry_keys+=("$key")
    registry_titles+=("$title")
    registry_topics+=("$topic")
    registry_templates+=("$template")
    registry_durables+=("$durable")

    if [[ -z "$order" || -z "$key" || -z "$title" || -z "$topic" || -z "$template" || -z "$durable" ]]; then
        fail "$(relative_path "$skill_file")" 'static phase registry' 'a registry row has an empty required field'
    fi
    if [[ -n "$order" ]]; then
        if [[ -n ${seen_orders[$order]+x} ]]; then
            fail "$(relative_path "$skill_file")" 'static phase registry' "duplicate phase order '$order'"
        fi
        seen_orders[$order]=1
    fi
    if [[ -n "$key" ]]; then
        if [[ -n ${seen_keys[$key]+x} ]]; then
            fail "$(relative_path "$skill_file")" 'static phase registry' "duplicate phase key '$key'"
        fi
        seen_keys[$key]=1
    fi
    if [[ -n "$durable" ]]; then
        if [[ -n ${seen_durables[$durable]+x} ]]; then
            fail "$(relative_path "$skill_file")" 'static phase registry' "duplicate durable artifact '$durable'"
        fi
        seen_durables[$durable]=1
    fi
done

if (( ${#registry_rows[@]} != 5 )); then
    fail "$(relative_path "$skill_file")" 'static phase registry' "expected 5 phases, found ${#registry_rows[@]}"
fi

for index in "${!registry_rows[@]}"; do
    expected_order=$((index + 1))
    if [[ "${registry_orders[$index]}" != "$expected_order" ]]; then
        fail "$(relative_path "$skill_file")" 'static phase registry' "row $((index + 1)) has order '${registry_orders[$index]}', expected '$expected_order'"
    fi

    topic_path="$startup_root/${registry_topics[$index]}"
    template_path="$startup_root/${registry_templates[$index]}"
    [[ -f "$topic_path" && -r "$topic_path" ]] || \
        fail "$(relative_path "$topic_path")" 'direct topic entry' "declared phase '${registry_keys[$index]}' entry is absent or unreadable"
    [[ -f "$template_path" && -r "$template_path" ]] || \
        fail "$(relative_path "$template_path")" 'aggregate template' "declared phase '${registry_keys[$index]}' template is absent or unreadable"
done

grep -Fq -- '- Schema 4 has exactly six durable files:' "$skill_file" || \
    fail "$(relative_path "$skill_file")" 'durable artifact count' 'schema 4 must declare exactly six durable files'

legacy_violations=()
while IFS= read -r violation; do
    legacy_violations+=("$violation")
done < <(
    awk '
        /- Schema 3 has exactly/ { legacy_definition = 1 }
        /- Classify the directory/ { legacy_definition = 0 }
        /- A confirmed schema-3 legacy result/ { legacy_proof = 1 }
        legacy_proof && /^- For a nonterminal schema-4 action/ { legacy_proof = 0 }
        /lifecycle-and-use-cases\.md/ {
            classifier = ($0 ~ /Complete confirmed schema 3/ || $0 ~ /Any schema-3 temporary/)
            if (!legacy_definition && !legacy_proof && !classifier) print NR ":" $0
        }
    ' "$skill_file"
    grep -RIn --include='*.md' 'lifecycle-and-use-cases\.md' "$topics_root" "$templates_root" 2>/dev/null || true
)
for violation in "${legacy_violations[@]}"; do
    line_number="${violation%%:*}"
    fail "$(relative_path "$skill_file"):$line_number" 'legacy artifact reference' 'combined lifecycle artifact is current-schema content'
done

extract_markdown_targets() {
    local file="$1"
    grep -oE '\]\([^)]*\.md([#?][^)]*)?\)' "$file" 2>/dev/null \
        | sed -E 's/^\]\(//; s/\)$//; s/[#?].*$//' || true
}

topic_files=()
for index in "${!registry_rows[@]}"; do
    direct_path="$startup_root/${registry_topics[$index]}"
    [[ -f "$direct_path" ]] || continue
    topic_files+=("$direct_path")
    overlay_count=0
    while IFS= read -r target; do
        [[ "$target" == "${registry_keys[$index]}/"*.md ]] || continue
        overlay_path="$(dirname -- "$direct_path")/$target"
        topic_files+=("$overlay_path")
        overlay_count=$((overlay_count + 1))
        [[ -f "$overlay_path" && -r "$overlay_path" ]] || \
            fail "$(relative_path "$overlay_path")" 'overlay topic entry' "declared by '${registry_topics[$index]}' but absent or unreadable"
    done < <(extract_markdown_targets "$direct_path")

    case "${registry_keys[$index]}" in
        product-lifecycle)
            (( overlay_count == 7 )) || fail "$(relative_path "$direct_path")" 'overlay bank count' "expected 7 Product Lifecycle overlays, found $overlay_count"
            ;;
        development-lifecycle)
            (( overlay_count == 5 )) || fail "$(relative_path "$direct_path")" 'overlay bank count' "expected 5 Development Lifecycle overlays, found $overlay_count"
            ;;
        *)
            (( overlay_count == 0 )) || fail "$(relative_path "$direct_path")" 'overlay ownership' 'non-lifecycle registry entry declares an overlay bank'
            ;;
    esac
done

physical_topic_count="$(find "$topics_root" -type f -name '*.md' | wc -l | tr -d '[:space:]')"
if [[ "$physical_topic_count" != 17 ]]; then
    fail "$(relative_path "$topics_root")" 'topic inventory' "expected 17 topic Markdown files, found $physical_topic_count"
fi

physical_template_count="$(find "$templates_root" -maxdepth 1 -type f -name '*.md' | wc -l | tr -d '[:space:]')"
if [[ "$physical_template_count" != 7 ]]; then
    fail "$(relative_path "$templates_root")" 'template inventory' "expected 7 current template files, found $physical_template_count"
fi
if [[ -e "$templates_root/lifecycle-and-use-cases.md" || -L "$templates_root/lifecycle-and-use-cases.md" ]]; then
    fail "$(relative_path "$templates_root/lifecycle-and-use-cases.md")" 'legacy template' 'combined lifecycle template must not exist in the current canonical tree'
fi

for topic_file in "${topic_files[@]}"; do
    [[ -f "$topic_file" ]] || continue
    topic_rel="$(relative_path "$topic_file")"
    for heading in '## Project' '## Product' '## Implementation'; do
        grep -Fqx "$heading" "$topic_file" || fail "$topic_rel" 'topic section structure' "missing exact heading '$heading'"
    done

    while IFS=$'\t' read -r alias owner purpose oracle; do
        [[ -n "$alias" ]] || continue
        if [[ -z "$owner" || -z "$purpose" || -z "$oracle" ]]; then
            fail "$topic_rel" 'question metadata' "alias '$alias' is missing Owner, Purpose, or Oracle"
            continue
        fi
        if [[ -n ${active_aliases[$alias]+x} ]]; then
            fail "$topic_rel" 'active alias owner' "alias '$alias' is already owned by ${active_aliases[$alias]}"
        else
            active_aliases[$alias]="$topic_rel"
        fi
        triple="$owner | $purpose | $oracle"
        if [[ -n ${active_triples[$triple]+x} ]]; then
            fail "$topic_rel" 'question semantic owner' "owner-purpose-oracle triple duplicates alias '${active_triples[$triple]}'"
        else
            active_triples[$triple]="$alias"
        fi
    done < <(
        awk '
            function flush() {
                if (alias != "") print alias "\t" owner "\t" purpose "\t" oracle
                alias = owner = purpose = oracle = ""
            }
            /^- \[[^]]+\]/ {
                flush()
                line = $0
                sub(/^- \[/, "", line)
                sub(/\].*$/, "", line)
                alias = line
                next
            }
            alias != "" && /^  - \*\*Owner:\*\*/ {
                line = $0
                sub(/^  - \*\*Owner:\*\*[[:space:]]*/, "", line)
                owner = line
                next
            }
            alias != "" && /^  - \*\*Purpose:\*\*/ {
                line = $0
                sub(/^  - \*\*Purpose:\*\*[[:space:]]*/, "", line)
                purpose = line
                next
            }
            alias != "" && /^  - \*\*Oracle:\*\*/ {
                line = $0
                sub(/^  - \*\*Oracle:\*\*[[:space:]]*/, "", line)
                oracle = line
                next
            }
            END { flush() }
        ' "$topic_file"
    )
done

if [[ ! -r "$ledger_file" ]]; then
    fail "$(relative_path "$ledger_file")" 'alias migration ledger' 'ledger is absent or unreadable'
else
    IFS= read -r ledger_header < "$ledger_file" || true
    [[ "$ledger_header" == "$EXPECTED_LEDGER_HEADER" ]] || \
        fail "$(relative_path "$ledger_file")" 'ledger header' 'header does not match the canonical 11-column schema'

    ledger_line=1
    while IFS= read -r ledger_row; do
        ledger_line=$((ledger_line + 1))
        tab_count="$(awk -F '\t' '{ print NF - 1 }' <<< "$ledger_row")"
        if [[ "$tab_count" != 10 ]]; then
            fail "$(relative_path "$ledger_file"):$ledger_line" 'ledger columns' "expected 11 columns, found $((tab_count + 1))"
            continue
        fi
        encoded_row="${ledger_row//$'\t'/$'\x1f'}"
        IFS=$'\x1f' read -r -a ledger_columns <<< "$encoded_row"
        old_alias="${ledger_columns[2]:-}"
        disposition="${ledger_columns[3]:-}"
        new_alias="${ledger_columns[6]:-}"
        reason="${ledger_columns[10]:-}"
        [[ -n "$old_alias" ]] || {
            fail "$(relative_path "$ledger_file"):$ledger_line" 'old alias' 'old_alias is empty'
            continue
        }
        if [[ -n ${ledger_aliases[$old_alias]+x} ]]; then
            fail "$(relative_path "$ledger_file"):$ledger_line" 'old alias' "duplicate migration row for '$old_alias'"
        fi
        ledger_aliases[$old_alias]=1
        case "$disposition" in
            retained|merged)
                [[ -n "$new_alias" ]] || fail "$(relative_path "$ledger_file"):$ledger_line" 'migration disposition' "'$old_alias' has no destination alias"
                [[ -n ${active_aliases[$new_alias]+x} ]] || fail "$(relative_path "$ledger_file"):$ledger_line" 'migration destination' "'$new_alias' is not an active alias"
                ;;
            excluded)
                [[ -n "$reason" ]] || fail "$(relative_path "$ledger_file"):$ledger_line" 'migration reason' "excluded alias '$old_alias' has no reason"
                ;;
            *)
                fail "$(relative_path "$ledger_file"):$ledger_line" 'migration disposition' "'$old_alias' has missing or invalid disposition '$disposition'"
                ;;
        esac
    done < <(tail -n +2 "$ledger_file")
fi

for index in "${!registry_rows[@]}"; do
    template_path="$startup_root/${registry_templates[$index]}"
    [[ -f "$template_path" ]] || continue
    template_rel="$(relative_path "$template_path")"
    for heading in '## Section Register' '## Project' '## Products' '## Implementations'; do
        grep -Fqx "$heading" "$template_path" || fail "$template_rel" 'aggregate section structure' "missing exact heading '$heading'"
    done
    grep -Fq '{absent, draft, reviewed, stale, or confirmed}' "$template_path" || \
        fail "$template_rel" 'aggregate state set' 'must contain absent, draft, reviewed, stale, and confirmed'
done

extract_artifacts() {
    local file="$1" heading="$2"
    awk -v heading="$heading" '
        $0 == heading { section = 1; next }
        section && /^## / { exit }
        section && /^\|/ {
            line = $0
            if (match(line, /`[^`]+\.md`/)) {
                print substr(line, RSTART + 1, RLENGTH - 2)
            } else if (match(line, /\]\([^)]*\.md\)/)) {
                target = substr(line, RSTART + 2, RLENGTH - 3)
                sub(/^.*\//, "", target)
                print target
            }
        }
    ' "$file"
}

validate_artifact_set() {
    local file="$1" heading="$2" field="$3"
    local file_rel artifact
    local -a artifacts=()
    declare -A found=()
    file_rel="$(relative_path "$file")"
    if [[ ! -r "$file" ]]; then
        fail "$file_rel" "$field" 'template is absent or unreadable'
        return
    fi
    while IFS= read -r artifact; do
        artifacts+=("$artifact")
        if [[ -n ${found[$artifact]+x} ]]; then
            fail "$file_rel" "$field" "duplicate artifact '$artifact'"
        fi
        found[$artifact]=1
    done < <(extract_artifacts "$file" "$heading")

    if (( ${#artifacts[@]} != ${#registry_durables[@]} )); then
        fail "$file_rel" "$field" "expected ${#registry_durables[@]} aggregate rows, found ${#artifacts[@]}"
    fi
    for artifact in "${registry_durables[@]}"; do
        [[ -n "$artifact" ]] || continue
        [[ -n ${found[$artifact]+x} ]] || fail "$file_rel" "$field" "missing registry artifact '$artifact'"
    done
    for artifact in "${artifacts[@]}"; do
        [[ -n ${seen_durables[$artifact]+x} ]] || fail "$file_rel" "$field" "extra artifact '$artifact'"
    done
    [[ -z ${found[startup.md]+x} ]] || fail "$file_rel" "$field" 'startup.md must not be an aggregate row'
}

validate_artifact_set "$working_template" '## Artifact Register' 'temporary Artifact Register'
validate_artifact_set "$working_template" '## Phase Section Register' 'temporary Phase Section Register'
validate_artifact_set "$synthesis_template" '## Phase Document Artifact Register' 'synthesis child register'

if [[ -r "$working_template" ]]; then
    working_rel="$(relative_path "$working_template")"
    grep -Fq -- '- Startup schema: `4`' "$working_template" || fail "$working_rel" 'schema' 'temporary template must declare schema 4'
    grep -Fq 'The native TODO owns' "$working_template" || fail "$working_rel" 'route ownership' 'temporary template must defer progression to native TODO'
    if grep -Eq '^[-|][[:space:]]*(Current route|Next action|Cursor)([[:space:]]|:|\|)' "$working_template"; then
        fail "$working_rel" 'route ownership' 'temporary template contains an independently maintained route field'
    fi
    if grep -Eiq '(startup\.tmp\.md|working record).{0,40}owns.{0,20}(route|progression|current work)' "$working_template"; then
        fail "$working_rel" 'route ownership' 'temporary template claims a second route owner'
    fi
fi

if [[ -r "$synthesis_template" ]]; then
    synthesis_rel="$(relative_path "$synthesis_template")"
    grep -Fq -- '- Startup schema: `4`' "$synthesis_template" || fail "$synthesis_rel" 'schema' 'synthesis template must declare schema 4'
    grep -Fq 'complete six-file design set' "$synthesis_template" || fail "$synthesis_rel" 'durable artifact count' 'confirmation must name the complete six-file design set'
fi

route_owner_count="$(grep -Fc 'Native TODO alone owns current work' "$skill_file" || true)"
if [[ "$route_owner_count" != 1 ]]; then
    fail "$(relative_path "$skill_file")" 'route ownership' "expected one native TODO route owner declaration, found $route_owner_count"
fi

link_output=''
link_status=0
set +e
link_output="$(bash "$link_checker" "$startup_root" 2>&1)"
link_status=$?
set -e
if (( link_status != 0 )); then
    if (( link_status == 2 )); then
        fatal "$(relative_path "$link_checker")" 'Markdown link owner' 'checker could not inspect Startup sources'
    fi
    while IFS= read -r line; do
        case "$line" in
            BROKEN:*|BROKEN-ANCHOR:*)
                line="${line//"$repo_root/"/}"
                fail "$(relative_path "$link_checker")" 'Markdown link' "$line"
                ;;
        esac
    done <<< "$link_output"
fi

if (( ${#failures[@]} > 0 )); then
    printf '%s\n' "${failures[@]}"
    exit 1
fi

printf 'PASS: Startup schema-4 canonical contract is valid\n'
