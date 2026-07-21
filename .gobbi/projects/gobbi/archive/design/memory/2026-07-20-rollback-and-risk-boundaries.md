---
name: rollback-and-risk-boundaries
description: "Defines rollback, unsupported-environment behavior, accepted cost, and preserved runtime controls."
type: design
scope: feature
feature: workflow
status: retired
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [design, verification]
keywords: [rollback, cost, unsupported-model, preservation]
author: codex
related: [deterministic-codex-policy-authorities, plugin-delivery-and-alias-topology]
archived_at: 2026-07-20
archive_reason: retired
---

# Rollback and risk boundaries

## Problem
The policy change spans config, docs, validation, and version metadata, so partial rollback would leave the repository inconsistent.

## Scope
Define recovery and preserved behavior without adding fallback, probes, benchmarking, migrations, or runtime security changes.

## Approach
Before publication, revert all 19 files together and rerun every gate. After publication, ship a synchronized corrective patch rather than decrementing versions.

## Scenarios
Account lacks model access, a validation gate fails, publication already occurred, or cost rises as expected.

## Validation
Check the full coherent diff, version equality, preserved runtime controls, and the complete gate suite.

## Trade-offs
Normal explicit model errors are accepted; no fallback hides availability failures.

## Open issues
The cost magnitude remains unmeasured by user decision.

## Related
- [[accept-unmeasured-xhigh-cost]] — the accepted cost risk.
