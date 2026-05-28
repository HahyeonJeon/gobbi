---
name: markdown-memory-atomicity
description: "Reference: Karpathy/A-Mem markdown-wiki agent memory and Zettelkasten atomicity — one record per concept plus navigation index outperforms vector-DB RAG."
scope: feature
feature: project-memory
status: active
created: 2026-05-26
title: Markdown-wiki agent memory + Zettelkasten atomicity (Karpathy / A-Mem)
source: https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an
type: references
ref_type: blog
accessed: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [agent-memory, markdown, atomicity, zettelkasten, navigation, project-memory]
related: [frontmatter-as-schema]
---

# Markdown-wiki agent memory + Zettelkasten atomicity (Karpathy / A-Mem)

## Insight
Human-readable atomic markdown pages — one record, one concept — plus an index/navigation layer outperform vector-DB RAG for agent memory retrieval. The Zettelkasten atomicity principle and an explicit index are the load-bearing structure, not the embedding store.

## Related

- [frontmatter-as-schema](frontmatter-as-schema.md) — the schema layer that makes the atomic pages filterable
- [`memorization/rules.md` §3](../../../skills/memorization/rules.md) — the gobbi one-record-one-concept atomicity rule this validates

## Why it applies
Confirms gobbi's "plain markdown trees, one record one concept, README index" architecture is the right shape for agent memory — so this session's job is to *raise quality within that shape*, not re-architect it. Atomicity is already gobbi rule §3 and is validated; the missing piece is per-page writing quality + an index/navigation layer (the tertiary, mostly-deferred scope). Invoke to justify NOT re-homing #272's structure and to scope the navigation layer if ever picked up.

## Source
- https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an
- https://arxiv.org/html/2502.12110v11 (A-Mem — agentic memory)

## Excerpt
"Atomic, human-readable markdown notes with an index … rather than a vector database."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-26 | b0a0eaf9-03f7-4dce-a040-c7443653a459 | Anchored the "raise quality within #272's shape" stance (no re-home) + tertiary navigation scope |
