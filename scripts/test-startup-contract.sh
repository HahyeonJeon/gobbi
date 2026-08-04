#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
checker="$repo_root/scripts/check-startup-contract.sh"
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

write_topic() {
  local path="$1" alias="$2"
  mkdir -p "$(dirname -- "$path")"
  printf '%s\n' \
    "# $alias Topics" \
    '' \
    '## Project' \
    '' \
    "- [$alias] What must be decided for $alias?" \
    "  - **Owner:** $alias owner" \
    "  - **Purpose:** Decide $alias" \
    "  - **Oracle:** Accepted evidence proves $alias" \
    '  - **Activation evidence:** Fixture evidence' \
    "  - **Source aliases:** $alias" \
    '' \
    '## Product' \
    '' \
    '## Implementation' > "$path"
}

write_aggregate_template() {
  local path="$1" title="$2"
  printf '%s\n' \
    "# $title" \
    '' \
    '## Section Register' \
    '' \
    '| Level | State |' \
    '|---|---|' \
    '| Project | `{absent, draft, reviewed, stale, or confirmed}` |' \
    '' \
    '## Project' \
    '' \
    '## Products' \
    '' \
    '## Implementations' > "$path"
}

make_fixture() {
  local root="$1" startup topics templates
  startup="$root/.gobbi/projects/gobbi/skills/startup"
  topics="$startup/topics"
  templates="$startup/templates"
  mkdir -p "$topics/product-lifecycle" "$topics/development-lifecycle" "$templates" "$root/scripts"
  cp "$link_checker" "$root/scripts/check-markdown-links.sh"

  printf '%s\n' \
    '---' \
    'name: startup' \
    '---' \
    '' \
    '# Startup' \
    '' \
    '- Schema 4 has exactly six durable files: the five aggregate files plus `startup.md`.' \
    '- Schema 3 has exactly five durable files:' \
    '  `lifecycle-and-use-cases.md` is its combined legacy aggregate.' \
    '- Classify the directory read-only before inspecting the lane:' \
    '' \
    '| Disk state | Required action |' \
    '|---|---|' \
    '| Complete confirmed schema 3 with `lifecycle-and-use-cases.md` | Return it read-only. |' \
    '' \
    '## Static Registry' \
    '' \
    '| Order | Stable key | Title | Direct topic entry | Aggregate template | Durable artifact | Direct dependencies |' \
    '|---:|---|---|---|---|---|---|' \
    '| 1 | `problem-definition` | Problem Definition | [`topics/problem-definition.md`](topics/problem-definition.md) | [`templates/problem-definition.md`](templates/problem-definition.md) | `problem-definition.md` | Identity |' \
    '| 2 | `design` | Design | [`topics/design.md`](topics/design.md) | [`templates/design.md`](templates/design.md) | `design.md` | Problem |' \
    '| 3 | `specification` | Specification | [`topics/specification.md`](topics/specification.md) | [`templates/specification.md`](templates/specification.md) | `specification.md` | Design |' \
    '| 4 | `product-lifecycle` | Product Lifecycle | [`topics/product-lifecycle.md`](topics/product-lifecycle.md) | [`templates/product-lifecycle.md`](templates/product-lifecycle.md) | `product-lifecycle.md` | Specification |' \
    '| 5 | `development-lifecycle` | Development Lifecycle | [`topics/development-lifecycle.md`](topics/development-lifecycle.md) | [`templates/development-lifecycle.md`](templates/development-lifecycle.md) | `development-lifecycle.md` | Product Lifecycle |' \
    '' \
    'Native TODO alone owns current work.' > "$startup/SKILL.md"

  write_topic "$topics/problem-definition.md" 'problem-common'
  write_topic "$topics/design.md" 'design-common'
  write_topic "$topics/specification.md" 'specification-common'

  printf '%s\n' \
    '# Product Lifecycle Topics' \
    '' \
    '## Overlay Banks' \
    '' \
    '| Bank | Activation |' \
    '|---|---|' \
    '| [Web](product-lifecycle/web.md) | evidence |' \
    '| [Desktop](product-lifecycle/desktop.md) | evidence |' \
    '| [CLI](product-lifecycle/cli.md) | evidence |' \
    '| [Library](product-lifecycle/library.md) | evidence |' \
    '| [SDK](product-lifecycle/sdk.md) | evidence |' \
    '| [Mobile](product-lifecycle/mobile.md) | evidence |' \
    '| [Data](product-lifecycle/data.md) | evidence |' \
    '' \
    '## Project' \
    '' \
    '- [product-common] What Product promise is required?' \
    '  - **Owner:** product-common owner' \
    '  - **Purpose:** Decide product-common' \
    '  - **Oracle:** Accepted evidence proves product-common' \
    '  - **Activation evidence:** Fixture evidence' \
    '  - **Source aliases:** product-common' \
    '' \
    '## Product' \
    '' \
    '## Implementation' > "$topics/product-lifecycle.md"

  printf '%s\n' \
    '# Development Lifecycle Topics' \
    '' \
    '## Overlay Banks' \
    '' \
    '| Bank | Activation |' \
    '|---|---|' \
    '| [Tool](development-lifecycle/tool.md) | evidence |' \
    '| [Framework](development-lifecycle/framework.md) | evidence |' \
    '| [Language](development-lifecycle/language.md) | evidence |' \
    '| [Desktop](development-lifecycle/desktop.md) | evidence |' \
    '| [Network](development-lifecycle/network.md) | evidence |' \
    '' \
    '## Project' \
    '' \
    '- [development-common] What Development mechanism is required?' \
    '  - **Owner:** development-common owner' \
    '  - **Purpose:** Decide development-common' \
    '  - **Oracle:** Accepted evidence proves development-common' \
    '  - **Activation evidence:** Fixture evidence' \
    '  - **Source aliases:** development-common' \
    '' \
    '## Product' \
    '' \
    '## Implementation' > "$topics/development-lifecycle.md"

  local alias
  for alias in web desktop cli library sdk mobile data; do
    write_topic "$topics/product-lifecycle/$alias.md" "product-$alias"
  done
  for alias in tool framework language desktop network; do
    write_topic "$topics/development-lifecycle/$alias.md" "development-$alias"
  done

  printf '%s\n' $'old_level\told_phase\told_alias\tdisposition\tnew_phase\tnew_level\tnew_alias\towner\tpurpose\toracle\treason' > "$topics/alias-migration.tsv"
  while IFS= read -r alias; do
    printf 'Fixture\tFixture\t%s\tretained\tFixture\tProject\t%s\t%s owner\tDecide %s\tAccepted evidence proves %s\tFixture mapping\n' \
      "$alias" "$alias" "$alias" "$alias" "$alias" >> "$topics/alias-migration.tsv"
  done <<'ALIASES'
problem-common
design-common
specification-common
product-common
development-common
product-web
product-desktop
product-cli
product-library
product-sdk
product-mobile
product-data
development-tool
development-framework
development-language
development-desktop
development-network
ALIASES

  write_aggregate_template "$templates/problem-definition.md" 'Problem Definition'
  write_aggregate_template "$templates/design.md" 'Design'
  write_aggregate_template "$templates/specification.md" 'Specification'
  write_aggregate_template "$templates/product-lifecycle.md" 'Product Lifecycle'
  write_aggregate_template "$templates/development-lifecycle.md" 'Development Lifecycle'

  printf '%s\n' \
    '# Startup Working Record' \
    '' \
    'The native TODO owns progression. This proof contains no cursor.' \
    '' \
    '- Startup schema: `4`' \
    '' \
    '## Artifact Register' \
    '' \
    '| Artifact | Phase |' \
    '|---|---|' \
    '| `problem-definition.md` | Problem Definition |' \
    '| `design.md` | Design |' \
    '| `specification.md` | Specification |' \
    '| `product-lifecycle.md` | Product Lifecycle |' \
    '| `development-lifecycle.md` | Development Lifecycle |' \
    '' \
    '## Subject Register' \
    '' \
    '## Phase Section Register' \
    '' \
    '| Artifact | Phase |' \
    '|---|---|' \
    '| `problem-definition.md` | Problem Definition |' \
    '| `design.md` | Design |' \
    '| `specification.md` | Specification |' \
    '| `product-lifecycle.md` | Product Lifecycle |' \
    '| `development-lifecycle.md` | Development Lifecycle |' > "$templates/startup.tmp.md"

  printf '%s\n' \
    '# Startup Design' \
    '' \
    '## Phase Document Artifact Register' \
    '' \
    '| Artifact | Role |' \
    '|---|---|' \
    '| [`problem-definition.md`](problem-definition.md) | Problem Definition |' \
    '| [`design.md`](design.md) | Design |' \
    '| [`specification.md`](specification.md) | Specification |' \
    '| [`product-lifecycle.md`](product-lifecycle.md) | Product Lifecycle |' \
    '| [`development-lifecycle.md`](development-lifecycle.md) | Development Lifecycle |' \
    '' \
    '## Integrated Design' \
    '' \
    '## Confirmation' \
    '' \
    '- Startup schema: `4`' \
    '- The user confirmed: `{the complete six-file design set}`' > "$templates/startup.md"
}

