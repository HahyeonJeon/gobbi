---
name: weight-codex-evaluator-on-technical-accuracy
description: One system's no-finding result is not technical coverage; require both complete reports and verify supported findings.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: c8fe196d-c20d-451d-ac9c-2b366c49aa95
tags: [process, evaluation, codex, verification]
keywords: [technical-accuracy, no-findings-not-coverage, cross-system-divergence, primary-evidence]
author: claude
priority: high
domain: codex
related: []
---

# Technical accuracy needs both independent evaluator systems

## What happened

In a historical TypeScript review, Codex found several technical contradictions that Claude had not found. The difference included module, extension, API, runtime, and compiler-option claims. The incident showed valuable divergence, not a permanent authority hierarchy between systems.

## Why it happens

An evaluator can share blind spots with a contributor or miss a claim outside its strongest reasoning path. “No finding” means that evaluator did not support a defect; it does not prove complete coverage. Weighting one named system in advance would create a new shared-blind-spot assumption.

## Correct approach

Run one fresh Claude evaluator and one fresh Codex evaluator on the same complete creation and verification evidence. Require both to cover all seven perspectives plus Overall and to return schema-valid finding ledgers and checklists. Aggregate verdicts pessimistically and preserve both systems' provenance.

Verify each technical finding against the inspected artifact, tests, and primary authoritative sources before recommending disposition. Do not dismiss a supported finding because the other system was silent, and do not treat either system's silence as coverage. If one evaluator fails, pause; only an exact user-approved missing-system waiver permits that iteration to close.

## How to detect

The manager treats one report's PASS or empty finding list as proof that a technical claim was checked exhaustively, skips the other system, or gives one provider a standing tie-break role. A green code harness paired with unreviewed prose is another trigger.

## Related

- [[compile-harness-is-blind-to-prose-claims]] — executable examples do not validate every prose claim.
