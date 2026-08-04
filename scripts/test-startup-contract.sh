#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
checker="$repo_root/scripts/check-startup-contract.sh"
canonical="$repo_root/.gobbi/projects/gobbi/skills/startup"
link_checker="$repo_root/scripts/check-markdown-links.sh"
tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/gobbi-startup-contract.XXXXXX")"
tests_run=0

cleanup() {
  if [[ -d "$tmp_root" && ! -L "$tmp_root" ]]; then
    find "$tmp_root" -depth -mindepth 1 -delete
    rmdir "$tmp_root"
  fi
}
trap cleanup EXIT

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

pass() {
  tests_run=$((tests_run + 1))
  printf 'PASS: %s\n' "$1"
}

make_fixture() {
  local root="$1"
  mkdir -p "$root/.gobbi/projects/gobbi/skills" "$root/.agents/skills" "$root/scripts"
  cp -R "$canonical" "$root/.gobbi/projects/gobbi/skills/startup"
  cp "$link_checker" "$root/scripts/check-markdown-links.sh"
  ln -s '../../.gobbi/projects/gobbi/skills/startup' "$root/.agents/skills/startup"
}

run_checker() {
  GOBBI_STARTUP_CHECK_REPO_ROOT="$1" bash "$checker"
}

run_valid_case() {
  local name="$1" root="$tmp_root/$1" output
  make_fixture "$root"
  output="$(run_checker "$root")" || fail "$name did not pass"
  [[ "$output" == PASS:* ]] || fail "$name emitted an unexpected result: $output"
  pass "$name"
}

run_failure_case() {
  local name="$1" mutation="$2" expected="$3" root="$tmp_root/$1" output status
  make_fixture "$root"
  "$mutation" "$root"
  set +e
  output="$(run_checker "$root" 2>&1)"
  status=$?
  set -e
  [[ "$status" == 1 ]] || fail "$name exited $status instead of 1"
  grep -Fq -- "$expected" <<< "$output" || fail "$name missing diagnostic '$expected': $output"
  pass "$name"
}

mutate_missing_topic() {
  find "$1/.gobbi/projects/gobbi/skills/startup/topics/specification.md" -delete
}

mutate_question_count() {
  sed -i '0,/^- .*?$/s//Question removed from the bank./' "$1/.gobbi/projects/gobbi/skills/startup/topics/problem-definition.md"
}

mutate_alias_prefix() {
  sed -i '0,/^- /s//- [restored-key] /' "$1/.gobbi/projects/gobbi/skills/startup/topics/design.md"
}

mutate_metadata_row() {
  sed -i '/^- /a\  - **Owner:** obsolete owner' "$1/.gobbi/projects/gobbi/skills/startup/topics/design.md"
}

mutate_lifecycle_scenario_model() {
  sed -i '/^## Overlay Banks$/i\## Scenario Model\n\nRecord the Development dimension, linked Product scenarios, observable outcome, recovery, and coverage status.\n' \
    "$1/.gobbi/projects/gobbi/skills/startup/topics/development-lifecycle.md"
}

mutate_temporary_template() {
  cp "$1/.gobbi/projects/gobbi/skills/startup/templates/startup.md" "$1/.gobbi/projects/gobbi/skills/startup/templates/startup.tmp.md"
}

mutate_template_shape() {
  sed -i 's/^## Products$/## Product Set/' "$1/.gobbi/projects/gobbi/skills/startup/templates/design.md"
}

mutate_phase_order() {
  sed -i 's/^| 1 | Problem Definition/| 2 | Problem Definition/' "$1/.gobbi/projects/gobbi/skills/startup/SKILL.md"
}

mutate_schema_behavior() {
  sed -i '$a Startup schema 9' "$1/.gobbi/projects/gobbi/skills/startup/SKILL.md"
}

mutate_broken_link() {
  sed -i '$a [Broken](missing.md)' "$1/.gobbi/projects/gobbi/skills/startup/topics/problem-definition.md"
}

mutate_final_acceptance() {
  sed -i '/^- Accepted: /d' "$1/.gobbi/projects/gobbi/skills/startup/templates/startup.md"
}

snapshot_tree() {
  local root="$1" snapshot="$2" path rel digest target
  : > "$snapshot"
  while IFS= read -r -d '' path; do
    rel="${path#"$root/"}"
    if [[ -L "$path" ]]; then
      target="$(readlink -- "$path")"
      printf 'link\t%s\t%s\n' "$rel" "$target" >> "$snapshot"
    else
      digest="$(sha256sum "$path" | awk '{print $1}')"
      printf 'file\t%s\t%s\n' "$rel" "$digest" >> "$snapshot"
    fi
  done < <(find "$root" \( -type f -o -type l \) -print0 | LC_ALL=C sort -z)
}

run_zero_mutation_case() {
  local name='zero-mutation' root="$tmp_root/zero-mutation" before="$tmp_root/before" after="$tmp_root/after" status
  make_fixture "$root"
  snapshot_tree "$root" "$before"
  run_checker "$root" >/dev/null || fail 'zero-mutation valid fixture failed'
  snapshot_tree "$root" "$after"
  cmp -s "$before" "$after" || fail 'checker mutated a valid fixture'
  mutate_alias_prefix "$root"
  snapshot_tree "$root" "$before"
  set +e
  run_checker "$root" >/dev/null 2>&1
  status=$?
  set -e
  [[ "$status" == 1 ]] || fail 'zero-mutation invalid fixture did not fail'
  snapshot_tree "$root" "$after"
  cmp -s "$before" "$after" || fail 'checker mutated an invalid fixture'
  pass "$name"
}

run_bad_root_case() {
  local root="$tmp_root/absent" status
  set +e
  GOBBI_STARTUP_CHECK_REPO_ROOT="$root" bash "$checker" >/dev/null 2>&1
  status=$?
  set -e
  [[ "$status" == 2 ]] || fail "bad-root exited $status instead of 2"
  pass 'bad-root'
}

run_valid_case valid
run_failure_case missing-topic mutate_missing_topic 'expected 17 Markdown files'
run_failure_case question-count mutate_question_count 'expected 342 question bullets'
run_failure_case alias-prefix mutate_alias_prefix 'forbidden question metadata'
run_failure_case metadata-row mutate_metadata_row 'forbidden question metadata'
run_failure_case lifecycle-scenario-model mutate_lifecycle_scenario_model 'obsolete lifecycle topic machinery'
run_failure_case temporary-template mutate_temporary_template 'expected 6 Markdown files'
run_failure_case template-shape mutate_template_shape "missing exact '## Products' heading"
run_failure_case phase-order mutate_phase_order 'missing exact ordered row for Problem Definition'
run_failure_case schema-behavior mutate_schema_behavior 'obsolete Startup behavior'
run_failure_case broken-link mutate_broken_link 'Markdown links'
run_failure_case final-acceptance mutate_final_acceptance 'expected 1 marker'
run_bad_root_case
run_zero_mutation_case

printf 'Startup contract tests passed: %d cases\n' "$tests_run"
