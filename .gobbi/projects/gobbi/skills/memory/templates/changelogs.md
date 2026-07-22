# `changelogs/`

> Time-stamped records of what shipped. Each entry summarizes the outcome of an Execution task, so a future reader can find when a specific capability landed.

## Core principles

> **Record one shipped task per entry — what concretely changed and the verification result that proved it, not a vague roll-up.**

A changelog a reader cannot trace to a concrete artifact and an actual verification result is a press release, not a history.

## Write it

| Field | Value |
|---|---|
| When | Execution RECORD after an accepted task produces a durable shipped result. |
| Source cursor | Gobbi-owned session UUID plus `step: execution`, `stage: RECORD`, the current `iteration`, and the exact `task` identity. |
| Stage to | `sessions/{date}-{gobbi-session-id}/3-execution/task-{NN}-{slug}/staging/changelogs/{slug}.md` or the authorized Execution step staging root |
| Promotes to | `features/{f}/changelogs/{area}/` — feature-subdir-only; there is NO project-level `changelogs/` (design §2.14; [rules §3](../rules.md)) — `{area}` from this type's area list, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date-prefixed (time-indexed); slug describes the shipped unit (`2026-05-11-login-ui-shipped.md`) |

RECORD writes only the typed staging source. Wrap-up WORK is the only stage that promotes it to durable memory ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter + changelogs extension (`shipped_in`); `scope: feature` always (feature-subdir-only). `tags` come from this type's controlled pool ([rules §2.5](../rules.md#25-controlled-tags-vocabulary)).

```markdown
---
name: {slug — what shipped}
description: {one-line what this task delivered}
type: changelogs
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {Gobbi-owned session UUID}
tags: [execution, docs-sync]         # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
shipped_in: {PR / commit / plan path}
---

# {Task title — what shipped}

**Task:** {task name — which plan task this changelog records}

## Summary
{One paragraph: what this task delivered, why it matters.}

## What changed
{Bulleted list of concrete artifacts: files modified, capabilities added, behavior changed.}

## Verification
{How the work was verified — tests run, manual checks, metrics observed. Include actual results, not just intent.}

## Deferred
{Items that were in the plan but did not ship this iteration, and where they went (backlog entry slug, next workflow note, etc).}

## Related
{Navigable `[[slug]]` links to the design, plan, decisions, or mistakes that informed this work ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[cache-invalidation]] — the design this work implements
```

## Notes

- **One changelog per task at feature level.** Do not combine multiple tasks into one entry — granularity lets a future reader find when a specific capability shipped.
- **A session-wide roll-up is NOT a changelog.** It is the evaluated handoff defined by [`notes.md`](notes.md): one typed staging source that Wrap-up WORK promotes to `notes/{area}/{date}-{slug}.md`.
