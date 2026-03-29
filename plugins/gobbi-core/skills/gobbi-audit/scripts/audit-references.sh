#!/bin/bash
# Scans .md files for file path references and checks if they exist on disk.
# Usage: bash audit-references.sh [directory]
# Defaults to scanning the plugin's skills/ directory relative to this script.
# Exit 0 if all references valid, exit 1 if stale references found.
#
# Checks two types of references:
#   1. Markdown links: [text](relative-path) — resolved relative to the containing file
#   2. Backtick-quoted paths with repo-root prefixes — resolved relative to repo root
#
# Conservative by design: only checks references that can be unambiguously resolved.
# Skips: URLs, anchors, template patterns ({placeholder}), bare filenames without
# directory context, conceptual path references, and .claude/project/ note
# directories (historical records, not living docs).

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

# Find repo root (needed for resolving repo-root-relative references)
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || echo "")"
if [ -z "$repo_root" ]; then
  echo "Warning: Not in a git repository. Root-relative references cannot be resolved." >&2
fi

stale_count=0

while IFS= read -r -d '' md_file; do
  # Skip files inside .claude/project/ note directories (historical records)
  case "$md_file" in
    */.claude/project/*/note/*) continue ;;
  esac

  file_dir="$(dirname "$md_file")"

  # --- Pass 1: Markdown links [text](path) ---
  # These are the most reliable references — explicit link syntax with clear resolution
  line_num=0
  while IFS= read -r line; do
    line_num=$((line_num + 1))

    remaining="$line"
    while [[ "$remaining" =~ \]\(([^)]+)\) ]]; do
      ref="${BASH_REMATCH[1]}"
      remaining="${remaining#*"${BASH_REMATCH[0]}"}"

      # Skip URLs and pure anchors
      case "$ref" in
        http://*|https://*|mailto:*|ftp://*) continue ;;
        \#*) continue ;;
      esac

      # Strip anchor from path#anchor references
      ref="${ref%%#*}"
      [ -z "$ref" ] && continue

      # Resolve relative to the file's directory
      resolved="$file_dir/$ref"
      if [ ! -e "$resolved" ]; then
        echo "STALE: $md_file:$line_num  link -> $ref"
        stale_count=$((stale_count + 1))
      fi
    done
  done < "$md_file"

  # --- Pass 2: Backtick-quoted paths with known repo-root prefixes ---
  # Only check paths that start with a known top-level directory, which makes
  # them unambiguously repo-root-relative. Skip conceptual references like
  # `.claude/skills/` (user project structure) and bare filenames (examples).
  [ -z "$repo_root" ] && continue

  line_num=0
  while IFS= read -r line; do
    line_num=$((line_num + 1))

    remaining="$line"
    while [[ "$remaining" =~ \`([^\`]+)\` ]]; do
      ref="${BASH_REMATCH[1]}"
      remaining="${remaining#*"${BASH_REMATCH[0]}"}"

      # Skip non-path content
      case "$ref" in
        *' '*|*'$'*|*'('*|*'='*|*'|'*|*'>'*|*'<'*) continue ;;
        http://*|https://*) continue ;;
        --*|-[a-zA-Z]) continue ;;
        *'{'*|*'*'*) continue ;;  # Templates and globs
      esac

      # Only check paths starting with known repo directories
      # This avoids false positives from conceptual .claude/ references
      case "$ref" in
        plugins/*|src/*|packages/*|bin/*) ;;
        *) continue ;;
      esac

      # Must end with a file extension to be a concrete file reference
      case "$ref" in
        *.md|*.sh|*.ts|*.js|*.json|*.yaml|*.yml) ;;
        *) continue ;;
      esac

      resolved="$repo_root/$ref"
      if [ ! -e "$resolved" ]; then
        echo "STALE: $md_file:$line_num  backtick -> $ref"
        stale_count=$((stale_count + 1))
      fi
    done
  done < "$md_file"

done < <(find "$scan_dir" -name '*.md' -type f -print0 2>/dev/null)

if [ "$stale_count" -gt 0 ]; then
  echo ""
  echo "Found $stale_count stale reference(s)."
  exit 1
else
  echo "All references valid."
  exit 0
fi
