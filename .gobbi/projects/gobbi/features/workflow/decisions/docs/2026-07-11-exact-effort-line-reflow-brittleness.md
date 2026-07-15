---
name: exact-effort-line-reflow-brittleness
description: "Accept exact-line classifier coupling for the correct negative effort statement."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [docs-sync, verification]
keywords: [effort, exact-line, reflow, residual-classifier]
author: codex
---

# Co-edit the effort line and classifier

## Context

Claude Risk finding `F-RISK-1` shows that a behavior-neutral reflow of the correct negative
`--effort` statement changes its exact line content and makes the live residual gate fail.

## Decision

Accept the intentional exact-line coupling. Any reflow of that sentence must co-edit the canonical
and alias classifier tuple and rerun the live validator.

## Rationale

The failure is loud and local to a same-owner documentation edit. Exact predicates prevent the more
dangerous whole-file allowlist failure mode.

## Alternatives considered

A whole-file exemption was rejected because a different same-file residual must fail. Silent
normalization was rejected because it would weaken the literal current-policy contract.

## Consequences

Maintainers must treat the sentence and tuple as one co-change. This open Low risk is a known design
trade-off, not a Task 02 correctness failure.

## Related

- [[bare-effort-token-gate-brittleness]] - broader dual-use token maintenance concern.
