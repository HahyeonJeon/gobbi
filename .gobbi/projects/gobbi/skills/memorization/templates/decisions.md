# `decisions/`

Time-stamped **decision records** (ADR-style) capturing what was decided, why, and what alternatives were considered. Future agents read these to understand *why the project looks the way it does* without re-running the original discussion.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/decisions/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Ideation / Planning** MEMORIZATION when a significant decision was made (technology choice, architecture trade-off, scope inclusion/exclusion).
- During **Execution** MEMORIZATION when a mid-execution decision changed direction (e.g., chose to defer a sub-task, picked library A over library B, accepted a deferred risk).
- When a `design_flaw` or `assumption_risk` finding from EVALUATION received `PASS` despite the finding — record as `decisions/{date}-deferred-risk-{slug}.md` per finding-type routing.

## Location

- Project-level: `.gobbi/projects/{project-name}/decisions/`
- Feature-level: `.gobbi/projects/{project-name}/features/{feature}/decisions/`

Project-level for decisions that span features or affect project conventions. Feature-level when scoped to one feature.

## File naming

`{YYYY-MM-DD}-{slug}.md` — date prefix; slug describes the decision in 3-6 words.

Example: `2026-05-11-use-redis-not-memcached.md`, `2026-05-11-defer-password-reset.md`.

## Item template

```markdown
---
date: YYYY-MM-DD
session: {session_id}
status: accepted | superseded | deferred
feature: {feature-name} or null
supersedes: {prior-decision-slug} or null
superseded_by: {new-decision-slug} or null
---

# {Decision title — imperative form, e.g., "Use Redis, not Memcached, for the cache layer"}

## Context
{The situation that required a decision. What problem were we solving?}

## Decision
{What was decided, stated in one or two sentences.}

## Rationale
{Why this option, not the others. Cite evidence — benchmarks, codebase patterns, user constraints.}

## Alternatives considered
{The other options on the table and why each was not chosen.}

## Consequences
{What this decision now obligates. Migrations needed, code patterns to follow, capabilities gained or lost.}

## Related
{Links to the discussion / design / plan documents that informed or follow from this decision.}
```

## Supersedence

When a decision is reversed or refined, create a new decision record with `supersedes: {old-slug}` and update the old one with `status: superseded` and `superseded_by: {new-slug}`. Never delete a decision — the chain is the history.

## Deferred risks

When a `design_flaw` or `assumption_risk` finding receives `PASS` instead of `REVISE`, the assistant writes a decision record with `status: deferred` documenting:
- The risk
- Why the team accepted it for now
- The condition under which the decision would flip
