# `references/`

> External sources with an extracted insight — docs, blogs, papers, RFCs, code that informed the project. Each carries the takeaway, not just the link.

## Core principles

> **Keep the extracted insight, not the link or a summary.**

A reference exists to save the next agent the re-read; the takeaway for this project is the value, not a link or a source summary.

> **State the condition that makes the insight apply.**

An insight with no condition-of-applicability gets invoked in the wrong situation and misleads the reader instead of guiding them.

## Write it

| Field | Value |
|---|---|
| When | Ideation Sub-step C (Research); or a loop's RECORD on a citable `general` finding. Bar = applicability, not novelty. |
| Stage to | `sessions/{date}-{session-id}/{N}-{loop}/staging/references/{slug}.md` |
| Promotes to | `features/{f}/references/{area}/` (default) · `references/{area}/` (project, cross-feature) — `{area}` from this type's area list, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | `{slug}.md` — bare-slug; name the topic, not the source (`redis-ttl-eviction.md`, not `redis-docs-ch7.md`) |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter + references extensions (`title`, `source`, `accessed`, `ref_type`). `ref_type` is the source genre (`docs`|`blog`|`paper`|`rfc`|`code`|`book`|`other`), distinct from base `type: references` ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)). Structured source provenance (`source_authority`, `stable_anchor`, `version_or_commit`, `license`, `retrieved_date`) lives in the body `## Source` section below — NOT frontmatter, which stays the four-field allowlist above.

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
tags: [memory, design]               # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude | codex | user        # auto-stamped at promotion from session.json.system; user = human hand-edit
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
Structured provenance — pin the source so the insight stays verifiable. Body fields, not frontmatter (the frontmatter allowlist stays `title` / `source` / `accessed` / `ref_type`):

- `source`: {URL or path — mirrors the `source` frontmatter field}
- `source_authority`: {who publishes it — official docs / vendor / standards body / personal blog}
- `stable_anchor`: {permalink, DOI, or pinned heading anchor — not a mutable "latest" URL}
- `version_or_commit`: {doc version, spec revision, or git SHA the insight was read at}
- `license`: {reuse terms of the source, when they constrain how the insight may be used}
- `retrieved_date`: {YYYY-MM-DD accessed — mirrors the `accessed` frontmatter field}

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
