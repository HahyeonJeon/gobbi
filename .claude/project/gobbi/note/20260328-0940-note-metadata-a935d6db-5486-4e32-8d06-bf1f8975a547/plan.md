# Plan: Note Metadata Scripts + Migration

## Goal

Create SessionStart hook for session metadata, two utility scripts for note management, update skills, and migrate 5 existing directories.

## Subtasks (4 agents, 1 wave)

| # | Task | Agent | Files |
|---|------|-------|-------|
| 1 | SessionStart hook + note scripts | general-purpose | session-metadata.sh (hook), note-metadata.sh, note-init.sh, settings.json |
| 2 | Update gobbi-note/SKILL.md | general-purpose | gobbi-note/SKILL.md |
| 3 | Update gobbi-collection/SKILL.md | general-purpose | gobbi-collection/SKILL.md |
| 4 | Migrate 5 directories + README | general-purpose | 5 note dirs + README.md |

## Key Design Decision

SessionStart hook captures session_id from Claude Code's hook input JSON and persists to $CLAUDE_ENV_FILE. Scripts read env vars — no transcript parsing needed. Eliminates concurrent session problem.

## User Decision

Approved without evaluation.
