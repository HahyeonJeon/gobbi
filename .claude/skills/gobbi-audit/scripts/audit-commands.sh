#!/bin/bash
# Scans .md files for shell commands in fenced bash/sh code blocks and checks
# if the referenced binaries exist.
# Usage: bash audit-commands.sh [directory]
# Defaults to scanning the plugin's skills/ directory relative to this script.
# Exit 0 if all commands verified, exit 1 if stale commands found.
#
# Checks commands in fenced code blocks tagged with bash or sh language.
# Extracts the first token of each command line and verifies the binary exists
# via `command -v` or file path checks.
#
# Conservative by design: only checks unambiguous command references.
# Skips: plain code blocks (no language tag), non-shell languages, comments,
# variable assignments, control flow keywords, variable references, and
# .claude/project/ note directories (historical records).
# Supports: sudo prefix extraction, heredoc skipping, and per-block ignore
# via <!-- gobbi-audit:ignore --> comment on the line before the fence.

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

# Find repo root (needed for resolving relative path commands)
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || echo "")"
if [ -z "$repo_root" ]; then
  echo "Warning: Not in a git repository. Path-based commands cannot be resolved." >&2
fi

stale_count=0

while IFS= read -r -d '' md_file; do
  # Skip files inside .claude/project/ note directories (historical records)
  case "$md_file" in
    */.claude/project/*/note/*) continue ;;
  esac

  in_code_block=false
  is_shell_block=false
  skip_block=false
  prev_line=""
  heredoc_delim=""
  line_num=0

  while IFS= read -r line; do
    line_num=$((line_num + 1))

    # Handle heredoc: skip lines until matching delimiter
    if [ -n "$heredoc_delim" ]; then
      # Strip leading whitespace for comparison (handles <<-EOF indented endings)
      stripped="${line#"${line%%[![:space:]]*}"}"
      if [ "$stripped" = "$heredoc_delim" ]; then
        heredoc_delim=""
      fi
      prev_line="$line"
      continue
    fi

    # Detect code block fences
    if [[ "$line" =~ ^[[:space:]]*\`\`\` ]]; then
      if [ "$in_code_block" = true ]; then
        # Closing fence
        in_code_block=false
        is_shell_block=false
        skip_block=false
      else
        # Opening fence — check language tag
        in_code_block=true
        is_shell_block=false
        skip_block=false

        # Check for ignore comment on previous line
        if [[ "$prev_line" =~ \<\!--[[:space:]]*gobbi-audit:ignore[[:space:]]*--\> ]]; then
          skip_block=true
        fi

        # Check if it's a bash or sh code block
        if [[ "$line" =~ ^[[:space:]]*\`\`\`(bash|sh)[[:space:]]*$ ]]; then
          is_shell_block=true
        fi
      fi
      prev_line="$line"
      continue
    fi

    # Only process lines inside shell code blocks
    if [ "$in_code_block" = false ] || [ "$is_shell_block" = false ] || [ "$skip_block" = true ]; then
      prev_line="$line"
      continue
    fi

    # Skip empty lines
    stripped="${line#"${line%%[![:space:]]*}"}"
    if [ -z "$stripped" ]; then
      prev_line="$line"
      continue
    fi

    # Skip comment lines (starting with #)
    if [[ "$stripped" =~ ^# ]]; then
      prev_line="$line"
      continue
    fi

    # Skip continuation lines (starting with | || &&)
    if [[ "$stripped" =~ ^(\||\|\||&&) ]]; then
      prev_line="$line"
      continue
    fi

    # Skip lines that are just braces or closing parens
    case "$stripped" in
      '{'|'}'|')')
        prev_line="$line"
        continue
        ;;
    esac

    # Skip control flow keywords
    first_token="${stripped%% *}"
    case "$first_token" in
      if|then|else|elif|fi|do|done|for|while|until|case|esac|function|in|select)
        prev_line="$line"
        continue
        ;;
    esac

    # Skip variable assignments (token contains = before any space)
    if [[ "$first_token" =~ = ]]; then
      prev_line="$line"
      continue
    fi

    # Skip lines that are clearly variable references
    if [[ "$first_token" =~ ^\$ ]] || [[ "$first_token" =~ ^\$\{ ]]; then
      prev_line="$line"
      continue
    fi

    # Detect heredoc — set delimiter and continue processing the command line itself
    if [[ "$stripped" =~ \<\<-?[[:space:]]*[\']?([A-Za-z_][A-Za-z0-9_]*)[\']? ]]; then
      heredoc_delim="${BASH_REMATCH[1]}"
    fi

    # Extract the command token
    cmd_token="$first_token"

    # Handle sudo prefix — use the second token instead
    if [ "$cmd_token" = "sudo" ]; then
      rest="${stripped#sudo}"
      rest="${rest#"${rest%%[![:space:]]*}"}"
      # Handle sudo flags like -u, -E, etc.
      while [[ "$rest" =~ ^- ]]; do
        rest="${rest#* }"
        rest="${rest#"${rest%%[![:space:]]*}"}"
      done
      cmd_token="${rest%% *}"
      if [ -z "$cmd_token" ]; then
        prev_line="$line"
        continue
      fi
    fi

    # Skip variable references as command tokens
    if [[ "$cmd_token" =~ ^\$ ]] || [[ "$cmd_token" =~ ^\$\{ ]]; then
      prev_line="$line"
      continue
    fi

    # Skip tokens that are clearly not commands (quoted strings, redirections)
    case "$cmd_token" in
      \"*|\'*|\>*|\<*|[0-9]*)
        prev_line="$line"
        continue
        ;;
    esac

    # Check if the command exists
    found=true
    if [[ "$cmd_token" =~ / ]]; then
      # Path-based command — check relative to repo root
      if [ -n "$repo_root" ]; then
        if [ ! -f "$repo_root/$cmd_token" ] && [ ! -d "$repo_root/$cmd_token" ]; then
          found=false
        fi
      fi
    else
      # Strip any trailing characters that aren't part of the command name
      # (e.g., semicolons, pipes attached without space)
      clean_token="${cmd_token%%[;|&<>]*}"
      if [ -z "$clean_token" ]; then
        prev_line="$line"
        continue
      fi
      if ! command -v "$clean_token" >/dev/null 2>&1; then
        found=false
        cmd_token="$clean_token"
      fi
    fi

    if [ "$found" = false ]; then
      echo "STALE: $md_file:$line_num  command -> $cmd_token"
      stale_count=$((stale_count + 1))
    fi

    prev_line="$line"
  done < "$md_file"

done < <(find "$scan_dir" -name '*.md' -type f -print0 2>/dev/null)

if [ "$stale_count" -gt 0 ]; then
  echo ""
  echo "Found $stale_count stale command(s)."
  exit 1
else
  echo "All commands verified."
  exit 0
fi
