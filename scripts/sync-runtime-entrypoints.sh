#!/usr/bin/env bash

set -euo pipefail

repo_root_source="${GOBBI_ENTRYPOINT_REPO_ROOT:-$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)}"
repo_root="$(cd -- "$repo_root_source" && pwd -P)"
source_rel='.gobbi/projects/gobbi/skills/principles/SKILL.md'
source_path="$repo_root/$source_rel"
family_rel='.gobbi/projects/gobbi/skills/gobbi-dev'
family_path="$repo_root/$family_rel"
mode=''

usage() {
  printf 'usage: %s --check | --sync\n' "$0" >&2
}

if (( $# != 1 )); then
  usage
  exit 2
fi

case "$1" in
  --check|--sync) mode="$1" ;;
  *) usage; exit 2 ;;
esac

read_frontmatter_value() {
  local -n output="$1"
  local path="$2" key="$3" value
  if ! value="$(awk -v wanted="$key" '
    NR == 1 { if ($0 != "---") exit 10; inside = 1; next }
    inside && $0 == "---" { closed = 1; inside = 0; nextfile }
    inside {
      prefix = wanted ":"
      if (index($0, prefix) == 1) {
        count++
        value = substr($0, length(prefix) + 1)
        sub(/^[[:space:]]+/, "", value)
      }
    }
    END { if (!closed || count != 1) exit 11; print value }
  ' "$path")"; then
    return 1
  fi
  output="$value"
}

