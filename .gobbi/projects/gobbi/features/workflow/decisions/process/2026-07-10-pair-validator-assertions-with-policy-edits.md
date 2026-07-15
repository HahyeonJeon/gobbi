---
name: pair-validator-assertions-with-policy-edits
description: "Keep exact validator assertions synchronized with the policy text they guard."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [docs-sync, validation]
keywords: [compatibility-validator, assertion-family]
author: codex
---

# Pair validator assertions with policy edits

## Context
The compatibility script checks exact wording across several policy owners.

## Decision
Inventory each assertion family and edit it with the corresponding policy site.

## Rationale
This prevents a correct policy edit from failing its own stale guard and prevents a loose guard from missing drift.

## Alternatives considered
Keeping a generic validator rewrite was rejected because it hid string-level coupling.

## Consequences
Planning must sequence coupled docs and validator families together.

## Related
- [[validator-and-residual-guard-design]] — the validation design.
