---
name: make-verification-contracts-runnable
description: "Replace prose verification summaries with exact fail-closed task contracts."
type: decisions
scope: feature
feature: workflow
status: superseded
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, verification, process]
keywords: [runnable-verification, fresh-executor, shell-gates]
author: codex
superseded_by: contract-five-fixture-self-test
archived_at: 2026-07-11
archive_reason: superseded
---

# Make verification contracts runnable

## Context

Codex iter1 found that all three task gates were prose or incomplete command fragments.

## Decision

Every task carries a complete fail-closed command block that a fresh executor can run as written.

## Rationale

Verification must be stable before delegation. Otherwise the executor invents the acceptance test and can false-pass its own work.

## Alternatives considered

Prose summaries and executor-filled commands were rejected because neither is mechanically reproducible.

## Consequences

The broad iter1 gap was mostly addressed in iter2. Its remaining negative-fixture surface was superseded by the narrower `CDEX-PLAN-I2-SELFTEST-001` root and `contract-five-fixture-self-test` decision.

## Related

- [[contract-five-fixture-self-test]] - the narrower superseding root.
- [[deterministic-codex-model-policy]] - the final runnable contracts.
