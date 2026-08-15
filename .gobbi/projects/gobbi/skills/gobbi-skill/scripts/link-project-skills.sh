#!/usr/bin/env bash

set -euo pipefail
export LC_ALL=C

# Initialize missing Claude Code, Codex, and Grok skill links for canonical project skills.
# Existing discovery directories are not migrated or deleted.

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

check_discovery_root() {
  local path="$1"

  if [[ -L "$path" ]]; then
    fail "discovery path is a symlink: ${path#"$project_root"/}"
  fi
  if [[ -e "$path" && ! -d "$path" ]]; then
    fail "discovery path is not a directory: ${path#"$project_root"/}"
  fi
}

check_skill_link() {
  local link_path="$1"
  local expected_target="$2"
  local actual_target
  local target_summary

  if [[ -L "$link_path" ]]; then
    actual_target="$(readlink "$link_path")" \
      || fail "cannot read symlink: ${link_path#"$project_root"/}"
    if [[ "$actual_target" != "$expected_target" ]]; then
      target_summary="actual '$actual_target', expected '$expected_target'"
      fail "symlink target differs for ${link_path#"$project_root"/}: $target_summary"
    fi
    if [[ ! -f "$link_path/SKILL.md" ]]; then
      fail "symlink does not resolve to a skill: ${link_path#"$project_root"/}"
    fi
    return
  fi

  if [[ -e "$link_path" ]]; then
    if [[ -d "$link_path" ]]; then
      fail "existing skill directory is not migrated: ${link_path#"$project_root"/}"
    fi
    fail "skill discovery entry already exists and is not a symlink: ${link_path#"$project_root"/}"
  fi
}

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

for discovery_root in "$project_root/.claude/skills" "$project_root/.agents/skills"; do
  check_discovery_root "${discovery_root%/skills}"
  check_discovery_root "$discovery_root"
done

for skill_path in "${skill_paths[@]}"; do
  skill_name="${skill_path##*/}"
  expected_target="../../$skills_relative/$skill_name"
  check_skill_link "$project_root/.claude/skills/$skill_name" "$expected_target"
  check_skill_link "$project_root/.agents/skills/$skill_name" "$expected_target"
done

mkdir -p "$project_root/.claude/skills" "$project_root/.agents/skills"

created_count=0
for skill_path in "${skill_paths[@]}"; do
  skill_name="${skill_path##*/}"
  expected_target="../../$skills_relative/$skill_name"

  for discovery_root in "$project_root/.claude/skills" "$project_root/.agents/skills"; do
    link_path="$discovery_root/$skill_name"
    if [[ -L "$link_path" ]]; then
      continue
    fi
    ln -s "$expected_target" "$link_path"
    printf 'linked %s -> %s\n' "${link_path#"$project_root"/}" "$expected_target"
    ((created_count += 1))
  done
done

printf 'project skills ready: %d skills, %d links created\n' "$skill_count" "$created_count"
