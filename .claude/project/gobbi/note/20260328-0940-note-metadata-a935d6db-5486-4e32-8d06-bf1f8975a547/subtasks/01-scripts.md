# Subtask 01: Create session metadata hook and note utility scripts

## What was created

### 1. `.claude/hooks/session-metadata.sh` (SessionStart hook)
- Reads JSON from stdin containing session_id, transcript_path, cwd, model, source
- Extracts fields using `jq` with python3 fallback
- Writes 5 `export` lines to `$CLAUDE_ENV_FILE`: `CLAUDE_SESSION_ID`, `CLAUDE_SESSION_ID_SHORT` (first 8 chars), `CLAUDE_TRANSCRIPT_PATH`, `CLAUDE_MODEL`, `CLAUDE_SESSION_SOURCE`
- Always exits 0 (never blocks session start)

### 2. `.claude/skills/gobbi-note/scripts/note-metadata.sh`
- Reads env vars set by the hook and computes date, datetime, git_branch, cwd
- Outputs key=value pairs on stdout (8 fields)
- Fails with descriptive stderr message if `CLAUDE_SESSION_ID` is not set

### 3. `.claude/skills/gobbi-note/scripts/note-init.sh`
- Takes `<project-name>` and `<task-slug>` arguments
- Sources note-metadata.sh via `eval`
- Creates `.claude/project/{project}/note/{date}-{session_id_short}-{slug}/` with `subtasks/` subdir
- Writes README.md with YAML frontmatter (session_id, datetime, git_branch, cwd, claude_model, transcript, task)
- Outputs absolute path of created directory

### 4. `.claude/settings.json` updated
- Added `SessionStart` hook entry with matcher `startup|resume|compact` pointing to session-metadata.sh
- Existing `PostCompact` hook preserved unchanged

## Verification results

| Check | Result |
|-------|--------|
| All 3 scripts executable (`-rwxrwxr-x`) | Pass |
| session-metadata.sh parses sample JSON and writes correct env vars | Pass |
| settings.json valid JSON | Pass |

## Design decisions

- **jq preferred, python3 fallback**: jq is available on this system, but the fallback ensures portability. If neither is available, the hook exits 0 silently rather than blocking.
- **SessionStart matcher excludes `clear`**: Per spec, `clear` starts a fresh context where previous session metadata is irrelevant.
- **note-init.sh uses `set -e`**: Ensures any failure (bad args, metadata failure, mkdir failure) stops execution immediately rather than creating partial state.
- **datetime formatting**: The `datetime` var from note-metadata.sh is `YYYYMMDD-HHMM` format; note-init.sh reformats it to `YYYY-MM-DDTHH:MM` for the YAML frontmatter to match ISO 8601 style.
- **Quoting in env exports**: Values are written unquoted to `$CLAUDE_ENV_FILE` since session IDs, paths, and model names don't contain spaces. This matches the pattern in the existing `load-notification-env.sh` hook.
