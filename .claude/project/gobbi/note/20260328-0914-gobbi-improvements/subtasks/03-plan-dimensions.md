# Subtask 03: Add plan dimensions to gobbi-plan

## What was added

Two new bullet items in the "What a Good Plan Contains" > "Tasks" list:

1. **Files modified** -- which files a task will create or modify. Enables overlap detection between parallel tasks, scope verification by evaluators, and post-wave consistency checks. Explicitly acknowledges that not every task has meaningful file targets.

2. **Verification approach** -- how to confirm a task's output is correct. Gives evaluators concrete criteria instead of only reasoning about the output. Explicitly acknowledges that pure exploration tasks may not have verifiable outputs.

Both are framed as principles of explicitness, not rigid template requirements.

## What was NOT added

File overlap warning in "How to Decompose" or "Signs of a Bad Plan" -- this was already covered:
- Line 76: "Two tasks modify the same files (merge conflict risk)"
- Line 91: "Never plan tasks that overlap on the same files -- combine them or sequence them"

No duplication was introduced.

## Where

File: `.claude/skills/gobbi-plan/SKILL.md`
Section: "What a Good Plan Contains" > Tasks bullet list (lines 47-48)

## Line count

- Before: 90 lines
- After: 92 lines
