---
name: diataxis-type-purity
description: "Reference: Diátaxis type-purity principle — one doc serves one type's job; mixing types is a core documentation problem."
scope: feature
feature: project-memory
status: active
created: 2026-05-26
title: Diátaxis type-purity — one doc, one type's job
source: https://diataxis.fr/start-here/
type: references
ref_type: docs
accessed: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [docs-authoring, taxonomy, type-purity, project-memory]
related: [naming-standard-needs-positive-guidance-not-just-blocklist]
---

# Diátaxis type-purity — one doc, one type's job

## Insight
A doc serves one of four jobs along two axes (action vs cognition, study vs work); "crossing or blurring the boundaries … is at the heart of a vast number of problems." The positive rule is: each doc does exactly one type's job and must not bleed into another.

## Related

- [`naming-standard-needs-positive-guidance-not-just-blocklist`](../../../mistakes/naming-standard-needs-positive-guidance-not-just-blocklist.md) — the project mistake whose "name the positive bar, not just a blocklist" lesson this reference reinforces for prose
- [adr-decision-record-shape](adr-decision-record-shape.md) — the companion reference anchoring the per-type section contract

## Why it applies
gobbi already HAS a type system (decisions / design / mistakes / learnings / notes / references), but the existing standard governs naming/frontmatter/structure, not prose-content type-purity. Diátaxis supplies the positive prose rule the standard lacks — a decision is not a journal; a design doc is not a changelog. It maps onto Principle 13's existing "must NOT bleed into adjacent types" clause, extending it from a frontmatter-type rule to a prose-content rule. Invoke when writing or evaluating any memory doc for single-type focus.

## Source
- https://diataxis.fr/start-here/
- Daniele Procida, Diátaxis documentation framework

## Excerpt
"Crossing or blurring the boundaries between them … is at the heart of a vast number of documentation problems."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-26 | b0a0eaf9-03f7-4dce-a040-c7443653a459 | Anchored Locked Decision 2 / D1 (keep 13 types, import type-purity as prose guidance) |
