# `archive/`

> Project-root holding area for terminal artifacts moved here in full — including superseded or retired designs, superseded, completed, or abandoned plans, retired checklists, closed backlogs, and superseded durable knowledge. Each file is the complete moved artifact, not a stub or pointer.

[`rules.md` §2.7](../rules.md#27-strict-archive-form) owns the terminal archive-body and link-scope
contract. This template applies that contract; it does not define a second archive policy.

## Core principles

> **Keep the archived record whole — the complete original file, marked with why and when it was retired.**

A reader auditing history finds the full artifact and the reason it is terminal, not a stub or an unexplained move.

## Write it

| Field | Value |
|---|---|
| Source identity | A Gobbi-owned session UUID plus the exact `state.json` `step`, `stage`, `iteration`, and `task` cursor attached to the typed staging source that authorizes the lifecycle change. |
| Written by | Wrap-up WORK, through the frozen promotion manifest. Archive moves are related lifecycle mutations of typed staging promotion; no direct archive-write path exists. |
| Location | Project-root only: `.gobbi/projects/{project-name}/archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md` — the archive preserves the source area under the typed subdir. A retired feature identity uses its preserved feature slug as the structural-exception area. |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date is the **archive date** (when the terminal transition happened), not the creation date |

The model is **no-delete + move-on-terminal**: when an artifact terminates, its full file is `git mv`'d out of the active dir into the sole project-root `archive/{type}/{area}/`. The move preserves original `type`, `scope`, and `feature`; there is no feature-local archive tier.

## When to move

Move a file when it reaches one of these terminal states:

| Artifact type | Terminal state(s) that trigger a move |
|---|---|
| `backlogs/` | `closed` |
| `design/` | `superseded` / `retired` |
| `decisions/` | `superseded` |
| `plans/` | `superseded` / `completed` / `abandoned` |
| `references/` | `superseded` |
| `rules/` | `superseded` |
| `mistakes/` | `superseded` **only** — active mistakes NEVER move; the trap persists in `mistakes/` where agents load it and where `required-mistakes:` paths point |
| `learnings/` | `superseded` **only** — same rule as mistakes; active learnings stay live |
| `checklists/` | `retired` |
| `features/` | `retired` |

`reviews/` + `reports/` are append-only history with the active-only lifecycle defined in
[`rules.md` §2.2](../rules.md#22-per-type-extension-fields--the-status-model), so they do not move.
Any type/status combination without an exact allowed archive pair below **never** moves; adding a new
archive route requires changing the lifecycle enum and compatibility matrix first.

The archive mirrors the source type and area under the project root and holds the **full moved files**.
For the `features` structural exception, the archived feature identity uses its feature slug as the area:

```
archive/
├── backlogs/{area}/{YYYY-MM-DD}-{slug}.md         ← full moved backlog entry
├── design/{area}/{YYYY-MM-DD}-{slug}.md           ← full moved design doc
├── decisions/{area}/{YYYY-MM-DD}-{slug}.md        ← full moved decision doc
├── plans/{area}/{YYYY-MM-DD}-{slug}.md            ← full moved plan doc
├── references/{area}/{YYYY-MM-DD}-{slug}.md       ← full moved reference doc
├── rules/{area}/{YYYY-MM-DD}-{slug}.md            ← full moved rule doc
├── mistakes/{area}/{YYYY-MM-DD}-{slug}.md         ← full moved mistake (superseded only)
├── learnings/{area}/{YYYY-MM-DD}-{slug}.md        ← full moved learning (superseded only)
├── checklists/{area}/{YYYY-MM-DD}-{slug}.md       ← full moved checklist (retired)
└── features/{feature-name}/{YYYY-MM-DD}-README.md ← full moved feature README (retired)
```

## Move procedure

When a typed staging source authorizes a terminal transition, Wrap-up WORK includes these steps in one frozen mutation set:

1. **Stamp archival frontmatter** — add `archived_at: {YYYY-MM-DD}` and one compatible
   `archive_reason: shipped|closed|completed|addressed|superseded|retired|dropped|abandoned`. Preserve
   the original scope and feature. Require a non-null successor only for `status: superseded`; do not
   invent one for retirement, completion, or abandonment. Freeze the active preimage and its body
   digest. Preserve every body byte verbatim, including historical outbound relative-link text.
2. **Move** — `git mv {active-path} .gobbi/projects/{project-name}/archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md`. `git mv` preserves history; `{area}` is the file's resolved area (preserved from its active path); `{YYYY-MM-DD}` is the archive date.
3. **Validate the rendered archive explicitly** — the Memory validator's no-argument mode remains
   live-only. Pass the exact new project-root archive path so strict mode checks filename date, path
   type, source area, archive-only fields, status/reason compatibility, and successor semantics.
4. **Repoint active inbound PATH references** — any `required-mistakes:` path, Markdown link target, or
   prose path in an active carrier that points at the old active path is updated to the archive path.
   `supersedes:`/`superseded_by:` slug-links and `[[slug]]` body links are **plain slugs** (§2.4) —
   rename-robust, so they do NOT need repointing on a move. For mistakes: since only superseded ones
   move, active `required-mistakes:` citations are unaffected.
5. **Apply the owner-defined link scope** — run the root Markdown-link validator over every changed
   active Markdown file, including each inbound carrier. Do not include the new archive body in
   relative-link resolution: its outbound link text is frozen and may intentionally stop resolving
   from the archive directory. This exclusion never applies to a live namespace move.
6. **Prove the actual terminal result** — compare the archived body byte-for-byte with the frozen body,
   verify path/status/reason/date/successor semantics, and inspect the actual tree and carrier changes
   against the frozen mutation set. Strict validation, body identity, active-carrier links, and tree
   reconciliation are separate required proofs.
7. **Never delete** — the move preserves the file in `archive/`; it is never removed.

## Archival frontmatter additions

The moved file keeps its original body and frontmatter — crucially its **ORIGINAL `type`** (`type: decisions`, `type: backlogs`, …). `archive` is **NOT a `type` value** ([`rules.md` § 2.3](../rules.md#23-the-complete-type-enum--16-first-class-types)): there is never a `type: archive` line. The typed subdir `archive/{type}/` marks the file archived, not the `type` field. There is likewise no `status: archived` value ([`rules.md` § 2.2](../rules.md#22-per-type-extension-fields--the-status-model)) — base `status` keeps the type's terminal value (`superseded` / `closed` / `retired`). Wrap-up WORK stamps the two archive-only fields and preserves or updates only type-valid lifecycle extensions:

```yaml
archived_at: YYYY-MM-DD
archive_reason: shipped | closed | completed | addressed | superseded | retired | dropped | abandoned
# The terminal status and cross-reference fields below should already be present
# on the original file; Wrap-up WORK adds them here if they are missing.
# `status` keeps the type's own terminal enum value — there is NO `status: archived`:
status: closed | superseded | retired | completed | abandoned
superseded_by: {superseding-artifact-slug} | null   # optional global field; non-null only with status: superseded
shipped_in: {changelog path} | null                 # backlogs extension only; omit from every other type
```

The allowed status/reason pairs are exact:

| Status owner | Compatible archive reason |
|---|---|
| Any valid `status: superseded` | `superseded` |
| `design: retired` | `retired` |
| `plans: completed` | `completed` |
| `plans: abandoned` | `abandoned` |
| `checklists: retired` | `addressed` / `dropped` / `retired` |
| `backlogs: closed` | `shipped` / `closed` / `addressed` / `dropped` |
| `features: retired` | `retired` |

No compatibility status or migration reader broadens this matrix. A non-null `superseded_by` is
required for `superseded` and invalid for every other status.

`type:` is **not** in the block above on purpose — it is never rewritten on a move. `original_path` is not a required field — `git log --follow` recovers the move history; Wrap-up WORK may add an `original_path:` comment for readability. The file retains its complete original body — including outbound relative-link text that may no longer resolve from the archive directory — and the archive holds the full artifact, not a summary or stub.

## What NOT to move

- **Active `mistakes/`** — active mistakes stay in `mistakes/` forever; the trap must remain live where agents load it and where `required-mistakes:` paths point. Only **superseded** mistakes move.
- **Active `learnings/`** — active learnings transcend any feature and must stay accessible to every session. Only **superseded** learnings move.
- **`reviews/` + `reports/`** — append-only, active-only history. They have no terminal status or
  compatible archive pair and therefore do not move.

## Recovery

Reactivating an archived artifact is **explicit and user-confirmed**:

1. `git mv archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md {original-active-path}` — move it back from the project-root archive.
2. Flip `status:` back to `active` / `accepted` / `open` (as appropriate).
3. Remove the `archived_at` and `archive_reason` fields.
4. Repoint any references updated during archival back to the active path.

No deletion at any step.

## Notes

- **Append-only by convention.** Pruning archived files is a user decision, never automatic — no-delete by default; the user must explicitly direct any physical removal.
