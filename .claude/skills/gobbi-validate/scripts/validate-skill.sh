#!/bin/bash
# Validates a SKILL.md file for structural correctness.
# Usage: bash validate-skill.sh <SKILL.md>
# Exit 0 on pass (warnings to stderr), exit 1 on failure.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <SKILL.md>" >&2
  exit 1
fi

file="$1"

if [ ! -f "$file" ]; then
  echo "FAIL: File not found: $file" >&2
  exit 1
fi

errors=0
warnings=0

# Check YAML frontmatter exists (between --- markers)
first_line=$(head -n 1 "$file")
if [ "$first_line" != "---" ]; then
  echo "FAIL: $file: No YAML frontmatter — first line must be '---'" >&2
  errors=$((errors + 1))
else
  # Find the closing --- marker (skip line 1)
  closing_line=$(tail -n +2 "$file" | grep -n '^---$' | head -n 1 | cut -d: -f1 || true)
  if [ -z "$closing_line" ]; then
    echo "FAIL: $file: YAML frontmatter not closed — missing second '---'" >&2
    errors=$((errors + 1))
  else
    # Extract frontmatter (between the two --- markers)
    fm_end=$((closing_line + 1))
    frontmatter=$(sed -n "2,${fm_end}p" "$file" | sed '$d')

    # Check description field exists and is non-empty
    desc_line=$(echo "$frontmatter" | grep -E '^description:' || true)
    if [ -z "$desc_line" ]; then
      echo "FAIL: $file: Missing required frontmatter field: description" >&2
      errors=$((errors + 1))
    else
      desc_value=$(echo "$desc_line" | sed 's/^description:[[:space:]]*//')
      if [ -z "$desc_value" ]; then
        echo "FAIL: $file: description field is empty" >&2
        errors=$((errors + 1))
      fi
    fi

    # Check name field
    name_line=$(echo "$frontmatter" | grep -E '^name:' || true)
    if [ -z "$name_line" ]; then
      echo "FAIL: $file: Missing required frontmatter field: name" >&2
      errors=$((errors + 1))
    fi

    # Check allowed-tools field
    tools_line=$(echo "$frontmatter" | grep -E '^allowed-tools:' || true)
    if [ -z "$tools_line" ]; then
      echo "FAIL: $file: Missing required frontmatter field: allowed-tools" >&2
      errors=$((errors + 1))
    fi
  fi
fi

# Check file line count
line_count=$(wc -l < "$file")
if [ "$line_count" -gt 500 ]; then
  echo "FAIL: $file: File exceeds 500 line limit ($line_count lines)" >&2
  errors=$((errors + 1))
elif [ "$line_count" -gt 200 ]; then
  echo "WARN: $file: File exceeds 200 line target ($line_count lines) — consider decomposing" >&2
  warnings=$((warnings + 1))
fi

# Check for child documents: look for sibling .md files in the same directory
file_dir=$(dirname "$file")
sibling_mds=$(find "$file_dir" -maxdepth 1 -name "*.md" ! -name "SKILL.md" -type f 2>/dev/null | head -5 || true)
if [ -n "$sibling_mds" ]; then
  # Has child documents — check for "Navigate deeper from here:" section
  if ! grep -q "Navigate deeper from here:" "$file"; then
    echo "WARN: $file: Has child .md files but missing 'Navigate deeper from here:' section" >&2
    warnings=$((warnings + 1))
  fi
fi

# Check 1: Description max length
if [ -n "${desc_value:-}" ]; then
  desc_len=${#desc_value}
  if [ "$desc_len" -gt 1024 ]; then
    echo "WARN: $file: Description exceeds 1024 character limit ($desc_len chars) — auto-invocation may truncate" >&2
    warnings=$((warnings + 1))
  fi
fi

# Check 2: Description min length
if [ -n "${desc_value:-}" ]; then
  desc_len=${#desc_value}
  if [ "$desc_len" -lt 20 ]; then
    echo "WARN: $file: Description is very short ($desc_len chars) — may not provide enough trigger specificity" >&2
    warnings=$((warnings + 1))
  fi
fi

# Check 3: Trigger language heuristic
if [ -n "${desc_value:-}" ]; then
  if ! echo "$desc_value" | grep -qiE '(Use (when|this|after|during|to|for)|MUST load when|Load (when|this)|TRIGGER when)'; then
    echo "WARN: $file: Description may lack trigger-oriented language — consider adding 'Use when...' or 'MUST load when...' phrasing" >&2
    warnings=$((warnings + 1))
  fi
fi

# Check 4: Core principles in first ~50 lines of body
if [ -n "${fm_end:-}" ]; then
  body_start=$((fm_end + 1))
  body_first50=$(tail -n +"$body_start" "$file" | head -n 50)
  if ! echo "$body_first50" | grep -q '^>'; then
    echo "WARN: $file: No blockquote (>) found in first 50 lines of body — skills should lead with core principles" >&2
    warnings=$((warnings + 1))
  fi
fi

# Check 5: Empty/stub detection
if [ -n "${fm_end:-}" ]; then
  body_start=$((fm_end + 1))
  nonempty_lines=$(tail -n +"$body_start" "$file" | grep -c '[^[:space:]]' || true)
  if [ "$nonempty_lines" -lt 10 ]; then
    echo "WARN: $file: Body has only $nonempty_lines non-empty lines — may be a stub" >&2
    warnings=$((warnings + 1))
  fi
fi

if [ "$errors" -gt 0 ]; then
  echo "FAILED: $file — $errors error(s), $warnings warning(s)" >&2
  exit 1
fi

if [ "$warnings" -gt 0 ]; then
  echo "PASSED with $warnings warning(s): $file" >&2
fi

echo "PASS: $file"
exit 0
