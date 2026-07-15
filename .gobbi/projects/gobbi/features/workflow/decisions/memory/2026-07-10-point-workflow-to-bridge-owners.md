---
name: point-workflow-to-bridge-owners
description: "Keep bridge mechanics in Codex owners and point workflow evaluation to them once."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [docs-sync, design]
keywords: [ssot, typed-pointer, pointer-drift]
author: codex
---

# Point workflow evaluation to bridge owners

## Context
Workflow evaluation risked becoming a second authority for exact bridge CLI mechanics.

## Decision
Let `codex/SKILL.md` own high-level policy, `codex/delegation.md` own exact invocations, and workflow evaluation carry one typed pointer.

## Rationale
This follows the project rule to hoist shared concepts and point instead of restating.

## Alternatives considered
Copying the option block into workflow evaluation was rejected because it creates drift.

## Consequences
Both pointer-guard modes and compatibility assertions must pass.

## Related
- [[claude-to-codex-bridge-contract]] — the owned interface.