run_checker() {
  local root="$1"
  GOBBI_STARTUP_CHECK_REPO_ROOT="$root" bash "$checker"
}

capture_checker() {
  local root="$1" output_file="$2" status_file="$3" status
  set +e
  run_checker "$root" > "$output_file" 2>&1
  status=$?
  set -e
  printf '%s\n' "$status" > "$status_file"
}

assert_exact_line() {
  local file="$1" expected="$2"
  grep -Fqx -- "$expected" "$file" || {
    printf 'Expected exact line:\n%s\nActual output:\n' "$expected" >&2
    sed -n '1,120p' "$file" >&2
    fail 'exact diagnostic mismatch'
  }
}

run_valid_case() {
  local name="$1" root output status_file
  root="$tmp_root/$name"
  output="$tmp_root/$name.out"
  status_file="$tmp_root/$name.status"
  make_fixture "$root"
  capture_checker "$root" "$output" "$status_file"
  [[ "$(<"$status_file")" == 0 ]] || fail "$name did not pass"
  [[ "$(<"$output")" == 'PASS: Startup schema-4 canonical contract is valid' ]] || fail "$name emitted an unexpected success result"
  pass "$name"
}

run_failure_case() {
  local name="$1" mutation="$2" expected="$3"
  local root output status_file
  root="$tmp_root/$name"
  output="$tmp_root/$name.out"
  status_file="$tmp_root/$name.status"
  make_fixture "$root"
  "$mutation" "$root"
  capture_checker "$root" "$output" "$status_file"
  [[ "$(<"$status_file")" == 1 ]] || fail "$name did not exit 1"
  assert_exact_line "$output" "$expected"
  pass "$name"
}

