# Subtask 04: Collection Recipe Removal

## What was changed

Replaced the "What to Do" section in `gobbi-collection/SKILL.md`. The original had 4 numbered steps (a step-by-step recipe, which is a MUST AVOID anti-pattern per gobbi-claude). Replaced with four named responsibility descriptions:

- **Note persistence** — load gobbi-note, write all note files for the current task
- **Subtask preservation** — write subagent outputs to disk immediately after each wave (preserves the high-priority gotcha about deferred subtask writes)
- **Gotcha recording** — record corrections and mistakes via gobbi-gotcha
- **Phase transition** — AskUserQuestion for FEEDBACK, REVIEW, or FINISH

The rewrite uses bold-labeled responsibility paragraphs with em-dash separators, conveying the same obligations without prescribing a sequence.

## What was preserved (unchanged)

- Frontmatter (lines 1-5)
- Opening paragraph (lines 7-9)
- "Where to Write" section including the directory tree code block
- "Naming" section
- "README.md" section
- "Phase-Specific Collection" section
- "When to Collect" section

## Line count

- Before: 77 lines
- After: 75 lines
