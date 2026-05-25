# `changelogs/`

Time-stamped records of **what shipped**. Each entry summarizes the outcome of an Execution Loop's task or, at session level, the outcome of a whole session.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/changelogs/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Execution** MEMORIZATION at the end of each task: write a feature-level changelog entry describing what shipped for that task.
- During **Wrap-up** MEMORIZATION at session close: write a project-level (or feature-level) session summary referencing all the per-task changelogs.

## Location

- Project-level: `.gobbi/projects/{project-name}/changelogs/` — session-level summaries
- Feature-level: `.gobbi/projects/{project-name}/features/{feature}/changelogs/` — per-task entries

## File naming

`{YYYY-MM-DD}-{slug}.md` — date-prefixed (changelogs are time-indexed); slug describes the shipped unit. See [`rules.md` § 1](../rules.md). `changelogs/` is a **feature-subdir-only** type ([`rules.md` § 3](../rules.md), [`memory-map.md`](../memory-map.md)).

Example (feature-level, per-task): `2026-05-11-login-ui-shipped.md`.
Example (project-level, per-session): `2026-05-11-session-summary.md`.

## Item template — feature-level (per-task)

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the changelogs extension (`shipped_in`); `scope: feature` always (feature-subdir-only).

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
tags: [{tag1}, {tag2}]
shipped_in: {PR / commit / plan path}
task: {task name}
---

# {Task title — what shipped}

## Summary
{One paragraph: what this task delivered, why it matters.}

## What changed
{Bulleted list of concrete artifacts: files modified, capabilities added, behavior changed.}

## Verification
{How the work was verified — tests run, manual checks, metrics observed. Include actual results, not just intent.}

## Deferred
{Items that were in the plan but did not ship this iteration, and where they went (backlog entry slug, next workflow note, etc).}

## Related
{Links to design, plan, decisions, mistakes, evaluator findings that informed this work.}
```

## Item template — project-level (per-session)

A per-session roll-up may be authored at the project root for the session as a whole. It carries the same base frontmatter with `scope: project` and `feature: null`.

```markdown
---
name: {slug — session summary}
description: {one-line what the session delivered}
type: changelogs
scope: project
feature: null
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [{tag1}, {tag2}]
shipped_in: {PR / commit}
---

# Session {session-id-or-task-title}

## Summary
{One paragraph: what the session as a whole delivered.}

## Tasks shipped
{Bulleted list of feature-level changelog entries this session produced.}

## Decisions made
{Bulleted list of decision-record paths this session produced.}

## Mistakes added
{Bulleted list of mistake paths added this session.}

## Open items
{Items deferred or still in flight at session end. Where they went (backlog / next session / TODO list).}

## Handoff
{Pointer to wrap-up doc and the next session's anticipated focus.}
```

## Granularity

One changelog per task at feature level. One changelog per session at project level. Do not combine multiple tasks into one feature-level entry — granularity matters for future readers searching for when a specific capability shipped.
