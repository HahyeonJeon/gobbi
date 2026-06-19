# `references/`

> External sources with an extracted insight — docs, blogs, papers, RFCs, code that informed the project. Each carries the takeaway, not just the link.

## Core principle

> **Keep the insight, not just the link.**

A reference exists to save the next agent the re-search.

## Write it

| Field | Value |
|---|---|
| When | Ideation Sub-step C (Research); or a loop's RECORD on a citable `general` finding. Bar = applicability, not novelty. |
| Stage to | `sessions/{date}-{session-id}/{N}-{loop}/staging/references/{slug}.md` |
| Promotes to | `features/{f}/references/` (default) · `references/` (project, cross-feature) |
| Filename | `{slug}.md` — bare-slug; name the topic, not the source (`redis-ttl-eviction.md`, not `redis-docs-ch7.md`) |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter + references extensions (`title`, `source`, `accessed`, `ref_type`). `ref_type` is the source genre (`docs`|`blog`|`paper`|`rfc`|`code`|`book`|`other`), distinct from base `type: references` ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)).

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
tags: [memory, design]               # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
title: {Short topic title}
source: {URL or path}
accessed: YYYY-MM-DD
ref_type: docs | blog | paper | rfc | code | book | other
---

# {Title}

## Insight
{One or two sentences: the specific lesson this source contributes. NOT a summary of the source — the takeaway.}

## Reason
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

## Related
{Navigable `[[slug]]` links to the learning / mistake / decision this reference connects to ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)). Body content, not frontmatter — the base + `title`/`source`/`accessed`/`ref_type` allowlist is the only frontmatter references carry.}

- [[redis-ttl-eviction-learning]] — the learning this source anchored
```

## Notes

- **Insight is mandatory.** A bare link is not a reference; references without an insight are dropped at evaluation.
- **One insight per file.** If a source gives several insights, write one file per insight, each with its own slug, all citing the same source.
- **Usage history cap 20.** Older usage is recoverable from the cited artifacts.
