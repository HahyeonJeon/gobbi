# `archive/`

**Index of retired / superseded / shipped artifacts** — closed sessions, completed backlogs, superseded designs, deprecated features. Active files stay in their active directories; this directory holds index entries pointing back at them with archival metadata.

## Lifecycle (Wrap-up direct write)

This template is written **directly by Wrap-up's MEMORIZATION** to its project-memory destination — there is no loop-MEMORIZATION staging path. Wrap-up authors the index entry when a session-level event triggers archival (a backlog ships, a design is superseded, a feature retires) and stamps this template.

Wrap-up is the sole writer; loop MEMORIZATION (Ideation / Planning / Execution) never writes to this destination.

---

The archive is the project's **chronological index of state transitions**, not a file mover. Active artifacts stay in their active locations; their lifecycle status is updated **in place** via frontmatter (`status: superseded` / `status: archived` / `superseded_by:` / `archived_at:`). The `archive/` directory holds **archive entries** — small index files — that record the state transition + point at the now-archived active file.

This in-place model preserves the system-wide **no-delete + no-move invariant**: every file the workflow ever wrote remains at its original path, with frontmatter explaining its current lifecycle state. The archive index lets readers find "what was archived this quarter" without having to scan every active directory for `status: archived` frontmatter.

## When to write

- **When a backlog entry ships**: update the original `features/{feature-name}/backlogs/{slug}.md` in place — flip `status: shipped` + add `shipped_in: {changelog path}` frontmatter. **Also** write `archive/backlogs/{YYYY-MM-DD}-{slug}.md` index entry pointing back at the now-shipped backlog.
- **When a design is superseded**: update the original `features/{feature-name}/design/{slug}.md` in place — flip `status: superseded` + add `superseded_by: {new design path}` frontmatter. **Also** write `archive/design/{YYYY-MM-DD}-{slug}.md` index entry.
- **When a feature is retired**: update `features/{feature-name}/README.md` in place — flip `status: archived` + add `archived_at: {YYYY-MM-DD}` + `archive_reason: <one-line>` frontmatter. **Also** write `archive/features/{YYYY-MM-DD}-{feature-name}.md` index entry pointing at the now-retired feature directory.
- **When a session is closed and the user wants it archive-indexed**: write `archive/sessions/{YYYY-MM-DD}-{session-id}.md` index entry summarizing the session's outcome. The original `sessions/{date}-{session-id}/` directory is NOT moved.

The archive index is **always a NEW file** — never a move of an existing file. The active artifact remains at its original path.

## Location

- Project-level only: `.gobbi/projects/{project-name}/archive/`

The archive mirrors the project tree's structural categories as **index directories** (not content directories):

```
archive/
├── sessions/{YYYY-MM-DD}-{session-id}.md   ← index entry per archived session
├── backlogs/{YYYY-MM-DD}-{slug}.md         ← index entry per shipped/dropped backlog
├── design/{YYYY-MM-DD}-{slug}.md           ← index entry per superseded design
├── decisions/{YYYY-MM-DD}-{slug}.md        ← index entry per superseded decision
├── plans/{YYYY-MM-DD}-{slug}.md            ← index entry per superseded plan
├── features/{YYYY-MM-DD}-{feature-name}.md ← index entry per retired feature
└── notes/{YYYY-MM-DD}-{slug}.md            ← index entry per archived note
```

## Naming

Always date-prefixed: `{YYYY-MM-DD}-{slug}.md`. The date is **the archive date** (when the state transition happened), not the original creation date.

## Item template (the archive index entry)

```yaml
---
archived_at: YYYY-MM-DD
archived_session: {session-id at time of archive}
archive_reason: shipped | superseded | retired | dropped | abandoned
original_path: {path to the active artifact this entry indexes}
shipped_in: {changelog path} or null
superseded_by: {new artifact path} or null
related: [{related archive entries}]
---

# Archive entry — {one-line subject}

## Original
Path: `{original_path}`
Original creation date: `{YYYY-MM-DD from the original artifact's frontmatter}`

## Reason
{One paragraph: why this artifact moved into archived state.}

## Cross-references
{Pointers to the changelog that recorded the shipping, the new design that superseded this, or the backlog where dropped items were rationalized.}
```

The body is short — the archive entry is an INDEX, not a copy. Readers click `original_path` to see the actual content.

## What NOT to archive-index

- **`mistakes/`** — mistakes stay active forever; the trap persists.
- **`learnings/`** — learnings transcend any specific feature.
- **`references/`** — references stay active; the insight remains useful.
- **`reviews/`** + **`reports/`** — append-only history; supersession via `status:` frontmatter only, no archive index needed unless the maintainer wants a structured "what was retired this quarter" view.

## Recovery (reactivating an archived artifact)

Reactivating an archived artifact is **explicit**:
1. Update the active artifact's frontmatter in place — flip `status:` back to `active` / `accepted` / etc.
2. Delete the archive index entry at `archive/{...}/{YYYY-MM-DD}-{slug}.md` — this is the **only** delete operation the workflow allows, and it requires user AskUserQuestion confirmation.

## Pruning

The archive index is append-only by convention. Pruning archive entries is a user decision, never automatic.
