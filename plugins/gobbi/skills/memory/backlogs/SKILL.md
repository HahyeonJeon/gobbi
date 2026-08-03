---
name: backlogs
description: MUST load after the memory operation identifies content as backlog memory. Backlogs is a preference skill for grouping durable deferred outcomes by feature and preserving why they were backlogged.
allowed-tools: Read, Grep, Glob
skill-type: preference
user-invocable: false
---

# Backlog Memory

This internal category skill guides backlog-memory judgment after the parent memory operation identifies
content as deferred work. It owns the content and structure of `memory/backlogs/`. The parent memory skill
owns when and how backlog items are read, created, updated, moved, or deleted.

Backlog memory preserves lightweight evidence for work that remains deferred. It groups several items in one
flat document for each feature. Planning, readiness, priority, ownership, approach, and acceptance are
discussed with the user when an item is picked up.

## Principles

### Preserve the deferral, not the future plan

A backlog item should retain the outcome, the reason it was deferred, and the context that made it worth
remembering. Detailed planning before pickup turns backlog memory into a stale work-management system.

### Group work by its stable feature owner

A future reader is most likely to look for deferred work beside the feature it affects. Genuinely
cross-feature work needs one project-wide home rather than copies in several feature documents.

### Keep backlog memory only while work is deferred

An item leaves the backlog after active work durably accepts it. Completed, obsolete, and unsupported items
should not remain as closed records because Git retains their prior state.

### Keep navigation neutral

The backlog index should reveal every deferred item without implying priority, readiness, sequence, or
commitment through its order.

## Rules

- **MUST keep each backlog item about one independently discussable deferred outcome.** Give it a unique
  second-level heading in one canonical feature or project document. Do not copy the item across documents.
- **MUST give every backlog item the four labels `Backlogged at`, `What`, `Why backlogged`, and `Context`.**
  State the deferred outcome, why it was not included when identified, and the current evidence needed to
  understand it.
- **MUST keep `Backlogged at` as an immutable ISO 8601 Coordinated Universal Time timestamp.** Record when the
  outcome first entered durable backlog memory, using a value such as `2026-07-30T14:25:00Z`. Preserve it
  through context changes, moves, and re-deferral of the same outcome; create a new timestamp when the outcome
  changes materially.
- **MUST remove a picked-up item only after an active session or task durably accepts its outcome.**
  Discussion or consideration alone is not pickup. When active work accepts only part, revise the item to the
  independently deferred remainder. Delete an empty feature document and its index group in the same change.
- **MUST prune backlog memory when an item is completed, obsolete, contradicted, duplicated, or no longer
  useful.** Use Git for prior versions. Do not create closed records, archives, tombstones, or lifecycle
  histories.
- **MUST NOT require readiness, priority, owner, next action, approach, acceptance criteria, estimate,
  lifecycle status, frontmatter, or another metadata schema.** Resolve planning with the user during pickup,
  not in the backlog record.

## Preferences

### Structure

Prefer one flat document per stable feature. Use `project.md` only when no single feature owns the deferred
outcome.

```text
backlogs/
├── README.md
├── project.md
├── login.md
├── search.md
└── {feature}.md
```

Prefer a feature name that matches the applicable `design/feature/` subject when one exists. Use a stable,
descriptive feature name.

### Path descriptions

| Path | Description | Example |
|---|---|---|
| `backlogs/README.md` | Provides a recursive index that links every deferred item heading, groups links by project or feature, and orders groups and items alphabetically without implying priority. | |
| `backlogs/project.md` | Contains project-wide or genuinely cross-feature deferred outcomes. | A deferred repository-wide localization outcome |
| `backlogs/{feature}.md` | Contains several independently discussable deferred outcomes owned by one stable feature. | `backlogs/login.md` for deferred login outcomes |

Do not add readiness, status, priority, domain, active, completed, closed, or archive directories.

### Naming convention

```text
backlogs/{feature}.md
backlogs/project.md
```

```text
backlogs/login.md
backlogs/payment.md
backlogs/project.md
```

Use stable, descriptive kebab-case feature names without date prefixes. Rename the file and repair inbound
links when the feature's canonical name changes.

### Item shape

Prefer compact labels beneath a descriptive second-level heading. Keep supporting links, known constraints,
and existing dependencies inside `Context` instead of adding pickup-planning fields.

```markdown
## Passwordless login

**Backlogged at:** 2026-07-30T14:25:00Z

**What:** Add a passwordless sign-in path.

**Why backlogged:** The current login redesign is limited to password authentication.

**Context:** The login design defines the current authentication boundary but does not cover passwordless flows.
```

### Index

Prefer direct links to item headings rather than links only to their containing files. Keep the index
navigational: do not repeat item bodies, add summaries, or use ordering to rank the work.

```markdown
## Login

- `Passwordless login` → `login.md#passwordless-login`
```

### Behavior

- Remove an item as soon as its exact outcome has one durable active owner.
- If active work is deferred again, restore the item with current `What`, `Why backlogged`, and `Context`.
- Preserve the original timestamp when the same outcome is deferred again.
- Treat a materially different outcome as a new item.

## References
