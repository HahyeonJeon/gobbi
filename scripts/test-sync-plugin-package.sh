#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
sync_script="$repo_root/scripts/sync-plugin-package.sh"
tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/gobbi-sync-tests.XXXXXX")"
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

assert_file_contains() {
  local path="$1" pattern="$2"
  grep -F -- "$pattern" "$path" >/dev/null || fail "$path does not contain: $pattern"
}

make_fixture() {
  local root="$1"
  mkdir -p \
    "$root/.gobbi/projects/gobbi/skills" \
    "$root/.gobbi/projects/gobbi/agents" \
    "$root/.gobbi/projects/gobbi/hooks" \
    "$root/.agents/skills" \
    "$root/.claude/skills" \
    "$root/.claude/hooks" \
    "$root/plugins/gobbi/.codex-plugin" \
    "$root/plugins/gobbi/.claude-plugin"
  printf '{}\n' > "$root/plugins/gobbi/.codex-plugin/plugin.json"
  printf '{}\n' > "$root/plugins/gobbi/.claude-plugin/plugin.json"
  printf '#!/usr/bin/env bash\n' > "$root/.gobbi/projects/gobbi/hooks/session-start.sh"
  printf '#!/usr/bin/env bash\n' > "$root/.gobbi/projects/gobbi/hooks/post-tool-use-agents.sh"
  printf '#!/usr/bin/env bash\n' > "$root/.gobbi/projects/gobbi/hooks/session-end.sh"
}

write_skill_file() {
  local root="$1" skill="$2" rel="$3" content="${4:-fixture}"
  mkdir -p "$(dirname "$root/.gobbi/projects/gobbi/skills/$skill/$rel")"
  printf '%s\n' "$content" > "$root/.gobbi/projects/gobbi/skills/$skill/$rel"
}

