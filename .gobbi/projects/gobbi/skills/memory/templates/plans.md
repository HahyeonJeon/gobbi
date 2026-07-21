# `plans/`

> Task-decomposition records — the output of the Planning step. Each plan breaks a locked task into narrow, ordered tasks the Execution step can run one at a time.

## Core principles

> **Write each sub-task so one executor runs it from the doc alone — scope, dependency, and a re-runnable verification per row.**

A sub-task whose scope or check the executor must reconstruct from the planning discussion is not yet a plan entry.

## Write it

| Field | Value |
|---|---|
| When | Planning RECORD after the canonical plan passes. A mid-Execution refinement creates a new plan through another complete Planning iteration, never an in-place edit. |
| Source cursor | Gobbi-owned session UUID plus `step: planning`, `stage: RECORD`, the current `iteration`, and `task: null`. |
| Stage to | `sessions/{date}-{gobbi-session-id}/2-planning/staging/plans/{slug}.md` |
| Promotes to | `features/{f}/plans/{area}/` (productive-step path — feature-only) — `{area}` from this type's area list, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) (date-prefixed: `{area}/{YYYY-MM-DD}-{slug}.md`). Project-level `plans/` holds separately authorized maintainer roadmaps only; no productive-step staging route targets it. |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date-prefixed (tied to the session that produced it); slug describes the plan in ≤6 words (`2026-05-11-auth-middleware.md`) |

Planning RECORD writes only the typed staging source. Wrap-up WORK is the only stage that promotes it to durable memory ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

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
session: {Gobbi-owned session UUID}
tags: [planning, execution]          # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
task: {task name from Scope Contract}
supersedes: {prior-plan-slug} | null           # one plain slug, not a path
superseded_by: {new-plan-slug} | null          # plain slug, not a path
task_count: {number of sub-tasks in this plan}
---

# {Plan title}

## Idea anchor
{Link to the `features/{feature-name}/design/{area}/{slug}.md` document this plan implements.}

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

- **Update by supersede, never edit in place.** When Execution surfaces a plan change, return through the workflow and stage a newly accepted plan with `supersedes: {old-slug}`. The version lives in frontmatter, never the slug. Wrap-up WORK applies the new promotion, reciprocal link, and complete archive move as one frozen mutation set.
- **Sub-task granularity.** Each sub-task must be narrow enough that scope is unambiguous to one executor. If a description starts with "and then" or "while doing this also", split it.
