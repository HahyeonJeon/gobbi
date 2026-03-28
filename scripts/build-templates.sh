#!/bin/bash
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

echo "Copying gobbi-* skills..."
cp -r .claude/skills/gobbi-* templates/skills/

echo "Copying agent definitions..."
cp .claude/agents/gobbi-* templates/agents/

echo "Copying hook scripts..."
cp .claude/hooks/* templates/hooks/

echo "Copying GOBBI.md..."
cp .claude/GOBBI.md templates/GOBBI.md

echo "Copying settings.json..."
cp .claude/settings.json templates/settings.json

echo "Done. Templates built successfully."
