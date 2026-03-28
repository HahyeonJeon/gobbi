# Execution: Note Metadata Scripts + Migration

## Overview

4 agents in 1 wave: SessionStart hook, 2 utility scripts, 2 skill updates, 5 directory migrations.

## Wave 1 (4 agents in parallel)

### Task 1: SessionStart hook + note scripts

**Agent:** general-purpose
**Result:** Created 3 scripts:
- `.claude/hooks/session-metadata.sh` — SessionStart hook reads JSON stdin, extracts session_id/transcript_path/cwd/model/source, writes to $CLAUDE_ENV_FILE. Uses jq with python3 fallback.
- `.claude/skills/gobbi-note/scripts/note-metadata.sh` — Reads env vars, computes derived values (date, datetime, git_branch), outputs key=value pairs.
- `.claude/skills/gobbi-note/scripts/note-init.sh` — Takes project-name + task-slug, creates directory with README.md (YAML frontmatter) and subtasks/.
Updated settings.json with SessionStart hook entry (matcher: startup|resume|compact).

### Task 2: Update gobbi-note/SKILL.md

**Agent:** general-purpose
**Result:** Updated naming convention to `{YYYYMMDD}-{session_id_short}-{slug}`. Added Initialization subsection referencing scripts by path (no code blocks). Added README.md to directory tree and "What to Write" section. 122 lines final.

### Task 3: Update gobbi-collection/SKILL.md

**Agent:** general-purpose
**Result:** Aligned naming convention. Updated directory tree with new naming + README.md. Added script reference paragraph. 78 lines final.
**Note:** Agent found the actual script name was `note-metadata.sh` (not `note-init.sh` as briefed for directory initialization reference). Both scripts exist.

### Task 4: Migrate directories + update README

**Agent:** general-purpose
**Result:** Matched sessions by grepping transcripts for mkdir commands:
- `a935d6db` → 4 directories (doc-review, doc-fix, gobbi-improvements, note-metadata)
- `ed5b2db3` → 1 directory (installation-system)
All 5 renamed. README.md updated with Session column and links.

## Verification

- All 3 scripts executable
- All 5 directories in new format
- Zero old naming pattern in skill files
- settings.json has SessionStart hook

## Issues Encountered

Task 3 agent found script naming inconsistency between briefing and actual files. Non-blocking — both scripts exist and work.

## Deviations from Plan

None.
