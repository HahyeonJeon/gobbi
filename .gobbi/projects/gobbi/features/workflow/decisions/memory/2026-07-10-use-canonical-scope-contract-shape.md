---
name: use-canonical-scope-contract-shape
description: "Render the Scope Contract as real frontmatter and real Markdown sections."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [process, frontmatter]
keywords: [scope-contract, downstream-consumer]
author: codex
---

# Use canonical Scope Contract shape

## Context
Iteration 1 rendered required metadata and sections inside example fences.

## Decision
Use real YAML frontmatter and the five canonical body headings.

## Rationale
Downstream loops must consume the contract by artifact type and heading.

## Alternatives considered
Keeping an illustrative fenced block was rejected because it is not the artifact schema.

## Consequences
The final briefing preserves the approved contract in a consumable form.

## Related
- [[live-surface-scope]] — the locked scope discussion.
