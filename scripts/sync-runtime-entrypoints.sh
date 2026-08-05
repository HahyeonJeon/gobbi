#!/usr/bin/env bash

set -euo pipefail

repo_root_source="${GOBBI_ENTRYPOINT_REPO_ROOT:-$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)}"
repo_root="$(cd -- "$repo_root_source" && pwd -P)"
source_rel='.gobbi/projects/gobbi/skills/principles/SKILL.md'
source_path="$repo_root/$source_rel"
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

[[ -r "$source_path" ]] || {
  printf '%s is absent or unreadable\n' "$source_rel" >&2
  exit 1
}

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
  grep -Fxq '## Principles' "$target" || {
    printf '%s is missing the Principles section\n' "$target" >&2
    return 1
  }
  grep -Fxq '## Navigate deeper' "$target" || {
    printf '%s is missing the navigation section\n' "$target" >&2
    return 1
  }

  awk -v body_path="$body_path" -v marker_start="$marker_start" -v marker_end="$marker_end" '
    $0 == "## Principles" {
      if (!section_seen) {
        print
        print marker_start
        while ((getline line < body_path) > 0) print line
        close(body_path)
        print marker_end
        print ""
        section_seen = 1
        found_principles = 1
      }
      in_generated = 1
      next
    }
    in_generated && $0 == "## Navigate deeper" {
      in_generated = 0
      print
      next
    }
    !in_generated { print }
    END {
      if (found_principles != 1) exit 1
    }
  ' "$target" > "$output"
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
