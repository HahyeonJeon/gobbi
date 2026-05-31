# `references/`

**External resources with extracted insights** — links to docs, blog posts, papers, RFCs, open-source code that informed this project's design. Each reference carries the **insight** (one or two sentences of what was learned) plus the source, so future agents skip the re-search work.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/references/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Ideation Sub-step C (Research)** when the leader surfaces a useful external source.
- During any loop's MEMORIZATION when an evaluator's `general` finding contains a citable external pattern.

The bar is **applicability**, not novelty: a reference belongs here if it informed a design decision, anchored a checklist item, or settled a discussion.

## Location

- **Feature-level (default):** `.gobbi/projects/{project-name}/features/{feature-name}/references/` — research happens inside a feature's Ideation, so a reference defaults to that feature (`scope: feature`, `feature: {feature-name}`). Wrap-up routes staging references here (see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing)).
- **Project-level (promote-up, rare):** `.gobbi/projects/{project-name}/references/` — for cross-feature prior art (`scope: project`, `feature: null`); user-confirmed at Wrap-up.

References are a **Both**-scope type (design §2.9, [`rules.md` § 3](../rules.md)), defaulting feature-level and promoting up only for cross-feature relevance.

## File naming

`{slug}.md` — bare-slug, short, descriptive. Slug describes the topic, not the source. No date prefix (evergreen). See [`rules.md` § 1](../rules.md).

Example: `redis-ttl-eviction.md` (not `redis-docs-chapter-7.md`), `karpathy-software-3.md`, `superpowers-brainstorming.md`.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the references-type extensions (`title`, `source`, `accessed`, `ref_type`). Note: base `type: references` is the memory type; the source genre (docs / blog / paper / …) is the `ref_type` extension, NOT the base `type`.

```markdown
---
name: {slug — short topic title}
description: {one-line what insight this source contributes}
type: references
scope: project | feature
feature: {feature-name} | null
status: active | superseded
created: YYYY-MM-DD
session: {session-id}
tags: [{tag1}, {tag2}]
title: {Short topic title}
source: {URL or path}
accessed: YYYY-MM-DD
ref_type: docs | blog | paper | rfc | code | book | other
---

# {Title}

## Insight
{One or two sentences: the specific lesson this source contributes. NOT a summary of the source — the takeaway.}

## Related
{Related learning / mistake / decision slugs this reference connects to. Body content, not frontmatter — the base+`title`/`source`/`accessed`/`ref_type` allowlist is the only frontmatter references carry.}

## Why it applies
{In one or two sentences, why this insight matters for this project. The condition under which the insight should be invoked.}

## Source
- {URL or path}
- {Optional: author / date / version}

## Excerpt
{Short verbatim quote if the source's exact wording matters. Keep under a paragraph; full re-read is via the link.}

## Usage history

| Date | Session | Used for |
|---|---|---|
| YYYY-MM-DD | {session_id} | {what design / decision / checklist item used this} |
```

## Insight vs link

A bare link is not a reference. The **insight** field is mandatory; references without insights are dropped at evaluation. The format `{url}\n\n{insight}` versus `{url}: {insight}` does not matter; the insight does.

## Multiple insights from one source

If one source contributes multiple insights to the project, write one reference file per insight, each with a different slug, all citing the same source. The slug names the insight, not the source.

## Usage history

The `Usage history` table grows over time as designs / decisions / checklist items cite this reference. Cap at 20 entries; older usage is recoverable from the cited artifacts.
