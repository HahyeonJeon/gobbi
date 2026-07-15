---
name: contract-five-fixture-self-test
description: "Make five negative fixtures and their exact result markers a literal Task 02 interface."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, validation, verification]
keywords: [self-test, negative-fixtures, marker-contract]
author: codex
supersedes: make-verification-contracts-runnable
---

# Contract the five-fixture self-test

## Context

The iter2 plan invoked `--self-test`, but the current validator ignored that argument and returned success with ordinary live output.

## Decision

Task 02 implements exactly `wrong-model`, `wrong-effort`, `wrong-template-leaf`, `incomplete-bridge-command`, and `wrong-pointer`, exports `compatibility-self-test-interface`, and emits one exact PASS marker per fixture plus one `5/5` summary.

## Rationale

Tasks 02 and 03 can now reject the argument-ignoring implementation even when its process exits zero.

## Alternatives considered

Trusting the exit code or an unstructured PASS list was rejected because both reproduce the verified false pass.

## Consequences

Codex `CDEX-PLAN-I2-SELFTEST-001` and Claude closure finding `F-USAGE-1-ITER3` are addressed. The interface and literal handoff must remain intact during Execution.

## Related

- [[make-verification-contracts-runnable]] - the superseded broad root.
- [[compatibility-self-test-execution-contract]] - the follow-on design.
