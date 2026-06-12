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

expected_plugin_skills='../../.gobbi/projects/gobbi/skills'
expected_plugin_agents='../../.gobbi/projects/gobbi/agents'
expected_plugin_hooks='../../.gobbi/projects/gobbi/hooks'

expected_dev_session_start='../../.gobbi/projects/gobbi/hooks/session-start.sh'
expected_dev_post_tool_use='../../.gobbi/projects/gobbi/hooks/post-tool-use-agents.sh'
expected_dev_session_end='../../.gobbi/projects/gobbi/hooks/session-end.sh'

check_link() {
  local link_path="$1"
  local expected_target="$2"

  if [[ ! -L "$link_path" ]]; then
    printf '%s is not a symlink\n' "$link_path" >&2
    return 1
  fi

  local actual_target
  actual_target="$(readlink "$link_path")"
  if [[ "$actual_target" != "$expected_target" ]]; then
    printf '%s points to %s; expected %s\n' "$link_path" "$actual_target" "$expected_target" >&2
    return 1
  fi

  if [[ ! -e "$link_path" ]]; then
    printf '%s points to a missing target\n' "$link_path" >&2
    return 1
  fi
}

ensure_link() {
  local link_path="$1"
  local expected_target="$2"

  if [[ -e "$link_path" && ! -L "$link_path" ]]; then
    printf '%s exists and is not a symlink; move it aside before syncing\n' "$link_path" >&2
    return 1
  fi

  if [[ -L "$link_path" ]]; then
    local actual_target
    actual_target="$(readlink "$link_path")"
    if [[ "$actual_target" == "$expected_target" && -e "$link_path" ]]; then
      return 0
    fi
    rm -f "$link_path"
  fi

  mkdir -p "$(dirname "$link_path")"
  ln -s "$expected_target" "$link_path"
}

for_each_canonical_skill() {
  local skill_dir
  for skill_dir in "$repo_root"/.gobbi/projects/gobbi/skills/*; do
    [[ -d "$skill_dir" ]] || continue
    printf '%s\n' "${skill_dir##*/}"
  done | sort
}

if $check_mode; then
  while IFS= read -r skill_name; do
    check_link "$repo_root/.agents/skills/$skill_name" "../../.gobbi/projects/gobbi/skills/$skill_name"
  done < <(for_each_canonical_skill)

  check_link "$package_root/skills" "$expected_plugin_skills"
  check_link "$package_root/agents" "$expected_plugin_agents"
  check_link "$package_root/hooks" "$expected_plugin_hooks"
  check_link "$repo_root/.claude/hooks/session-start.sh" "$expected_dev_session_start"
  check_link "$repo_root/.claude/hooks/post-tool-use-agents.sh" "$expected_dev_post_tool_use"
  check_link "$repo_root/.claude/hooks/session-end.sh" "$expected_dev_session_end"
  test -f "$package_root/.codex-plugin/plugin.json"
  test -f "$package_root/.claude-plugin/plugin.json"
  printf 'Codex skill, plugins/gobbi, and .claude hook symlinks are intact\n'
  exit 0
fi

while IFS= read -r skill_name; do
  ensure_link "$repo_root/.agents/skills/$skill_name" "../../.gobbi/projects/gobbi/skills/$skill_name"
done < <(for_each_canonical_skill)

ensure_link "$package_root/skills" "$expected_plugin_skills"
ensure_link "$package_root/agents" "$expected_plugin_agents"
ensure_link "$package_root/hooks" "$expected_plugin_hooks"
ensure_link "$repo_root/.claude/hooks/session-start.sh" "$expected_dev_session_start"
ensure_link "$repo_root/.claude/hooks/post-tool-use-agents.sh" "$expected_dev_post_tool_use"
ensure_link "$repo_root/.claude/hooks/session-end.sh" "$expected_dev_session_end"

printf 'synchronized Codex skill, plugins/gobbi, and .claude hook symlinks\n'
