#!/usr/bin/env bash
set -euo pipefail

SCHEMA_VERSION="1.0"
VALIDATOR_PATH="$(cd -- "$(dirname -- "$0")" && pwd -P)/$(basename -- "$0")"

usage() {
  cat >&2 <<'USAGE'
usage:
  validate-evaluation-contracts.sh scenario-check --parent ABS --child ABS --evidence ABS_JSON
  validate-evaluation-contracts.sh scenario-probe --parent ABS --child ABS --all --evidence ABS_JSON
  validate-evaluation-contracts.sh rule-scope-check --rule ABS --classification applicable|n/a --surface ABS [--surface ABS ...] --evidence ABS_JSON
  validate-evaluation-contracts.sh rule-scope-probe --rule ABS --surface ABS_REACT_SOURCE --evidence ABS_JSON
USAGE
  exit 2
}

fail() {
  printf 'validate-evaluation-contracts: %s\n' "$*" >&2
  return 1
}

require_absolute_file() {
  local label="$1"
  local path="$2"
  [[ "$path" = /* ]] || fail "$label must be an absolute path: $path"
  [[ -f "$path" ]] || fail "$label is not a file: $path"
}

require_absolute_evidence() {
  local path="$1"
  [[ "$path" = /* ]] || fail "evidence must be an absolute path: $path"
  [[ -d "$(dirname -- "$path")" ]] || fail "evidence parent does not exist: $(dirname -- "$path")"
}

digest() {
  sha256sum -- "$1" | awk '{print $1}'
}

json_argv() {
  printf '%s\0' "$@" | jq -Rs 'split("\u0000")[:-1]'
}

write_json() {
  local destination="$1"
  local payload="$2"
  local temporary
  temporary="$(mktemp "$(dirname -- "$destination")/.contract-evidence.XXXXXX")"
  printf '%s\n' "$payload" >"$temporary"
  jq -e . "$temporary" >/dev/null
  mv -- "$temporary" "$destination"
}

register_rows() {
  local child="$1"
  awk -F'|' '
    /^## Scenario Rule 1 coverage register$/ { in_register=1; next }
    in_register && /^### / { exit }
    in_register && $2 ~ /^[[:space:]]*[0-9]+[[:space:]]*$/ {
      for (i=2; i<=5; i++) {
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", $i)
      }
      print $2 "\t" $3 "\t" $4 "\t" $5
    }
  ' "$child"
}

carrier_row() {
  local child="$1"
  local category="$2"
  awk -F'|' -v wanted="$category" '
    /^### Category carriers$/ { in_carriers=1; next }
    in_carriers && /^### / { exit }
    in_carriers && $2 ~ /^[[:space:]]*[0-9]+[[:space:]]*$/ {
      number=$2
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", number)
      if (number == wanted) {
        value=$3
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
        print value
        exit
      }
    }
  ' "$child"
}

ledger_row() {
  local child="$1"
  local ledger="$2"
  awk -F'|' -v wanted="$ledger" '
    /^### Scenario Rule 7 covered-elsewhere ledger$/ { in_ledger=1; next }
    in_ledger && /^## / { exit }
    in_ledger && $2 ~ /^[[:space:]]*SR7-[0-9]+[[:space:]]*$/ {
      id=$2
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", id)
      if (id == wanted) {
        for (i=2; i<=7; i++) {
          value=$i
          gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
          printf "%s%s", value, (i == 7 ? ORS : "\t")
        }
        exit
      }
    }
  ' "$child"
}

scenario_validate() {
  local parent="$1"
  local child="$2"
  local rows_file="$3"
  local diagnostics_file="$4"
  local mechanical="pass"
  local semantic="pass"
  local row_count
  local number
  local disposition
  local reference
  local category
  local carrier
  local family
  local ledger
  local ledger_data

  : >"$diagnostics_file"
  register_rows "$child" >"$rows_file"
  row_count="$(wc -l <"$rows_file" | tr -d ' ')"
  if [[ "$row_count" != "10" ]]; then
    printf 'mechanical: expected 10 register rows, observed %s\n' "$row_count" >>"$diagnostics_file"
    mechanical="fail"
  fi

  for number in {1..10}; do
    local observed
    observed="$(awk -F'\t' -v wanted="$number" '$1 == wanted { count++ } END { print count+0 }' "$rows_file")"
    if [[ "$observed" != "1" ]]; then
      printf 'mechanical: category %s occurs %s times\n' "$number" "$observed" >>"$diagnostics_file"
      mechanical="fail"
    fi
  done

  while IFS=$'\t' read -r number category disposition reference; do
    if [[ "$disposition" != '`selected`' &&
          "$disposition" != '`covered-elsewhere`:'* &&
          "$disposition" != '`n/a:'*'`' ]]; then
      printf 'mechanical: category %s has invalid disposition %s\n' "$number" "$disposition" >>"$diagnostics_file"
      mechanical="fail"
      continue
    fi

    carrier="$(carrier_row "$child" "$number")"
    if [[ "$disposition" == '`selected`' ]]; then
      if [[ -z "$carrier" ]]; then
        printf 'semantic: selected category %s has no child-local carrier\n' "$number" >>"$diagnostics_file"
        semantic="fail"
      else
        local carrier_found="false"
        while IFS= read -r family; do
          [[ -n "$family" ]] || continue
          if rg -q "^### ${family} — " "$child"; then
            carrier_found="true"
          else
            printf 'semantic: category %s names missing carrier %s\n' "$number" "$family" >>"$diagnostics_file"
            semantic="fail"
          fi
        done < <(printf '%s\n' "$carrier" | rg -o 'REACT-SCENARIO-[0-9]{2}' | sort -u)
        if [[ "$carrier_found" != "true" ]]; then
          printf 'semantic: selected category %s has no resolvable family carrier\n' "$number" >>"$diagnostics_file"
          semantic="fail"
        fi
      fi
    elif [[ "$disposition" == '`covered-elsewhere`:'* ]]; then
      ledger="$(printf '%s\n' "$reference" | rg -o 'SR7-[0-9]+' | head -1 || true)"
      if [[ "$disposition" != *']('*')'* || -z "$ledger" ]]; then
        printf 'semantic: category %s has bare covered-elsewhere without pointer and ledger\n' "$number" >>"$diagnostics_file"
        semantic="fail"
        continue
      fi
      ledger_data="$(ledger_row "$child" "$ledger")"
      if [[ -z "$ledger_data" || "$(awk -F'\t' '{ print NF }' <<<"$ledger_data")" != "6" ]]; then
        printf 'semantic: category %s lacks complete Scenario Rule 7 ledger %s\n' "$number" "$ledger" >>"$diagnostics_file"
        semantic="fail"
      elif awk -F'\t' '{ for (i=2; i<=6; i++) if ($i == "") exit 1 }' <<<"$ledger_data"; then
        :
      else
        printf 'semantic: category %s ledger %s has an empty required field\n' "$number" "$ledger" >>"$diagnostics_file"
        semantic="fail"
      fi
    else
      if [[ -n "$carrier" ]]; then
        printf 'semantic: category %s has a declared secondary or primary carrier but is mislabeled n/a\n' "$number" >>"$diagnostics_file"
        semantic="fail"
      fi
      if [[ "$disposition" != \`n/a:\ *\` || "$disposition" == "\`n/a: \`" ]]; then
        printf 'semantic: category %s n/a lacks a named false property\n' "$number" >>"$diagnostics_file"
        semantic="fail"
      fi
    fi
  done <"$rows_file"

  if ! rg -qF "$(basename -- "$child")" "$parent"; then
    printf 'mechanical: parent does not index child %s\n' "$(basename -- "$child")" >>"$diagnostics_file"
    mechanical="fail"
  fi

  if rg -q '^### REACT-SCENARIO-13 — ' "$child"; then
    local boundary_marker
    for boundary_marker in \
      'Descendant render failure and fallback' \
      'Recovery after corrected input' \
      'Useful granularity boundary' \
      'Unsupported event, ordinary async, and server-render failures' \
      '`startTransition` throw reaches the boundary' \
      'Cosmetic boundary gaming' \
      'EB-1' 'EB-2' 'EB-3' 'EB-4' 'EB-5' 'EB-6'; do
      if ! rg -qF "$boundary_marker" "$child"; then
        printf 'semantic: Error Boundary family lacks required observable marker %s\n' \
          "$boundary_marker" >>"$diagnostics_file"
        semantic="fail"
      fi
    done
  fi

  printf '%s\t%s\n' "$mechanical" "$semantic"
  [[ "$mechanical" == "pass" && "$semantic" == "pass" ]]
}

scenario_check() {
  local parent=""
  local child=""
  local evidence=""
  local -a supplied=("$@")
  while (($#)); do
    case "$1" in
      --parent) (($# >= 2)) || usage; parent="$2"; shift 2 ;;
      --child) (($# >= 2)) || usage; child="$2"; shift 2 ;;
      --evidence) (($# >= 2)) || usage; evidence="$2"; shift 2 ;;
      *) usage ;;
    esac
  done
  [[ -n "$parent" && -n "$child" && -n "$evidence" ]] || usage
  require_absolute_file parent "$parent" || return 1
  require_absolute_file child "$child" || return 1
  require_absolute_evidence "$evidence" || return 1

  local rows_file
  local diagnostics_file
  local result_file
  local status=0
  local mechanical
  local semantic
  rows_file="$(mktemp)"
  diagnostics_file="$(mktemp)"
  result_file="$(mktemp)"
  if scenario_validate "$parent" "$child" "$rows_file" "$diagnostics_file" >"$result_file"; then
    status=0
  else
    status=1
  fi
  IFS=$'\t' read -r mechanical semantic <"$result_file"
  local payload
  payload="$(jq -n \
    --arg schema "$SCHEMA_VERSION" \
    --arg validator "$VALIDATOR_PATH" \
    --arg validator_digest "$(digest "$VALIDATOR_PATH")" \
    --arg mode "scenario-check" \
    --argjson arguments "$(json_argv "${supplied[@]}")" \
    --arg parent "$parent" \
    --arg parent_digest "$(digest "$parent")" \
    --arg child "$child" \
    --arg child_digest "$(digest "$child")" \
    --arg child_identity "$(basename -- "$child" .md)" \
    --arg mechanical "$mechanical" \
    --arg semantic "$semantic" \
    --arg diagnostics "$(cat "$diagnostics_file")" \
    --arg aggregate "$([[ "$status" == 0 ]] && printf pass || printf fail)" \
    '{
      schema_version:$schema,
      validator:{absolute_path:$validator,sha256:$validator_digest},
      mode:$mode,
      arguments:$arguments,
      input_paths_and_digests:[
        {role:"parent",absolute_path:$parent,sha256:$parent_digest},
        {role:"child",absolute_path:$child,sha256:$child_digest}
      ],
      child_identity:$child_identity,
      mechanical_result:{status:$mechanical},
      semantic_result:{status:$semantic},
      probe_identities:[],
      expected_nested_status:null,
      observed_nested_status:null,
      atomic_checks:[{id:"diagnostics",detail:$diagnostics}],
      aggregate_result:$aggregate
    }')"
  write_json "$evidence" "$payload"
  if [[ "$status" != 0 ]]; then
    cat "$diagnostics_file" >&2
  fi
  rm -f -- "$rows_file" "$diagnostics_file" "$result_file"
  return "$status"
}

mutate_register() {
  local source="$1"
  local destination="$2"
  local defect="$3"
  awk -F'|' -v OFS='|' -v defect="$defect" '
    /^## Scenario Rule 1 coverage register$/ { in_register=1 }
    in_register && /^### / { in_register=0 }
    in_register && $2 ~ /^[[:space:]]*[0-9]+[[:space:]]*$/ {
      number=$2
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", number)
      if (defect == "missing-category" && number == 10) next
      if (defect == "duplicate-category" && number == 10) $2=" 9 "
      if (defect == "invalid-disposition" && number == 1) $4=" `invalid` "
      if (defect == "bare-covered-elsewhere" && $4 ~ /covered-elsewhere/ && !changed) {
        $5=" bare-pointer "
        changed=1
      }
      if (defect == "secondary-mislabeled-na" && number == 1) $4=" `n/a: planted false predicate` "
    }
    { print }
  ' "$source" >"$destination"
}

scenario_probe() {
  local parent=""
  local child=""
  local evidence=""
  local all="false"
  local -a supplied=("$@")
  while (($#)); do
    case "$1" in
      --parent) (($# >= 2)) || usage; parent="$2"; shift 2 ;;
      --child) (($# >= 2)) || usage; child="$2"; shift 2 ;;
      --all) all="true"; shift ;;
      --evidence) (($# >= 2)) || usage; evidence="$2"; shift 2 ;;
      *) usage ;;
    esac
  done
  [[ -n "$parent" && -n "$child" && -n "$evidence" && "$all" == "true" ]] || usage
  require_absolute_file parent "$parent" || return 1
  require_absolute_file child "$child" || return 1
  require_absolute_evidence "$evidence" || return 1

  local fixture_root
  fixture_root="$(mktemp -d)"
  trap 'rm -rf -- "$fixture_root"' RETURN
  cp -- "$parent" "$fixture_root/parent.md"
  local -a probes=(
    missing-category
    duplicate-category
    invalid-disposition
    bare-covered-elsewhere
    secondary-mislabeled-na
  )
  local checks='[]'
  local probe
  local aggregate="pass"
  for probe in "${probes[@]}"; do
    local fixture="$fixture_root/$probe.md"
    local fixture_parent="$fixture_root/$probe-parent.md"
    local nested="$fixture_root/$probe.json"
    local stderr_file="$fixture_root/$probe.stderr"
    local observed
    local expected_diagnosis
    mutate_register "$child" "$fixture" "$probe"
    sed "s/$(basename -- "$child")/$(basename -- "$fixture")/g" \
      "$fixture_root/parent.md" >"$fixture_parent"
    case "$probe" in
      missing-category) expected_diagnosis='category 10 occurs 0 times' ;;
      duplicate-category) expected_diagnosis='category 9 occurs 2 times' ;;
      invalid-disposition) expected_diagnosis='category 1 has invalid disposition' ;;
      bare-covered-elsewhere) expected_diagnosis='bare covered-elsewhere without pointer and ledger' ;;
      secondary-mislabeled-na) expected_diagnosis='declared secondary or primary carrier but is mislabeled n/a' ;;
    esac
    set +e
    "$VALIDATOR_PATH" scenario-check \
      --parent "$fixture_parent" \
      --child "$fixture" \
      --evidence "$nested" 2>"$stderr_file"
    observed=$?
    set -e
    local nested_result="rejected"
    if [[ "$observed" == 0 || "$observed" == 2 ||
          "$(cat "$stderr_file")" != *"$expected_diagnosis"* ]]; then
      nested_result="not-rejected-as-required"
      aggregate="fail"
    fi
    checks="$(jq -c \
      --arg id "$probe" \
      --argjson observed "$observed" \
      --arg result "$nested_result" \
      --arg diagnosis "$(cat "$stderr_file")" \
      '. + [{probe_id:$id,expected_nested_status:"nonzero-invalid",observed_nested_status:$observed,result:$result,diagnosis:$diagnosis}]' \
      <<<"$checks")"
  done

  local payload
  payload="$(jq -n \
    --arg schema "$SCHEMA_VERSION" \
    --arg validator "$VALIDATOR_PATH" \
    --arg validator_digest "$(digest "$VALIDATOR_PATH")" \
    --arg mode "scenario-probe" \
    --argjson arguments "$(json_argv "${supplied[@]}")" \
    --arg parent "$parent" \
    --arg parent_digest "$(digest "$parent")" \
    --arg child "$child" \
    --arg child_digest "$(digest "$child")" \
    --arg child_identity "$(basename -- "$child" .md)" \
    --argjson probes "$(printf '%s\n' "${probes[@]}" | jq -R . | jq -s .)" \
    --argjson checks "$checks" \
    --arg aggregate "$aggregate" \
    '{
      schema_version:$schema,
      validator:{absolute_path:$validator,sha256:$validator_digest},
      mode:$mode,
      arguments:$arguments,
      input_paths_and_digests:[
        {role:"parent",absolute_path:$parent,sha256:$parent_digest},
        {role:"child",absolute_path:$child,sha256:$child_digest}
      ],
      child_identity:$child_identity,
      mechanical_result:{status:"probe"},
      semantic_result:{status:"probe"},
      probe_identities:$probes,
      expected_nested_status:"nonzero-invalid",
      observed_nested_status:($checks | map(.observed_nested_status)),
      atomic_checks:$checks,
      aggregate_result:$aggregate
    }')"
  write_json "$evidence" "$payload"
  [[ "$aggregate" == "pass" ]] || fail "one or more scenario probes did not reject the planted defect"
}

surface_is_workflow_step() {
  local surface="$1"
  [[ "$surface" == */workflow/steps/*.md ]]
}

rule_scope_check() {
  local rule=""
  local classification=""
  local evidence=""
  local -a surfaces=()
  local -a supplied=("$@")
  while (($#)); do
    case "$1" in
      --rule) (($# >= 2)) || usage; rule="$2"; shift 2 ;;
      --classification) (($# >= 2)) || usage; classification="$2"; shift 2 ;;
      --surface) (($# >= 2)) || usage; surfaces+=("$2"); shift 2 ;;
      --evidence) (($# >= 2)) || usage; evidence="$2"; shift 2 ;;
      *) usage ;;
    esac
  done
  [[ -n "$rule" && -n "$classification" && -n "$evidence" && "${#surfaces[@]}" -gt 0 ]] || usage
  [[ "$classification" == "applicable" || "$classification" == "n/a" ]] || usage
  require_absolute_file rule "$rule" || return 1
  require_absolute_evidence "$evidence" || return 1
  rg -qF 'Outside `workflow/steps/*.md`' "$rule" ||
    fail "rule-scope owner does not declare the workflow-step-only predicate"

  local derived="n/a"
  local surface
  local -a inputs=()
  for surface in "${surfaces[@]}"; do
    require_absolute_file surface "$surface" || return 1
    if surface_is_workflow_step "$surface"; then
      derived="applicable"
    fi
    inputs+=("$(jq -n --arg path "$surface" --arg sha "$(digest "$surface")" '{role:"surface",absolute_path:$path,sha256:$sha}')")
  done
  local aggregate="pass"
  local semantic="pass"
  local diagnosis=""
  if [[ "$classification" != "$derived" ]]; then
    aggregate="fail"
    semantic="fail"
    diagnosis="semantic: classification $classification contradicts derived rule scope $derived"
  fi
  local input_json
  input_json="$(printf '%s\n' "${inputs[@]}" | jq -s .)"
  input_json="$(jq --arg path "$rule" --arg sha "$(digest "$rule")" '[{role:"rule",absolute_path:$path,sha256:$sha}] + .' <<<"$input_json")"
  local payload
  payload="$(jq -n \
    --arg schema "$SCHEMA_VERSION" \
    --arg validator "$VALIDATOR_PATH" \
    --arg validator_digest "$(digest "$VALIDATOR_PATH")" \
    --arg mode "rule-scope-check" \
    --argjson arguments "$(json_argv "${supplied[@]}")" \
    --argjson inputs "$input_json" \
    --arg classification "$classification" \
    --arg derived "$derived" \
    --arg semantic "$semantic" \
    --arg diagnosis "$diagnosis" \
    --arg aggregate "$aggregate" \
    '{
      schema_version:$schema,
      validator:{absolute_path:$validator,sha256:$validator_digest},
      mode:$mode,
      arguments:$arguments,
      input_paths_and_digests:$inputs,
      child_identity:null,
      mechanical_result:{status:"pass"},
      semantic_result:{status:$semantic,declared:$classification,derived:$derived},
      probe_identities:[],
      expected_nested_status:null,
      observed_nested_status:null,
      atomic_checks:[{id:"workflow-step-only-predicate",result:$semantic,diagnosis:$diagnosis}],
      aggregate_result:$aggregate
    }')"
  write_json "$evidence" "$payload"
  [[ "$aggregate" == "pass" ]] || fail "$diagnosis"
}

rule_scope_probe() {
  local rule=""
  local surface=""
  local evidence=""
  local -a supplied=("$@")
  while (($#)); do
    case "$1" in
      --rule) (($# >= 2)) || usage; rule="$2"; shift 2 ;;
      --surface) (($# >= 2)) || usage; surface="$2"; shift 2 ;;
      --evidence) (($# >= 2)) || usage; evidence="$2"; shift 2 ;;
      *) usage ;;
    esac
  done
  [[ -n "$rule" && -n "$surface" && -n "$evidence" ]] || usage
  require_absolute_file rule "$rule" || return 1
  require_absolute_file surface "$surface" || return 1
  require_absolute_evidence "$evidence" || return 1

  local fixture_root
  fixture_root="$(mktemp -d)"
  trap 'rm -rf -- "$fixture_root"' RETURN
  cp -- "$rule" "$fixture_root/rule.md"
  cp -- "$surface" "$fixture_root/react-source.md"
  local nested="$fixture_root/nested.json"
  local stderr_file="$fixture_root/nested.stderr"
  local observed
  set +e
  "$VALIDATOR_PATH" rule-scope-check \
    --rule "$fixture_root/rule.md" \
    --classification applicable \
    --surface "$fixture_root/react-source.md" \
    --evidence "$nested" 2>"$stderr_file"
  observed=$?
  set -e
  local aggregate="pass"
  if [[ "$observed" == 0 || "$observed" == 2 ||
        "$(cat "$stderr_file")" != *'contradicts derived rule scope n/a'* ]]; then
    aggregate="fail"
  fi
  local payload
  payload="$(jq -n \
    --arg schema "$SCHEMA_VERSION" \
    --arg validator "$VALIDATOR_PATH" \
    --arg validator_digest "$(digest "$VALIDATOR_PATH")" \
    --arg mode "rule-scope-probe" \
    --argjson arguments "$(json_argv "${supplied[@]}")" \
    --arg rule "$rule" \
    --arg rule_digest "$(digest "$rule")" \
    --arg surface "$surface" \
    --arg surface_digest "$(digest "$surface")" \
    --argjson observed "$observed" \
    --arg diagnosis "$(cat "$stderr_file")" \
    --arg aggregate "$aggregate" \
    '{
      schema_version:$schema,
      validator:{absolute_path:$validator,sha256:$validator_digest},
      mode:$mode,
      arguments:$arguments,
      input_paths_and_digests:[
        {role:"rule",absolute_path:$rule,sha256:$rule_digest},
        {role:"surface",absolute_path:$surface,sha256:$surface_digest}
      ],
      child_identity:null,
      mechanical_result:{status:"probe"},
      semantic_result:{status:"probe"},
      probe_identities:["false-applicable-react-source"],
      expected_nested_status:"nonzero-invalid",
      observed_nested_status:$observed,
      atomic_checks:[{probe_id:"false-applicable-react-source",expected_nested_status:"nonzero-invalid",observed_nested_status:$observed,diagnosis:$diagnosis}],
      aggregate_result:$aggregate
    }')"
  write_json "$evidence" "$payload"
  [[ "$aggregate" == "pass" ]] || fail "rule-scope probe did not reject false applicable classification"
}

(($# >= 1)) || usage
mode="$1"
shift
case "$mode" in
  scenario-check) scenario_check "$@" ;;
  scenario-probe) scenario_probe "$@" ;;
  rule-scope-check) rule_scope_check "$@" ;;
  rule-scope-probe) rule_scope_probe "$@" ;;
  *) usage ;;
esac
