#!/bin/bash
# Lints a .md file for gobbi-claude anti-patterns.
# Usage: bash lint-skill.sh <file.md>
# Exit 0 if clean, exit 1 if violations found.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <file.md>" >&2
  exit 1
fi

file="$1"

if [ ! -f "$file" ]; then
  echo "FAIL: File not found: $file" >&2
  exit 1
fi

violations=0

# --- Check for code blocks containing actual code (not directory trees) ---
# Find all ``` markers and extract code block contents
in_code_block=false
code_block_start=0
code_block_content=""
line_num=0

while IFS= read -r line || [ -n "$line" ]; do
  line_num=$((line_num + 1))

  if echo "$line" | grep -qE '^\s*```'; then
    if [ "$in_code_block" = false ]; then
      in_code_block=true
      code_block_start=$line_num
      code_block_content=""
    else
      in_code_block=false

      # Analyze the code block content
      # Check if it's a directory tree (acceptable)
      is_dir_tree=false
      if echo "$code_block_content" | grep -qE '(├──|└──|│|\.claude/|/note/|/project/)'; then
        is_dir_tree=true
      fi

      # Check if it contains actual code keywords (not acceptable)
      has_code=false
      if echo "$code_block_content" | grep -qE '\b(function|const |let |var |import |export |class |def |return |async |await |interface |type |enum |struct |impl |fn |pub |module |require\(|from |extends |implements )\b'; then
        has_code=true
      fi

      # A code block with code keywords that isn't a directory tree is a violation
      if [ "$has_code" = true ] && [ "$is_dir_tree" = false ]; then
        echo "VIOLATION: $file:$code_block_start: Code example in code block (contains programming keywords)" >&2
        violations=$((violations + 1))
      fi
    fi
  elif [ "$in_code_block" = true ]; then
    code_block_content="${code_block_content}${line}
"
  fi
done < "$file"

# --- Check for BAD/GOOD comparison patterns ---
# Look for "BAD" and "GOOD" as headers or labels
line_num=0
while IFS= read -r line || [ -n "$line" ]; do
  line_num=$((line_num + 1))

  # Check for BAD/GOOD as markdown headers or standalone labels
  if echo "$line" | grep -qE '^\s*(#{1,6}\s+)?(BAD|GOOD)\s*[:.]?\s*$'; then
    echo "VIOLATION: $file:$line_num: BAD/GOOD comparison pattern" >&2
    violations=$((violations + 1))
  fi

  # Check for BAD/GOOD as inline labels near each other (e.g., "**BAD:**" or "**GOOD:**")
  if echo "$line" | grep -qE '\*\*(BAD|GOOD)\*\*'; then
    echo "VIOLATION: $file:$line_num: BAD/GOOD comparison label" >&2
    violations=$((violations + 1))
  fi
done < "$file"

# --- Check for step-by-step numbered recipes ---
# Heuristic: 4+ consecutive numbered items with imperative verbs reads like a procedure manual
# Only flag when the pattern is clearly a recipe, not a regular numbered list
consecutive_imperatives=0
recipe_start=0
line_num=0
while IFS= read -r line || [ -n "$line" ]; do
  line_num=$((line_num + 1))

  # Match numbered list items starting with imperative verbs
  if echo "$line" | grep -qE '^\s*[0-9]+\.\s+(Run|Create|Open|Set|Add|Install|Configure|Execute|Copy|Move|Delete|Write|Build|Deploy|Start|Stop|Enable|Disable|Update|Download|Upload|Check|Verify|Ensure|Navigate|Click|Select|Enter|Type)\b'; then
    if [ "$consecutive_imperatives" -eq 0 ]; then
      recipe_start=$line_num
    fi
    consecutive_imperatives=$((consecutive_imperatives + 1))
  else
    # Non-matching line: check if we accumulated enough for a recipe
    if [ "$consecutive_imperatives" -ge 4 ]; then
      echo "VIOLATION: $file:$recipe_start: Step-by-step recipe (${consecutive_imperatives} consecutive imperative numbered steps)" >&2
      violations=$((violations + 1))
    fi
    consecutive_imperatives=0
  fi
done < "$file"
# Check trailing accumulation
if [ "$consecutive_imperatives" -ge 4 ]; then
  echo "VIOLATION: $file:$recipe_start: Step-by-step recipe (${consecutive_imperatives} consecutive imperative numbered steps)" >&2
  violations=$((violations + 1))
fi

# --- Check for interface definitions with type signatures ---
line_num=0
in_code_block=false
while IFS= read -r line || [ -n "$line" ]; do
  line_num=$((line_num + 1))

  if echo "$line" | grep -qE '^\s*```'; then
    if [ "$in_code_block" = false ]; then
      in_code_block=true
    else
      in_code_block=false
    fi
  elif [ "$in_code_block" = true ]; then
    # Check for TypeScript/Go interface patterns
    if echo "$line" | grep -qE '^\s*(interface|type)\s+[A-Z]\w+\s*(\{|=)'; then
      echo "VIOLATION: $file:$line_num: Interface/type definition in code block" >&2
      violations=$((violations + 1))
    fi
  fi
done < "$file"

if [ "$violations" -gt 0 ]; then
  echo "FAILED: $file — $violations violation(s)" >&2
  exit 1
fi

echo "CLEAN: $file"
exit 0
