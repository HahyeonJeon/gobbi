---
name: classify-historical-command-examples
description: "Historical and metadata command examples must be classified before exclusion from live-policy checks."
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [docs-sync, historical-isolation, codex-exec]
author: codex
---

# Classify historical command examples

**Category:** edge-case
**Coverage:** covered

## Situation
A repository search finds `codex exec` in incident evidence, metadata documentation, or a pointer that is not a live proposer or evaluator invocation.

## Inputs
Every search hit and its document purpose, including `codex/mistakes.md`, `codex/task-metadata.md`, and workflow pointers.

## Expected behavior
Each hit is classified by meaning. Historical evidence remains unchanged, while every live invocation receives the locked model and effort overrides.

## Verification
Review every residual hit after the edit and confirm that each exclusion has a written semantic reason.

## Related
- [[historical-isolation]] — the user decision that preserves old evidence.
