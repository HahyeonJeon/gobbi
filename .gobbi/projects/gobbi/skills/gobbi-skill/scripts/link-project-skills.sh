#!/usr/bin/env bash

set -euo pipefail
export LC_ALL=C

# Refuse a second Gobbi skill tree under .cursor/skills.
# Grok scans that directory, so those links register local:gobbi beside the plugin.
# Does not create .claude/skills, .grok/skills, .agents/skills, or .cursor/skills.

fail() {
  printf 'error: %s\n' "$1" >&2
  exit 1
}

if (( $# != 0 )); then
  printf 'usage: %s\n' "$0" >&2
  exit 2
fi

script_dir="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
skills_root="$(cd -- "$script_dir/../.." && pwd -P)"
project_root="$(git -C "$script_dir" rev-parse --show-toplevel 2>/dev/null)" \
  || fail 'the Gobbi Skill script must be inside a Git worktree'
project_root="$(cd -- "$project_root" && pwd -P)"

if [[ "$skills_root" != "$project_root/"* ]]; then
  fail 'the Gobbi skills root must be inside the current Git worktree'
fi

skills_relative="${skills_root#"$project_root"/}"
case "$skills_relative" in
  .gobbi/projects/*/skills) ;;
  *) fail 'the script must run from a project-local .gobbi skill tree' ;;
esac

project_name="${skills_relative#.gobbi/projects/}"
project_name="${project_name%/skills}"
if [[ -z "$project_name" || "$project_name" == */* ]]; then
  fail 'the Gobbi skills root must use .gobbi/projects/{project}/skills'
fi

skill_paths=()
for skill_path in "$skills_root"/*; do
  if [[ -L "$skill_path" ]]; then
    if [[ -f "$skill_path/SKILL.md" || -L "$skill_path/SKILL.md" ]]; then
      fail "canonical skill directory is a symlink: ${skill_path#"$project_root"/}"
    fi
    continue
  fi
  [[ -d "$skill_path" ]] || continue

  entry_path="$skill_path/SKILL.md"
  if [[ -L "$entry_path" ]]; then
    fail "canonical skill entrypoint is a symlink: ${entry_path#"$project_root"/}"
  fi
  [[ -f "$entry_path" ]] || continue
  [[ -r "$entry_path" ]] \
    || fail "canonical skill entrypoint is unreadable: ${entry_path#"$project_root"/}"

  resolved_skill_path="$(cd -- "$skill_path" && pwd -P)"
  if [[ "$resolved_skill_path" != "$skills_root/${skill_path##*/}" ]]; then
    fail "canonical skill resolves outside its owned path: ${skill_path#"$project_root"/}"
  fi
  skill_paths+=("$skill_path")
done

skill_count="${#skill_paths[@]}"
if (( skill_count == 0 )); then
  fail "no skills with SKILL.md were found under $skills_relative"
fi

cursor_skills="$project_root/.cursor/skills"
for skill_path in "${skill_paths[@]}"; do
  skill_name="${skill_path##*/}"
  if [[ -e "$cursor_skills/$skill_name" || -L "$cursor_skills/$skill_name" ]]; then
    fail ".cursor/skills/$skill_name is a second skill tree"
  fi
done

printf 'project skills ready: %d canonical skills, no runtime skill links\n' "$skill_count"
