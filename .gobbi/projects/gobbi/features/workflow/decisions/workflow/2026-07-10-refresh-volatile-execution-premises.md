---
name: refresh-volatile-execution-premises
description: "Recheck CLI, settings, config, and alias facts before implementation relies on them."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [execution, verification]
keywords: [fresh-evidence, cli, symlink, config]
author: codex
---

# Refresh volatile Execution premises

## Context
CLI options, template consumers, tracked config state, and symlink topology can change between Ideation and Execution.

## Decision
Re-run every named premise check immediately before the corresponding edit and again during final verification.

## Rationale
Prior evidence supports the design but does not replace fresh implementation evidence.

## Alternatives considered
Treating Ideation observations as permanently settled was rejected.

## Consequences
Any changed premise stops the affected edit and returns the issue to the manager.

## Related
- [[rollback-and-risk-boundaries]] — the design's failure controls.
