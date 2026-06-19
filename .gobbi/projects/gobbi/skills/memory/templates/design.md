# `design/`

Long-form design documents that describe **what is being built and why**, at a level concrete enough to plan against and abstract enough to outlive a single execution session.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop RECORD** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/design/{slug}.md`. Loop RECORD **never** writes directly to memory.
2. **Wrap-up's RECORD**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Memory routing](../../wrap-up/SKILL.md#staging--memory-routing).

---

## When to write

- During **Ideation** RECORD when the leader produced a new design (Step 5 output): write the canonical idea spec here.
- During **Planning** RECORD when a design decision substantially evolves: append a follow-on document anchored to the original.

## Location

- Project-level: `.gobbi/projects/{project-name}/design/`
- Feature-level: `.gobbi/projects/{project-name}/features/{feature}/design/`

Choose feature-level when the design is bounded to one feature (typical). Choose project-level when the design is cross-cutting (architecture, conventions, platform decisions).

## File naming

`{slug}.md` — bare-slug, short, hyphenated, descriptive. No date prefix (designs are durable/evergreen; the date lives in frontmatter; use `decisions/` for time-stamped records). See [`rules.md` § 1](../rules.md).

Example: `cache-invalidation.md`, `auth-middleware.md`, `prompt-cascade.md`.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file). `design` has no non-link type extension. `supersedes` / `superseded_by` / `related` are **global plain-slug base fields** any type may carry (§2.1) — not design-type extensions: `supersedes` / `superseded_by` are plain slugs and `related` is a **`list[slug]`** (the target's `name`, no path, no `[[ ]]`, [`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)); `tags` come from the controlled vocabulary ([`rules.md` § 2.5](../rules.md#25-controlled-tags-vocabulary)).

```markdown
---
name: {slug — short design title}
description: {one-line what this design covers}
type: design
scope: project | feature
feature: {feature-name} | null
status: active | superseded
created: YYYY-MM-DD
session: {session-id}
tags: [design, schema]               # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
supersedes: {prior-design-slug} | null     # plain slug, not a path
superseded_by: {new-design-slug} | null     # plain slug, not a path
related: [cache-invalidation, 2026-05-11-use-redis-not-memcached]   # list[slug] — plain slugs, not paths
---

# {Title}

## Problem
{The framed problem this design addresses. Carries over from the Ideation Step 1 framing.}

## Scope
{In-scope / out-of-scope from the locked Scope Contract.}

## Approach
{The design — bottom-up baseline, layers, mechanisms, interfaces.}

## Scenarios
{Key scenarios this design must handle. Cross-reference `features/{feature-name}/scenarios/` for the full enumeration.}

## Validation
{Per design decision, how it will be validated — test / manual / metric / user demo.}

## Trade-offs
{What this design optimizes for and what it sacrifices.}

## Open issues
{Unresolved `design_flaw` / `assumption_risk` findings carried forward.}

## Related
{Navigable `[[slug]]` links to the decisions / plans / other designs this one builds on or feeds ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)). Mirrors the `related` frontmatter in navigable form.}

- [[2026-05-11-use-redis-not-memcached]] — the decision this design implements
- [[2026-05-11-cache-layer-plan]] — the plan that decomposes it
```

## Supersedence

When a new design supersedes an older one, set the old one's `status: superseded` and reference the new one in its `related` field. Do not delete superseded designs — they preserve the project's design history. At Wrap-up, the superseded design is moved (`git mv`) to `archive/design/{date}-{slug}.md` per the move-on-terminal model (never deleted; full content preserved in archive).
