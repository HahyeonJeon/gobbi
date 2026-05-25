# `archive/`

**Holding area for terminal artifacts moved here in full** — shipped backlogs, superseded designs, retired features, superseded mistakes, and other project-memory files that have reached a terminal state. Active files stay in their active directories until they reach a terminal state; this directory holds the actual moved files (frontmatter + body intact). Each file in `archive/` is a complete artifact, not a stub or pointer.

## Lifecycle (Wrap-up direct write)

This template is written **directly by Wrap-up's MEMORIZATION** to its project-memory destination — there is no loop-MEMORIZATION staging path. Wrap-up performs the move when a session-level event triggers archival (a backlog ships, a design is superseded, a feature retires) and stamps the archival frontmatter additions described below.

Wrap-up is the sole writer; loop MEMORIZATION (Ideation / Planning / Execution) never writes to this destination.

---

The archive is the project's **holding area for terminal artifacts moved in full**. When an artifact reaches a terminal state, its complete file (frontmatter + body) is **moved** from its active directory into `archive/{type}/{YYYY-MM-DD}-{slug}.md` using `git mv`. The active directory then shows only live work. The move IS the archival.

This model is **no-delete + move-on-terminal**: files are never deleted; when an artifact terminates, it moves out of the active directory. Active directories must stay clean so agents reliably find only live work.

## When to move

Move a file to `archive/` when it reaches one of the following terminal states:

| Artifact type | Terminal state(s) that trigger a move |
|---|---|
| `backlogs/` | `shipped` / `closed` / `addressed` / `dropped` |
| `design/` | `superseded` |
| `decisions/` | `superseded` |
| `plans/` | `superseded` |
| `references/` | `superseded` |
| `rules/` | `superseded` |
| `mistakes/` | `superseded` **only** — active mistakes NEVER move; the trap persists in `mistakes/` where agents load it and where `required-mistakes:` paths point. Only a mistake that is fully superseded by a newer entry moves to archive. |
| `learnings/` | `superseded` **only** — same rule as mistakes; active learnings stay live. |
| `features/` | `retired` |
| `sessions/` | closed + user opts in (session dirs are large; moving is opt-in) |

`reviews/` + `reports/` are append-only history — supersession via `status:` frontmatter, move only if the maintainer explicitly wants the active dir trimmed.

Active artifacts — any artifact not yet at a terminal state — **never** move.

## Location

- Project-level only: `.gobbi/projects/{project-name}/archive/`

The archive mirrors the project tree's structural categories as subdirectories holding the **full moved files** (not index stubs):

```
archive/
├── sessions/{YYYY-MM-DD}-{session-id}.md   ← full moved session file (opt-in)
├── backlogs/{YYYY-MM-DD}-{slug}.md         ← full moved backlog entry
├── design/{YYYY-MM-DD}-{slug}.md           ← full moved design doc
├── decisions/{YYYY-MM-DD}-{slug}.md        ← full moved decision doc
├── plans/{YYYY-MM-DD}-{slug}.md            ← full moved plan doc
├── references/{YYYY-MM-DD}-{slug}.md       ← full moved reference doc
├── rules/{YYYY-MM-DD}-{slug}.md            ← full moved rule doc
├── mistakes/{YYYY-MM-DD}-{slug}.md         ← full moved mistake (superseded only)
├── learnings/{YYYY-MM-DD}-{slug}.md        ← full moved learning (superseded only)
└── features/{YYYY-MM-DD}-{feature-name}.md ← full moved feature README (retired)
```

## Naming

Always date-prefixed: `{YYYY-MM-DD}-{slug}.md`. The date is **the archive date** (when the terminal state transition happened), not the original creation date.

## Move procedure

When an artifact reaches a terminal state, Wrap-up performs these steps:

1. **Stamp archival frontmatter** onto the file: add `archived_at: {YYYY-MM-DD}` and `archive_reason: shipped|superseded|retired|dropped|abandoned`, and ensure the existing terminal `status:` + (`superseded_by:` | `shipped_in:`) are present. The body is preserved verbatim — no content is altered.
2. **Move** the file: `git mv {active-path} .gobbi/projects/{project-name}/archive/{type}/{YYYY-MM-DD}-{slug}.md`. Using `git mv` preserves history. `{YYYY-MM-DD}` is the archive date (when the transition happened, not the file's creation date).
3. **Repoint inbound references**: any `[[slug]]` link, `required-mistakes:` path, `supersedes:`/`superseded_by:` pointer, or prose path that pointed at the old active path is updated to point at the new archive path. For mistakes: since only superseded mistakes move, active `required-mistakes:` citations are unaffected; a `superseded_by:` chain that crosses the move is repointed.
4. **Never delete** — the move preserves the file in `archive/`; it is never removed.

## Archival frontmatter additions

The moved file keeps its original body and its original frontmatter fields. Wrap-up stamps the following additional frontmatter fields onto the file before moving it:

```yaml
archived_at: YYYY-MM-DD
archive_reason: shipped | superseded | retired | dropped | abandoned
# The terminal status and cross-reference fields below should already be present
# on the original file; Wrap-up adds them here if they are missing:
status: shipped | superseded | retired | dropped | archived
superseded_by: {path in archive/ to the superseding artifact} | null
shipped_in: {changelog path} | null
```

`original_path` is not required as a persisted field — `git log --follow` recovers the full move history. Wrap-up MAY add an `original_path:` comment for human readability, but it is not mandatory.

The file retains its complete original body. The archive holds the full artifact, not a summary or stub.

## What NOT to move

- **Active `mistakes/`** — active mistakes stay in `mistakes/` forever; the trap must remain live where agents load it and where `required-mistakes:` paths point. Only **superseded** mistakes move to `archive/mistakes/`.
- **Active `learnings/`** — active learnings transcend any specific feature and must stay accessible to every session. Only **superseded** learnings move.
- **`reviews/` + `reports/`** — append-only history; supersession via `status:` frontmatter only. Move only if the maintainer explicitly wants the active dir trimmed.

## Recovery (reactivating an archived artifact)

Reactivating an archived artifact is **explicit and user-confirmed**:

1. `git mv archive/{type}/{YYYY-MM-DD}-{slug}.md {original-active-path}` — move the file back to its active directory.
2. Flip `status:` back to `active` / `accepted` / `open` (as appropriate).
3. Remove the `archived_at` and `archive_reason` frontmatter fields.
4. Repoint any references that were updated during archival back to the active path.

No deletion is involved at any step.

## Pruning

The archive is append-only by convention. Pruning archived files is a user decision, never automatic. Even pruning is no-delete by default; the user must explicitly direct any physical removal.
