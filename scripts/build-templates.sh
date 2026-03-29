#!/bin/bash
# build-templates.sh — Copy .claude/ source files to templates/ for npm distribution.
# The templates/ directory is what gets installed into .gobbi/core/ by init.
# gobbi-hack is excluded — it's user-owned and created empty by install.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

echo "Cleaning templates/..."
rm -rf templates/

echo "Creating template directories..."
mkdir -p templates/skills templates/agents templates/hooks

echo "Copying entry-point skill (gobbi)..."
cp -r .claude/skills/gobbi templates/skills/gobbi

echo "Copying gobbi-* skills (excluding gobbi-hack)..."
for dir in .claude/skills/gobbi-*; do
  name="$(basename "$dir")"
  if [ "$name" = "gobbi-hack" ]; then
    echo "  Skipping $name (user-owned)"
    continue
  fi
  cp -r "$dir" templates/skills/
done

echo "Copying agent definitions..."
cp .claude/agents/gobbi-* templates/agents/

echo "Copying hook scripts..."
cp .claude/hooks/* templates/hooks/

echo "Copying GOBBI.md..."
cp .claude/GOBBI.md templates/GOBBI.md

echo "Copying settings.json..."
cp .claude/settings.json templates/settings.json

echo "Done. Templates built successfully."