mutate_missing_phase() {
  find "$1/.gobbi/projects/gobbi/skills/startup/topics/specification.md" -delete
}

mutate_missing_overlay() {
  find "$1/.gobbi/projects/gobbi/skills/startup/topics/product-lifecycle/web.md" -delete
}

mutate_duplicate_phase_key() {
  sed -i 's/| 2 | `design`/| 2 | `problem-definition`/' "$1/.gobbi/projects/gobbi/skills/startup/SKILL.md"
}

mutate_broken_link() {
  printf '%s\n' '[Broken](missing.md)' >> "$1/.gobbi/projects/gobbi/skills/startup/topics/problem-definition.md"
}

mutate_forbidden_legacy() {
  printf '%s\n' 'Current aggregate: `lifecycle-and-use-cases.md`' >> "$1/.gobbi/projects/gobbi/skills/startup/SKILL.md"
}

mutate_sixth_temporary_row() {
  sed -i '/^## Subject Register/i | `extra.md` | Extra |' "$1/.gobbi/projects/gobbi/skills/startup/templates/startup.tmp.md"
}

mutate_missing_reviewed() {
  sed -i 's/{absent, draft, reviewed, stale, or confirmed}/{absent, draft, stale, or confirmed}/' "$1/.gobbi/projects/gobbi/skills/startup/templates/problem-definition.md"
}

mutate_second_route_owner() {
  printf '%s\n' 'Native TODO alone owns current work.' >> "$1/.gobbi/projects/gobbi/skills/startup/SKILL.md"
}

mutate_duplicate_alias() {
  sed -i 's/\[product-web\]/[product-common]/' "$1/.gobbi/projects/gobbi/skills/startup/topics/product-lifecycle/web.md"
}

mutate_missing_disposition() {
  sed -i $'0,/\tretained\t/s//\t\t/' "$1/.gobbi/projects/gobbi/skills/startup/topics/alias-migration.tsv"
}

mutate_extra_synthesis_child() {
  sed -i '/^## Integrated Design/i | [`extra.md`](extra.md) | Extra |' "$1/.gobbi/projects/gobbi/skills/startup/templates/startup.md"
  printf '%s\n' '# Extra' > "$1/.gobbi/projects/gobbi/skills/startup/templates/extra.md"
}

mutate_wrong_durable_count() {
  sed -i 's/Schema 4 has exactly six durable files/Schema 4 has exactly seven durable files/' "$1/.gobbi/projects/gobbi/skills/startup/SKILL.md"
}

snapshot_tree() {
  local root="$1" output="$2" file rel mode digest
  : > "$output"
  while IFS= read -r -d '' file; do
    rel="${file#"$root/"}"
    mode="$(stat -c '%a' "$file")"
    digest="$(sha256sum "$file" | awk '{print $1}')"
    printf '%s\t%s\t%s\n' "$rel" "$mode" "$digest" >> "$output"
  done < <(find "$root" -type f -print0 | LC_ALL=C sort -z)
}

