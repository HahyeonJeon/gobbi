---
name: history
description: MUST load after the memory operation identifies content as completed session history. History is a preference skill for preserving short chronological records of durable project progression.
allowed-tools: Read, Grep, Glob
skill-type: preference
user-invocable: false
---

# History Memory

This internal child skill applies after the parent memory operation identifies content as completed session
history. It owns the content and structure of `memory/history/`; the parent skill owns when and how memory is
read, created, updated, moved, or deleted.

History preserves one short overall record for each completed session that produced a durable project
change. It is not a session transcript, activity log, or detailed report.

## Principles

### Preserve net change, not activity

History explains what durably changed by the end of the session. Commands, intermediate attempts, and
turn-by-turn progress belong elsewhere.

### Keep one session view of project progression

One record should make the completed session's combined effect on the project understandable without
splitting that effect across task-level entries.

### Preserve point-in-time truth

A history record describes the project at session completion. Later work adds later history instead of
rewriting the earlier account.

### Link to detail instead of copying it

History may link to designs, reports, learnings, materials, backlogs, or session evidence when detail
matters. It should not duplicate their contents.

## Rules

- **MUST create exactly one history record for each completed session with at least one durable project
  change.** A session with no durable project change creates no history file.
- **MUST keep a completed history record immutable.** Record a later correction or reversal in a new
  history file and link the earlier record when useful. Remove retained content only when security,
  privacy, legal, or repository authority requires removal.
- **MUST NOT require an Evidence section, frontmatter, lifecycle status, owner, task list, command log, or
  verification schema.** Evidence links remain optional within `Changes`.

## Preferences

### Structure

```text
history/
├── README.md
└── YYYY-MM-DD-{descriptive-title}.md
```

Keep the category flat. Each file represents one completed session, while `README.md` provides recursive
navigation.

### Path descriptions

| Path | Description | Example |
|---|---|---|
| `history/README.md` | Provides a link-only index of every history record, ordered newest first by completion date and by exact completion time within the same date. | |
| `history/YYYY-MM-DD-{descriptive-title}.md` | Contains one compact chronological record of a completed session's durable changes and project progression. | A session record for completing the memory-skill redesign |

### Naming convention

```text
history/YYYY-MM-DD-{descriptive-kebab-case-title}.md
```

```text
history/2026-07-30-memory-skill-categories.md
history/2026-07-30-history-memory-defined.md
```

Use the UTC completion date and a title that names the session's overall durable change. Distinguish
same-day records with a more specific feature or outcome title rather than a sequence number.

### Record shape

Use exactly two record parts: `Completed at` and `Changes`.

```markdown
# Memory skill categories completed

**Completed at:** 2026-07-30T18:42:00Z

## Changes

- Added memory structures for design, learnings, reports, materials, and backlogs, giving each memory type a
  clear and predictable home.
- Reworked the parent memory operation around category routing, separating memory updates from
  category-specific content structures.
```

The heading and body are free-form within this compact shape. Evidence links may appear naturally in
`Changes`.

#### Content boundaries

| Part | Include | Exclude |
|---|---|---|
| `Completed at` | Exact session-completion time in ISO 8601 UTC | Approximate dates or task timestamps |
| `Changes` | Net durable additions, revisions, moves, and removals, with each sentence explaining how the change advanced or altered the project; include material incomplete work when needed | Commands, attempts, discussion turns, temporary state, or detailed analysis |

### Behavior

- Treat a completed record as a preserved point-in-time account.
- When later work corrects or reverses it, write a new history record that explains the new outcome.
- Link the earlier record when the relationship helps the reader.

## References
