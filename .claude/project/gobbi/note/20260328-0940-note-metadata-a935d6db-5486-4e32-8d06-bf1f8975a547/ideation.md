# Ideation: Note Metadata Scripts

## Initial User Prompt

User observed that note directories don't include session_id and lack README.md per task. Proposed creating script tools in gobbi-note to get metadata from Claude Code transcripts and automate directory creation.

## Discussion Points

### Session ID extraction
Explored Claude Code environment — no `CLAUDE_SESSION_ID` env var exists. Found that transcript `.jsonl` files contain `sessionId` field in user messages. Reliable extraction: read the first user-type message from the most recent transcript file.

Available metadata from transcript: sessionId, timestamp, cwd, version (claude code), gitBranch.

### Script location
User chose: `.claude/skills/gobbi-note/scripts/` — scripts directory inside the gobbi-note skill. Keeps the script co-located with the skill that uses it.

### Directory naming
User chose: `{YYYYMMDD}-{session_id_short}-{slug}` (e.g., `20260328-ed5b2db3-doc-review`). Combines date for chronological sorting, session ID for cross-referencing, and slug for readability.

### README.md content
User chose: session context with YAML frontmatter — session_id, datetime, git branch, cwd, claude version, task summary — plus human-readable description.

### Script architecture
User wants two scripts:
1. **note-metadata.sh** — outputs session metadata as key=value pairs. Reusable, metadata-only.
2. **note-init.sh** — creates complete directory structure. Calls metadata script, creates directory with correct naming, writes README.md with YAML frontmatter, creates subtasks/ directory. Takes task slug as argument.

### Skill updates needed
- gobbi-note/SKILL.md: update naming convention, add README.md requirement, reference scripts
- gobbi-collection/SKILL.md: align naming convention
- Note index README.md: add session_id column

## Final Refined Idea

Two bash scripts in `.claude/skills/gobbi-note/scripts/`:

**note-metadata.sh** — Extracts session metadata from Claude Code transcript. Finds most recent `.jsonl` in the project's transcript directory, reads the first user message with sessionId field. Outputs key=value pairs: session_id, session_id_short (first 8 chars), datetime, date, git_branch, cwd, claude_version, transcript_path.

**note-init.sh** — Creates note directory structure. Takes one argument: task slug. Calls note-metadata.sh, creates `{YYYYMMDD}-{session_id_short}-{slug}/` directory with README.md (YAML frontmatter + description placeholder) and `subtasks/` subdirectory. Outputs the created directory path.

Update gobbi-note/SKILL.md and gobbi-collection/SKILL.md to reference the scripts and new naming convention.

## Evaluation

**Positive: PASS** — Architecture sound, transcript parsing verified, naming well-designed, plannable.

**Moderate: REVISE** — Missing success criteria, trade-offs, migration strategy, error handling. Concurrent session heuristic is biggest risk.

**Critical: REVISE** — Two blocking issues: (1) "most recent .jsonl" fails with concurrent sessions (verified live), (2) project hash derivation unspecified.

## Post-Evaluation Discussion

**Concurrent sessions:** User chose to accept limitation and document. Works for common case (single session). Script should note the limitation.

**Migration:** User chose to rename existing 4 directories to new format (need to match session IDs from transcripts).

**Project hash:** Document derivation: cwd with `/` replaced by `-`, prefixed with `-`. Script computes this.

**Additional resolutions:** Add success criteria, error handling (exit with message on transcript not found), backward compatibility in README index.
