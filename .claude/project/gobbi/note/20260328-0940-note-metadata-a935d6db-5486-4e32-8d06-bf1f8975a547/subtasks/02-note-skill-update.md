# 02 — Update gobbi-note SKILL.md

## Status: Complete

## What changed

Updated `/playinganalytics/git/gobbi/.claude/skills/gobbi-note/SKILL.md` with three changes:

### 1. New naming convention

- Changed from `{YYYYMMDD-HHMM}-{slug}` to `{YYYYMMDD}-{session_id_short}-{slug}`
- Documented `session_id_short` as first 8 chars of session UUID via `$CLAUDE_SESSION_ID_SHORT`
- Added example: `20260328-ed5b2db3-doc-review`
- Updated directory tree illustration and Naming section

### 2. Script references

- Added new "Initialization" subsection under "Where to Write"
- References `note-init.sh` at `.claude/skills/gobbi-note/scripts/note-init.sh` — describes what it does (metadata extraction, directory creation, README.md generation, subtasks/ setup) and its arguments (project name, task slug)
- References `note-metadata.sh` at `.claude/skills/gobbi-note/scripts/note-metadata.sh` for metadata-only use
- No code blocks showing commands — described by path and purpose only, per gobbi-claude standards

### 3. README.md per task directory

- Added README.md to the directory tree illustration with annotation "session context metadata (YAML frontmatter)"
- Added "README.md (per task directory)" subsection to "What to Write at Each Step" describing the YAML frontmatter contents: session_id, datetime, git_branch, cwd, claude_model, transcript path, task name
- Notes that it is created automatically by note-init.sh

## Preserved

- All frontmatter unchanged
- Core principle section unchanged
- All existing "What to Write" entries (ideation.md, plan.md, execution.md, subtasks/, feedback.md, review.md) unchanged
- "When to Write" section unchanged
- README.md index section unchanged

## Verification

- File is 122 lines (under 200 limit)
- Zero code blocks showing commands (only structural illustrations retained from original)
- All three changes applied and verifiable in the file
