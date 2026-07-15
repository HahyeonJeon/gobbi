---
name: compatibility-self-test-execution-contract
description: "Define the observable five-fixture self-test contract that Execution must implement and verify."
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [design, validation, codex]
keywords: [self-test, fixtures, execution-contract, false-pass]
author: codex
related: [validator-and-residual-guard-design, contract-five-fixture-self-test, deterministic-codex-model-policy]
---

# Compatibility self-test execution contract

## Problem

The compatibility validator currently accepts `--self-test` without parsing it and returns success from ordinary live checks. An exit-code-only task gate can therefore false-pass with zero negative fixtures.

## Scope

The design changes only `scripts/check-codex-compatibility.sh` inside the locked Task 02 file set and the Task 02/03 acceptance contract. It adds no file, dependency, probe, fallback, or parallel lane.

## Approach

Task 02 implements five negative fixtures named `wrong-model`, `wrong-effort`, `wrong-template-leaf`, `incomplete-bridge-command`, and `wrong-pointer`. The validator emits exactly one whole-line `PASS self-test: <fixture>` marker after each fixture is rejected, then exactly one `PASS self-test: 5/5 fixtures rejected` summary. Task 02 exports the literal `compatibility-self-test-interface` state. Task 03 consumes and re-verifies it.

## Scenarios

- The current argument-ignoring validator exits zero but emits no fixture markers. The external marker contract rejects it.
- One fixture is missing or a marker is duplicated. Exact whole-line counts reject the output.
- All markers print without real mutations. Execution evaluation inspects the fixture behavior and rejects cosmetic success.

## Validation

Both trusting tasks capture self-test output, require one exact marker for each fixed name, require the exact `5/5` summary, and then run the live validator. Execution evaluation checks that each marker follows a real rejected mutation.

## Trade-offs

The plan fixes the observable interface and leaves fixture construction to the executor. This preserves engineering judgment but retains a Low trust risk until independent Execution evaluation inspects the implementation.

## Open issues

The cosmetic-marker risk remains open at Low/25. It does not change the Planning PASS verdict.

## Related

- [[validator-and-residual-guard-design]] - the original validator design.
- [[contract-five-fixture-self-test]] - the Planning decision.
- [[deterministic-codex-model-policy]] - the exact task contract.
