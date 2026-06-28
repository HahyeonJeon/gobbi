---
name: docs-as-code-colocation
description: Docs-as-code keeps durable docs in the same repo, next to the code they describe — versioned, reviewed, and discovered together
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [memory, design]
keywords: [docs-as-code, co-location, markdown, single-source-of-truth]
author: claude
title: Docs-as-code — documentation lives with the code it describes
source: https://www.writethedocs.org/guide/docs-as-code/
accessed: 2026-06-27
ref_type: docs
---

# Docs-as-code — documentation lives with the code it describes

## Insight
Durable documentation belongs in the same repository, next to the code it explains, so it is versioned with, reviewed alongside, and discoverable from that code — not parked in a separate central store.

## Reason
Validates the core move of the mistakes redesign: a per-skill `mistakes.md` sitting next to its `SKILL.md` is the docs-as-code pattern applied to a skill — the trap loads in the context of the thing it warns about.

## Source
- https://www.writethedocs.org/guide/docs-as-code/
- https://dev.to/arto-b/docs-as-code-why-documentation-should-live-with-your-code-598j

## Excerpt
Documentation should live alongside the code it describes, with documentation files (often Markdown) located in the same repository as the application or API they describe.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-27 | 659a1b3f-0b70-419a-848b-a02db5dbbded | Ideation insight E1 — anchors the skill-surface `mistakes.md` home (D1) |

## Related

- [[adr-storage-hybrid]] — the central-vs-co-located trade-off this co-location sits inside