mirror_target() {
  local skill="$1" rel="$2"
  local slashes="${rel//[!\/]/}"
  local depth=$((3 + ${#slashes}))
  local prefix='' i
  for ((i = 0; i < depth; i++)); do
    prefix+='../'
  done
  printf '%s.gobbi/projects/gobbi/skills/%s/%s' "$prefix" "$skill" "$rel"
}

make_owned_mirror_link() {
  local root="$1" skill="$2" rel="$3"
  local path="$root/.claude/skills/$skill/$rel"
  mkdir -p "$(dirname "$path")"
  ln -s "$(mirror_target "$skill" "$rel")" "$path"
}

run_sync() {
  local root="$1"
  shift
  GOBBI_SYNC_REPO_ROOT="$root" bash "$sync_script" "$@"
}

snapshot_mirror() {
  local root="$1" output="$2"
  local mirror="$root/.claude/skills" entry rel raw digest inventory sorted_inventory

  : > "$output"
  if [[ -L "$mirror" ]]; then
    printf 'root-symlink\t%s\n' "$(readlink -- "$mirror")" >> "$output"
    return 0
  fi
  if [[ ! -e "$mirror" ]]; then
    printf 'root-missing\n' >> "$output"
    return 0
  fi
  if [[ ! -d "$mirror" ]]; then
    digest="$(sha256sum "$mirror" | awk '{print $1}')"
    printf 'root-file\t%s\n' "$digest" >> "$output"
    return 0
  fi

  inventory="$(mktemp "$tmp_root/snapshot-inventory.XXXXXX")"
  sorted_inventory="$(mktemp "$tmp_root/snapshot-sorted.XXXXXX")"
  find "$mirror" -mindepth 0 -print0 > "$inventory"
  LC_ALL=C sort -z "$inventory" > "$sorted_inventory"
  while IFS= read -r -d '' entry; do
    rel="${entry#"$mirror"}"
    rel="${rel#/}"
    [[ -n "$rel" ]] || rel='.'
    if [[ -L "$entry" ]]; then
      raw="$(readlink -- "$entry")"
      printf 'l\t%s\t%s\n' "$rel" "$raw"
    elif [[ -d "$entry" ]]; then
      printf 'd\t%s\t-\n' "$rel"
    elif [[ -f "$entry" ]]; then
      digest="$(sha256sum "$entry" | awk '{print $1}')"
      printf 'f\t%s\t%s\n' "$rel" "$digest"
    else
      printf 'o\t%s\t%s\n' "$rel" "$(stat -c '%F' "$entry")"
    fi
  done < "$sorted_inventory" >> "$output"
}

assert_unsafe_zero_mutation() {
  local name="$1" root="$2" reason="$3"
  local before="$tmp_root/$name.before" after="$tmp_root/$name.after" log="$tmp_root/$name.log"

  snapshot_mirror "$root" "$before"
  if run_sync "$root" > "$log" 2>&1; then
    fail "$name unexpectedly succeeded"
  fi
  snapshot_mirror "$root" "$after"
  cmp -s "$before" "$after" || fail "$name mutated .claude/skills before rejecting the unsafe fixture"
  assert_file_contains "$log" '.claude/skills reconciliation aborted before mutation'
  assert_file_contains "$log" "$reason"
  pass "$name fails closed with an exact mirror snapshot"
}

prepare_synced_fixture() {
  local root="$1"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
}

test_safe_reconciliation() {
  local root="$tmp_root/safe" first="$tmp_root/safe.first" second="$tmp_root/safe.second"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  write_skill_file "$root" alpha workflow/current.md '# Current'
  write_skill_file "$root" beta SKILL.md '# Beta'

  make_owned_mirror_link "$root" alpha SKILL.md
  make_owned_mirror_link "$root" alpha removed.md
  make_owned_mirror_link "$root" alpha old/nested/removed.md
  make_owned_mirror_link "$root" retired SKILL.md
  make_owned_mirror_link "$root" retired deep/old.md

  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  [[ -L "$root/.claude/skills/alpha/workflow/current.md" ]] || fail 'missing expected nested link was not created'
  [[ -L "$root/.claude/skills/beta/SKILL.md" ]] || fail 'missing expected skill mirror was not created'
  [[ ! -e "$root/.claude/skills/alpha/removed.md" && ! -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'dangling stale owned leaf survived'
  [[ ! -e "$root/.claude/skills/alpha/old" ]] || fail 'nested stale real directories survived'
  [[ ! -e "$root/.claude/skills/retired" ]] || fail 'whole stale skill directory survived'

  snapshot_mirror "$root" "$first"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$second"
  cmp -s "$first" "$second" || fail 'second safe sync was not idempotent'
  pass 'safe reconciliation prunes stale owned leaves and dirs, fills gaps, and is idempotent'
}

test_unsafe_regular_file() {
  local root="$tmp_root/unsafe-regular"
  prepare_synced_fixture "$root"
  printf 'user data\n' > "$root/.claude/skills/alpha/user.txt"
  assert_unsafe_zero_mutation unsafe-regular "$root" 'regular files are never generator-owned mirror leaves'
}

test_unsafe_wrong_target() {
  local root="$tmp_root/unsafe-wrong-target"
  prepare_synced_fixture "$root"
  ln -s '../../../.gobbi/projects/gobbi/skills/alpha/not-the-same.md' "$root/.claude/skills/alpha/wrong.md"
  assert_unsafe_zero_mutation unsafe-wrong-target "$root" 'raw symlink target is'
}

test_unsafe_directory_symlink() {
  local root="$tmp_root/unsafe-directory-symlink"
  prepare_synced_fixture "$root"
  mkdir -p "$root/outside-dir"
  ln -s '../../../outside-dir' "$root/.claude/skills/alpha/dir-link"
  assert_unsafe_zero_mutation unsafe-directory-symlink "$root" 'directory symlinks are forbidden'
}

test_unsafe_dot_entry() {
  local root="$tmp_root/unsafe-dot-entry"
  prepare_synced_fixture "$root"
  mkdir -p "$root/.claude/skills/alpha/.protected"
  printf 'hidden\n' > "$root/.claude/skills/alpha/.protected/data"
  assert_unsafe_zero_mutation unsafe-dot-entry "$root" 'path contains a dot-prefixed or traversal component'
}

test_unsafe_path_escape() {
  local root="$tmp_root/unsafe-path-escape"
  prepare_synced_fixture "$root"
  ln -s '../../../../outside-file' "$root/.claude/skills/alpha/escape.md"
  assert_unsafe_zero_mutation unsafe-path-escape "$root" 'symlink target escapes the generator-owned canonical root'
}

test_mixed_safe_and_unsafe() {
  local root="$tmp_root/mixed-safe-unsafe"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  printf 'user data\n' > "$root/.claude/skills/alpha/user.txt"
  assert_unsafe_zero_mutation mixed-safe-unsafe "$root" 'regular files are never generator-owned mirror leaves'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'safe stale leaf was removed despite a mixed unsafe preflight'
}

test_forward_and_back_rollback() {
  local root="$tmp_root/rollback" initial="$tmp_root/rollback.initial" restored="$tmp_root/rollback.restored"
  make_fixture "$root"
  write_skill_file "$root" delegation SKILL.md '# Delegation'
  write_skill_file "$root" delegation templates/producer.md '# Producer'
  write_skill_file "$root" orchestration SKILL.md '# Orchestration'
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$initial"

  mkdir -p "$root/.gobbi/projects/gobbi/skills/orchestration/templates"
  mv "$root/.gobbi/projects/gobbi/skills/delegation/templates/producer.md" \
    "$root/.gobbi/projects/gobbi/skills/orchestration/templates/producer.md"
  rmdir "$root/.gobbi/projects/gobbi/skills/delegation/templates"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  [[ ! -e "$root/.claude/skills/delegation/templates" ]] || fail 'forward owner move left the old mirror path'
  [[ -L "$root/.claude/skills/orchestration/templates/producer.md" ]] || fail 'forward owner move did not create the new mirror path'

  mkdir -p "$root/.gobbi/projects/gobbi/skills/delegation/templates"
  mv "$root/.gobbi/projects/gobbi/skills/orchestration/templates/producer.md" \
    "$root/.gobbi/projects/gobbi/skills/delegation/templates/producer.md"
  rmdir "$root/.gobbi/projects/gobbi/skills/orchestration/templates"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$restored"
  cmp -s "$initial" "$restored" || fail 'forward/back rollback did not restore the original derived mirror'
  pass 'forward and backward owner moves converge without hand-editing aliases'
}

build_scale_fixture() {
  local root="$1" count="$2" i
  make_fixture "$root"
  write_skill_file "$root" scale SKILL.md '# Scale'
  for ((i = 1; i <= count; i++)); do
    write_skill_file "$root" scale "nested/file-$i.md" "file $i"
  done
}

metric_value() {
  local path="$1" key="$2"
  awk -F= -v wanted="$key" '$1 == wanted { print $2 }' "$path"
}

test_bounded_walks() {
  local small_root="$tmp_root/scale-small" large_root="$tmp_root/scale-large"
  local small_metrics="$tmp_root/scale-small.metrics" large_metrics="$tmp_root/scale-large.metrics"
  local small_inspected large_inspected
  build_scale_fixture "$small_root" 40
  build_scale_fixture "$large_root" 80

  GOBBI_SYNC_REPO_ROOT="$small_root" GOBBI_SYNC_METRICS_FILE="$small_metrics" bash "$sync_script" >/dev/null
  GOBBI_SYNC_REPO_ROOT="$large_root" GOBBI_SYNC_METRICS_FILE="$large_metrics" bash "$sync_script" >/dev/null
  [[ "$(metric_value "$small_metrics" canonical_walks)" == 1 ]] || fail 'small fixture did not use one canonical full-tree walk'
  [[ "$(metric_value "$small_metrics" mirror_walks)" == 1 ]] || fail 'small fixture did not use one mirror full-tree walk'
  [[ "$(metric_value "$large_metrics" canonical_walks)" == 1 ]] || fail 'large fixture did not use one canonical full-tree walk'
  [[ "$(metric_value "$large_metrics" mirror_walks)" == 1 ]] || fail 'large fixture did not use one mirror full-tree walk'
  small_inspected="$(metric_value "$small_metrics" inspected_entries)"
  large_inspected="$(metric_value "$large_metrics" inspected_entries)"
  ((large_inspected > small_inspected)) || fail 'doubling the fixture did not increase inspected entries'
  ((large_inspected <= small_inspected * 2 + 4)) || fail 'doubling the fixture caused super-proportional inspection work'
  pass 'whole-tree walks stay constant and doubled input grows inspected entries proportionally'
}

test_static_deletion_guards() {
  if grep -Eq 'rm[[:space:]]+-[^[:space:]]*r[^[:space:]]*f|rm[[:space:]]+-[^[:space:]]*f[^[:space:]]*r' "$sync_script"; then
    fail 'sync script contains recursive forced deletion'
  fi
  if grep -Eq 'find[[:space:]]+-L|find[^\n]*\.claude/skills[^\n]*[[:space:]]-L' "$sync_script"; then
    fail 'sync script follows directory symlinks during mirror traversal'
  fi
  pass 'sync source contains no recursive forced deletion or following mirror walk'
}

test_static_deletion_guards
test_safe_reconciliation
test_unsafe_regular_file
test_unsafe_wrong_target
test_unsafe_directory_symlink
test_unsafe_dot_entry
test_unsafe_path_escape
test_mixed_safe_and_unsafe
test_forward_and_back_rollback
test_bounded_walks

printf 'PASS: %d sync reconciliation tests completed\n' "$tests_run"
