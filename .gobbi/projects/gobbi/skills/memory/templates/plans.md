# `plans/`

> Task-decomposition records — the output of the Planning Loop. Each plan breaks a locked task into narrow, ordered sub-tasks the Execution Loop can run one at a time.

## Core principles

> **Write each sub-task so one executor runs it from the doc alone — scope, dependency, and a re-runnable verification per row.**

A sub-task whose scope or check the executor must reconstruct from the planning discussion is not yet a plan entry.

## Write it

| Field | Value |
|---|---|
| When | Planning RECORD when the loop produces a canonical plan. `plans/` is **Planning-loop-only** — ideation / preparation / execution / wrap-up do not produce plans. A mid-execution refinement creates a new versioned plan, never an in-place edit. |
| Stage to | `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` |
| Promotes to | `features/{f}/plans/` (loop path — feature-only). Project-level `plans/` holds maintainer cross-feature roadmaps ONLY; no loop RECORD or Wrap-up promotion targets it. |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date-prefixed (tied to the session that produced it); slug describes the plan in ≤6 words (`2026-05-11-auth-middleware.md`) |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter plus the plans extensions (`task`, `task_count`). `supersedes` / `superseded_by` are **global plain-slug base fields** (§2.1), not plans extensions — a plain slug, no path, no `[[ ]]` ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)).

```markdown
---
name: {slug — short plan title}
description: {one-line what this plan decomposes}
type: plans
scope: feature
feature: {feature-name}
status: active | superseded
created: YYYY-MM-DD
session: {session-id}
tags: [planning, execution]          # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
task: {task name from Scope Contract}
supersedes: {prior-plan-slug} | null         # plain slug, not a path
superseded_by: {new-plan-slug} | null          # plain slug, not a path
task_count: {number of sub-tasks in this plan}
---

# {Plan title}

## Idea anchor
{Link to the `features/{feature-name}/design/{slug}.md` document this plan implements.}

## Scope Contract reference
{Link to the locked Scope Contract (typically in the Ideation canonical artifact).}

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 1 | {Narrow, unambiguous sub-task} | — | {test / manual / metric / demo} | executor |
| 2 | {...} | #1 | ... | executor |
| ... | ... | ... | ... | ... |

## Dependency graph
{Brief textual or ASCII description of dependencies if the table is hard to read.}

## Verification strategy summary
{How the plan as a whole will be verified — the gate that decides when the task is complete.}

## Open issues
{`design_flaw` / `assumption_risk` findings from Planning's EVALUATION that did not block the plan.}

## Related
{Navigable `[[slug]]` links to the design this plan implements and the decisions it follows ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[cache-invalidation]] — the design this plan decomposes
```

## Notes

- **Update by supersede, never edit in place.** When execution surfaces a plan change (a sub-task was harder, an ordering flipped), write a new `{new-date}-{slug}.md` with `supersedes: {old-slug}`. The version lives in frontmatter, never the slug (no `-v2`; [`rules.md` § 1.3](../rules.md) anti-pattern #6). The superseded plan is moved (`git mv`) to `archive/plans/{date}-{slug}.md` at Wrap-up, never deleted.
- **Sub-task granularity.** Each sub-task must be narrow enough that scope is unambiguous to one executor. If a description starts with "and then" or "while doing this also", split it.