unquote_frontmatter_value() {
  local value="$1"
  if [[ "$value" == \"*\" && ${#value} -ge 2 ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "$value"
}

readlink_raw_target() {
  local -n output="$1"
  local path="$2" captured
  captured="$(readlink -n -- "$path" && printf '\034')" || return 1
  output="${captured%$'\034'}"
}

[[ -f "$source_path" && ! -L "$source_path" && -r "$source_path" ]] || {
  printf '%s must be a readable real regular file\n' "$source_rel" >&2
  exit 1
}
if ! read_frontmatter_value principles_name "$source_path" name || [[ "$principles_name" != principles ]]; then
  printf '%s must declare name: principles\n' "$source_rel" >&2
  exit 1
fi
if [[ ! -L "$repo_root/AGENTS.md" ]] || ! readlink_raw_target agents_target "$repo_root/AGENTS.md" || \
   [[ "$agents_target" != '.codex/AGENTS.md' ]] || [[ ! -e "$repo_root/AGENTS.md" ]]; then
  printf 'AGENTS.md must be a non-dangling symlink with raw target .codex/AGENTS.md\n' >&2
  exit 1
fi

validate_family_source() {
  local entry rel actual_files actual_dirs row name type description child child_skill
  local expected_files expected_dirs expected_child_section
  local -a children=(
    gobbi-dev-conventions:preference
    gobbi-dev-deployment:operation
    gobbi-dev-development:operation
    gobbi-dev-release:operation
    gobbi-dev-review:operation
    gobbi-dev-testing:operation
    gobbi-dev-toolchain:tool
  )

  [[ -d "$family_path" && ! -L "$family_path" ]] || {
    printf '%s must be a real directory\n' "$family_rel" >&2
    return 1
  }
  [[ -f "$family_path/SKILL.md" && ! -L "$family_path/SKILL.md" && -r "$family_path/SKILL.md" ]] || {
    printf '%s/SKILL.md must be a readable real regular file\n' "$family_rel" >&2
    return 1
  }
  if ! read_frontmatter_value name "$family_path/SKILL.md" name || [[ "$name" != gobbi-dev ]]; then
    printf '%s/SKILL.md must declare name: gobbi-dev\n' "$family_rel" >&2
    return 1
  fi
  if ! read_frontmatter_value type "$family_path/SKILL.md" skill-type || [[ "$type" != domain ]]; then
    printf '%s/SKILL.md must declare skill-type: domain\n' "$family_rel" >&2
    return 1
  fi
  if [[ "$(grep -c '^# Gobbi Development Lifecycle$' "$family_path/SKILL.md" || true)" -ne 1 ]] || \
     [[ "$(grep -c '^## Child Skills$' "$family_path/SKILL.md" || true)" -ne 1 ]] || \
     [[ "$(grep -c '^## ' "$family_path/SKILL.md" || true)" -ne 1 ]]; then
    printf '%s/SKILL.md must retain the navigation-only root shell\n' "$family_rel" >&2
    return 1
  fi

  expected_files=$'SKILL.md\ngobbi-dev-conventions/SKILL.md\ngobbi-dev-deployment/SKILL.md\ngobbi-dev-deployment/checklists.md\ngobbi-dev-development/SKILL.md\ngobbi-dev-release/SKILL.md\ngobbi-dev-release/checklists.md\ngobbi-dev-review/SKILL.md\ngobbi-dev-testing/SKILL.md\ngobbi-dev-toolchain/SKILL.md'
  expected_dirs=$'gobbi-dev-conventions\ngobbi-dev-deployment\ngobbi-dev-development\ngobbi-dev-release\ngobbi-dev-review\ngobbi-dev-testing\ngobbi-dev-toolchain'
  actual_files="$(cd "$family_path" && find . -mindepth 1 -type f -print | sed 's|^\./||' | LC_ALL=C sort)"
  actual_dirs="$(cd "$family_path" && find . -mindepth 1 -type d -print | sed 's|^\./||' | LC_ALL=C sort)"
  [[ "$actual_files" == "$expected_files" ]] || {
    printf '%s must contain the exact accepted ten-file inventory\n' "$family_rel" >&2
    return 1
  }
  [[ "$actual_dirs" == "$expected_dirs" ]] || {
    printf '%s must contain the exact accepted seven real child directories\n' "$family_rel" >&2
    return 1
  }
  while IFS= read -r -d '' entry; do
    rel="${entry#"$family_path"/}"
    if [[ -L "$entry" || ( ! -d "$entry" && ! -f "$entry" ) ]]; then
      printf '%s/%s must be a real directory or regular file\n' "$family_rel" "$rel" >&2
      return 1
    fi
  done < <(find "$family_path" -mindepth 1 -print0)

  expected_child_section=$'## Child Skills\n\n| Child skill | Type | Load when |\n|---|---|---|'
  for child in "${children[@]}"; do
    type="${child##*:}"
    child="${child%%:*}"
    child_skill="$family_path/$child/SKILL.md"
    [[ -f "$child_skill" && ! -L "$child_skill" && -r "$child_skill" ]] || {
      printf '%s/%s/SKILL.md must be a readable real regular file\n' "$family_rel" "$child" >&2
      return 1
    }
    read_frontmatter_value name "$child_skill" name && [[ "$name" == "$child" ]] || {
      printf '%s/%s/SKILL.md must declare name: %s\n' "$family_rel" "$child" "$child" >&2
      return 1
    }
    read_frontmatter_value name "$child_skill" skill-type && [[ "$name" == "$type" ]] || {
      printf '%s/%s/SKILL.md must declare skill-type: %s\n' "$family_rel" "$child" "$type" >&2
      return 1
    }
    read_frontmatter_value description "$child_skill" description || {
      printf '%s/%s/SKILL.md must declare one frontmatter description\n' "$family_rel" "$child" >&2
      return 1
    }
    description="$(unquote_frontmatter_value "$description")"
    row="| [\`$child\`]($child/SKILL.md) | $type | $description |"
    expected_child_section+=$'\n'"$row"
  done
  cmp -s \
    <(printf '%s\n' "$expected_child_section") \
    <(sed -n '/^## Child Skills$/,$p' "$family_path/SKILL.md") || {
      printf '%s/SKILL.md Child Skills section must equal the ordered child-derived table through end of file\n' \
        "$family_rel" >&2
      return 1
    }
}

validate_family_source

targets=(
  "$repo_root/.codex/AGENTS.md"
  "$repo_root/.claude/CLAUDE.md"
)
marker_start="<!-- BEGIN GENERATED PRINCIPLES: $source_rel -->"
marker_end="<!-- END GENERATED PRINCIPLES -->"
tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/gobbi-entrypoints.XXXXXX")"
trap 'find "$tmp_root" -depth -mindepth 1 -delete; rmdir "$tmp_root"' EXIT

body_path="$tmp_root/principles.body"
awk '
  BEGIN { frontmatter = 0 }
  /^---$/ {
    if (frontmatter == 0) { frontmatter = 1; next }
    if (frontmatter == 1) { frontmatter = 2; next }
  }
  frontmatter == 2 { print }
' "$source_path" > "$body_path"

render_entrypoint() {
  local target="$1" output="$2"

  [[ -f "$target" && ! -L "$target" ]] || {
    printf '%s must be a regular file\n' "$target" >&2
    return 1
  }

  awk -v body_path="$body_path" -v marker_start="$marker_start" -v marker_end="$marker_end" '
    BEGIN {
      print "## Principles"
      print marker_start
      while ((getline line < body_path) > 0) print line
      close(body_path)
      print marker_end
      print ""
      print "## Repository-local Gobbi development lifecycle"
      print ""
      print "When the frontmatter trigger in `.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md` applies, load that"
      print "repository-local skill and every applicable child it routes."
    }
  ' > "$output"
}

for index in "${!targets[@]}"; do
  render_entrypoint "${targets[$index]}" "$tmp_root/entry-$index.md"
done

drift=0
for index in "${!targets[@]}"; do
  target="${targets[$index]}"
  rendered="$tmp_root/entry-$index.md"
  if cmp -s -- "$target" "$rendered"; then
    printf 'PASS: %s is generated from %s\n' "${target#"$repo_root/"}" "$source_rel"
  elif [[ "$mode" == '--check' ]]; then
    printf 'FAIL: %s is stale; run scripts/sync-runtime-entrypoints.sh --sync\n' \
      "${target#"$repo_root/"}" >&2
    drift=1
  else
    cp -p -- "$rendered" "$target"
    printf 'SYNC: %s from %s\n' "${target#"$repo_root/"}" "$source_rel"
  fi
done

if (( drift != 0 )); then
  exit 1
fi
