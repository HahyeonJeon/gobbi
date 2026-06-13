# `decisions/`

Time-stamped **decision records** (ADR-style) capturing what was decided, why, and what alternatives were considered. Future agents read these to understand *why the project looks the way it does* without re-running the original discussion.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop RECORD** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md`. Loop RECORD **never** writes directly to memory.
2. **Wrap-up's RECORD**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Memory routing](../../wrap-up/SKILL.md#staging--memory-routing).

---

## When to write

- During **Ideation / Planning** RECORD when a significant decision was made (technology choice, architecture trade-off, scope inclusion/exclusion).
- During **Execution** RECORD when a mid-execution decision changed direction (e.g., chose to defer a sub-task, picked library A over library B, accepted a deferred risk).
- When a `design_flaw` or `assumption_risk` finding from EVALUATION received `PASS` despite the finding — record as `decisions/{date}-deferred-risk-{slug}.md` per finding-type routing.

## Location

- Project-level: `.gobbi/projects/{project-name}/decisions/`
- Feature-level: `.gobbi/projects/{project-name}/features/{feature}/decisions/`

Project-level for decisions that span features or affect project conventions. Feature-level when scoped to one feature.

## File naming

`{YYYY-MM-DD}-{slug}.md` — date-prefixed (decisions are time-indexed); slug describes the decision in ≤6 words, one decision per file (atomicity — no bundle files). See [`rules.md` § 1](../rules.md).

Example: `2026-05-11-use-redis-not-memcached.md`, `2026-05-11-defer-password-reset.md`.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the decisions-type extensions (`supersedes`, `superseded_by`, `decision_status`). Base `status` is the coarse lifecycle field; `decision_status` is the documented per-type refinement that mirrors it ([`rules.md` § 2.2](../rules.md)).

```markdown
---
name: {slug — the decision, imperative}
description: {one-line what was decided}
type: decisions
scope: project | feature
feature: {feature-name} | null
status: active | superseded
created: YYYY-MM-DD
session: {session-id}
tags: [{tag1}, {tag2}]
supersedes: {prior-decision-slug} | null
superseded_by: {new-decision-slug} | null
decision_status: proposed | accepted | superseded
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

When a decision is reversed or refined, create a new decision record with `supersedes: {old-slug}` and flip the old one's `status: superseded` + `superseded_by: {new-slug}`. Never delete a decision — the chain is the history. At session Wrap-up, the superseded decision is moved (`git mv`) to `archive/decisions/{YYYY-MM-DD}-{slug}.md` per the move-on-terminal model; the active `decisions/` directory shows only live decisions.

## Deferred risks

When a `design_flaw` or `assumption_risk` finding receives `PASS` instead of `REVISE`, the assistant writes a decision record with `status: deferred` documenting:
- The risk
- Why the team accepted it for now
- The condition under which the decision would flip
