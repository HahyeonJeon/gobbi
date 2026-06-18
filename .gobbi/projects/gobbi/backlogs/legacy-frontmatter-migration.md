---
name: legacy-frontmatter-migration
description: Migrate the legacy memory tree to conform to the new §2 frontmatter standard — the validator's documented expected-RED.
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-18
session: 8129f657-4591-48b3-b83c-3aa9bc759ca6
tags: [memory, frontmatter, schema, refactor, rename-sweep]
keywords: [legacy-data, migration, tags-split, status-enum, stray-keys, type-fix, slug-shape]
priority: medium
project-scope: true
shipped_in: null
---

# Legacy Frontmatter Migration

## Context

The memory frontmatter redesign (Task 04, commit `efbaaabc`) established a new §2
standard with a bash validator at `skills/memory/scripts/validate-frontmatter.sh`.
Running the validator against the live memory tree surfaces a large legacy-data
violation set — all pre-existing files that predate the standard. The validator's
expected-RED on legacy data is documented and does NOT block the new standard.

The violations fall into 6 categories:

1. **tags → controlled + keywords split** (largest category): legacy files use
   freeform tags not in the §2.5 controlled vocabulary. Each file needs its tags
   audited — controlled-vocab tags stay in `tags`, everything else moves to
   `keywords`.
2. **Legacy `status` values → unified per-type enums**: files carry `status:
   archived`, `status: proposed`, `status: disposed`, or other non-§2.2 values.
   Each type now has a specific status enum; every file needs its `status` checked
   against its type's allowed set.
3. **Stray keys** (`decision_status`, `disposition` outside `backlogs/`, `loop`,
   `iter`, etc.): staging-routing fields and removed lifecycle fields that survived
   promotion in prior sessions. These must be removed; their meaning is carried by
   base `session` + `created` or folds into `status`.
4. **Mistyped `mistakes/*.md` files**: some carry `type: decisions` instead of
   `type: mistakes` and are missing the required `priority` and `domain` extensions.
   Fix: change `type` to `mistakes` and add `priority` + `domain` from the body.
5. **Slug-shape violations**: some `features/workflow/design/` files carry
   path-style or block-style `related:` values (`../../mistakes/...`, `[[slug]]`
   inside YAML) instead of plain slugs. Fix: replace all `related:` values with
   plain slugs per §2.4.
6. **Feature README `name` field**: the live `features/workflow/README.md` may carry
   `name: workflow` instead of `name: README`. Fix: change to `name: README`.

## Why deferred

The migration touches durable memory data across many files. It is a normalization
sweep, not a design task — it has no blocking dependency on the current session's
work. The user confirmed this scope was out of bounds for the current session. The
new validator makes the migration deterministic: run it, get the exact violation
list, fix file by file.

## When to pick up

No hard prerequisites. The migration can run any time after Task 04 merges. It
should run before the memory tree grows heavily (before many new files land into the
legacy tree), so the violation count stays manageable.

## Suggested approach

1. Run `skills/memory/scripts/validate-frontmatter.sh` from the worktree root to get
   the current violation list.
2. Group violations by category (stray keys, type-fix, status-enum, tags-split,
   slug-shape, README name).
3. Fix by category — stray-key removal is mechanical and safe; type-fix requires care
   (change `type: decisions` → `type: mistakes`, add `priority` / `domain` from the
   body); tags-split requires reading each file's tags against §2.5.
4. Re-run the validator after each category sweep to confirm the count reaches zero.
5. Commit with a clear message citing the category + violation count.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-14-8129f657-4591-48b3-b83c-3aa9bc759ca6/`
