---
name: frontmatter-as-schema
description: "Reference: frontmatter as document schema — conformance enables filter-before-read retrieval without loading doc bodies."
scope: feature
feature: project-memory
status: active
created: 2026-05-26
title: Frontmatter as document schema — conformance enables filter-before-read
source: https://understandingdata.com/posts/frontmatter-as-document-schema/
type: blog
accessed: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [docs-authoring, frontmatter, schema, conformance, project-memory]
related: [docs-as-code-linting]
---

# Frontmatter as document schema — conformance enables filter-before-read

## Insight
Frontmatter acts as type signatures for documents; a consistent schema (including fields like `lastUpdated`) lets a consumer filter and detect staleness *without reading the body*. The conformance of the schema matters as much as the schema's existence.

## Why it applies
This validates gobbi's base-frontmatter bet (machine-addressable memory): an agent should filter on frontmatter before loading bodies. It justifies Success Criterion 2 (100% base-schema conformance on live docs, 0 staging-key leaks outside `archive/`) as a real retrieval win rather than pedantry — the ~15%-realized base schema is what blocks the filter-before-read pattern today. Invoke when stating the frontmatter conformance target (D6) and sizing the conformance wave.

## Source
- https://understandingdata.com/posts/frontmatter-as-document-schema/

## Excerpt
"Frontmatter is effectively a schema for your documents — and a schema is only useful if documents conform to it."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-26 | b0a0eaf9-03f7-4dce-a040-c7443653a459 | Anchored D6 (frontmatter conformance) + Success Criterion 2 |
