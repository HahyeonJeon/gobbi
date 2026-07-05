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

canonical_skills_root="$repo_root/.gobbi/projects/gobbi/skills"
claude_skills_drift=0

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

# Enumerate a canonical skill's agent-exposed children, recursively, as paths relative
# to the skill dir. The set is DERIVED from the canonical tree — no skill name, file
# name, or count is hardcoded. Dot-prefixed entries (e.g. .DS_Store, editor/cache files)
# are the generated/metadata class and are pruned at every level; everything else
# (.md docs, link-target data files like memory-vocabulary.json, scripts/ shell files,
# templates/ and workflow/ children) is an agent-exposed child.
agent_exposed_files() {
  local dir="$canonical_skills_root/$1"
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type f -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Enumerate the canonical skill's real subdirs (dot-pruned), relative to the skill dir.
# Used by the --check directory-parity pass that catches an empty stale mirror subdir.
agent_exposed_dirs() {
  local dir="$canonical_skills_root/$1"
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type d -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Enumerate the per-file mirror leaves under .claude/skills/{skill} (each a symlink, plus
# any stray real file), relative to the skill dir, dot entries excluded. No -L is needed:
# the mirror dirs are REAL and only the leaves are symlinks, so plain find lists every
# leaf and (correctly) does NOT descend a forbidden directory symlink — which then shows
# up as a stale dir-entry vs. the missing per-file children during the parity comparison.
claude_skill_mirror_files() {
  local dir="$repo_root/.claude/skills/$1"
  [[ -d "$dir" ]] || return 0
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o ! -type d -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Enumerate the mirror's REAL subdirs (no -L, so a forbidden directory symlink is excluded
# here and instead reported by the explicit dir-symlink guard). Used for directory parity.
claude_skill_mirror_dirs() {
  local dir="$repo_root/.claude/skills/$1"
  [[ -d "$dir" ]] || return 0
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type d -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Relative symlink target for a mirror leaf. The per-file `../` depth scales with the
# leaf's nesting level: a top-level file (.claude/skills/{skill}/{file}) needs 3, a
# support-subdir child (.claude/skills/{skill}/scripts|templates|workflow/{file}) needs 4,
# i.e. 3 + the number of directory segments in the relative path.
claude_link_target() {
  local skill="$1" rel="$2"
  local slashes="${rel//[!\/]/}"
  local depth=$(( 3 + ${#slashes} ))
  local prefix="" i
  for (( i = 0; i < depth; i++ )); do prefix+="../"; done
  printf '%s.gobbi/projects/gobbi/skills/%s/%s' "$prefix" "$skill" "$rel"
}

# Validate per-skill BIDIRECTIONAL parity for the .claude/skills mirror: the mirror's
# child set must equal the canonical skill's agent-exposed child set (a missing child OR a
# stale extra both count as drift), and every canonical child must resolve through a
# correctly-targeted symlink (find-L/readlink-e discipline). Sets a global drift flag
# rather than fail-fast, so one run reports every drifted entry. Always returns 0.
check_claude_skills_mirror() {
  local skill_name="$1"
  local mirror_dir="$repo_root/.claude/skills/$skill_name"
  local canonical mirror missing stale rel target actual link_path
  local canon_dirs mirror_dirs stale_dirs

  canonical="$(agent_exposed_files "$skill_name")"

  if [[ ! -d "$mirror_dir" ]]; then
    printf '.claude/skills/%s is missing (no mirror directory)\n' "$skill_name" >&2
    claude_skills_drift=1
    return 0
  fi

  mirror="$(claude_skill_mirror_files "$skill_name")"

  # comm must use the SAME collation as the LC_ALL=C sort in the producers above,
  # else it both warns "not in sorted order" and computes the set difference wrongly.
  missing="$(LC_ALL=C comm -23 <(printf '%s\n' "$canonical") <(printf '%s\n' "$mirror"))"
  stale="$(LC_ALL=C comm -13 <(printf '%s\n' "$canonical") <(printf '%s\n' "$mirror"))"

  if [[ -n "$missing" ]]; then
    while IFS= read -r rel; do
      [[ -n "$rel" ]] || continue
      printf '.claude/skills/%s/%s is missing from the mirror\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
    done <<< "$missing"
  fi

  if [[ -n "$stale" ]]; then
    while IFS= read -r rel; do
      [[ -n "$rel" ]] || continue
      printf '.claude/skills/%s/%s is a stale mirror entry (no canonical child)\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
    done <<< "$stale"
  fi

  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    link_path="$mirror_dir/$rel"
    target="$(claude_link_target "$skill_name" "$rel")"
    if [[ ! -L "$link_path" ]]; then
      if [[ -e "$link_path" ]]; then
        printf '.claude/skills/%s/%s exists and is not a symlink\n' "$skill_name" "$rel" >&2
        claude_skills_drift=1
      fi
      continue
    fi
    actual="$(readlink "$link_path")"
    if [[ "$actual" != "$target" ]]; then
      printf '.claude/skills/%s/%s points to %s; expected %s\n' "$skill_name" "$rel" "$actual" "$target" >&2
      claude_skills_drift=1
    elif [[ ! -e "$link_path" ]]; then
      printf '.claude/skills/%s/%s points to a missing target\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
    fi
  done <<< "$canonical"

  # Explicit guard for the A3 #1-forbidden case (integrated from the Codex proposal):
  # a mirror entry that is a symlink resolving to a DIRECTORY. Claude Code skill
  # discovery does not resolve a symlinked directory, so a dir symlink silently
  # un-discovers the skill. The set-difference above already FAILS on this, but the
  # explicit message names the real fix (replace with a real dir of per-file symlinks)
  # instead of only "stale entry".
  while IFS= read -r link_path; do
    [[ -n "$link_path" ]] || continue
    if [[ -L "$link_path" && -d "$link_path" ]]; then
      printf '.claude/skills/%s/%s is a directory symlink; expected a real dir of per-file symlinks\n' "$skill_name" "${link_path#"$mirror_dir"/}" >&2
      claude_skills_drift=1
    fi
  done < <(find "$mirror_dir" -type l)

  # Bidirectional DIRECTORY parity (integrated from the Codex proposal). The file-only
  # comparison cannot see an EMPTY stale subdir — it has no leaf to flag — so a stale
  # support subdir (e.g. a renamed canonical scripts/ dir) would otherwise be invisible.
  canon_dirs="$(agent_exposed_dirs "$skill_name")"
  mirror_dirs="$(claude_skill_mirror_dirs "$skill_name")"
  stale_dirs="$(LC_ALL=C comm -13 <(printf '%s\n' "$canon_dirs") <(printf '%s\n' "$mirror_dirs"))"
  if [[ -n "$stale_dirs" ]]; then
    while IFS= read -r rel; do
      [[ -n "$rel" ]] || continue
      printf '.claude/skills/%s/%s is a stale mirror subdir (no canonical dir)\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
    done <<< "$stale_dirs"
  fi

  return 0
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

  # .claude/skills mirror — per-skill bidirectional parity, derived from the canonical
  # tree (no hardcoded skill/file list, no magic count). Catches a missing child, a
  # missing support-subdir file, AND a stale extra entry.
  while IFS= read -r skill_name; do
    check_claude_skills_mirror "$skill_name"
  done < <(for_each_canonical_skill)

  # Stale mirror directory: a .claude/skills/{name} whose canonical skill no longer
  # exists (the dir-granularity half of the bidirectional set-equality).
  if [[ -d "$repo_root/.claude/skills" ]]; then
    for mirror_entry in "$repo_root"/.claude/skills/*; do
      [[ -e "$mirror_entry" ]] || continue
      mirror_name="${mirror_entry##*/}"
      if [[ ! -d "$canonical_skills_root/$mirror_name" ]]; then
        printf '.claude/skills/%s has no canonical skill (stale mirror dir)\n' "$mirror_name" >&2
        claude_skills_drift=1
      fi
    done
  fi

  if [[ "$claude_skills_drift" -ne 0 ]]; then
    printf '.claude/skills mirror is out of sync with the canonical skill tree\n' >&2
    exit 1
  fi

  printf 'Codex skill, plugins/gobbi, .claude/skills, and .claude hook symlinks are intact\n'
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

# .claude/skills mirror — OWN it from the DERIVED per-skill child enumeration. One
# mechanism throughout: a per-file symlink inside a real directory, for top-level files
# AND every support subdir (scripts/ templates/ workflow/), at the `../` depth that
# matches the leaf's nesting. Additive + idempotent: ensure_link only creates/repairs,
# so a re-run is a no-op and the other mirrors are untouched. Stale leaves (a removed
# canonical child) are reported by --check, not pruned here.
while IFS= read -r skill_name; do
  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    ensure_link "$repo_root/.claude/skills/$skill_name/$rel" "$(claude_link_target "$skill_name" "$rel")"
  done < <(agent_exposed_files "$skill_name")
done < <(for_each_canonical_skill)

printf 'synchronized Codex skill, plugins/gobbi, .claude/skills, and .claude hook symlinks\n'
