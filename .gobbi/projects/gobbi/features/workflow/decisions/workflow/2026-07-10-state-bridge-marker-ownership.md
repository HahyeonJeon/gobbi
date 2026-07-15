---
name: state-bridge-marker-ownership
description: "Preserve separate compatibility and workflow-pointer marker owners and make their split explicit."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, docs-sync, validation]
keywords: [bridge-owner, pointer-guard, compatibility-validator]
author: codex
---

# State bridge marker ownership

## Context

The compatibility validator owns the `Codex bridge owners` marker, while the pointer-drift guard owns a different typed workflow-pointer vocabulary.

## Decision

Keep both guards and treat their different marker vocabularies as intentional. Do not assume the pointer-drift guard validates the bridge-owner marker.

## Rationale

The two checks cover distinct contracts and both are required. Current commands are coherent, but the ownership split is not stated in the plan prose.

## Alternatives considered

Collapsing the marker vocabularies was rejected because it would merge independent validation responsibilities.

## Consequences

This Low assumption risk remains open for Execution awareness. It does not block the plan.

## Related

- [[claude-to-codex-bridge-contract]] - the bridge ownership design.
- [[validator-and-residual-guard-design]] - the two validation owners.
