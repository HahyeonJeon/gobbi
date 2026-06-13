# `design/`

Long-form design documents that describe **what is being built and why**, at a level concrete enough to plan against and abstract enough to outlive a single execution session.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/design/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Ideation** MEMORIZATION when the leader produced a new design (Step 5 output): write the canonical idea spec here.
- During **Planning** MEMORIZATION when a design decision substantially evolves: append a follow-on document anchored to the original.

## Location

- Project-level: `.gobbi/projects/{project-name}/design/`
- Feature-level: `.gobbi/projects/{project-name}/features/{feature}/design/`

Choose feature-level when the design is bounded to one feature (typical). Choose project-level when the design is cross-cutting (architecture, conventions, platform decisions).

## File naming

`{slug}.md` — bare-slug, short, hyphenated, descriptive. No date prefix (designs are durable/evergreen; the date lives in frontmatter; use `decisions/` for time-stamped records). See [`rules.md` § 1](../rules.md).

Example: `cache-invalidation.md`, `auth-middleware.md`, `prompt-cascade.md`.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the design-type extensions (`supersedes`, `superseded_by`, `related`).

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
tags: [{tag1}, {tag2}]
supersedes: {prior-design-slug} | null
superseded_by: {new-design-slug} | null
related: [decisions/{slug}, plans/{slug}, changelogs/{slug}]
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
```

## Supersedence

When a new design supersedes an older one, set the old one's `status: superseded` and reference the new one in its `related` field. Do not delete superseded designs — they preserve the project's design history. At Wrap-up, the superseded design is moved (`git mv`) to `archive/design/{date}-{slug}.md` per the move-on-terminal model (never deleted; full content preserved in archive).
