---
name: agent-os-layered-standards
description: Agent OS organizes context into Standards/Product/Specs layers and re-extracts standards from the codebase (Discover Standards)
type: references
scope: feature
feature: review
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [design, docs-sync]
keywords: [agent-os, spec-driven, standards, layered-context, discover-standards, staleness]
author: claude
title: Agent OS v2 — spec-driven standards system
source: https://buildermethods.com/agent-os/v2
accessed: 2026-06-29
ref_type: docs
---

# Agent OS v2 — spec-driven standards system

## Insight
Agent OS organizes development knowledge into three context layers — Standards (how you build), Product (what/why), Specs (what to build next) — injected at different workflow points. Its lifecycle includes **Discover Standards** (extract patterns/conventions FROM the codebase into documented standards) and **Index Standards** (keep them organized and discoverable).

## Reason
"Discover Standards" is the closest prior art to a memory-staleness re-sync mechanism: re-extracting truth from the codebase to refresh stored standards is exactly what gobbi's memory tree lacks (it only supersedes reactively). Its 3-layer injection model also informs the token-economy / progressive-disclosure axis (dimension 5) where gobbi full-loads ~104K words of SKILL.md.

## Source
- https://buildermethods.com/agent-os/v2
- https://buildermethods.com/agent-os/v2/3-layer-context

## Excerpt
"Discover Standards — Extract patterns and conventions from your codebase into documented standards ... Deploy Standards — Intelligently inject relevant standards based on what you're building ... Index Standards — Keep your standards organized and discoverable."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-29 | 40b9a93e-5ec4-43d7-bd16-075b0c7fa303 | Charter staleness re-sync prior art + dimension-5 token-economy axis |

## Related

- [[superpowers-skill-harness]] — the other skills/standards harness baseline
