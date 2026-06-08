# `backlogs/`

Deferred work — features (project-level) or tasks (feature-level) that came out of decomposition but were not picked up for the current workflow. A future session can pick up a backlog entry, frame it as that session's problem, and run a fresh Ideation Loop on it.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/backlogs/{feature,project}/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Ideation Step 2 Lock Scope** decomposition, every non-chosen candidate writes a backlog entry.
- During any loop's MEMORIZATION when an evaluator finding has `disposition: deferred` — the finding stages at `staging/decisions/{slug}.md` with `disposition: deferred` frontmatter; Wrap-up reads that flag and promotes the deferred decision into a backlog entry stamped from this template at `features/{feature-name}/backlogs/{slug}.md` or `.gobbi/projects/{project-name}/backlogs/{slug}.md` per the deferred finding's scope.
- During any loop's MEMORIZATION when scope-violating work surfaces and is deferred rather than absorbed.

## Location

Two distinct levels, by what is being deferred:

- **Feature-level** — `.gobbi/projects/{project-name}/features/{feature}/backlogs/{slug}.md` — deferred **tasks** within a feature
- **Project-level** — `.gobbi/projects/{project-name}/backlogs/{slug}.md` — deferred **features** themselves

A task always lives under a feature; a feature itself can also be deferred.

## File naming

`{slug}.md` — bare-slug, short, hyphenated, descriptive, ≤6 words. No date prefix (backlogs are evergreen-until-closed; the date lives in frontmatter); no `item-N-M-` positional prefix. See [`rules.md` § 1](../rules.md).

Example (task-level): `login-database-schema.md`, `password-reset-flow.md`.
Example (feature-level): `search-system.md`, `admin-dashboard.md`.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the backlogs-type extensions (`priority`, `disposition`, `project-scope`, `shipped_in`). `scope` distinguishes a deferred **task** (`scope: feature`) from a deferred **feature** (`scope: project`); `disposition` is the documented per-type refinement of base `status` ([`rules.md` § 2.2](../rules.md)).

```markdown
---
name: {slug — task or feature title}
description: {one-line what is deferred}
type: backlogs
scope: project | feature
feature: {feature-name} | null   # null when this is a deferred feature itself
status: active | closed
created: YYYY-MM-DD
session: {session-id where this was decomposed}
tags: [{tag1}, {tag2}]
priority: critical | high | medium | low
disposition: open | deferred
project-scope: true | false
shipped_in: {changelog / PR / commit on close} | null
---

# {Title}

## Context
{How this item fits the larger framed problem. Brief — one or two paragraphs.}

## Why deferred
{The reason this was not chosen for the originating workflow. Often: out of scope for one workflow's size, lower priority, depends on something not yet shipped.}

## When to pick up
{Prerequisites — explicit conditions that must hold before this is workable. Examples: "after Login UI is shipped", "needs schema migration approved first", or "no prerequisites — can run any time".}

## Suggested approach
{Optional — a one-paragraph sketch of how this might be tackled, drawing on the originating session's research. Helps the future session start faster.}

## Originating session
{Path to the session that produced this backlog: `.gobbi/projects/{project-name}/sessions/{anchor_session}/`}
```

## Lifecycle

- **Created** at Lock Scope decomposition (Ideation Step 2)
- **Picked up** when a future session chooses this item as its workflow scope: the future session's manager reads this file and sets it as the session's `task` (or `feature`) in `session.json`
- **Closed** when the work is shipped: the backlog file moves to `archive/backlogs/{date}-{slug}.md` (see [`archive.md`](archive.md)) and the corresponding changelog records the completion

## Avoid bloat

A backlog file that has not been picked up in months and has no clear "when to pick up" trigger is dead weight. During wrap-up, the assistant flags stale backlogs to the user for explicit decision: keep, archive (move to `archive/backlogs/`), or drop (move to `archive/backlogs/` with `archive_reason: dropped`). Deletion is never an option — no-delete is a hard invariant.
