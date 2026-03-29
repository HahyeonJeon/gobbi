#!/bin/bash
# Validates an agent definition .md file for structural correctness.
# Usage: bash validate-agent.sh <agent-file.md>
# Exit 0 on pass (warnings to stderr), exit 1 on failure.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <agent-file.md>" >&2
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
    frontmatter=$(sed -n "2,${fm_end}p" "$file" | head -n -1)

    # Check required fields: name, description, tools
    for field in name description tools; do
      if ! echo "$frontmatter" | grep -qE "^${field}:"; then
        echo "FAIL: $file: Missing required frontmatter field: $field" >&2
        errors=$((errors + 1))
      fi
    done

    # Check name format: lowercase with hyphens, 3-50 chars
    name_value=$(echo "$frontmatter" | grep -E '^name:' | sed 's/^name:[[:space:]]*//' || true)
    if [ -n "$name_value" ]; then
      name_len=${#name_value}
      if [ "$name_len" -lt 3 ] || [ "$name_len" -gt 50 ]; then
        echo "FAIL: $file: Name '$name_value' must be 3-50 characters (got $name_len)" >&2
        errors=$((errors + 1))
      fi
      if ! echo "$name_value" | grep -qE '^[a-z][a-z0-9-]*$'; then
        echo "FAIL: $file: Name '$name_value' must be lowercase with hyphens only" >&2
        errors=$((errors + 1))
      fi
    fi

    # Check description includes trigger language
    desc_value=$(echo "$frontmatter" | grep -E '^description:' | sed 's/^description:[[:space:]]*//' || true)
    if [ -n "$desc_value" ]; then
      # Look for trigger patterns (case-insensitive)
      if ! echo "$desc_value" | grep -qiE '(use this agent when|must delegate|delegate here when|use when|must spawn|spawn alongside|must load when)'; then
        echo "WARN: $file: Description may lack trigger language (expected phrases like 'Use when', 'MUST delegate here when', etc.)" >&2
        warnings=$((warnings + 1))
      fi
    fi

    # Check model field if present
    model_value=$(echo "$frontmatter" | grep -E '^model:' | sed 's/^model:[[:space:]]*//' || true)
    if [ -n "$model_value" ]; then
      case "$model_value" in
        sonnet|opus|haiku|inherit)
          ;;
        *)
          echo "FAIL: $file: Invalid model value '$model_value' — must be one of: sonnet, opus, haiku, inherit" >&2
          errors=$((errors + 1))
          ;;
      esac
    fi
  fi
fi

# Check system prompt (body after frontmatter) has sufficient content
if [ "$first_line" = "---" ] && [ -n "${closing_line:-}" ]; then
  body_start=$((closing_line + 2))
  body=$(tail -n +"$body_start" "$file")
  # Strip whitespace for length check
  body_stripped=$(echo "$body" | tr -d '[:space:]')
  body_len=${#body_stripped}
  if [ "$body_len" -lt 20 ]; then
    echo "FAIL: $file: System prompt body too short ($body_len chars, minimum 20)" >&2
    errors=$((errors + 1))
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
