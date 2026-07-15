---
name: bare-effort-token-gate-brittleness
description: "Accept the maintenance coupling of a body-wide dual-use effort token gate."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [evaluation, verification]
keywords: [effort-token, residual-gate, false-failure]
author: codex
---

# Keep the bare effort token gate explicit

## Context

Claude retry Structure finding `F-STRUCT-1` observed that the residual classifier scans the
dual-use `--effort` token body-wide. The current legitimate negative statement is exact-line
classified, but a different future legitimate mention would fail until classified.

## Decision

Accept the loud maintenance coupling for the current policy. Treat any new legitimate use as a
validator-and-doc co-edit, and prefer a structural invocation check if legitimate prose uses grow.

## Rationale

The current tree is clean and the exact negative statement is intentional. A loud false failure is
safer than allowing invalid standalone-option teaching to pass silently.

## Alternatives considered

A whole-file allowlist was rejected because it would hide same-file residuals. Removing the gate
was rejected because the unsupported standalone option is a known policy drift form.

## Consequences

Future legitimate `--effort` prose may require classifier maintenance. The open Medium assumption
risk does not block Task 02's current exact policy.

## Related

- [[exact-effort-line-reflow-brittleness]] - narrower exact-line reflow coupling.
- [[policy-docs-and-validator-adversarial-review]] - review carrying the source finding.
