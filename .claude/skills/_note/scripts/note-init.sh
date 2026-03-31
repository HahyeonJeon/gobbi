#!/bin/bash
# Creates a note directory structure for a task.
# Usage: bash note-init.sh <project-name> <task-slug>

set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 <project-name> <task-slug>" >&2
  exit 1
fi

project_name="$1"
slug="$2"

# Source metadata from note-metadata.sh
metadata_output=$(bash "$(dirname "$0")/note-metadata.sh") || {
  echo "Error: Failed to get session metadata" >&2
  exit 1
}
eval "$metadata_output"

# Build directory path
note_dir="${CLAUDE_PROJECT_DIR}/.claude/project/${project_name}/note/${datetime}-${slug}-${session_id}"
mkdir -p "${note_dir}/subtasks"

# Format datetime for YAML frontmatter (YYYY-MM-DDTHH:MM)
formatted_datetime="${datetime:0:4}-${datetime:4:2}-${datetime:6:2}T${datetime:9:2}:${datetime:11:2}"

# Write README.md
cat > "${note_dir}/README.md" <<HEREDOC
---
session_id: ${session_id}
datetime: ${formatted_datetime}
git_branch: ${git_branch}
cwd: ${cwd}
claude_model: ${claude_model}
transcript: ${transcript_path}
task: ${slug}
---

# ${slug}

<!-- Task description goes here -->
HEREDOC

# Output absolute path
echo "$(cd "${note_dir}" && pwd)"