run_zero_mutation_case() {
  local name='zero-mutation' root="$tmp_root/zero-mutation"
  local before="$tmp_root/zero.before" after="$tmp_root/zero.after" output="$tmp_root/zero.out" status_file="$tmp_root/zero.status"
  make_fixture "$root"
  snapshot_tree "$root" "$before"
  capture_checker "$root" "$output" "$status_file"
  [[ "$(<"$status_file")" == 0 ]] || fail 'zero-mutation valid fixture failed'
  snapshot_tree "$root" "$after"
  cmp -s "$before" "$after" || fail 'checker mutated a valid fixture'
  mutate_duplicate_phase_key "$root"
  snapshot_tree "$root" "$before"
  capture_checker "$root" "$output" "$status_file"
  [[ "$(<"$status_file")" == 1 ]] || fail 'zero-mutation invalid fixture did not fail'
  snapshot_tree "$root" "$after"
  cmp -s "$before" "$after" || fail 'checker mutated an invalid fixture'
  pass "$name"
}

run_bad_root_case() {
  local root="$tmp_root/absent-root" output="$tmp_root/bad-root.out" status
  set +e
  GOBBI_STARTUP_CHECK_REPO_ROOT="$root" bash "$checker" > "$output" 2>&1
  status=$?
  set -e
  [[ "$status" == 2 ]] || fail 'bad-root did not exit 2'
  assert_exact_line "$output" "FAIL: $root: repository root: directory is absent"
  pass 'bad-root'
}

run_valid_case 'valid-v4'
run_valid_case 'allowed-legacy-literals'
run_failure_case 'missing-phase-entry' mutate_missing_phase \
  'FAIL: .gobbi/projects/gobbi/skills/startup/topics/specification.md: direct topic entry: declared phase '\''specification'\'' entry is absent or unreadable'
run_failure_case 'missing-overlay-child' mutate_missing_overlay \
  'FAIL: .gobbi/projects/gobbi/skills/startup/topics/product-lifecycle/web.md: overlay topic entry: declared by '\''topics/product-lifecycle.md'\'' but absent or unreadable'
run_failure_case 'duplicate-phase-key' mutate_duplicate_phase_key \
  'FAIL: .gobbi/projects/gobbi/skills/startup/SKILL.md: static phase registry: duplicate phase key '\''problem-definition'\'''
run_failure_case 'broken-link' mutate_broken_link \
  'FAIL: scripts/check-markdown-links.sh: Markdown link: BROKEN: .gobbi/projects/gobbi/skills/startup/topics/problem-definition.md -> missing.md'
run_failure_case 'forbidden-legacy-literal' mutate_forbidden_legacy \
  'FAIL: .gobbi/projects/gobbi/skills/startup/SKILL.md:27: legacy artifact reference: combined lifecycle artifact is current-schema content'
run_failure_case 'sixth-temporary-row' mutate_sixth_temporary_row \
  'FAIL: .gobbi/projects/gobbi/skills/startup/templates/startup.tmp.md: temporary Artifact Register: expected 5 aggregate rows, found 6'
run_failure_case 'missing-reviewed' mutate_missing_reviewed \
  'FAIL: .gobbi/projects/gobbi/skills/startup/templates/problem-definition.md: aggregate state set: must contain absent, draft, reviewed, stale, and confirmed'
run_failure_case 'second-route-owner' mutate_second_route_owner \
  'FAIL: .gobbi/projects/gobbi/skills/startup/SKILL.md: route ownership: expected one native TODO route owner declaration, found 2'
run_failure_case 'duplicate-alias-owner' mutate_duplicate_alias \
  'FAIL: .gobbi/projects/gobbi/skills/startup/topics/product-lifecycle/web.md: active alias owner: alias '\''product-common'\'' is already owned by .gobbi/projects/gobbi/skills/startup/topics/product-lifecycle.md'
run_failure_case 'missing-migration-disposition' mutate_missing_disposition \
  "FAIL: .gobbi/projects/gobbi/skills/startup/topics/alias-migration.tsv:2: migration disposition: 'problem-common' has missing or invalid disposition ''"
run_failure_case 'extra-synthesis-child' mutate_extra_synthesis_child \
  'FAIL: .gobbi/projects/gobbi/skills/startup/templates/startup.md: synthesis child register: expected 5 aggregate rows, found 6'
run_failure_case 'wrong-durable-count' mutate_wrong_durable_count \
  'FAIL: .gobbi/projects/gobbi/skills/startup/SKILL.md: durable artifact count: schema 4 must declare exactly six durable files'
run_bad_root_case
run_zero_mutation_case

printf 'Startup contract tests passed: %d cases\n' "$tests_run"
