---
name: classify-every-residual-scan-hit
description: "Residual checks must distinguish override targets from valid prose, metadata, and unrelated null values."
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, verification]
keywords: [residual-scan, codex-exec, jq, negative-coverage]
author: codex
---

# Classify every residual scan hit

**Category:** failure-mode
**Coverage:** partial

## Situation
A broad text scan for `codex exec` or `null` reports legitimate prose pointers, historical examples, Claude leaves, and other unrelated values.

## Inputs
All live search hits plus structured `.models.codex.*` paths from both settings templates.

## Expected behavior
Planning classifies every command hit and uses `jq` for Codex model leaves. The validator fails only on contradictory live policy, not valid unrelated text.

## Verification
Run the complete search inventory, record the classification for each hit, and exercise deliberate mismatches before the clean validator run.

## Related
- [[validator-and-residual-guard-design]] — the design that owns positive and negative policy checks.
