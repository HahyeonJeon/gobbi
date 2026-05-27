---
loop: execution
iter: 1
artifact_type: task-notes
created_at: 2026-05-26
status: draft
---

# T6 — Conform install-runtime discussions/design/decisions/changelogs (draft-iter1)

## Scope

24 docs in 4 subdirs of `features/install-runtime/`:
- discussions/ (8 files)
- design/ (6 files)
- decisions/ (6 files)
- changelogs/ (4 files)

## Plan

### Three operations per file

1. Add/normalize 9 base frontmatter keys: `name`, `description`, `type`, `scope`, `feature`, `status`, `created`, `session`, `tags`
2. Strip S-set staging keys (both hyphen and underscore): `promoted_from`/`promoted-from`, `promoted_at`/`promoted-at`, `finding_id`/`finding-id`, `mistake_candidate`/`mistake-candidate`, `confidence`, `severity`, `surfaced_by`/`surfaced-by`, `addressed_by`/`addressed-by`. Also `disposition` when NOT in `backlogs/`.
3. De-crypt load-bearing inline session coords: `CP-D-1`, `CP-4.1-α/β/γ`, `T3-I-T3.X`, `rawdata/draft-iter3.md:NNN` (except in legitimate ## Source footers)

### Key mappings

For files using `date:` as created: `created = date value`.
For files using `session:` already: keep; for files with `session-id:`: normalize to `session:`.
For `discussion-id:`, `slug:`, `phase:`, `sub-step:`, `loop-iter:`, `loop:`, `topic:`, `outcome:`, `design-id:`, `iter:`, `task:`, `plan:`, `verdict:`, `supersedes:`, `superseded_by:` — these are NOT S-set, KEEP them.

### Files with S-keys to strip

- discussions/env-var-audit-scope-discussion.md: `promoted_from`, `promoted_at`
- decisions/env-file-load-semantics-decisions.md: `promoted_from`, `promoted_at`
- decisions/pre-planning-readiness-decisions.md: `promoted_from`, `promoted_at`
- decisions/session-start-hook-script-decisions.md: `promoted_from`, `promoted_at`
- decisions/task-decomposition-decisions.md: `promoted_from`, `promoted_at`
- changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md: `promoted-from`, `promoted-at`

### Inline coord de-crypt decisions

Design files: `rawdata/draft-iter3.md:NNN` is in legitimate `## Source` footer — preserve as-is.
Design files: `T3-I-T3.X` checklist anchors → replace with descriptive text.
Design files: `D-3-X` cross-refs in body → replace with descriptive label.
Design files: `T3-DQ-X`, `T3-E-X`, `T3-I-X` insight anchors → replace with descriptive.
Discussion files: `CP-D-1:`, `CP-4.1-α:`, `CP-4.1-β:`, `CP-4.1-γ:` in question headings → replace with question text.

## Out-of-scope observations

- `decisions/pre-planning-readiness-decisions.md` uses `type: decisions-log` — not in the 12-value enum; body content is a decisions-log. Will normalize `type: decisions` per §2.1 (the doc is in `decisions/`).
- `decisions/session-start-hook-script-decisions.md` same issue: `type: decisions-log` → `type: decisions`.
- `decisions/task-decomposition-decisions.md` same: `type: decisions-log` → `type: decisions`.
- Several files use `session:` with a date-prefixed value like `2026-05-22-bac669ad-...` while others use just the UUID. Will preserve whatever form is present and add `session:` from existing data.
- Non-S non-base keys preserved: `loop`, `topic`, `outcome`, `discussion-id`, `slug`, `phase`, `sub-step`, `loop-iter`, `design-id`, `iter`, `task`, `plan`, `verdict`, `supersedes`, `superseded_by`, `decision_status`, `session-id`, `phase` (on decisions).
- The `loop:` key is not a base key and not an S-set key — leaving it in place.
- The `verdict:` key on decisions files is not S-set, leaving it.
