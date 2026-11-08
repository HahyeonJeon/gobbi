---
name: memory
description: "Memory decides whether a file is project memory or a session record, and how to write it. Use it when reading or writing a project's `memory/` or `sessions/` tree."
allowed-tools: Read, Grep, Glob
skill-type: operation
---

# Memory

Memory decides when a file is project memory or a session record, then how to write it. Use it when reading or
writing `.gobbi/projects/<project>/memory/` or `sessions/`.

## Principles

### Keep a current model, not a session stack

Project memory explains the project now and keeps its finished accounts. Update or remove a current fact, and
leave a history file or a dated report in place.

### Put each item in one home

The reason a future agent will look for the item chooses its directory. Link from related files instead of
copying.

### Write only useful future context

Keep evidence-backed knowledge that later work will use to decide or act. Exclude secrets, transcripts, raw
logs, and trivia.

## Rules

- **Write project memory only under the directories in [Memory directories](memory.md), and session records
  only under those in [Session records](record.md).** Agents look only there, so reject parent traversal,
  symlink escape, and a different project.
- **Update or merge an existing home before creating a file, and link to it instead of copying.** Copies drift
  apart and a reader cannot tell which is current, so remove stale current content and keep indexes current.
- **Leave history files and dated reports as point-in-time records.** They show what was true then, so correct
  only a factual error in place and record later work in a new dated file.
- **Follow the definition, naming, and writing columns in the directory tables, and add no directory they do
  not list.** Later agents find memory by those names.
- **NEVER delete a session root, store secrets, or make a Memory write the caller or user did not name.** A
  session root holds recovery evidence and tracked memory travels with the repository; session cleanup is a
  separately authorized worktree action.

## Procedure

### Phase 1 — Write a Memory file

Put one item in its single home. Done when the path stays inside the root, the name and required fields match
the row, the current memory the write replaces is gone, and any index the row names lists the file.

#### 1.1 Choose the home

- Stop when the item is a secret, a transcript, a raw log, or trivia. A file under `memory/` is memory,
  including a report or history account; an ignored file under `sessions/` is a session record.
- Pick the one row in [Memory directories](memory.md) or [Session records](record.md) a future agent would
  search. Write a session record only at the caller-named path, and return to the caller when no row fits.

### Phase 2 — Closure

Carry the session's accepted knowledge into project memory. Done when each accepted item has one current home,
the note links to the homes it changed, and the `reports/` and `history/` indexes list the new files.

#### 2.1 Extract accepted memory

- Enter only from Wrap-up or Cowork closure. Extract accepted design, decisions, intended behaviors, and
  standing preferences into their homes under `design/`, `learnings/`, and `backlogs/`.
- Exclude talk, transcripts, rejected options, one-session instructions, Git action states, recovery commands,
  and secrets.

#### 2.2 Write the closure accounts

- Write one `reports/note/` work account from the [memory-note template](../wrap-up/templates/memory-note.md),
  and one `history/` file only when the session made a durable project change.

## References

| Name | Description |
|---|---|
| [Memory directories](memory.md) | Definition, naming, and writing rules for every directory under `memory/`. |
| [Session records](record.md) | Definition, naming, and writing rules for session records under `sessions/`. |
| [Wrap-up](../wrap-up/SKILL.md) | Workflow caller that runs Closure and owns its Git steps. |
| [Git](../git/SKILL.md) | Conventions for Memory commit messages. |
