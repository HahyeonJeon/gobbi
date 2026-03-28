# Subtask 04: Design Docs Update

## Summary

Fixed deprecated TodoWrite references across 3 design docs and updated state.md to accurately reflect the notes-based state mechanism.

## Changes Per File

### state.md

**TodoWrite fix (line 47):** "Claude Code's TodoWrite" replaced with "Claude Code's TaskCreate and TaskList".

**Session continuity mechanics (line 48):** Removed reference to non-existent Context.md. Updated to describe the work trail (notes in `.claude/project/{project-name}/note/`) as the session continuity mechanism, with the orchestrator's resume protocol reading them to recover state.

**Cross-session continuity section (lines 52-60):** Replaced numbered recipe (4 sequential steps) with principle-based explanation. Key points:
- Notes serve as the state machine — directory existence indicates workflow progress
- On resume, reading the latest note directory recovers workflow position
- No dedicated handoff files or state reconstruction logic needed
- Notes are naturally ordered by timestamp in directory names

### vision.md

**TodoWrite fix (line 23):** "TodoWrite" replaced with "TaskCreate" in the Claude Code features list.

### gsd-analysis.md

**TodoWrite fix (line 85):** "TodoWrite" replaced with "TaskCreate" in the native features list.

## Totals

- **TodoWrite references fixed:** 4 (state.md: 1, vision.md: 1, gsd-analysis.md: 1, plus the implicit fix in state.md line 48 where Context.md was also corrected)
- **Recipe violations fixed:** 1 (state.md cross-session continuity section)
- **Stale references fixed:** 1 (non-existent Context.md in state.md)
- **Files modified:** 3
- **Files outside scope touched:** 0
