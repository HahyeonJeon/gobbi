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

A Codex Consistency evaluation flagged that the illustrative example in the Step 2.5 specification uses `Domain=\`testing\`` as an example of a `general`-Type finding, while the canonical Domain value defined in `evaluation/SKILL.md` is `test` (without the `-ing` suffix). The mismatch is in an illustrative example only, not in normative routing rules or the classification table — the active routing logic delegates to the canonical Domain table in `evaluation/SKILL.md`, so the incorrect example does not break runtime behavior. The finding was Low severity, below the REVISE threshold.

## Decision

Defer the fix to the Execution loop as a one-word micro-edit (`testing` → `test`) rather than re-opening the Ideation draft for a REVISE round.

## Rationale

The mismatch is illustrative-only and Low severity, and the fix is a single-word edit in one location — disproportionate to a full REVISE round. Deferring it to a Planning/Execution micro-fix keeps the Ideation draft stable while still correcting the example before it ships.

## Alternatives considered

- **Re-open the Ideation draft for a REVISE round to fix the example.** Rejected: a one-word illustrative-only correction does not justify a REVISE iteration.
- **Leave the example as `testing`.** Rejected: even though it does not break routing, an example that disagrees with the canonical Domain vocabulary misleads a future reader.

## Consequences

The example was corrected in the Execution loop: `Domain=\`testing\`` → `Domain=\`test\`` in the `evaluation/SKILL.md` example text. The canonical Domain table remains the single source of truth for routing.

## Related

- `evaluation/SKILL.md` — the canonical `test` Domain definition the example must match.
- `design/wrap-up-step-2-5-compliance-check.md` — the Step 2.5 specification that carried the example.
