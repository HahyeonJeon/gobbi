#!/usr/bin/env bash
set -euo pipefail

repo_root_source="${GOBBI_SYNC_REPO_ROOT:-$(dirname "${BASH_SOURCE[0]}")/..}"
repo_root="$(cd "$repo_root_source" && pwd -P)"
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

# Normal sync is intentionally a single-writer operation. Callers must not mutate the
# canonical skill tree or .claude/skills while this script is running. The reconciler
# uses that precondition instead of a lock/retry protocol: it proves the full mirror
# safe before its first mutation, then applies the already-proved plan once.
declare -a reconcile_skill_names=()
declare -a reconcile_expected_dirs=()
declare -a reconcile_expected_leaves=()
declare -a reconcile_stale_dirs=()
declare -a reconcile_stale_leaves=()
declare -A reconcile_expected_dir_set=()
declare -A reconcile_expected_leaf_set=()
declare -A reconcile_expected_target=()
reconcile_canonical_entries=0
reconcile_mirror_entries=0
reconcile_canonical_walks=0
reconcile_mirror_walks=0
reconcile_preflight_failed=0

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

report_reconcile_error() {
  local path="$1" reason="$2"
  printf 'unsafe mirror reconciliation entry %s: %s\n' "$path" "$reason" >&2
  reconcile_preflight_failed=1
}

