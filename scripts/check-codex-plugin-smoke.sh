#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
package_root="$repo_root/plugins/gobbi"
tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/codex-plugin-smoke.XXXXXX")"
codex_home="$tmp_root/codex-home"
codex_sqlite_home="$tmp_root/codex-sqlite"

cleanup() {
  if [[ -d "$tmp_root" && ! -L "$tmp_root" ]]; then
    find "$tmp_root" -depth -mindepth 1 -delete
    rmdir "$tmp_root"
  fi
}
trap cleanup EXIT

pass() {
  printf 'PASS %s\n' "$1"
}

fail() {
  printf 'FAIL %s\n' "$1" >&2
  exit 1
}

require_command() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    pass "$name is available"
  else
    fail "$name is required"
  fi
}

codex_cmd() {
  env CODEX_HOME="$codex_home" CODEX_SQLITE_HOME="$codex_sqlite_home" codex "$@"
}

hookless_tree() {
  local root="$1"
  local codex_manifest="$root/.codex-plugin/plugin.json"
  local claude_manifest="$root/.claude-plugin/plugin.json"
  [[ ! -e "$root/hooks" && ! -L "$root/hooks" ]] || return 1
  [[ -f "$codex_manifest" ]] || return 1
  jq -e 'has("hooks") | not' "$codex_manifest" >/dev/null 2>&1 || return 1
  if [[ -f "$claude_manifest" ]]; then
    jq -e 'has("hooks") | not' "$claude_manifest" >/dev/null 2>&1 || return 1
  fi
}

test_hook_rejection() {
  local fixture="$tmp_root/injected-hook-fixture"
  mkdir -p "$fixture/.codex-plugin" "$fixture/hooks"
  printf '%s\n' '{"name":"gobbi","version":"1.0.0","skills":"./skills/"}' > "$fixture/.codex-plugin/plugin.json"
  printf '%s\n' injected > "$fixture/hooks/injected.txt"
  if hookless_tree "$fixture"; then
    fail 'installed-cache hook guard accepted an injected hooks component'
  fi
  pass 'installed-cache guard rejects an injected hooks component'
}

# The Codex installer copies nothing behind a symlink, at any depth. That produces two distinct
# broken packages, so this check reports them separately, before and after the install:
#
#   1. a symlinked component root delivers no component at all;
#   2. a symlink left inside a materialized component directory drops exactly that path.
#
# Neither is a limitation to note in a package meant to ship. Both are failures, and they are
# kept apart because they have different repairs.
component_is_materialized() {
  local component_dir="$1"
  [[ -d "$component_dir" && ! -L "$component_dir" ]]
}

require_materialized_component() {
  local component="$1"
  if component_is_materialized "$package_root/$component"; then
    pass "plugins/gobbi/$component is a materialized component directory"
  else
    fail "plugins/gobbi/$component is not a materialized directory; the package is not materialized and the Codex installer installs nothing behind a symlinked component (generate it with: bash scripts/sync-plugin-package.sh --materialize-package)"
  fi
}

test_materialization_guard() {
  local fixture="$tmp_root/materialization-fixture"
  mkdir -p "$fixture/materialized/skills" "$fixture/symlinked" "$fixture/canonical-skills"
  printf '%s\n' fixture > "$fixture/materialized/skills/SKILL.md"
  ln -s '../canonical-skills' "$fixture/symlinked/skills"

  component_is_materialized "$fixture/materialized/skills" \
    || fail 'materialization guard rejected a generated component directory'
  ! component_is_materialized "$fixture/symlinked/skills" \
    || fail 'materialization guard accepted a symlinked component directory'
  ! component_is_materialized "$fixture/absent/skills" \
    || fail 'materialization guard accepted a missing component directory'
  pass 'materialization guard rejects a symlinked or absent component directory'
}

check_installed_allow_set() {
  local root="$1" entry name
  local allowed=' .codex-plugin .claude-plugin skills agents '
  while IFS= read -r -d '' entry; do
    name="${entry##*/}"
    case "$allowed" in
      *" $name "*) ;;
      *) fail "installed cache contains unsupported top-level entry: $name" ;;
    esac
  done < <(find "$root" -mindepth 1 -maxdepth 1 -print0)
  pass 'installed cache top level is limited to manifests, skills, and agents'
}

