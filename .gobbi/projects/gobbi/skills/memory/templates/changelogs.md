# `changelogs/`

> Time-stamped records of what shipped. Each entry summarizes the outcome of an Execution Loop's task, so a future reader can find when a specific capability landed.

## Core principles

> **Record one shipped task per entry — what concretely changed and the verification result that proved it, not a vague roll-up.**

A changelog a reader cannot trace to a concrete artifact and an actual verification result is a press release, not a history.

## Write it

| Field | Value |
|---|---|
| When | Execution RECORD at the end of each task; and Wrap-up RECORD appends a feature-level entry to each value-feature the session touched. |
| Stage to | `sessions/{date}-{session-id}/{N}-{loop}/staging/changelogs/{slug}.md` |
| Promotes to | `features/{f}/changelogs/` — feature-subdir-only; there is NO project-level `changelogs/` (design §2.14; [rules §3](../rules.md)) |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date-prefixed (time-indexed); slug describes the shipped unit (`2026-05-11-login-ui-shipped.md`) |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter + changelogs extension (`shipped_in`); `scope: feature` always (feature-subdir-only). `tags` come from the controlled vocabulary ([rules §2.5](../rules.md#25-controlled-tags-vocabulary)).

```markdown
---
name: {slug — what shipped}
description: {one-line what this task delivered}
type: changelogs
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [execution, docs-sync]         # controlled vocabulary (§2.5)
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
- **A session-wide roll-up is NOT a changelog.** It is the per-session development-journal entry Wrap-up writes to `notes/{date}-{slug}.md` (see [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)).
