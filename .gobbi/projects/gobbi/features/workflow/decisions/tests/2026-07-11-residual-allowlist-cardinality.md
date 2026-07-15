---
name: residual-allowlist-cardinality
description: "Record that exact allowed residual lines are not occurrence-count checked."
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-11
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [evaluation, verification]
keywords: [residual-allowlist, cardinality, identical-line]
author: codex
---

# Keep residual occurrence cardinality explicit

## Context

Codex Risk `CDEX-E2-RISK-001` and Overall `CDEX-E2-OVR-001` describe the same limitation: a second
byte-identical allowed line in the same path passes because membership is keyed by path and line
content, not occurrence count.

## Decision

Deduplicate both finding IDs into this one assumption note. Accept the specified exact path and
line-content predicate for Task 02; consider an occurrence baseline only if exact duplicates become
a realistic policy-drift form.

## Rationale

The locked task requires exact path-plus-line predicates and rejection of a new different line in
an allowlisted carrier. Both properties are proven. Cardinality would be additional hardening, not
a missing contract requirement.

## Alternatives considered

Treating the two evaluator IDs as separate risks was rejected because their evidence and remedy are
identical. Adding cardinality logic during RECORD was rejected as source mutation beyond the frozen
PASS commit.

## Consequences

An exact duplicate allowed residual can pass. Any different line, different path, or other policy
residual still fails. The Low open limitation does not create a backlog.

## Related

- [[policy-docs-and-validator-adversarial-review]] - dual-system review that reproduced the limit.