installed_tree_matches_package() {
  local expected_root="$1" actual_root="$2" rel index
  local -a expected_files=() actual_files=()

  while IFS= read -r -d '' rel; do
    expected_files+=("$rel")
  done < <(cd "$expected_root" && find . -type f -print0 | LC_ALL=C sort -z)
  while IFS= read -r -d '' rel; do
    actual_files+=("$rel")
  done < <(cd "$actual_root" && find . -type f -print0 | LC_ALL=C sort -z)

  [[ ${#expected_files[@]} -eq ${#actual_files[@]} ]] || return 1
  for ((index = 0; index < ${#expected_files[@]}; index++)); do
    rel="${expected_files[$index]}"
    [[ "$rel" == "${actual_files[$index]}" ]] || return 1
    cmp -s "$expected_root/$rel" "$actual_root/$rel" || return 1
  done
}

test_complete_installed_inventory_guard() {
  local expected="$tmp_root/complete-inventory-expected"
  local omitted="$tmp_root/complete-inventory-omitted"
  local changed="$tmp_root/complete-inventory-changed"

  mkdir -p "$expected/skills/root/child" "$expected/agents" \
    "$omitted/skills/root/child" "$omitted/agents" \
    "$changed/skills/root/child" "$changed/agents"
  printf '%s\n' root > "$expected/skills/root/SKILL.md"
  printf '%s\n' nested > "$expected/skills/root/child/SKILL.md"
  printf '%s\n' agent > "$expected/agents/manager.md"
  printf '%s\n' root > "$omitted/skills/root/SKILL.md"
  printf '%s\n' agent > "$omitted/agents/manager.md"
  printf '%s\n' root > "$changed/skills/root/SKILL.md"
  printf '%s\n' changed > "$changed/skills/root/child/SKILL.md"
  printf '%s\n' agent > "$changed/agents/manager.md"

  ! installed_tree_matches_package "$expected" "$omitted" \
    || fail 'complete installed-cache inventory guard accepted an omitted nested leaf'
  ! installed_tree_matches_package "$expected" "$changed" \
    || fail 'complete installed-cache inventory guard accepted byte-different installed content'
  pass 'complete installed-cache inventory guard rejects omitted and byte-different leaves'
}

require_command codex
require_command jq
require_command cmp
test_hook_rejection
test_materialization_guard
test_complete_installed_inventory_guard

if hookless_tree "$repo_root/plugins/gobbi"; then
  pass 'source package is hookless before installation'
else
  fail 'source package contains a hooks field or hooks component'
fi

# Failure shape 1, caught before the install because it is a source-topology fact and the
# install would only restate it as every path missing at once.
for component in skills agents; do
  require_materialized_component "$component"
done

mkdir -p "$codex_home" "$codex_sqlite_home"

marketplace_add_json="$(codex_cmd plugin marketplace add "$repo_root" --json)"
marketplace_name="$(jq -r '.marketplaceName // empty' <<<"$marketplace_add_json")"
if [[ "$marketplace_name" == 'gobbi-workspace' ]]; then
  pass 'registered repo root as gobbi-workspace marketplace'
else
  fail "expected gobbi-workspace marketplace, got ${marketplace_name:-<empty>}"
fi

available_json="$(codex_cmd plugin list --marketplace gobbi-workspace --available --json)"
if jq -e '.available[]? | select(.pluginId == "gobbi@gobbi-workspace")' <<<"$available_json" >/dev/null; then
  pass 'gobbi@gobbi-workspace is available'
else
  fail 'gobbi@gobbi-workspace is not available after marketplace registration'
fi

install_json="$(codex_cmd plugin add gobbi@gobbi-workspace --json)"
installed_path="$(jq -r '.installedPath // empty' <<<"$install_json")"
if [[ -n "$installed_path" && -d "$installed_path" ]]; then
  pass 'installed gobbi@gobbi-workspace into isolated Codex home'
else
  fail 'plugin add did not return an installed cache path'
fi

installed_json="$(codex_cmd plugin list --marketplace gobbi-workspace --available --json)"
if jq -e '.installed[]? | select(.pluginId == "gobbi@gobbi-workspace" and .enabled == true)' <<<"$installed_json" >/dev/null; then
  pass 'gobbi@gobbi-workspace is installed and enabled'
else
  fail 'gobbi@gobbi-workspace is not installed and enabled after plugin add'
fi

for required_file in \
  '.codex-plugin/plugin.json' \
  '.claude-plugin/plugin.json'; do
  if [[ -f "$installed_path/$required_file" ]]; then
    pass "installed cache contains $required_file"
  else
    fail "installed cache missing $required_file"
  fi
done

if hookless_tree "$installed_path"; then
  pass 'installed cache contains no hook manifest field or hook component'
else
  fail 'installed cache contains a hook manifest field or hook component'
fi
check_installed_allow_set "$installed_path"

# Failure shape 2. Compare the complete installed inventory and bytes, because a materialized
# component that still hides a symlink loses only that nested path. Sampling cannot establish an
# intact package.
if installed_tree_matches_package "$package_root" "$installed_path"; then
  pass 'installed cache file inventory and bytes match every packaged manifest, skill, and agent file'
else
  fail 'installed cache file inventory or bytes differ from plugins/gobbi; check the mismatched package path for a symlink or stale generated copy, then regenerate with: bash scripts/sync-plugin-package.sh --materialize-package'
fi

printf 'Codex plugin smoke passed: the materialized package reached the installed cache intact\n'
