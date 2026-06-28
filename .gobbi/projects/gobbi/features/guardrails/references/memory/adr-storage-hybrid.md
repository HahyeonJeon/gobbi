---
name: adr-storage-hybrid
description: ADR practice stores per-module decisions with the module but cross-cutting decisions in a central store — a hybrid, not one location
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [memory, design]
keywords: [adr, architecture-decision-record, co-located, central-store, cross-cutting, hybrid]
author: claude
title: ADR storage is a hybrid — per-module for local, central for cross-cutting
source: https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/
accessed: 2026-06-27
ref_type: blog
---

# ADR storage is a hybrid — per-module for local, central for cross-cutting

## Insight
Architecture Decision Records are stored as a HYBRID: decisions affecting one component live with that component; decisions that influence everything live in a central store. Neither location alone is correct.

## Reason
Directly anchors the confirmed two-home mistakes model: skill-specific traps live in the owning `skills/{skill}/mistakes.md`; cross-cutting traps stay in the central project `mistakes/{area}/` memory tier. The split-by-ownership is validated prior art, not an ad-hoc compromise.

## Source
- https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/
- https://martinfowler.com/bliki/ArchitectureDecisionRecord.html

## Excerpt
Storing ADRs with the code worked well when the decision affected just that one component. Some architectural decisions influenced all microservices … This led to creating a new repository for all cross-cutting documentation.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-27 | 659a1b3f-0b70-419a-848b-a02db5dbbded | Ideation insight E2 — anchors the hybrid two-home model (Q2 confirmed) |

## Related

- [[docs-as-code-colocation]] — the co-location half of the hybrid
- [[nearest-file-wins-colocated-rules]] — the same root-default-plus-local pattern
