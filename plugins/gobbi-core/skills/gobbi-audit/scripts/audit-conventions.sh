#!/bin/bash
# Scans SKILL.md and other .claude/ docs for structural claims and checks against reality.
# Usage: bash audit-conventions.sh [directory]
# Defaults to scanning the plugin's skills/ directory relative to this script.
# Exit 0 if consistent, exit 1 if mismatches found.
#
# Performs three checks:
#   1. SKILL.md frontmatter `name` matches its directory name
#   2. Navigation table link targets exist as sibling files
#   3. Backtick-quoted directory paths with known repo prefixes exist
#
# Conservative by design: only checks verifiable structural facts.
# Skips: conceptual path references (like `.claude/skills/` describing user
# project structure), template paths with placeholders, and .claude/project/
# note directories (historical records).

set -euo pipefail

# Determine directory to scan
if [ $# -ge 1 ]; then
  scan_dir="$1"
else
  script_dir="$(cd "$(dirname "$0")" && pwd)"
  scan_dir="$(cd "$script_dir/../.." && pwd)"
fi

if [ ! -d "$scan_dir" ]; then
  echo "Error: Directory does not exist: $scan_dir" >&2
  exit 2
fi

# Find repo root
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || echo "")"
if [ -z "$repo_root" ]; then
  echo "Warning: Not in a git repository. Cannot resolve structural claims." >&2
fi

mismatch_count=0

# --- Check 1: SKILL.md frontmatter name matches directory name ---
while IFS= read -r -d '' skill_file; do
  skill_dir="$(dirname "$skill_file")"
  dir_name="$(basename "$skill_dir")"

  # Extract name from frontmatter
  fm_name=""
  in_frontmatter=false
  while IFS= read -r line; do
    if [ "$line" = "---" ]; then
      if $in_frontmatter; then
        break
      else
        in_frontmatter=true
        continue
      fi
    fi
    if $in_frontmatter; then
      case "$line" in
        name:*)
          fm_name="${line#name:}"
          fm_name="${fm_name## }"  # Trim leading spaces
          fm_name="${fm_name%% }"  # Trim trailing spaces
          break
          ;;
      esac
    fi
  done < "$skill_file"

  if [ -n "$fm_name" ] && [ "$fm_name" != "$dir_name" ]; then
    echo "MISMATCH: $skill_file:1  frontmatter name '$fm_name' != directory name '$dir_name'"
    mismatch_count=$((mismatch_count + 1))
  fi
done < <(find "$scan_dir" -name 'SKILL.md' -type f -print0 2>/dev/null)

# --- Check 2: Navigation table link targets exist ---
# SKILL.md files with "Navigate deeper from here:" or similar table headings
# should have valid child doc references in the table rows that follow
while IFS= read -r -d '' skill_file; do
  skill_dir="$(dirname "$skill_file")"
  line_num=0
  in_nav_section=false

  while IFS= read -r line; do
    line_num=$((line_num + 1))

    # Detect navigation section headers
    if [[ "$line" == *"Navigate deeper"* ]] || [[ "$line" == *"Gotcha"*"File"* ]] || [[ "$line" == *"Cross-project gotchas"* ]]; then
      in_nav_section=true
      continue
    fi

    # End nav section at next heading or horizontal rule
    if $in_nav_section; then
      if [[ "$line" =~ ^##[[:space:]] ]] || [[ "$line" =~ ^--- ]]; then
        in_nav_section=false
        continue
      fi
    fi

    # Check markdown links in nav/table sections
    if $in_nav_section; then
      remaining="$line"
      while [[ "$remaining" =~ \]\(([^)]+)\) ]]; do
        ref="${BASH_REMATCH[1]}"
        remaining="${remaining#*"${BASH_REMATCH[0]}"}"

        # Skip URLs and anchors
        case "$ref" in
          http://*|https://*|mailto:*|\#*) continue ;;
        esac
        ref="${ref%%#*}"
        [ -z "$ref" ] && continue

        resolved="$skill_dir/$ref"
        if [ ! -e "$resolved" ]; then
          echo "MISMATCH: $skill_file:$line_num  table link -> $ref (not found)"
          mismatch_count=$((mismatch_count + 1))
        fi
      done
    fi
  done < "$skill_file"
done < <(find "$scan_dir" -name 'SKILL.md' -type f -print0 2>/dev/null)

# --- Check 3: Backtick-quoted directory paths with known repo prefixes ---
# Only checks directories starting with known top-level repo directories
# (plugins/, src/, packages/, bin/). Skips .claude/ references because those
# describe user project structure, not this repo's layout.
if [ -n "$repo_root" ]; then
  while IFS= read -r -d '' md_file; do
    case "$md_file" in
      */.claude/project/*/note/*) continue ;;
    esac

    line_num=0
    while IFS= read -r line; do
      line_num=$((line_num + 1))

      remaining="$line"
      while [[ "$remaining" =~ \`([^\`]+/)\` ]]; do
        ref="${BASH_REMATCH[1]}"
        remaining="${remaining#*"${BASH_REMATCH[0]}"}"

        # Skip templates, variables, globs
        case "$ref" in
          *'{'*|*'$'*|*'*'*|*' '*) continue ;;
          http://*|https://*) continue ;;
        esac

        # Only check paths with known repo-root prefixes
        case "$ref" in
          plugins/*|src/*|packages/*|bin/*) ;;
          *) continue ;;
        esac

        resolved="$repo_root/$ref"
        if [ ! -d "$resolved" ]; then
          echo "MISMATCH: $md_file:$line_num  directory claim -> $ref (not found)"
          mismatch_count=$((mismatch_count + 1))
        fi
      done
    done < "$md_file"
  done < <(find "$scan_dir" -name '*.md' -type f -print0 2>/dev/null)
fi

if [ "$mismatch_count" -gt 0 ]; then
  echo ""
  echo "Found $mismatch_count structural mismatch(es)."
  exit 1
else
  echo "All structural claims consistent."
  exit 0
fi
