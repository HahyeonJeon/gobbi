---
name: memory
description: "Memory is the operation that decides when a file is project memory or a session record, and how to write it."
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

### Let the caller name the write

A caller or an explicit user request owns when a write happens. Do not invent a Memory write.

## Rules

- **MUST write project memory only under the directories in [Memory directories](memory.md), and session
  records only under the directories in [Session records](record.md).** Reject parent traversal, symlink
  escape, and a different project.
- **MUST reconcile related files before creating one.** Update or merge an existing home, create only missing
  content, remove stale current content, and keep indexes and links current.
- **MUST keep one canonical home per item.** Place it in the directory that owns that kind, and link from
  related files.
- **MUST preserve history files and dated reports as point-in-time records.** Correct a factual error in place,
  and record later work in a new dated file.
- **MUST follow the definition, naming, and writing columns in the directory tables.** Do not add a directory
  those tables do not list.
- **NEVER delete a session root, store secrets, or invent a write the caller or user did not name.** Session
  cleanup is a separately authorized worktree action.

## Procedure

### Phase 1 — Choose memory or a session record

#### 1.1 Classify the item

- Treat every file that belongs under `memory/` as memory, including a report and a history account.
- Treat an ignored file under `sessions/` as a session record.
- Stop when the item is a secret, a transcript, a raw log, or trivia.

#### 1.2 Bind the home

- Read [Memory directories](memory.md) for a `memory/` path, or [Session records](record.md) for a `sessions/`
  path, and pick the one directory a future agent would search.
- Update or merge current memory. Create a new dated file for a report or a history account.
- Write a session record only at the caller-named path, and return to the caller when no listed directory fits.

### Phase 2 — Write the file

#### 2.1 Apply the directory rule

- Write the file with the naming and writing rule in the chosen row.
- Keep one home, and link from related memory instead of copying the body.
- Update that directory's README or index when the row says the index must list the file.

#### 2.2 Check the result

- Confirm the path stays inside the project `memory/` root or the session root, the name matches the row, and
  the required fields are present.
- Remove current memory that this write replaces. Leave an earlier report, history file, or session record in
  place, and link a later correction.
- Stop and report when the caller is missing.

### Phase 3 — Closure

#### 3.1 Extract accepted memory

- Enter only from Wrap-up or Cowork wrap-up. Extract accepted design, decisions, intended behaviors, and
  standing preferences into the homes in [Memory directories](memory.md).
- Place a decision in the design it shapes. Place a standing preference in `design/process/` unless it
  constrains a named feature or architecture file.

#### 3.2 Write the closure memory

- Write one `reports/note/` file as the durable work account.
- Write one `history/` file only when the session made a durable project change, and write none when it did not.
- Exclude talk, transcripts, rejected options, one-session instructions, Git action states, recovery commands,
  and secrets.

## References

| Name | Description |
|---|---|
| [Memory directories](memory.md) | Definition, naming, and writing rules for every directory under `memory/`. |
| [Session records](record.md) | Definition, naming, and writing rules for session records under `sessions/`. |
| [Wrap-up](../wrap-up/SKILL.md) | Caller that runs Closure, including the durable `reports/note/`. |
| [Git](../git/SKILL.md) | Conventions for Memory commit messages. |
