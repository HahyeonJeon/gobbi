#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
package_root="$repo_root/plugins/gobbi"
check_mode=false

if [[ "${1:-}" == "--check" ]]; then
  check_mode=true
elif [[ $# -gt 0 ]]; then
  printf 'usage: %s [--check]\n' "$0" >&2
  exit 2
fi

expected_skills='../../.gobbi/projects/gobbi/skills'
expected_agents='../../.gobbi/projects/gobbi/agents'
expected_hooks='../../.gobbi/projects/gobbi/hooks'
expected_dev_session_start='../../.gobbi/projects/gobbi/hooks/session-start.sh'
expected_dev_post_tool_use='../../.gobbi/projects/gobbi/hooks/post-tool-use-agents.sh'

check_link() {
  local path="$1"
  local target="$2"

  if [[ ! -L "$path" ]]; then
    printf '%s is not a symlink\n' "$path" >&2
    return 1
  fi

  local actual
  actual="$(readlink "$path")"
  if [[ "$actual" != "$target" ]]; then
    printf '%s points to %s; expected %s\n' "$path" "$actual" "$target" >&2
    return 1
  fi

  if [[ ! -e "$path" ]]; then
    printf '%s points to a missing target\n' "$path" >&2
    return 1
  fi
}

if $check_mode; then
  check_link "$package_root/skills" "$expected_skills"
  check_link "$package_root/agents" "$expected_agents"
  check_link "$package_root/hooks" "$expected_hooks"
  check_link "$repo_root/.claude/hooks/session-start.sh" "$expected_dev_session_start"
  check_link "$repo_root/.claude/hooks/post-tool-use-agents.sh" "$expected_dev_post_tool_use"
  test -f "$repo_root/.gobbi/projects/gobbi/hooks/hooks.json"
  printf 'plugins/gobbi package symlinks are in sync\n'
  exit 0
fi

mkdir -p "$repo_root/.claude/hooks"
rm -rf "$package_root/skills" "$package_root/agents" "$package_root/hooks"
rm -f "$repo_root/.claude/hooks/session-start.sh" "$repo_root/.claude/hooks/post-tool-use-agents.sh"

ln -s "$expected_skills" "$package_root/skills"
ln -s "$expected_agents" "$package_root/agents"
ln -s "$expected_hooks" "$package_root/hooks"
ln -s "$expected_dev_session_start" "$repo_root/.claude/hooks/session-start.sh"
ln -s "$expected_dev_post_tool_use" "$repo_root/.claude/hooks/post-tool-use-agents.sh"

printf 'restored plugins/gobbi package symlinks\n'
