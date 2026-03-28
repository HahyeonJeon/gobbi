# Subtask 03: gobbi-collection SKILL.md Update

## Task

Update gobbi-collection/SKILL.md to align with the new note naming convention introduced by the note-metadata work.

## Changes Made

**1. Naming convention** (line 47): Changed from `{YYYYMMDD-HHMM}-{slug}` to `{YYYYMMDD}-{session_id_short}-{slug}`. Added explanation that `session_id_short` is the first 8 chars of the session UUID from `$CLAUDE_SESSION_ID_SHORT`.

**2. Directory tree** (lines 31-43): Updated the task directory name to show new format. Added `README.md` inside the task directory with description "session context metadata (YAML frontmatter)".

**3. Script reference** (line 51): Added "Directory initialization" paragraph referencing `.claude/skills/gobbi-note/scripts/note-metadata.sh`. Describes what the script outputs (session metadata as key-value pairs) and how to use it (populate the task directory's README.md). No code blocks included.

## Preserved

- Frontmatter (lines 1-5)
- "What to Do" section with its four responsibilities (lines 13-23) -- not reverted
- "Phase-Specific Collection" section (lines 61-69)
- "When to Collect" section (lines 73-77)

## Verification

- File is 78 lines (under 200 limit)
- No code blocks added outside the existing directory tree illustration
- Naming convention matches gobbi-note SKILL.md's convention exactly
- Script path references the actual file on disk (`note-metadata.sh`, not `note-init.sh`)

## Note

The task briefing referenced a script at `scripts/note-init.sh` but the actual script on disk is `scripts/note-metadata.sh`. Used the actual filename.
