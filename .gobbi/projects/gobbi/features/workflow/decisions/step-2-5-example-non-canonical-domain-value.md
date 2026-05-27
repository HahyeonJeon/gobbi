---
name: step-2-5-example-non-canonical-domain-value
description: Step 2.5 illustrative example uses `testing` instead of canonical domain value `test` — decision to defer micro-fix to Execution.
type: decisions
scope: feature
feature: workflow
status: deferred
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [wrap-up, step-2-5, domain-value, docs-sync]
domain: docs-sync
supersedes: null
superseded_by: null
decision_status: accepted
---

# Step 2.5 example uses non-canonical domain value `testing`

## Context

Finding from Codex Consistency evaluation. Low severity. Did not require REVISE — below threshold. Preserved for Planning/Execution to address in the Bundle A docs pass.

## Decision

The illustrative example in Design D / Step 2.5 specification uses `Domain=\`testing\`` as an example of a `general`-Type finding. The canonical Domain value defined in `evaluation/SKILL.md:403` is `test` (without the `-ing` suffix).

The mismatch is in an illustrative example, not in normative routing rules or the classification table. The active routing logic delegates to the canonical Domain table at `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` (line 356), so the incorrect example does not break runtime behavior.

## Rationale for deferral

The example was introduced in iter2's vocabulary-repair paragraph and survived iter3's mechanical repair pass. Changing it requires a one-word edit (`testing` → `test`) in one location. This is appropriate as a Planning/Execution micro-fix rather than an Ideation REVISE round. The Low severity and illustrative-only nature of the mismatch are the basis for deferral.

## Resolution

Addressed in Execution Task 05 (T05 — COD-CONS-003 micro-fix): `Domain=\`testing\`` → `Domain=\`test\`` in the evaluation/SKILL.md example text.

## Related

- COD-CONS-003 in `evaluation/iter3/codex/consistency.md`
- `evaluation/SKILL.md:403` — canonical `test` Domain definition
- Design D specification, iter3 line 482
