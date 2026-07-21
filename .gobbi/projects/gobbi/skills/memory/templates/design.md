# `design/`

> Long-form design documents — what is being built and why, concrete enough to plan against and abstract enough to outlive a single execution session.

## Core principles

> **Capture the chosen approach and the trade-offs it accepts.**

The next session plans against the design instead of re-deriving the approach and re-weighing what it gave up.

> **Write it evergreen — the architecture, not the session that produced it.**

A reader opening it cold next session gets the durable design, not a work-log they must decode.

## Write it

| Field | Value |
|---|---|
| When | Ideation or Planning RECORD after the canonical artifact passes and the design is durable. |
| Source cursor | Gobbi-owned session UUID plus the current `state.json` `step`, `stage: RECORD`, `iteration`, and `task: null`. |
| Stage to | `sessions/{date}-{gobbi-session-id}/{N}-{step}/staging/design/{slug}.md` |
| Promotes to | `features/{f}/design/{area}/` (bounded to one feature, typical) · `design/{area}/` (project, cross-cutting) — `{area}` from this type's area list, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | `{slug}.md` — bare-slug, hyphenated, descriptive, no date prefix (durable/evergreen; use `decisions/` for time-stamped records) (`cache-invalidation.md`, `auth-middleware.md`) |

RECORD writes only the typed staging source. Wrap-up WORK is the only stage that promotes it to durable memory ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter only — `design` has no non-link type extension. `supersedes` / `superseded_by` are plain slugs and `related` is a `list[slug]` (the target's `name`, no path, no `[[ ]]`) — all are global base fields any type may carry (§2.1), not design-type extensions ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)). `tags` come from this type's controlled pool ([rules §2.5](../rules.md#25-controlled-tags-vocabulary)).

```markdown
---
name: {slug — short design title}
description: {one-line what this design covers}
type: design
scope: project | feature
feature: {feature-name} | null
status: active | superseded
created: YYYY-MM-DD
session: {Gobbi-owned session UUID}
tags: [design, schema]               # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
supersedes: {prior-design-slug} | null         # one plain slug, not a path
superseded_by: {new-design-slug} | null     # plain slug, not a path
related: [cache-invalidation, 2026-05-11-use-redis-not-memcached]   # list[slug] — plain slugs, not paths
---

# {Title}

## Problem
{The framed problem this design addresses. Carries over from the accepted Ideation artifact.}

## Scope
{In-scope / out-of-scope from the locked Scope Contract.}

## Approach
{The design — bottom-up baseline, layers, mechanisms, interfaces.}

## Scenarios
{Key scenarios this design must handle. Cross-reference `features/{feature-name}/scenarios/{area}/` for the full enumeration.}

## Validation
{Per design decision, how it will be validated — test / manual / metric / user demo.}

## Trade-offs
{What this design optimizes for and what it sacrifices.}

## Open issues
{Unresolved `design_flaw` / `assumption_risk` findings carried forward.}

## Related
{Navigable `[[slug]]` links to the decisions / plans / other designs this one builds on or feeds ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)). Mirrors the `related` frontmatter in navigable form.}

- [[2026-05-11-use-redis-not-memcached]] — the decision this design implements
```
