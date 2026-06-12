#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_parent="$repo_root/.gobbi/projects/gobbi/tmp"
mkdir -p "$tmp_parent"
tmp_root="$(mktemp -d "$tmp_parent/codex-plugin-smoke.XXXXXX")"
codex_home="$tmp_root/codex-home"
codex_sqlite_home="$tmp_root/codex-sqlite"
warnings=0

cleanup() {
  rm -rf "$tmp_root"
}
trap cleanup EXIT

pass() {
  printf 'PASS %s\n' "$1"
}

warn() {
  printf 'WARN %s\n' "$1" >&2
  warnings=$((warnings + 1))
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

require_command codex
require_command jq

mkdir -p "$codex_home" "$codex_sqlite_home"

marketplace_add_json="$(codex_cmd plugin marketplace add "$repo_root" --json)"
marketplace_name="$(jq -r '.marketplaceName // empty' <<<"$marketplace_add_json")"
if [[ "$marketplace_name" == "gobbi-workspace" ]]; then
  pass "registered repo root as gobbi-workspace marketplace"
else
  fail "expected gobbi-workspace marketplace, got ${marketplace_name:-<empty>}"
fi

available_json="$(codex_cmd plugin list --marketplace gobbi-workspace --available --json)"
if jq -e '.available[]? | select(.pluginId == "gobbi@gobbi-workspace")' <<<"$available_json" >/dev/null; then
  pass "gobbi@gobbi-workspace is available"
else
  fail "gobbi@gobbi-workspace is not available after marketplace registration"
fi

install_json="$(codex_cmd plugin add gobbi@gobbi-workspace --json)"
installed_path="$(jq -r '.installedPath // empty' <<<"$install_json")"
if [[ -n "$installed_path" && -d "$installed_path" ]]; then
  pass "installed gobbi@gobbi-workspace into isolated Codex home"
else
  fail "plugin add did not return an installed cache path"
fi

installed_json="$(codex_cmd plugin list --marketplace gobbi-workspace --available --json)"
if jq -e '.installed[]? | select(.pluginId == "gobbi@gobbi-workspace" and .enabled == true)' <<<"$installed_json" >/dev/null; then
  pass "gobbi@gobbi-workspace is installed and enabled"
else
  fail "gobbi@gobbi-workspace is not installed and enabled after plugin add"
fi

for required_file in \
  ".codex-plugin/plugin.json" \
  ".claude-plugin/plugin.json"; do
  if [[ -f "$installed_path/$required_file" ]]; then
    pass "installed cache contains $required_file"
  else
    fail "installed cache missing $required_file"
  fi
done

for component_path in \
  "skills/codex/SKILL.md" \
  "skills/principles/SKILL.md" \
  "hooks/codex-hooks.json"; do
  if [[ -f "$installed_path/$component_path" ]]; then
    pass "installed cache contains $component_path"
  else
    warn "installed cache missing $component_path; Codex may not dereference this symlinked component path"
  fi
done

if [[ -d "$installed_path/agents" ]]; then
  pass "installed cache contains agents directory (informational; Codex custom agents remain repo-local)"
else
  warn "installed cache missing agents directory (acceptable only because Codex custom agents remain repo-local)"
fi

if [[ "$warnings" -gt 0 ]]; then
  printf 'Codex plugin smoke completed with %s installed-cache warning(s)\n' "$warnings"
else
  printf 'Codex plugin smoke passed without installed-cache warnings\n'
fi
