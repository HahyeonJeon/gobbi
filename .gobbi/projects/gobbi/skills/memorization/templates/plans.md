# `plans/`

Task decomposition records — the output of the **Planning Loop**. Each plan breaks a locked task into narrow, ordered sub-tasks the Execution Loop can run one at a time.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Planning MEMORIZATION only**: stage at `sessions/{date}-{session-id}/planning/staging/plans/{slug}.md`. `plans/` is **Planning-loop-only** — it does NOT appear in other loops' staging trees (ideation / preparation / execution / wrap-up do not produce plans). Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Planning** MEMORIZATION when the Planning Loop produces a canonical plan: write it here.
- Updates to an existing plan (mid-execution refinements) create a new versioned plan document; do not edit in place.

## Location

- Project-level: `.gobbi/projects/{project-name}/plans/`
- Feature-level: `.gobbi/projects/{project-name}/features/{feature}/plans/`

Feature-level for plans bounded to one feature (typical). Project-level only for cross-feature plans (rare).

## File naming

`{YYYY-MM-DD}-{slug}.md` — date prefix; slug describes the plan in 3-6 words.

Example: `2026-05-11-login-ui-shipping.md`, `2026-05-11-auth-middleware-v1.md`.

## Item template

```markdown
---
date: YYYY-MM-DD
session: {session_id}
feature: {feature-name}
task: {task name from Scope Contract}
status: draft | in-progress | shipped | abandoned
supersedes: {prior-plan-slug} or null
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
```

## Updates

When execution surfaces a need to change the plan (a sub-task was harder than expected, an ordering needed to flip), the assistant writes a new plan document `{date}-{slug}-v2.md` with `supersedes: {old-slug}` rather than editing in place. The superseded plan is never deleted — at Wrap-up, it is moved (`git mv`) to `archive/plans/{date}-{slug}.md` per the move-on-terminal model. The active `plans/` directory then shows only live plans.

## Sub-task granularity

Sub-tasks must be narrow enough that scope is unambiguous to a single executor agent. If a sub-task description starts with "and then" or "while doing this also", split it.