validate_reconcile_relative_path() {
  local rel="$1" component
  local -a components=()

  reconcile_path_reason=''
  if [[ -z "$rel" || "$rel" == /* || "$rel" == *$'\n'* || "$rel" == *$'\t'* ]]; then
    reconcile_path_reason='path is empty, absolute, or contains a protected control character'
    return 1
  fi

  IFS='/' read -r -a components <<< "$rel"
  for component in "${components[@]}"; do
    if [[ -z "$component" || "$component" == '.' || "$component" == '..' || "$component" == .* ]]; then
      reconcile_path_reason='path contains a dot-prefixed or traversal component'
      return 1
    fi
  done
  return 0
}

write_reconcile_metrics() {
  local metrics_path="${GOBBI_SYNC_METRICS_FILE:-}"
  [[ -n "$metrics_path" ]] || return 0
  case "$metrics_path" in
    "$repo_root/.claude/skills"|"$repo_root/.claude/skills"/*)
      printf 'metrics path must be outside the managed .claude/skills mirror: %s\n' "$metrics_path" >&2
      return 1
      ;;
  esac
  printf 'canonical_walks=%d\nmirror_walks=%d\ncanonical_entries=%d\nmirror_entries=%d\ninspected_entries=%d\n' \
    "$reconcile_canonical_walks" \
    "$reconcile_mirror_walks" \
    "$reconcile_canonical_entries" \
    "$reconcile_mirror_entries" \
    "$((reconcile_canonical_entries + reconcile_mirror_entries))" > "$metrics_path"
}

sort_reconcile_paths() {
  local direction="$1"
  shift
  local rel slashes depth

  for rel in "$@"; do
    slashes="${rel//[!\/]/}"
    depth=$((1 + ${#slashes}))
    printf '%08d\t%s\n' "$depth" "$rel"
  done | if [[ "$direction" == 'deepest' ]]; then
    LC_ALL=C sort -t $'\t' -k1,1nr -k2,2r
  else
    LC_ALL=C sort -t $'\t' -k1,1n -k2,2
  fi | cut -f2-
}

preflight_claude_skills_reconciliation() {
  local mirror_root="$repo_root/.claude/skills"
  local canonical_inventory mirror_inventory sort_file entry rel skill leaf expected actual resolved display
  local -a sorted=()

  if [[ ! -d "$canonical_skills_root" || -L "$canonical_skills_root" ]]; then
    report_reconcile_error '.gobbi/projects/gobbi/skills' 'canonical skill root is not a real directory'
    write_reconcile_metrics
    return 1
  fi

  canonical_inventory="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-canonical.XXXXXX")"
  mirror_inventory="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-mirror.XXXXXX")"
  reconcile_inventory_files=("$canonical_inventory" "$mirror_inventory")

  # One non-following full-tree walk per side. Canonical dot entries remain metadata and
  # are pruned; mirror dot entries are inventoried so they fail closed as protected paths.
  find "$canonical_skills_root" -mindepth 1 -name '.*' -prune -o -print0 > "$canonical_inventory"
  reconcile_canonical_walks=1
  if [[ -L "$mirror_root" ]]; then
    report_reconcile_error '.claude/skills' 'mirror root is a directory symlink'
  elif [[ -e "$mirror_root" && ! -d "$mirror_root" ]]; then
    report_reconcile_error '.claude/skills' 'mirror root is not a real directory'
  elif [[ -d "$mirror_root" ]]; then
    find "$mirror_root" -mindepth 1 -print0 > "$mirror_inventory"
    reconcile_mirror_walks=1
  fi

  while IFS= read -r -d '' entry; do
    reconcile_canonical_entries=$((reconcile_canonical_entries + 1))
    case "$entry" in
      "$canonical_skills_root"/*) rel="${entry#"$canonical_skills_root"/}" ;;
      *)
        report_reconcile_error "$entry" 'canonical inventory path escapes the canonical root'
        continue
        ;;
    esac
    display=".gobbi/projects/gobbi/skills/$rel"
    if ! validate_reconcile_relative_path "$rel"; then
      report_reconcile_error "$display" "$reconcile_path_reason"
      continue
    fi
    if [[ -L "$entry" ]]; then
      report_reconcile_error "$display" 'canonical entry is a symlink; only real directories and regular files are supported'
    elif [[ -d "$entry" ]]; then
      reconcile_expected_dir_set["$rel"]=1
      reconcile_expected_dirs+=("$rel")
      if [[ "$rel" != */* ]]; then
        reconcile_skill_names+=("$rel")
      fi
    elif [[ -f "$entry" ]]; then
      if [[ "$rel" != */* ]]; then
        report_reconcile_error "$display" 'canonical file is not inside a skill directory'
        continue
      fi
      skill="${rel%%/*}"
      leaf="${rel#*/}"
      reconcile_expected_leaf_set["$rel"]=1
      reconcile_expected_leaves+=("$rel")
      reconcile_expected_target["$rel"]="$(claude_link_target "$skill" "$leaf")"
    else
      report_reconcile_error "$display" 'canonical entry has an unsupported type'
    fi
  done < "$canonical_inventory"

  while IFS= read -r -d '' entry; do
    reconcile_mirror_entries=$((reconcile_mirror_entries + 1))
    case "$entry" in
      "$mirror_root"/*) rel="${entry#"$mirror_root"/}" ;;
      *)
        report_reconcile_error "$entry" 'mirror inventory path escapes the mirror root'
        continue
        ;;
    esac
    display=".claude/skills/$rel"
    if ! validate_reconcile_relative_path "$rel"; then
      report_reconcile_error "$display" "$reconcile_path_reason"
      continue
    fi

    if [[ -L "$entry" ]]; then
      if [[ -d "$entry" ]]; then
        report_reconcile_error "$display" 'directory symlinks are forbidden; expected real directories with per-file symlinks'
        continue
      fi
      if [[ "$rel" != */* ]]; then
        report_reconcile_error "$display" 'top-level mirror skill entries must be real directories'
        continue
      fi
      skill="${rel%%/*}"
      leaf="${rel#*/}"
      expected="$(claude_link_target "$skill" "$leaf")"
      actual="$(readlink -- "$entry")"
      if [[ "$actual" != "$expected" ]]; then
        if ! resolved="$(realpath -m -- "${entry%/*}/$actual")"; then
          report_reconcile_error "$display" 'symlink target could not be normalized'
        elif [[ "$resolved" != "$canonical_skills_root"/* ]]; then
          report_reconcile_error "$display" "symlink target escapes the generator-owned canonical root: $actual"
        else
          report_reconcile_error "$display" "raw symlink target is $actual; expected $expected"
        fi
        continue
      fi
      if [[ -n "${reconcile_expected_leaf_set[$rel]:-}" ]]; then
        :
      elif [[ -n "${reconcile_expected_dir_set[$rel]:-}" ]]; then
        report_reconcile_error "$display" 'canonical path is a directory, so a mirror symlink leaf is unsafe'
      else
        reconcile_stale_leaves+=("$rel")
      fi
    elif [[ -d "$entry" ]]; then
      if [[ -n "${reconcile_expected_leaf_set[$rel]:-}" ]]; then
        report_reconcile_error "$display" 'expected mirror leaf is a real directory'
      elif [[ -z "${reconcile_expected_dir_set[$rel]:-}" ]]; then
        reconcile_stale_dirs+=("$rel")
      fi
    elif [[ -f "$entry" ]]; then
      report_reconcile_error "$display" 'regular files are never generator-owned mirror leaves'
    else
      report_reconcile_error "$display" 'entry has an unsupported type'
    fi
  done < "$mirror_inventory"

  write_reconcile_metrics
  if [[ "$reconcile_preflight_failed" -ne 0 ]]; then
    printf '.claude/skills reconciliation aborted before mutation\n' >&2
    return 1
  fi

  if ((${#reconcile_skill_names[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    printf '%s\n' "${reconcile_skill_names[@]}" | LC_ALL=C sort -u > "$sort_file"
    mapfile -t sorted < "$sort_file"
    reconcile_skill_names=("${sorted[@]}")
  fi
  if ((${#reconcile_expected_leaves[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    printf '%s\n' "${reconcile_expected_leaves[@]}" | LC_ALL=C sort -u > "$sort_file"
    mapfile -t sorted < "$sort_file"
    reconcile_expected_leaves=("${sorted[@]}")
  fi
  if ((${#reconcile_stale_leaves[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    printf '%s\n' "${reconcile_stale_leaves[@]}" | LC_ALL=C sort -u > "$sort_file"
    mapfile -t sorted < "$sort_file"
    reconcile_stale_leaves=("${sorted[@]}")
  fi
  return 0
}

apply_claude_skills_reconciliation() {
  local mirror_root="$repo_root/.claude/skills"
  local rel skill leaf sort_file
  local -a sorted_dirs=()

  # The global preflight above proved every path in these arrays. Never follow a
  # directory symlink and never recursively force-delete: leaves go first, then rmdir.
  for rel in "${reconcile_stale_leaves[@]}"; do
    rm -f -- "$mirror_root/$rel"
  done
  if ((${#reconcile_stale_dirs[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    sort_reconcile_paths deepest "${reconcile_stale_dirs[@]}" > "$sort_file"
    mapfile -t sorted_dirs < "$sort_file"
    for rel in "${sorted_dirs[@]}"; do
      rmdir -- "$mirror_root/$rel"
    done
  fi

  mkdir -p "$mirror_root"
  if ((${#reconcile_expected_dirs[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    sort_reconcile_paths shallowest "${reconcile_expected_dirs[@]}" > "$sort_file"
    mapfile -t sorted_dirs < "$sort_file"
    for rel in "${sorted_dirs[@]}"; do
      mkdir -p "$mirror_root/$rel"
    done
  fi
  for rel in "${reconcile_expected_leaves[@]}"; do
    skill="${rel%%/*}"
    leaf="${rel#*/}"
    ensure_link "$mirror_root/$rel" "${reconcile_expected_target[$rel]}"
  done
}

