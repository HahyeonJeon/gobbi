# `decisions/`

> Time-stamped decision records (ADR-style) — what was decided, why, and what alternatives were considered. A future reader learns why the project looks the way it does without re-running the discussion.

## Core principle
Record the conclusion and why the alternatives lost — so a future reader understands the choice without re-running the debate.

## Write it

| Field | Value |
|---|---|
| When | A loop's RECORD (`ideation` / `planning` / `execution`) when a significant decision was made — technology choice, architecture trade-off, scope inclusion/exclusion, or a `design_flaw` / `assumption_risk` finding that received `PASS` (a deferred risk). |
| Stage to | `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md` |
| Promotes to | `features/{f}/decisions/` (default) · `decisions/` (project, cross-feature) |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date-prefixed (decisions are time-indexed); slug names the decision in ≤6 words (`2026-05-11-use-redis-not-memcached.md`) |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter only — `decisions` has no non-link type extension. One unified `status` carries the decision lifecycle (`proposed` | `accepted` | `superseded`); the old `decision_status` is removed, its meaning folded into `status` ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)).

```markdown
---
name: {slug — the decision, imperative}
description: {one-line what was decided}
type: decisions
scope: project | feature
feature: {feature-name} | null
status: proposed | accepted | superseded
created: YYYY-MM-DD
session: {session-id}
tags: [process, design]              # controlled vocabulary (§2.5)
keywords: [cache-layer]              # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
supersedes: {prior-decision-slug} | null     # plain slug, not a path
superseded_by: {new-decision-slug} | null     # plain slug, not a path
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
{Navigable `[[slug]]` links to the discussion / design / plan documents that informed or follow from this decision — one bullet per link ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[cache-invalidation]] — the design this decision constrains
```

## Notes

- **Deferred risks are `status: accepted` decisions.** When a `design_flaw` or `assumption_risk` finding receives `PASS` instead of `REVISE`, write a decision documenting the risk, why the team accepted it for now, and the condition under which the decision would flip.
