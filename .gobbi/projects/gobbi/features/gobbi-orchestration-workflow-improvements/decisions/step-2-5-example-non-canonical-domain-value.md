---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
status: deferred
feature: gobbi-orchestration-workflow-improvements
supersedes: null
superseded_by: null
mistake-candidate: false
domain: docs-sync
severity: low
disposition: open
finding-id: COD-CONS-003
loop: ideation
iter: 3
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/decisions/step-2-5-example-non-canonical-domain-value.md
promoted-at: 2026-05-23T14:00:00Z
---

# Deferred Risk: Step 2.5 Illustrative Example Uses Non-Canonical Domain Value `testing`

## Context

Finding COD-CONS-003 from Codex iter3 Consistency evaluation. Low severity, disposition open. Did not require REVISE — below threshold. Preserved for Planning/Execution to address in the Bundle A docs pass.

## Decision

The illustrative example in Design D / Step 2.5 specification (iter3 line 482) uses `Domain=\`testing\`` as an example of a `general`-Type finding. The canonical Domain value defined in `evaluation/SKILL.md:403` is `test` (without the `-ing` suffix).

The mismatch is in an illustrative example, not in normative routing rules or the classification table. The active routing logic delegates to the canonical Domain table at `evaluation/SKILL.md § Complete Domain → staging destination routing (general Type)` (line 356), so the incorrect example does not break runtime behavior.

## Rationale for deferral

The example was introduced in iter2's vocabulary-repair paragraph and survived iter3's mechanical repair pass. Changing it requires a one-word edit (`testing` → `test`) in one location. This is appropriate as a Planning/Execution micro-fix rather than an Ideation REVISE round. The Low severity and illustrative-only nature of the mismatch are the basis for deferral.

## Resolution

Addressed in Execution Task 05 (T05 — COD-CONS-003 micro-fix): `Domain=\`testing\`` → `Domain=\`test\`` in the evaluation/SKILL.md example text.

## Related

- COD-CONS-003 in `evaluation/iter3/codex/consistency.md`
- `evaluation/SKILL.md:403` — canonical `test` Domain definition
- Design D specification, iter3 line 482
