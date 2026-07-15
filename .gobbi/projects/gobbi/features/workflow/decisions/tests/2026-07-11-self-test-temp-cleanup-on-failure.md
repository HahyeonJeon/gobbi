---
name: self-test-temp-cleanup-on-failure
description: "Preserve the bounded concern about temporary cleanup after a mid-run self-test failure."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [evaluation, verification]
keywords: [self-test, temp-dir, cleanup, set-e]
author: codex
---

# Preserve cleanup after self-test failure

## Context

The current Claude Overall file retains original Structure finding `F-STRUCT-1`: the `mktemp`
directory may leak after a mid-run self-test failure because cleanup uses a RETURN trap under
`set -e`. The retry overwrote the original Structure file, so no additional detail is inferred.

## Decision

Record the bounded cleanup concern as open. Keep source behavior unchanged in RECORD and require a
future validator edit to stress an early fixture failure while checking the temporary root is gone.

## Rationale

Successful and several failing stress runs leave source clean, and the concern is temporary local
test data rather than product state. It is therefore Low and non-gating.

## Alternatives considered

Changing the frozen Task 02 commit during RECORD was rejected. Claiming the original finding was
fully addressed without its overwritten perspective evidence was also rejected.

## Consequences

The cleanup path remains a documented hardening point. No backlog is created because the evaluator
did not defer a product risk and the current task passed.

## Related

- [[policy-docs-and-validator-adversarial-review]] - review explaining the mixed Claude set.
