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

Note directories follow the structure defined in _note. See _note for directory naming, file layout, and the initialization script.

**Directory initialization**: Initialize note directories using the `note-init.sh` script in `_note/scripts/`. It takes the project name and task slug as arguments and handles the full chain: metadata extraction, directory creation, README.md generation, and subtasks/ directory setup.

---

## README.md

The index file lists all task note directories. Must update README.md after creating each new task note directory.

---

## Phase-Specific Collection

See _note for what to include in each note file (ideation.md, plan.md, execution.md, etc.).

### After TASK phase (standard collection)

When collecting evaluation findings across subtasks, organize by severity tier: Critical findings first (blocking issues that were resolved), then Important (significant issues addressed), then Suggestions (deferred or noted for future work), then Strengths (positive patterns worth preserving). This tiered format surfaces the most actionable information first and gives the user a quick scan of what mattered most.

### After FEEDBACK phase

Write `feedback.md` to the existing task note directory. Append each feedback round — do not overwrite previous rounds.

### After REVIEW phase

Write `review.md` to the existing task note directory (or to `{task-slug}-review/` if it's a separate review directory).

---

## When to Collect

**Always collect** when the workflow involved delegation or produced results worth preserving.

**Skip collecting** when the task was trivial — a single small edit, a quick question, or a direct handle without delegation.

---

## Session Learning Capture

After writing notes and recording gotchas, use AskUserQuestion to ask: **"What non-obvious knowledge was discovered this session?"**

This complements per-agent Memorize steps by capturing orchestrator-level insights that no single agent saw. The user may say "nothing" — the question ensures knowledge doesn't get lost silently.

**Capture categories:**

- **Gotchas** — mistakes or wrong assumptions corrected during the session. Record via _gotcha.
- **CLAUDE.md additions** — conventions or patterns discovered that should persist across sessions. Add as one-line entries to CLAUDE.md.
- **Skill updates** — behavioral patterns identified that a skill should teach. When a learning is categorized as a skill update, the orchestrator MUST propose a concrete change to the skill rather than merely flagging it for later. This is opt-in: only prompt if skill-update-type learnings were identified during the session. To propose a change:
  - Load _claude and _skills for authoring standards
  - Run lint/validation on modified skills (lint-skill.sh) to catch anti-patterns before presenting
  - Present proposed changes to user via AskUserQuestion: "Would you like to review proposed skill updates before finishing?"
  - If the user approves, apply the change to the skill file. If the user defers, persist the proposed change as a note in the task directory so future sessions can act on it.

Format: one-line entries, concise, actionable. "Discovery X because Y" — not narrative.
