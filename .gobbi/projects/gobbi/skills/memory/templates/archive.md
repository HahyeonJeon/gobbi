# `archive/`

> Holding area for terminal artifacts moved here in full — shipped backlogs, superseded designs, retired features, superseded mistakes. Each file is the complete moved artifact (frontmatter + body intact), not a stub or pointer.

## Core principles

> **Keep the archived record whole — the complete original file, marked with why and when it was retired.**

A reader auditing history finds the full artifact and the reason it is terminal, not a stub or an unexplained move.

## Write it

| Field | Value |
|---|---|
| Written by | Wrap-up RECORD (direct write — no staging; loop RECORD never writes here) |
| Location | Project-level only: `.gobbi/projects/{project-name}/archive/{type}/{YYYY-MM-DD}-{slug}.md` |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date is the **archive date** (when the terminal transition happened), not the creation date |

The model is **no-delete + move-on-terminal**: when an artifact terminates, its full file is `git mv`'d out of the active dir into `archive/{type}/`. The move IS the archival.

## When to move

Move a file when it reaches one of these terminal states:

| Artifact type | Terminal state(s) that trigger a move |
|---|---|
| `backlogs/` | `shipped` / `closed` / `addressed` / `dropped` |
| `design/` | `superseded` |
| `decisions/` | `superseded` |
| `plans/` | `superseded` |
| `references/` | `superseded` |
| `rules/` | `superseded` |
| `mistakes/` | `superseded` **only** — active mistakes NEVER move; the trap persists in `mistakes/` where agents load it and where `required-mistakes:` paths point |
| `learnings/` | `superseded` **only** — same rule as mistakes; active learnings stay live |
| `features/` | `retired` |
| `sessions/` | closed + user opts in (session dirs are large; moving is opt-in) |

`reviews/` + `reports/` are append-only history — supersede via `status:`, move only if the maintainer wants the active dir trimmed. Any artifact not yet terminal **never** moves.

The archive mirrors the project tree's categories as subdirs holding the **full moved files** (not index stubs):

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

## Move procedure

When an artifact reaches a terminal state, Wrap-up runs these steps:

1. **Stamp archival frontmatter** — add `archived_at: {YYYY-MM-DD}` and `archive_reason: shipped|closed|addressed|superseded|retired|dropped|abandoned`, and ensure the terminal `status:` + (`superseded_by:` | `shipped_in:`) are present. The body is preserved verbatim.
2. **Move** — `git mv {active-path} .gobbi/projects/{project-name}/archive/{type}/{YYYY-MM-DD}-{slug}.md`. `git mv` preserves history; `{YYYY-MM-DD}` is the archive date.
3. **Repoint inbound PATH references** — any `required-mistakes:` path or prose path pointing at the old active path is updated to the archive path. `supersedes:`/`superseded_by:` slug-links and `[[slug]]` body links are **plain slugs** (§2.4) — rename-robust, so they do NOT need repointing on a move. For mistakes: since only superseded ones move, active `required-mistakes:` citations are unaffected.
4. **Never delete** — the move preserves the file in `archive/`; it is never removed.

## Archival frontmatter additions

The moved file keeps its original body and frontmatter — crucially its **ORIGINAL `type`** (`type: decisions`, `type: backlogs`, …). `archive` is **NOT a `type` value** ([`rules.md` § 2.3](../rules.md#23-the-complete-type-enum--16-first-class-types)): there is never a `type: archive` line. The typed subdir `archive/{type}/` marks the file archived, not the `type` field. There is likewise no `status: archived` value ([`rules.md` § 2.2](../rules.md#22-per-type-extension-fields--the-status-model)) — base `status` keeps the type's terminal value (`superseded` / `closed` / `retired`). Wrap-up stamps only these additional fields before moving:

```yaml
archived_at: YYYY-MM-DD
archive_reason: shipped | closed | addressed | superseded | retired | dropped | abandoned
# The terminal status and cross-reference fields below should already be present
# on the original file; Wrap-up adds them here if they are missing.
# `status` keeps the type's own terminal enum value — there is NO `status: archived`:
status: closed | superseded | retired
superseded_by: {superseding-artifact-slug} | null   # plain slug, never a path (§2.4)
shipped_in: {changelog path} | null
```

`type:` is **not** in the block above on purpose — it is never rewritten on a move. `original_path` is not a required field — `git log --follow` recovers the move history; Wrap-up MAY add an `original_path:` comment for readability. The file retains its complete original body — the archive holds the full artifact, not a summary or stub.

## What NOT to move

- **Active `mistakes/`** — active mistakes stay in `mistakes/` forever; the trap must remain live where agents load it and where `required-mistakes:` paths point. Only **superseded** mistakes move.
- **Active `learnings/`** — active learnings transcend any feature and must stay accessible to every session. Only **superseded** learnings move.
- **`reviews/` + `reports/`** — append-only history; supersede via `status:`. Move only if the maintainer wants the active dir trimmed.

## Recovery

Reactivating an archived artifact is **explicit and user-confirmed**:

1. `git mv archive/{type}/{YYYY-MM-DD}-{slug}.md {original-active-path}` — move it back.
2. Flip `status:` back to `active` / `accepted` / `open` (as appropriate).
3. Remove the `archived_at` and `archive_reason` fields.
4. Repoint any references updated during archival back to the active path.

No deletion at any step.

## Notes

- **Append-only by convention.** Pruning archived files is a user decision, never automatic — no-delete by default; the user must explicitly direct any physical removal.
