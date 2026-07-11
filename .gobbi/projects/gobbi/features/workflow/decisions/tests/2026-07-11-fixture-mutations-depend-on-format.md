---
name: fixture-mutations-depend-on-format
description: "Keep self-test mutation formats synchronized with their policy source files."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [evaluation, verification]
keywords: [self-test, fixture-format, mutation-fidelity]
author: codex
---

# Keep fixture mutation formats synchronized

## Context

Claude retry Structure finding `F-STRUCT-2` notes that four fixture mutations rely on current
JSON, TOML, or Markdown byte shapes. All formats match today, but a future reformat could make a
mutation a no-op.

## Decision

Keep the current literal mutations and require any source-format edit to rerun all five fixtures,
including their accepted-mutation and exact-rejection-reason checks.

## Rationale

The literal mutations are small and readable. Their expected-reason checks are strong when the
mutation lands, and the current source shapes are proven.

## Alternatives considered

Adding a parser-driven mutation framework was rejected as unnecessary complexity for five fixed
fixtures. Ignoring mutation fidelity was rejected because it could let a fixture test nothing.

## Consequences

Source reformatting and fixture mutations remain a required co-edit. The open Low risk does not
invalidate the current 5/5 executable proof.

## Related

- [[policy-docs-and-validator-adversarial-review]] - review carrying the source finding.
