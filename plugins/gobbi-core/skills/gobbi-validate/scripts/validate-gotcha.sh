#!/bin/bash
# Validates a gotcha .md file for structural correctness.
# Usage: bash validate-gotcha.sh <gotcha-file.md>
# Exit 0 on pass, exit 1 on failure.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <gotcha-file.md>" >&2
  exit 1
fi

file="$1"

if [ ! -f "$file" ]; then
  echo "FAIL: File not found: $file" >&2
  exit 1
fi

errors=0
warnings=0

# Check that file has at least one ## or ### heading (gotcha entry title)
entry_count=$(grep -cE '^#{2,3}\s+[^#]' "$file" || true)
if [ "$entry_count" -eq 0 ]; then
  echo "FAIL: $file: No gotcha entries found (expected ## or ### headings)" >&2
  errors=$((errors + 1))
fi

# For each entry (### heading), check required sections
# Entries are delimited by ### headings followed by content until the next ### or EOF
current_entry=""
current_entry_line=0
has_priority=false
has_what_happened=false
has_user_feedback=false
has_correct_approach=false

check_entry() {
  local entry="$1"
  local entry_line="$2"

  if [ -z "$entry" ]; then
    return
  fi

  if [ "$has_priority" = false ]; then
    echo "FAIL: $file:$entry_line: Entry '$entry' missing Priority line" >&2
    errors=$((errors + 1))
  fi
  if [ "$has_what_happened" = false ]; then
    echo "FAIL: $file:$entry_line: Entry '$entry' missing 'What happened' section" >&2
    errors=$((errors + 1))
  fi
  if [ "$has_user_feedback" = false ]; then
    echo "FAIL: $file:$entry_line: Entry '$entry' missing 'User feedback' section" >&2
    errors=$((errors + 1))
  fi
  if [ "$has_correct_approach" = false ]; then
    echo "FAIL: $file:$entry_line: Entry '$entry' missing 'Correct approach' section" >&2
    errors=$((errors + 1))
  fi
}

line_num=0
while IFS= read -r line || [ -n "$line" ]; do
  line_num=$((line_num + 1))

  # Detect entry headings (## or ### — gotcha entries typically use ### in existing files)
  if echo "$line" | grep -qE '^#{2,3}\s+[^#]'; then
    # Check previous entry before starting new one
    check_entry "$current_entry" "$current_entry_line"

    # Start new entry (strip leading ## or ###)
    current_entry=$(echo "$line" | sed 's/^#\{2,3\}[[:space:]]*//')
    current_entry_line=$line_num
    has_priority=false
    has_what_happened=false
    has_user_feedback=false
    has_correct_approach=false
    continue
  fi

  # Only check content lines if we're inside an entry
  if [ -n "$current_entry" ]; then
    # Check for Priority line
    if echo "$line" | grep -qE '^\*\*Priority:\*\*'; then
      has_priority=true
      # Validate priority value
      priority_val=$(echo "$line" | sed 's/.*\*\*Priority:\*\*[[:space:]]*//')
      case "$priority_val" in
        Critical|High|Medium|Low)
          ;;
        *)
          echo "FAIL: $file:$line_num: Invalid priority '$priority_val' in entry '$current_entry' — must be Critical, High, Medium, or Low" >&2
          errors=$((errors + 1))
          ;;
      esac
    fi

    # Check for What happened section
    if echo "$line" | grep -qE '^\*\*What happened:\*\*'; then
      has_what_happened=true
    fi

    # Check for User feedback section
    if echo "$line" | grep -qE '^\*\*User feedback:\*\*'; then
      has_user_feedback=true
    fi

    # Check for Correct approach section
    if echo "$line" | grep -qE '^\*\*Correct approach:\*\*'; then
      has_correct_approach=true
    fi
  fi
done < "$file"

# Check the last entry
check_entry "$current_entry" "$current_entry_line"

if [ "$errors" -gt 0 ]; then
  echo "FAILED: $file — $errors error(s)" >&2
  exit 1
fi

echo "PASS: $file"
exit 0
