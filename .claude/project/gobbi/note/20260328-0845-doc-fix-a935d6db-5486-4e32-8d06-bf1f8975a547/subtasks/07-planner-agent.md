# Subtask 07: Planner Agent Definition

## What was written

`/playinganalytics/git/gobbi/.claude/agents/gobbi-planner.md` — full agent definition for the gobbi-planner agent.

## Line count

81 lines (gobbi-pi.md is also 81 lines).

## Structural comparison with gobbi-pi.md

| Element | gobbi-pi.md | gobbi-planner.md |
|---------|------------|------------------|
| Frontmatter | name, description, tools, model | name, description, tools (no model — uses default) |
| Identity paragraph | Lines 8-14, research/discussion persona | Lines 8-14, architecture/decomposition persona |
| Out of scope | Line 14, inline with identity | Line 14, inline with identity |
| Before You Start | Always + when relevant, 4 skills | Always + when relevant, 4 skills |
| Study | Codebase + gotchas + web research | Codebase + gotchas + architecture docs |
| Plan | Investigation approach design | Decomposition approach design |
| Execute | Discussion via AskUserQuestion | Plan writing via EnterPlanMode |
| Verify | Completeness for evaluation handoff | Quality criteria from gobbi-plan |
| Memorize | Gotchas + constraints | Gotchas + constraints |
| Quality Expectations | Refined idea as output | Structured plan as output |
| Section count | 7 sections | 7 sections |

## Judgment calls

- **No `model` field in frontmatter.** The task spec did not include it, and planning work does not require Opus-tier reasoning the way deep investigation does. Left to default.
- **EnterPlanMode in Execute section.** The gobbi-plan skill and the gotcha both emphasize using EnterPlanMode for plan writing. Included this as guidance in the Execute lifecycle step since it is the planner's core tool.
- **No AskUserQuestion in tools.** The task spec explicitly lists AskUserQuestion as out of scope. The planner reports back to the orchestrator, which handles user discussion.
- **Matched gobbi-pi tone.** Used the same pattern: specialist persona in opening, "you think like a..." framing, brief bullet points in lifecycle, closing paragraph about depth matching complexity.
