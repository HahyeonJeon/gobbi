# `plans/`

Task decomposition records — the output of the **Planning Loop**. Each plan breaks a locked task into narrow, ordered sub-tasks the Execution Loop can run one at a time.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Planning RECORD only**: stage at `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md`. `plans/` is **Planning-loop-only** — it does NOT appear in other loops' staging trees (ideation / preparation / execution / wrap-up do not produce plans). Loop RECORD **never** writes directly to memory.
2. **Wrap-up's RECORD**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Memory routing](../../wrap-up/SKILL.md#staging--memory-routing).

---

## When to write

- During **Planning** RECORD when the Planning Loop produces a canonical plan: write it here.
- Updates to an existing plan (mid-execution refinements) create a new versioned plan document; do not edit in place.

## Location

- **Feature-level (loop path): `.gobbi/projects/{project-name}/features/{feature}/plans/`** — the loop path writes plans ONLY here.
- Project-level `.gobbi/projects/{project-name}/plans/` — **maintainer-authored cross-feature roadmaps / release plans ONLY**, never loop-written.

The Planning-loop path is feature-only (per [`rules.md` § 3](../rules.md)). A project-level `plans/` may hold maintainer roadmaps, but no Planning-loop RECORD or Wrap-up promotion ever targets it.

## File naming

`{YYYY-MM-DD}-{slug}.md` — date-prefixed (a plan is tied to the session that produced it); slug describes the plan in ≤6 words. See [`rules.md` § 1](../rules.md).

Example: `2026-05-11-login-ui-shipping.md`, `2026-05-11-auth-middleware.md`.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the plans-type extensions (`task`, `task_count`). `supersedes` / `superseded_by` are **global plain-slug base fields** any type may carry (§2.1) — not plans-type extensions; their value is a plain slug (no path, no `[[ ]]`, [`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)); `tags` come from the controlled vocabulary ([`rules.md` § 2.5](../rules.md#25-controlled-tags-vocabulary)).

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
- [[2026-05-11-use-redis-not-memcached]] — the decision it follows
```

## Updates

When execution surfaces a need to change the plan (a sub-task was harder than expected, an ordering needed to flip), the assistant writes a new plan document at `{new-date}-{slug}.md` with `supersedes: {old-slug}` rather than editing in place — the version lives in frontmatter, never in the slug (no `-v2` suffix; [`rules.md` § 1.3](../rules.md) anti-pattern #6). The superseded plan is never deleted — at Wrap-up, it is moved (`git mv`) to `archive/plans/{date}-{slug}.md` per the move-on-terminal model. The active `plans/` directory then shows only live plans.

## Sub-task granularity

Sub-tasks must be narrow enough that scope is unambiguous to a single executor agent. If a sub-task description starts with "and then" or "while doing this also", split it.
