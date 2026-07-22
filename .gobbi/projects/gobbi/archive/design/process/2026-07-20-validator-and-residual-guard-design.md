---
name: validator-and-residual-guard-design
description: "Defines positive policy assertions, semantic residual checks, and pointer-drift validation."
type: design
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [validation, docs-sync]
keywords: [compatibility-script, residual-scan, pointer-guard]
author: codex
related: [deterministic-codex-policy-authorities, claude-to-codex-bridge-contract]
archived_at: 2026-07-20
archive_reason: retired
---

# Validator and residual guard design

## Problem
The current compatibility script positively enforces inheritance, null templates, and mixed effort. A partial update would either fail stale checks or leave contradictions unguarded.

## Scope
Rewrite model-policy assertion families while preserving non-policy compatibility checks.

## Approach
Assert exact config, wrapper, template, command, owner, pointer, and version properties. Add semantic residual checks only after classifying every live hit.

## Scenarios
One wrapper differs, one template leaf remains null, one bridge command lacks an override, old inheritance prose survives, or a broad scan matches legitimate text.

## Validation
Run syntax checks, deliberate mismatch fixtures, pointer self-test/live guard, and the clean final compatibility pass.

## Trade-offs
Exact assertions couple docs and validators intentionally; Planning must co-edit them.

## Open issues
Complete the `codex exec` classification and scope `null` checks with `jq`.

## Related
- [[classify-every-residual-scan-hit]] — the open negative-side scenario.
