---
name: memory
description: MUST load when work finishes and durable project memory may need to change, including when a session closes. Memory is an operation skill for reading and updating durable project memory according to its defined structure.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Memory

Memory is an operation skill for keeping durable project memory useful and current according to its defined
structure. Load it when work finishes to preserve its durable context and when a session closes to record
project progression.

## Principles

### Preserve only useful future context

Project memory should help future work understand or decide something. Activity logs, conversation archives,
transient state, and facts without durable project value add noise rather than useful context.

### Write simply and compactly

Use simple words and the smallest clear Markdown shape that preserves the full durable meaning. Use short
prose for explanation, lists for parallel points, tables for repeated relationships, and fenced blocks for
literal structures or examples. Remove repetition, decorative language, and operational detail that does not
help future work.

### Keep memory up to date

Memory should reflect the project's latest durable state. Revise, move, or remove stale content promptly;
preserve completed historical records and express later changes in newer records.

## Rules

- **MUST require current evidence and durable future value.** Use project documents, code, explicit user
  decisions, and current memory. Reject secrets, unsupported speculation, raw conversation, transient task
  state, and operational exhaust.
- **MUST load every applicable category skill before changing files.** Load one category for ordinary work
  and both source and destination categories for a move. Do not change any files when a required category
  still contains placeholder guidance.
- **MUST verify and repair every memory change.** If verification finds a problem, repair only the affected
  paths and verify them again.

## Procedure

### Phase 1 — Review Completed Work

#### 1.1 Decide what should be remembered

| Memory content | Category skill | Home |
|---|---|---|
| Current project design and direction | [`design/SKILL.md`](design/SKILL.md) | `memory/design/` |
| Reusable knowledge and repeated mistakes | [`learnings/SKILL.md`](learnings/SKILL.md) | `memory/learnings/` |
| Completed work reports | [`reports/SKILL.md`](reports/SKILL.md) | `memory/reports/` |
| Completed session history and project progression | [`history/SKILL.md`](history/SKILL.md) | `memory/history/` |
| Durable sources and supporting inputs | [`materials/SKILL.md`](materials/SKILL.md) | `memory/materials/` |
| Deferred project or feature outcomes | [`backlogs/SKILL.md`](backlogs/SKILL.md) | `memory/backlogs/` |

- Each `Home` value resolves under the current project's memory root `.gobbi/projects/<project>/memory/`,
  where `<project>` is that project's directory name under `.gobbi/projects/`. The root is tracked, and git
  stores no empty directory, so a category directory exists only once it holds a real record.
- Review the completed work, relevant project evidence, accepted decisions, current project state, and
  existing memory.
- At session close, review the session's net durable change after updating the other memory records.
  Do not create a history record when the session produced no durable change.
- Describe what may need to be remembered and how it would help future work.
- Load the applicable category skill, or both source and destination category skills when the memory item
  may move.
- Review related records, indexes, links, and possible duplicates.
- Decide what memory must be created, updated, moved, or deleted, then continue to Phase 2.

### Phase 2 — Update the Memory

#### 2.1 Update the memory files

- Identify memory files, indexes, and links that must be created, updated, moved, or deleted.
- When deleting memory, confirm that no unique current knowledge or required live reference will be lost.
- Update the memory files according to the loaded category skills.
- Keep every affected index and link current in the same update.

### Phase 3 — Verify and Finish

#### 3.1 Verify and repair the memory

- When no memory change was needed, confirm that the operation changed no path.
- Reread every changed path and every related index or link.
- Confirm that the changed content follows the loaded category skills.
- Confirm that every changed path remains under the current project's
  `.gobbi/projects/<project>/memory/` root.
- Confirm that the memory is in its intended location and has no unexplained stale copy.
- Repair every problem found in the affected memory files, then repeat verification until every problem is
  resolved.

## References

| File | Description |
|---|---|
| [`design/SKILL.md`](design/SKILL.md) | Defines the content and structure of current architecture, feature, process, and roadmap memory. |
| [`learnings/SKILL.md`](learnings/SKILL.md) | Defines domain-organized tips and repeatable mistake patterns. |
| [`reports/SKILL.md`](reports/SKILL.md) | Defines durable notes, reviews, and analyses that record completed work. |
| [`history/SKILL.md`](history/SKILL.md) | Defines compact chronological records of completed sessions and project progression. |
| [`materials/SKILL.md`](materials/SKILL.md) | Defines durable source materials and supporting evidence organized by intended use. |
| [`backlogs/SKILL.md`](backlogs/SKILL.md) | Defines feature-grouped deferred outcomes and the reasons they were backlogged. |
