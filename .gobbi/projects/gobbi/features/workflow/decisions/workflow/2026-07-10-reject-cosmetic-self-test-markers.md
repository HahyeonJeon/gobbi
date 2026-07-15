---
name: reject-cosmetic-self-test-markers
description: "Require the five self-test markers to represent real rejected mutations, not printed success text."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, validation, verification]
keywords: [self-test, cosmetic-pass, fixture-evidence]
author: codex
---

# Reject cosmetic self-test markers

## Context

The final plan proves exact marker presence but does not prescribe the fixture implementation internals.

## Decision

Execution must implement real mutated fixtures and let Execution evaluation inspect their behavior. Marker text alone is not sufficient evidence.

## Rationale

The plan should state the observable contract without over-prescribing implementation. Independent Execution review closes the remaining trust boundary.

## Alternatives considered

Embedding fixture construction code in the plan was rejected as implementation overreach. Accepting printed markers without review was also rejected.

## Consequences

Claude `F-USAGE-2-ITER3` remains open at Low/25 and is an Execution evaluation note, not a Planning blocker.

## Related

- [[contract-five-fixture-self-test]] - the observable interface contract.
- [[compatibility-self-test-execution-contract]] - the design constraints.