cleanup_reconcile_inventories() {
  local path
  for path in "${reconcile_inventory_files[@]:-}"; do
    [[ -n "$path" ]] || continue
    rm -f -- "$path"
  done
}

declare -a reconcile_inventory_files=()
trap cleanup_reconcile_inventories EXIT

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

# Prove the whole .claude/skills mutation plan before changing any sync-managed path.
# A mixed safe+unsafe mirror therefore leaves the complete mirror byte-for-byte intact.
preflight_claude_skills_reconciliation
apply_claude_skills_reconciliation

for skill_name in "${reconcile_skill_names[@]}"; do
  ensure_link "$repo_root/.agents/skills/$skill_name" "../../.gobbi/projects/gobbi/skills/$skill_name"
done

ensure_link "$package_root/skills" "$expected_plugin_skills"
ensure_link "$package_root/agents" "$expected_plugin_agents"
ensure_link "$package_root/hooks" "$expected_plugin_hooks"
ensure_link "$repo_root/.claude/hooks/session-start.sh" "$expected_dev_session_start"
ensure_link "$repo_root/.claude/hooks/post-tool-use-agents.sh" "$expected_dev_post_tool_use"
ensure_link "$repo_root/.claude/hooks/session-end.sh" "$expected_dev_session_end"

printf 'synchronized Codex skill, plugins/gobbi, .claude/skills, and .claude hook symlinks\n'
