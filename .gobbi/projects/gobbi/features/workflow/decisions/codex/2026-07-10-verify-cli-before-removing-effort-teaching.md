---
name: verify-cli-before-removing-effort-teaching
description: "Confirm the installed CLI before replacing standalone effort guidance."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [codex-exec, effort-flag, cli-help]
author: codex
---

# Verify CLI before removing effort teaching

## Context
Current skill text teaches a standalone `--effort` option, while installed CLI evidence exposes `-m` and `-c` but no such flag.

## Decision
Capture fresh `codex exec --help`, then standardize effort through `-c 'model_reasoning_effort="xhigh"'`.

## Rationale
The bridge contract must follow the real CLI surface instead of either stale prose or memory.

## Alternatives considered
Retaining both forms was rejected because it would preserve contradictory guidance.

## Consequences
Execution blocks the doc edit if fresh help differs.

## Related
- [[claude-to-codex-bridge-contract]] — the selected bridge interface.
