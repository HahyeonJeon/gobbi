---
name: _collection
description: Persist the workflow trail and write notes at the end of each workflow cycle. Use during Step 4 (Collection) to write all note files and record gotchas.
allowed-tools: Write, Read, Glob, Bash
---

# Collection

Persist the workflow trail at the end of each workflow cycle. Must load _note to write note files. This step ensures all decisions, outcomes, and subagent results are recorded before proceeding.

---

## What to Do

Collection has four responsibilities: **note persistence**, **subtask preservation**, **gotcha recording**, and **phase transition**.

**Note persistence** — Load _note and write all note files for the current task: `ideation.md`, `plan.md`, `execution.md`, and each subagent's result as `subtasks/{NN}-{subtask-slug}.md`. Every workflow stage that produced output must have a corresponding note file on disk.

**Subtask preservation** — Subagent outputs exist only in conversation context and are lost when the conversation ends or compacts. Each wave's outputs must be written to `subtasks/` immediately after that wave completes — never deferred to collection, never summarized. Downstream agents (synthesis, evaluation) depend on these files existing on disk before they run.

**Gotcha recording** — Any corrections, surprises, or mistakes discovered during the workflow must be recorded via _gotcha before the cycle closes.

**Phase transition** — Use AskUserQuestion to ask the user: FEEDBACK, REVIEW, or FINISH?

---

## Where to Write

Notes go in `.claude/project/{project-name}/note/`:

```
.claude/project/{project-name}/note/
  README.md                                               — index of all task note directories
  {YYYYMMDD-HHMM}-{slug}-{session_id}/
    README.md                                             — session context metadata (YAML frontmatter)
    ideation.md                                           — ideas explored, trade-offs, chosen approach
    plan.md                                               — plan details, task decomposition, dependencies
    execution.md                                          — execution outcomes, issues encountered
    subtasks/
      {NN}-{subtask-slug}.md                              — copy of each subagent's task result
    feedback.md                                           — user feedback rounds (written during FEEDBACK phase)
    review.md                                             — review findings (written during REVIEW phase)
```

### Naming

**Task directory**: `{YYYYMMDD-HHMM}-{slug}-{session_id}` — datetime prefix for ordering with minute precision, slug for readability, full session UUID at the end for machine cross-referencing. The `session_id` is the full session UUID, available as `$CLAUDE_SESSION_ID`.

**Subtask files**: `{NN}-{slug}.md` — zero-padded sequence number for ordering, slug for readability.

**Directory initialization**: Initialize the task directory using the note-metadata script at `.claude/skills/_note/scripts/note-metadata.sh`. This script outputs session metadata (session ID, date, git branch, model, transcript path) as key-value pairs, which should be used to populate the task directory's README.md with session context.

---

## README.md

The index file lists all task note directories. Must update README.md after creating each new task note directory.

---

## Phase-Specific Collection

### After FEEDBACK phase

Write `feedback.md` to the existing task note directory. Append each feedback round — do not overwrite previous rounds.

### After REVIEW phase

Write `review.md` to the existing task note directory (or to `{task-slug}-review/` if it's a separate review directory).

---

## When to Collect

**Always collect** when the workflow involved delegation or produced results worth preserving.

**Skip collecting** when the task was trivial — a single small edit, a quick question, or a direct handle without delegation.
