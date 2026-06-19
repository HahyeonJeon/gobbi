# `learnings/`

> Transferable insights the project picked up — what we now know how to do better, from direct experience. A learning is feature-local by default; a cross-feature one promotes up to the project tier.

## Core principle
Capture the technique that worked and why — so the next agent reuses the win instead of rediscovering it.

## Write it

| Field | Value |
|---|---|
| When | A loop's RECORD when the loop produced a durable insight — a pattern that worked better than expected, a technique that should become a convention, a platform/library behavior discovered through use; or Wrap-up RECORD when a cross-loop pattern surfaces only at session close. |
| Stage to | `sessions/{date}-{id}/{N}-{loop}/staging/learnings/{slug}.md` |
| Promotes to | `features/{f}/learnings/` (default) · `learnings/` (project, cross-cutting) |
| Filename | `{slug}.md` — bare-slug, ≤6 words (`markdown-link-relativization.md`); no date or finding-ID prefix |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter only — `learnings` has no non-link type extension. The example shows the **default-feature** case (`scope: feature` + a `feature` slug); a cross-feature learning uses `scope: project` + `feature: null`. `related` is a `list[slug]` ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)).

```markdown
---
name: {slug — the insight, named}
description: {one-line what we now know how to do better}
type: learnings
scope: feature
feature: {feature-name}
status: active | superseded
created: YYYY-MM-DD
session: {session-id}
tags: [process, verification]        # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
supersedes: {prior learning slug} | null      # plain slug, not a path
superseded_by: {newer learning slug} | null    # plain slug, not a path
related: [{related learning slugs}]            # list[slug] — plain slugs, not paths
---

# {Title}

## Insight
{One or two sentences: the lesson, stated as actionable knowledge.}

## Context
{The situation that produced this learning. What was being attempted, what was discovered.}

## Reason
{The cost the project would pay if this knowledge were lost. Convince a future reader to keep this.}

## How
{Concrete guidance: when to use this insight, where it applies, what to watch for.}

## Counter-cases
{When this insight does NOT apply. Important — most insights have boundaries.}

## Related
{Navigable `[[slug]]` links to mistakes / references / decisions that share context with this learning ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[file-move-needs-link-resolution-check]] — the trap this insight avoids
```

## Notes

- **Vs other types.** A learning is "do this — here's the better way"; a mistake is "do not do that — here's the trap". When a finding has both shapes, write a mistake for the trap and a learning for the better way, cross-referencing each other.
