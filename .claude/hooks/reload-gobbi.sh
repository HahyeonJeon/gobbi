#!/bin/bash
# PostCompact hook — reload core gobbi skills after compaction.
# Stdout is injected into Claude's context, prompting skill reload.

echo "Context was compacted. MUST reload core skills now: /gobbi, /gobbi-orchestration, /gobbi-claude, /gobbi-gotcha"

exit 0
