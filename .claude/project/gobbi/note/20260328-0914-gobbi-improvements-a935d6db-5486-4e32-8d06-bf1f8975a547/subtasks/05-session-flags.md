# Subtask 05: Session Workflow Flags

## What was added

Extended the session-start setup in `gobbi/SKILL.md` with a second AskUserQuestion about evaluation mode preference. The skill now asks two questions at session start instead of one.

**Added evaluation mode question with 3 options:**
- **Ask each time (default)** — orchestrator asks before each evaluation whether to spawn evaluators. Per-step flexibility based on task complexity.
- **Always evaluate** — skip the evaluation question, always spawn evaluators. Maximum quality checking.
- **Skip evaluation** — skip the evaluation question, never spawn evaluators unless explicitly requested. Maximum speed.

**Added session defaults note:** Explains that both session choices (trivial range and evaluation mode) are defaults that can be overridden at any step, and points users to gobbi-hack for persistent customization across sessions.

## Framing decisions

- Evaluation options framed around what the orchestrator does (asks/spawns/skips), not around the user's personality or skill level
- Default option ("Ask each time") preserves current behavior exactly, so existing users see no change unless they opt in
- "Always evaluate" and "Skip evaluation" both described by their effect on workflow interruptions — the former removes evaluation prompts by always running them, the latter removes them by never running them
- Cross-reference to gobbi-hack kept to a single sentence to avoid over-explaining a separate system

## Line count

- Before: 58 lines
- After: 67 lines
- Delta: +9 lines (well under the 100-line ceiling)

## File modified

`/playinganalytics/git/gobbi/.claude/skills/gobbi/SKILL.md`
