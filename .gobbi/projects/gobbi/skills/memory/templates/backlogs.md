# `backlogs/`

> Deferred work — features (project-level) or tasks (feature-level) that came out of decomposition but were not picked up. A future session can pick up an entry, frame it as its own problem, and run a fresh Ideation step on it.

## Core principles

> **Write a deferred item so a future session can resume it cold — its framing, its pick-up trigger, and its dependencies stand without the originating session.**

An item a future reader cannot resume without re-deriving why it was deferred is a lost item, not a deferred one.

## Write it

| Field | Value |
|---|---|
| When | A productive step's RECORD when an approved deferred item is durable. |
| Source cursor | Gobbi-owned session UUID plus the current `state.json` `step`, `stage: RECORD`, `iteration`, and `task`; `task` is `null` outside Execution. |
| Stage to | `sessions/{date}-{gobbi-session-id}/{N}-{step}/staging/backlogs/{feature,project}/{slug}.md` |
| Promotes to | `features/{f}/backlogs/{area}/` (deferred task) · `backlogs/{area}/` (project, deferred feature) — `{area}` from this type's area list, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | `{slug}.md` — bare-slug, ≤6 words, no date prefix (evergreen-until-closed); no positional prefix (`password-reset-flow.md`, `search-system.md`) |

RECORD writes only the typed staging source. Wrap-up WORK is the only stage that promotes it to durable memory ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter + backlogs extensions (`priority`, `project-scope`, `shipped_in`). One unified `status` carries the lifecycle (`open` | `deferred` | `closed`); the old `disposition` is removed, folded into `status` ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)). `scope` distinguishes a deferred task (`scope: feature`) from a deferred feature (`scope: project`).

```markdown
---
name: {slug — task or feature title}
description: {one-line what is deferred}
type: backlogs
scope: project | feature
feature: {feature-name} | null   # null when this is a deferred feature itself
status: open | deferred | closed
created: YYYY-MM-DD
session: {Gobbi-owned UUID of the session where this was decomposed}
tags: [planning, process]            # this type's controlled pool (§2.5)
keywords: [search-system]            # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
priority: critical | high | medium | low
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

## Related
{Navigable `[[slug]]` links to the design / decision / plan documents this deferred item depends on ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[search-index-design]] — the design this deferred feature builds on
```

## Notes

- **Lifecycle:** **created** at Lock Scope decomposition; **picked up** when a future session sets it as that session's `task`/`feature` in `session.json`; **closed** when the work ships — the file moves to `archive/backlogs/{area}/{date}-{slug}.md` ([`archive.md`](archive.md)) and a changelog records the completion.
- **Review stale entries during Wrap-up DISCUSSION.** A backlog not picked up in months with no clear "when to pick up" trigger is dead weight; ask the user to keep, archive, or drop it. An authorized terminal move is applied only in Wrap-up WORK's frozen manifest. Deletion is never an option.
